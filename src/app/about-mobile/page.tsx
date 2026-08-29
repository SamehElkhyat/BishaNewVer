"use client";
import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import styles from '../../styles/ServicesPage.module.css';

const AboutMobilePage = () => {
  const aboutItems = [
    { href: '/about/vision', label: 'الرؤية والرسالة' },
    { href: '/about/regulations', label: 'اللوائح والأنظمة' },
    { href: '/about/board', label: 'مجلس الإدارة' },
    { href: '/about/secretariat', label: 'الأمانة العامة' },
    { href: '/about/magazine', label: 'مجلة الغرفة' },
    { href: '/about/general-assembly', label: 'الجمعية العمومية' },
    { href: '/about/elections', label: 'الانتخابات' },
    { href: '/about/annual-reports', label: 'التقرير السنوي' },
    { href: '/about/e-library', label: 'المكتبة الإلكترونية' },
    { href: '/about/trade-bulletins', label: 'النشرات التجارية'},
    { href: '/about/studies', label: 'الدراسات والبحوث' },
    { href: '/about/committees', label: 'اللجان القطاعية' },
    { href: '/about/surveys', label: 'الاستبيانات' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <FaArrowRight />
          العودة للرئيسية
        </Link>
        <h1 className={styles.title}>عن الغرفة</h1>
        <p className={styles.subtitle}>معلومات شاملة عن غرفة بيشة التجارية</p>
      </div>

      <div className={styles.servicesList}>
        {aboutItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={styles.serviceItem}
          >
            <span className={styles.serviceLabel}>{item.label}</span>
            <FaArrowRight className={styles.arrowIcon} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AboutMobilePage;
