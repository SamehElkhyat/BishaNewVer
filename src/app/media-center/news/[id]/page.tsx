"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaCalendarAlt, FaTag, FaArrowRight, FaShare, FaFacebookF, FaWhatsapp, FaCopy, FaEye, FaHome, FaNewspaper, FaTimes, FaExpand, FaDownload, FaSearchPlus } from 'react-icons/fa';
import styles from '../../../../styles/NewsDetail.module.css';
import { newsAPI } from '../../../../services/api';

// Define types for API responses
interface NewsItem {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
  imageUrl: string;
}

interface PaginatedResponse {
  newsPaper: NewsItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
}

const NewsDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  // Custom X (Twitter) logo component
  const XLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor' }}>
      <g>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </g>
    </svg>
  );
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);

  // Fetch news item from API
  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await newsAPI.getById(id);
        
        if (data) {
          setNewsItem(data);
          
          // Fetch related news (we'll get all news and filter)
          try {
            const allNewsData: PaginatedResponse = await newsAPI.getAll(1);
            if (allNewsData && allNewsData.newsPaper) {
              // Filter related news (same category, excluding current)
              const related = allNewsData.newsPaper
                .filter(item => item.type === data.type && item.id !== id)
                .slice(0, 3);
              
              setRelatedNews(related);
            }
          } catch (err) {
            console.error('Error fetching related news:', err);
            setRelatedNews([]);
          }
        } else {
          setError('الخبر غير موجود');
          setNewsItem(null);
        }
      } catch (err) {
        console.error('Error fetching news item:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
        setNewsItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsItem();
    }
  }, [id]);

  // Format date function to show day, month and year
  const formatDate = (dateString: string) => {
    try {
      let date;
      if (dateString && dateString.includes('T')) {
        // ISO format
        date = new Date(dateString);
      } else if (dateString) {
        // DD/MM/YYYY format
        const [day, month, year] = dateString.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        return '';
      }
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      const monthNames: { [key: string]: string } = {
        '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
        '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
        '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
      };
      
      return `${day} ${monthNames[month]} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if there's an error
    }
  };

  // Share functions
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(newsItem?.title || '');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(newsItem?.title || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(newsItem?.title || '');
    window.open(`https://wa.me/?text=${title}%20${url}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط بنجاح!');
      setShowShareMenu(false);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('فشل في نسخ الرابط');
    }
  };

  // Simulate view count (in real app, this would be from API)
  useEffect(() => {
    if (newsItem) {
      setViewCount(Math.floor(Math.random() * 1000) + 100);
    }
  }, [newsItem]);

  // Image modal functions
  const openImageModal = () => {
    setIsImageModalOpen(true);
    setImageZoom(1);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setImageZoom(1);
  };

  const zoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setImageZoom(1);
  };

  const downloadImage = () => {
    if (newsItem?.imageUrl) {
      const link = document.createElement('a');
      link.href = newsItem.imageUrl;
      link.download = `${newsItem.title}-image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle keyboard events for image modal
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isImageModalOpen) {
        switch (e.key) {
          case 'Escape':
            closeImageModal();
            break;
          case '+':
          case '=':
            zoomIn();
            break;
          case '-':
            zoomOut();
            break;
          case '0':
            resetZoom();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isImageModalOpen]);

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري تحميل الخبر...</p>
      </div>
    );
  }
  
  // Show error state
  if (error || !newsItem) {
    return (
      <div className={styles.notFound}>
        <h1>الخبر غير موجود</h1>
        <p>{error || 'عذراً، الخبر الذي تبحث عنه غير موجود.'}</p>
        <Link href="/media-center/news" className={styles.backButton}>
          <FaArrowRight className={styles.backIcon} /> العودة إلى الأخبار
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.newsDetailContainer}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link href="/" className={styles.breadcrumbLink}>
          <FaHome className={styles.breadcrumbIcon} />
          الرئيسية
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/media-center/news" className={styles.breadcrumbLink}>
          <FaNewspaper className={styles.breadcrumbIcon} />
          الأخبار
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>تفاصيل الخبر</span>
      </div>

      <div className={styles.backLink}>
        <Link href="/media-center/news" className={styles.backButton}>
          <FaArrowRight className={styles.backIcon} /> العودة إلى الأخبار
        </Link>
      </div>

      <div className={styles.newsDetailContent}>
        <div className={styles.newsHeader}>
          <h1 className={styles.newsTitle}>{newsItem.title}</h1>
          <div className={styles.newsMetadata}>
            <div className={styles.metadataLeft}>
              <span className={styles.newsDate}>
                <FaCalendarAlt className={styles.metaIcon} />
                {formatDate(newsItem.date)}
              </span>
              <span className={styles.newsCategory}>
                <FaTag className={styles.metaIcon} />
                {newsItem.type}
              </span>
              <span className={styles.viewCount}>
                <FaEye className={styles.metaIcon} />
                {viewCount} مشاهدة
              </span>
            </div>
            <div className={styles.metadataRight}>
              <div className={styles.shareContainer}>
                <button 
                  className={styles.shareButton}
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <FaShare className={styles.shareIcon} />
                  مشاركة
                </button>
                {showShareMenu && (
                  <div className={styles.shareMenu}>
                    <button onClick={shareOnFacebook} className={styles.shareOption}>
                      <FaFacebookF className={styles.shareOptionIcon} />
                      فيسبوك
                    </button>
                    <button onClick={shareOnTwitter} className={styles.shareOption}>
                      <XLogo />
                      تويتر
                    </button>
                    <button onClick={shareOnWhatsApp} className={styles.shareOption}>
                      <FaWhatsapp className={styles.shareOptionIcon} />
                      واتساب
                    </button>
                    <button onClick={copyToClipboard} className={styles.shareOption}>
                      <FaCopy className={styles.shareOptionIcon} />
                      نسخ الرابط
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.newsImageContainer} onClick={openImageModal}>
          <img
            src={newsItem.imageUrl || "/news-placeholder.jpg"}
            alt={newsItem.title}
            className={styles.newsImage}
            style={{ width: '100%', height: 'auto' }}
          />
          <div className={styles.imageOverlay}>
            <div className={styles.imageOverlayContent}>
              <FaSearchPlus className={styles.overlayIcon} />
              <span className={styles.overlayText}>اضغط لعرض الصورة بالحجم الكامل</span>
            </div>
          </div>
        </div>

        <div className={styles.newsBody}>
          <p className={styles.newsContent}>{newsItem.description}</p>
        </div>

        {relatedNews.length > 0 && (
          <div className={styles.relatedNews}>
            <h2 className={styles.relatedTitle}>أخبار ذات صلة</h2>
            <div className={styles.relatedGrid}>
              {relatedNews.map((news) => (
                <div key={news.id} className={styles.relatedCard}>
                  <div className={styles.relatedImageContainer}>
                    <img
                      src={news.imageUrl || "/news-placeholder.jpg"}
                      alt={news.title}
                      className={styles.relatedImage}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                  <div className={styles.relatedContent}>
                    <h3 className={styles.relatedNewsTitle}>{news.title}</h3>
                    <Link href={`/media-center/news/${news.id}`} className={styles.relatedLink}>
                      اقرأ المزيد
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      {isImageModalOpen && (
        <div className={styles.imageModal} onClick={closeImageModal}>
          <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.imageModalHeader}>
              <div className={styles.imageModalTitle}>
                <h3>{newsItem.title}</h3>
                <p>صورة الخبر - {formatDate(newsItem.date)}</p>
              </div>
              <div className={styles.imageModalControls}>
                <button onClick={zoomOut} className={styles.zoomButton} title="تصغير">
                  -
                </button>
                <span className={styles.zoomLevel}>{Math.round(imageZoom * 100)}%</span>
                <button onClick={zoomIn} className={styles.zoomButton} title="تكبير">
                  +
                </button>
                <button onClick={resetZoom} className={styles.resetButton} title="إعادة تعيين">
                  1:1
                </button>
                <button onClick={downloadImage} className={styles.downloadButton} title="تحميل">
                  <FaDownload />
                </button>
                <button onClick={closeImageModal} className={styles.closeButton} title="إغلاق">
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal Image */}
            <div className={styles.imageModalBody}>
              <div 
                className={styles.imageWrapper}
                style={{ transform: `scale(${imageZoom})` }}
              >
                <Image
                            loading="lazy"

                  src={newsItem.imageUrl || "/news-placeholder.jpg"}
                  alt={newsItem.title}
                  width={1200}
                  height={800}
                  className={styles.modalImage}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className={styles.imageModalFooter}>
              <div className={styles.imageInfo}>
                <div className={styles.imageDetails}>
                  <span><strong>العنوان:</strong> {newsItem.title}</span>
                  <span><strong>التاريخ:</strong> {formatDate(newsItem.date)}</span>
                  <span><strong>الفئة:</strong> {newsItem.type}</span>
                </div>
                <div className={styles.imageInstructions}>
                  <small>
                    استخدم الأزرار للتحكم أو اضغط: + للتكبير، - للتصغير، 0 للإعادة، Esc للإغلاق
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;
