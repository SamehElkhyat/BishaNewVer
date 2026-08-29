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
} from "react-icons/fa";
import Link from "next/link";
import axios from "axios";

const AdminDashboard = () => {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [decodedToken, setDecodedToken] = useState({
    Permission: [],
    ID: null,
    role: null,
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [counts, setCounts] = useState();
  const navItems = [
    {
      permission: "GetContact",
      links: [
        {
          href: "/admin",
          label: "لوحة التحكم",
          icon: <FaChartBar />,
        },
        {
          href: "/admin/contact",
          label: "الاطلاع علي الشكاوي",
          icon: <FaUserPlus />,
        },
        {
          href: "/admin/contact/edit",
          label: "تعديل البيانات تواصل معنا",
          icon: <FaUserPlus />,
        },
        {
          href: "/admin/board",
          label: "تعديل المجلس الاداري",
          icon: <FaUserPlus />,
        },
        {
          href: "/admin/generalSecrtery",
          label: "تعديل المسؤول العام",
          icon: <FaUserPlus />,
        },
        {
          href: "/admin/general-assembly",
          label: "إدارة الجمعية العمومية",
          icon: <FaUserPlus />,
        },
        {
          href: "/admin/voting-dashboard",
          label: "نتائج التصويت",
          icon: <FaChartBar />,
        },
      ],
    },
    {
      permission: "AddNewsPaper",
      links: [
        {
          href: "/admin/news",
          label: "إدارة الأخبار والاعلانات",
          icon: <FaNewspaper />,
        },
      ],
    },
    {
      permission: "GetAllUsers",
      links: [
        {
          href: "/admin/clients",
          label: "إدارة العملاء",
          icon: <FaUsers />,
        },
      ],
    },
  ];

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

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
          className={`${styles.sidebar} ${isMobileSidebarOpen ? styles.sidebarOpen : ""
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
          <div className={styles.adminProfile}>
            <div className={styles.profileImage}>
              <FaUsers size={40} />
            </div>
            <div className={styles.profileInfo}>
              <h3>{user?.name || "مدير النظام"}</h3>
              <p>مدير النظام</p>
            </div>
          </div>

          <nav className={styles.adminNav}>
            {decodedToken?.Permission?.map?.((item, index) => {
              return (
                <div key={`nav-${item}-${index}`}>
                  {item === "GetContact" && (
                    <Link
                      href="/admin"
                      className={`${styles.navLink} ${styles.active}`}
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <FaChartBar className={styles.navIcon} />
                      <span>لوحة التحكم</span>
                    </Link>
                  )}
                  {item === "AddNewsPaper" && (
                    <Link
                      href="/admin/news"
                      className={styles.navLink}
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <FaNewspaper className={styles.navIcon} />
                      <span>إدارة الأخبار والاعلانات</span>
                    </Link>
                  )}
                  {item === "GetAllUsers" &&
                    decodedToken?.ID ===
                    "de902473-e179-4364-bff1-7e7abeab6868" && (
                      <Link
                        href="/admin/clients"
                        className={styles.navLink}
                        onClick={() => setIsMobileSidebarOpen(false)}
                      >
                        <FaUsers className={styles.navIcon} />
                        <span>إدارة العملاء</span>
                      </Link>
                    )}
                  {item === "GetContact" && (
                    <Link
                      href="/admin/contact"
                      className={styles.navLink}
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <FaUserPlus className={styles.navIcon} />
                      <span>الاطلاع علي الشكاوي</span>
                    </Link>
                  )}
                  {item === "GetContact" && (
                    <Link
                      href="/admin/contact/edit"
                      className={styles.navLink}
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <FaUserPlus className={styles.navIcon} />
                      <span>تعديل البيانات تواصل معنا</span>
                    </Link>
                  )}
                </div>
              );
            })}

            <button  className={styles.logoutButton}>
              <FaSignOutAlt className={styles.navIcon} />
              <span>تسجيل الخروج</span>
            </button>
          </nav>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.adminHeader}>
            <h1>لوحة التحكم</h1>
            <p>مرحباً بك في لوحة تحكم غرفة بيشة</p>
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
          <div className={styles.quickActions}>
            <h2>إجراءات سريعة</h2>
            <div className={styles.actionCards}>
              {Array.isArray(decodedToken?.Permission) &&
                navItems.map(
                  ({ permission, links }) =>
                    decodedToken.Permission.includes(permission) &&
                    links.map(({ href, label, icon }, index) => {
                      // Show client management only for specific user
                      if (
                        permission === "GetAllUsers" &&
                        decodedToken?.ID !==
                        "de902473-e179-4364-bff1-7e7abeab6868"
                      ) {
                        return null;
                      }

                      // Show board and general secretary only for specific user
                      if (
                        permission === "GetContact" &&
                        (href === "/admin/board" ||
                          href === "/admin/generalSecrtery") &&
                        decodedToken?.ID !==
                        "de902473-e179-4364-bff1-7e7abeab6868"
                      ) {
                        return null;
                      }

                      return (
                        <Link
                          key={`${permission}-${index}`}
                          href={href}
                          className={styles.navLink}
                          onClick={() => setIsMobileSidebarOpen(false)}
                        >
                          <span className={styles.navIcon}>{icon}</span>
                          <span>{label}</span>
                        </Link>
                      );
                    })
                )}
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;
