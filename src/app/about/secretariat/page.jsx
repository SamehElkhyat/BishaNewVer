"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaUserTie,
  FaQuoteRight,
  FaQuoteLeft,
  FaEnvelope,
  FaTimes,
  FaExpand,
} from "react-icons/fa";
import styles from "../../../styles/Secretariat.module.css";
import axios from "axios";

const SecretariatPage = () => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [boardMembers, setBoardMembers] = useState({}); // تم تغيير القيمة الابتدائية إلى object
  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  const GetAllBoard = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Admin/Get-Secretary-General`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      // تأكد أننا نأخذ الكائن الأول إذا كانت مصفوفة أو الكائن نفسه
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      setBoardMembers(data);
    } catch (error) {
      console.error("Error fetching Secretary General data:", error);
    }
  };

  useEffect(() => {
    GetAllBoard();
  }, []);

  return (
    <div className={styles.secretariatContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>الأمانة العامة</h1>
          <p className={styles.pageDescription}>مكتب الأمين العام لغرفة بيشة</p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.secretarySection}>
          <div className={styles.secretaryCard}>
            <div className={styles.cardContent}>
              <div className={styles.secretaryImageContainer}>
                <div
                  className={styles.secretaryImageWrapper}
                  onClick={boardMembers?.imageUrl ? openImageModal : undefined}
                >
                  {boardMembers?.imageUrl ? (
                    <Image
                      src={boardMembers.imageUrl}
                      alt={boardMembers.fullName || "الأمين العام"}
                      width={300}
                      height={400}
                      className={styles.secretaryImage}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <FaUserTie className={styles.placeholderIcon} />
                    </div>
                  )}
                  {boardMembers?.imageUrl && (
                    <div className={styles.imageOverlay}>
                      <FaExpand className={styles.expandIcon} />
                      <span className={styles.expandText}>اضغط للتكبير</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.secretaryInfo}>
                <div className={styles.secretaryTitle}>
                  <FaUserTie className={styles.titleIcon} />
                  <h2>الأمين العام</h2>
                </div>
                <h3 className={styles.secretaryName}>
                  {boardMembers?.fullName || "جاري التحميل..."}
                </h3>

                <div className={styles.quoteContainer}>
                  <FaQuoteRight className={styles.quoteIconRight} />
                  <p className={styles.secretaryQuote}>
                    {boardMembers?.description || "نواصل المسيرة في وضع الأسس الإدارية والاستراتيجية لبناء تنمية مستدامة لقطاع أعمال حيوي."}
                  </p>
                  <FaQuoteLeft className={styles.quoteIconLeft} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contactSection}>
          <div className={styles.contactCard}>
            <div className={styles.contactHeader}>
              <FaEnvelope className={styles.contactIcon} />
              <h3>للتواصل</h3>
            </div>

            <div className={styles.contactInfo}>
              <div className={styles.emailContact}>
                <div className={styles.emailLabel}>البريد الإلكتروني:</div>
                <a
                  href={`mailto:${boardMembers?.email}`}
                  className={styles.emailLink}
                >
                  {boardMembers?.email || "لا يوجد بريد مسجل"}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>مهام الأمانة العامة</h3>
            <ul className={styles.infoList}>
              <li>تنفيذ قرارات مجلس الإدارة</li>
              <li>الإشراف على الشؤون الإدارية والمالية للغرفة</li>
              <li>تمثيل الغرفة في المحافل والاجتماعات الرسمية</li>
              <li>متابعة أعمال اللجان المختلفة</li>
              <li>إعداد التقارير الدورية عن أنشطة الغرفة</li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>الرؤية المستقبلية</h3>
            <p className={styles.infoText}>
              تسعى الأمانة العامة إلى تطوير آليات العمل وتحسين الخدمات المقدمة
              لأعضاء الغرفة، وتعزيز التواصل مع القطاعات المختلفة، والمساهمة في
              تحقيق رؤية المملكة 2030 من خلال دعم قطاع الأعمال وتشجيع الاستثمار
              في المنطقة.
            </p>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && boardMembers?.imageUrl && (
        <div className={styles.imageModal} onClick={closeImageModal}>
          <div
            className={styles.imageModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeImageModal}>
              <FaTimes />
            </button>
            <div className={styles.modalImageContainer}>
              <Image
                src={boardMembers.imageUrl}
                alt={boardMembers.fullName || "الأمين العام"}
                width={600}
                height={800}
                className={styles.modalImage}
                loading="lazy"
              />
            </div>
            <div className={styles.modalImageInfo}>
              <h3>{boardMembers.fullName}</h3>
              <p>الأمين العام - غرفة بيشة التجارية</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretariatPage;