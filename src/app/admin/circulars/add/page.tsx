"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import styles from "../../../../styles/AdminForms.module.css";
import { FaFileAlt, FaSave, FaArrowRight, FaImage, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { circularAPI } from "../../../../services/api";

const AddCircularPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    image: null as File | null,
    imagePreview: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!isAdmin()) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, isAdmin, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.details) {
        setError("يرجى تعبئة جميع الحقول المطلوبة");
        setIsSubmitting(false);
        return;
      }

      const fd = new FormData();
      fd.append("Title", formData.title);
      fd.append("Details", formData.details);
      if (formData.image) {
        fd.append("ImageUrl", formData.image);
      }

      await circularAPI.create(fd);

      setSuccess("تم إضافة التعميم بنجاح");
      setFormData({ title: "", details: "", image: null, imagePreview: "" });

      setTimeout(() => {
        router.push("/admin/circulars");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to add circular:", err);
      setError(`فشل إضافة التعميم: ${err.message || "خطأ غير معروف"}`);
    } finally {
      setIsSubmitting(false);
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
    <div className={styles.adminFormContainer}>
      <div className={styles.formHeader}>
        <Link href="/admin/circulars" className={styles.backButton}>
          <FaArrowRight /> العودة
        </Link>
        <h1>
          <FaFileAlt className={styles.headerIcon} /> إنشاء تعميم جديد
        </h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.adminForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">اسم التعميم *</label>
          <input
            className="text-black"
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="أدخل عنوان التعميم هنا..."
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="details">تفاصيل التعميم *</label>
          <textarea
            className="text-black"
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="اكتب تفاصيل التعميم والقرارات المتعلقة به..."
            rows={8}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">صورة التعميم (اختياري)</label>
          <div className={styles.imageUpload}>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className={styles.fileInput}
            />
            <label htmlFor="image" className={styles.customFileInput}>
              <FaImage /> اختر صورة
            </label>
            {formData.imagePreview && (
              <div className={styles.imagePreviewContainer}>
                <Image
                  loading="lazy"
                  src={formData.imagePreview}
                  alt="معاينة"
                  className={styles.imagePreview}
                  width={300}
                  height={200}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            <span className={styles.buttonContent}>
              {isSubmitting ? <FaSpinner className={styles.spinnerSmall} /> : <FaSave />}
              <span>{isSubmitting ? "جاري الحفظ..." : "حفظ التعميم"}</span>
            </span>
          </button>
          <Link href="/admin/circulars" className={styles.cancelButton}>
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddCircularPage;
