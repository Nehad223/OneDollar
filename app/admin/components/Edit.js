"use client";
import { useEffect, useState } from "react";
import React from "react";
import Card_Slider from './../../components/Card_Slider';
import { CldUploadWidget } from "next-cloudinary"; 
import "./../admin.css"; // ← تأكد المسار مضبوط

// Toast imports
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Edit = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NEW: state لحذف الكاتيجوري
  const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [editData, setEditData] = useState({
    id: null,
    name: "",
    imageUrl: "",
    price: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const openEditModal = (product) => {
    setEditData({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
    });
    setIsModalOpen(true);
  };

  const saveChanges = async () => {
    try {
      const res = await fetch(`/api/products/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("حصل خطأ أثناء حفظ التعديل");

      setIsModalOpen(false);

      // نفس جلب الكاتيجوريز مثل ما كان عندك، بس بعد ما تم الحفظ نعرض توست نجاح
      fetch("/api/categories")
        .then(res => res.json())
        .then(data => {
          setCategories(data);
          toast.success("تم حفظ التعديلات بنجاح");
        });
    } catch (err) {
      console.error(err);
      toast.error("فشل حفظ التعديلات — حاول مرة ثانية");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("حصل خطأ أثناء حذف المنتج");

      fetch("/api/categories")
        .then(res => res.json())
        .then(data => {
          setCategories(data);
          toast.success("تم حذف المنتج");
        });
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف المنتج");
    }
  };

  // NEW: فتح نافذة تأكيد حذف الكاتيغوري
  const openDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setIsDeleteCatOpen(true);
  };

  // NEW: تنفيذ الحذف
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const id = categoryToDelete.id;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      // حدّث الواجهة محلياً - نفلتر الكاتيجوري من الستايت
      setCategories(prev => prev.filter(c => c.id !== id));
      // اغلق المودال
      setIsDeleteCatOpen(false);
      setCategoryToDelete(null);
      toast.success("تم حذف الفئة بنجاح");
    } catch (err) {
      console.error(err);
      // استبدلت ال-alert بتوست عشان الواجهة متناسقة
      toast.error("ما قدرنا نحذف الكاتيجوري. جرّب لاحقاً.");
    }
  };

  return (
    <div className='Edit'>

      {categories.map(category => (
        <div key={category.id} className="category-block">
          <div className="category-header">

            {/* زر الحذف الصغير - مخفي إلا عند الهوفر على whole category-block */}
            <div className="category-actions">
              <button
                className="cat-delete-btn"
                onClick={(e) => { e.stopPropagation(); openDeleteCategory(category); }}
                title="حذف الكاتيجوري"
                aria-label={`حذف ${category.name}`}
              >
                {/* أيقونة سلة بسيطة (SVG) */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 11v6M14 11v6M9 6l1-3h4l1 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <h1 className="category-title">{category.name}</h1>

          </div>

          <div className='Grid_items'>
            {category.products.map(product => (
              <div key={product.id} className="admin-card-container">

                <Card_Slider 
                  Img={product.imageUrl} 
                  Text={product.name} 
                  Price={product.price} 
                />

                <div className="admin-overlay">
                  <button className="edit-btn" onClick={() => openEditModal(product)}>تعديل</button>
                  <button className="del-btn" onClick={() => deleteProduct(product.id)}>حذف</button>
                </div>

              </div>
            ))}
          </div>
        </div>
      ))}

      {/* existing edit modal */}
      {isModalOpen && (
        <div className="modal-back">
          <div className="modal-box">
            <h2>تعديل المنتج</h2>

            <label>اسم المنتج:</label>
            <input 
              type="text" 
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
            />

            <label>الصورة:</label>
            <CldUploadWidget
              uploadPreset="unsigned_preset"
              onSuccess={(res) => {
                setEditData(prev => ({
                  ...prev,
                  imageUrl: res.info.secure_url,
                }));
                toast.success("تم رفع الصورة بنجاح"); // اشعار بعد رفع الصورة
              }}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()} className="upload-btn">
                  رفع صورة جديدة
                </button>
              )}
            </CldUploadWidget>

            <label>السعر:</label>
            <input 
              type="number" 
              value={editData.price}
              onChange={(e) => setEditData({...editData, price: e.target.value})}
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveChanges}>حفظ</button>
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: مودال تأكيد حذف الكاتيجوري */}
{isDeleteCatOpen && categoryToDelete && (
  <div className="modal-back" role="dialog" aria-modal="true">
    <div className="confirm-box">
      <div className="confirm-icon">⚠️</div>
      <h3>تأكيد حذف الفئة</h3>

      <p className="confirm-text">
        هل تريد حذف الفئة <strong>{categoryToDelete.name}</strong>؟
        {categoryToDelete.products && categoryToDelete.products.length > 0 && (
          <>
            <br />
            ملاحظة: تحتوي هذه الفئة على 
            <strong> {categoryToDelete.products.length} </strong>
            منتج/منتجات، وسيتم حذفها أيضاً.
          </>
        )}
      </p>

      <div className="confirm-actions">
        <button
          className="confirm-btn cancel"
          onClick={() => {
            setIsDeleteCatOpen(false);
            setCategoryToDelete(null);
          }}
        >
          إلغاء
        </button>

        <button className="confirm-btn danger" onClick={confirmDeleteCategory}>
          حذف نهائي
        </button>
      </div>
    </div>
  </div>
)}

      {/* Toast container (ما بتغير شي بالـ UI لو بتحطوه هون) */}
      <ToastContainer position="top-center" autoClose={3000} />

    </div>
  );
};

export default Edit;

