"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaTag, FaSearch } from "react-icons/fa";
import styles from "../../../styles/CircularsPage.module.css";
import { newsAPI } from "../../../services/api";
import PaginationComponent from "../../../components/PaginationComponent";

const CircularsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [eventsData, setEventsData] = useState([]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // Fetch events data from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await newsAPI.getAllCirculars(currentPage);

        if (data && data.newsPaper) {
          setCurrentPage(data.pageNumber);
          setTotalPages(data.totalPages);
          setEventsData(data.newsPaper); // Show all events data
          setFilteredEvents(data.newsPaper); // Initialize filtered events with all data
        } else {
          setError("لا توجد بيانات متاحة");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("حدث خطأ أثناء تحميل البيانات");
        // Use fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage]);

  const formatDate = (dateString: string) => {
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
        return "";
      }

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      const monthNames: { [key: string]: string } = {
        "01": "يناير",
        "02": "فبراير",
        "03": "مارس",
        "04": "أبريل",
        "05": "مايو",
        "06": "يونيو",
        "07": "يوليو",
        "08": "أغسطس",
        "09": "سبتمبر",
        "10": "أكتوبر",
        "11": "نوفمبر",
        "12": "ديسمبر",
      };

      return `${day} ${monthNames[month]} ${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className={styles.circularsPageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>الاعلانات والاخبار</h1>
          <p className={styles.pageDescription}>
            آخر الاعلانات الاخبار المهمة من غرفة بيشة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="ابحث هنا..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>

        <div className={styles.eventsGrid}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>جاري تحميل الاعلانات...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
            </div>
          ) : eventsData.length > 0 ? (
            eventsData.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventImageContainer}>
                  <Image
                              loading="lazy"

                    src={
                      event.imageUrl ||
                      event.imageURL ||
                      event.image ||
                      "/news-placeholder.jpg"
                    }
                    alt={event.title}
                    width={400}
                    height={250}
                    className={styles.eventImage}
                  />
                  <div className={styles.eventOverlay}>
                    <Link
                      href={`/media-center/circulars/${event.id}`}
                      className={styles.readMoreButton}
                    >
                      اقرأ المزيد
                    </Link>
                  </div>
                </div>
                <div className={styles.eventContent}>
                  <div className={styles.eventMetadata}>
                    <span className={styles.eventDate}>
                      <FaCalendarAlt className={styles.metaIcon} />
                      {formatDate(event.createdAt || event.date)}
                    </span>
                    <span className={styles.eventCategory}>
                      <FaTag className={styles.metaIcon} />
                      {event.type || event.category || "اعلانات"}
                    </span>
                  </div>
                  <h2 className={styles.eventTitle}>{event.title}</h2>
                  <p className={styles.eventExcerpt}>
                    {(event.description || event.content || "").substring(
                      0,
                      150
                    )}
                    ...
                  </p>
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

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CircularsPage;
