"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FaRegCalendarAlt,
  FaFileAlt,
  FaRegImage,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { circularAPI } from "../../services/api";
import styles from "../../styles/Circulars.module.css";
import {
  type Activity,
  getTitle,
  getDesc,
  getImg,
  getDate,
  formatDate,
  listFrom,
  buildPageList,
} from "../activities/_lib";

const CircularsPage = () => {
  const [items, setItems] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [detailsFor, setDetailsFor] = useState<Activity | null>(null);
  const [detailsData, setDetailsData] = useState<Activity | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [imageFor, setImageFor] = useState<Activity | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await circularAPI.getAll(currentPage);
        if (cancelled) return;
        setItems(listFrom(data));
        setTotalPages(Math.max(1, Number(data?.totalPages) || 1));
      } catch {
        if (!cancelled) {
          setItems([]);
          setError("تعذّر تحميل التعاميم، يرجى المحاولة لاحقًا.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const lockScroll = (locked: boolean) => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = locked ? "hidden" : "";
    }
  };

  const openDetails = useCallback(async (circular: Activity) => {
    setDetailsFor(circular);
    setDetailsData(null);
    lockScroll(true);
    if (circular.id === undefined || circular.id === null) return;
    setDetailsLoading(true);
    try {
      const data = await circularAPI.getById(circular.id as string | number);
      const d = data as Record<string, unknown> | null;
      const full =
        (d?.activity as Activity) ||
        (d?.circular as Activity) ||
        (d?.data as Activity) ||
        (d?.result as Activity) ||
        (d as Activity);
      if (full && (getTitle(full) || getDesc(full))) setDetailsData(full);
    } catch {
      /* keep the list item as fallback */
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const closeDetails = () => {
    setDetailsFor(null);
    setDetailsData(null);
    lockScroll(false);
  };

  const openImage = (circular: Activity) => {
    setImageFor(circular);
    lockScroll(true);
  };

  const closeImage = () => {
    setImageFor(null);
    lockScroll(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (imageFor) closeImage();
      else if (detailsFor) closeDetails();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imageFor, detailsFor]);

  const handlePage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const detailShown = detailsData || detailsFor;
  const pageList = buildPageList(currentPage, totalPages);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>التعاميم</h1>
          <p className={styles.subtitle}>
            أحدث التعاميم والقرارات الصادرة من الغرفة التجارية والجهات ذات
            العلاقة.
          </p>
        </div>
      </header>

      <main className={styles.content}>
        {loading ? (
          <div className={styles.stateBox}>
            <span className={styles.spinner} aria-hidden />
            <p>جارِ تحميل التعاميم…</p>
          </div>
        ) : error ? (
          <div className={styles.stateBox}>
            <h3>تعذّر تحميل المحتوى</h3>
            <p>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.stateBox}>
            <h3>لا توجد تعاميم لعرضها حاليًا</h3>
            <p>يرجى المحاولة لاحقًا.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((c, i) => (
              <article key={(c.id as React.Key) ?? i} className={styles.card}>
                <div className={styles.cardBody}>
                  {getDate(c) && (
                    <div className={styles.cardDate}>
                      <FaRegCalendarAlt aria-hidden />
                      {formatDate(getDate(c))}
                    </div>
                  )}
                  <h2 className={styles.cardTitle}>{getTitle(c)}</h2>
                  {getDesc(c) && (
                    <p className={styles.cardExcerpt}>{getDesc(c)}</p>
                  )}
                </div>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={() => openDetails(c)}
                  >
                    <FaFileAlt aria-hidden /> تفاصيل التعميم
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => openImage(c)}
                  >
                    <FaRegImage aria-hidden /> صورة التعميم
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <>
            <nav className={styles.pager} aria-label="ترقيم الصفحات">
              <button
                type="button"
                className={styles.pagerBtn}
                onClick={() => handlePage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="الصفحة السابقة"
              >
                <FaChevronRight aria-hidden />
              </button>
              {pageList.map((p, i) =>
                p === "…" ? (
                  <span key={`gap-${i}`} className={styles.pagerGap}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.pagerBtn} ${
                      p === currentPage ? styles.pagerActive : ""
                    }`}
                    onClick={() => handlePage(p as number)}
                    aria-current={p === currentPage ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                type="button"
                className={styles.pagerBtn}
                onClick={() => handlePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="الصفحة التالية"
              >
                <FaChevronLeft aria-hidden />
              </button>
            </nav>
            <p className={styles.pageInfo}>
              الصفحة {currentPage} من {totalPages}
            </p>
          </>
        )}
      </main>

      {/* Details modal */}
      {detailsFor && detailShown && (
        <div className={styles.overlay} onClick={closeDetails}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHead}>
              <h3 className={styles.modalTitle}>
                {getTitle(detailShown) || "تفاصيل التعميم"}
              </h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={closeDetails}
                aria-label="إغلاق"
              >
                <FaTimes aria-hidden />
              </button>
            </div>
            <div className={styles.modalBody}>
              {detailsLoading && !detailsData ? (
                <div className={styles.modalLoading}>
                  <span className={styles.spinner} aria-hidden />
                  <p>جارِ تحميل التفاصيل…</p>
                </div>
              ) : getDesc(detailShown) ? (
                getDesc(detailShown)
                  .split(/\n+/)
                  .map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p>لا يوجد نص تفصيلي متاح لهذا التعميم.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image modal */}
      {imageFor && (
        <div className={styles.overlay} onClick={closeImage}>
          <div
            className={`${styles.modal} ${styles.imageModal}`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={`${styles.modalClose} ${styles.imageClose}`}
              onClick={closeImage}
              aria-label="إغلاق"
            >
              <FaTimes aria-hidden />
            </button>
            <div className={styles.imageWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getImg(imageFor)} alt={getTitle(imageFor)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircularsPage;
