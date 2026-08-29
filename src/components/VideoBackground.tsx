import React from "react";
import Image from "next/image";
import styles from "../styles/VideoBackground.module.css";

const VideoBackground = () => {
  return (
    <div className={styles.videoContainer}>
      <div className={styles.imageWrapper}>
        <Image
          src="/hero-bisha.jpg"
          alt="Bisha Background 1"
          fill
          quality={100}
          className={styles.backgroundImage1}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            imageRendering: "crisp-edges",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        />
        <Image
          loading="lazy"
          src="/hero-bisha.jpg"
          alt="Bisha Background 2"
          fill
          quality={100}
          className={styles.backgroundImage2}
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
