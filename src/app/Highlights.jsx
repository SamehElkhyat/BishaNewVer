import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
import styles from "../styles/Highlights.module.css";

// Static, presentational-only section that mirrors the reference design's
// "أبرز الفرص الاستثمارية" block. No data fetching or app logic.
const opportunities = [
  {
    id: 1,
    title: "مشروع زراعي محمي",
    tag: "زراعي",
    location: "بيشة - تبالة",
    size: "5 - 10 مليون ر.س",
    image: "/hero-bisha.jpg",
  },
  {
    id: 2,
    title: "مصنع مواد غذائية",
    tag: "صناعي",
    location: "المدينة الصناعية ببيشة",
    size: "15 - 25 مليون ر.س",
    image: "/hero-bisha.jpg",
  },
];

export default function Highlights() {
  return (
    <section className={styles.highlightsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>أبرز الفرص الاستثمارية</h2>
          <Link href="/services" className={styles.viewAll}>
            عرض الكل
          </Link>
        </div>

        <div className={styles.grid}>
          {opportunities.map((item) => (
            <motion.article
              key={item.id}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: item.id * 0.1 }}
            >
              <div className={styles.media}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.mediaImage}
                />
                <span className={styles.tag}>{item.tag}</span>
              </div>

              <div className={styles.body}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <div className={styles.location}>
                  <FaMapMarkerAlt aria-hidden />
                  <span>{item.location}</span>
                </div>

                <div className={styles.footer}>
                  <div className={styles.size}>
                    <span className={styles.sizeLabel}>حجم الاستثمار</span>
                    <span className={styles.sizeValue}>{item.size}</span>
                  </div>
                  <Link
                    href="/contact"
                    className={styles.cardArrow}
                    aria-label={`استفسر عن ${item.title}`}
                  >
                    <FaArrowLeft aria-hidden />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
