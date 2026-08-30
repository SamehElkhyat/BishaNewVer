import React from "react";
import Link from "next/link";
import styles from "../styles/FAQSection.module.css";

// Same three Q&As shown on /contact — surfaced here so visitors can
// self-serve the most common questions without leaving the homepage.
const faqs = [
  {
    q: "كيف يمكنني تجديد اشتراكي في الغرفة؟",
    a: "يمكنك تجديد اشتراكك إلكترونياً عبر بوابة المشتركين، أو بزيارة مقر الغرفة الرئيسي مع إحضار السجل التجاري الساري المفعول.",
  },
  {
    q: "ما هي أوقات عمل قسم التصاديق؟",
    a: "يعمل قسم التصاديق من الأحد إلى الخميس، من الساعة 8:00 صباحاً وحتى 2:30 مساءً.",
  },
  {
    q: "هل توفر الغرفة استشارات قانونية للأعمال؟",
    a: "نعم، تقدم الغرفة خدمة الاستشارات القانونية للمشتركين. يرجى حجز موعد مسبق عبر البوابة الإلكترونية أو الاتصال بالهاتف المجاني.",
  },
];

export default function FAQSection() {
  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>الأسئلة الشائعة</h2>
          <p className={styles.subtitle}>إجابات سريعة لأهم الاستفسارات التي تردنا</p>
        </div>

        <div className={styles.list}>
          {faqs.map((item, index) => (
            <details key={index} className={styles.item}>
              <summary className={styles.question}>
                <span>{item.q}</span>
                <span className={styles.chevron} aria-hidden>
                  +
                </span>
              </summary>
              <p className={styles.answer}>{item.a}</p>
            </details>
          ))}
        </div>

        <Link href="/contact" className={styles.moreLink}>
          لديك سؤال آخر؟ تواصل معنا
        </Link>
      </div>
    </section>
  );
}
