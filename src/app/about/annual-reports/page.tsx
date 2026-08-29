"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaFilePdf,
  FaDownload,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import styles from "../../../styles/AnnualReports.module.css";

// Annual reports data
const annualReports = [
  {
    id: 1,
    year: 2023,
    title: "التقرير السنوي 2023م",
    image: "/report-placeholder.jpg",
    date: "يناير 2024",
    fileSize: "5.2 MB",
    description:
      "التقرير السنوي لغرفة بيشة للعام 2023م، يتضمن أهم الإنجازات والفعاليات والبرامج التي نفذتها الغرفة خلال العام.",
  },
  {
    id: 2,
    year: 2022,
    title: "التقرير السنوي 2022م",
    image: "/report-placeholder.jpg",
    date: "يناير 2023",
    fileSize: "4.8 MB",
    description:
      "التقرير السنوي لغرفة بيشة للعام 2022م، يتضمن أهم الإنجازات والفعاليات والبرامج التي نفذتها الغرفة خلال العام.",
  },
  {
    id: 3,
    year: 2021,
    title: "التقرير السنوي 2021م",
    image: "/report-placeholder.jpg",
    date: "يناير 2022",
    fileSize: "5.5 MB",
    description:
      "التقرير السنوي لغرفة بيشة للعام 2021م، يتضمن أهم الإنجازات والفعاليات والبرامج التي نفذتها الغرفة خلال العام.",
  },
  {
    id: 4,
    year: 2020,
    title: "التقرير السنوي 2020م",
    image: "/report-placeholder.jpg",
    date: "يناير 2021",
    fileSize: "4.2 MB",
    description:
      "التقرير السنوي لغرفة بيشة للعام 2020م، يتضمن أهم الإنجازات والفعاليات والبرامج التي نفذتها الغرفة خلال العام.",
  },
  {
    id: 5,
    year: 2019,
    title: "التقرير السنوي 2019م",
    image: "/report-placeholder.jpg",
    date: "يناير 2020",
    fileSize: "4.7 MB",
    description:
      "التقرير السنوي لغرفة بيشة للعام 2019م، يتضمن أهم الإنجازات والفعاليات والبرامج التي نفذتها الغرفة خلال العام.",
  },
  {
    id: 6,
    year: 2018,
    title: "التقرير السنوي 2018م",
    image: "/report-placeholder.jpg",
    date: "يناير 2019",
    fileSize: "5.0 MB",
    description:
      "التقرير السنوي لغرفة بيشة للعام 2018م، يتضمن أهم الإنجازات والفعاليات والبرامج التي نفذتها الغرفة خلال العام.",
  },
  {
    id: 7,
    year: 2017,
    title: "التقرير السنوي 2017م",
    image: "/report-placeholder.jpg",
    date: "يناير 2018",
    fileSize: "4.5 MB",
    description:
      "التقرير السنوي لغرفة بيشة للعام 2017م، يتضمن أهم الإنجازات والفعاليات والبرامج التي نفذتها الغرفة خلال العام.",
  },
];

const AnnualReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<
    (typeof annualReports)[0] | null
  >(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Filter reports based on search term
  const filteredReports = annualReports.filter((report) => {
    return (
      searchTerm === "" ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.year.toString().includes(searchTerm)
    );
  });

  // Open modal with selected report
  const openReportModal = (report: (typeof annualReports)[0]) => {
    setSelectedReport(report);
    setModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  return (
    <div className={styles.reportsContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>التقارير السنوية</h1>
          <p className={styles.pageDescription}>
            التقارير السنوية لغرفة بيشة تعرض أهم الإنجازات والفعاليات والبرامج
            التي نفذتها الغرفة خلال الأعوام السابقة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="ابحث عن تقرير..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>

        <div className={styles.reportsGrid}>
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className={styles.reportCard}
                onClick={() => openReportModal(report)}
              >
                <div className={styles.reportImageContainer}>
                  <Image
                    src={report.image}
                    alt={report.title}
                    width={300}
                    height={400}
                    className={styles.reportImage}
                    loading="lazy"
                  />
                  <div className={styles.reportOverlay}>
                    <FaFilePdf className={styles.pdfIcon} />
                  </div>
                </div>

                <div className={styles.reportInfo}>
                  <h2 className={styles.reportTitle}>{report.title}</h2>
                  <div className={styles.reportMeta}>
                    <div className={styles.reportDate}>
                      <FaCalendarAlt className={styles.metaIcon} />
                      <span>{report.date}</span>
                    </div>
                    <div className={styles.reportSize}>
                      <FaFilePdf className={styles.metaIcon} />
                      <span>{report.fileSize}</span>
                    </div>
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

      {/* Modal for displaying report details */}
      {modalOpen && selectedReport && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              <FaTimes />
            </button>

            <div className={styles.modalHeader}>
              <h2>{selectedReport.title}</h2>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalImageContainer}>
                <Image
                  src={selectedReport.image}
                  alt={selectedReport.title}
                  width={400}
                  height={550}
                  className={styles.modalImage}
                              loading="lazy"

                />
              </div>

              <div className={styles.modalInfo}>
                <div className={styles.modalMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>تاريخ النشر:</span>
                    <span className={styles.metaValue}>
                      {selectedReport.date}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>حجم الملف:</span>
                    <span className={styles.metaValue}>
                      {selectedReport.fileSize}
                    </span>
                  </div>
                </div>

                <div className={styles.modalDescription}>
                  <h3>نبذة عن التقرير</h3>
                  <p>{selectedReport.description}</p>
                </div>

                <div className={styles.modalActions}>
                  <button className={styles.actionButton}>
                    <FaDownload className={styles.actionIcon} />
                    <span>تحميل التقرير</span>
                  </button>

                  <button className={styles.actionButton}>
                    <FaFilePdf className={styles.actionIcon} />
                    <span>عرض التقرير</span>
                  </button>
                </div>

                <div className={styles.modalNote}>
                  <p>* سيتم إضافة محتوى التقرير لاحقاً</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnualReportsPage;
