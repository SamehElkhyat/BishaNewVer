"use client";

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaClipboardList, FaUsers, FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../../styles/Survey.module.css';

const SurveyPage = () => {
  const surveys = [
    {
      id: 1,
      title: "استبيان مدى رضا المشتركين عن الخدمات",
      description: "نسعى لتحسين خدماتنا بشكل مستمر، شاركنا رأيك حول مستوى الخدمات المقدمة",
      icon: <FaClipboardList />,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSeOpj_Digc9YrY3cATwVG0Rl6Q_K5uY7TnyTW5PSgM9hx7zOA/viewform",
      color: "#003366",
      gradient: "linear-gradient(135deg, #003366 0%, #004080 100%)"
    },
    {
      id: 2,
      title: "استبيان اللجان القطاعية",
      description: "ساهم في تطوير عمل اللجان القطاعية من خلال مشاركة آرائك ومقترحاتك",
      icon: <FaUsers />,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSewW99vPZQY5HTbt-b4rK3DaRxUP6MWkrYkB2OF23XmjQiHoQ/viewform",
      color: "#0066cc",
      gradient: "linear-gradient(135deg, #0066cc 0%, #0080ff 100%)"
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <FaArrowRight />
          العودة للرئيسية
        </Link>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <FaClipboardList />
          </div>
          <h1 className={styles.title}>الاستبيانات</h1>
          <p className={styles.subtitle}>
            رأيك يهمنا! شاركنا آراءك ومقترحاتك لتطوير خدماتنا
          </p>
        </div>
      </div>

      <div className={styles.surveysGrid}>
        {surveys.map((survey) => (
          <div key={survey.id} className={styles.surveyCard}>
            <div 
              className={styles.cardHeader}
              style={{ background: survey.gradient }}
            >
              <div className={styles.cardIcon}>
                {survey.icon}
              </div>
            </div>
            
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{survey.title}</h2>
              <p className={styles.cardDescription}>{survey.description}</p>
              
              <a
                href={survey.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.surveyButton}
                style={{ background: survey.gradient }}
              >
                <span>ابدأ الاستبيان</span>
                <FaExternalLinkAlt className={styles.buttonIcon} />
              </a>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.footerText}>
                الاستبيان يستغرق حوالي 5 دقائق
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyPage;
