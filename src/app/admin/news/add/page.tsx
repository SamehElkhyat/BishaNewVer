"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import styles from "../../../../styles/AdminForms.module.css";
import {
  FaNewspaper,
  FaSave,
  FaArrowRight,
  FaImage,
  FaSpinner,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
const AddNewsPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "أخبار",
    image: null,
    imagePreview: "",
    createdAt: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      router.push("/login");
    } else if (!isAdmin()) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, isAdmin, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  // Function to validate file
  const validateFile = (file) => {
    // Maximum file size in bytes (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    // Allowed image types
    const ALLOWED_IMAGE_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!file) {
      return { isValid: false, error: "No file provided" };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds the maximum limit of ${Math.round(
          MAX_FILE_SIZE / (1024 * 1024)
        )}MB`,
      };
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed types: ${ALLOWED_IMAGE_TYPES.map(
          (type) => type.split("/")[1]
        ).join(", ")}`,
      };
    }

    return { isValid: true, error: null };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.type) {
        setError("يرجى تعبئة جميع الحقول المطلوبة");
        setIsSubmitting(false);
        return;
      }

      // Create FormData object for API request
      const apiFormData = new FormData();
      apiFormData.append("Title", formData.title);
      apiFormData.append("Description", formData.description);
      apiFormData.append("Type", formData.type);
      apiFormData.append("CreatedAt", formData.createdAt);

      // Add image if provided
      if (formData.image) {
        // Validate the image file
        const validation = validateFile(formData.image);
        if (!validation.isValid) {
          setError(validation.error);
          setIsSubmitting(false);
          return;
        }

        // Append the file to the form data
        apiFormData.append("ImageUrl", formData.image);
      }

      // Custom API call to handle FormData with file upload
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://backend.bishahcc.org/api";
      const url = `${API_BASE_URL}/NewsPaper/Add`;
      const token = localStorage.getItem("auth_token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Make the API request
      const response = await fetch(url, {
        method: "POST",
        headers,
        credentials: "include",
        body: apiFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      // Show success message
      setSuccess("تم إضافة الخبر بنجاح");

      // Reset form after success
      setFormData({
        title: "",
        description: "",
        type: "أخبار",
        image: null,
        imagePreview: "",
        createdAt: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/admin/news");
      }, 2000);
    } catch (error) {
      console.error("Failed to add news:", error);
      setError(`فشل إضافة الخبر: ${error.message || "خطأ غير معروف"}`);
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
        <Link href="/admin/news" className={styles.backButton}>
          <FaArrowRight /> العودة
        </Link>
        <h1>
          <FaNewspaper className={styles.headerIcon} /> إضافة خبر جديد
        </h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.adminForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">عنوان الخبر *</label>
          <input
            className="text-black"
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="أدخل عنوان الخبر"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="type">نوع الخبر *</label>
          <select
            className="text-black"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="أخبار">الأخبار</option>
            <option value="اعلانات">الاعلانات</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">محتوى الخبر *</label>
          <textarea
            className="text-black"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="أدخل محتوى الخبر"
            rows={10}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="createdAt">التاريخ</label>
          <input
            className="text-black"
            type="date"
            id="createdAt"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
            placeholder="أدخل التاريخ"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">صورة الخبر</label>
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
        <button
  type="submit"
  className={styles.submitButton}
  disabled={isSubmitting}
>
  <span className={styles.buttonContent}>
    {isSubmitting ? (
      <FaSpinner className={styles.spinner} />
    ) : (
      <FaSave />
    )}
    <span className="ml-2">{isSubmitting ? "جاري الحفظ..." : "حفظ الخبر"}</span>
  </span>
</button>

          <Link href="/admin/news" className={styles.cancelButton}>
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddNewsPage;
