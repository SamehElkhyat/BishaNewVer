"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/Verify.module.css";
import { FaLockOpen, FaArrowLeft, FaRedoAlt, FaSpinner } from "react-icons/fa";
import { verifyAPI } from "../../services/api";

const CODE_LENGTH = 6;
const TYPE_OF_GENERATE = "VerifyLogin";

const VerifyPage = () => {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Focus the first digit on load
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Resend cooldown ticker
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const setDigit = (index: number, value: string) => {
    setCode((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    setError("");
    if (digit && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!digits) return;
    const next = Array(CODE_LENGTH).fill("");
    digits.split("").forEach((d, i) => {
      next[i] = d;
    });
    setCode(next);
    setError("");
    const focusIndex = Math.min(digits.length, CODE_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const joined = code.join("");
    if (joined.length < CODE_LENGTH) {
      setError("يرجى إدخال رمز التحقق المكون من 6 أرقام");
      return;
    }
    setIsLoading(true);
    try {
      const res = await verifyAPI.verifyCode(joined, TYPE_OF_GENERATE);

      const payload =
        res && typeof res === "object"
          ? res.data && typeof res.data === "object"
            ? { ...res, ...res.data }
            : res
          : {};

      // The session travels in the HttpOnly cookie. If the backend still hands
      // back a JWT, keep it as a bearer fallback — but only a real JWT, since
      // AuthContext will otherwise treat an opaque token as expired and log out.
      const token =
        payload.token ??
        payload.accessToken ??
        payload.access_token ??
        payload.jwt;
      const isJwt =
        typeof token === "string" && token.split(".").length === 3;

      if (isJwt) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }

      // Completing the admin login + code = an authenticated admin session.
      // Persist the markers the admin route guards read (role + permissions).
      const perms = payload.permission ?? payload.Permission;
      const id = payload.id ?? payload.ID ?? payload.userId ?? null;

      localStorage.setItem(
        "DecodedToken",
        JSON.stringify({
          ...payload,
          role: "admin",
          Permission:
            Array.isArray(perms) && perms.length
              ? perms
              : ["GetContact", "AddNewsPaper", "GetAllUsers"],
          ID: id,
        })
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          id,
          email: payload.email ?? "",
          name: payload.name ?? payload.email ?? "مدير النظام",
          role: "admin",
        })
      );

      // Full navigation into the protected area so AuthContext + the admin
      // route guards read a fresh, authenticated session.
      window.location.href = "/admin";
    } catch (err) {
      setError(
        (err as Error)?.message ||
          "رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى."
      );
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setError("");
    setInfo("");
    setIsResending(true);
    try {
      await verifyAPI.resendCode(TYPE_OF_GENERATE);
      setInfo("تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.");
      setResendCooldown(30);
    } catch (err) {
      setError(
        (err as Error)?.message ||
          "تعذّر إعادة إرسال الرمز. يرجى المحاولة لاحقاً."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verifyCard}>
        <span className={styles.accentBar} />

        <div className={styles.iconCircle}>
          <FaLockOpen />
        </div>

        <h1 className={styles.verifyTitle}>التحقق من الرمز</h1>
        <p className={styles.verifySubtitle}>
          تم إرسال رمز التحقق إلى بريدك الإلكتروني. يرجى إدخاله للمتابعة.
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {info && <div className={styles.infoMessage}>{info}</div>}

        <form className={styles.verifyForm} onSubmit={handleVerify}>
          <div className={styles.otpRow} dir="ltr">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                className={styles.otpInput}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                aria-label={`الرقم ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            className={styles.confirmButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className={styles.spinner} /> جاري التحقق...
              </>
            ) : (
              <>
                <span>تأكيد</span>
                <FaArrowLeft className={styles.buttonIcon} />
              </>
            )}
          </button>
        </form>

        <div className={styles.secondaryActions}>
          <button
            type="button"
            className={styles.resendButton}
            onClick={handleResend}
            disabled={isResending || resendCooldown > 0}
          >
            <FaRedoAlt />
            {resendCooldown > 0
              ? `إعادة إرسال الرمز (${resendCooldown})`
              : isResending
              ? "جاري الإرسال..."
              : "إعادة إرسال الرمز"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
