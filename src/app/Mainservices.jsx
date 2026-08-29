import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaAward,
  FaSyncAlt,
  FaUserShield,
  FaUserEdit,
  FaHeadset,
  FaGraduationCap,
} from 'react-icons/fa';
import styles from '../styles/Mainservices.module.css';

export default function Mainservices() {
  // Animation variants for staggered animations
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
    hidden: { y: 30, opacity: 0 },
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

  // Quick services shown on the landing page
  const quickServices = [
    { id: 1, title: "إصدار شهادة", href: "/services", icon: <FaAward /> },
    { id: 2, title: "تجديد الاشتراك", href: "/services", icon: <FaSyncAlt /> },
    { id: 3, title: "التحقق من الوثائق", href: "/services", icon: <FaUserShield /> },
    { id: 4, title: "تحديث البيانات", href: "/services", icon: <FaUserEdit /> },
    { id: 5, title: "الاستشارات", href: "/contact", icon: <FaHeadset /> },
    { id: 6, title: "التدريب", href: "/activities", icon: <FaGraduationCap /> },
  ];

  return (
    <section className={styles.sectoralSection}>
      <div className={styles.sectionBackground}></div>
      <div className={styles.sectionOverlay}></div>

      <div className={styles.sectionContent}>
        <motion.div
          className={styles.committeesContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleGlow}>ماذا تريد أن تفعل؟</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              أكثر الخدمات طلباً في متناول يدك مباشرة
            </p>
          </motion.div>

          <div className={styles.committeesGrid}>
            {quickServices.map((service) => (
              <motion.div
                key={service.id}
                className={styles.committeeCard}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
              >
                <Link href={service.href} className={styles.committeeCardLink}>
                  <div className={styles.committeeIconWrapper}>
                    <div className={styles.committeeIcon}>
                      {service.icon}
                    </div>
                  </div>
                  <div className={styles.committeeContent}>
                    <h3 className={styles.committeeTitle}>{service.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
