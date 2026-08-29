"use client";
import React from 'react';
import { FaEye, FaEnvelope, FaHandshake, FaChartLine, FaUsers, FaLightbulb, FaHandHoldingHeart, FaBuilding } from 'react-icons/fa';
import styles from '../../../styles/Vision.module.css';

const VisionPage = () => {
  return (
    <div className={styles.visionContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>الرؤية والرسالة</h1>
          <p className={styles.pageDescription}>
            رؤيتنا ورسالتنا وقيمنا وأهدافنا في غرفة بيشة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.sectionWrapper}>
          <section className={styles.section}>
            <div className={styles.sectionIcon}>
              <FaEnvelope className={styles.icon} />
            </div>
            <div className={styles.sectionContent}>
              <h2 className={styles.sectionTitle}>رسالة الغرفة</h2>
              <p className={styles.sectionText}>
                تعزيز الاستثمار, وتطوير قطاع الأعمال, وتقديم خدمات متميزة.
              </p>
            </div>
          </section>
        </div>

        <div className={styles.sectionWrapper}>
          <section className={styles.section}>
            <div className={styles.sectionIcon}>
              <FaEye className={styles.icon} />
            </div>
            <div className={styles.sectionContent}>
              <h2 className={styles.sectionTitle}>رؤية الغرفـة</h2>
              <p className={styles.sectionText}>
                أن نكون رواداً في تنمية وتطوير قطاع الأعمال لتكون بيشة مركزاً تجارياً وصناعياً وزراعياً مميزاً وبيئة جاذبة للاستثمار.
              </p>
            </div>
          </section>
        </div>

        <div className={styles.valuesContainer}>
          <h2 className={styles.valuesTitle}>قيـم الغرفـة</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIconContainer}>
                <FaUsers className={styles.valueIcon} />
              </div>
              <h3 className={styles.valueTitle}>العمل بروح الفريق الواحد</h3>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIconContainer}>
                <FaChartLine className={styles.valueIcon} />
              </div>
              <h3 className={styles.valueTitle}>العمل بمهنية وكفاءة عالية لانجاز المهام</h3>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIconContainer}>
                <FaHandshake className={styles.valueIcon} />
              </div>
              <h3 className={styles.valueTitle}>الشفافية في التعامل</h3>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIconContainer}>
                <FaHandHoldingHeart className={styles.valueIcon} />
              </div>
              <h3 className={styles.valueTitle}>الأمانة والنزاهة</h3>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIconContainer}>
                <FaLightbulb className={styles.valueIcon} />
              </div>
              <h3 className={styles.valueTitle}>التشجيع على الإبداع وروح الابتكار</h3>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIconContainer}>
                <FaHandshake className={styles.valueIcon} />
              </div>
              <h3 className={styles.valueTitle}>الشكر والتقدير لمن وجب شكره</h3>
            </div>
          </div>
        </div>

        <div className={styles.goalsContainer}>
          <h2 className={styles.goalsTitle}>أهداف الغرفة</h2>
          
          <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <div className={styles.goalIconContainer}>
                <FaUsers className={styles.goalIcon} />
              </div>
              <h3 className={styles.goalTitle}>دعم شباب الأعمال</h3>
            </div>
            <div className={styles.goalContent}>
              <ul className={styles.goalList}>
                <li className={styles.goalItem}>التدريب</li>
                <li className={styles.goalItem}>تقديم استشارات وبحوث</li>
                <li className={styles.goalItem}>دعم الشباب لسوق العمل</li>
              </ul>
            </div>
          </div>

          <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <div className={styles.goalIconContainer}>
                <FaHandshake className={styles.goalIcon} />
              </div>
              <h3 className={styles.goalTitle}>بناء شراكات عمل لتطوير الكوادر وتحسين بيئة العمل</h3>
            </div>
            <div className={styles.goalContent}>
              <ul className={styles.goalList}>
                <li className={styles.goalItem}>تطوير التقنية</li>
                <li className={styles.goalItem}>إلغاء النظام الورقي</li>
                <li className={styles.goalItem}>تطوير برامج الموارد البشرية</li>
                <li className={styles.goalItem}>إعداد لائحة لتحفيز الموظفين</li>
              </ul>
            </div>
          </div>

          <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <div className={styles.goalIconContainer}>
                <FaChartLine className={styles.goalIcon} />
              </div>
              <h3 className={styles.goalTitle}>تنمية موارد الغرفة</h3>
            </div>
            <div className={styles.goalContent}>
              <ul className={styles.goalList}>
                <li className={styles.goalItem}>تطوير التدريب</li>
                <li className={styles.goalItem}>تنظيم فعاليات</li>
                <li className={styles.goalItem}>تأسيس مبنى إداري لاستثماره</li>
                <li className={styles.goalItem}>استئجار أراضي من الدولة لاستثمارها</li>
              </ul>
            </div>
          </div>

          <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <div className={styles.goalIconContainer}>
                <FaUsers className={styles.goalIcon} />
              </div>
              <h3 className={styles.goalTitle}>تعزيز دور اللجان النوعية</h3>
            </div>
            <div className={styles.goalContent}>
              <ul className={styles.goalList}>
                <li className={styles.goalItem}>إعداد لائحة خاصة باللجان</li>
                <li className={styles.goalItem}>عمل أيقونة اللجان بالموقع الالكتروني للتواصل</li>
                <li className={styles.goalItem}>استقطاب ودعوة مدراء الأجهزة الحكومية بهدف تسهيل العقبات</li>
                <li className={styles.goalItem}>تعزيز نشر فعاليات اللجان والتصويت لها</li>
              </ul>
            </div>
          </div>

          <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <div className={styles.goalIconContainer}>
                <FaHandHoldingHeart className={styles.goalIcon} />
              </div>
              <h3 className={styles.goalTitle}>دعم المرأة</h3>
            </div>
            <div className={styles.goalContent}>
              <ul className={styles.goalList}>
                <li className={styles.goalItem}>دعم الأسر المنتجة</li>
                <li className={styles.goalItem}>التدريب للسيدات والشابات</li>
                <li className={styles.goalItem}>دعم التوطين للسيدات والشابات</li>
              </ul>
            </div>
          </div>

          <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <div className={styles.goalIconContainer}>
                <FaHandshake className={styles.goalIcon} />
              </div>
              <h3 className={styles.goalTitle}>تقديم خدمة مميزة للمنتسبين</h3>
            </div>
            <div className={styles.goalContent}>
              <ul className={styles.goalList}>
                <li className={styles.goalItem}>دعم مشتركين الدرجة الممتازة والأولى</li>
                <li className={styles.goalItem}>تطوير الموقع الالكتروني لخدمة المشترك</li>
                <li className={styles.goalItem}>تزويد المشتركين بمطبوعات وإصدارات الغرفة</li>
              </ul>
            </div>
          </div>

          <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <div className={styles.goalIconContainer}>
                <FaLightbulb className={styles.goalIcon} />
              </div>
              <h3 className={styles.goalTitle}>دعم وتقديم الاستشارات والدراسات والبحوث</h3>
            </div>
            <div className={styles.goalContent}>
              <ul className={styles.goalList}>
                <li className={styles.goalItem}>تقديم دراسات واستشارات للمنشآت الصغيرة والمتوسطة</li>
                <li className={styles.goalItem}>تقديم استشارات ودراسات لشباب الأعمال وسيدات الأعمال</li>
              </ul>
            </div>
          </div>

          <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <div className={styles.goalIconContainer}>
                <FaBuilding className={styles.goalIcon} />
              </div>
              <h3 className={styles.goalTitle}>استقطاب الاستثمار</h3>
            </div>
            <div className={styles.goalContent}>
              <ul className={styles.goalList}>
                <li className={styles.goalItem}>القيام بدراسات عن الفرص الاستثمارية</li>
                <li className={styles.goalItem}>إقامة منتديات وفعاليات</li>
                <li className={styles.goalItem}>جذب المستثمرين وعرض الفرص لهم</li>
                <li className={styles.goalItem}>استكمال العمل بالمدينة الصناعية</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionPage;
