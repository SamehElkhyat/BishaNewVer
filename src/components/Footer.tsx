'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Footer.module.css';
import { baseNavLinks } from '../data/navLinks';
import { services } from '../data/services';
import { socialLinks } from '../data/socialLinks';

const footerServices = services.slice(0, 6);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contact, setContact] = useState<{
    firstPhoneNumber?: string;
    secondPhoneNumber?: string;
    email?: string;
    address?: string;
    workingHours?: string;
  } | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/Admin/Get-Contact-US`,
          { credentials: 'include' }
        );
        if (!response.ok) return;
        const text = await response.text();
        if (!text) return;
        setContact(JSON.parse(text));
      } catch (error) {
        console.error('Error fetching contact:', error);
      }
    };

    fetchContact();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerColumn}>
            <div className={styles.footerLogo}>
              <Image 
                src="/bisha-chamber-logo.png" 
                alt="غرفة بيشة" 
                width={150} 
                height={150}
                className={styles.logoImage}
              />
            </div>
            <p className={styles.footerAbout}>
              غرفة بيشة هي مؤسسة ذات نفع عام تعمل على تنمية المصالح التجارية والصناعية وتطوير بيئة الأعمال في محافظة بيشة
            </p>
            <div className={styles.socialIcons}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={styles.socialIcon}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>روابط سريعة</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/">الرئيسية</Link></li>
              {baseNavLinks.map((link, index) => (
                <li key={link.id ?? index}>
                  <Link
                    href={
                      link.hasDropdown && link.dropdownItems?.length
                        ? link.dropdownItems[0].href
                        : link.href
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>الخدمات</h3>
            <ul className={styles.footerLinks}>
              {footerServices.map((service, index) => (
                <li key={index}>
                  {service.href.startsWith('http') ? (
                    <a href={service.href} target="_blank" rel="noopener noreferrer">
                      {service.label}
                    </a>
                  ) : (
                    <Link href={service.href}>{service.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>تواصل معنا</h3>
            <ul className={styles.contactInfo}>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{contact?.address || 'بيشة، المملكة العربية السعودية'}</span>
              </li>
              {(contact?.firstPhoneNumber || contact?.secondPhoneNumber) && (
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span dir="ltr">
                    {[contact.firstPhoneNumber, contact.secondPhoneNumber]
                      .filter(Boolean)
                      .join(' - ')}
                  </span>
                </li>
              )}
              {contact?.email && (
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>
                    <a href={`mailto:${contact.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {contact.email}
                    </a>
                  </span>
                </li>
              )}
              {contact?.workingHours && (
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{contact.workingHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.footerCopyright}>
            <p>© {currentYear} غرفة بيشة. جميع الحقوق محفوظة</p>
          </div>
          <div className={styles.footerBottomLinks}>
            <Link href="/privacy">سياسة الخصوصية</Link>
            <Link href="/terms">شروط الاستخدام</Link>
            <Link href="/sitemap">خريطة الموقع</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
