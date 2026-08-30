"use client";

import { Tajawal } from "next/font/google";
import Image from "next/image";
import {
  KeyRound,
  Loader2,
  UserRound,
  Gavel,
  Landmark,
  CheckCircle2,
  Smartphone,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "signin" | "signup";

type VoterForm = {
  name: string;
  commercialRegistration: string;
  mobile: string;
  establishmentName: string;
};

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

// التعديل هنا: جعل السجل التجاري اختيارياً مع التحقق من الطول إن وُجد
function validateCommercialRegistration(value: string) {
  const digits = normalizeDigits(value);

  // إذا كان الحقل فارغاً، نعتبره صحيحاً (اختياري)
  if (!digits || digits.length === 0) return "";

  // إذا كتب المستخدم شيئاً، يجب أن يكون 10 أرقام
  if (!/^\d{10}$/.test(digits)) {
    return "رقم السجل التجاري يجب أن يكون 10 أرقام (أو اتركه فارغاً)";
  }
  return "";
}

function validateKsaMobile(value: string) {
  const digits = normalizeDigits(value);
  if (!digits) return "رقم الجوال مطلوب";

  const regex = /^(\+\d{1,3}|0)?5\d{8}$/;
  if (!regex.test(value.trim())) return "رقم الجوال غير صحيح";

  return "";
}

export default function VotingAuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signin");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [otpPhone, setOtpPhone] = useState("");
  const [otpTouched, setOtpTouched] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [voter, setVoter] = useState<VoterForm>({
    name: "",
    commercialRegistration: "",
    mobile: "",
    establishmentName: "",
  });

  const [touched, setTouched] = useState<
    Partial<Record<keyof VoterForm, boolean>>
  >({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof VoterForm, string>>
  >({});

  const tabs = useMemo(
    () => [
      { key: "signin" as const, label: "تسجيل الدخول (OTP)" },
      { key: "signup" as const, label: "بيانات المصوّت" },
    ],
    []
  );

  function validateField(key: keyof VoterForm, value: string) {
    if (key === "name") return value.trim() ? "" : "الاسم مطلوب";
    if (key === "establishmentName")
      return value.trim() ? "" : "اسم المنشأة مطلوب";
    if (key === "commercialRegistration")
      return validateCommercialRegistration(value);
    if (key === "mobile") return validateKsaMobile(value);
    return "";
  }

  function validateAll(next: VoterForm) {
    const nextErrors: Partial<Record<keyof VoterForm, string>> = {};
    (Object.keys(next) as (keyof VoterForm)[]).forEach((k) => {
      const message = validateField(k, next[k]);
      if (message) nextErrors[k] = message;
    });
    return nextErrors;
  }

  async function handleSignin(phoneNumber: string) {
    setIsSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("/api/GeneralAssembly/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "فشل تسجيل الدخول");

      localStorage.setItem("ga_authed", "1");
      localStorage.setItem("ga_auth_mode", "otp");
      localStorage.setItem("ga_phone", phoneNumber);
      const userId =
        data?.id || data?.userId || data?.user?.id || data?.user?.userId;
      if (userId) localStorage.setItem("ga_userId", String(userId));

      router.push("/voting-dashboard");
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignup(next: VoterForm) {
    setIsSubmitting(true);
    setApiError("");
    try {
      const payload = {
        name: next.name.trim(),
        commercialRegister: normalizeDigits(next.commercialRegistration) || null, // إرسال null إذا كان فارغاً
        mobileNumber: next.mobile,
        establishmentName: next.establishmentName.trim(),
      };

      const res = await fetch("/api/GeneralAssembly/Add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "فشل إنشاء الحساب");

      localStorage.setItem("ga_authed", "1");
      localStorage.setItem("ga_auth_mode", "registered");
      localStorage.setItem("ga_phone", payload.mobileNumber);
      const userId =
        data?.id || data?.userId || data?.user?.id || data?.user?.userId;
      if (userId) localStorage.setItem("ga_userId", String(userId));

      router.push("/voting-dashboard");
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ---- presentation-only helpers ---- */
  const fieldClass =
    "w-full rounded-lg border border-[#bec9c6] bg-[#f7f9ff] px-4 py-3 text-right text-[#121d26] shadow-inner transition focus:border-[#246960] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a9ece1]";
  const errorClass = "mt-2 text-sm font-semibold text-[#ba1a1a]";
  const labelClass = "mb-2 block text-sm font-bold text-[#121d26]";

  return (
    <main
      dir="rtl"
      className={`${tajawal.className} flex min-h-screen flex-col`}
      style={{
        backgroundColor: "#f7f9ff",
        backgroundImage:
          "radial-gradient(rgba(146,211,200,0.18) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#edf4ff] py-12 md:py-16">
        <div className="pointer-events-none absolute -right-24 -top-40 h-[420px] w-[420px] rounded-full bg-[#8ed3ca]/25 blur-[120px]" />
        <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center gap-8 px-4 md:flex-row md:px-12">
          <div className="flex flex-1 flex-col gap-4 text-right">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#d9e3f1]/70 px-3 py-1 text-xs font-semibold text-[#3f4947]">
              <Gavel className="h-4 w-4" />
              الفعاليات الرسمية
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-[#0b5d56] md:text-5xl">
              الجمعية العمومية
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#3f4947]">
              المنصة الرسمية لأعضاء غرفة بيشة للمشاركة في قرارات الجمعية العمومية،
              الاطلاع على التقارير السنوية، والمساهمة في رسم مستقبل اقتصاد المنطقة.
            </p>
          </div>
          <div className="relative hidden h-[240px] w-full flex-1 overflow-hidden rounded-2xl border border-[#bec9c6]/50 shadow-lg md:block md:h-[300px]">
            <Image
              src="/voting-auth.png"
              alt="اجتماعات مثمرة"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <div className="absolute bottom-4 right-4 text-white">
              <span className="block text-lg font-semibold">اجتماعات مثمرة</span>
              <span className="text-sm text-white/80">نحو مستقبل اقتصادي واعد</span>
            </div>
          </div>
        </div>
      </section>

      {/* Portal & Login */}
      <section className="relative z-20 mx-auto -mt-8 w-full max-w-[1100px] px-4 pb-16 md:px-12">
        <div className="flex flex-col overflow-hidden rounded-2xl border border-[#bec9c6]/50 bg-white shadow-[0_4px_20px_rgba(11,93,86,0.06)] lg:flex-row">
          {/* Information pane */}
          <div className="flex flex-col justify-center border-b border-[#bec9c6]/30 bg-[#edf4ff] p-6 md:p-8 lg:w-5/12 lg:border-b-0 lg:border-l">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5d56] text-white">
                <Landmark className="h-6 w-6" />
              </span>
              <h2 className="text-xl font-bold text-[#0b5d56]">
                بوابة الجمعية العمومية
              </h2>
            </div>
            <p className="mb-6 leading-relaxed text-[#3f4947]">
              مرحباً بك في البوابة المخصصة لأعضاء الجمعية العمومية. من خلال هذه
              البوابة يمكنك الوصول إلى كافة الوثائق، التصويت على القرارات، ومتابعة
              جدول الأعمال بكل شفافية وسهولة.
            </p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#246960]" />
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-[#121d26]">
                    تصويت إلكتروني آمن
                  </span>
                  <span className="text-xs text-[#3f4947]">
                    شارك برأيك في القرارات الحيوية.
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#246960]" />
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-[#121d26]">
                    تقارير وإحصائيات شفافة
                  </span>
                  <span className="text-xs text-[#3f4947]">
                    وصول مباشر للتقارير المالية والأداء.
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Auth / OTP form pane */}
          <div className="bg-white p-6 md:p-8 lg:w-7/12">
            <div className="mb-6 border-b border-[#bec9c6]/30 pb-4">
              <h3 className="mb-1 text-lg font-bold text-[#121d26]">
                تسجيل الدخول للمتابعة
              </h3>
              <p className="text-[#3f4947]">
                يرجى إدخال بياناتك للوصول إلى منصة التصويت والوثائق.
              </p>
            </div>

            <div className="mb-6 flex w-fit flex-wrap gap-1 rounded-xl border border-[#bec9c6]/30 bg-[#d9e3f1]/40 p-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setMode(t.key);
                    setApiError("");
                  }}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                    mode === t.key
                      ? "bg-[#0b5d56] text-white shadow-sm"
                      : "text-[#3f4947] hover:text-[#0b5d56]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {mode === "signin" && (
              <div className="relative overflow-hidden rounded-xl border border-[#8ed3ca]/40 bg-[#edf4ff] p-5">
                <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-l from-[#0b5d56] to-[#246960]" />
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-lg font-bold text-[#0b5d56]">
                      <KeyRound className="h-5 w-5" />
                      التسجيل السريع (OTP)
                    </div>
                    <div className="text-sm text-[#3f4947]">
                      أدخل رقم الجوال لإرسال رمز التحقق
                    </div>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#bec9c6]/50 bg-white text-[#0b5d56]">
                    <Smartphone className="h-5 w-5" />
                  </span>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setOtpTouched(true);
                    const msg = validateKsaMobile(otpPhone);
                    setOtpError(msg);
                    if (msg) return;
                    await handleSignin(otpPhone);
                  }}
                >
                  <label
                    className={`${labelClass} flex items-center justify-between`}
                  >
                    <span>رقم الجوال :</span>
                    <span
                      className="text-xs font-normal text-[#6f7977]"
                      dir="ltr"
                    >
                      (05XXXXXXXX أو +9665XXXXXXXX)
                    </span>
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      value={otpPhone}
                      onChange={(e) => {
                        setOtpPhone(e.target.value);
                        if (otpTouched)
                          setOtpError(validateKsaMobile(e.target.value));
                      }}
                      onBlur={() => {
                        setOtpTouched(true);
                        setOtpError(validateKsaMobile(otpPhone));
                      }}
                      placeholder="مثال: 0512345678"
                      inputMode="tel"
                      className={`${fieldClass} flex-1`}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b5d56] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#246960] focus:outline-none focus:ring-2 focus:ring-[#0b5d56] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Loader2
                        className={`h-4 w-4 animate-spin transition-opacity ${
                          isSubmitting ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span>تسجيل الدخول</span>
                    </button>
                  </div>
                  {otpTouched && otpError && (
                    <div className={errorClass}>{otpError}</div>
                  )}
                </form>
              </div>
            )}

            {mode === "signup" && (
              <div className="relative overflow-hidden rounded-xl border border-[#8ed3ca]/40 bg-[#edf4ff] p-5">
                <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-l from-[#0b5d56] to-[#246960]" />
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#246960] text-white shadow-sm">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-lg font-bold text-[#0b5d56]">
                      بيانات المصوّت
                    </div>
                    <div className="text-sm text-[#3f4947]">
                      أكمل البيانات لإنشاء حساب ثم المتابعة
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const nextErrors = validateAll(voter);
                    setErrors(nextErrors);
                    setTouched({
                      name: true,
                      establishmentName: true,
                      commercialRegistration: true,
                      mobile: true,
                    });
                    if (Object.keys(nextErrors).length > 0) return;
                    await handleSignup(voter);
                  }}
                >
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className={labelClass}>الاسم :</label>
                      <input
                        value={voter.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          setVoter((prev) => ({ ...prev, name: value }));
                          if (touched.name)
                            setErrors((prev) => ({
                              ...prev,
                              name: validateField("name", value) || undefined,
                            }));
                        }}
                        onBlur={() => {
                          setTouched((p) => ({ ...p, name: true }));
                          setErrors((p) => ({
                            ...p,
                            name:
                              validateField("name", voter.name) || undefined,
                          }));
                        }}
                        placeholder="الاسم"
                        className={fieldClass}
                      />
                      {touched.name && errors.name && (
                        <div className={errorClass}>{errors.name}</div>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>اسم المنشأة :</label>
                      <input
                        value={voter.establishmentName}
                        onChange={(e) => {
                          const value = e.target.value;
                          setVoter((prev) => ({
                            ...prev,
                            establishmentName: value,
                          }));
                          if (touched.establishmentName)
                            setErrors((prev) => ({
                              ...prev,
                              establishmentName:
                                validateField("establishmentName", value) ||
                                undefined,
                            }));
                        }}
                        onBlur={() => {
                          setTouched((p) => ({
                            ...p,
                            establishmentName: true,
                          }));
                          setErrors((p) => ({
                            ...p,
                            establishmentName:
                              validateField(
                                "establishmentName",
                                voter.establishmentName
                              ) || undefined,
                          }));
                        }}
                        placeholder="مؤسسة"
                        className={fieldClass}
                      />
                      {touched.establishmentName &&
                        errors.establishmentName && (
                          <div className={errorClass}>
                            {errors.establishmentName}
                          </div>
                        )}
                    </div>

                    <div>
                      <label
                        className={`${labelClass} flex items-center justify-between`}
                      >
                        <span>رقم الجوال :</span>
                        <span
                          className="text-xs font-normal text-[#6f7977]"
                          dir="ltr"
                        >
                          (05XXXXXXXX أو +9665XXXXXXXX)
                        </span>
                      </label>
                      <input
                        value={voter.mobile}
                        onChange={(e) => {
                          const value = e.target.value;
                          setVoter((prev) => ({ ...prev, mobile: value }));
                          if (touched.mobile)
                            setErrors((prev) => ({
                              ...prev,
                              mobile:
                                validateField("mobile", value) || undefined,
                            }));
                        }}
                        onBlur={() => {
                          setTouched((p) => ({ ...p, mobile: true }));
                          setErrors((p) => ({
                            ...p,
                            mobile:
                              validateField("mobile", voter.mobile) ||
                              undefined,
                          }));
                        }}
                        placeholder="مثال: 0512345678"
                        inputMode="tel"
                        className={fieldClass}
                      />
                      {touched.mobile && errors.mobile && (
                        <div className={errorClass}>{errors.mobile}</div>
                      )}
                    </div>

                    <div>
                      <label
                        className={`${labelClass} flex items-center gap-2`}
                      >
                        <span>رقم السجل التجاري :</span>
                        <span className="text-xs font-normal text-[#6f7977]">
                          (اختياري)
                        </span>
                      </label>
                      <input
                        value={voter.commercialRegistration}
                        onChange={(e) => {
                          const value = e.target.value;
                          setVoter((prev) => ({
                            ...prev,
                            commercialRegistration: value,
                          }));
                          if (touched.commercialRegistration)
                            setErrors((prev) => ({
                              ...prev,
                              commercialRegistration:
                                validateField(
                                  "commercialRegistration",
                                  value
                                ) || undefined,
                            }));
                        }}
                        onBlur={() => {
                          setTouched((p) => ({
                            ...p,
                            commercialRegistration: true,
                          }));
                          setErrors((p) => ({
                            ...p,
                            commercialRegistration:
                              validateField(
                                "commercialRegistration",
                                voter.commercialRegistration
                              ) || undefined,
                          }));
                        }}
                        placeholder="0101010101 (أو اتركه فارغاً)"
                        inputMode="numeric"
                        className={fieldClass}
                      />
                      {touched.commercialRegistration &&
                        errors.commercialRegistration && (
                          <div className={errorClass}>
                            {errors.commercialRegistration}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b5d56] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#246960] focus:outline-none focus:ring-2 focus:ring-[#0b5d56] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Loader2
                        className={`h-4 w-4 animate-spin transition-opacity ${
                          isSubmitting ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span>إنشاء الحساب والمتابعة</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {apiError && (
              <div className="mt-4 rounded-xl border border-[#ffdad6] bg-[#ffdad6]/40 px-4 py-3 text-sm font-bold text-[#93000a]">
                {apiError}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
