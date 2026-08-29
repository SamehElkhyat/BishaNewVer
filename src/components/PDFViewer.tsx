import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaChevronLeft, FaChevronRight, FaCompress, FaExpand } from 'react-icons/fa';
import styles from '../styles/Regulations.module.css';

// Set the worker source for PDF.js
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

interface PDFViewerProps {
  pdfUrl: string;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, isFullScreen, toggleFullScreen }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

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
    <>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className={styles.pdfLoading}>
            <div className={styles.loadingSpinner}></div>
            <p>جاري تحميل الملف...</p>
          </div>
        }
        error={
          <div className={styles.pdfError}>
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
  );
};

export default PDFViewer;
