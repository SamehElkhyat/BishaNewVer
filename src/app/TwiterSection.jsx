import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import styles from "../styles/TwitterSection.module.css";

export default function TwitterSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  const imageControls = useAnimation();
  const imageRef = useRef(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      imageControls.start("visible");
    }
  }, [isInView, controls, imageControls]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageRef.current) return;

      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      // Apply subtle rotation based on mouse position
      imageControls.start({
        rotateY: x * 5,
        rotateX: -y * 5,
        transition: { type: "spring", stiffness: 100, damping: 30 },
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [imageControls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0.2, 0.5, 0.2],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <section className={styles.twitterSection} ref={sectionRef}>
      <div className={styles.backgroundGradient}></div>
      <div className={styles.backgroundPattern}></div>
      <div className={styles.glowEffect1}></div>
      <div className={styles.glowEffect2}></div>

      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Content */}
        <motion.div className={styles.contentContainer} variants={itemVariants}>
          <motion.div className={styles.titleWrapper} variants={itemVariants}>
            <h2 className={styles.sectionTitle}>تابع غرفة بيشة على اكس</h2>
            <div className={styles.titleUnderline}></div>
          </motion.div>

          <motion.p
            className={styles.sectionDescription}
            variants={itemVariants}
          >
            تابع آخر أخبار وفعاليات غرفة بيشة على منصة تويتر للبقاء على اطلاع
            بكل جديد من خدمات وأنشطة الغرفة التجارية
          </motion.p>

          <motion.div className={styles.statsContainer} variants={itemVariants}>
            <motion.div
              className={styles.statItem}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <span className={styles.statNumber}>+3K</span>
              <span className={styles.statLabel}>متابع</span>
            </motion.div>
            <motion.div
              className={styles.statItem}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <span className={styles.statNumber}>+2K</span>
              <span className={styles.statLabel}>تغريدة</span>
            </motion.div>
          </motion.div>

          <motion.a
            href="https://x.com/Bisha_cci"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.twitterButton}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>تابعنا على</span>

            <svg
              className={styles.xLogo}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </motion.a>
        </motion.div>

        {/* Twitter Profile Preview */}
        <motion.div
          className={styles.twitterProfileContainer}
          variants={itemVariants}
          ref={imageRef}
        >
          <motion.div
            className={styles.imageGlow}
            variants={glowVariants}
            animate="visible"
          ></motion.div>
          <motion.div
            className={styles.imageFrame}
            variants={imageVariants}
            animate={imageControls}
          >
            <Image
              loading="lazy"
              src="/Tiwtter.jpg"
              alt="Twitter Profile"
              width={600}
              height={600}
              className={styles.twitterProfileImage}
            />
            <div className={styles.imageOverlay}></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
