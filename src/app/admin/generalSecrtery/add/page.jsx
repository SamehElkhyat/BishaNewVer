"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import styles from "../../../../styles/Board.module.css";

export default function AddGeneralSecretary() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMember = async (values) => {
    setIsSubmitting(true);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://backend.bishahcc.org/api";
      const url = `${API_BASE_URL}/Admin/Secretary-General`;

      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("description", values.description);
      if (values.imageUrl) {
        formData.append("imageUrl", values.imageUrl);
      }

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("تم إضافة المسؤول العام بنجاح");
      router.push("/admin/generalSecrtery");
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error(
        `فشل في إضافة المسؤول العام: ${error.message || "خطأ غير معروف"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      description: "",
      image: null,
    },
    onSubmit: (values) => {
      handleAddMember(values);
    },
  });

  const closeModal = () => {
    router.push("/admin/generalSecrtery");
  };

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
          <h1 className={styles.pageTitle}>إضافة مسؤول عام</h1>
          <p className={styles.pageDescription}>
            إضافة عضو جديد إلى مجلس الإدارة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.modalOverlay}>
          <div className={styles.editModal}>
            <div className={styles.modalHeader}>
              <h2>إضافة مسؤول عام</h2>
              <button className={styles.closeModalButton} onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <form onSubmit={formik.handleSubmit} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">الاسم الكامل</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    className={styles.formControl}
                    required
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
                    required
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
                    disabled={formik.isSubmitting || isSubmitting}
                  >
                    {isSubmitting ? (
                      <FaSpinner className={styles.spinner} />
                    ) : (
                      <FaCheck />
                    )}{" "}
                    إضافة المسؤول العام
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={closeModal}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
