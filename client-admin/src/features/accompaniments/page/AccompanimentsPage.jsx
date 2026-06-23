import React, { useEffect, useState } from 'react';
import { useAccompanimentsStore } from '../store/accompanimentsStore';
import { Plus, Edit2, Trash2, RotateCcw, X, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function AccompanimentsPage() {
  const { accompaniments, isLoading, fetchAccompaniments, createAccompaniment, updateAccompaniment, deleteAccompaniment, restoreAccompaniment } = useAccompanimentsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const { register, handleSubmit, reset, watch } = useForm();
  const photoFile = watch('photo');

  useEffect(() => {
    fetchAccompaniments();
  }, []);

  useEffect(() => {
    if (photoFile && photoFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(photoFile[0]);
    }
  }, [photoFile]);

  const handleOpenAddModal = () => {
    setEditingAcc(null);
    setImagePreview('');
    reset({
      name: '',
      price: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (acc) => {
    setEditingAcc(acc);
    setImagePreview(acc.photo || '');
    reset({
      name: acc.name,
      price: acc.price
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price || 0);
    
    if (data.photo && data.photo[0]) {
      formData.append('photo', data.photo[0]);
    }

    let success;
    if (editingAcc) {
      success = await updateAccompaniment(editingAcc._id, formData);
    } else {
      success = await createAccompaniment(formData);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del módulo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#031633] uppercase font-display tracking-wider">Acompañamientos</h1>
          <p className="text-sm font-bold text-[#ff8928] uppercase tracking-wide">Administra los acompañamientos o extras (bebidas, papas, etc.)</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black px-6 py-3 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#031633] transition-all flex items-center gap-2 uppercase text-sm cursor-pointer"
        >
          <Plus size={18} /> Agregar Acompañamiento
        </button>
      </div>

      {/* Grid de Acompañamientos */}
      {isLoading ? (
        <div className="text-center py-12 font-bold text-[#031633]">Cargando acompañamientos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {accompaniments.map((acc) => (
            <div
              key={acc._id}
              className={`bg-white rounded-3xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] overflow-hidden flex flex-col transition-all relative ${
                !acc.isActive || acc.isDeleted ? 'opacity-70 bg-slate-50' : ''
              }`}
            >
              {/* Tag de Desactivado */}
              {(acc.isDeleted || !acc.isActive) && (
                <span className="absolute top-4 left-4 bg-[#7d0a42] text-white font-black text-[10px] uppercase border-2 border-[#031633] px-2.5 py-1 rounded-full z-10 shadow-[2px_2px_0_0_#031633]">
                  Desactivado
                </span>
              )}

              {/* Imagen */}
              <div className="h-40 border-b-2 border-[#031633] bg-[#efedf0] relative overflow-hidden flex items-center justify-center">
                {acc.photo ? (
                  <img src={acc.photo} alt={acc.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={40} className="text-slate-400" />
                )}
              </div>

              {/* Contenido */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-[#031633] uppercase mt-1 line-clamp-1">{acc.name}</h3>
                </div>

                <div className="mt-4 pt-4 border-t-2 border-[#efedf0] flex items-center justify-between">
                  <span className="text-xl font-black text-[#031633]">Q{acc.price.toFixed(2)}</span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(acc)}
                      className="p-2 bg-white border-2 border-[#031633] rounded-xl hover:bg-[#efedf0] transition-colors text-[#031633] cursor-pointer shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633]"
                      title="Editar"
                    >
                      <Edit2 size={12} />
                    </button>
                    {acc.isDeleted ? (
                      <button
                        onClick={() => restoreAccompaniment(acc._id)}
                        className="p-2 bg-emerald-400 border-2 border-[#031633] rounded-xl hover:bg-emerald-500 transition-colors text-white cursor-pointer shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633]"
                        title="Restaurar"
                      >
                        <RotateCcw size={12} />
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteAccompaniment(acc._id)}
                        className="p-2 bg-[#7d0a42] border-2 border-[#031633] rounded-xl hover:bg-red-800 transition-colors text-white cursor-pointer shadow-[2px_2px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#031633]"
                        title="Desactivar"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Agregar / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#031633]/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-[#031633] shadow-[8px_8px_0_0_#031633] w-full max-w-md overflow-hidden">
            <div className="p-6 bg-[#f5f3f6] border-b-2 border-[#031633] flex justify-between items-center">
              <h2 className="text-xl font-black text-[#031633] uppercase font-display tracking-wider">
                {editingAcc ? 'Editar Acompañamiento' : 'Nuevo Acompañamiento'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#031633] hover:text-[#ff8928] transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-[#031633] uppercase">Nombre</label>
                <input
                  type="text"
                  required
                  {...register('name')}
                  className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-[#031633] uppercase">Precio Extra (Q)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price')}
                  className="px-4 py-3 bg-[#f5f3f6] rounded-2xl border-2 border-[#031633] font-bold text-sm focus:outline-none input-focus-animation"
                />
              </div>

              {/* Imagen con Preview */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-[#031633] uppercase">Foto</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl border-2 border-[#031633] bg-[#f5f3f6] flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-slate-400" />
                    )}
                  </div>
                  <label className="flex-1 px-4 py-3 bg-white border-2 border-[#031633] border-dashed rounded-2xl cursor-pointer hover:bg-[#f5f3f6] transition-colors flex items-center justify-center font-bold text-xs text-[#031633]/60 gap-2">
                    <ImageIcon size={14} /> Subir Imagen
                    <input type="file" accept="image/*" {...register('photo')} className="hidden" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff8928] hover:bg-[#ff9d47] text-white font-black py-4 rounded-2xl border-2 border-[#031633] shadow-[4px_4px_0_0_#031633] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#031633] transition-all uppercase tracking-wider text-sm cursor-pointer mt-4"
              >
                {editingAcc ? 'Guardar Cambios' : 'Crear Acompañamiento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
