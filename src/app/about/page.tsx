"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaUsers,
  FaUserTie,
  FaIdCard,
  FaSitemap,
  FaGavel,
  FaEye,
  FaChartBar,
  FaFlask,
  FaBookOpen,
  FaNewspaper,
  FaPoll,
  FaVoteYea,
  FaChevronLeft,
} from "react-icons/fa";
import styles from "../../styles/About.module.css";

const sections = [
  { href: "/about/general-assembly", label: "الجمعية العمومية", icon: <FaUsers /> },
  { href: "/voting-auth", label: "الانتخابات", icon: <FaVoteYea /> },
  { href: "/about/board", label: "مجلس الإدارة", icon: <FaUserTie /> },
  { href: "/about/secretariat", label: "الأمانة العامة", icon: <FaIdCard /> },
  { href: "/about/committees", label: "اللجان القطاعية", icon: <FaSitemap /> },
  { href: "/about/regulations", label: "اللوائح والأنظمة", icon: <FaGavel /> },
  { href: "/about/vision", label: "الرؤية والرسالة", icon: <FaEye /> },
  { href: "/about/annual-reports", label: "التقرير السنوي", icon: <FaChartBar /> },
  { href: "/about/studies", label: "الدراسات والبحوث", icon: <FaFlask /> },
  { href: "/about/e-library", label: "المكتبة الإلكترونية", icon: <FaBookOpen /> },
  { href: "/about/trade-bulletins", label: "النشرات التجارية", icon: <FaNewspaper /> },
  { href: "/about/surveys", label: "الاستبيانات", icon: <FaPoll /> },
];

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">الرئيسية</Link>
          <FaChevronLeft className={styles.breadcrumbIcon} aria-hidden />
          <span className={styles.breadcrumbCurrent}>عن الغرفة</span>
        </div>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroImage}>
            <Image
              src="/bisha_1.png"
              alt="مبنى غرفة بيشة"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>عن الغرفة</h1>
            <p className={styles.heroDesc}>
              تُعد غرفة بيشة من الغرف التجارية الواعدة، حيث تأسست في عام 1435هـ –
              2014م لتكون رافدًا اقتصاديًا لمحافظة بيشة. ومنذ انطلاقتها، عملت
              الغرفة من خلال دوراتها المتعاقبة على دعم مجتمع الأعمال وفتح آفاق
              استثمارية جديدة، في إطار دور محايد يواكب مستهدفات رؤية المملكة
              2030.
            </p>
          </div>
        </section>

        {/* Section cards */}
        <section className={styles.grid}>
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className={styles.card}>
              <div className={styles.cardIcon}>{section.icon}</div>
              <h3 className={styles.cardTitle}>{section.label}</h3>
              <FaChevronLeft className={styles.cardArrow} aria-hidden />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
