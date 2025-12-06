"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import './../admin.css'
import Navbar from "../../components/Navbar";
export default function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetch("/api/categories").then(res => res.json()).then(setCategories);
    fetch("/api/products").then(res => res.json()).then(setProducts);
  }, []);

  const handleAddCategory = async () => {
    if (!catName) return toast.error("أدخل اسم الكاتيجوري");

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catName }),
    });

    if (!res.ok) return toast.error("خطأ أثناء الإضافة");

    const data = await res.json();
    setCategories(prev => [...prev, data]);
    setCatName("");
    setIsCatModalOpen(false);
    toast.success("تمت الإضافة");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const { name, price, categoryId, imageUrl } = prodForm;
    if (!name || !price || !categoryId || !imageUrl)
      return toast.error("املأ جميع الحقول");

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
          categoryId: Number(categoryId),
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error();

      const newProd = await res.json();
      setProducts(prev => [...prev, newProd]);

      setProdForm({ name: "", price: "", categoryId: "", imageUrl: "" });
      setIsProdModalOpen(false);
      toast.success("تمت إضافة المنتج");
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-end justify-end gap-4 bg-[#111] text-white p-6 admin container">

     <Navbar/>

      <button
        onClick={() => setIsCatModalOpen(true)}
        className="admin-btn"
      >
        إضافة كاتيجوري
      </button>

      <button
        onClick={() => setIsProdModalOpen(true)}
        className="admin-btn"
      >
        إضافة منتج
      </button>

      {isCatModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>إضافة كاتيجوري</h2>

            <input
              type="text"
              placeholder="اسم الكاتيجوري"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />

            <div className="modal-buttons">
              <button className="cancel" onClick={() => setIsCatModalOpen(false)}>
                إلغاء
              </button>
              <button className="add" onClick={handleAddCategory}>
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}


      {isProdModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>إضافة منتج</h2>

            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="اسم المنتج"
                value={prodForm.name}
                onChange={(e) =>
                  setProdForm(prev => ({ ...prev, name: e.target.value }))
                }
              />

              <input
                type="number"
                placeholder="السعر"
                value={prodForm.price}
                onChange={(e) =>
                  setProdForm(prev => ({ ...prev, price: e.target.value }))
                }
              />

              <select
                value={prodForm.categoryId}
                onChange={(e) =>
                  setProdForm(prev => ({ ...prev, categoryId: e.target.value }))
                }
              >
                <option value="">اختر الكاتيجوري</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <CldUploadWidget
                uploadPreset="unsigned_preset"
                onSuccess={(res) =>
                  setProdForm(prev => ({
                    ...prev,
                    imageUrl: res.info.secure_url,
                  }))
                }
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="upload-btn">
                    رفع صورة المنتج
                  </button>
                )}
              </CldUploadWidget>

              <div className="modal-buttons mt-3">
                <button type="button" className="cancel" onClick={() => setIsProdModalOpen(false)}>
                  إلغاء
                </button>

                <button type="submit" className="add">
                  {loading ? "جارٍ الإضافة..." : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


