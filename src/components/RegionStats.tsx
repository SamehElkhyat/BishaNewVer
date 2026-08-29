'use client';

import React from 'react';
import styles from '../styles/Map.module.css';

interface RegionStatsProps {
  selectedRegion: string | null;
  regionData: {
    [key: string]: {
      males: number;
      females: number;
      schools: number;
      houses: number;
      subscribers: number;
      factories: number;
      population?: number;
      area?: number;
      nameEn?: string;
    };
  };
}

const RegionStats: React.FC<RegionStatsProps> = ({ selectedRegion, regionData }) => {
  const data = selectedRegion ? regionData[selectedRegion] : null;

  return (
    <div className={styles.statsContainer}>
      {selectedRegion && (
        <div className={styles.regionTitle}>
          <h2>{selectedRegion}</h2>
          {data?.nameEn && <span>({data.nameEn})</span>}
          {data?.population && data?.area && (
            <div className={styles.regionMeta}>
              <div className={styles.regionMetaItem}>
                <span>السكان:</span> {data.population.toLocaleString()}
              </div>
              <div className={styles.regionMetaItem}>
                <span>المساحة:</span> {data.area.toLocaleString()} كم²
              </div>
              <div className={styles.regionMetaItem}>
                <span>الكثافة:</span> {Math.round(data.population / data.area).toLocaleString()} شخص/كم²
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12a6 6 0 110-12 6 6 0 010 12zm-6 4a6 6 0 00-6 6v1h24v-1a6 6 0 00-6-6H6z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>عدد الذكور:</h3>
            <p>{data ? data.males.toLocaleString() : 'undefined'}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12a6 6 0 110-12 6 6 0 010 12zm-6 4a6 6 0 00-6 6v1h24v-1a6 6 0 00-6-6H6z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>عدد الإناث:</h3>
            <p>{data ? data.females.toLocaleString() : 'undefined'}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 2H9c-1.1 0-2 .9-2 2v6h2V4h10v16H9v-6H7v6c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>عدد المدارس:</h3>
            <p>{data ? data.schools.toLocaleString() : 'undefined'}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>عدد المساكن:</h3>
            <p>{data ? data.houses.toLocaleString() : 'undefined'}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>عدد المشتركين:</h3>
            <p>{data ? data.subscribers.toLocaleString() : 'undefined'}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2v-4h4v-2h-4V7h-2v4H8v2h4z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>عدد المصانع:</h3>
            <p>{data ? data.factories.toLocaleString() : 'undefined'}</p>
          </div>
        </div>
      </div>
      
      {selectedRegion && (
        <div className={styles.regionFooter}>
          <div className={styles.regionFooterStat}>
            <div className={styles.footerStatLabel}>نسبة الذكور للإناث:</div>
            <div className={styles.footerStatValue}>
              {data ? `${Math.round((data.males / (data.males + data.females)) * 100)}% : ${Math.round((data.females / (data.males + data.females)) * 100)}%` : 'undefined'}
            </div>
          </div>
          <div className={styles.regionFooterStat}>
            <div className={styles.footerStatLabel}>متوسط عدد الأفراد للمسكن:</div>
            <div className={styles.footerStatValue}>
              {data ? (data.males + data.females) / data.houses > 10 ? 'غير متوفر' : ((data.males + data.females) / data.houses).toFixed(1) : 'undefined'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionStats;