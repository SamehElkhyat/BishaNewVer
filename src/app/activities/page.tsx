"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaRegCalendarAlt,
  FaRegClock,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaChevronRight,
  FaChevronLeft,
  FaCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { activityAPI } from "../../services/api";
import styles from "../../styles/Activities.module.css";
import {
  type Activity,
  getTitle,
  getDesc,
  getImg,
  getDate,
  getEndDate,
  getTime,
  getLocation,
  getType,
  toDate,
  formatDate,
  listFrom,
  buildPageList,
} from "./_lib";

type StatusTab = "all" | "upcoming" | "past";

const ActivitiesPage = () => {
  const [items, setItems] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await activityAPI.getAll(currentPage);
        if (cancelled) return;
        setItems(listFrom(data));
        setTotalPages(Math.max(1, Number(data?.totalPages) || 1));
      } catch {
        if (!cancelled) {
          setItems([]);
          setError("تعذّر تحميل الفعاليات، يرجى المحاولة لاحقًا.");
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

  const types = useMemo(() => {
    const set = new Set<string>();
    items.forEach((a) => {
      const t = getType(a);
      if (t) set.add(t);
    });
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const term = search.trim().toLowerCase();
    return items.filter((a) => {
      if (term) {
        const haystack =
          `${getTitle(a)} ${getDesc(a)} ${getLocation(a)}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (typeFilter !== "all" && getType(a) !== typeFilter) return false;
      if (statusTab !== "all") {
        const d = toDate(getEndDate(a) || getDate(a));
        if (!d) return false;
        const isUpcoming = d.getTime() >= now;
        if (statusTab === "upcoming" && !isUpcoming) return false;
        if (statusTab === "past" && isUpcoming) return false;
      }
      return true;
    });
  }, [items, search, statusTab, typeFilter]);

  const handlePage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isPast = (a: Activity) => {
    const d = toDate(getEndDate(a) || getDate(a));
    return d ? d.getTime() < Date.now() : false;
  };

  const featured =
    currentPage === 1 && !loading && !error && filtered.length >= 3
      ? filtered[0]
      : null;
  const gridItems = featured ? filtered.slice(1) : filtered;
  const pageList = buildPageList(currentPage, totalPages);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>فعاليات الغرفة</h1>
            <p className={styles.subtitle}>
              اكتشف أحدث المؤتمرات والندوات وورش العمل التي تنظّمها غرفة بيشة
              لتعزيز بيئة الأعمال وتطوير القدرات الاقتصادية في المنطقة.
            </p>
          </div>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} aria-hidden />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن فعالية…"
              className={styles.searchInput}
              aria-label="ابحث عن فعالية"
            />
          </div>
        </div>
      </header>

      <main className={styles.content}>
        {featured && (
          <Link
            href={`/activities/${featured.id}`}
            className={styles.featured}
            style={{ backgroundImage: `url(${getImg(featured)})` }}
          >
            <span className={styles.featuredScrim} aria-hidden />
            <div className={styles.featuredBody}>
              <span className={styles.featuredBadge}>فعالية مميزة</span>
              <h2 className={styles.featuredTitle}>{getTitle(featured)}</h2>
              {getDesc(featured) && (
                <p className={styles.featuredDesc}>{getDesc(featured)}</p>
              )}
              <div className={styles.featuredMeta}>
                {getDate(featured) && (
                  <span>
                    <FaRegCalendarAlt aria-hidden />
                    {formatDate(getDate(featured))}
                    {getEndDate(featured)
                      ? ` — ${formatDate(getEndDate(featured))}`
                      : ""}
                  </span>
                )}
                {getTime(featured) && (
                  <span>
                    <FaRegClock aria-hidden />
                    {getTime(featured)}
                  </span>
                )}
                {getLocation(featured) && (
                  <span>
                    <FaMapMarkerAlt aria-hidden />
                    {getLocation(featured)}
                  </span>
                )}
              </div>
              <span className={styles.featuredCta}>
                عرض التفاصيل <FaArrowLeft aria-hidden />
              </span>
            </div>
          </Link>
        )}

        {!loading && !error && items.length > 0 && (
          <div className={styles.filters}>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label="حالة الفعاليات"
            >
              {[
                { k: "all" as const, l: "الكل" },
                { k: "upcoming" as const, l: "الفعاليات القادمة" },
                { k: "past" as const, l: "الفعاليات السابقة" },
              ].map((t) => (
                <button
                  key={t.k}
                  type="button"
                  className={`${styles.tab} ${
                    statusTab === t.k ? styles.tabActive : ""
                  }`}
                  onClick={() => setStatusTab(t.k)}
                >
                  {t.l}
                </button>
              ))}
            </div>

            {types.length > 0 && (
              <div className={styles.chips}>
                <button
                  type="button"
                  className={`${styles.chip} ${
                    typeFilter === "all" ? styles.chipActive : ""
                  }`}
                  onClick={() => setTypeFilter("all")}
                >
                  الكل
                </button>
                {types.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.chip} ${
                      typeFilter === t ? styles.chipActive : ""
                    }`}
                    onClick={() => setTypeFilter(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className={styles.stateBox}>
            <span className={styles.spinner} aria-hidden />
            <p>جارِ تحميل الفعاليات…</p>
          </div>
        ) : error ? (
          <div className={styles.stateBox}>
            <h3>تعذّر تحميل المحتوى</h3>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.stateBox}>
            <h3>لا توجد فعاليات لعرضها حاليًا</h3>
            <p>يرجى المحاولة لاحقًا أو تعديل معايير البحث.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {gridItems.map((a, i) => {
              const past = isPast(a);
              const type = getType(a);
              return (
                <article
                  key={(a.id as React.Key) ?? i}
                  className={`${styles.card} ${past ? styles.cardPast : ""}`}
                >
                  <div className={styles.cardMedia}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getImg(a)} alt={getTitle(a)} loading="lazy" />
                    {type && <span className={styles.typeBadge}>{type}</span>}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{getTitle(a)}</h3>
                    <div className={styles.cardMeta}>
                      {getDate(a) && (
                        <span>
                          <FaRegCalendarAlt aria-hidden />
                          {formatDate(getDate(a))}
                        </span>
                      )}
                      {getTime(a) && (
                        <span>
                          <FaRegClock aria-hidden />
                          {getTime(a)}
                        </span>
                      )}
                      {getLocation(a) && (
                        <span>
                          <FaMapMarkerAlt aria-hidden />
                          {getLocation(a)}
                        </span>
                      )}
                    </div>
                    <div className={styles.cardFooter}>
                      <span
                        className={`${styles.status} ${
                          past ? styles.statusPast : styles.statusOpen
                        }`}
                      >
                        {past ? (
                          <>
                            <FaCheckCircle aria-hidden /> منتهية
                          </>
                        ) : (
                          <>
                            <FaCircle aria-hidden /> متاح للتسجيل
                          </>
                        )}
                      </span>
                      <Link
                        href={`/activities/${a.id}`}
                        className={styles.detailsLink}
                      >
                        التفاصيل <FaArrowLeft aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
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

export default ActivitiesPage;
