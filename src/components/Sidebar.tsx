import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Sidebar.module.css';
import { FaHome, FaUserTie, FaFileContract, FaWallet, FaHandshake, FaBullhorn, FaCertificate, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'الرئيسية', icon: <FaHome /> },
  { href: '/membership', label: 'العضوية', icon: <FaUserTie /> },
  { href: '/requests', label: 'الطلبات', icon: <FaFileContract /> },
  { href: '/wallet', label: 'المحفظة', icon: <FaWallet /> },
  { href: '/partner', label: 'الشريك التجاري', icon: <FaHandshake /> },
  { href: '/announcements', label: 'الاعلانات', icon: <FaBullhorn /> },
  { href: '/certificates', label: 'الشهادات', icon: <FaCertificate /> },
  { href: '/help', label: 'المساعدة', icon: <FaQuestionCircle /> },
];

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('DecodedToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isClient');
    localStorage.removeItem('isPartner');
    localStorage.removeItem('isMember');
    localStorage.removeItem('isNews');
    localStorage.removeItem('isCircular');
    localStorage.removeItem('isCertificate');
    router.push('/login');
  }
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logoContainer}>
        {/* Placeholder for logo */}
        <div className={styles.logo}>Logo</div>
      </div>
      <nav className={styles.nav}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.navLink}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.logoutContainer}>
        <button onClick={logout} className={styles.logoutButton}>
          <FaSignOutAlt />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
