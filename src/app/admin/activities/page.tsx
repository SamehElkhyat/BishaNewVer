"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "../../../styles/AdminList.module.css";
import {
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import Link from "next/link";
import { activityAPI } from "../../../services/api";
import PaginationComponent from "../../../components/PaginationComponent";
import { getTitle, getDesc, getDate, formatDate, listFrom } from "../../activities/_lib";

const AdminActivitiesPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    images: [] as File[],
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

    const fetchActivities = async () => {
      try {
        const data = await activityAPI.getAll(currentPage);
        const list = listFrom(data);
        setActivities(list);
        setFiltered(list);
        setTotalPages((data as any)?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [user, isAdmin, router, currentPage]);

  useEffect(() => {
    if (!searchTerm) {
      setFiltered(activities);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFiltered(
      activities.filter(
        (item) =>
          getTitle(item).toLowerCase().includes(term) ||
          getDesc(item).toLowerCase().includes(term)
      )
    );
  }, [searchTerm, activities]);

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: getTitle(item),
      details: getDesc(item),
      images: [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ title: "", details: "", images: [] });
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, images: Array.from(e.target.files as FileList) }));
    }
  };

  const handleSave = async () => {
    try {
      setModalLoading(true);
      const fd = new FormData();
      fd.append("id", String(editingItem.id));
      fd.append("Title", formData.title);
      fd.append("Details", formData.details);
      formData.images.forEach((file) => fd.append("Images", file));
      await activityAPI.update(fd);

      setActivities((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, title: formData.title, description: formData.details }
            : item
        )
      );

      closeModal();
      alert("تم التحديث بنجاح!");
    } catch (error) {
      console.error("Error updating activity:", error);
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل تريد حذف هذه الفعالية؟")) return;
    try {
      await activityAPI.delete(id);
      setActivities((prev) => prev.filter((item) => item.id !== id));
      alert("تم الحذف بنجاح");
    } catch (error) {
      console.error("Error deleting activity:", error);
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
          <FaCalendarAlt className={styles.headerIcon} /> إدارة الفعاليات
        </h1>
        <Link href="/admin/activities/add" className={styles.addButton}>
          <FaPlus /> إضافة فعالية جديدة
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <input
              className="text-black"
              type="text"
              placeholder="ابحث في الفعاليات..."
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
                  لا توجد فعاليات
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
              <h3>تعديل الفعالية</h3>
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
                  onChange={handleTextChange}
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
                  onChange={handleTextChange}
                  className={styles.modalTextarea}
                  placeholder="أدخل تفاصيل الفعالية"
                  rows={5}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="images" className={styles.inputLabel}>
                  صور الفعالية (اختياري)
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImagesChange}
                  className={styles.modalInput}
                  accept="image/*"
                  multiple
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

export default AdminActivitiesPage;
