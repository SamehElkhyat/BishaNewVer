"use client";

import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaBuilding } from 'react-icons/fa';
import styles from '../../styles/Contact.module.css';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    PhoneNumber: '',
    serviceType: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const [contact, setContact] = useState();


  const GetContact = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Admin/Get-Contact-US`);
      setContact(response.data);
    } catch (error) {
      console.error('Error fetching contact:', error);
    }
  }

  useEffect(() => {
    GetContact();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.PhoneNumber || !formData.message) {
      setFormError(true);
      setTimeout(() => setFormError(false), 3000);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Contact/Add`, formData);
      toast.success('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setFormSubmitted(true);

    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        PhoneNumber: '',
        serviceType: '',
        message: ''
      });
    }, 3000);
  };

  const serviceTypes = [
    "استفسار عام",
    "خدمات الأعضاء",
    "خدمات التدريب",
    "شكوى",
    "اقتراح",
    "أخرى"
  ];

  return (
    <div className={styles.contactContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>اتصل بنا</h1>
          <p className={styles.pageDescription}>
            يسعدنا تواصلكم معنا واستقبال استفساراتكم واقتراحاتكم
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className={styles.infoHeader}>
              <h2>العنوان وأرقام الهواتف</h2>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FaBuilding />
                </div>
                <div className={styles.infoContent}>
                  <h3>الغرفة التجارية ببيشة</h3>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FaPhone />
                </div>
                <div className={styles.infoContent}>
                  <h3>الهواتف</h3>
                    <p>{contact?.firstPhoneNumber} - {contact?.secondPhoneNumber}</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FaEnvelope />
                </div>
                <div className={styles.infoContent}>
                  <h3>البريد الإلكتروني</h3>
                  <p>
                    <a href="mailto:bisha@bishacci.org" className={styles.emailLink}>
                        {contact?.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FaMapMarkerAlt />
                </div>
                <div className={styles.infoContent}>
                  <h3>العنوان</h3>
                  <p>{contact?.address}</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FaClock />
                </div>
                <div className={styles.infoContent}>
                  <h3>أوقات العمل</h3>
                  <p>{contact?.workingHours}</p>
                </div>
              </div>
            </div>

            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14617.246181016966!2d42.50258243955077!3d20.00000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15ef5a8c48a93809%3A0xf6e523369a8fb909!2sBisha%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1653649819015!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع الغرفة التجارية ببيشة"
              ></iframe>
            </div>
          </div>

          <div className={styles.contactForm}>
            <div className={styles.formHeader}>
              <h2>تواصل معنا</h2>
              <p>يرجى تعبئة النموذج أدناه وسنقوم بالرد عليكم في أقرب وقت ممكن</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">الاسم</label>
                <input

                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="الاسم الكامل"
                  className={styles.formControl}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@domain.com"
                  className={styles.formControl}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">رقم الجوال</label>
                <input
                  type="text"
                  id="PhoneNumber"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  placeholder="05XXXXXXXX"
                  className={styles.formControl}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="serviceType">نوع الخدمة المطلوبة</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className={styles.formControl}
                >
                  <option value="">اختر نوع الخدمة</option>
                  {serviceTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">رسالتك</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="اكتب رسالتك هنا..."
                  className={`${styles.formControl} ${styles.textarea}`}
                  rows={5}
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                <FaPaperPlane className={styles.buttonIcon} />
                <span>ارســال</span>
              </button>

              {formSubmitted && (
                <div className={styles.successMessage}>
                  <p>تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.</p>
                </div>
              )}

              {formError && (
                <div className={styles.errorMessage}>
                  <p>يرجى تعبئة جميع الحقول المطلوبة.</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <div className={styles.faqHead}>
            <h2 className={styles.faqTitle}>الأسئلة الشائعة</h2>
            <p className={styles.faqSub}>
              إجابات سريعة لأهم الاستفسارات التي تردنا.
            </p>
          </div>
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary className={styles.faqQ}>
                <span>كيف يمكنني تجديد اشتراكي في الغرفة؟</span>
                <span className={styles.faqChevron} aria-hidden>
                  +
                </span>
              </summary>
              <p className={styles.faqA}>
                يمكنك تجديد اشتراكك إلكترونياً عبر بوابة المشتركين، أو بزيارة مقر
                الغرفة الرئيسي مع إحضار السجل التجاري الساري المفعول.
              </p>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQ}>
                <span>ما هي أوقات عمل قسم التصاديق؟</span>
                <span className={styles.faqChevron} aria-hidden>
                  +
                </span>
              </summary>
              <p className={styles.faqA}>
                يعمل قسم التصاديق من الأحد إلى الخميس، من الساعة 8:00 صباحاً وحتى
                2:30 مساءً.
              </p>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQ}>
                <span>هل توفر الغرفة استشارات قانونية للأعمال؟</span>
                <span className={styles.faqChevron} aria-hidden>
                  +
                </span>
              </summary>
              <p className={styles.faqA}>
                نعم، تقدم الغرفة خدمة الاستشارات القانونية للمشتركين. يرجى حجز
                موعد مسبق عبر البوابة الإلكترونية أو الاتصال بالهاتف المجاني.
              </p>
            </details>
          </div>
        </div>
      </section>

      <Toaster />
    </div>
  );
};

export default ContactPage;
