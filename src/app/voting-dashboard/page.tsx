"use client";

import { Download, Loader2, LockKeyhole, Vote } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { log } from "console";

type VoteChoice = "approve" | "reserve" | "reject" | null;

type StatsRow = {
  id: string;
  title: string;
  totalUsers: number;
  approve: number;
  reserve: number;
  reject: number;
};

type VoteItem = {
  id: string;
  title: string;
  downloadHref?: string;
  fileUrl?: string;
  fileName?: string;
};

type AuthMode = "none" | "registered" | "otp";

// Font configuration with fallback
const tajawal = {
  className: 'font-sans', // Fallback font class
};

// Only load the font in the browser to avoid build-time issues
if (typeof window !== 'undefined') {
  try {
    const { Tajawal } = require('next/font/google');
    const font = Tajawal({
      weight: ['300', '400', '500', '700'],
      subsets: ['arabic'],
      display: 'swap',
      variable: '--font-tajawal',
      preload: true,
      fallback: ['system-ui', 'sans-serif']
    });
    Object.assign(tajawal, font);
  } catch (error) {
    console.error('Failed to load Tajawal font:', error);
  }
}

function clampPercent(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function readAuthMode(): AuthMode {
  if (typeof window === "undefined") return "none";
  const authed = window.localStorage.getItem("ga_authed") === "1";
  if (!authed) return "none";
  const mode = window.localStorage.getItem("ga_auth_mode");
  if (mode === "otp" || mode === "registered") return mode;
  return "otp";
}

function readUserId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("ga_userId");
}

