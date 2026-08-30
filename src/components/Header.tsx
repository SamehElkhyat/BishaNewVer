import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Header.module.css";
import { FaTimes, FaChevronDown, FaBars } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { baseNavLinks, type NavLink } from "../data/navLinks";
import { socialLinks } from "../data/socialLinks";

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

  // Add admin link ONLY if user is admin
  if (decodedToken?.role === "admin") {
    navLinks.push(adminLink);
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo/Brand */}
        <div className={styles.brandSection}>
          <Link href="/" className={styles.brandLink}>
            <Image
              src="/bisha-chamber-logo.png"
              alt="غرفة بيشة التجارية"
              width={44}
              height={44}
              className={styles.brandLogo}
              priority
            />
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

        {/* Desktop Social Icons — pinned to the far left */}
        <div className={`${styles.socialIcons} ${styles.desktopSocial}`}>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className={styles.socialIcon}
              aria-label={social.name}
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