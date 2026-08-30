"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/Login.module.css";
import { FaEnvelope, FaLock, FaSpinner, FaKey, FaCheckCircle } from "react-icons/fa";
import { authAPI } from "../../services/api";

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const emailFromLink = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromLink);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("رابط إعادة التعيين غير صالح أو منتهي الصلاحية.");
      return;
    }
    if (!email.trim()) {
      setError("يرجى إدخال بريدك الإلكتروني");
      return;
    }
    if (newPassword.length < 8) {
      setError("يجب أن تتكوّن كلمة المرور من 8 أحرف على الأقل");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.resetPassword({
        email: email.trim(),
        token,
        newPassword,
        confirmPassword,
      });
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      const msg = (err as Error)?.message || "";
      setError(
        /failed to fetch|networkerror|load failed/i.test(msg)
          ? "تعذّر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى."
          : msg ||
              "تعذّر إعادة تعيين كلمة المرور. قد يكون الرابط منتهي الصلاحية."
      );
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
          <h1>تعيين كلمة مرور جديدة</h1>
          <p className={styles.loginSubtitle}>
            {done
              ? "تم تحديث كلمة المرور بنجاح"
              : "اختر كلمة مرور جديدة لحسابك"}
          </p>
        </div>

        {done ? (
          <>
            <div className={styles.confirmState}>
              <span className={styles.confirmIcon}>
                <FaCheckCircle />
              </span>
              <p>
                تم تحديث كلمة المرور بنجاح. جارٍ تحويلك إلى صفحة تسجيل الدخول…
              </p>
            </div>
            <Link href="/login" className={styles.loginButton}>
              الذهاب لتسجيل الدخول
            </Link>
          </>
        ) : (
          <>
            {!token && (
              <div className={styles.errorMessage}>
                رابط إعادة التعيين غير صالح. اطلب رابطاً جديداً من صفحة نسيت كلمة
                المرور.
              </div>
            )}
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
                    disabled={!!emailFromLink}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newPassword">كلمة المرور الجديدة</label>
                <div className={styles.inputWithIcon}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                <div className={styles.inputWithIcon}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
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
                    <FaSpinner className={styles.spinner} /> جاري الحفظ...
                  </>
                ) : (
                  <>
                    تعيين كلمة المرور
                    <FaKey className={styles.buttonIcon} />
                  </>
                )}
              </button>
            </form>

            <div className={styles.loginFooter}>
              <Link href="/login">العودة إلى تسجيل الدخول</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
