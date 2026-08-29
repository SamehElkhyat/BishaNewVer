import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Header.module.css";
import {
  FaTiktok,
  FaTelegramPlane,
  FaSnapchatGhost,
  FaYoutube,
  FaInstagram,
  FaTimes,
  FaChevronDown,
  FaBars,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { log } from "console";

interface NavLink {
  href: string;
  label: string;
  id?: string;
  hasDropdown?: boolean;
  external?: boolean;
  dropdownItems?: Array<{
    href: string;
    label: string;
  }>;
}

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { isAdmin } = useAuth();

  // Check if device is mobile or tablet
  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        activeDropdown &&
        dropdownRefs.current[activeDropdown] &&
        !dropdownRefs.current[activeDropdown]?.contains(target)
      ) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (dropdownId: string) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close any open dropdowns when toggling mobile menu
    setActiveDropdown(null);
  };
  // Base navigation links (always visible)
  const baseNavLinks: NavLink[] = [
    { href: "/services", label: "الخدمات الالكترونية" },
    {
      id: "about",
      href: "#",
      label: "عن الغرفة",
      hasDropdown: true,
      dropdownItems: [
        { href: "/about/vision", label: "الرؤية والرسالة" },
        { href: "/about/regulations", label: "اللوائح والأنظمة" },
        { href: "/about/board", label: "مجلس الإدارة" },
        { href: "/about/secretariat", label: "الأمانة العامة" },
        { href: "/about/magazine", label: "مجلة الغرفة" },
        { href: "/about/general-assembly", label: "الجمعية العمومية" },
        { href: "/about/elections", label: "الجمعية العمومية" },
        { href: "/about/annual-reports", label: "التقرير السنوي" },
        { href: "/about/e-library", label: "المكتبة الإلكترونية" },
        { href: "/about/trade-bulletins", label: "النشرات التجارية" },
        { href: "/about/studies", label: "الدراسات والبحوث" },
        { href: "/about/committees", label: "اللجان القطاعية" },
        { href: "/about/surveys", label: "الاستبيانات" },
      ],
    },
    { href: "/activities", label: "فعاليات الغرفة" },
    { href: "/media-center", label: "المركز الاعلامي" },
    { href: "/circulars", label: "التعاميم" },
    {
      id: "survey",
      href: "#",
      label: "الاستبيان",
      hasDropdown: true,
      dropdownItems: [
        {
          href: "https://docs.google.com/forms/d/e/1FAIpQLSeOpj_Digc9YrY3cATwVG0Rl6Q_K5uY7TnyTW5PSgM9hx7zOA/viewform",
          label: "استبيان مدى رضا المشتركين عن الخدمات",
        },
        {
          href: "https://docs.google.com/forms/d/e/1FAIpQLSewW99vPZQY5HTbt-b4rK3DaRxUP6MWkrYkB2OF23XmjQiHoQ/viewform",
          label: "استبيان اللجان القطاعية",
        },
      ],
    },
    { href: "/contact", label: "اتصل بنا" },
    { href: "/voting-auth", label: "الجمعية العمومية" },
  ];

  // Admin link (only visible to admins)
  const adminLink: NavLink = {
    href: "/admin",
    label: "🔧 لوحة التحكم",
    id: "admin",
  };

  // Get user from auth context

  // Combine base links with conditional links
  let navLinks: NavLink[] = [...baseNavLinks];

  const decodedToken = JSON.parse(localStorage.getItem("DecodedToken") || "{}");
  console.log(decodedToken);

  // Add admin link ONLY if user is admin
  if (decodedToken?.role === "admin") {
    navLinks.push(adminLink);
  }

  // Custom X (Twitter) logo component
  const XLogo = () => (
    <svg
      viewBox="0 0 24 24"
      style={{ width: "16px", height: "16px", fill: "currentColor" }}
    >
      <g>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </g>
    </svg>
  );

  const socialLinks = [
    { href: "#", icon: <FaTelegramPlane /> },
    { href: "#", icon: <FaSnapchatGhost /> },
    { href: "#", icon: <FaYoutube /> },
    { href: "#", icon: <FaInstagram /> },
    { href: "https://x.com/Bisha_cci", icon: <XLogo /> },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo/Brand section for mobile */}
        <div className={styles.brandSection}>
          <Link href="/" className={styles.brandLink}>
            غرفة بيشة التجارية
          </Link>
        </div>

        {/* Mobile hamburger menu button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <FaBars />
        </button>

        {/* Desktop Navigation */}
        <nav className={`${styles.nav} ${styles.desktopNav}`}>
          {navLinks.map((link, index) =>
            link.hasDropdown ? (
              <div
                key={index}
                className={styles.dropdownContainer}
                ref={(el) => {
                  if (link.id) {
                    dropdownRefs.current[link.id] = el;
                  }
                }}
              >
                <div
                  className={`${styles.navLink} ${styles.dropdownTrigger} ${
                    activeDropdown === link.id ? styles.activeDropdown : ""
                  }`}
                  onClick={() => link.id && toggleDropdown(link.id)}
                >
                  {link.label}{" "}
                  <FaChevronDown
                    className={`${styles.dropdownIcon} ${
                      activeDropdown === link.id ? styles.rotateIcon : ""
                    }`}
                  />
                </div>
                {activeDropdown === link.id && (
                  <div
                    className={`${styles.dropdownMenu} ${
                      link.id === "about" || link.id === "services"
                        ? styles.largeDropdown
                        : ""
                    }`}
                  >
                    {link.dropdownItems?.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className={styles.dropdownItem}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : link.external ? (
              <a
                key={index}
                href={link.href}
                className={styles.navLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ) : (
              <Link key={index} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop Social Icons */}
        <div className={`${styles.socialIcons} ${styles.desktopSocial}`}>
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              className={styles.socialIcon}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileNav}>
            <div className={styles.mobileNavContent}>
              {/* Close button */}
              <div className={styles.mobileNavHeader}>
                <button
                  className={styles.mobileCloseButton}
                  onClick={toggleMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Mobile Social Icons */}
              <div className={styles.mobileSocialIcons}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={styles.socialIcon}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Mobile Navigation Links */}
              <nav className={styles.mobileNavLinks}>
                {navLinks.map((link, index) =>
                  link.hasDropdown ? (
                    isMobileOrTablet ? (
                      <Link
                        key={index}
                        href={
                          link.id === "services"
                            ? "/services"
                            : link.id === "about"
                            ? "/about-mobile"
                            : link.id === "media"
                            ? "/media-mobile"
                            : link.id === "survey"
                            ? "/survey"
                            : "#"
                        }
                        className={styles.mobileNavLink}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <div
                        key={index}
                        className={styles.mobileDropdownContainer}
                      >
                        <div
                          className={`${styles.mobileNavLink} ${styles.mobileDropdownTrigger}`}
                          onClick={() => link.id && toggleDropdown(link.id)}
                        >
                          {link.label}{" "}
                          <FaChevronDown
                            className={`${styles.dropdownIcon} ${
                              activeDropdown === link.id
                                ? styles.rotateIcon
                                : ""
                            }`}
                          />
                        </div>
                        {activeDropdown === link.id && (
                          <div className={styles.mobileDropdownMenu}>
                            {link.dropdownItems?.map((item, idx) => (
                              <button
                                key={idx}
                                className={styles.mobileDropdownItem}
                                onClick={() => {
                                  window.location.href = item.href;
                                  setIsMobileMenuOpen(false);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "var(--bisha-on-surface-variant)",
                                  textAlign: "right",
                                  width: "100%",
                                  cursor: "pointer",
                                }}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  ) : link.external ? (
                    <a
                      key={index}
                      href={link.href}
                      className={styles.mobileNavLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={index}
                      href={link.href}
                      className={styles.mobileNavLink}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;