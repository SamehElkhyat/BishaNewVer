"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "../../styles/Login.module.css";
import { FaEnvelope, FaSpinner, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { authAPI } from "../../services/api";

function ForgotPasswordInner() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const value = email.trim();
    if (!value) {
      setError("يرجى إدخال بريدك الإلكتروني");
      return;
    }
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(value);
      setSent(true);
    } catch (err) {
      const msg = (err as Error)?.message || "";
      setError(
        /failed to fetch|networkerror|load failed/i.test(msg)
          ? "تعذّر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى."
          : msg || "تعذّر إرسال رابط إعادة التعيين. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <Image
            src="/bisha-chamber-logo.png"
            alt="غرفة بيشة"
            width={96}
            height={96}
            className={styles.loginLogo}
            priority
          />
          <h1>إعادة تعيين كلمة المرور</h1>
          <p className={styles.loginSubtitle}>
            {sent
              ? "تحقّق من بريدك الإلكتروني"
              : "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور"}
          </p>
        </div>

        {sent ? (
          <>
            <div className={styles.confirmState}>
              <span className={styles.confirmIcon}>
                <FaCheckCircle />
              </span>
              <p>
                إذا كان هناك حساب مرتبط بـ <strong>{email}</strong> فسيصلك رابط
                إعادة تعيين كلمة المرور خلال دقائق. لا تنسَ التحقّق من مجلد الرسائل
                غير المرغوب فيها.
              </p>
            </div>
            <Link href="/login" className={styles.loginButton}>
              العودة إلى تسجيل الدخول
            </Link>
          </>
        ) : (
          <>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">البريد الإلكتروني</label>
                <div className={styles.inputWithIcon}>
                  <FaEnvelope className={styles.inputIcon} />
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@bishachamber.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className={styles.spinner} /> جاري الإرسال...
                  </>
                ) : (
                  <>
                    إرسال الرابط
                    <FaPaperPlane className={styles.buttonIcon} />
                  </>
                )}
              </button>
            </form>

            <div className={styles.loginFooter}>
              تذكرت كلمة المرور؟ <Link href="/login">تسجيل الدخول</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordInner />
    </Suspense>
  );
}
