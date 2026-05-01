import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Tag,
  Filter
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product, Category } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { useForm } from 'react-hook-form';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, watch } = useForm();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [p, c] = await Promise.all([
  productService.getAllProducts(),
  categoryService.getCategories()
]);
      setProducts(p);
      setCategories(c);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        isAvailable: String(product.isAvailable),
        label: product.label || '',
        eventTags: product.eventTags?.join(', ') || '',
        budgetRange: product.budgetRange || '< 50k',
        dominantColor: product.dominantColor || 'Bebas'
      });
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        price: '',
        description: '',
        categoryId: '',
        imageUrl: '',
        isAvailable: 'true',
        label: '',
        eventTags: '',
        budgetRange: '< 50k',
        dominantColor: 'Bebas'
      });
    }

    setIsModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    setSaving(true);

    try {
      const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name,
        price: Number(data.price),
        description: data.description || '',
        categoryId: data.categoryId,
        categoryName: categories.find(c => c.id === data.categoryId)?.name || 'Uncategorized',
        imageUrl: data.imageUrl || '',
        isAvailable: data.isAvailable === 'true' || data.isAvailable === true,
        label: data.label || '',
        eventTags: data.eventTags
          ? data.eventTags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : [],
        budgetRange: data.budgetRange || '< 50k',
        dominantColor: data.dominantColor || 'Bebas'
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id!, productData);
      } else {
        await productService.createProduct(productData);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan produk. Cek koneksi Firebase dan aturan Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await productService.deleteProduct(id);
        await loadData();
      } catch (error) {
        console.error(error);
        alert('Gagal menghapus produk.');
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const imageUrl = watch('imageUrl');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Produk</h2>
          <p className="text-sm text-slate-400 font-medium italic">
            Kelola katalog buket bunga Anda di sini.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-brand-pink-dark text-white px-6 py-3 rounded-lg font-bold shadow-soft flex items-center gap-2 hover:bg-brand-pink-dark/90 transition-all"
        >
          <Plus className="w-5 h-5" /> Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama produk atau kategori..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-1 focus:ring-brand-pink-dark focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Filter className="w-4 h-4" />
            <span>Menampilkan {filteredProducts.length} Produk</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="block md:hidden divide-y divide-slate-50">
            {filteredProducts.map(product => (
              <div key={product.id} className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300 m-5" />
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">{product.name}</h4>
                  <p className="text-xs text-brand-pink-dark font-bold">{formatPrice(product.price)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "inline-block w-2 h-2 rounded-full",
                      product.isAvailable ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {product.categoryName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(product.id!)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {!loading && filteredProducts.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">
                Belum ada produk.
              </div>
            )}
          </div>

          <table className="hidden md:table w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map(i => <tr key={i} className="h-20 animate-pulse" />)
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300 m-3" />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-800">{product.name}</p>
                          {product.label && (
                            <span className="text-[10px] font-bold text-brand-pink-dark">
                              {product.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">
                        <Tag className="w-3 h-3" /> {product.categoryName}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-slate-700">
                        {formatPrice(product.price)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {product.isAvailable ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-bold">Ready</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-bold">Habis</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(product.id!)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic text-sm">
                    Belum ada produk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                </h3>
                <p className="text-xs text-slate-400">
                  Lengkapi detail produk di bawah ini.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-grow p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Link Foto Produk
                </label>
                <input
                  type="url"
                  {...register('imageUrl', { required: true })}
                  placeholder="https://contoh.com/foto-buket.jpg"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-brand-pink-dark outline-none"
                />

                {imageUrl && (
                  <div className="mt-3 w-32 h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                      src={imageUrl}
                      alt="Preview produk"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Nama Produk
                    </label>
                    <input
                      {...register('name', { required: true })}
                      placeholder="Buket Mawar Pink"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Harga (IDR)
                    </label>
                    <input
                      type="number"
                      {...register('price', { required: true })}
                      placeholder="50000"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Kategori
                    </label>
                    <select
                      {...register('categoryId', { required: true })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none transition-all text-sm"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Status Ketersediaan
                    </label>

                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="true" {...register('isAvailable')} />
                        <span className="text-sm font-medium text-slate-600">Ready</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="false" {...register('isAvailable')} />
                        <span className="text-sm font-medium text-slate-600">Habis</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Label Khusus
                    </label>
                    <input
                      {...register('label')}
                      placeholder="Best Seller, Promo, Ready"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Warna Dominan
                    </label>
                    <select
                      {...register('dominantColor')}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    >
                      {['Bebas', 'Pink', 'Putih', 'Merah', 'Ungu', 'Biru', 'Kuning'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Budget Range
                    </label>
                    <select
                      {...register('budgetRange')}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    >
                      {['< 50k', '50k - 100k', '100k - 200k', '> 200k'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Target Event
                    </label>
                    <input
                      {...register('eventTags')}
                      placeholder="Wisuda, Ulang Tahun"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    />
                    <p className="text-[11px] text-slate-400">
                      Pisahkan dengan koma. Contoh: Wisuda, Ulang Tahun
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Deskripsi Produk
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Tuliskan info produk secara detail..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-pink-dark outline-none transition-all text-sm resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow px-6 py-3.5 border border-slate-200 text-slate-500 font-bold rounded-lg hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] px-6 py-3.5 bg-brand-pink-dark text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-wait"
                >
                  {saving ? 'Menyimpan...' : editingProduct ? 'Perbarui Produk' : 'Tambahkan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}