function ProgressCell({
  count,
  total,
  colorClassName,
}: {
  count: number;
  total: number;
  colorClassName: string;
}) {
  const percent = clampPercent((count / total) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center text-center text-slate-700">
        <div className=" text-sm font-semibold text-slate-500 tabular-nums">
          {count.toLocaleString("en-US")}/{total.toLocaleString("en-US")}
        </div>
        {/* <span className="text-lg font-extrabold tabular-nums">
          {count.toLocaleString("en-US")}
        </span>
        <span className="text-base font-semibold text-slate-500 tabular-nums">
          {total.toLocaleString("en-US")}
        </span> */}
      </div>

      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${colorClassName}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function VoteButton({
  label,
  variant,
  isActive,
  onClick,
}: {
  label: string;
  variant: "approve" | "reserve" | "reject";
  isActive: boolean;
  onClick: () => void;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2";

  const variants: Record<typeof variant, string> = {
    approve: "bg-[#22c55e] text-white hover:bg-[#16a34a]",
    reserve: "bg-[#eab308] text-white hover:bg-[#ca8a04]",
    reject: "bg-red-600 text-white hover:bg-red-700",
  };

  const active = isActive ? "ring-2 ring-teal-500 ring-offset-2" : "";

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${active}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function VotingDashboardPage() {
  const [votes, setVotes] = useState<Record<string, VoteChoice>>({});
  const [authMode, setAuthMode] = useState<AuthMode>("none");
  const [rowLoading, setRowLoading] = useState<Record<string, boolean>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [rowSuccess, setRowSuccess] = useState<Record<string, string>>({});
  const [statsRows, setStatsRows] = useState<StatsRow[]>([]);
  const [voteItems, setVoteItems] = useState<VoteItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const handleDownload = (fileUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName || "file";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    setAuthMode(readAuthMode());
    async function fetchData() {
      try {
        console.log(process.env.NEXT_PUBLIC_API_URL);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/GeneralAssembly/GetFiles`,
          { cache: "no-store" }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "فشل تحميل البيانات");

        const stats: StatsRow[] = (data || []).map((v: any) => ({
          id: String(v.fileId),
          title: v.fileName || "",
          totalUsers: v.totalUsers || 0,
          approve: parseInt((v.approve || "").split("/")[0], 10) || 0,
          reserve: parseInt((v.save || "").split("/")[0], 10) || 0,
          reject: parseInt((v.reject || "").split("/")[0], 10) || 0,
        }));

        const items: VoteItem[] = (data || []).map((v: any) => ({
          id: String(v.fileId),
          title: v.fileName || "",
          downloadHref: v.fileUrl || "",
          fileUrl: v.fileUrl || "",
          fileName: v.fileName || "",
        }));

        setStatsRows(stats);
        setVoteItems(items);
      } catch (e) {
        setDataError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
  }, []);

  async function submitAction(
  itemId: string,
  action: "save" | "reject" | "approve" | "download"
) {
  setRowLoading((p) => ({ ...p, [itemId]: true }));
  setRowError((p) => ({ ...p, [itemId]: "" }));
  setRowSuccess((p) => ({ ...p, [itemId]: "" }));

  try {
    const userId = readUserId();
    if (!userId) {
      throw new Error("المستخدم غير مسجل");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/GeneralAssembly/Action`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Number(userId),
          action: action,
          generalAssemblyFileId: Number(itemId),
        }),
      }
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || "تعذر تنفيذ العملية");
    }

    setRowSuccess((p) => ({ ...p, [itemId]: "تم التصويت بنجاح" }));
  } catch (e) {
    toast.error(
      e instanceof Error ? e.message : "حدث خطأ غير متوقع"
    );
    setRowError((p) => ({
      ...p,
      [itemId]: e instanceof Error ? e.message : "حدث خطأ غير متوقع",
    }));
  } finally {
    setRowLoading((p) => ({ ...p, [itemId]: false }));
  }
}

  if (isLoadingData) {
    return (
      <main
        dir="rtl"
        className={`${tajawal.className} min-h-screen bg-slate-50 py-10`}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-lg font-medium text-slate-600">
              جاري تحميل البيانات...
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (dataError) {
    return (
      <main
        dir="rtl"
        className={`${tajawal.className} min-h-screen bg-slate-50 py-10`}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-lg font-medium text-red-600">{dataError}</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className={`${tajawal.className} min-h-screen bg-slate-50 py-10`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-teal-500 px-4 py-2 text-sm font-bold text-white">
                إحصائيات أصوات الاجتماع : إجتماع الجمعية العمومية 2025
              </span>
            </div>
            <p className="text-sm text-slate-600">
              عرض ملخص للأصوات حسب كل مرفق، مع شريط تقدّم يوضح عدد الأصوات من
              إجمالي المشاركين.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-right">
              <thead>
                <tr className="bg-slate-50 text-sm font-bold text-slate-700">
                  <th className="px-6 py-4">اسم المرفق</th>
                  <th className="px-6 py-4 text-[#16a34a]">موافق</th>
                  <th className="px-6 py-4 text-[#ca8a04]">تحفظ</th>
                  <th className="px-6 py-4 text-red-600">رفض</th>
                </tr>
              </thead>
              <tbody>
                {statsRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-200 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-5 text-base font-bold text-slate-900">
                      {row.title}
                    </td>
                    <td className="px-6 py-5 align-top">
                      <ProgressCell
                        count={row.approve}
                        total={row.totalUsers}
                        colorClassName="bg-[#22c55e]"
                      />
                    </td>
                    <td className="px-6 py-5 align-top">
                      <ProgressCell
                        count={row.reserve}
                        total={row.totalUsers}
                        colorClassName="bg-[#eab308]"
                      />
                    </td>
                    <td className="px-6 py-5 align-top">
                      <ProgressCell
                        count={row.reject}
                        total={row.totalUsers}
                        colorClassName="bg-red-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {authMode === "none" && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative px-6 py-6">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-slate-900/5 via-white to-white" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                    <LockKeyhole className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">
                      يلزم تسجيل الدخول
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      للوصول إلى التصويت، يرجى تسجيل الدخول أو إنشاء حساب عبر
                      بوابة التصويت.
                    </div>
                  </div>
                </div>

                <a
                  href="/voting-auth"
                  className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  تسجيل الدخول / إنشاء حساب
                </a>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative overflow-hidden border-b border-slate-200 px-6 py-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-teal-600/10 via-white to-white" />
            <div className="relative flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                    <Vote className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      التصويت
                    </h2>
                    <p className="text-sm text-slate-600">
                      اختر خيار التصويت لكل مرفق، أو قم بتنزيل الملف.
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">
                  لوحة التصويت
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-right">
              <thead>
                <tr className="bg-slate-50 text-sm font-bold text-slate-700">
                  <th className="px-6 py-4">عنوان المرفق</th>
                  <th className="px-6 py-4">التصويت</th>
                </tr>
              </thead>
              <tbody>
                {voteItems.map((item) => {
                  const current = votes[item.id] ?? null;
                  const votingDisabled = authMode === "none";
                  const isBusy = !!rowLoading[item.id];
                  console.log("item:", item);

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-slate-200 transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 text-base font-bold text-slate-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <div
                            className={
                              votingDisabled || isBusy
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <VoteButton
                                label="موافق"
                                variant="approve"
                                isActive={current === "approve"}
                                onClick={async () => {
                                  setVotes((prev) => ({
                                    ...prev,
                                    [item.id]: "approve",
                                  }));
                                  await submitAction(item.id, "approve");
                                }}
                              />
                              <VoteButton
                                label="تحفظ"
                                variant="reserve"
                                isActive={current === "reserve"}
                                onClick={async () => {
                                  setVotes((prev) => ({
                                    ...prev,
                                    [item.id]: "reserve",
                                  }));
                                  await submitAction(item.id, "save");
                                }}
                              />
                              <VoteButton
                                label="رفض"
                                variant="reject"
                                isActive={current === "reject"}
                                onClick={async () => {
                                  setVotes((prev) => ({
                                    ...prev,
                                    [item.id]: "reject",
                                  }));
                                  await submitAction(item.id, "reject");
                                }}
                              />
                            </div>
                          </div>

                          <button
                            onClick={async (e) => {
                              if (votingDisabled) {
                                e.preventDefault();
                                return;
                              }
                              console.log(item.id);

                              // Call download API with file ID
                              try {
                                const res = await fetch(
                                  `${process.env.NEXT_PUBLIC_API_URL}/GeneralAssembly/DownloadFile/${item.id}`,
                                  { cache: "no-store" }
                                );

                                if (!res.ok) {
                                  throw new Error("فشل تحميل الملف");
                                }

                                // Get the blob and create download link
                                const blob = await res.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = item.fileName || "document";
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                              } catch (error) {
                                toast.error(
                                  error instanceof Error
                                    ? error.message
                                    : "حدث خطأ أثناء التحميل"
                                );
                              }
                            }}
                            className={`inline-flex items-center justify-center gap-2 rounded-lg border border-teal-500 px-3 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                              votingDisabled
                                ? "pointer-events-none opacity-50"
                                : ""
                            }`}
                          >
                            <Download className="h-4 w-4" />
                            تنزيل
                          </button>

                          {votingDisabled && (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
                              أكمل التسجيل أولاً للتصويت
                            </span>
                          )}

                          {!votingDisabled && rowError[item.id] && (
                            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
                              {rowError[item.id]}
                            </span>
                          )}
                          {!votingDisabled &&
                            !rowError[item.id] &&
                            rowSuccess[item.id] && (
                              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
                                {rowSuccess[item.id]}
                              </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-bold text-slate-900">
                ملخص اختياراتك
              </div>
              <div className="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                {voteItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg bg-white px-3 py-2 shadow-sm"
                  >
                    <div className="font-semibold text-slate-900">
                      {item.title}
                    </div>
                    <div className="mt-1 text-slate-600">
                      {votes[item.id] === "approve" && "موافق"}
                      {votes[item.id] === "reserve" && "تحفظ"}
                      {votes[item.id] === "reject" && "رفض"}
                      {!votes[item.id] && "لم يتم الاختيار بعد"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Toaster />
    </main>
  );
}
