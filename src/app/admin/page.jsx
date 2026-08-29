"use client";
import React, { useState, useEffect } from "react";
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
  FaUserShield,
  FaUserTie,
  FaClipboardList,
  FaCheckDouble,
} from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { permissionsAPI } from "../../services/api";
import {
  normalizePermissions,
  buildPermissionSet,
  hasAnyPermission,
} from "../../utils/permissions";

// Aliases so gating works whether the API returns permission keys or Arabic names
const ALIAS = {
  complaints: [
    "GetContact",
    "Contact",
    "GetComplaints",
    "تسجيل والاطلاع على الشكاوي",
    "الاطلاع على الشكاوي",
    "الشكاوي",
  ],
  news: [
    "AddNewsPaper",
    "AddNews",
    "News",
    "NewsPaper",
    "إضافة الأخبار",
    "تعديل الأخبار",
    "حذف الأخبار",
  ],
  users: ["GetAllUsers", "GetUsers", "Users", "Clients", "عملاء"],
  manageRoles: [
    "ChangeRoles",
    "Change-Roles",
    "GetAllPermissions",
    "Permissions",
    "تغيير صلاحيات",
  ],
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [counts, setCounts] = useState();

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
      GetMyPermissions();
    }

    setLoading(false);
  }, [user, isAdmin, router]);

  // const handleLogout = () => {
  //   window.location.href = "/";
  //   logout();
  // };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobile = () => setIsMobileSidebarOpen(false);

  // ---- Permission gating -------------------------------------------------
  const permSet = buildPermissionSet(
    myPermissions,
    Array.isArray(decodedToken?.Permission) ? decodedToken.Permission : []
  );
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

  const navLinks = [
    { show: true, href: "/admin", label: "لوحة التحكم", icon: <FaChartBar />, active: true },
    { show: can(ALIAS.news), href: "/admin/news", label: "إدارة الأخبار والاعلانات", icon: <FaNewspaper /> },
    { show: can(ALIAS.complaints), href: "/admin/contact", label: "الاطلاع علي الشكاوي", icon: <FaClipboardList /> },
    { show: can(ALIAS.complaints), href: "/admin/contact/edit", label: "تعديل البيانات تواصل معنا", icon: <FaUserPlus /> },
    { show: can(ALIAS.complaints), href: "/admin/board", label: "تعديل المجلس الاداري", icon: <FaUserTie /> },
    { show: can(ALIAS.complaints), href: "/admin/generalSecrtery", label: "تعديل المسؤول العام", icon: <FaUserTie /> },
    { show: can(ALIAS.complaints), href: "/admin/general-assembly", label: "إدارة الجمعية العمومية", icon: <FaUsers /> },
    { show: can(ALIAS.complaints), href: "/admin/voting-dashboard", label: "نتائج التصويت", icon: <FaCheckDouble /> },
    { show: can(ALIAS.users), href: "/admin/clients", label: "إدارة العملاء", icon: <FaUsers /> },
    { show: can(ALIAS.manageRoles), href: "/admin/permissions", label: "إدارة صلاحيات المستخدمين", icon: <FaUserShield /> },
  ];

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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 20V10L12 4L20 10V20" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M9 20V14H15V20" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className={styles.brandName}>غرفة بيشة التجارية</div>
              <div className={styles.brandSub}>لوحة التحكم الإدارية</div>
            </div>
          </div>

          <div className={styles.adminProfile}>
            <div className={styles.profileImage}>
              <FaUsers size={22} />
            </div>
            <div className={styles.profileInfo}>
              <h3>{user?.name || "مدير النظام"}</h3>
              <p>مدير النظام</p>
            </div>
          </div>

          <div className={styles.navLabel}>القائمة الرئيسية</div>

          <nav className={styles.adminNav}>
            {navLinks
              .filter((l) => l.show)
              .map((l) => (
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

          <div className={styles.sidebarFooter}>
            <button className={styles.logoutButton}>
              <FaSignOutAlt className={styles.navIcon} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.adminHeader}>
            <h1>مرحباً بك في لوحة تحكم غرفة بيشة</h1>
            <p>نظرة عامة على نشاط الغرفة ومحتواها الرقمي</p>
          </div>

          <div className={styles.statsGrid}>
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
                <FaUsers />
              </div>
              <div className={styles.statInfo}>
                <h3>{counts?.users || 0}</h3>
                <p>العملاء</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaBullhorn />
              </div>
              <div className={styles.statInfo}>
                <h3>{counts?.ads || 0}</h3>
                <p>الاعلانات</p>
              </div>
            </div>
          </div>

          {/* Signed-in admin's own permissions */}
          <div className={styles.permPanel}>
            <div className={styles.permPanelHead}>
              <FaUserShield className={styles.permPanelIcon} />
              <span className={styles.permPanelTitle}>صلاحياتك الحالية</span>
            </div>
            {myPermissions.length > 0 ? (
              <div className={styles.permChips}>
                {myPermissions.map((p) => (
                  <span key={p.key} className={styles.permChip}>
                    {p.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className={styles.permEmpty}>
                لا توجد صلاحيات محددة أو تعذّر تحميلها.
              </p>
            )}
          </div>

          <section className={styles.contentGrid}>
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div className={styles.panelTitle}>نشاط الغرفة خلال ٦ أشهر</div>
              </div>
              <div className={styles.panelSub}>
                مقارنة الأخبار والإعلانات المنشورة شهرياً
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
                  <g fill="var(--bisha-primary-container)">
                    <circle cx="20" cy="67.6" r="3" /><circle cx="76" cy="59.2" r="3" /><circle cx="132" cy="51.8" r="3" />
                    <circle cx="188" cy="44.4" r="3" /><circle cx="244" cy="35.9" r="3" /><circle cx="300" cy="27.4" r="3" />
                  </g>
                  <g fill="var(--admin-teal)">
                    <circle cx="20" cy="86.7" r="3" /><circle cx="76" cy="82.5" r="3" /><circle cx="132" cy="78.2" r="3" />
                    <circle cx="188" cy="74" r="3" /><circle cx="244" cy="67.6" r="3" /><circle cx="300" cy="62.4" r="3" />
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
                      <circle cx="70" cy="70" r="52" fill="none" stroke="var(--bisha-primary-container)" strokeWidth="20" strokeDasharray="200.6 326.7" strokeDashoffset="0" strokeLinecap="round" />
                      <circle cx="70" cy="70" r="52" fill="none" stroke="var(--admin-teal)" strokeWidth="20" strokeDasharray="115.8 326.7" strokeDashoffset="-202" strokeLinecap="round" />
                      <circle cx="70" cy="70" r="52" fill="none" stroke="var(--bisha-secondary-container)" strokeWidth="20" strokeDasharray="10.3 326.7" strokeDashoffset="-319" strokeLinecap="round" />
                    </g>
                  </svg>
                  <div className={styles.donutCenter}>
                    <b>{(counts?.newsPaper || 0) + (counts?.ads || 0)}</b>
                    <span>إجمالي العناصر</span>
                  </div>
                </div>
                <div className={styles.donutLegend}>
                  <div className={styles.donutLegendRow}>
                    <span>
                      <span className={styles.legendDot} style={{ background: "var(--bisha-primary-container)" }} />
                      الأخبار
                    </span>
                    <b>{counts?.newsPaper || 0}</b>
                  </div>
                  <div className={styles.donutLegendRow}>
                    <span>
                      <span className={styles.legendDot} style={{ background: "var(--admin-teal)" }} />
                      الإعلانات
                    </span>
                    <b>{counts?.ads || 0}</b>
                  </div>
                  <div className={styles.donutLegendRow}>
                    <span>
                      <span className={styles.legendDot} style={{ background: "var(--bisha-secondary-container)" }} />
                      العملاء
                    </span>
                    <b>{counts?.users || 0}</b>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className={styles.quickActions}>
            <h2>إجراءات سريعة</h2>
            <div className={styles.actionCards}>
              {navLinks
                .filter((l) => l.show && !l.active)
                .map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={styles.navLink}
                    onClick={closeMobile}
                  >
                    <span className={styles.navIcon}>{l.icon}</span>
                    <span>{l.label}</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;
