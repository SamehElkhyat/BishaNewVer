import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/NewsSections.module.css";
import { newsAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import PaginationComponent from "../components/PaginationComponent";

export default function EventsSection() {
  // State for news data from API
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [apiPage, setApiPage] = useState(1);

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
      if (window.innerWidth >= 1400) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 992) {
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

  // Format date
  const formatDate = (dateString) => {
    try {
      let date;
      if (dateString && dateString.includes("T")) {
        // ISO format
        date = new Date(dateString);
      } else if (dateString) {
        // DD/MM/YYYY format
        const [day, month, year] = dateString.split("/");
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        return { day: "", month: "", year: "" };
      }

      const day = date.getDate().toString().padStart(2, "0");
      const monthNum = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      const monthNames = {
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

      return {
        day,
        month: monthNames[monthNum],
        year,
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { day: "", month: "", year: "" };
    }
  };

  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await newsAPI.getAllCirculars(apiPage);

        if (data && data.newsPaper) {
          setApiPage(data.pageNumber);
          setTotalPages(data.totalPages);
          setEventsData(data.newsPaper);
        } else {
          setError("لا توجد بيانات متاحة");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [apiPage]);

  // Carousel navigation
  const handleCarouselNavigation = (direction) => {
    if (eventsData.length <= itemsPerPage) return;

    const maxPages = Math.ceil(eventsData.length / itemsPerPage) - 1;

    if (direction === "next") {
      setCurrentPage((prev) => (prev >= maxPages ? 0 : prev + 1));
    } else {
      setCurrentPage((prev) => (prev <= 0 ? maxPages : prev - 1));
    }
  };

  // Auto-scroll carousel within current API page
  useEffect(() => {
    if (eventsData.length <= itemsPerPage) return;

    const interval = setInterval(() => {
      handleCarouselNavigation("next");
    }, 5000);

    return () => clearInterval(interval);
  }, [eventsData.length, itemsPerPage, currentPage]);

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
    return eventsData.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => {
    setApiPage(page);
    setCurrentPage(0); // Reset carousel to first item when changing API page
  };
  return (
    <section className={styles.newsSection}>
      <div className={styles.newsContainer}>
        <h2 className={styles.sectionTitle}>اخر الاعلانات</h2>

        <div className={styles.contentContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>جاري تحميل الاعلانات...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          ) : eventsData.length === 0 ? (
            <div className={styles.noResults}>
              <h3>لا توجد فعاليات متاحة</h3>
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
                    {getCurrentItems().map((news, index) => {
                      const { day, month, year } = formatDate(news.createdAt);

                      return (
                        <motion.div
                          key={news.id}
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
                          <Link
                            href={`/media-center/circulars/${news.id}`}
                            className={styles.newsCardLink}
                          >
                            <div className={styles.newsImage}>
                              <Image
                                loading="lazy"
                                src={news.imageUrl || "/events-placeholder.jpg"}
                                alt={news.title}
                                width={400}
                                height={250}
                                className={styles.cardImage}
                              />
                            </div>
                            <div className={styles.newsContent}>
                              <div className={styles.newsDate}>
                                <div className={styles.dateBox}>
                                  <span className={styles.dateNumber}>
                                    {day}
                                  </span>
                                  <span
                                    className={styles.dateText}
                                  >{`${month} ${year}`}</span>
                                </div>
                              </div>
                              <h3 className={styles.newsTitle}>{news.title}</h3>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Carousel controls for items within current page */}
              {eventsData.length > itemsPerPage && (
                <div className={styles.carouselControls}>
                  <button
                    className={`${styles.carouselButton} ${styles.prevButton}`}
                    onClick={() => handleCarouselNavigation("prev")}
                    aria-label="Previous events"
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
                      length: Math.ceil(eventsData.length / itemsPerPage),
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
                    aria-label="Next events"
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

              {/* API Pagination for navigating between pages */}
              <PaginationComponent
                currentPage={apiPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
