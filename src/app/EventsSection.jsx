import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/NewsSections.module.css";
import { circularAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { getTitle, getDesc, getImg, getDate, toDate, listFrom } from "./activities/_lib";

const MONTH_NAMES = {
  "01": "يناير",
  "02": "فبراير",
  "03": "مارس",
  "04": "أبريل",
  "05": "مايو",
  "06": "يونيو",
  "07": "يوليو",
  "08": "أغسطس",
  "09": "سبتمبر",
  10: "أكتوبر",
  11: "نوفمبر",
  12: "ديسمبر",
};

export default function EventsSection() {
  // State for circulars data from API
  const [circularsData, setCircularsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Carousel states
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const carouselRef = useRef(null);

  // Items per page based on screen size
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatBadgeDate = (rawDate) => {
    const date = toDate(rawDate);
    if (!date) return { day: "", month: "", year: "" };

    const day = date.getDate().toString().padStart(2, "0");
    const monthNum = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return { day, month: MONTH_NAMES[monthNum], year };
  };

  // Fetch circulars data from API
  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await circularAPI.getAll(1);
        const list = listFrom(data);

        if (list.length > 0) {
          setCircularsData(list);
        } else {
          setError("لا توجد بيانات متاحة");
        }
      } catch (err) {
        console.error("Error fetching circulars:", err);
        setError("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchCirculars();
  }, []);

  // Carousel navigation
  const handleCarouselNavigation = (direction) => {
    if (circularsData.length <= itemsPerPage) return;

    const maxPages = Math.ceil(circularsData.length / itemsPerPage) - 1;

    if (direction === "next") {
      setCurrentPage((prev) => (prev >= maxPages ? 0 : prev + 1));
    } else {
      setCurrentPage((prev) => (prev <= 0 ? maxPages : prev - 1));
    }
  };

  // Auto-scroll carousel
  useEffect(() => {
    if (circularsData.length <= itemsPerPage) return;

    const interval = setInterval(() => {
      handleCarouselNavigation("next");
    }, 5000);

    return () => clearInterval(interval);
  }, [circularsData.length, itemsPerPage, currentPage]);

  // Mouse drag handlers for carousel
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Get current page items
  const getCurrentItems = () => {
    const startIndex = currentPage * itemsPerPage;
    return circularsData.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <section className={styles.newsSection}>
      <div className={styles.newsContainer}>
        <h2 className={styles.sectionTitle}>أحدث التعاميم</h2>

        <div className={styles.contentContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>جاري تحميل التعاميم...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          ) : circularsData.length === 0 ? (
            <div className={styles.noResults}>
              <h3>لا توجد تعاميم متاحة</h3>
            </div>
          ) : (
            <>
              <div
                className={styles.newsCarousel}
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    className={styles.carouselItems}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    {getCurrentItems().map((circular, index) => {
                      const { day, month, year } = formatBadgeDate(getDate(circular));
                      const title = getTitle(circular);
                      const desc = getDesc(circular);
                      const img = getImg(circular);

                      return (
                        <motion.div
                          key={circular.id ?? index}
                          className={styles.newsCard}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: index * 0.1 },
                          }}
                          whileHover={{
                            y: -5,
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                            transition: { duration: 0.2 },
                          }}
                        >
                          <Link href="/circulars" className={styles.newsCardLink}>
                            <div className={styles.newsImage}>
                              <Image
                                loading="lazy"
                                src={img}
                                alt={title}
                                width={600}
                                height={400}
                                className={styles.cardImage}
                              />
                              <div className={styles.imageScrim} />
                              {day && (
                                <div className={styles.dateBadge}>
                                  <span className={styles.dateNumber}>{day}</span>
                                  <span
                                    className={styles.dateText}
                                  >{`${month} ${year}`}</span>
                                </div>
                              )}
                            </div>
                            <div className={styles.newsContent}>
                              <h3 className={styles.newsTitle}>{title}</h3>
                              {desc && (
                                <p className={styles.newsExcerpt}>
                                  {desc.replace(/<[^>]*>/g, "").substring(0, 110)}
                                </p>
                              )}
                              <span className={styles.newsReadMore}>
                                التفاصيل
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className={styles.readMoreIcon}
                                >
                                  <path
                                    d="M19 12H5M5 12l6-6M5 12l6 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Carousel controls for items within current page */}
              {circularsData.length > itemsPerPage && (
                <div className={styles.carouselControls}>
                  <button
                    className={`${styles.carouselButton} ${styles.prevButton}`}
                    onClick={() => handleCarouselNavigation("prev")}
                    aria-label="Previous circulars"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 18l-6-6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div className={styles.carouselIndicators}>
                    {Array.from({
                      length: Math.ceil(circularsData.length / itemsPerPage),
                    }).map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.carouselIndicator} ${
                          index === currentPage ? styles.activeIndicator : ""
                        }`}
                        onClick={() => setCurrentPage(index)}
                        aria-label={`Go to carousel page ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    className={`${styles.carouselButton} ${styles.nextButton}`}
                    onClick={() => handleCarouselNavigation("next")}
                    aria-label="Next circulars"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 18l6-6-6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
