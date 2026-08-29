"use client";
import React, { useEffect, useState } from "react";
import AdminRoute from "../../../components/AdminRoute";
import styles from "../../../styles/AdminList.module.css";
import {
  FaUserShield,
  FaCheck,
  FaTimes,
  FaSearch,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { permissionsAPI } from "../../../services/api";
import { normalizePermissions } from "../../../utils/permissions";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend.bishahcc.org/api";

export default function AdminPermissionsPage() {
  const [allPermissions, setAllPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Edit modal
  const [modalUser, setModalUser] = useState(null); // { id, name }
  const [selected, setSelected] = useState(() => new Set()); // permission names
  const [saving, setSaving] = useState(false);

  const loadPermissions = async () => {
    try {
      const res = await permissionsAPI.getAll();
      setAllPermissions(normalizePermissions(res));
    } catch (err) {
      console.error("Failed to load permissions catalogue:", err);
      setError("تعذّر تحميل قائمة الصلاحيات المتاحة.");
    }
  };

  const loadUsers = async (p) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/Register/Get-Users/${p}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const list = data?.newsPaper || data?.users || data?.data || [];
      setUsers(Array.isArray(list) ? list : []);
      setTotalPages(data?.totalPages || 1);
      setPage(data?.pageNumber || p);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("تعذّر تحميل قائمة المستخدمين.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
    loadUsers(1);
  }, []);

  const openModal = (u) => {
    setModalUser({
      id: u.id ?? u.userId ?? u.Id,
      name: u.fullName ?? u.name ?? u.email ?? "مستخدم",
    });
    const existing = normalizePermissions(
      u.permissions ?? u.Permission ?? u.roles ?? []
    );
    setSelected(new Set(existing.map((p) => p.name)));
    if (typeof document !== "undefined") document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalUser(null);
    setSelected(new Set());
    if (typeof document !== "undefined") document.body.style.overflow = "unset";
  };

  const toggle = (name) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectAll = () =>
    setSelected(new Set(allPermissions.map((p) => p.name)));
  const clearAll = () => setSelected(new Set());

  const save = async () => {
    if (!modalUser) return;
    setSaving(true);
    try {
      await permissionsAPI.changeUserRoles(modalUser.id, Array.from(selected));
      toast.success("تم تحديث صلاحيات المستخدم بنجاح");
      closeModal();
    } catch (err) {
      toast.error(`فشل تحديث الصلاحيات: ${err?.message || "خطأ غير معروف"}`);
    } finally {
      setSaving(false);
    }
  };

  const shownUsers = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [u.fullName, u.name, u.email, u.phoneNumber]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q));
  });

  return (
    <AdminRoute>
      <Toaster position="top-center" />
      <div className={styles.adminListContainer}>
        <div className={styles.listHeader}>
          <h1>
            <FaUserShield /> إدارة صلاحيات المستخدمين
          </h1>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="بحث عن مستخدم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Full catalogue of assignable permissions */}
        <div className={styles.catalogueBlock}>
          <p className={styles.catalogueTitle}>
            الصلاحيات المتاحة ({allPermissions.length})
          </p>
          <div className={styles.catalogueChips}>
            {allPermissions.length === 0 ? (
              <span className={styles.catalogueEmpty}>
                لا توجد صلاحيات متاحة أو تعذّر تحميلها.
              </span>
            ) : (
              allPermissions.map((p) => (
                <span key={p.key} className={styles.catalogueChip}>
                  {p.name}
                </span>
              ))
            )}
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p>جاري التحميل...</p>
          </div>
        ) : shownUsers.length === 0 ? (
          <div className={styles.noResults}>لا يوجد مستخدمون</div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>البريد الإلكتروني</th>
                    <th>رقم الجوال</th>
                    <th>الصلاحيات</th>
                  </tr>
                </thead>
                <tbody>
                  {shownUsers.map((u) => (
                    <tr key={u.id ?? u.email}>
                      <td>{u.fullName ?? u.name ?? "-"}</td>
                      <td>{u.email ?? "-"}</td>
                      <td>{u.phoneNumber ?? "-"}</td>
                      <td>
                        <button
                          className={styles.permissionButton}
                          onClick={() => openModal(u)}
                          title="تعديل الصلاحيات"
                          aria-label="تعديل الصلاحيات"
                        >
                          <FaUserShield />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.paginationButton}
                  disabled={page <= 1}
                  onClick={() => loadUsers(page - 1)}
                  aria-label="السابق"
                >
                  <FaChevronRight />
                </button>
                <span className={styles.pageInfo}>
                  صفحة {page} من {totalPages}
                </span>
                <button
                  className={styles.paginationButton}
                  disabled={page >= totalPages}
                  onClick={() => loadUsers(page + 1)}
                  aria-label="التالي"
                >
                  <FaChevronLeft />
                </button>
              </div>
            )}
          </>
        )}

        {modalUser && (
          <div className={styles.modalOverlay}>
            <div className={styles.permissionModal}>
              <div className={styles.modalHeader}>
                <h2>صلاحيات: {modalUser.name}</h2>
                <button
                  className={styles.closeModalButton}
                  onClick={closeModal}
                  aria-label="إغلاق"
                >
                  <FaTimes />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.catalogueActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={selectAll}
                  >
                    تحديد الكل
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={clearAll}
                  >
                    إلغاء تحديد الكل
                  </button>
                </div>

                {allPermissions.length === 0 ? (
                  <p className={styles.noResults}>لا توجد صلاحيات متاحة</p>
                ) : (
                  <div className={styles.permissionsGrid}>
                    <div className={styles.permissionSection}>
                      <h3>الصلاحيات</h3>
                      {allPermissions.map((p) => (
                        <div key={p.key} className={styles.permissionItem}>
                          <label>
                            <input
                              type="checkbox"
                              checked={selected.has(p.name)}
                              onChange={() => toggle(p.name)}
                            />
                            <span className={styles.checkboxCustom}>
                              {selected.has(p.name) && <FaCheck />}
                            </span>
                            {p.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.saveButton}
                  onClick={save}
                  disabled={saving}
                >
                  {saving ? (
                    "جاري الحفظ..."
                  ) : (
                    <>
                      <FaCheck /> حفظ الصلاحيات
                    </>
                  )}
                </button>
                <button className={styles.cancelButton} onClick={closeModal}>
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
