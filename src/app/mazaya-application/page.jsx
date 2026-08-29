"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import {
  FaArrowRight,
  FaIdCard,
  FaUser,
  FaPhone,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import styles from "../../styles/JobApplication.module.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import SEO from "../../components/SEO";

// Validation schema
const validationSchema = Yup.object({
  commercialRegistrationNumber: Yup.string().required(
    "رقم السجل التجاري مطلوب"
  ),
  ownerName: Yup.string()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .required("اسم صاحب السجل التجاري مطلوب"),
  phone: Yup.string().required("رقم الهاتف مطلوب"),
  agreeToTerms: Yup.boolean()
    .oneOf([true], "يجب الموافقة على الشروط والأحكام")
    .required("يجب الموافقة على الشروط والأحكام"),
});

const MazayaApplicationPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append(
        "commercialRegistrationNumber",
        values.commercialRegistrationNumber
      );
      formData.append("ownerName", values.ownerName);
      formData.append("phone", values.phone);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Mazaia`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("شكرا لك. لقد تم الأرسال بنجاح.");
      setIsSubmitted(true);
      resetForm();
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
          title="برنامج مزايا - تم الإرسال بنجاح"
          description="تم إرسال طلب الاشتراك في برنامج مزايا الخاص بك بنجاح"
          canonicalUrl="https://bishahcc.org/mazaya-application"
        />
        <div className={styles.container}>
          <Toaster position="top-center" />
          <div className={styles.successContainer}>
            <FaCheckCircle className={styles.successIcon} />
            <h1 className={styles.successTitle}>تم إرسال طلبك بنجاح!</h1>
            <p className={styles.successMessage}>
              شكراً لتقديمك طلب الاشتراك في برنامج مزايا. سيتم مراجعة طلبك
              والتواصل معك قريباً.
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
        title="برنامج مزايا | غرفة بيشة التجارية"
        description="اشترك في برنامج مزايا غرفة بيشة التجارية واستمتع بخصومات حصرية لأكثر من 30 علامة تجارية وعروض مميزة"
        keywords={[
          "برنامج مزايا",
          "خصومات غرفة بيشة",
          "بطاقة مزايا",
          "عضوية مزايا",
          "خصومات حصرية",
        ]}
        canonicalUrl="https://bishahcc.org/mazaya-application"
      />
      <div className={styles.container}>
        <Toaster position="top-center" />
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            <FaArrowRight />
            العودة للرئيسية
          </Link>
          <div className={styles.headerContent}>
            <FaStar className={styles.headerIcon} />
            <h1 className={styles.title}>طلب الاشتراك في برنامج مزايا</h1>
            <p className={styles.subtitle}>
              املأ النموذج التالي للاستفادة من خصومات وعروض برنامج مزايا
            </p>
          </div>
        </div>

        <div className={styles.formContainer}>
          <Formik
            initialValues={{
              commercialRegistrationNumber: "",
              ownerName: "",
              phone: "",
              agreeToTerms: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className={styles.form}>
                {/* Commercial Registration Number */}
                <div className={styles.formGroup}>
                  <label
                    htmlFor="commercialRegistrationNumber"
                    className={styles.label}
                  >
                    <FaIdCard className={styles.labelIcon} />
                    رقم السجل التجاري
                  </label>
                  <Field
                    type="text"
                    id="commercialRegistrationNumber"
                    name="commercialRegistrationNumber"
                    className={styles.input}
                    placeholder="أدخل رقم السجل التجاري"
                  />
                  <ErrorMessage
                    name="commercialRegistrationNumber"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="ownerName" className={styles.label}>
                    <FaUser className={styles.labelIcon} />
                    اسم صاحب السجل التجاري
                  </label>
                  <Field
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    className={styles.input}
                    placeholder="أدخل اسم صاحب السجل التجاري"
                  />
                  <ErrorMessage
                    name="ownerName"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    <FaPhone className={styles.labelIcon} />
                    رقم الهاتف
                  </label>
                  <Field
                    type="text"
                    id="phone"
                    name="phone"
                    className={styles.input}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className={styles.error}
                  />
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.checkboxGroup}>
                    <Field
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      className={styles.checkbox}
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className={styles.checkboxLabel}
                    >
                      أنا أوافق على شروط وأحكام إصدار البطاقة
                    </label>
                  </div>
                  <ErrorMessage
                    name="agreeToTerms"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner}></span>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      إرسال
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
export default MazayaApplicationPage;
