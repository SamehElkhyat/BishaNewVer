"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/MembershipCard.module.css";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Validation schema
const validationSchema = Yup.object({
  commercialRegistrationNumber: Yup.string()
    .required("رقم السجل التجاري مطلوب"),
  ownerName: Yup.string()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .required("اسم صاحب السجل التجاري مطلوب"),
  phone: Yup.string()
    .required("رقم الهاتف مطلوب"),
});

const MembershipCardAd = () => {
  const cardRef = useRef(null);
  const handRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Smooth entrance animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    if (handRef.current) observer.observe(handRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append(
        "commercialRegistrationNumber",
        values.commercialRegistrationNumber
      );
      formData.append("ownerName", values.ownerName);
      formData.append("phone", values.phone);

      // Simulate API call
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Mazaia`,
        formData
      );

      toast.success("تم إرسال طلب البطاقة بنجاح!");
      setIsSubmitted(true);
      resetForm();

      // Close modal after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
  };

  return (
    <div className={styles.adContainer}>
      {/* Bisha Chamber Logo - Top Left */}
      <div className={styles.chamberLogo}>
        <Image
          src="/bisha-chamber-logo.png"
          alt="Bisha Chamber Logo"
          width={150}
          height={150}
          className={styles.logoImage}
        />
      </div>
      {/* Benefits and Services Text */}
      <div className={styles.benefitsText}>
        <span className={styles.benefitsIcon}>✦</span>
        منافع وخدمات حصرية للمشتركين
        <span className={styles.benefitsIcon}>✦</span>
      </div>
      {/* Main Content Area */}
      <div className={styles.mainContent} ref={cardRef}>
        <div className={styles.contentLeft}>
          {/* Membership Card Header */}
          <div className={styles.headerWrapper}>
            <div className={styles.decorativeLine}></div>
            <h1 className={styles.membershipHeader}>
              <span className={styles.headerGlow}>بطاقة العضوية</span>
            </h1>
            <div className={styles.decorativeLine}></div>
          </div>
          {/* 30+ Brands Section */}
          <div className={styles.brandsSection}>
            <span className={styles.moreThanText}>أكثر من</span>

            <div className={styles.number30Container}>
              <span className={styles.number30}>30</span>
              <div className={styles.numberGlow}></div>
            </div>
            <span className={styles.brandText}>علامة تجارية</span>
          </div>
        </div>

        {/* Hand holding ID card icon - Right Side */}
        <div className={styles.handIconRight} ref={handRef}>
          <div className={styles.floatingAnimation}>
            <div className={styles.handGraphic}>
              <div className={styles.idCardGraphic}>
                <div className={styles.cardShine}></div>
                <div className={styles.cardContent}>
                  <div className={styles.userIcon}>👤</div>
                  <div className={styles.cardLines}>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                  </div>
                </div>
              </div>
              <div className={styles.checkmarkBadge}>
                <div className={styles.checkmarkPulse}></div>
                <span className={styles.checkmark}>✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className={styles.ctaSection}>
        {/* CTA Button */}
        <button className={styles.ctaButton} onClick={() => router.push("/mazaya-application")}>
          <span className={styles.buttonShine}></span>
          <span className={styles.buttonText}>اطلب بطاقتك</span>
          <span className={styles.buttonIcon}>→</span>
        </button>

        {/* PDF Button */}
        <button 
          className={styles.ctaButton} 
          onClick={() => window.open('/documents/mazaya_removed.pdf', '_blank')}
          style={{ marginTop: '20px' }}
        >
          <span className={styles.buttonShine}></span>
          <span className={styles.buttonText}>عرض التفاصيل</span>
          <span className={styles.buttonIcon}>📄</span>
        </button>
        {/* Brand Logos - Premium Display */}
        <div className={styles.logosContainer}>
          <div className={styles.logosWrapper}>
            {/* First Row of Logos */}
            <div className={styles.logosRow}>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/khabti-grand-hotel.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/drwaz.png"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/elegant-fork.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/horse-silhouette.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/raed-logo.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/sandiw.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/sharifah-alghamdi.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
            </div>

            {/* Second Row of Logos */}
            <div className={styles.logosRow}>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/khabti-grand-hotel.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/drwaz.png"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/elegant-fork.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/horse-silhouette.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/raed-logo.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/sandiw.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
              <div className={styles.logoWrapper}>
                <Image
                            loading="lazy"

                  src="/logos/sharifah-alghamdi.jpg"
                  alt="Partner"
                  width={55}
                  height={55}
                  className={styles.brandLogo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Footer */}
      <div className={styles.footer}>
        <div className={styles.footerDivider}>
          <div className={styles.dividerLine}></div>
          <div className={styles.dividerDiamond}>◆</div>
          <div className={styles.dividerLine}></div>
        </div>
        <div className={styles.footerContent}>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
            fontSize: "16px",
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              <FaTimes />
            </button>

            {isSubmitted ? (
              <div className={styles.successMessage}>
                <FaCheckCircle className={styles.successIcon} />
                <h2>تم إرسال طلبك بنجاح!</h2>
                <p>سنتواصل معك قريباً</p>
              </div>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <h2>طلب بطاقة العضوية</h2>
                  <p>يرجى تعبئة البيانات التالية</p>
                </div>

                <Formik
                  initialValues={{
                    commercialRegistrationNumber: "",
                    ownerName: "",
                    phone: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue }) => (
                    <Form className={styles.form}>
                      <div className={styles.formGroup}>
                        <label htmlFor="commercialRegistrationNumber">
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
                        <label htmlFor="ownerName">
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
                        <label htmlFor="phone">الهاتف</label>
                        <Field
                          type="text"
                          id="phone"
                          name="phone"
                          className={styles.input}
                          placeholder="05XXXXXXXX"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className={styles.error}
                        />
                      </div>

                      <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipCardAd;
