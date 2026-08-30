import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import styles from "../styles/AboutTeaser.module.css";

export default function AboutTeaser() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageCol}>
          <div className={styles.imageDecor} aria-hidden />
          <div className={styles.imageFrame}>
            <Image
              src="/bisha_1.png"
              alt="غرفة بيشة"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        <div className={styles.textCol}>
          <span className={styles.badge}>من نحن</span>
          <h2 className={styles.title}>عن الغرفة</h2>
          <p className={styles.desc}>
            تُعد غرفة بيشة من الغرف التجارية الواعدة، حيث تأسست في عام 1435هـ –
            2014م لتكون رافدًا اقتصاديًا لمحافظة بيشة. ومنذ انطلاقتها، عملت
            الغرفة من خلال دوراتها المتعاقبة على دعم مجتمع الأعمال وفتح آفاق
            استثمارية جديدة، في إطار دور محايد يواكب مستهدفات رؤية المملكة
            2030.
          </p>
          <Link href="/about" className={styles.cta}>
            <span>تعرّف على الغرفة</span>
            <FaArrowLeft className={styles.ctaIcon} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
