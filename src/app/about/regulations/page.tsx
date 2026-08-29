"use client";

import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaDownload, FaExpand, FaCompress, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from '../../../styles/Regulations.module.css';

// Client-side only imports
let Document: any;
let Page: any;
let pdfjs: any;

const RegulationsPage = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);
  const pdfContainerRef = React.useRef<HTMLDivElement>(null);

  // Load PDF.js only on client side
  useEffect(() => {
    const loadPdfLibrary = async () => {
      const reactPdf = await import('react-pdf');
      Document = reactPdf.Document;
      Page = reactPdf.Page;
      pdfjs = reactPdf.pdfjs;
      
      // Use a local worker from node_modules
      import('pdfjs-dist/build/pdf.worker.entry').then(() => {
        setIsClient(true);
      });
    };

    loadPdfLibrary();
  }, []);

  // Function to handle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      pdfContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Function to handle document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  // Function to go to next page
  const goToNextPage = () => {
    if (pageNumber < (numPages || 1)) {
      setPageNumber(pageNumber + 1);
    }
  };

  // Function to go to previous page
  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  // Function to zoom in
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.5));
  };

  // Function to zoom out
  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  return (
    <div className={styles.regulationsContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>اللوائح والأنظمة</h1>
          <p className={styles.pageDescription}>
            اللوائح والأنظمة المنظمة لعمل غرفة بيشة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.pdfSection}>
          <div className={styles.pdfHeader}>
            <div className={styles.pdfTitle}>
              <FaFilePdf className={styles.pdfIcon} />
              <h2>اللائحة التنظيمية لغرفة بيشة</h2>
            </div>
            <a
              href="/CCS.pdf"
              download="CCS.pdf"
              className={styles.downloadButton}
            >
              <FaDownload /> تحميل الملف
            </a>
          </div>

          <div className={styles.pdfViewerContainer} ref={pdfContainerRef}>
            {isClient ? (
              <>
                <Document
                  file="/CCS.pdf"
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className={styles.pdfLoading}>
                      <div className={styles.loadingSpinner}></div>
                      <p>جاري تحميل الملف...</p>
                    </div>
                  }
                  error={
                    <div className={styles.pdfError}>
                      <FaFilePdf className={styles.errorIcon} />
                      <p>
                        لم يتم العثور على الملف. يرجى التأكد من وجود ملف CCS.pdf في مجلد public/
                      </p>
                    </div>
                  }
                  className={styles.pdfDocument}
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className={styles.pdfPage}
                  />
                </Document>

                <div className={styles.pdfControls}>
                  <div className={styles.pageNavigation}>
                    <button
                      onClick={goToPreviousPage}
                      disabled={pageNumber <= 1}
                      className={styles.navButton}
                    >
                      <FaChevronRight />
                    </button>
                    <span className={styles.pageInfo}>
                      صفحة {pageNumber} من {numPages || '--'}
                    </span>
                    <button
                      onClick={goToNextPage}
                      disabled={pageNumber >= (numPages || 1)}
                      className={styles.navButton}
                    >
                      <FaChevronLeft />
                    </button>
                  </div>

                  <div className={styles.zoomControls}>
                    <button onClick={zoomOut} className={styles.zoomButton}>-</button>
                    <span className={styles.zoomLevel}>{Math.round(scale * 100)}%</span>
                    <button onClick={zoomIn} className={styles.zoomButton}>+</button>
                    <button onClick={toggleFullScreen} className={styles.fullScreenButton}>
                      {isFullScreen ? <FaCompress /> : <FaExpand />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.pdfLoading}>
                <div className={styles.loadingSpinner}></div>
                <p>جاري تحميل العارض...</p>
              </div>
            )}
          </div>

          <div className={styles.pdfInstructions}>
            <h3>تعليمات:</h3>
            <ul>
              <li>استخدم أزرار التنقل للانتقال بين صفحات المستند</li>
              <li>يمكنك تكبير أو تصغير المستند باستخدام أزرار التكبير والتصغير</li>
              <li>اضغط على زر التحميل لتنزيل نسخة من المستند</li>
              <li>اضغط على زر ملء الشاشة لعرض المستند بحجم الشاشة الكاملة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationsPage;