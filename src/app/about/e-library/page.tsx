"use client";

import React, { useState } from 'react';
import { FaSearch, FaDownload, FaFilePdf, FaBook, FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../../../styles/ELibrary.module.css';

// Library resources data
const libraryResources = [
  {
    id: 1,
    title: "دليل استخدام نظام دراسات الجدوى للمشاريع",
    type: "guide",
    category: "business",
    fileType: "pdf",
    fileSize: "3.2 MB",
    description: "دليل شامل لاستخدام نظام دراسات الجدوى للمشاريع المختلفة، يتضمن شرح تفصيلي لكافة الخطوات والمتطلبات."
  },
  {
    id: 2,
    title: "دليل الاستثمار في بيشة",
    type: "guide",
    category: "investment",
    fileType: "pdf",
    fileSize: "5.8 MB",
    description: "دليل شامل للفرص الاستثمارية المتاحة في محافظة بيشة، يتضمن معلومات عن القطاعات الواعدة والحوافز المقدمة للمستثمرين."
  },
  {
    id: 3,
    title: "دليل برامج ومبادرات دعم المنشآت الصغيرة والمتوسطة لغرفة بيشة",
    type: "guide",
    category: "sme",
    fileType: "pdf",
    fileSize: "4.5 MB",
    description: "دليل يوضح البرامج والمبادرات التي تقدمها غرفة بيشة لدعم المنشآت الصغيرة والمتوسطة، وآليات الاستفادة منها."
  },
  {
    id: 4,
    title: "دليل الخدمات الإلكترونية لغرفة بيشة",
    type: "guide",
    category: "services",
    fileType: "pdf",
    fileSize: "2.7 MB",
    description: "دليل يوضح الخدمات الإلكترونية التي تقدمها غرفة بيشة للمشتركين وآلية الاستفادة منها."
  },
  {
    id: 5,
    title: "دليل الحصول على القروض الصناعية وإعداد دراسة الجدوى الاقتصادية | الصندوق الصناعي",
    type: "guide",
    category: "finance",
    fileType: "pdf",
    fileSize: "6.3 MB",
    description: "دليل شامل حول آليات الحصول على القروض الصناعية من الصندوق الصناعي، وكيفية إعداد دراسة الجدوى الاقتصادية للمشاريع."
  },
  {
    id: 6,
    title: "اللائحة التنفيذية لنظام المنافسات والمشتريات الحكومية | وزارة المالية",
    type: "regulation",
    category: "government",
    fileType: "pdf",
    fileSize: "7.1 MB",
    description: "اللائحة التنفيذية لنظام المنافسات والمشتريات الحكومية الصادرة عن وزارة المالية، توضح الإجراءات والضوابط المتعلقة بالمنافسات الحكومية."
  },
  {
    id: 7,
    title: "دليل التراخيص | وزارة البيئة والمياه والزراعة",
    type: "guide",
    category: "licensing",
    fileType: "pdf",
    fileSize: "5.4 MB",
    description: "دليل شامل للتراخيص الصادرة عن وزارة البيئة والمياه والزراعة، يوضح متطلبات وإجراءات الحصول على التراخيص المختلفة."
  },
  {
    id: 8,
    title: "القواعد التنفيذية للائحة الجزاءات عن المخالفات البلدية وجدول المخالفات",
    type: "regulation",
    category: "municipal",
    fileType: "pdf",
    fileSize: "4.8 MB",
    description: "القواعد التنفيذية للائحة الجزاءات عن المخالفات البلدية، تتضمن جدول المخالفات والغرامات المقررة لها."
  },
  {
    id: 9,
    title: "الدليل الإرشادي للبدء بالنشاط الاقتصادي",
    type: "guide",
    category: "business",
    fileType: "pdf",
    fileSize: "3.9 MB",
    description: "دليل إرشادي شامل للبدء بالنشاط الاقتصادي، يوضح الخطوات والإجراءات اللازمة لتأسيس المشاريع التجارية."
  },
  {
    id: 10,
    title: "الدليل الإجرائي برنامج نطاقات المطور",
    type: "guide",
    category: "employment",
    fileType: "pdf",
    fileSize: "4.2 MB",
    description: "الدليل الإجرائي لبرنامج نطاقات المطور، يوضح آليات تصنيف المنشآت وفق برنامج نطاقات والتزامات المنشآت."
  },
  {
    id: 11,
    title: "نظام العمل",
    type: "regulation",
    category: "labor",
    fileType: "pdf",
    fileSize: "8.5 MB",
    description: "نظام العمل في المملكة العربية السعودية، يوضح حقوق وواجبات العاملين وأصحاب العمل والعلاقة التعاقدية بينهما."
  },
  {
    id: 12,
    title: "دليل المستثمر لتراخيص المنشآت الصحية",
    type: "guide",
    category: "health",
    fileType: "pdf",
    fileSize: "5.7 MB",
    description: "دليل شامل للمستثمرين في القطاع الصحي، يوضح متطلبات وإجراءات الحصول على تراخيص المنشآت الصحية المختلفة."
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'الكل' },
  { id: 'business', name: 'الأعمال' },
  { id: 'investment', name: 'الاستثمار' },
  { id: 'sme', name: 'المنشآت الصغيرة والمتوسطة' },
  { id: 'services', name: 'الخدمات' },
  { id: 'finance', name: 'التمويل' },
  { id: 'government', name: 'الحكومية' },
  { id: 'licensing', name: 'التراخيص' },
  { id: 'municipal', name: 'البلدية' },
  { id: 'employment', name: 'التوظيف' },
  { id: 'labor', name: 'العمل' },
  { id: 'health', name: 'الصحة' }
];

// Types for filtering
const types = [
  { id: 'all', name: 'الكل' },
  { id: 'guide', name: 'أدلة إرشادية' },
  { id: 'regulation', name: 'أنظمة ولوائح' }
];

const ELibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter resources based on search term, category, and type
  const filteredResources = libraryResources.filter(resource => {
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>المكتبة الإلكترونية</h1>
          <p className={styles.pageDescription}>
            المكتبة الإلكترونية بغرفة بيشة تعنى بإتاحة مصادر المعلومات بمختلف أشكالها للمنشآت في قطاع الأعمال
          </p>
          <p className={styles.contactInfo}>
            يمكن تصفح المصادر أدناه وفي حال الرغبة بالاستفادة من مصادر أخرى يرجى التواصل معنا على البريد: 
            <a href="mailto:bisha@bishacci.org" className={styles.emailLink}> bisha@bishacci.org</a>
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="ابحث عن مصدر معلومات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>

          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>التصنيف:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>النوع:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={styles.filterSelect}
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.resourcesGrid}>
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <div key={resource.id} className={styles.resourceCard}>
                <div className={styles.resourceIcon}>
                  {resource.type === 'guide' ? (
                    <FaBook className={styles.typeIcon} />
                  ) : (
                    <FaFilePdf className={styles.typeIcon} />
                  )}
                </div>
                
                <div className={styles.resourceInfo}>
                  <h2 className={styles.resourceTitle}>{resource.title}</h2>
                  <p className={styles.resourceDescription}>{resource.description}</p>
                  
                  <div className={styles.resourceMeta}>
                    <span className={styles.resourceType}>
                      {resource.type === 'guide' ? 'دليل إرشادي' : 'لائحة تنظيمية'}
                    </span>
                    <span className={styles.resourceSize}>
                      {resource.fileSize}
                    </span>
                  </div>
                </div>
                
                <div className={styles.resourceActions}>
                  <button className={`${styles.actionButton} ${styles.viewButton}`}>
                    <FaExternalLinkAlt className={styles.actionIcon} />
                    <span>عرض</span>
                  </button>
                  
                  <button className={`${styles.actionButton} ${styles.downloadButton}`}>
                    <FaDownload className={styles.actionIcon} />
                    <span>تحميل</span>
                  </button>
                </div>
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

export default ELibraryPage;
