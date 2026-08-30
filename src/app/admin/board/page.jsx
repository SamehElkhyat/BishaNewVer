"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FaUserTie, FaUsers, FaTimes, FaPlus } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import styles from "../../../styles/Board.module.css";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
export default function page() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [boardMembers, setBoardMembers] = useState([]);
  const [editFormData, setEditFormData] = useState({
    name: "",
    possion: "",
    image: null,
  });

  const handleDeleteClick = async (id) => {
    if (!confirm("هل تريد حذف هذا العضو؟")) return;
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://backend.bishahcc.org/api";
      const url = `${API_BASE_URL}/Admin/Delete-BOD/${id}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      toast.success("تم حذف العضو بنجاح");
      GetAllBoard();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(`فشل في حذف العضو: ${error.message || "خطأ غير معروف"}`);
    }
  };

  const handleUpdateUser = async (values) => {
    setIsUpdating(true);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://backend.bishahcc.org/api";
      const url = `${API_BASE_URL}/Admin/Update-BOD/${editingUser.id}`;
      const response = await axios.post(url, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      closeEditModal();
      toast.success("تم تحديث بيانات المستخدم بنجاح");

      GetAllBoard();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(
        `فشل في تحديث بيانات المستخدم: ${error.message || "خطأ غير معروف"}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = (id) => {
    const user = boardMembers.find((user) => user.id === id);
    if (!user) return;
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      possion: user.possion,
      image: user.image,
    });
    setIsEditModalOpen(true);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditFormData({
      name: "",
      possion: "",
      image: "",
    });
    // Restore background scrolling
    document.body.style.overflow = "unset";
  };
  const GetAllBoard = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Admin/Get-All-BOD`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      setBoardMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetAllBoard();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingUser?.name || "",
      possion: editingUser?.possion || "",
      image: editingUser?.image || null,
    },
    onSubmit: (values) => {
      handleUpdateUser(values);
    },
  });

  // Cleanup effect to restore scrolling when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className={styles.boardContainer}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            style: {
              background: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>مجلس الإدارة</h1>
          <p className={styles.pageDescription}>أعضاء مجلس إدارة غرفة بيشة</p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* Chairman Section */}

        {/* Board Members Section */}
        <div className={styles.membersSection}>
          <button
            onClick={() => router.push("/admin/board/add")}
            className={styles.addMemberButton}
          >
            <FaPlus />
            اضافة عضو
          </button>

          <div className={styles.sectionTitle}>
            <FaUsers className={styles.sectionIcon} />

            <h2>أعضاء مجلس الإدارة</h2>
          </div>

          <div className={styles.membersGrid}>
            {boardMembers.map((member) => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.memberImageContainer}>
                  <div className={styles.memberImageWrapper}>
                    {member.imageUrl ? (
                      <Image
                        loading="lazy"
                        src={member.imageUrl}
                        alt={member.name || "عضو مجلس الإدارة"}
                        width={300}
                        height={300}
                        className={styles.memberImage}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={styles.placeholderImage}
                      style={{ display: member.imageUrl ? "none" : "flex" }}
                    >
                      <FaUserTie className={styles.placeholderIcon} />
                    </div>
                  </div>
                </div>
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberPosition}>{member.possion}</p>
                </div>
                <div className={styles.memberActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick(member.id)}
                  >
                    تعديل
                  </button>

                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(member.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Edit User Modal */}
          {isEditModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.editModal}>
                <div className={styles.modalHeader}>
                  <h2>تعديل بيانات المستخدم</h2>
                  <span className={styles.userName}>{editingUser?.name}</span>
                  <button
                    className={styles.closeModalButton}
                    onClick={closeEditModal}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <form
                    onSubmit={formik.handleSubmit}
                    className={styles.editForm}
                  >
                    <div className={styles.formGroup}>
                      <label htmlFor="name">الاسم الكامل</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        className={styles.formControl}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="possion">المنصب</label>
                      <select
                        id="possion"
                        name="possion"
                        value={formik.values.possion}
                        onChange={formik.handleChange}
                        className={styles.formSelect}
                        required
                      >
                        <option value="">اختر المنصب</option>
                        <option value="رئيس مجلس الاداره">
                          رئيس مجلس الاداره
                        </option>
                        <option value="نائب رئيس مجلس الإدارة">
                          نائب رئيس مجلس الإدارة
                        </option>
                        <option value="عضو مجلس الإدارة">
                          عضو مجلس الإدارة
                        </option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="image">صورة العضو</label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={(e) =>
                          formik.setFieldValue("image", e.target.files[0])
                        }
                        className={styles.formFile}
                      />
                    </div>

                    <div className={styles.modalFooter}>
                      <button
                        type="submit"
                        className={styles.saveButton}
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting ? (
                          <FaSpinner className={styles.spinner} />
                        ) : (
                          <FaCheck />
                        )}{" "}
                        حفظ التغييرات
                      </button>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={closeEditModal}
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
