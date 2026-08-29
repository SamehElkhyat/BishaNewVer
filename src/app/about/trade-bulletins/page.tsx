"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import styles from "../../../styles/TradeBulletins.module.css";

// Trade bulletins data
const tradeBulletins = [
  {
    id: 1,
    title: "النشرة التجارية يناير 2025",
    month: "يناير",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.2 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر يناير 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 2,
    title: "النشرة التجارية فبراير 2025",
    month: "فبراير",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.5 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر فبراير 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 3,
    title: "النشرة التجارية مارس 2025",
    month: "مارس",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.8 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر مارس 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 4,
    title: "النشرة التجارية ابريل 2025",
    month: "ابريل",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.4 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر ابريل 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 5,
    title: "النشرة التجارية مايو 2025",
    month: "مايو",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.6 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر مايو 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 6,
    title: "النشرة التجارية يونيو 2025",
    month: "يونيو",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.3 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر يونيو 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 7,
    title: "النشرة التجارية يوليو 2025",
    month: "يوليو",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.7 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر يوليو 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 8,
    title: "النشرة التجارية أغسطس 2025",
    month: "أغسطس",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.5 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر أغسطس 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 9,
    title: "النشرة التجارية سبتمبر 2025",
    month: "سبتمبر",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.4 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر سبتمبر 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 10,
    title: "النشرة التجارية أكتوبر 2025",
    month: "أكتوبر",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.6 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر أكتوبر 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 11,
    title: "النشرة التجارية نوفمبر 2025",
    month: "نوفمبر",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.3 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر نوفمبر 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
  {
    id: 12,
    title: "النشرة التجارية ديسمبر 2025",
    month: "ديسمبر",
    year: 2025,
    image: "/bulletin-placeholder.jpg",
    fileSize: "3.8 MB",
    description:
      "النشرة التجارية الشهرية لغرفة بيشة لشهر ديسمبر 2025، تتضمن أهم الأخبار الاقتصادية والفعاليات والمناقصات والفرص الاستثمارية.",
  },
];

// Month order for sorting
const monthOrder = [
  "يناير",
  "فبراير",
  "مارس",
  "ابريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const TradeBulletinsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isFlipped, setIsFlipped] = useState<number | null>(null);

  // Get unique years from bulletins
  const years = [...new Set(tradeBulletins.map((bulletin) => bulletin.year))];

  // Filter bulletins based on search term, month, and year
  const filteredBulletins = tradeBulletins.filter((bulletin) => {
    const matchesSearch =
      searchTerm === "" ||
      bulletin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bulletin.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMonth =
      selectedMonth === "all" || bulletin.month === selectedMonth;
    const matchesYear = selectedYear === null || bulletin.year === selectedYear;

    return matchesSearch && matchesMonth && matchesYear;
  });

  // Sort bulletins by date
  const sortedBulletins = [...filteredBulletins].sort((a, b) => {
    if (a.year !== b.year) {
      return sortOrder === "desc" ? b.year - a.year : a.year - b.year;
    }

    const monthA = monthOrder.indexOf(a.month);
    const monthB = monthOrder.indexOf(b.month);

    return sortOrder === "desc" ? monthB - monthA : monthA - monthB;
  });

  // Toggle flip state for a bulletin
  const toggleFlip = (id: number) => {
    setIsFlipped(isFlipped === id ? null : id);
  };

  return (
    <div className={styles.bulletinsContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>النشرات التجارية</h1>
          <p className={styles.pageDescription}>
            النشرات التجارية الشهرية لغرفة بيشة، تتضمن أهم الأخبار الاقتصادية
            والفعاليات والمناقصات والفرص الاستثمارية
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="ابحث عن نشرة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>

          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>الشهر:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">جميع الشهور</option>
                {monthOrder.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>السنة:</label>
              <select
                value={selectedYear || ""}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className={styles.filterSelect}
              >
                <option value="">جميع السنوات</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>الترتيب:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className={styles.filterSelect}
              >
                <option value="desc">الأحدث أولاً</option>
                <option value="asc">الأقدم أولاً</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.bulletinsGrid}>
          {sortedBulletins.length > 0 ? (
            sortedBulletins.map((bulletin) => (
              <div
                key={bulletin.id}
                className={`${styles.bulletinCard} ${
                  isFlipped === bulletin.id ? styles.flipped : ""
                }`}
                onClick={() => toggleFlip(bulletin.id)}
              >
                <div className={styles.bulletinInner}>
                  <div className={styles.bulletinFront}>
                    <div className={styles.bulletinImageContainer}>
                      <Image
                        src={bulletin.image}
                        alt={bulletin.title}
                        width={300}
                        height={400}
                        className={styles.bulletinImage}
                        loading="lazy"
                      />
                      <div className={styles.bulletinOverlay}>
                        <div className={styles.bulletinDate}>
                          <FaCalendarAlt className={styles.dateIcon} />
                          <span>
                            {bulletin.month} {bulletin.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.bulletinInfo}>
                      <h2 className={styles.bulletinTitle}>{bulletin.title}</h2>
                      <div className={styles.bulletinSize}>
                        <span>{bulletin.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.bulletinBack}>
                    <h3 className={styles.bulletinBackTitle}>
                      {bulletin.title}
                    </h3>
                    <p className={styles.bulletinDescription}>
                      {bulletin.description}
                    </p>

                    <div className={styles.bulletinActions}>
                      <button
                        className={`${styles.actionButton} ${styles.viewButton}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaEye className={styles.actionIcon} />
                        <span>عرض النشرة</span>
                      </button>

                      <button
                        className={`${styles.actionButton} ${styles.downloadButton}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaDownload className={styles.actionIcon} />
                        <span>تحميل النشرة</span>
                      </button>
                    </div>

                    <div className={styles.flipHint}>اضغط للعودة</div>
                  </div>
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

export default TradeBulletinsPage;
