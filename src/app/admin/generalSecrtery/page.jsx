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
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://backend.bishahcc.org/api";
      const url = `${API_BASE_URL}/Admin/Delete-Secretary-General/${id}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      toast.success("تم حذف المسؤول العام بنجاح");
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
      const url = `${API_BASE_URL}/Admin/Update-Secretary-General/${editingUser.id}`;
      const response = await axios.post(url, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // Close modal and show success message
      closeEditModal();
      toast.success("تم تحديث بيانات المسؤول العام بنجاح");

      // Refresh the board members list
      GetAllBoard();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(
        `فشل في تحديث بيانات المسؤول العام: ${error.message || "خطأ غير معروف"}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = (user) => {
    if (!user) return;
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      description: user.description,
      imageUrl: user.imageUrl,
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
      fullName: "",
      email: "",
      description: "",
      imageUrl: "",
    });
    // Restore background scrolling
    document.body.style.overflow = "unset";
  };
  const GetAllBoard = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Admin/Get-Secretary-General`,
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
      fullName: editingUser?.fullName || "",
      email: editingUser?.email || "",
      description: editingUser?.description || "",
      imageUrl: editingUser?.imageUrl || null,
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
          <h1 className={styles.pageTitle}>الأمين العام</h1>
          <p className={styles.pageDescription}>مسؤول الأمين العام لغرفة بيشة</p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* Chairman Section */}

        {/* Board Members Section */}
        <div className={styles.membersSection}>
          <button
            onClick={() => router.push("/admin/generalSecrtery/add")}
            className={styles.addMemberButton}
          >
            <FaPlus />
            اضافة مسؤول عام
          </button>

          <div className={styles.sectionTitle}>
            <FaUsers className={styles.sectionIcon} />

            <h2>مسؤول الأمين العام</h2>
          </div>

          <div className={styles.membersGrid}>
            {boardMembers == "" ? (
              <>
              <div className={styles.membersGrid}>
                {/* Empty state */}
                <div className={styles.noMembersFound}>
                  <FaUsers className={styles.noMembersIcon} />
                  <p className="text-center text-gray-500 font-bold">لا يوجد مسؤولو الأمين العام</p>
                </div>
              </div>
              </>
            ) : (
              <>
                <div key={boardMembers.id} className={styles.memberCard}>
                  <div className={styles.memberImageContainer}>
                    <div className={styles.memberImageWrapper}>
                      {boardMembers.imageUrl ? (
                        <Image
                                    loading="lazy"

                          src={boardMembers.imageUrl}
                          alt={boardMembers.fullName || "الأمين العام"}
                          width={400}
                          height={400}
                          className={styles.memberImage}
                        />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <FaUserTie className={styles.placeholderIcon} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.memberInfo}>
                    <h3 className={styles.memberName}>
                      {boardMembers.fullName}
                    </h3>
                    <p className={styles.memberPosition}>
                      {boardMembers.email}
                    </p>
                  </div>
                  <div className={styles.memberActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(boardMembers)}
                    >
                      تعديل
                    </button>

                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(boardMembers.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Edit User Modal */}
          {isEditModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.editModal}>
                <div className={styles.modalHeader}>
                  <h2>تعديل بيانات المسؤول العام</h2>
                  <span className={styles.userName}>
                    {editingUser?.fullName}
                  </span>
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
                      <label htmlFor="email">البريد الإلكتروني</label>
                      <input
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        className={styles.formSelect}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="imageUrl">صورة المسؤول العام</label>
                      <input
                        type="file"
                        id="imageUrl"
                        name="imageUrl"
                        accept="image/*"
                        onChange={(e) =>
                          formik.setFieldValue("imageUrl", e.target.files[0])
                        }
                        className={styles.formFile}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="description">الوصف</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
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
