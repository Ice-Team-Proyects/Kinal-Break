import React, { useEffect, useState } from "react";
import { useMenuStore } from "../store/menuStore";
import { useCartStore } from "../../cart/store/cartStore";
import { Search, Plus, Image as ImageIcon, Clock, Check, X } from "lucide-react";
import toast from "react-hot-toast";

// Hora válida para desayunos/almuerzos: 10:00 AM – 3:00 PM
function isOrderingAllowed(category) {
  const mealCategories = ["desayunos", "almuerzos"];
  if (!mealCategories.includes(category)) return true; // bebidas/snacks sin restricción de hora
  const now = new Date();
  const total = now.getHours() * 60 + now.getMinutes();
  return total >= 10 * 60 && total < 15 * 60; // 10:00 - 15:00
}

export function MenuPage() {
  const { products, isLoading, fetchProducts } = useMenuStore();
  const { addToCart } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // States for accompaniment modal (similar to client-admin)
  const [orderProduct, setOrderProduct] = useState(null);
  const [selectedAcomp, setSelectedAcomp] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [orderConfirmOpen, setOrderConfirmOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    useCartStore.getState().fetchCart();
  }, []);

  const categories = [
    { value: "", label: "Todos" },
    { value: "desayunos", label: "Desayunos" },
    { value: "almuerzos", label: "Almuerzos" },
    { value: "bebidas", label: "Bebidas" },
    { value: "snacks", label: "Snacks" },
    { value: "complementos", label: "Complementos" }
  ];

  const filteredProducts = products.filter((p) => {
    // Si la categoría seleccionada es vacía (Todos), excluimos los complementos para no mostrarlos como platos principales de Q0.00
    const matchesCategory = selectedCategory
      ? p.category === selectedCategory
      : p.category !== "complementos";
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const getAccompanimentOptions = (product) => {
    if (!product.allowAccompaniments || !product.accompaniments?.length) return [];
    return product.accompaniments
      .map((a) => (typeof a === "object" ? a : products.find((p) => p._id === a)))
      .filter(Boolean);
  };

  const handleOrderClick = (product) => {
    if (!isOrderingAllowed(product.category)) {
      toast.error(
        `Los ${product.category} solo se pueden pedir entre 10:00 a.m. y 3:00 p.m.`,
        { icon: "🕙", duration: 4000 }
      );
      return;
    }

    const accompaniments = getAccompanimentOptions(product);
    if (product.allowAccompaniments && accompaniments.length > 0) {
      setOrderProduct(product);
      setSelectedAcomp(null);
      setOrderConfirmOpen(true);
    } else {
      addToCart(product._id, 1);
    }
  };

  const handleConfirmOrder = async () => {
    if (!orderProduct) return;
    setIsAddingToCart(true);
    try {
      await addToCart(orderProduct._id, 1, selectedAcomp || undefined);
      setOrderConfirmOpen(false);
      setOrderProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-black text-[#031633] uppercase font-display tracking-wide">
            Menú de Cafetería
          </h2>
          <p className="text-xs font-bold text-[#ff8928] uppercase tracking-wide">
            Elige tus productos y arma tu orden
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-white border-2 border-[#031633] rounded-xl px-3 py-1.5 shadow-[2px_2px_0_0_#031633] text-[9px] font-black text-[#031633] uppercase shrink-0">
          <Clock size={12} className="text-[#ff8928]" />
          Comidas: 10:00 a.m. – 3:00 p.m.
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar antojo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border-2 border-[#031633] font-bold text-xs focus:outline-none input-focus-animation"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#031633]">
          <Search size={16} />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedCategory(c.value)}
            className={`px-4 py-2 text-[10px] font-black uppercase rounded-xl border-2 border-[#031633] transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === c.value
                ? "bg-[#ff8928] text-white shadow-[2px_2px_0_0_#031633]"
                : "bg-white text-[#031633]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 font-bold text-[#031633] text-sm">
          Cargando menú...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 font-bold text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-xs">
          No hay productos disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] overflow-hidden flex flex-col transition-all relative"
            >
              {/* Accompaniment badge */}
              {p.allowAccompaniments && getAccompanimentOptions(p).length > 0 && (
                <span className="absolute top-4 left-4 bg-[#ff8928] text-white font-black text-[10px] uppercase border-2 border-[#031633] px-2.5 py-1 rounded-full z-10 shadow-[2px_2px_0_0_#031633]">
                  + Acompañamiento
                </span>
              )}

              {/* Image */}
              <div className="h-48 border-b-2 border-[#031633] bg-[#efedf0] relative overflow-hidden flex items-center justify-center">
                {p.photo ? (
                  <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={48} className="text-slate-400" />
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#ff8928] tracking-widest">
                    {p.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#031633] uppercase mt-1 line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#031633]/70 font-semibold mt-2 line-clamp-2 h-8">
                    {p.description || "Delicioso y fresco para el receso."}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t-2 border-[#efedf0] flex items-center justify-between">
                  <span className="text-2xl font-black text-[#031633]">
                    Q{p.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleOrderClick(p)}
                    className="bg-[#ff8928] hover:bg-[#ff9d47] text-white p-2.5 rounded-xl border-2 border-[#031633] shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633] transition-all cursor-pointer flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =================== Modal de Confirmación y Selección de Acompañamiento =================== */}
      {orderConfirmOpen && orderProduct && (
        <div className="fixed inset-0 bg-[#031633]/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border-2 border-[#031633] shadow-[8px_8px_0_0_#031633] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 bg-[#f5f3f6] border-b-2 border-[#031633] flex justify-between items-center">
              <h2 className="text-lg font-black text-[#031633] uppercase tracking-wider">
                Elige tu Acompañamiento
              </h2>
              <button
                onClick={() => setOrderConfirmOpen(false)}
                className="text-[#031633] hover:text-[#ff8928] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-2 border-[#031633] overflow-hidden bg-[#efedf0] shrink-0">
                  {orderProduct.photo ? (
                    <img
                      src={orderProduct.photo}
                      alt={orderProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={24} className="text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-[#ff8928] tracking-widest">
                    {orderProduct.category}
                  </p>
                  <p className="font-extrabold text-sm text-[#031633] uppercase">
                    {orderProduct.name}
                  </p>
                  <p className="text-base font-black text-[#031633]">
                    Q{orderProduct.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-[#031633] uppercase mb-3 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#ff8928] text-white flex items-center justify-center text-[9px] font-black">
                    +
                  </span>
                  Acompañamiento <span className="text-[#031633]/50 font-semibold lowercase">(gratis)</span>
                </p>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {getAccompanimentOptions(orderProduct).map((acomp) => (
                    <button
                      key={acomp._id}
                      onClick={() =>
                        setSelectedAcomp(selectedAcomp === acomp._id ? null : acomp._id)
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                        selectedAcomp === acomp._id
                          ? "border-[#ff8928] bg-[#fff4ea] text-[#031633] shadow-[2px_2px_0_0_#ff8928]"
                          : "border-[#031633]/20 bg-[#f5f3f6] text-[#031633] hover:border-[#031633]"
                      }`}
                    >
                      <span>{acomp.name}</span>
                      {selectedAcomp === acomp._id && (
                        <Check size={14} className="text-[#ff8928]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setOrderConfirmOpen(false)}
                  className="flex-1 bg-white border-2 border-[#031633] text-[#031633] font-black py-3 rounded-2xl cursor-pointer hover:bg-[#efedf0] text-xs uppercase"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={isAddingToCart}
                  className="flex-1 bg-[#ff8928] hover:bg-[#ff9d47] text-white border-2 border-[#031633] font-black py-3 rounded-2xl shadow-[2px_2px_0_0_#031633] cursor-pointer text-xs uppercase flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {isAddingToCart ? "Agregando..." : "Agregar al Carrito"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
