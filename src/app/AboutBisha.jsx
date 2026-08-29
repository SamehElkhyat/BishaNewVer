import React from "react";
import Image from "next/image";
import styles from "../styles/AboutBisha.module.css";

export default function AboutBisha() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.aboutContainer}>
        <div className={styles.aboutContent}>
          <div className={styles.textContainer}>
            <h2 className={styles.aboutTitle}>عن الغرفة</h2>

            <p className={styles.aboutText}>
              تُعد غرفة بيشة من الغرف التجارية الواعدة، حيث تأسست في عام 1435هـ
              – 2014م لتكون رافدًا اقتصاديًا لمحافظة بيشة. ومنذ انطلاقتها، عملت
              الغرفة من خلال دوراتها المتعاقبة على دعم مجتمع الأعمال وفتح آفاق
              استثمارية جديدة، في إطار دور محايد يواكب مستهدفات رؤية المملكة
              2030.
            </p>
          </div>

          <div className={styles.imageContainer}>
            <Image
              loading="lazy"
              src="/bisha-chamber-logo.png"
              alt="Bisha Chamber Logo"
              width={300}
              height={300}
              className={styles.aboutImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
