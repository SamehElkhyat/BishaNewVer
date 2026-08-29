"use client";

import React from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaUserPlus,
  FaShieldAlt,
  FaFileAlt,
  FaCertificate,
  FaSyncAlt,
  FaIdCard,
  FaUserCheck,
  FaHandHoldingUsd,
  FaLightbulb,
  FaCreditCard,
  FaBook,
  FaLaptopCode,
  FaRedoAlt,
  FaChalkboardTeacher,
  FaCommentDots,
  FaUsersCog,
  FaThLarge,
  FaExternalLinkAlt,
} from "react-icons/fa";
import styles from "../../styles/Services.module.css";
import SEO from "../../components/SEO";

const ServicesPage = () => {
  const services = [
    {
      href: "/job-application",
      label: "طلب توظيف",
      external: false,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/Login",
      label: "التصديق الإلكتروني",
      external: true,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/DocumentVerify",
      label: "التحقق من الوثائق",
      external: true,
    },
    {
      href: "https://www.coccertificate.org/#/",
      label: "التحقق وطباعة شهادة الاشتراكات",
      external: true,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/Contact",
      label: "تحديث البيانات",
      external: true,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/MemberIdQuery/false",
      label: "الاستعلام عن عضوية",
      external: true,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/MemberIdQuery/true",
      label: "الاستعلام عن منتسب",
      external: true,
    },
    {
      href: "https://www.sdb.gov.sa/ar/تمويل-المنشات/تمويل-رواد-الاعمال",
      label: "قنوف لتمويل رواد الاعمال",
      external: true,
    },
    {
      href: "https://bishacci.org.sa/?page_id=11593",
      label: "مبادرة حلول لتحديات قطاع الاعمال",
      external: true,
    },
    {
      href: "/membership-card",
      label: "بطاقة مزايا العضوية للمشتركين",
      external: true,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/CommericalManual",
      label: "الدليل التجاري",
      external: true,
    },
    {
      href: "https://bishacci.org.sa/?page_id=14839",
      label: "مركز ريادة الاعمال الرقمي",
      external: true,
    },

    {
      href: "https://business.sa/eservices/details/e95ddf0f-41c3-4a72-d307-08dd92bf74b8",
      label: "تجديد الاشتراك",
      external: true,
    },
    {
      href: "https://numo.sa/ar/b/fraa-bysh",
      label: "التدريب",
      external: true,
    },
    {
      href: "/contact",
      label: "الشكاوي والاقتراحات",
      external: true,
    },
    {
      href: "/voting-auth",
      label: "الجمعية العمومية",
      external: true,
    },
  ];

  // Presentation-only decoration (icon + short blurb) keyed by the service label.
  const META: Record<string, { icon: React.ReactNode; desc: string }> = {
    "طلب توظيف": {
      icon: <FaUserPlus />,
      desc: "تقديم طلبات التوظيف والاطلاع على الفرص المتاحة.",
    },
    "التصديق الإلكتروني": {
      icon: <FaShieldAlt />,
      desc: "تصديق الوثائق والمعاملات إلكترونياً بشكل موثوق.",
    },
    "التحقق من الوثائق": {
      icon: <FaFileAlt />,
      desc: "التأكد من صحة الوثائق الصادرة عن الغرفة.",
    },
    "التحقق وطباعة شهادة الاشتراكات": {
      icon: <FaCertificate />,
      desc: "استخراج وطباعة شهادات الاشتراك الخاصة بالعضوية.",
    },
    "تحديث البيانات": {
      icon: <FaSyncAlt />,
      desc: "تحديث بيانات المنشأة في سجلات الغرفة.",
    },
    "الاستعلام عن عضوية": {
      icon: <FaIdCard />,
      desc: "الاستعلام عن حالة العضوية ومعلوماتها.",
    },
    "الاستعلام عن منتسب": {
      icon: <FaUserCheck />,
      desc: "البحث عن المنتسبين المسجّلين في الغرفة.",
    },
    "قنوف لتمويل رواد الاعمال": {
      icon: <FaHandHoldingUsd />,
      desc: "برنامج تمويلي لدعم مشاريع رواد الأعمال.",
    },
    "مبادرة حلول لتحديات قطاع الاعمال": {
      icon: <FaLightbulb />,
      desc: "حلول مبتكرة للتحديات التي تواجه قطاع الأعمال.",
    },
    "بطاقة مزايا العضوية للمشتركين": {
      icon: <FaCreditCard />,
      desc: "بطاقة تمنح المشتركين مزايا وخصومات حصرية.",
    },
    "الدليل التجاري": {
      icon: <FaBook />,
      desc: "دليل شامل للأنشطة والمنشآت التجارية في المنطقة.",
    },
    "مركز ريادة الاعمال الرقمي": {
      icon: <FaLaptopCode />,
      desc: "دعم وتطوير المشاريع الرقمية والتقنية الناشئة.",
    },
    "تجديد الاشتراك": {
      icon: <FaRedoAlt />,
      desc: "تجديد العضوية السنوية في الغرفة التجارية.",
    },
    "التدريب": {
      icon: <FaChalkboardTeacher />,
      desc: "برامج ودورات تدريبية لتطوير الكوادر والمهارات.",
    },
    "الشكاوي والاقتراحات": {
      icon: <FaCommentDots />,
      desc: "شاركنا ملاحظاتك ومقترحاتك لتطوير الخدمات.",
    },
    "الجمعية العمومية": {
      icon: <FaUsersCog />,
      desc: "خدمات متعلقة باجتماعات وقرارات الجمعية العمومية.",
    },
  };

  return (
    <>
      <SEO
        title="خدماتنا | غرفة بيشة التجارية"
        description="جميع الخدمات الإلكترونية المتاحة من غرفة بيشة التجارية - التصديق الإلكتروني، التحقق من الوثائق، طلب توظيف، بطاقة مزايا، والمزيد"
        keywords={[
          "خدمات غرفة بيشة",
          "التصديق الإلكتروني",
          "التحقق من الوثائق",
          "طلب توظيف",
          "بطاقة مزايا",
        ]}
        canonicalUrl="https://bishacci.org.sa/services"
      />

      <div className={styles.container}>
        {/* Hero */}
        <section className={styles.hero}>
          <span className={styles.heroShape} aria-hidden />
          <span className={styles.heroShape2} aria-hidden />

          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <span className={styles.badge}>الخدمات الإلكترونية</span>
              <h1 className={styles.title}>
                نقدّم حلولاً متكاملة لدعم أعمالك ونموّها
              </h1>
              <p className={styles.subtitle}>
                مجموعة متنوّعة من الخدمات الإلكترونية المتميّزة التي تساعد رواد
                الأعمال والشركات على إنجاز معاملاتهم وتطوير أعمالهم بسهولة.
              </p>
              <div className={styles.heroActions}>
                <a href="#services-grid" className={styles.btnPrimary}>
                  تصفّح الخدمات <FaArrowLeft aria-hidden />
                </a>
                <Link href="/contact" className={styles.btnGhost}>
                  تواصل معنا
                </Link>
              </div>
            </div>

            <div className={styles.heroArt} aria-hidden>
              <div className={styles.artPanel}>
                <span className={`${styles.artChip} ${styles.artChip1}`}>
                  <FaShieldAlt />
                </span>
                <span className={`${styles.artChip} ${styles.artChip2}`}>
                  <FaIdCard />
                </span>
                <span className={`${styles.artChip} ${styles.artChip3}`}>
                  <FaCreditCard />
                </span>
                <span className={`${styles.artChip} ${styles.artChip4}`}>
                  <FaLaptopCode />
                </span>
                <span className={styles.artLogo}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/bisha-chamber-logo.png" alt="" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section id="services-grid" className={styles.gridSection}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>خدماتنا</span>
            <h2 className={styles.sectionTitle}>حلول شاملة لاحتياجاتك</h2>
          </div>

          <div className={styles.grid}>
            {services.map((service, index) => {
              const meta = META[service.label] || {
                icon: <FaThLarge />,
                desc: "",
              };

              const inner = (
                <>
                  <span className={styles.cardIcon}>{meta.icon}</span>
                  <h3 className={styles.cardTitle}>{service.label}</h3>
                  {meta.desc && (
                    <p className={styles.cardDesc}>{meta.desc}</p>
                  )}
                  <span className={styles.cardArrow}>
                    {service.external ? (
                      <FaExternalLinkAlt aria-hidden />
                    ) : (
                      <FaArrowLeft aria-hidden />
                    )}
                  </span>
                </>
              );

              return service.external ? (
                <a
                  key={index}
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  {inner}
                </a>
              ) : (
                <Link key={index} href={service.href} className={styles.card}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;
