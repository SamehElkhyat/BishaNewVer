"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "../../../styles/AdminList.module.css";
import {
  FaFileAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import Link from "next/link";
import { circularAPI } from "../../../services/api";
import PaginationComponent from "../../../components/PaginationComponent";
import { getTitle, getDesc, getDate, formatDate, listFrom } from "../../activities/_lib";

const AdminCircularsPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [circulars, setCirculars] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    imageUrl: null as File | string | null,
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isAdmin()) {
      setLoading(false);
      return;
    }

    const fetchCirculars = async () => {
      try {
        const data = await circularAPI.getAll(currentPage);
        const list = listFrom(data);
        setCirculars(list);
        setFiltered(list);
        setTotalPages((data as any)?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching circulars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCirculars();
  }, [user, isAdmin, router, currentPage]);

  useEffect(() => {
    if (!searchTerm) {
      setFiltered(circulars);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFiltered(
      circulars.filter(
        (item) =>
          getTitle(item).toLowerCase().includes(term) ||
          getDesc(item).toLowerCase().includes(term)
      )
    );
  }, [searchTerm, circulars]);

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: getTitle(item),
      details: getDesc(item),
      imageUrl: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ title: "", details: "", imageUrl: null });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name === "imageUrl") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setFormData((prev) => ({ ...prev, imageUrl: files[0] }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setModalLoading(true);
      const fd = new FormData();
      fd.append("id", String(editingItem.id));
      fd.append("Title", formData.title);
      fd.append("Details", formData.details);
      if (formData.imageUrl instanceof File) {
        fd.append("ImageUrl", formData.imageUrl);
      }
      await circularAPI.update(fd);

      setCirculars((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, title: formData.title, description: formData.details }
            : item
        )
      );

      closeModal();
      alert("تم التحديث بنجاح!");
    } catch (error) {
      console.error("Error updating circular:", error);
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل تريد حذف هذا التعميم؟")) return;
    try {
      await circularAPI.delete(id);
      setCirculars((prev) => prev.filter((item) => item.id !== id));
      alert("تم الحذف بنجاح");
    } catch (error) {
      console.error("Error deleting circular:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminListContainer}>
      <div className={styles.listHeader}>
        <h1>
          <FaFileAlt className={styles.headerIcon} /> إدارة التعاميم
        </h1>
        <Link href="/admin/circulars/add" className={styles.addButton}>
          <FaPlus /> إضافة تعميم جديد
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <input
              className="text-black"
              type="text"
              placeholder="ابحث في التعاميم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>الرقم</th>
              <th>العنوان</th>
              <th>التاريخ</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <tr key={item.id ?? index}>
                  <td className="text-black">{index + 1}</td>
                  <td className="text-black">{getTitle(item) || "غير محدد"}</td>
                  <td className="text-black">{formatDate(getDate(item)) || "-"}</td>
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.editButton}
                      onClick={() => openEditModal(item)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles.noResults}>
                  لا توجد تعاميم
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>تعديل التعميم</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label htmlFor="title" className={styles.inputLabel}>
                  العنوان
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={styles.modalInput}
                  placeholder="أدخل العنوان"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="details" className={styles.inputLabel}>
                  التفاصيل
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  className={styles.modalTextarea}
                  placeholder="أدخل تفاصيل التعميم"
                  rows={5}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="imageUrl" className={styles.inputLabel}>
                  صورة التعميم
                </label>
                <input
                  type="file"
                  id="imageUrl"
                  name="imageUrl"
                  onChange={handleInputChange}
                  className={styles.modalInput}
                  accept="image/*"
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={closeModal}>
                إلغاء
              </button>
              <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={modalLoading}
              >
                <FaSave /> حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCircularsPage;
