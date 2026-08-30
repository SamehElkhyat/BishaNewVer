"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "../styles/VideoBackground.module.css";
import { HIDDEN_PREFIXES } from "./SiteChrome";

const VideoBackground = () => {
  const pathname = usePathname() || "";
  const hide = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (hide) return null;

  return (
    <div className={styles.videoContainer}>
      <div className={styles.imageWrapper}>
        <Image
          src="/hero-bisha.jpg"
          alt="Bisha Background"
          fill
          quality={75}
          className={styles.backgroundImage1}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            imageRendering: "crisp-edges",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        />
      </div>
      <div className={styles.overlay}></div>
    </div>
  );
};

export default VideoBackground;
