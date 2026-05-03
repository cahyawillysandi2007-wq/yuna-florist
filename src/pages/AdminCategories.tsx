import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types';
import { cn } from '../lib/utils';
import { useForm } from 'react-hook-form';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      reset({
        name: cat.name,
        slug: cat.slug,
        order: cat.order,
        isActive: cat.isActive
      });
    } else {
      setEditingCategory(null);
      reset({
        name: '',
        slug: '',
        order: categories.length + 1,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      const catData: Omit<Category, 'id'> = {
        name: data.name,
        slug: data.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
              order: Number(data.order),
        isActive: data.isActive === 'true' || data.isActive === true
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id!, catData);
      } else {
        await categoryService.createCategory(catData);
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan kategori.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus kategori ini? Pastikan tidak ada produk yang menggunakan kategori ini.')) {
      try {
        await categoryService.deleteCategory(id);
        loadCategories();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Atur Kategori</h2>
           <p className="text-sm text-slate-400">Pengaturan pengelompokan produk buket Anda.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-sage text-white px-6 py-3 rounded-xl font-bold shadow-soft flex items-center gap-2 hover:bg-brand-sage/90 transition-all text-sm"
        >
          <Plus className="w-5 h-5" /> Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4">Urutan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                 [1,2,3].map(i => <tr key={i} className="h-16 animate-pulse" />)
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-brand-pink flex items-center justify-center text-brand-pink-dark">
                            <Layers className="w-4 h-4" />
                         </div>
                         <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs font-medium text-slate-500">#{cat.order}</span>
                    </td>
                    <td className="px-6 py-4">
                       {cat.isActive ? (
                         <div className="flex items-center gap-2 text-green-600">
                           <CheckCircle2 className="w-4 h-4" />
                           <span className="text-[10px] font-bold uppercase tracking-wider">Aktif</span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 text-slate-400">
                           <XCircle className="w-4 h-4" />
                           <span className="text-[10px] font-bold uppercase tracking-wider">Nonaktif</span>
                         </div>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(cat)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id!)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic text-sm">Belum ada kategori.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="font-bold text-slate-800">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nama Kategori</label>
                    <input 
                      {...register('name', { required: true })}
                      placeholder="Contoh: Buket Wisuda"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-pink-dark outline-none transition-all text-sm"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Urutan Tampil</label>
                        <input 
                          type="number"
                          {...register('order', { required: true })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Status</label>
                        <select 
                          {...register('isActive')}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm appearance-none"
                        >
                          <option value="true">Aktif</option>
                          <option value="false">Nonaktif</option>
                        </select>
                    </div>
                 </div>

                 <div className="pt-4 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-grow px-4 py-3 border border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 text-sm"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="flex-[2] bg-brand-pink-dark text-white rounded-xl font-bold py-3 shadow-lg hover:bg-brand-pink-dark/90 text-sm"
                    >
                      Simpan Kategori
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
