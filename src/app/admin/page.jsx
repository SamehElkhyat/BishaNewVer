"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import AdminRoute from "../../components/AdminRoute";
import styles from "../../styles/Admin.module.css";
import {
  FaNewspaper,
  FaUserPlus,
  FaSignOutAlt,
  FaChartBar,
  FaUsers,
  FaBullhorn,
  FaBars,
  FaTimes,
  FaUserTie,
  FaClipboardList,
  FaCheckDouble,
  FaCalendarAlt,
  FaFileAlt,
  FaHistory,
} from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import {
  authAPI,
  permissionsAPI,
  circularAPI,
  activityAPI,
} from "../../services/api";
import { listFrom } from "../activities/_lib";
import {
  normalizePermissions,
  buildPermissionSet,
  hasAnyPermission,
} from "../../utils/permissions";

// One alias list per nav item, keyed to the exact English permission code
// the backend returns from /Register/My-Permissions (confirmed against the
// API directly), plus older guessed values kept as a fallback.
const ALIAS = {
  news: ["ManageNewsPaper", "AddNewsPaper", "AddNews", "News", "NewsPaper", "إضافة الأخبار", "تعديل الأخبار", "حذف الأخبار", "إدارة الأخبار والإعلانات"],
  activities: ["ManageActivity", "إدارة الفعاليات"],
  circulars: ["ManageCircular", "إدارة التعاميم"],
  viewComplaints: ["ViewComplaints", "GetContact", "Contact", "GetComplaints", "تسجيل والاطلاع على الشكاوي", "الاطلاع على الشكاوي", "الشكاوي"],
  manageContactUs: ["ManageContactUs", "تعديل بيانات تواصل معنا"],
  manageBOD: ["ManageBOD", "تعديل المجلس الإداري"],
  manageGeneralAssembly: ["ManageGeneralAssembly", "إدارة الجمعية العمومية"],
  viewVotingResults: ["ViewVotingResults", "نتائج التصويت"],
  manageUsers: ["ManageUsers", "GetAllUsers", "GetUsers", "Users", "Clients", "عملاء", "إدارة العملاء"],
  manageSecretaryGeneral: ["ManageSecretaryGeneral", "تعديل المسؤول العام"],
  viewAuditLog: ["ViewAuditLog", "سجل النشاطات"],
};

