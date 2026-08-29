import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

export default function Main() {
  // Parallax effect for background
  const mainRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    // Initial animation sequence with staggered timing
    const sequence = async () => {
      // First animate the background and overlay
      await controls.start("backgroundVisible");

      // Then animate the logo and buttons
      await controls.start("elementsVisible");
    };

    sequence();

    // Parallax effect
    const handleParallax = () => {
      if (!mainRef.current) return;
      const scrollPosition = window.scrollY;
      const opacity = Math.max(0.7 - scrollPosition * 0.001, 0.4);
      mainRef.current.style.setProperty("--overlay-opacity", opacity);
    };

    window.addEventListener("scroll", handleParallax);
    return () => window.removeEventListener("scroll", handleParallax);
  }, [controls]);

  // Animation variants
  const backgroundVariants = {
    hidden: { opacity: 0 },
    backgroundVisible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
    elementsVisible: {
      opacity: 1,
      transition: {
        duration: 0,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    backgroundVisible: {
      opacity: 0.3,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    elementsVisible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    elementsVisible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.8,
      },
    },
  };

  // Mouse parallax effect for buttons
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.main
      className={styles.main}
      ref={mainRef}
      initial="hidden"
      animate={controls}
      variants={backgroundVariants}
    >
      <motion.div
        className={styles.mainOverlay}
        variants={overlayVariants}
      ></motion.div>

      {/* Logo */}
      <motion.div className={styles.logoContainer} variants={logoVariants}>
        <Image
          loading="lazy"
          src="/bisha-chamber-logo.png"
          alt="Bisha Chamber Logo"
          className={styles.logo}
          width={240}
          height={240}

        />
      </motion.div>

      {/* Hero copy + calls to action */}
      <motion.div className={styles.heroContent} variants={buttonVariants}>
        <h1 className={styles.heroTitle}>نُمكّن أعمال بيشة ونصنع فرصها</h1>
        <p className={styles.heroSubtitle}>
          منصة متكاملة لخدمات الأعمال والاستثمار والمعرفة الاقتصادية في بيشة.
        </p>
        <div className={styles.heroActions}>
          <Link href="/services" className={styles.heroBtnPrimary}>
            استكشف الخدمات
          </Link>
          <Link href="/about/studies" className={styles.heroBtnSecondary}>
            اكتشف فرص الاستثمار
          </Link>
        </div>
      </motion.div>
    </motion.main>
  );
}
