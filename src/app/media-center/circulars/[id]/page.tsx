"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaCalendarAlt, FaTag, FaArrowRight } from 'react-icons/fa';
import styles from '../../../../styles/CircularDetail.module.css';
import { newsAPI } from '../../../../services/api';

// Define types for API responses
interface CircularItem {
  id: number;
  title: string;
  date: string;
  category: string;
  content: string;
  image: string;
  imageUrl: string;
}

interface PaginatedResponse {
  newsPaper: CircularItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
}

const CircularDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [circularItem, setCircularItem] = useState<CircularItem | null>(null);
  const [relatedCirculars, setRelatedCirculars] = useState<CircularItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch circular item from API
  useEffect(() => {
    const fetchCircularItem = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await newsAPI.getById(id);
        
        if (data) {
          setCircularItem(data);
          
          // Fetch related circulars (we'll get all circulars and filter)
          try {
            const allCircularsData: PaginatedResponse = await newsAPI.getAllCirculars(1);
            if (allCircularsData && allCircularsData.newsPaper) {
              // Filter related circulars (same category, excluding current)
              const related = allCircularsData.newsPaper
                .filter(item => item.category === data.category && item.id !== id)
                .slice(0, 3);
              
              setRelatedCirculars(related);
            }
          } catch (err) {
            console.error('Error fetching related circulars:', err);
            setRelatedCirculars([]);
          }
        } else {
          setError('التعميم غير موجود');
          setCircularItem(null);
        }
      } catch (err) {
        console.error('Error fetching circular item:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
        setCircularItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCircularItem();
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

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري تحميل التعميم...</p>
      </div>
    );
  }
  
  // Show error state
  if (error || !circularItem) {
    return (
      <div className={styles.notFound}>
        <h1>التعميم غير موجود</h1>
        <p>{error || 'عذراً، التعميم الذي تبحث عنه غير موجود.'}</p>
        <Link href="/media-center/circulars" className={styles.backButton}>
          <FaArrowRight className={styles.backIcon} /> العودة إلى الاعلانات
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.circularDetailContainer}>
      <div className={styles.backLink}>
        <Link href="/media-center/circulars" className={styles.backButton}>
          <FaArrowRight className={styles.backIcon} /> العودة إلى الاعلانات
        </Link>
      </div>

      <div className={styles.circularDetailContent}>
        <div className={styles.circularHeader}>
          <h1 className={styles.circularTitle}>{circularItem.title}</h1>
          <div className={styles.circularMetadata}>
            <span className={styles.circularDate}>
              <FaCalendarAlt className={styles.metaIcon} />
              {formatDate(circularItem.date)}
            </span>
            <span className={styles.circularCategory}>
              <FaTag className={styles.metaIcon} />
              {circularItem.category}
            </span>
          </div>
        </div>

        <div className={styles.circularImageContainer}>
          <Image
                      loading="lazy"

            src={circularItem.imageUrl || "/news-placeholder.jpg"}
            alt={circularItem.title}
            width={2000}
            height={2000}
            className={styles.circularImage}
            
          />
        </div>

        <div className={styles.circularBody}>
          <p className={styles.circularContent}>{circularItem.content}</p>
        </div>

        {relatedCirculars.length > 0 && (
          <div className={styles.relatedCirculars}>
            <h2 className={styles.relatedTitle}>اعلانات ذات صلة</h2>
            <div className={styles.relatedGrid}>
              {relatedCirculars.map((circular) => (
                <div key={circular.id} className={styles.relatedCard}>
                  <div className={styles.relatedImageContainer}>
                    <Image
                                loading="lazy"

                      src={circular.imageUrl || "/news-placeholder.jpg"}
                      alt={circular.title}
                      width={300}
                      height={200}
                      className={styles.relatedImage}
                    />
                  </div>
                  <div className={styles.relatedContent}>
                    <h3 className={styles.relatedCircularTitle}>{circular.title}</h3>
                    <Link href={`/media-center/circulars/${circular.id}`} className={styles.relatedLink}>
                      اقرأ المزيد
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircularDetailPage;
