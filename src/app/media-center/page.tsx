"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { newsAPI } from "../../services/api";
import styles from "../../styles/MediaCenter.module.css";

type Tab = "all" | "news" | "circulars";

type MediaItem = {
  id: number | string;
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  imageURL?: string;
  image?: string;
  createdAt?: string;
  date?: string;
  type?: string;
  category?: string;
  _kind: "news" | "circulars";
};

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "news", label: "الأخبار" },
  { id: "circulars", label: "الإعلانات" },
];

const MONTHS: Record<string, string> = {
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

const toDate = (value?: string): Date | null => {
  if (!value) return null;
  try {
    if (value.includes("T")) return new Date(value);
    const [day, month, year] = value.split("/");
    if (day && month && year) {
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
};

const formatDate = (value?: string): string => {
  const date = toDate(value);
  if (!date || isNaN(date.getTime())) return value || "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${day} ${MONTHS[month] || ""} ${date.getFullYear()}`.trim();
};

const getImage = (item: MediaItem): string =>
  item.imageUrl || item.imageURL || item.image || "/news-placeholder.jpg";

const getExcerpt = (item: MediaItem): string => {
  const raw = (item.description || item.content || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!raw) return "";
  return raw.length > 160 ? `${raw.slice(0, 160)}…` : raw;
};

const kindMeta = (kind: "news" | "circulars") =>
  kind === "news"
    ? { label: "خبر", segment: "news" }
    : { label: "إعلان", segment: "circulars" };

/* Windowed page list — mirrors the shared PaginationComponent behaviour. */
const buildPageList = (current: number, total: number): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "…", total];
  if (current >= total - 2) {
    return [1, "…", total - 3, total - 2, total - 1, total];
  }
  return [1, "…", current - 1, current, current + 1, "…", total];
};

const MediaCenterPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        if (activeTab === "news") {
          const data = await newsAPI.getAll(currentPage);
          if (cancelled) return;
          setItems(
            (data?.newsPaper || []).map((n: MediaItem) => ({
              ...n,
              _kind: "news" as const,
            }))
          );
          setTotalPages(data?.totalPages || 1);
        } else if (activeTab === "circulars") {
          const data = await newsAPI.getAllCirculars(currentPage);
          if (cancelled) return;
          setItems(
            (data?.newsPaper || []).map((c: MediaItem) => ({
              ...c,
              _kind: "circulars" as const,
            }))
          );
          setTotalPages(data?.totalPages || 1);
        } else {
          const [newsRes, circRes] = await Promise.allSettled([
            newsAPI.getAll(currentPage),
            newsAPI.getAllCirculars(currentPage),
          ]);
          if (cancelled) return;

          if (
            newsRes.status === "rejected" &&
            circRes.status === "rejected"
          ) {
            throw new Error("both requests failed");
          }

          const news: MediaItem[] =
            newsRes.status === "fulfilled"
              ? (newsRes.value?.newsPaper || []).map((n: MediaItem) => ({
                  ...n,
                  _kind: "news" as const,
                }))
              : [];
          const circ: MediaItem[] =
            circRes.status === "fulfilled"
              ? (circRes.value?.newsPaper || []).map((c: MediaItem) => ({
                  ...c,
                  _kind: "circulars" as const,
                }))
              : [];

          const merged = [...news, ...circ].sort((a, b) => {
            const da = toDate(a.createdAt || a.date)?.getTime() ?? 0;
            const db = toDate(b.createdAt || b.date)?.getTime() ?? 0;
            return db - da;
          });

          setItems(merged);
          setTotalPages(
            Math.max(
              newsRes.status === "fulfilled"
                ? newsRes.value?.totalPages || 1
                : 1,
              circRes.status === "fulfilled"
                ? circRes.value?.totalPages || 1
                : 1
            )
          );
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setError("حدث خطأ أثناء تحميل المحتوى، يرجى المحاولة لاحقًا.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [activeTab, currentPage]);

  const handleTab = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setCurrentPage(1);
    setItems([]);
  };

  const handlePage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showFeatured = !loading && !error && items.length >= 3;
  const pageList = buildPageList(currentPage, totalPages);
  const sectionTitle =
    activeTab === "news"
      ? "الأخبار"
      : activeTab === "circulars"
      ? "الإعلانات"
      : "أحدث الأخبار والإعلانات";

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>أحدث الأخبار والإعلانات</span>
          <h1 className={styles.title}>المركز الإعلامي</h1>
          <p className={styles.subtitle}>
            تابع أحدث أخبار وإعلانات غرفة بيشة، وكن على اطلاع بكل جديد يهم مجتمع
            الأعمال في المنطقة
          </p>

          <div className={styles.tabs} role="tablist" aria-label="تصنيف المحتوى">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`${styles.tab} ${
                  activeTab === tab.id ? styles.tabActive : ""
                }`}
                onClick={() => handleTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
            <p className={styles.sectionSub}>
              تغطية لأهم الأحداث والقرارات الأخيرة
            </p>
          </div>
          {activeTab !== "all" && (
            <Link
              href={`/media-center/${activeTab}`}
              className={styles.archiveLink}
            >
              الصفحة المخصّصة <FaArrowLeft aria-hidden />
            </Link>
          )}
        </div>

        {loading ? (
          <div className={styles.stateBox}>
            <span className={styles.spinner} aria-hidden />
            <p>جارِ تحميل المحتوى…</p>
          </div>
        ) : error ? (
          <div className={styles.stateBox}>
            <h3>تعذّر تحميل المحتوى</h3>
            <p>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.stateBox}>
            <h3>لا يوجد محتوى لعرضه حاليًا</h3>
            <p>يرجى المحاولة لاحقًا أو تصفّح تصنيفًا آخر.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item, index) => {
              const meta = kindMeta(item._kind);
              const href = `/media-center/${meta.segment}/${item.id}`;
              const featured = showFeatured && index === 0;
              const date = formatDate(item.createdAt || item.date);
              const label = item.type || item.category || meta.label;
              const excerpt = getExcerpt(item);

              if (featured) {
                return (
                  <Link
                    key={`${item._kind}-${item.id}`}
                    href={href}
                    className={`${styles.card} ${styles.cardFeatured}`}
                  >
                    <div className={styles.featuredMedia}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImage(item)}
                        alt={item.title || ""}
                        loading="lazy"
                      />
                      <span className={styles.featuredScrim} aria-hidden />
                      <div className={styles.featuredBody}>
                        <div className={styles.badgeRow}>
                          <span
                            className={`${styles.kind} ${styles.kindOnDark}`}
                          >
                            {label}
                          </span>
                          {date && (
                            <span className={styles.dateOnDark}>
                              <FaCalendarAlt aria-hidden /> {date}
                            </span>
                          )}
                        </div>
                        <h3 className={styles.featuredTitle}>{item.title}</h3>
                        {excerpt && (
                          <p className={styles.featuredExcerpt}>{excerpt}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={`${item._kind}-${item.id}`}
                  href={href}
                  className={styles.card}
                >
                  <div className={styles.cardMedia}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImage(item)}
                      alt={item.title || ""}
                      loading="lazy"
                    />
                    <span
                      className={`${styles.kind} ${
                        item._kind === "circulars" ? styles.kindAlt : ""
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    {date && (
                      <span className={styles.date}>
                        <FaCalendarAlt aria-hidden /> {date}
                      </span>
                    )}
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    {excerpt && <p className={styles.cardExcerpt}>{excerpt}</p>}
                    <span className={styles.readMore}>
                      قراءة التفاصيل <FaArrowLeft aria-hidden />
                    </span>
                  </div>
                </Link>
              );
            })}
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
    </div>
  );
};

export default MediaCenterPage;
