"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import {
  FaArrowRight,
  FaUser,
  FaBriefcase,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";
import styles from "../../styles/Survey.module.css";
import toast from "react-hot-toast";
import { surveyAPI } from "../../services/api";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .required("الاسم مطلوب"),
  position: Yup.string(),
  committeeQuality: Yup.string(),
  committeePerformance: Yup.string(),
  suggestions: Yup.string(),
});

const SectoralCommitteesSurveyPage = () => {

  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      await surveyAPI.submitSectoralCommittees(values);
      toast.success("تم إرسال استبيان اللجان القطاعية بنجاح");
      setIsSubmitted(true);
      resetForm();
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء إرسال الاستبيان");
      console.error("Error submitting survey:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <FaCheckCircle />
          </div>
          <h1 className={styles.successTitle}>تم إرسال الاستبيان بنجاح!</h1>
          <p className={styles.successMessage}>
            شكراً لك على وقتك في ملء الاستبيان. ملاحظاتك مهمة جداً لنا وستساعدنا
            في تحسين أداء اللجان القطاعية.
          </p>
          <div className={styles.successActions}>
            <Link href="/" className={styles.homeButton}>
              العودة إلى الصفحة الرئيسية
            </Link>
            <button
              onClick={() => setIsSubmitted(false)}
              className={styles.newSurveyButton}
            >
              ملء استبيان جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <FaArrowRight />
          <span>العودة</span>
        </Link>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <FaClipboardList />
          </div>
          <h1 className={styles.title}>استبيان اللجان القطاعية</h1>
          <p className={styles.subtitle}>
            نسعى دائماً لتحسين أداء اللجان القطاعية. يرجى مشاركتنا آرائكم
            وملاحظاتكم حول عمل اللجان.
          </p>
        </div>
      </div>

      <div className={styles.formContainer}>
        <Formik
          initialValues={{
            name: "",
            position: "",
            committeeQuality: "",
            committeePerformance: "",
            suggestions: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className={styles.form}>
              {/* Name Field */}
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  <FaUser className={styles.labelIcon} />
                  الاسم *
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className={styles.input}
                  placeholder="أدخل اسمك الكامل"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.error}
                />
              </div>
              {/* Position Field */}
              <div className={styles.formGroup}>
                <label htmlFor="position" className={styles.label}>
                  <FaBriefcase className={styles.labelIcon} />
                  المنصب
                </label>
                <Field
                  type="text"
                  id="position"
                  name="position"
                  className={styles.input}
                  placeholder="أدخل منصبك الوظيفي"
                />
              </div>
              {/* Committee Quality Rating */}
              <div className={styles.formGroup}>
                <label htmlFor="committeeQuality" className={styles.label}>
                  جودة مخرجات اللجان التحديات والحلول والتقارير والدراسات (مدى
                  رضاك عن اللجان القطاعية وإدارة اللجان)
                </label>
                <Field
                  as="select"
                  id="committeeQuality"
                  name="committeeQuality"
                  className={styles.select}
                >
                  <option value="">اختر التقييم</option>
                  <option value="1">1 - غير راضي جداً</option>
                  <option value="2">2 - غير راضي</option>
                  <option value="3">3 - محايد</option>
                  <option value="4">4 - راضي</option>
                  <option value="5">5 - راضي جداً</option>
                </Field>
              </div>

              {/* Committee Performance Rating */}
              <div className={styles.formGroup}>
                <label htmlFor="committeePerformance" className={styles.label}>
                  رضا العملاء المشتركين على أداء اللجان (مدى رضاك عن أداء
                  اللجان)
                </label>
                <Field
                  as="select"
                  id="committeePerformance"
                  name="committeePerformance"
                  className={styles.select}
                >
                  <option value="">اختر التقييم</option>
                  <option value="1">1 - غير راضي جداً</option>
                  <option value="2">2 - غير راضي</option>
                  <option value="3">3 - محايد</option>
                  <option value="4">4 - راضي</option>
                  <option value="5">5 - راضي جداً</option>
                </Field>
              </div>

              {/* Suggestions */}
              <div className={styles.formGroup}>
                <label htmlFor="suggestions" className={styles.label}>
                  هل لديك أي مقترحات أخرى؟
                </label>
                <Field
                  as="textarea"
                  id="suggestions"
                  name="suggestions"
                  className={styles.textarea}
                  rows={4}
                  placeholder="شاركنا مقترحاتك وأفكارك..."
                />
              </div>

              {/* Submit Button */}
              <div className={styles.submitContainer}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الاستبيان"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SectoralCommitteesSurveyPage;
