import { useEffect, useState } from 'react';
import { useProductsStore } from '../store/productsStore';
import { Plus, Search, Edit2, Trash2, RotateCcw, X, Image as ImageIcon, ShoppingCart, Clock, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../auth/store/authStore';
import { agregarAlCarritoRequest, confirmarPedidoRequest } from '../../../shared/api/adminApi';
import toast from 'react-hot-toast';

// Hora válida para desayunos/almuerzos: 10:00 AM – 3:00 PM
function isOrderingAllowed(category) {
  const mealCategories = ['desayunos', 'almuerzos'];
  if (!mealCategories.includes(category)) return true; // bebidas/snacks sin restricción de hora
  const now = new Date();
  const total = now.getHours() * 60 + now.getMinutes();
  return total >= 10 * 60 && total < 15 * 60; // 10:00 - 15:00
}

export function ProductsPage() {
  const { products, isLoading, fetchProducts, createProduct, updateProduct, deleteProduct, restoreProduct } = useProductsStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN_ROLE';
  const isUser  = user?.role === 'USER_ROLE';

  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // USER_ROLE: ordering state
  const [orderProduct, setOrderProduct] = useState(null); // product to order
  const [selectedAcomp, setSelectedAcomp] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderConfirmOpen, setOrderConfirmOpen] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();
  const photoFile = watch('photo');
  const watchAllowAccompaniments = watch('allowAccompaniments');
  const watchCategory = watch('category');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (photoFile && photoFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(photoFile[0]);
    }
  }, [photoFile]);

  const onFilterChange = (cat) => {
    setCategoryFilter(cat);
    useProductsStore.getState().setFilters({ category: cat, search: searchQuery });
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    useProductsStore.getState().setFilters({ category: categoryFilter, search: searchQuery });
  };

  // Admin modal handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setImagePreview('');
    reset({ name: '', description: '', price: '', category: 'almuerzos', allowAccompaniments: false, accompaniments: [] });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setImagePreview(product.photo || '');
    reset({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      allowAccompaniments: product.allowAccompaniments || false,
      accompaniments: product.accompaniments?.map(a => a._id || a) || []
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const isMeal = data.category === 'desayunos' || data.category === 'almuerzos';
    const allowAcc = isMeal ? data.allowAccompaniments : false;

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.category === 'complementos' ? 0 : data.price);
    formData.append('category', data.category);
    formData.append('allowAccompaniments', allowAcc);
    if (data.photo && data.photo[0]) formData.append('photo', data.photo[0]);
    if (isMeal && data.accompaniments) {
      data.accompaniments.forEach((accId) => formData.append('accompaniments[]', accId));
    }
    const success = editingProduct
      ? await updateProduct(editingProduct._id, formData)
      : await createProduct(formData);
    if (success) setIsModalOpen(false);
  };

  // USER_ROLE ordering flow
  const handleOrderClick = (product) => {
    if (!isOrderingAllowed(product.category)) {
      toast.error(
        `Los ${product.category} solo se pueden pedir entre 10:00 a.m. y 3:00 p.m.`,
        { icon: '🕙', duration: 4000 }
      );
      return;
    }
    setOrderProduct(product);
    setSelectedAcomp(null);
    setOrderConfirmOpen(true);
  };

  const handleConfirmOrder = async () => {
    if (!orderProduct) return;
    setIsOrdering(true);
    try {
      await agregarAlCarritoRequest({
        productoId: orderProduct._id,
        cantidad: 1,
        acompanamientoId: selectedAcomp || undefined
      });
      await confirmarPedidoRequest();
      toast.success(`¡Pedido de ${orderProduct.name} confirmado! 🎉`);
      setOrderConfirmOpen(false);
      setOrderProduct(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al hacer el pedido');
    } finally {
      setIsOrdering(false);
    }
  };

  // Accompaniments for a product = products that are referenced in product.accompaniments[]
  const getAccompanimentOptions = (product) => {
    if (!product.allowAccompaniments || !product.accompaniments?.length) return [];
    return product.accompaniments.map(a => (typeof a === 'object' ? a : products.find(p => p._id === a))).filter(Boolean);
  };

  const categories = [
    { value: '', label: 'Todos' },
    { value: 'desayunos', label: 'Desayunos' },
    { value: 'almuerzos', label: 'Almuerzos' },
    { value: 'bebidas', label: 'Bebidas' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'complementos', label: 'Complementos' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#031633] uppercase font-display tracking-wider">
            {isAdmin ? 'Gestión de Productos' : 'Menú de la Cafetería'}
          </h1>
          <p className="text-sm font-bold text-[#ff8928] uppercase tracking-wide">
            {isAdmin ? 'Administra el menú de la cafetería escolar' : 'Elige tu pedido y selecciona un acompañamiento'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black px-6 py-3 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#031633] transition-all flex items-center gap-2 uppercase text-sm cursor-pointer"
          >
            <Plus size={18} /> Agregar Producto
          </button>
        )}
        {/* Horario de pedidos for USER_ROLE */}
        {isUser && (
          <div className="flex items-center gap-2 bg-white border-2 border-[#031633] rounded-2xl px-4 py-2 shadow-[2px_2px_0_0_#031633] text-xs font-black text-[#031633] uppercase">
            <Clock size={14} className="text-[#ff8928]" />
            Desayunos / Almuerzos: 10:00 a.m. – 3:00 p.m.
          </div>
        )}
      </div>

      {/* Search + Filters */}
      <div className="bg-white p-5 rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] flex flex-col md:flex-row justify-between items-center gap-4">
        <form onSubmit={onSearchSubmit} className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation"
          />
          <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#031633] hover:text-[#ff8928]">
            <Search size={18} />
          </button>
        </form>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onFilterChange(cat.value)}
              className={`px-4 py-2 text-xs font-black uppercase rounded-xl border-2 border-[#031633] transition-all cursor-pointer ${
                categoryFilter === cat.value
                  ? 'bg-[#ff8928] text-white shadow-[2px_2px_0_0_#031633]'
                  : 'bg-white text-[#031633] hover:bg-[#f5f3f6]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12 font-bold text-[#031633]">Cargando catálogo...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products
            .filter(p => isUser ? (p.isActive && !p.isDeleted) : true) // USER_ROLE only sees active
            .map((product) => (
            <div
              key={product._id}
              className={`bg-white rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] overflow-hidden flex flex-col transition-all relative ${
                !product.isActive || product.isDeleted ? 'opacity-70 bg-slate-50' : ''
              }`}
            >
              {/* Disabled tag (ADMIN only sees this) */}
              {isAdmin && (product.isDeleted || !product.isActive) && (
                <span className="absolute top-4 left-4 bg-[#7d0a42] text-white font-black text-[10px] uppercase border-2 border-[#031633] px-2.5 py-1 rounded-full z-10 shadow-[2px_2px_0_0_#031633]">
                  Desactivado
                </span>
              )}

              {/* Accompaniment badge for USER_ROLE */}
              {isUser && product.allowAccompaniments && product.accompaniments?.length > 0 && (
                <span className="absolute top-4 left-4 bg-[#ff8928] text-white font-black text-[10px] uppercase border-2 border-[#031633] px-2.5 py-1 rounded-full z-10 shadow-[2px_2px_0_0_#031633]">
                  + Acompañamiento
                </span>
              )}

              {/* Image */}
              <div className="h-48 border-b-2 border-[#031633] bg-[#efedf0] relative overflow-hidden flex items-center justify-center">
                {product.photo ? (
                  <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={48} className="text-slate-400" />
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#ff8928] tracking-widest">{product.category}</span>
                  <h3 className="text-lg font-extrabold text-[#031633] uppercase mt-1 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-[#031633]/70 font-semibold mt-2 line-clamp-2 h-8">
                    {product.description || 'Sin descripción disponible.'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t-2 border-[#efedf0] flex items-center justify-between">
                  <span className="text-2xl font-black text-[#031633]">Q{product.price.toFixed(2)}</span>

                  {/* ADMIN_ROLE: Edit/Delete buttons */}
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-2.5 bg-white border-2 border-[#031633] rounded-xl hover:bg-[#efedf0] transition-colors text-[#031633] cursor-pointer shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633]"
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>
                      {product.isDeleted ? (
                        <button
                          onClick={() => restoreProduct(product._id)}
                          className="p-2.5 bg-emerald-400 border-2 border-[#031633] rounded-xl hover:bg-emerald-500 transition-colors text-white cursor-pointer shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633]"
                          title="Restaurar"
                        >
                          <RotateCcw size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="p-2.5 bg-[#7d0a42] border-2 border-[#031633] rounded-xl hover:bg-red-800 transition-colors text-white cursor-pointer shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633]"
                          title="Desactivar"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* USER_ROLE: Order button */}
                  {isUser && (
                    <button
                      onClick={() => handleOrderClick(product)}
                      className="flex items-center gap-2 bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black px-4 py-2 rounded-xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633] text-xs uppercase cursor-pointer transition-all"
                    >
                      <ShoppingCart size={14} />
                      Pedir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =================== ADMIN: Add/Edit Product Modal =================== */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 bg-[#031633]/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-[#031633] shadow-[8px_8px_0_0_#031633] w-full max-w-lg overflow-hidden my-8">
            <div className="p-6 bg-[#f5f3f6] border-b-2 border-[#031633] flex justify-between items-center">
              <h2 className="text-xl font-black text-[#031633] uppercase font-display tracking-wider">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#031633] hover:text-[#ff8928] transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-[#031633] uppercase">Nombre del Producto</label>
                <input type="text" required {...register('name')} className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {watchCategory !== 'complementos' ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-[#031633] uppercase">Precio (Q)</label>
                    <input type="number" step="0.01" required {...register('price')} className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-[#031633] uppercase">Precio (Q)</label>
                    <div className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-dashed border-[#031633]/30 font-bold text-sm text-[#ff8928] uppercase select-none flex items-center justify-center h-[46px]">
                      Incluido en Almuerzo/Desayuno
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-[#031633] uppercase">Categoría</label>
                  <select {...register('category')} className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation cursor-pointer">
                    <option value="desayunos">Desayunos</option>
                    <option value="almuerzos">Almuerzos</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="snacks">Snacks</option>
                    <option value="complementos">Complementos</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-[#031633] uppercase">Descripción</label>
                <textarea {...register('description')} className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation h-20 resize-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-[#031633] uppercase">Foto del Producto</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border-2 border-[#031633] bg-[#f5f3f6] flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-slate-400" />}
                  </div>
                  <label className="flex-1 px-4 py-3 bg-white border-2 border-[#031633] border-dashed rounded-2xl cursor-pointer hover:bg-[#f5f3f6] transition-colors flex items-center justify-center font-bold text-xs text-[#031633]/60 gap-2">
                    <ImageIcon size={16} /> Subir Imagen
                    <input type="file" accept="image/*" {...register('photo')} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Accompaniments — now selects from other Products */}
              {(watchCategory === 'desayunos' || watchCategory === 'almuerzos') && (
                <>
                  <div className="flex items-center gap-3 py-2 border-t border-b border-slate-100">
                    <input type="checkbox" id="allowAccompaniments" {...register('allowAccompaniments')} className="w-4 h-4 rounded text-[#ff8928] border-2 border-[#031633] focus:ring-0 cursor-pointer" />
                    <label htmlFor="allowAccompaniments" className="text-xs font-black text-[#031633] uppercase cursor-pointer">
                      Permite acompañamientos (sin costo extra)
                    </label>
                  </div>

                  {watchAllowAccompaniments && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-[#031633] uppercase">Selecciona productos como acompañamientos</label>
                      <div className="grid grid-cols-2 gap-2 bg-[#f5f3f6] p-4 rounded-2xl border-2 border-[#031633] max-h-36 overflow-y-auto">
                        {products
                          .filter(p => p.isActive && !p.isDeleted && p._id !== editingProduct?._id)
                          .map((p) => (
                          <label key={p._id} className="flex items-center gap-2 text-xs font-bold text-[#031633] cursor-pointer">
                            <input type="checkbox" value={p._id} {...register('accompaniments')} className="w-3.5 h-3.5 rounded text-[#ff8928] border-2 border-[#031633] focus:ring-0" />
                            {p.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <button type="submit" className="w-full bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black py-4 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#031633] transition-all uppercase tracking-wider text-sm cursor-pointer mt-4">
                {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =================== USER_ROLE: Order Confirmation Modal =================== */}
      {isUser && orderConfirmOpen && orderProduct && (
        <div className="fixed inset-0 bg-[#031633]/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border-2 border-[#031633] shadow-[8px_8px_0_0_#031633] w-full max-w-sm overflow-hidden">
            <div className="p-5 bg-[#f5f3f6] border-b-2 border-[#031633] flex justify-between items-center">
              <h2 className="text-lg font-black text-[#031633] uppercase tracking-wider">Confirmar Pedido</h2>
              <button onClick={() => setOrderConfirmOpen(false)} className="text-[#031633] hover:text-[#ff8928] cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Product summary */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-2 border-[#031633] overflow-hidden bg-[#f5f3f6] shrink-0">
                  {orderProduct.photo ? <img src={orderProduct.photo} alt={orderProduct.name} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-slate-400" />}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-[#ff8928] tracking-widest">{orderProduct.category}</p>
                  <p className="font-extrabold text-[#031633] uppercase">{orderProduct.name}</p>
                  <p className="text-xl font-black text-[#031633]">Q{orderProduct.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Accompaniment selection */}
              {orderProduct.allowAccompaniments && getAccompanimentOptions(orderProduct).length > 0 && (
                <div>
                  <p className="text-xs font-black text-[#031633] uppercase mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#ff8928] text-white flex items-center justify-center text-[10px] font-black">+</span>
                    Elige tu acompañamiento <span className="text-[#031633]/50 font-semibold lowercase">(gratis)</span>
                  </p>
                  <div className="space-y-2">
                    {getAccompanimentOptions(orderProduct).map(acomp => (
                      <button
                        key={acomp._id}
                        onClick={() => setSelectedAcomp(selectedAcomp === acomp._id ? null : acomp._id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                          selectedAcomp === acomp._id
                            ? 'border-[#ff8928] bg-[#fff4ea] text-[#031633] shadow-[2px_2px_0_0_#ff8928]'
                            : 'border-[#031633]/20 bg-[#f5f3f6] text-[#031633] hover:border-[#031633]'
                        }`}
                      >
                        <span>{acomp.name}</span>
                        {selectedAcomp === acomp._id && <Check size={16} className="text-[#ff8928]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setOrderConfirmOpen(false)}
                  className="flex-1 bg-white border-2 border-[#031633] text-[#031633] font-black py-3 rounded-2xl cursor-pointer hover:bg-[#efedf0] text-sm uppercase"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={isOrdering}
                  className="flex-1 bg-[#ff8928] hover:bg-[#ff9d47] text-white border-2 border-[#031633] font-black py-3 rounded-2xl shadow-[2px_2px_0_0_#031633] cursor-pointer text-sm uppercase flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isOrdering ? 'Pidiendo...' : <><ShoppingCart size={16} /> Pedir Ahora</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
