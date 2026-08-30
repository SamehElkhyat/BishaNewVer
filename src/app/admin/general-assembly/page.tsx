'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import AdminRoute from '../../../components/AdminRoute';
import PaginationComponent from '../../../components/PaginationComponent';
import { FaUpload, FaTrash } from 'react-icons/fa'; // أضفنا أيقونة الحذف
import toast, { Toaster } from 'react-hot-toast';

type AnyRow = Record<string, unknown>;

function formatHeaderLabel(key: string) {
  const map: Record<string, string> = {
    establishmentName: 'اسم المنشأة',
    establishment: 'اسم المنشأة',
    name: 'اسم المصوّت',
    voterName: 'اسم المصوّت',
    fullName: 'اسم المصوّت',
    commercialRegister: 'رقم السجل التجاري',
    commercialRegistration: 'رقم السجل التجاري',
    mobileNumber: 'رقم الجوال',
    phoneNumber: 'رقم الجوال',
    mobile: 'رقم الجوال',
    attendance: 'المشاركة',
    attendanceStatus: 'المشاركة',
    status: 'المشاركة',
  };

  if (map[key]) return map[key];

  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
  return spaced || key;
}

function renderCellValue(value: unknown) {
  if (value === null || value === undefined) return '';

  const text = typeof value === 'string' ? value : typeof value === 'number' ? String(value) : '';
  const normalized = text.trim();

  if (normalized === 'حاضر') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-200">
        حاضر
      </span>
    );
  }

  if (normalized === 'معتذر') {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 ring-1 ring-amber-200">
        معتذر
      </span>
    );
  }

  if (typeof value === 'object') {
    return <span className="font-semibold text-slate-700">{JSON.stringify(value)}</span>;
  }

  const str = String(value);
  return (
    <span className="font-semibold text-slate-800" title={str}>
      {str}
    </span>
  );
}

function normalizeRows(payload: any): AnyRow[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.generalAssembly)) return payload.generalAssembly;
  if (Array.isArray(payload?.files)) return payload.files;
  return [];
}

export default function AdminGeneralAssemblyPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // استخراج الأعمدة مع استبعاد الـ id من العرض المباشر لأنه سيظهر في العمليات
  const columns = useMemo(() => {
    const keySet = new Set<string>();
    rows.slice(0, 25).forEach((r) => {
      Object.keys(r || {}).forEach((k) => {
        if (k.toLowerCase() !== 'id') keySet.add(k);
      });
    });
    return Array.from(keySet);
  }, [rows]);

  const fetchPage = useCallback(async (nextPage: number) => {
    setLoading(true);
    setError('');
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bishahcc.org/api';
      const res = await fetch(`${API_BASE_URL}/GeneralAssembly/Get?Page=${encodeURIComponent(String(nextPage))}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          ...(localStorage.getItem('auth_token')
            ? { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
            : {}),
        },
        cache: 'no-store',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'فشل تحميل البيانات');

      const normalized = normalizeRows(data);

      const rawTotalPages = Number(data?.totalPages ?? data?.TotalPages ?? 0);
      const rawTotalCount = Number(data?.totalCount ?? data?.TotalCount ?? data?.total ?? 0);
      const rawPageSize = Number(data?.pageSize ?? data?.PageSize ?? 10);

      const computedTotalPages = rawTotalCount > 0 ? Math.ceil(rawTotalCount / rawPageSize) : 1;
      const nextTotalPages = (rawTotalPages || computedTotalPages || 1);

      const nextPageNumber = Number(data?.pageNumber ?? data?.PageNumber ?? nextPage) || nextPage;

      setRows(normalized);
      setTotalPages(nextTotalPages);
      setPage(nextPageNumber);
    } catch (e) {
      setRows([]);
      setTotalPages(1);
      setError(e instanceof Error ? e.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!isAdmin()) {
      router.push('/');
      return;
    }
    fetchPage(1);
  }, [user, isAdmin, router, fetchPage]);

  // دالة الحذف الجديدة
  async function handleDelete(id: any) {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا المشارك نهائياً؟')) return;

    try {
      const res = await fetch(`https://backend.bishahcc.org/api/GeneralAssembly/Delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(localStorage.getItem('auth_token')
            ? { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
            : {}),
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'فشل حذف المشارك');
      }

      toast.success('تم حذف المشارك بنجاح');
      // إذا كانت الصفحة تحتوي على عنصر واحد وتم حذفه، نعود للصفحة السابقة
      if (rows.length === 1 && page > 1) {
        fetchPage(page - 1);
      } else {
        fetchPage(page);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'حدث خطأ أثناء الحذف');
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      toast.error('يرجى اختيار ملف أولاً');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('File', selectedFile);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bishahcc.org/api';
      const res = await fetch(`${API_BASE_URL}/GeneralAssembly/UploadFile`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(localStorage.getItem('auth_token')
            ? { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
            : {}),
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'فشل رفع الملف');

      toast.success('تم رفع الملف بنجاح');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      await fetchPage(1); // العودة للصفحة الأولى لرؤية البيانات الجديدة
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'حدث خطأ غير متوقع');
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminRoute>
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5">
              <h1 className="text-xl font-extrabold text-slate-900">إدارة الجمعية العمومية</h1>
              <p className="text-sm font-medium text-slate-600">
                عرض بيانات المشاركين، رفع الملفات، وحذف السجلات.
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-extrabold text-slate-900">رفع ملف جديد للتصويت</div>
                    <div className="mt-1 text-sm font-medium text-slate-600">سيظهر الملف للمستخدمين في صفحة التصويت.</div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    <FaUpload />
                    {uploading ? 'جاري رفع الملف...' : 'رفع الملف الآن'}
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-800">اختر ملف</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-sm font-bold text-slate-800">الملف المختار</div>
                    <div className="mt-1 truncate text-sm font-semibold text-slate-700">
                      {selectedFile ? selectedFile.name : 'لم يتم اختيار ملف بعد'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 ring-1 ring-red-100">{error}</div>}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <div className="text-base font-extrabold text-slate-900">قائمة المشاركين</div>
                <div className="mt-1 text-sm font-medium text-slate-600">يمكنك تصفح البيانات وحذفها عند الحاجة.</div>
              </div>
            </div>

            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>جاري التحميل...</p>
              </div>
            ) : rows.length === 0 ? (
              <div className={styles.noResults}>لا توجد بيانات</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-right">
                  <thead>
                    <tr className="sticky top-0 z-10 bg-white/90 text-sm font-extrabold text-slate-800 backdrop-blur">
                      <th className="whitespace-nowrap px-6 py-4 text-center">#</th>
                      {columns.map((c) => (
                        <th key={c} className="whitespace-nowrap px-6 py-4">
                          {formatHeaderLabel(c)}
                        </th>
                      ))}
                      <th className="whitespace-nowrap px-6 py-4 text-center">العمليات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => (
                      <tr
                        key={String((r as any)?.id ?? idx)}
                        className="border-t border-slate-200 text-sm text-slate-800 transition-colors odd:bg-white even:bg-slate-50/60 hover:bg-slate-100/60"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-center tabular-nums text-slate-700">
                          {(page - 1) * 10 + (idx + 1)}
                        </td>
                        {columns.map((c) => (
                          <td key={`${idx}-${c}`} className="max-w-[420px] truncate px-6 py-4">
                            {typeof r?.[c] === 'string' && String(r?.[c] ?? '').startsWith('http') ? (
                              <a
                                href={String(r?.[c])}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-700"
                              >
                                فتح الرابط
                              </a>
                            ) : (
                              renderCellValue(r?.[c])
                            )}
                          </td>
                        ))}
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete((r as any)?.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-extrabold text-red-600 ring-1 ring-red-200 transition-all hover:bg-red-600 hover:text-white"
                          >
                            <FaTrash className="text-[10px]" />
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-slate-200 px-6 py-5">
              <div className="mb-3 text-center text-sm font-bold text-slate-700">الصفحة {page} من {totalPages}</div>
              <PaginationComponent
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p: number) => {
                  if (loading) return;
                  fetchPage(p);
                }}
                showPageInfo={false}
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </AdminRoute>
  );
}