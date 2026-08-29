"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/Login.module.css";
import { FaEnvelope, FaLock, FaSpinner, FaSignInAlt } from "react-icons/fa";

const LoginPage = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, user, error: authError } = useAuth();

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("يرجى إدخال اسم البريد الإلكتروني وكلمة المرور");
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(email, password);

      console.log("Login result:", success);

      if (success) {
        router.push("/verify");
      } else {
        setError("اسم البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch (error) {
      setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      console.error("Login error:", error);
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
          <h1>تسجيل الدخول للإدارة</h1>
          <p className={styles.loginSubtitle}>
            الرجاء إدخال بيانات الاعتماد الخاصة بك للوصول
          </p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">اسم البريد الإلكتروني</label>
            <div className={styles.inputWithIcon}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                className="text-black"
                type="text"
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="admin@bishachamber.com"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">كلمة المرور</label>
            <div className={styles.inputWithIcon}>
              <FaLock className={styles.inputIcon} />
              <input
                className="text-black"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className={styles.loginOptions}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              <span>تذكرني</span>
            </label>
            <Link
              href={
                email
                  ? `/forgot-password?email=${encodeURIComponent(email)}`
                  : "/forgot-password"
              }
              className={styles.forgotLink}
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className={styles.spinner} /> جاري تسجيل الدخول...
              </>
            ) : (
              <>
                تسجيل الدخول
                <FaSignInAlt className={styles.buttonIcon} />
              </>
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          هل تواجه مشكلة في تسجيل الدخول؟{" "}
          <Link href="/contact">تواصل مع الدعم الفني</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