const AdminDashboard = () => {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [decodedToken, setDecodedToken] = useState({
    Permission: [],
    ID: null,
    role: null,
  });
  const [myPermissions, setMyPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [counts, setCounts] = useState();
  const [circularsCount, setCircularsCount] = useState(0);
  const [activitiesCount, setActivitiesCount] = useState(0);

  const GetContentCounts = async () => {
    try {
      const circularsData = await circularAPI.getAll(1);
      setCircularsCount(
        circularsData?.totalCount ?? listFrom(circularsData).length
      );
    } catch (error) {
      console.error("Failed to load circulars count:", error);
    }

    try {
      const activitiesData = await activityAPI.getAll(1);
      setActivitiesCount(
        activitiesData?.totalCount ?? listFrom(activitiesData).length
      );
    } catch (error) {
      console.error("Failed to load activities count:", error);
    }
  };

  const GetAllCounts = async () => {
    // const token = localStorage.getItem("auth_token");
    // if (!token) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Admin/Count`,
        {
          withCredentials: true,
        }
      );
      setCounts(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        // logout();
        // router.push("/login");
      }
    }
  };

  // Permissions granted to the signed-in admin (drives what the UI exposes)
  const GetMyPermissions = async () => {
    try {
      const res = await permissionsAPI.getMine();
      setMyPermissions(normalizePermissions(res));
    } catch (error) {
      console.error("Failed to load permissions:", error);
    } finally {
      setPermissionsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const decoded = JSON.parse(localStorage.getItem("DecodedToken") || "{}");

      setDecodedToken(decoded);

      const role = (decoded?.role ?? decoded?.Role ?? "").toString().toLowerCase();
      // if (role !== "admin") {
      //   router.push("/login");
      //   return;
      // }

      GetAllCounts();
      GetContentCounts();
      GetMyPermissions();
    }

    setLoading(false);
  }, [user, isAdmin, router]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      logout();
      router.push("/login");
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobile = () => setIsMobileSidebarOpen(false);

  // ---- Permission gating -------------------------------------------------
  // Sourced only from the live /Register/My-Permissions call — a cached
  // decodedToken.Permission (left over from the old JWT-based login flow)
  // used to be merged in here too, which could silently keep showing
  // permissions from a stale token long after the account's real grants
  // changed.
  const permSet = buildPermissionSet(myPermissions);
  const knowsPerms = permSet.size > 0;
  // Permissive when we truly know nothing; otherwise honour the list.
  const can = (aliases) => !knowsPerms || hasAnyPermission(permSet, aliases);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  const navGroups = [
    {
      label: "الرئيسية",
      items: [
        { show: true, href: "/admin", label: "لوحة التحكم", icon: <FaChartBar />, active: true },
      ],
    },
    {
      label: "المحتوى",
      items: [
        { show: can(ALIAS.news), href: "/admin/news", label: "إدارة الأخبار والإعلانات", icon: <FaNewspaper /> },
        { show: can(ALIAS.activities), href: "/admin/activities", label: "إدارة الفعاليات", icon: <FaCalendarAlt /> },
        { show: can(ALIAS.circulars), href: "/admin/circulars", label: "إدارة التعاميم", icon: <FaFileAlt /> },
        { show: can(ALIAS.viewComplaints), href: "/admin/contact", label: "الاطلاع على الشكاوي", icon: <FaClipboardList /> },
        { show: can(ALIAS.manageContactUs), href: "/admin/contact/edit", label: "تعديل بيانات تواصل معنا", icon: <FaUserPlus /> },
      ],
    },
    {
      label: "الحوكمة",
      items: [
        { show: can(ALIAS.manageBOD), href: "/admin/board", label: "تعديل المجلس الإداري", icon: <FaUserTie /> },
        { show: can(ALIAS.manageGeneralAssembly), href: "/admin/general-assembly", label: "إدارة الجمعية العمومية", icon: <FaUsers /> },
        { show: can(ALIAS.viewVotingResults), href: "/admin/voting-dashboard", label: "نتائج التصويت", icon: <FaCheckDouble /> },
      ],
    },
    {
      label: "المستخدمون",
      items: [
        { show: can(ALIAS.manageUsers), href: "/admin/clients", label: "إدارة العملاء", icon: <FaUsers /> },
        { show: can(ALIAS.manageSecretaryGeneral), href: "/admin/generalSecrtery", label: "تعديل المسؤول العام", icon: <FaUserTie /> },
      ],
    },
    {
      label: "النظام",
      items: [
        { show: can(ALIAS.viewAuditLog), href: "/admin/audit-log", label: "سجل النشاطات", icon: <FaHistory /> },
      ],
    },
  ];

  // "توزيع المحتوى" donut — real proportions across all five content types.
  const DONUT_CIRCUMFERENCE = 326.7; // 2 * PI * 52 (matches the SVG radius below)
  const donutSegments = (() => {
    const raw = [
      { key: "news", label: "الأخبار", value: counts?.newsPaper || 0, color: "var(--bisha-primary-container)" },
      { key: "ads", label: "الإعلانات", value: counts?.ads || 0, color: "var(--admin-teal)" },
      { key: "circulars", label: "التعاميم", value: circularsCount || 0, color: "#c98a2c" },
      { key: "activities", label: "الفعاليات", value: activitiesCount || 0, color: "#d97757" },
      { key: "users", label: "المستخدمين", value: counts?.users || 0, color: "var(--bisha-secondary-container)" },
    ];
    const total = raw.reduce((sum, s) => sum + s.value, 0);
    let cumulative = 0;
    return raw.map((s) => {
      const length = total > 0 ? (s.value / total) * DONUT_CIRCUMFERENCE : 0;
      const segment = { ...s, length, offset: -cumulative };
      cumulative += length;
      return segment;
    });
  })();
  const donutTotal = donutSegments.reduce((sum, s) => sum + s.value, 0);

  return (
    <AdminRoute>
      <div className={styles.adminContainer}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileSidebar}
            aria-label="Toggle mobile menu"
          >
            <FaBars />
          </button>
          <h1>لوحة التحكم</h1>
          <div className={styles.mobileProfileImage}>
            <FaUsers size={24} />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className={styles.mobileOverlay} onClick={toggleMobileSidebar} />
        )}

        {/* Sidebar */}
        <div
          className={`${styles.sidebar} ${
            isMobileSidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          {/* Mobile Close Button */}
          <div className={styles.mobileCloseContainer}>
            <button
              className={styles.mobileCloseButton}
              onClick={toggleMobileSidebar}
              aria-label="Close mobile menu"
            >
              <FaTimes />
            </button>
          </div>

          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <Image
                src="/bisha-chamber-logo.png"
                alt="غرفة بيشة التجارية"
                width={28}
                height={28}
                className={styles.brandMarkLogo}
              />
            </div>
            <div>
              <div className={styles.brandName}>غرفة بيشة التجارية</div>
              <div className={styles.brandSub}>لوحة التحكم الإدارية</div>
            </div>
          </div>

          {/* Keep the sidebar blank while permissions are still loading —
              otherwise every item briefly renders permissively, then a
              chunk of them disappear once /Register/My-Permissions
              resolves, which reads as a bug rather than a loading state. */}
          {!permissionsLoading &&
            navGroups.map((group) => {
              const visibleItems = group.items.filter((l) => l.show);
              if (visibleItems.length === 0) return null;
              return (
                <React.Fragment key={group.label}>
                  <div className={styles.navLabel}>{group.label}</div>
                  <nav className={styles.adminNav}>
                    {visibleItems.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={`${styles.navLink} ${l.active ? styles.active : ""}`}
                        onClick={closeMobile}
                      >
                        <span className={styles.navIcon}>{l.icon}</span>
                        <span>{l.label}</span>
                      </Link>
                    ))}
                  </nav>
                </React.Fragment>
              );
            })}

          <div className={styles.sidebarFooter}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <FaSignOutAlt className={styles.navIcon} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaBullhorn />
              </div>
              <div className={styles.statInfo}>
                <h3>{counts?.ads || 0}</h3>
                <p>الإعلانات</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaNewspaper />
              </div>
              <div className={styles.statInfo}>
                <h3>{counts?.newsPaper || 0}</h3>
                <p>الأخبار</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaFileAlt />
              </div>
              <div className={styles.statInfo}>
                <h3>{circularsCount || 0}</h3>
                <p>التعاميم</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaCalendarAlt />
              </div>
              <div className={styles.statInfo}>
                <h3>{activitiesCount || 0}</h3>
                <p>الفعاليات</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaUsers />
              </div>
              <div className={styles.statInfo}>
                <h3>{counts?.users || 0}</h3>
                <p>المستخدمين</p>
              </div>
            </div>
          </div>

          <section className={styles.contentGrid}>
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div className={styles.panelTitle}>نشاط الغرفة خلال ٦ أشهر</div>
              </div>
              <div className={styles.panelSub}>
                مقارنة الأخبار والإعلانات والتعاميم والفعاليات المنشورة شهرياً
              </div>
              <div className={styles.chartWrap}>
                <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid meet">
                  <line x1="20" y1="20" x2="20" y2="110" stroke="var(--admin-outline)" strokeWidth="1" />
                  <line x1="20" y1="110" x2="300" y2="110" stroke="var(--admin-outline)" strokeWidth="1" />
                  <line x1="20" y1="65" x2="300" y2="65" stroke="var(--admin-outline)" strokeWidth="1" strokeDasharray="3 4" />
                  <path d="M20,67.6 L76,59.2 L132,51.8 L188,44.4 L244,35.9 L300,27.4 L300,110 L20,110 Z" fill="var(--bisha-primary-container)" opacity="0.1" />
                  <path d="M20,86.7 L76,82.5 L132,78.2 L188,74 L244,67.6 L300,62.4 L300,110 L20,110 Z" fill="var(--admin-teal)" opacity="0.1" />
                  <polyline points="20,67.6 76,59.2 132,51.8 188,44.4 244,35.9 300,27.4" fill="none" stroke="var(--bisha-primary-container)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="20,86.7 76,82.5 132,78.2 188,74 244,67.6 300,62.4" fill="none" stroke="var(--admin-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="20,95 76,90.5 132,85.8 188,78.4 244,72.1 300,66" fill="none" stroke="#c98a2c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="20,102 76,100.2 132,97.5 188,94.1 244,90.6 300,86.3" fill="none" stroke="#d97757" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <g fill="var(--bisha-primary-container)">
                    <circle cx="20" cy="67.6" r="3" /><circle cx="76" cy="59.2" r="3" /><circle cx="132" cy="51.8" r="3" />
                    <circle cx="188" cy="44.4" r="3" /><circle cx="244" cy="35.9" r="3" /><circle cx="300" cy="27.4" r="3" />
                  </g>
                  <g fill="var(--admin-teal)">
                    <circle cx="20" cy="86.7" r="3" /><circle cx="76" cy="82.5" r="3" /><circle cx="132" cy="78.2" r="3" />
                    <circle cx="188" cy="74" r="3" /><circle cx="244" cy="67.6" r="3" /><circle cx="300" cy="62.4" r="3" />
                  </g>
                  <g fill="#c98a2c">
                    <circle cx="20" cy="95" r="3" /><circle cx="76" cy="90.5" r="3" /><circle cx="132" cy="85.8" r="3" />
                    <circle cx="188" cy="78.4" r="3" /><circle cx="244" cy="72.1" r="3" /><circle cx="300" cy="66" r="3" />
                  </g>
                  <g fill="#d97757">
                    <circle cx="20" cy="102" r="3" /><circle cx="76" cy="100.2" r="3" /><circle cx="132" cy="97.5" r="3" />
                    <circle cx="188" cy="94.1" r="3" /><circle cx="244" cy="90.6" r="3" /><circle cx="300" cy="86.3" r="3" />
                  </g>
                  <g fill="var(--bisha-on-surface-variant)" fontSize="10.5" textAnchor="middle">
                    <text x="20" y="128">مارس</text><text x="76" y="128">أبريل</text><text x="132" y="128">مايو</text>
                    <text x="188" y="128">يونيو</text><text x="244" y="128">يوليو</text><text x="300" y="128">أغسطس</text>
                  </g>
                </svg>
              </div>
              <div className={styles.chartLegend}>
                <div className={styles.chartLegendItem}>
                  <span className={styles.legendDot} style={{ background: "var(--bisha-primary-container)" }} />
                  الأخبار
                </div>
                <div className={styles.chartLegendItem}>
                  <span className={styles.legendDot} style={{ background: "var(--admin-teal)" }} />
                  الإعلانات
                </div>
                <div className={styles.chartLegendItem}>
                  <span className={styles.legendDot} style={{ background: "#c98a2c" }} />
                  التعاميم
                </div>
                <div className={styles.chartLegendItem}>
                  <span className={styles.legendDot} style={{ background: "#d97757" }} />
                  الفعاليات
                </div>
              </div>
            </div>

            <div className={styles.sideCol}>
              <div className={styles.panel}>
                <div className={styles.panelTitle}>توزيع المحتوى</div>
                <div className={styles.panelSub}>النسبة الحالية لكل قسم</div>
                <div className={styles.donutWrap}>
                  <svg viewBox="0 0 140 140" width="150" height="150">
                    <g transform="rotate(-90 70 70)">
                      <circle cx="70" cy="70" r="52" fill="none" stroke="var(--admin-soft)" strokeWidth="20" />
                      {donutSegments.map((s) => (
                        <circle
                          key={s.key}
                          cx="70"
                          cy="70"
                          r="52"
                          fill="none"
                          stroke={s.color}
                          strokeWidth="20"
                          strokeDasharray={`${s.length} ${DONUT_CIRCUMFERENCE}`}
                          strokeDashoffset={s.offset}
                          strokeLinecap="round"
                        />
                      ))}
                    </g>
                  </svg>
                  <div className={styles.donutCenter}>
                    <b>{donutTotal}</b>
                    <span>إجمالي العناصر</span>
                  </div>
                </div>
                <div className={styles.donutLegend}>
                  {donutSegments.map((s) => (
                    <div className={styles.donutLegendRow} key={s.key}>
                      <span>
                        <span className={styles.legendDot} style={{ background: s.color }} />
                        {s.label}
                      </span>
                      <b>{s.value}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;
