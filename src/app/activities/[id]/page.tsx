"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaArrowRight,
  FaRegCalendarAlt,
  FaRegClock,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";
import { activityAPI } from "../../../services/api";
import styles from "../../../styles/Activities.module.css";
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
      <div className={styles.container}>
        <div className={styles.detailWrap}>
          <div className={styles.stateBox}>
            <span className={styles.spinner} aria-hidden />
            <p>جارِ تحميل الفعالية…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className={styles.container}>
        <div className={styles.detailWrap}>
          <div className={styles.stateBox}>
            <h3>الفعالية غير موجودة</h3>
            <p>{error || "عذراً، الفعالية التي تبحث عنها غير متاحة."}</p>
            <Link href="/activities" className={styles.backButton}>
              <FaArrowRight aria-hidden /> العودة إلى الفعاليات
            </Link>
          </div>
        </div>
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
    <div className={styles.container}>
      <div className={styles.detailWrap}>
        <Link href="/activities" className={styles.backButton}>
          <FaArrowRight aria-hidden /> العودة إلى الفعاليات
        </Link>

        <article className={styles.detailCard}>
          <div className={styles.detailMedia}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getImg(item)} alt={title} />
            {type && <span className={styles.typeBadge}>{type}</span>}
          </div>

          <div className={styles.detailBody}>
            <h1 className={styles.detailTitle}>{title}</h1>

            <div className={styles.detailMeta}>
              {date && (
                <span>
                  <FaRegCalendarAlt aria-hidden />
                  {formatDate(date)}
                  {endDate ? ` — ${formatDate(endDate)}` : ""}
                </span>
              )}
              {time && (
                <span>
                  <FaRegClock aria-hidden />
                  {time}
                </span>
              )}
              {location && (
                <span>
                  <FaMapMarkerAlt aria-hidden />
                  {location}
                </span>
              )}
              {type && (
                <span>
                  <FaTag aria-hidden />
                  {type}
                </span>
              )}
            </div>

            {desc && (
              <div className={styles.detailText}>
                {desc.split(/\n+/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
