"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import styles from "../../../../styles/AdminForms.module.css";
import {
  FaAddressBook,
  FaSave,
  FaArrowRight,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaClock,
} from "react-icons/fa";
import Link from "next/link";
import { clientsAPI } from "../../../../services/api";

const page = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: 1,
    firstPhoneNumber: "",
    secondPhoneNumber: "",
    location: "",
    email: "",
    address: "",
    workingHours: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      // router.push('/login');
      setLoading(false);
    } else if (!isAdmin()) {
      // router.push('/');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, isAdmin, router]);

  // Pre-fill the form with the contact info that's already on file.
  const fetchCurrentContact = async () => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://backend.bishahcc.org/api";
      const response = await fetch(`${API_BASE_URL}/Admin/Get-Contact-US`, {
        credentials: "include",
      });
      if (!response.ok) return;
      const text = await response.text();
      if (!text) return;
      const data = JSON.parse(text);
      setFormData((prev) => ({
        ...prev,
        id: data.id ?? prev.id,
        firstPhoneNumber: data.firstPhoneNumber || "",
        secondPhoneNumber: data.secondPhoneNumber || "",
        location: data.location || "",
        email: data.email || "",
        address: data.address || "",
        workingHours: data.workingHours || "",
      }));
    } catch (error) {
      console.error("Failed to load current contact info:", error);
    }
  };

  useEffect(() => {
    fetchCurrentContact();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // Prepare user data for API
      const userData = {
        id: formData.id,
        firstPhoneNumber: formData.firstPhoneNumber,
        email: formData.email,
        secondPhoneNumber: formData.secondPhoneNumber,
        location: formData.location,
        address: formData.address,
        workingHours: formData.workingHours,
      };

      // Send to API
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://backend.bishahcc.org/api";
      const url = `${API_BASE_URL}/Admin/Update-Contact-US`;
      // Get auth token
      const token = localStorage.getItem("auth_token");
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Make the API request
      const response = await fetch(url, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      // Show success message and refresh the form with what's now saved
      setSuccess("تم تعديل البيانات بنجاح");
      await fetchCurrentContact();
    } catch (error) {
      console.error("Failed to update contact:", error);
      setError(`فشل تعديل البيانات: ${error.message || "خطأ غير معروف"}`);
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
        <Link href="/admin/contact" className={styles.backButton}>
          <FaArrowRight /> العودة
        </Link>
        <h1>
          <FaAddressBook className={styles.headerIcon} /> تعديل البيانات تواصل معنا
        </h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.adminForm}>
        <div className={styles.formGroup}>
          <label htmlFor="firstPhoneNumber">رقم الهاتف الأول *</label>
          <div className={styles.inputWithIcon}>
            <FaPhone className={styles.inputIcon} />
            <input
              className="text-black"
              type="number"
              id="firstPhoneNumber"
              name="firstPhoneNumber"
              value={formData.firstPhoneNumber}
              onChange={handleChange}
              placeholder="أدخل رقم الهاتف الأول"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="secondPhoneNumber">رقم الهاتف الثاني *</label>
            <div className={styles.inputWithIcon}>
              <FaPhone className={styles.inputIcon} />
              <input
                className="text-black"
                type="number"
                id="secondPhoneNumber"
                name="secondPhoneNumber"
                value={formData.secondPhoneNumber}
                onChange={handleChange}
                placeholder="أدخل رقم الهاتف الثاني"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">الموقع *</label>
            <div className={styles.inputWithIcon}>
              <FaMapMarkerAlt className={styles.inputIcon} />
              <input
                className="text-black"
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="أدخل الموقع"
              />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">البريد الإلكتروني *</label>
          <div className={styles.inputWithIcon}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              className="text-black"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">العنوان *</label>
          <div className={styles.inputWithIcon}>
            <FaBuilding className={styles.inputIcon} />
            <input
              className="text-black"
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="أدخل العنوان"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="workingHours">ساعات العمل *</label>
          <div className={styles.inputWithIcon}>
            <FaClock className={styles.inputIcon} />
            <input
              className="text-black"
              type="text"
              id="workingHours"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
              placeholder="أدخل ساعات العمل"
            />
          </div>
        </div>
        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            <span className={styles.buttonContent}>
              {isSubmitting ? <span className={styles.spinnerSmall} /> : <FaSave />}
              <span>{isSubmitting ? "جاري الحفظ..." : "حفظ البيانات"}</span>
            </span>
          </button>
          <Link href="/admin/contact" className={styles.cancelButton}>
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
};

export default page;
