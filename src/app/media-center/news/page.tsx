"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaTag, FaSearch } from "react-icons/fa";
import { newsAPI } from "../../../services/api";
import PaginationComponent from "../../../components/PaginationComponent";
import styles from "../../../styles/NewsPage.module.css";

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newsData, setNewsData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Get all unique categories
  const categories = [
    "all",
    ...new Set(
      newsData.map((item) => item.type || item.category).filter(Boolean)
    ),
  ];

  // Filter news based on search term and category
  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await newsAPI.getAll(currentPage);
        if (data && data.newsPaper) {
          setCurrentPage(data.pageNumber);
          setTotalPages(data.totalPages);
          setNewsData(data.newsPaper); // Show all data, not just 5 items
          setFilteredNews(data.newsPaper); // Initialize filtered news with all data
        } else {
          setError("لا توجد بيانات متاحة");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("حدث خطأ أثناء تحميل البيانات");
        // Use fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  //   let result = newsData; // Start with all news data

  //   if (searchTerm) {
  //     result = result.filter(
  //       (item) =>
  //         item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         item.content?.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   if (selectedCategory !== "all") {
  //     result = result.filter(
  //       (item) =>
  //         item.type === selectedCategory || item.category === selectedCategory
  //     );
  //   }

  //   setFilteredNews(result);
  // }, [searchTerm, selectedCategory, newsData]);

  // Format date function
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.newsPageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>المركز الإعلامي</h1>
          <p className={styles.pageDescription}>آخر أخبار وفعاليات غرفة بيشة</p>
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

          <div className={styles.categoryFilter}>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`${styles.categoryButton} ${
                  selectedCategory === category ? styles.activeCategory : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "الكل" : category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.newsGrid}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>جاري تحميل الأخبار...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
            </div>
          ) : filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <div key={news.id} className={styles.newsCard}>
                <div className={styles.newsImageContainer}>
                  <img
                    src={news.imageUrl || news.imageURL || "/news-placeholder.jpg"}
                    alt={news.title}
                    className={styles.newsImage}
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <div className={styles.newsOverlay}>
                    <Link
                      href={`/media-center/news/${news.id}`}
                      className={styles.readMoreButton}
                    >
                      اقرأ المزيد
                    </Link>
                  </div>
                </div>
                <div className={styles.newsContent}>
                  <div className={styles.newsMetadata}>
                    <span className={styles.newsDate}>
                      <FaCalendarAlt className={styles.metaIcon} />
                      {formatDate(news.createdAt || news.date)}
                    </span>
                    <span className={styles.newsCategory}>
                      <FaTag className={styles.metaIcon} />
                      {news.type || news.category || "أخبار"}
                    </span>
                  </div>
                  <h2 className={styles.newsTitle}>{news.title}</h2>
                  <p className={styles.newsExcerpt}>
                    {(news.description || news.content || "").substring(0, 150)}
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

export default NewsPage;
