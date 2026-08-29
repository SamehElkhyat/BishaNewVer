"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import {
  FaArrowRight,
  FaBriefcase,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaIdCard,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";
import styles from "../../styles/JobApplication.module.css";
import toast from "react-hot-toast";
import axios from "axios";
import SEO from "../../components/SEO";

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .required("الاسم مطلوب"),
  civilRegistry: Yup.string()
    .matches(/^[0-9]{10}$/, "السجل المدني يجب أن يكون 10 أرقام")
    .required("السجل المدني مطلوب"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "رقم الهاتف يجب أن يكون 10 أرقام")
    .required("رقم الهاتف مطلوب"),
  email: Yup.string()
    .email("البريد الإلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),
  qualification: Yup.string().required("المؤهل مطلوب"),
  idCard: Yup.mixed()
    .required("صورة البطاقة مطلوبة")
    .test("fileSize", "حجم الملف كبير جداً (الحد الأقصى 5MB)", (value) => {
      if (!value) return true;
      return value.size <= 5242880; // 5MB
    })
    .test("fileType", "نوع الملف غير مدعوم (يجب أن يكون صورة)", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
        value.type
      );
    }),
  cv: Yup.mixed()
    .required("السيرة الذاتية مطلوبة")
    .test("fileSize", "حجم الملف كبير جداً (الحد الأقصى 10MB)", (value) => {
      if (!value) return true;
      return value.size <= 10485760; // 10MB
    })
    .test("fileType", "نوع الملف غير مدعوم (PDF أو Word)", (value) => {
      if (!value) return true;
      return [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(value.type);
    }),
});

const JobApplicationPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [idCardPreview, setIdCardPreview] = useState(null);
  const [cvFileName, setCvFileName] = useState("");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("civilRegistry", values.civilRegistry);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("qualification", values.qualification);
      formData.append("idCard", values.idCard);
      formData.append("cv", values.cv);
      // Simulate API call
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Employment`,
        formData
      );
      toast.success("تم إرسال طلب التوظيف بنجاح!");
      setIsSubmitted(true);
      resetForm();
      setIdCardPreview(null);
      setCvFileName("");
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <SEO
          title="طلب توظيف - تم الإرسال بنجاح"
          description="تم إرسال طلب التوظيف الخاص بك إلى غرفة بيشة التجارية بنجاح"
          canonicalUrl="https://bishahcc.org/job-application"
        />
        <div className={styles.container}>
          <div className={styles.successContainer}>
            <FaCheckCircle className={styles.successIcon} />
            <h1 className={styles.successTitle}>تم إرسال طلبك بنجاح!</h1>
            <p className={styles.successMessage}>
              شكراً لتقديمك طلب التوظيف. سيتم مراجعة طلبك والتواصل معك قريباً.
            </p>
            <div className={styles.successActions}>
              <Link href="/" className={styles.homeButton}>
                <FaArrowRight />
                العودة للرئيسية
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className={styles.newApplicationButton}
              >
                تقديم طلب جديد
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="طلب توظيف | غرفة بيشة التجارية"
        description="قدم طلب توظيف لدى غرفة بيشة التجارية. املأ النموذج وأرفق سيرتك الذاتية والوثائق المطلوبة للتقديم على وظيفة."
        keywords={["وظائف بيشة", "وظائف غرفة بيشة", "طلب توظيف", "فرص عمل بيشة", "التوظيف"]}
        canonicalUrl="https://bishahcc.org/job-application"
      />
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            <FaArrowRight />
            العودة للرئيسية
          </Link>
          <div className={styles.headerContent}>
            <FaBriefcase className={styles.headerIcon} />
            <h1 className={styles.title}>طلب توظيف</h1>
            <p className={styles.subtitle}>
              املأ النموذج التالي للتقديم على وظيفة في غرفة بيشة. نرحب بالكوادر
              الوطنية المؤهلة للانضمام إلى فريقنا.
            </p>
          </div>
        </div>

        <div className={styles.formContainer}>
          <Formik
            initialValues={{
              name: "",
              civilRegistry: "",
              phone: "",
              email: "",
              qualification: "",
              idCard: null,
              cv: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting, errors, touched }) => (
              <Form className={styles.form}>
                <div className={styles.card}>
                  {/* Section 1: Personal information */}
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>المعلومات الشخصية</h2>
                    <div className={styles.grid2}>
                      {/* Name Field */}
                      <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                          <FaUser className={styles.labelIcon} />
                          الاسم الكامل
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className={`${styles.input} ${
                            errors.name && touched.name ? styles.inputError : ""
                          }`}
                          placeholder="أدخل اسمك الكامل"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className={styles.errorMessage}
                        />
                      </div>

                      {/* Civil Registry */}
                      <div className={styles.formGroup}>
                        <label htmlFor="civilRegistry" className={styles.label}>
                          <FaIdCard className={styles.labelIcon} />
                          السجل المدني
                        </label>
                        <Field
                          type="text"
                          id="civilRegistry"
                          name="civilRegistry"
                          className={styles.input}
                          placeholder="أدخل رقم السجل المدني"
                          dir="ltr"
                        />
                        <ErrorMessage
                          name="civilRegistry"
                          component="div"
                          className={styles.error}
                        />
                      </div>

                      {/* Phone Field */}
                      <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>
                          <FaPhone className={styles.labelIcon} />
                          رقم الهاتف
                        </label>
                        <Field
                          type="tel"
                          id="phone"
                          name="phone"
                          className={`${styles.input} ${
                            errors.phone && touched.phone
                              ? styles.inputError
                              : ""
                          }`}
                          placeholder="05xxxxxxxx"
                          maxLength={10}
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className={styles.errorMessage}
                        />
                      </div>

                      {/* Email Field */}
                      <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                          <FaEnvelope className={styles.labelIcon} />
                          البريد الإلكتروني
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className={`${styles.input} ${
                            errors.email && touched.email
                              ? styles.inputError
                              : ""
                          }`}
                          placeholder="example@email.com"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className={styles.errorMessage}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Qualifications */}
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>المؤهلات</h2>
                    <div className={styles.formGroup}>
                      <label htmlFor="qualification" className={styles.label}>
                        <FaGraduationCap className={styles.labelIcon} />
                        المؤهل العلمي
                      </label>
                      <Field
                        as="select"
                        id="qualification"
                        name="qualification"
                        className={`${styles.select} ${
                          errors.qualification && touched.qualification
                            ? styles.inputError
                            : ""
                        }`}
                      >
                        <option value="">اختر المؤهل</option>
                        <option value="ثانوية عامة">ثانوية عامة</option>
                        <option value="دبلوم">دبلوم</option>
                        <option value="بكالوريوس">بكالوريوس</option>
                        <option value="ماجستير">ماجستير</option>
                        <option value="دكتوراه">دكتوراه</option>
                      </Field>
                      <ErrorMessage
                        name="qualification"
                        component="div"
                        className={styles.errorMessage}
                      />
                    </div>
                  </section>

                  {/* Section 3: Attachments */}
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>المرفقات المطلوبة</h2>
                    <div className={styles.grid2}>
                      {/* ID Card Upload */}
                      <div className={styles.formGroup}>
                        <label htmlFor="idCard" className={styles.label}>
                          <FaIdCard className={styles.labelIcon} />
                          صورة البطاقة
                        </label>
                        <div className={styles.fileInputWrapper}>
                          <input
                            type="file"
                            id="idCard"
                            name="idCard"
                            accept="image/*"
                            className={styles.fileInput}
                            onChange={(event) => {
                              const file = event.currentTarget.files?.[0];
                              if (file) {
                                setFieldValue("idCard", file);
                                // Create preview
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setIdCardPreview(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label
                            htmlFor="idCard"
                            className={styles.customFileInput}
                          >
                            <FaIdCard />
                            <span className={styles.fileMainText}>
                              {idCardPreview ? "تغيير الصورة" : "اختر صورة البطاقة"}
                            </span>
                            <span className={styles.fileHint}>PDF, JPG, PNG</span>
                          </label>
                        </div>
                        {idCardPreview && (
                          <div className={styles.imagePreview}>
                            <img src={idCardPreview} alt="معاينة البطاقة" />
                          </div>
                        )}
                        <ErrorMessage
                          name="idCard"
                          component="div"
                          className={styles.errorMessage}
                        />
                      </div>

                      {/* CV Upload */}
                      <div className={styles.formGroup}>
                        <label htmlFor="cv" className={styles.label}>
                          <FaFileAlt className={styles.labelIcon} />
                          السيرة الذاتية (CV)
                        </label>
                        <div className={styles.fileInputWrapper}>
                          <input
                            type="file"
                            id="cv"
                            name="cv"
                            accept=".pdf,.doc,.docx"
                            className={styles.fileInput}
                            onChange={(event) => {
                              const file = event.currentTarget.files?.[0];
                              if (file) {
                                setFieldValue("cv", file);
                                setCvFileName(file.name);
                              }
                            }}
                          />
                          <label htmlFor="cv" className={styles.customFileInput}>
                            <FaFileAlt />
                            <span className={styles.fileMainText}>
                              {cvFileName || "اختر ملف السيرة الذاتية"}
                            </span>
                            <span className={styles.fileHint}>PDF أو Word</span>
                          </label>
                        </div>
                        {cvFileName && (
                          <div className={styles.fileName}>
                            <FaFileAlt className={styles.fileIcon} />
                            {cvFileName}
                          </div>
                        )}
                        <ErrorMessage
                          name="cv"
                          component="div"
                          className={styles.errorMessage}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Submit Button */}
                  <div className={styles.formActions}>
                    <p className={styles.confirmText}>
                      بالنقر على إرسال، أنت تؤكد صحة جميع البيانات والمرفقات
                      المقدمة.
                    </p>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className={styles.spinner}></div>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <FaBriefcase />
                          إرسال الطلب
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default JobApplicationPage;
