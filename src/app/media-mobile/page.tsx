"use client";
import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import styles from '../../styles/ServicesPage.module.css';

const MediaMobilePage = () => {
  const mediaItems = [
    { href: '/media-center/news', label: 'الاخبار' },
    { href: '/media-center/circulars', label: 'الاعلانات' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <FaArrowRight />
          العودة للرئيسية
        </Link>
        <h1 className={styles.title}>المركز الاعلامي</h1>
        <p className={styles.subtitle}>آخر الأخبار والإعلانات</p>
      </div>

      <div className={styles.servicesList}>
        {mediaItems.map((item, index) => (
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

export default MediaMobilePage;
