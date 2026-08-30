"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaArrowRight,
  FaHome,
  FaCalendarAlt as FaRegCalendarAlt,
  FaRegClock,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";
import { activityAPI } from "../../../services/api";
import styles from "../../../styles/ContentDetail.module.css";
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
  formatDate,
} from "../_lib";

const normalize = (data: unknown): Activity | null => {
  const d = data as Record<string, unknown> | null;
  if (!d) return null;
  const nested =
    (d.activity as Activity) ||
    (d.data as Activity) ||
    (d.result as Activity) ||
    (d.item as Activity);
  if (nested && (nested.id || getTitle(nested))) return nested;
  if (d.id || getTitle(d as Activity)) return d as Activity;
  return null;
};

const ActivityDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await activityAPI.getById(id);
        if (cancelled) return;
        const normalized = normalize(data);
        if (normalized) setItem(normalized);
        else {
          setItem(null);
          setError("الفعالية غير موجودة");
        }
      } catch {
        if (!cancelled) {
          setItem(null);
          setError("حدث خطأ أثناء تحميل الفعالية.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>جارِ تحميل الفعالية…</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className={styles.notFound}>
        <h1>الفعالية غير موجودة</h1>
        <p>{error || "عذراً، الفعالية التي تبحث عنها غير متاحة."}</p>
        <Link href="/activities" className={styles.backButton}>
          <FaArrowRight /> العودة إلى الفعاليات
        </Link>
      </div>
    );
  }

  const title = getTitle(item);
  const desc = getDesc(item);
  const date = getDate(item);
  const endDate = getEndDate(item);
  const time = getTime(item);
  const location = getLocation(item);
  const type = getType(item);

  return (
    <div className={styles.page}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link href="/" className={styles.breadcrumbLink}>
          <FaHome />
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/activities" className={styles.breadcrumbLink}>
          <FaRegCalendarAlt />
          الفعاليات
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>تفاصيل الفعالية</span>
      </div>

      <div className={styles.backLink}>
        <Link href="/activities" className={styles.backButton}>
          <FaArrowRight /> العودة إلى الفعاليات
        </Link>
      </div>

      <article className={styles.article}>
        <div className={styles.imageWrap} style={{ margin: 0, borderRadius: 0, border: "none", borderBottom: "1px solid var(--bisha-outline-variant)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getImg(item)} alt={title} className={styles.image} />
          {type && <span className={styles.typeBadge}>{type}</span>}
        </div>

        <div className={styles.header} style={{ paddingTop: "1.5rem" }}>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.metaRow}>
            <div className={styles.metaLeft}>
              {date && (
                <span className={styles.metaItem}>
                  <FaRegCalendarAlt className={styles.metaIcon} />
                  {formatDate(date)}
                  {endDate ? ` — ${formatDate(endDate)}` : ""}
                </span>
              )}
              {time && (
                <span className={styles.metaItem}>
                  <FaRegClock className={styles.metaIcon} />
                  {time}
                </span>
              )}
              {location && (
                <span className={styles.metaItem}>
                  <FaMapMarkerAlt className={styles.metaIcon} />
                  {location}
                </span>
              )}
              {type && (
                <span className={styles.metaItem}>
                  <FaTag className={styles.metaIcon} />
                  {type}
                </span>
              )}
            </div>
          </div>
        </div>

        {desc && (
          <div className={styles.body}>
            <div className={styles.content}>
              {desc.split(/\n+/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ActivityDetailPage;
