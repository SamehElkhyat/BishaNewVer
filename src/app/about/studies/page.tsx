"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch, FaDownload, FaFilePdf, FaChartBar, FaChartLine, FaChartPie, FaChartArea } from 'react-icons/fa';
import styles from '../../../styles/Studies.module.css';

// Studies data
const studiesData = [
  {
    id: 1,
    title: "دراسة حول التنمية الزراعية في بيشة",
    category: "agriculture",
    image: "/study-agriculture.jpg",
    icon: <FaChartArea className={styles.studyIcon} />,
    fileSize: "4.8 MB",
    date: "2023",
    author: "مركز الدراسات الاقتصادية",
    description: "تتناول هذه الدراسة واقع القطاع الزراعي في محافظة بيشة وإمكانات التنمية المستدامة، وتستعرض الموارد المتاحة والتحديات التي تواجه القطاع وفرص الاستثمار المتاحة، مع تقديم توصيات لتطوير القطاع الزراعي وزيادة مساهمته في الاقتصاد المحلي.",
    highlights: [
      "تحليل الوضع الراهن للقطاع الزراعي",
      "دراسة الموارد المائية والأراضي الصالحة للزراعة",
      "تقييم المحاصيل الاستراتيجية والميزة النسبية",
      "فرص الاستثمار في التقنيات الزراعية الحديثة",
      "توصيات لتطوير القطاع الزراعي"
    ]
  },
  {
    id: 2,
    title: "دراسة حول مستقبل السياحة في بيشة",
    category: "tourism",
    image: "/study-tourism.jpg",
    icon: <FaChartLine className={styles.studyIcon} />,
    fileSize: "5.2 MB",
    date: "2024",
    author: "هيئة تطوير السياحة",
    description: "تستعرض هذه الدراسة المقومات السياحية في محافظة بيشة وآفاق تطويرها، وتتناول المواقع السياحية والتراثية والطبيعية، وتحلل الفرص الاستثمارية في القطاع السياحي، مع تقديم رؤية مستقبلية لتنمية السياحة في المحافظة بما يتوافق مع رؤية المملكة 2030.",
    highlights: [
      "تحليل المقومات السياحية في محافظة بيشة",
      "دراسة السوق السياحي المحلي والإقليمي",
      "تقييم البنية التحتية السياحية",
      "فرص الاستثمار في القطاع السياحي",
      "استراتيجية تطوير السياحة في المحافظة"
    ]
  },
  {
    id: 3,
    title: "دراسة القوة الشرائية بمحافظة بيشة",
    category: "economy",
    image: "/study-economy.jpg",
    icon: <FaChartBar className={styles.studyIcon} />,
    fileSize: "3.7 MB",
    date: "2022",
    author: "مركز الدراسات الاقتصادية",
    description: "تهدف هذه الدراسة إلى تحليل القوة الشرائية في محافظة بيشة وتأثيرها على النشاط التجاري، وتستعرض مستويات الدخل والإنفاق ونمط الاستهلاك، وتقدم تحليلاً للعوامل المؤثرة في القوة الشرائية وانعكاساتها على قطاع الأعمال، مع توصيات لتعزيز النشاط التجاري في المحافظة.",
    highlights: [
      "تحليل مستويات الدخل والإنفاق",
      "دراسة أنماط الاستهلاك",
      "تقييم العوامل المؤثرة في القوة الشرائية",
      "تأثير القوة الشرائية على قطاعات الأعمال",
      "توصيات لتعزيز النشاط التجاري"
    ]
  },
  {
    id: 4,
    title: "دراسة إنشاء مصنع للتمور والصناعات التحويلية في بيشة",
    category: "industry",
    image: "/study-industry.jpg",
    icon: <FaChartPie className={styles.studyIcon} />,
    fileSize: "6.1 MB",
    date: "2023",
    author: "هيئة تنمية الصناعة",
    description: "تقدم هذه الدراسة تحليلاً لجدوى إنشاء مصنع للتمور والصناعات التحويلية في محافظة بيشة، وتستعرض واقع إنتاج التمور في المنطقة وإمكانات التصنيع والتسويق، وتتناول الجوانب الفنية والمالية والتسويقية للمشروع، مع تقييم للأثر الاقتصادي والاجتماعي المتوقع.",
    highlights: [
      "تحليل واقع إنتاج التمور في المنطقة",
      "دراسة السوق المحلي والإقليمي والعالمي",
      "تقييم الجوانب الفنية والتقنية للمشروع",
      "التحليل المالي والاقتصادي",
      "الأثر التنموي للمشروع على المنطقة"
    ]
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'جميع القطاعات' },
  { id: 'agriculture', name: 'القطاع الزراعي' },
  { id: 'tourism', name: 'القطاع السياحي' },
  { id: 'economy', name: 'الاقتصاد' },
  { id: 'industry', name: 'الصناعة' }
];

const StudiesPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedStudy, setExpandedStudy] = useState<number | null>(null);

  // Filter studies based on search term and category
  const filteredStudies = studiesData.filter(study => {
    const matchesSearch = searchTerm === '' || 
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || study.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle expanded study
  const toggleStudy = (id: number) => {
    setExpandedStudy(expandedStudy === id ? null : id);
  };

  return (
    <div className={styles.studiesContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>الدراسات والبحوث</h1>
          <p className={styles.pageDescription}>
            مجموعة من الدراسات والبحوث التي أجريت حول محافظة بيشة في مختلف المجالات الاقتصادية والتنموية
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="ابحث عن دراسة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>

          <div className={styles.categoryFilter}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.activeCategory : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.studiesGrid}>
          {filteredStudies.length > 0 ? (
            filteredStudies.map((study) => (
              <div 
                key={study.id} 
                className={`${styles.studyCard} ${expandedStudy === study.id ? styles.expanded : ''}`}
              >
                <div className={styles.studyHeader} onClick={() => toggleStudy(study.id)}>
                  <div className={styles.studyIconContainer}>
                    {study.icon}
                  </div>
                  
                  <div className={styles.studyTitleContainer}>
                    <h2 className={styles.studyTitle}>{study.title}</h2>
                    <div className={styles.studyMeta}>
                      <span className={styles.studyDate}>{study.date}</span>
                      <span className={styles.studySize}>{study.fileSize}</span>
                    </div>
                  </div>
                </div>
                
                {expandedStudy === study.id && (
                  <div className={styles.studyContent}>
                    <div className={styles.studyImageContainer}>
                      <Image
                        src={study.image}
                        alt={study.title}
                        width={500}
                        height={300}
                        className={styles.studyImage}
                                    loading="lazy"

                      />
                    </div>
                    
                    <div className={styles.studyDetails}>
                      <div className={styles.studyAuthor}>
                        <span className={styles.authorLabel}>إعداد:</span>
                        <span className={styles.authorName}>{study.author}</span>
                      </div>
                      
                      <div className={styles.studyDescription}>
                        <p>{study.description}</p>
                      </div>
                      
                      <div className={styles.studyHighlights}>
                        <h3 className={styles.highlightsTitle}>أبرز النقاط:</h3>
                        <ul className={styles.highlightsList}>
                          {study.highlights.map((highlight, index) => (
                            <li key={index} className={styles.highlightItem}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className={styles.studyActions}>
                        <button className={styles.actionButton}>
                          <FaFilePdf className={styles.actionIcon} />
                          <span>عرض الدراسة</span>
                        </button>
                        
                        <button className={styles.actionButton}>
                          <FaDownload className={styles.actionIcon} />
                          <span>تحميل الدراسة</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <h3>لا توجد نتائج مطابقة للبحث</h3>
              <p>يرجى تغيير معايير البحث والمحاولة مرة أخرى.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudiesPage;
