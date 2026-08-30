"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "../../../styles/AuditLog.module.css";
import {
  FaSearch,
  FaCalendarAlt,
  FaChevronRight,
  FaChevronLeft,
  FaPlusCircle,
  FaEdit,
  FaTrashAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { auditLogAPI } from "../../../services/api";
import { buildPageList } from "../../activities/_lib";

const pick = (obj: any, keys: string[]): string => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v);
    }
  }
  return "";
};

const listFrom = (data: any): any[] => {
  const list =
    data?.newsPaper ||
    data?.logs ||
    data?.data ||
    data?.items ||
    data?.result ||
    data?.records ||
    [];
  return Array.isArray(list) ? list : [];
};

const initials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
};

const actionStyle = (action: string): { className: string; icon: React.ReactNode } => {
  const a = action.toLowerCase();
  if (/إضافة|اضاف|create|add/.test(a)) {
    return { className: styles.actionCreate, icon: <FaPlusCircle /> };
  }
  if (/تعديل|تحديث|edit|update/.test(a)) {
    return { className: styles.actionEdit, icon: <FaEdit /> };
  }
  if (/حذف|delete|remove/.test(a)) {
    return { className: styles.actionDelete, icon: <FaTrashAlt /> };
  }
  return { className: styles.actionDefault, icon: <FaInfoCircle /> };
};

const formatWhen = (value: string): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;

  const time = d.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  const now = new Date();
  const startOfDay = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);

  if (diffDays === 0) return `اليوم، ${time}`;
  if (diffDays === 1) return `أمس، ${time}`;

  const dateStr = d.toLocaleDateString("ar-SA-u-nu-latn", { day: "numeric", month: "long" });
  return `${dateStr}، ${time}`;
};

const AdminAuditLogPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [targetTypes, setTargetTypes] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [targetType, setTargetType] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isAdmin()) {
      setLoading(false);
      return;
    }

    auditLogAPI
      .getTargetTypes()
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.data || data?.result || [];
        setTargetTypes(list);
      })
      .catch((error) => console.error("Error fetching target types:", error));

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend.bishahcc.org/api";
    fetch(`${API_BASE_URL}/Register/Get-Users/1`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUsers(listFrom(data)))
      .catch((error) => console.error("Error fetching users:", error));
  }, [user, isAdmin, router]);

  useEffect(() => {
    if (!user || !isAdmin()) return;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await auditLogAPI.getAll(currentPage, {
          date: date || undefined,
          targetType: targetType || undefined,
          userId: userId || undefined,
          search: search || undefined,
        });
        setLogs(listFrom(data));
        setTotalPages(data?.totalPages || 1);
        setTotalCount(
          typeof data?.totalCount === "number"
            ? data.totalCount
            : typeof data?.total === "number"
            ? data.total
            : null
        );
      } catch (error) {
        console.error("Error fetching audit log:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentPage, date, targetType, userId, search]);

  if (loading && logs.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  const pageSize = logs.length || 1;
  const rangeStart = logs.length ? (currentPage - 1) * pageSize + 1 : 0;
  const rangeEnd = logs.length ? rangeStart + logs.length - 1 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>سجل الأنشطة</h1>
          <p className={styles.subtitle}>متابعة كافة الإجراءات والعمليات المنفذة في البوابة الإدارية</p>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="البحث في السجل..."
            value={search}
            onChange={(e) => {
              setCurrentPage(1);
              setSearch(e.target.value);
            }}
          />
          <FaSearch className={styles.searchIcon} />
        </div>

        {users.length > 0 && (
          <select
            className={styles.filterSelect}
            value={userId}
            onChange={(e) => {
              setCurrentPage(1);
              setUserId(e.target.value);
            }}
          >
            <option value="">جميع المستخدمين</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName || u.email}
              </option>
            ))}
          </select>
        )}

        {targetTypes.length > 0 && (
          <select
            className={styles.filterSelect}
            value={targetType}
            onChange={(e) => {
              setCurrentPage(1);
              setTargetType(e.target.value);
            }}
          >
            <option value="">كل العناصر</option>
            {targetTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        <div className={styles.dateBox}>
          <input
            className={styles.dateInput}
            type="date"
            value={date}
            onChange={(e) => {
              setCurrentPage(1);
              setDate(e.target.value);
            }}
          />
          <FaCalendarAlt className={styles.dateIcon} />
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>الإجراء</th>
                <th>العنصر المستهدف</th>
                <th>التاريخ والوقت</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((item, index) => {
                  const name = pick(item, ["userName", "fullName", "user", "adminName"]) || "مستخدم غير معروف";
                  const email = pick(item, ["userEmail", "email"]);
                  const action = pick(item, ["action", "actionType"]) || "-";
                  const target = pick(item, ["targetDescription", "targetName", "targetType", "target", "type"]) || "-";
                  const when = pick(item, ["date", "createdAt", "timestamp"]);
                  const badge = actionStyle(action);

                  return (
                    <tr key={item.id ?? index}>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.avatar}>{initials(name)}</div>
                          <div>
                            <div className={styles.userName}>{name}</div>
                            {email && <div className={styles.userEmail}>{email}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.actionBadge} ${badge.className}`}>
                          {badge.icon}
                          {action}
                        </span>
                      </td>
                      <td>{target}</td>
                      <td className={styles.dateCell}>{formatWhen(when)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className={styles.noResults}>
                    لا توجد سجلات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {logs.length > 0 && (
          <div className={styles.footerBar}>
            <div className={styles.pageInfo}>
              {totalCount !== null
                ? `عرض ${rangeStart} إلى ${rangeEnd} من ${totalCount} نتيجة`
                : `عرض ${logs.length} نتيجة`}
            </div>
            {totalPages > 1 && (
              <div className={styles.pager}>
                <button
                  className={styles.pagerArrow}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <FaChevronRight />
                </button>
                {buildPageList(currentPage, totalPages).map((p, idx) =>
                  p === "…" ? (
                    <span key={`ellipsis-${idx}`} className={styles.pagerEllipsis}>
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={`${styles.pagerBtn} ${p === currentPage ? styles.pagerBtnActive : ""}`}
                      onClick={() => setCurrentPage(p as number)}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  className={styles.pagerArrow}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <FaChevronLeft />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogPage;
