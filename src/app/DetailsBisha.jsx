import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/DetailsBisha.module.css';

export default function DetailsBisha() {
  // State for active department (for mobile navigation)
  const [activeDepartment, setActiveDepartment] = useState(0);

  // Department data
  const departments = [
    {
      id: 1,
      title: "إدارة البحوث والدراسات",
      description: "هي الجهة المختصة في الغرفة بتقديم خدمات البحوث والدراسات...",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12h24v16H8V12zm2 2v12h20V14H10z M12 16h16v2H12v-2zm0 4h12v2H12v-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "إدارة الاستثمار",
      description: "الإدارة التي تقدم خدمات استثمارية وبناء شراكات إستراتيجية مع...",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3v18h18M9 9v12m4-8v8m4-4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "مركز المنشآت الصغيرة",
      description: "تعزيز وتطوير المشاريع الصغيرة والمتوسطة في منطقة عسير...",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2v4m0 16v-4m10-8h-4M6 10H2m17.071-5.071l-2.828 2.828M7.757 16.243l-2.828 2.828m14.142 0l-2.828-2.828M7.757 7.757L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      }
    }
  };

  // Navigation buttons for mobile
  const handlePrev = () => {
    setActiveDepartment(prev => (prev === 0 ? departments.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveDepartment(prev => (prev === departments.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className={styles.detailsSection}>
      <div className={styles.backgroundGradient}></div>
      <div className={styles.backgroundPattern}></div>
      
      <div className={styles.sectionContent}>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className={styles.sectionTitle}>
            هنا تجد كل ما يتعلق بإدارات
            <br />
            الغرفة المختلفة
          </h2>
          <div className={styles.sectionSubtitle}>الإدارات</div>
        </motion.div>

        {/* Mobile Navigation */}
        <div className={styles.mobileNavigation}>
          <motion.button 
            className={styles.navButton}
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
          <motion.button 
            className={styles.navButton}
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>

        {/* Departments Container */}
        <motion.div 
          className={styles.departmentsContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {departments.map((department, index) => (
            <motion.div 
              key={department.id} 
              className={`${styles.departmentCard} ${index === activeDepartment ? styles.activeMobile : ''}`}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className={styles.cardGlow}></div>
              <div className={styles.cardContent}>
                <h3 className={styles.departmentTitle}>{department.title}</h3>
                <p className={styles.departmentDescription}>{department.description}</p>
              </div>
              <div className={styles.iconContainer}>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconBackground}></div>
                  <div className={styles.icon}>
                    {department.icon}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}