"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import styles from "../../../../styles/AdminForms.module.css";
import { FaCalendarAlt, FaSave, FaArrowRight, FaImage, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { activityAPI } from "../../../../services/api";

const AddActivityPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    images: [] as File[],
    imagePreviews: [] as string[],
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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: files,
        imagePreviews: files.map((f) => URL.createObjectURL(f)),
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
      formData.images.forEach((file) => fd.append("Images", file));

      await activityAPI.create(fd);

      setSuccess("تم إضافة الفعالية بنجاح");
      setFormData({ title: "", details: "", images: [], imagePreviews: [] });

      setTimeout(() => {
        router.push("/admin/activities");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to add activity:", err);
      setError(`فشل إضافة الفعالية: ${err.message || "خطأ غير معروف"}`);
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
        <Link href="/admin/activities" className={styles.backButton}>
          <FaArrowRight /> العودة
        </Link>
        <h1>
          <FaCalendarAlt className={styles.headerIcon} /> إضافة فعالية جديدة
        </h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.adminForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">عنوان الفعالية *</label>
          <input
            className="text-black"
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="أدخل عنوان الفعالية هنا"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="details">تفاصيل الفعالية *</label>
          <textarea
            className="text-black"
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="اكتب تفاصيل الفعالية هنا..."
            rows={8}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="images">صور الفعالية</label>
          <div className={styles.imageUpload}>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImagesChange}
              accept="image/*"
              multiple
              className={styles.fileInput}
            />
            <label htmlFor="images" className={styles.customFileInput}>
              <FaImage /> اختر صور
            </label>
            {formData.imagePreviews.length > 0 && (
              <div className={styles.imagePreviewGrid}>
                {formData.imagePreviews.map((src, idx) => (
                  <div className={styles.imagePreviewContainer} key={idx}>
                    <Image
                      loading="lazy"
                      src={src}
                      alt="معاينة"
                      className={styles.imagePreview}
                      width={150}
                      height={120}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            <span className={styles.buttonContent}>
              {isSubmitting ? <FaSpinner className={styles.spinnerSmall} /> : <FaSave />}
              <span>{isSubmitting ? "جاري الحفظ..." : "حفظ الفعالية"}</span>
            </span>
          </button>
          <Link href="/admin/activities" className={styles.cancelButton}>
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddActivityPage;
