"use client";

import { useEffect, useState } from "react";
import Card_Slider from "./../../components/Card_Slider";
import { CldUploadWidget } from "next-cloudinary";
import "./../admin.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Edit = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [editData, setEditData] = useState({
    id: null,
    name: "",
    imageUrl: "",
    price: "",
  });

  // -----------------------
  // Load categories
  // -----------------------
  const loadCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("فشل تحميل البيانات");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // -----------------------
  // Open edit modal
  // -----------------------
  const openEditModal = (product) => {
    setEditData({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
    });

    setIsModalOpen(true);
  };

  // -----------------------
  // Save changes
  // -----------------------
  const saveChanges = async () => {
    if (actionLoading) return;

    try {
      setActionLoading(true);

      const res = await fetch(`/api/products/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editData,
          price: Number(editData.price),
        }),
      });

      if (!res.ok) throw new Error("خطأ أثناء الحفظ");

      setIsModalOpen(false);

      await loadCategories();

      toast.success("تم حفظ التعديلات بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("فشل حفظ التعديلات");
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------
  // Delete product
  // -----------------------
  const deleteProduct = async (id) => {
    if (actionLoading) return;

    try {
      setActionLoading(true);

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("فشل حذف المنتج");

      await loadCategories();

      toast.success("تم حذف المنتج");
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف المنتج");
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------
  // Delete category modal
  // -----------------------
  const openDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setIsDeleteCatOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete || actionLoading) return;

    try {
      setActionLoading(true);

      const res = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("فشل حذف الكاتيجوري");

      setCategories((prev) =>
        prev.filter((c) => c.id !== categoryToDelete.id)
      );

      setIsDeleteCatOpen(false);
      setCategoryToDelete(null);

      toast.success("تم حذف الفئة بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("ما قدرنا نحذف الكاتيجوري");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="Edit">

      {categories.map((category) => (
        <div key={category.id} className="category-block">

          <div className="category-header">

            <div className="category-actions">
              <button
                className="cat-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteCategory(category);
                }}
              >
                🗑
              </button>
            </div>

            <h1 className="category-title">{category.name}</h1>

          </div>

          <div className="Grid_items">

            {category.products.map((product) => (
              <div key={product.id} className="admin-card-container">

                <Card_Slider
                  Img={product.imageUrl}
                  Text={product.name}
                  Price={product.price}
                />

                <div className="admin-overlay">

                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(product)}
                  >
                    تعديل
                  </button>

                  <button
                    className="del-btn"
                    onClick={() => deleteProduct(product.id)}
                  >
                    حذف
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>
      ))}

      {/* Edit Modal */}

      {isModalOpen && (
        <div className="modal-back">

          <div className="modal-box">

            <h2>تعديل المنتج</h2>

            <label>اسم المنتج:</label>

            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <label>الصورة:</label>

            <CldUploadWidget
              uploadPreset="unsigned_preset"
              onSuccess={(res) => {
                setEditData((prev) => ({
                  ...prev,
                  imageUrl: res.info.secure_url,
                }));

                toast.success("تم رفع الصورة بنجاح");
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="upload-btn"
                >
                  رفع صورة جديدة
                </button>
              )}
            </CldUploadWidget>

            {editData.imageUrl && (
              <img
                src={editData.imageUrl}
                alt="preview"
                className="preview-img"
              />
            )}

            <label>السعر:</label>

            <input
              type="number"
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
            />

            <div className="modal-actions">

              <button
                className="save-btn"
                onClick={saveChanges}
                disabled={actionLoading}
              >
                حفظ
              </button>

              <button
                className="cancel-btn"
                onClick={() => setIsModalOpen(false)}
              >
                إلغاء
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Delete Category Modal */}

      {isDeleteCatOpen && categoryToDelete && (
        <div className="modal-back">

          <div className="confirm-box">

            <div className="confirm-icon">⚠️</div>

            <h3>تأكيد حذف الفئة</h3>

            <p className="confirm-text">

              هل تريد حذف الفئة
              <strong> {categoryToDelete.name} </strong> ؟

              {categoryToDelete.products?.length > 0 && (
                <>
                  <br />
                  تحتوي هذه الفئة على
                  <strong> {categoryToDelete.products.length} </strong>
                  منتج وسيتم حذفها أيضاً
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

              <button
                className="confirm-btn danger"
                onClick={confirmDeleteCategory}
              >
                حذف نهائي
              </button>

            </div>

          </div>

        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />

    </div>
  );
};

export default Edit;