"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import styles from "../../../../styles/Board.module.css";

export default function AddBoardMember() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMember = async (values) => {
    setIsSubmitting(true);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://backend.bishahcc.org/api";
      const url = `${API_BASE_URL}/Admin/Add-BOD`;

      const formData = new FormData();
      formData.append("Name", values.Name);
      formData.append("Possion", values.Possion);
      if (values.Image) {
        formData.append("Image", values.Image);
      }

      // ✅ طباعة البيانات المرسلة في الـ console
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("تم إضافة العضو بنجاح");
      router.push("/admin/board");
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error(
        `فشل في إضافة العضو: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      Name: "",
      Possion: "",
      Image: null,
    },
    onSubmit: (values) => {
      handleAddMember(values);
    },
  });

  const closeModal = () => {
    router.push("/admin/board");
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
          <h1 className={styles.pageTitle}>إضافة عضو جديد</h1>
          <p className={styles.pageDescription}>
            إضافة عضو جديد إلى مجلس الإدارة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.modalOverlay}>
          <div className={styles.editModal}>
            <div className={styles.modalHeader}>
              <h2>إضافة عضو جديد</h2>
              <button
                className={styles.closeModalButton}
                onClick={closeModal}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <form onSubmit={formik.handleSubmit} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="Name">الاسم الكامل</label>
                  <input
                    type="text"
                    id="Name"
                    name="Name"
                    value={formik.values.Name}
                    onChange={formik.handleChange}
                    className={styles.formControl}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="Possion">المنصب</label>
                  <select
                    id="Possion"
                    name="Possion"
                    value={formik.values.Possion}
                    onChange={formik.handleChange}
                    className={styles.formSelect}
                    required
                  >
                    <option value="">اختر المنصب</option>
                    <option value="رئيس مجلس الاداره">رئيس مجلس الاداره</option>
                    <option value="نائب رئيس مجلس الإدارة">
                      نائب رئيس مجلس الإدارة
                    </option>
                    <option value="عضو مجلس الإدارة">عضو مجلس الإدارة</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="Image">صورة العضو</label>
                  <input
                    type="file"
                    id="Image"
                    name="Image"
                    accept="image/*"
                    onChange={(e) =>
                      formik.setFieldValue("Image", e.target.files[0])
                    }
                    className={styles.formFile}
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
                    إضافة العضو
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
