"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FaLightbulb, FaHandshake, FaGraduationCap, FaChartLine, FaUsers, FaLink } from 'react-icons/fa';
import styles from '../../styles/Initiatives.module.css';

// Initiatives data
const initiativesData = [
  {
    id: 1,
    title: "مبادرة تطوير المنشآت الصغيرة والمتوسطة",
    icon: <FaChartLine className={styles.initiativeIcon} />,
    image: "/initiative-sme.jpg",
    description: "تهدف هذه المبادرة إلى دعم وتطوير المنشآت الصغيرة والمتوسطة في محافظة بيشة من خلال تقديم الاستشارات والتدريب والتمويل، وتسهيل الإجراءات الحكومية، وفتح أسواق جديدة للمنتجات المحلية.",
    goals: [
      "تنمية قدرات أصحاب المنشآت الصغيرة والمتوسطة",
      "تسهيل الحصول على التمويل المناسب",
      "تطوير المنتجات المحلية وزيادة تنافسيتها",
      "فتح أسواق جديدة للمنتجات المحلية"
    ],
    link: "#"
  },
  {
    id: 2,
    title: "مبادرة التدريب والتأهيل",
    icon: <FaGraduationCap className={styles.initiativeIcon} />,
    image: "/initiative-training.jpg",
    description: "تركز هذه المبادرة على تدريب وتأهيل الكوادر الوطنية في مختلف المجالات، وتزويدهم بالمهارات اللازمة لسوق العمل، من خلال برامج تدريبية متخصصة وورش عمل وشراكات مع الجهات التعليمية والتدريبية.",
    goals: [
      "تأهيل الكوادر الوطنية لسوق العمل",
      "تطوير المهارات الفنية والإدارية",
      "تعزيز ثقافة ريادة الأعمال",
      "زيادة فرص التوظيف للشباب والشابات"
    ],
    link: "#"
  },
  {
    id: 3,
    title: "مبادرة الاستثمار في بيشة",
    icon: <FaLightbulb className={styles.initiativeIcon} />,
    image: "/initiative-investment.jpg",
    description: "تسعى هذه المبادرة إلى جذب الاستثمارات المحلية والأجنبية إلى محافظة بيشة، من خلال الترويج للفرص الاستثمارية المتاحة، وتسهيل إجراءات الاستثمار، وتقديم الحوافز للمستثمرين، وتوفير البيانات والمعلومات اللازمة.",
    goals: [
      "جذب الاستثمارات المحلية والأجنبية",
      "تحديد وترويج الفرص الاستثمارية",
      "تسهيل إجراءات الاستثمار",
      "تنمية القطاعات الواعدة في المحافظة"
    ],
    link: "#"
  },
  {
    id: 4,
    title: "مبادرة الشراكات الاستراتيجية",
    icon: <FaHandshake className={styles.initiativeIcon} />,
    image: "/initiative-partnership.jpg",
    description: "تهدف هذه المبادرة إلى بناء شراكات استراتيجية مع مختلف الجهات الحكومية والخاصة والمؤسسات غير الربحية، لتنفيذ مشاريع تنموية تسهم في تحقيق التنمية المستدامة في محافظة بيشة وتحسين جودة الحياة للمواطنين.",
    goals: [
      "بناء شراكات فاعلة مع القطاعين العام والخاص",
      "تنفيذ مشاريع تنموية مشتركة",
      "تبادل الخبرات والمعرفة",
      "تعزيز التكامل بين مختلف الجهات"
    ],
    link: "#"
  },
  {
    id: 5,
    title: "مبادرة التحول الرقمي",
    icon: <FaUsers className={styles.initiativeIcon} />,
    image: "/initiative-digital.jpg",
    description: "تركز هذه المبادرة على دعم التحول الرقمي للمنشآت التجارية والصناعية في محافظة بيشة، من خلال تقديم الاستشارات والتدريب على استخدام التقنيات الحديثة، وتطوير الحلول الرقمية، وتسهيل الوصول إلى الأسواق الإلكترونية.",
    goals: [
      "تعزيز التحول الرقمي للمنشآت",
      "تطوير المهارات الرقمية للعاملين",
      "زيادة الوصول إلى الأسواق الإلكترونية",
      "تحسين كفاءة العمليات التجارية"
    ],
    link: "#"
  }
];

const InitiativesPage = () => {
  const [activeInitiative, setActiveInitiative] = useState<number | null>(null);

  // Toggle active initiative
  const toggleInitiative = (id: number) => {
    setActiveInitiative(activeInitiative === id ? null : id);
  };

  return (
    <div className={styles.initiativesContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>المبادرات</h1>
          <p className={styles.pageDescription}>
            مبادرات غرفة بيشة لدعم قطاع الأعمال وتحقيق التنمية المستدامة في المحافظة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.initiativesIntro}>
          <h2>نعمل معاً لمستقبل أفضل</h2>
          <p>
            تسعى غرفة بيشة من خلال مبادراتها المتنوعة إلى تحقيق التنمية الاقتصادية المستدامة في المحافظة، ودعم قطاع الأعمال، وتمكين رواد الأعمال، وتوفير فرص العمل، وتحسين جودة الحياة للمواطنين.
          </p>
        </div>

        <div className={styles.initiativesGrid}>
          {initiativesData.map((initiative) => (
            <div 
              key={initiative.id} 
              className={`${styles.initiativeCard} ${activeInitiative === initiative.id ? styles.active : ''}`}
              onClick={() => toggleInitiative(initiative.id)}
            >
              <div className={styles.initiativeHeader}>
                <div className={styles.initiativeIconContainer}>
                  {initiative.icon}
                </div>
                <h3 className={styles.initiativeTitle}>{initiative.title}</h3>
              </div>
              
              <div className={styles.initiativeImageContainer}>
                <Image
                            loading="lazy"

                  src={initiative.image}
                  alt={initiative.title}
                  width={500}
                  height={300}
                  className={styles.initiativeImage}
                />
              </div>
              
              <div className={styles.initiativeContent}>
                <p className={styles.initiativeDescription}>{initiative.description}</p>
                
                <div className={styles.initiativeGoals}>
                  <h4>أهداف المبادرة:</h4>
                  <ul>
                    {initiative.goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
                
                <a href={initiative.link} className={styles.initiativeLink}>
                  <FaLink className={styles.linkIcon} />
                  <span>تفاصيل أكثر عن المبادرة</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.joinSection}>
          <div className={styles.joinContent}>
            <h2>شارك معنا في تحقيق التنمية</h2>
            <p>
              نرحب بمشاركتكم في مبادراتنا ومقترحاتكم لتطويرها. يمكنكم التواصل معنا للمشاركة أو الاستفسار عن أي من المبادرات.
            </p>
            <a href="/contact" className={styles.joinButton}>
              تواصل معنا
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativesPage;
