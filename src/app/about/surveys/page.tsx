"use client";

import React, { useState } from 'react';
import { FaClipboardList, FaExternalLinkAlt, FaCheckCircle, FaUsers, FaSmile } from 'react-icons/fa';
import styles from '../../../styles/Surveys.module.css';

// Surveys data
const surveysData = [
  {
    id: 1,
    title: "استبيان اللجان القطاعية بغرفة بيشة",
    icon: <FaUsers className={styles.surveyIcon} />,
    description: "يهدف هذا الاستبيان إلى قياس مدى فعالية اللجان القطاعية في غرفة بيشة وتقييم أدائها، بهدف تطوير عملها وتعزيز دورها في خدمة قطاع الأعمال بالمحافظة.",
    questions: 15,
    estimatedTime: "5-7 دقائق",
    status: "متاح",
    participants: 127,
    lastUpdated: "15 مايو 2025"
  },
  {
    id: 2,
    title: "استبيان رضا المنتسبين",
    icon: <FaSmile className={styles.surveyIcon} />,
    description: "يهدف هذا الاستبيان إلى قياس مستوى رضا المنتسبين عن خدمات غرفة بيشة، وتحديد مجالات التحسين والتطوير، بما يسهم في تقديم خدمات أفضل تلبي احتياجات وتطلعات المنتسبين.",
    questions: 20,
    estimatedTime: "8-10 دقائق",
    status: "متاح",
    participants: 243,
    lastUpdated: "10 يونيو 2025"
  }
];

const SurveysPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'closed'>('all');
  
  // Filter surveys based on active tab
  const filteredSurveys = surveysData.filter(survey => {
    if (activeTab === 'all') return true;
    if (activeTab === 'available') return survey.status === "متاح";
    if (activeTab === 'closed') return survey.status === "مغلق";
    return true;
  });

  return (
    <div className={styles.surveysContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>الاستبيانات</h1>
          <p className={styles.pageDescription}>
            استبيانات غرفة بيشة لقياس الأداء وتطوير الخدمات المقدمة للمنتسبين وقطاع الأعمال
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('all')}
            >
              جميع الاستبيانات
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'available' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('available')}
            >
              المتاحة
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'closed' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('closed')}
            >
              المغلقة
            </button>
          </div>
        </div>

        <div className={styles.surveysGrid}>
          {filteredSurveys.length > 0 ? (
            filteredSurveys.map((survey) => (
              <div key={survey.id} className={styles.surveyCard}>
                <div className={styles.surveyHeader}>
                  <div className={styles.surveyIconContainer}>
                    {survey.icon}
                  </div>
                  <div className={styles.surveyTitleContainer}>
                    <h2 className={styles.surveyTitle}>{survey.title}</h2>
                    <div className={styles.surveyStatus}>
                      <span className={`${styles.statusBadge} ${survey.status === "متاح" ? styles.availableStatus : styles.closedStatus}`}>
                        {survey.status === "متاح" ? (
                          <>
                            <FaCheckCircle className={styles.statusIcon} />
                            متاح
                          </>
                        ) : (
                          "مغلق"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.surveyContent}>
                  <p className={styles.surveyDescription}>{survey.description}</p>
                  
                  <div className={styles.surveyMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>عدد الأسئلة:</span>
                      <span className={styles.metaValue}>{survey.questions} سؤال</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>الوقت المقدر:</span>
                      <span className={styles.metaValue}>{survey.estimatedTime}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>عدد المشاركين:</span>
                      <span className={styles.metaValue}>{survey.participants}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>آخر تحديث:</span>
                      <span className={styles.metaValue}>{survey.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <div className={styles.surveyActions}>
                    <button className={styles.participateButton}>
                      <FaClipboardList className={styles.actionIcon} />
                      <span>المشاركة في الاستبيان</span>
                    </button>
                    
                    <button className={styles.resultsButton}>
                      <FaExternalLinkAlt className={styles.actionIcon} />
                      <span>عرض النتائج</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <h3>لا توجد استبيانات {activeTab === 'available' ? 'متاحة' : activeTab === 'closed' ? 'مغلقة' : ''} حالياً</h3>
              <p>يرجى التحقق لاحقاً من وجود استبيانات جديدة.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveysPage;
