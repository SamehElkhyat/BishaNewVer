"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaUserPlus, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { preferArabicValue } from '../../../utils/permissions';
// User data interface
interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

// User update interface
interface UserUpdate {
  fullName: string;
  email: string;
  phoneNumber: string;
}

// A single assignable permission, as shown in the "تخصيص الصلاحيات" modal
interface Permission {
  key: string;
  name: string;
}

// Pull an array of permission entries out of whatever wrapper the API used.
// Tolerant of a plain array, an array nested under a wrapper key, or a
// flags-object (e.g. { "حذف الأخبار": true, ... }) — some endpoints
// (like Get-User-Permissions) may return that shape instead of a list.
function extractPermissionArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];

  const arrayCandidates = [
    data.permissions,
    data.Permissions,
    data.data,
    data.result,
    data.items,
    data.Permission,
    data.roles,
  ];
  for (const c of arrayCandidates) {
    if (Array.isArray(c)) return c;
  }

  const flagsObject = arrayCandidates.find((c) => c && typeof c === 'object') || data;
  if (flagsObject && typeof flagsObject === 'object') {
    return Object.entries(flagsObject)
      .filter(([, v]) => v === true || v === 1 || v === '1' || v === 'true')
      .map(([k]) => k);
  }

  return [];
}

// The backend identifies permissions with plain English PascalCase codes
// (e.g. "ManageNewsPaper") — that's what Get-User-Permissions' flags-object
// keys are, and what Change-Roles' PermissionName array must contain.
// Authoritative Arabic-label → English-code mapping (confirmed against the
// backend directly), used so saving always sends the code the API expects
// even if the catalogue response doesn't expose it under a known field.
const PERMISSION_CODE_BY_ARABIC_NAME: Record<string, string> = {
  'إدارة الأخبار والإعلانات': 'ManageNewsPaper',
  'إدارة الفعاليات': 'ManageActivity',
  'إدارة التعاميم': 'ManageCircular',
  'الاطلاع على الشكاوي': 'ViewComplaints',
  'تعديل بيانات تواصل معنا': 'ManageContactUs',
  'تعديل المجلس الإداري': 'ManageBOD',
  'إدارة الجمعية العمومية': 'ManageGeneralAssembly',
  'نتائج التصويت': 'ViewVotingResults',
  'إدارة العملاء': 'ManageUsers',
  'تعديل المسؤول العام': 'ManageSecretaryGeneral',
  'سجل النشاطات': 'ViewAuditLog',
};

// Scan every string value on the object for something that already looks
// like one of these English codes, regardless of which field name holds it.
function pickEnglishCode(obj: Record<string, any>): string {
  for (const v of Object.values(obj)) {
    if (typeof v === 'string') {
      const s = v.trim();
      if (/^[A-Za-z][A-Za-z0-9]*$/.test(s) && /[A-Z]/.test(s)) return s;
    }
  }
  return '';
}

// Map one raw permission entry (string or object) into { key, name }.
// `name` prefers whichever field actually holds the Arabic label; `key` is
// always the English code Change-Roles expects.
function mapPermissionItem(p: any): Permission | null {
  if (typeof p === 'string') {
    const v = p.trim();
    return v ? { key: v, name: v } : null;
  }
  if (p && typeof p === 'object') {
    const name = preferArabicValue([
      p.name,
      p.permissionName,
      p.Name,
      p.PermissionName,
      p.nameAr,
      p.nameArabic,
      p.arabicName,
      p.displayNameAr,
      p.permissionNameAr,
      p.arName,
      p.titleAr,
      p.title,
      p.displayName,
    ]);
    const key =
      pickEnglishCode(p) ||
      PERMISSION_CODE_BY_ARABIC_NAME[name] ||
      String(p.key ?? p.permission ?? p.Permission ?? p.id ?? p.Id ?? name).trim();
    return key ? { key, name: name || key } : null;
  }
  return null;
}

// Pagination response interface
interface PaginatedResponse {
  newsPaper: User[];
  totalCount: number;
  pageNumber: number;
  totalPages: number;
}

const AdminClientsPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState('');

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<UserUpdate>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Permission modal state
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [userPermissionsLoading, setUserPermissionsLoading] = useState(false);

  // Catalogue of assignable permissions (Arabic names only), loaded once
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsError, setPermissionsError] = useState('');

  // Fetch the full permissions catalogue — every permission the API returns
  const fetchPermissions = async () => {
    setPermissionsLoading(true);
    setPermissionsError('');
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bishahcc.org/api';
      const response = await fetch(`${API_BASE_URL}/Admin/Get-All-Permissions`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const all = extractPermissionArray(data)
        .map(mapPermissionItem)
        .filter((p): p is Permission => !!p);

      setAllPermissions(all);
    } catch (error: any) {
      console.error('Failed to fetch permissions:', error);
      setPermissionsError('تعذّر تحميل قائمة الصلاحيات المتاحة.');
    } finally {
      setPermissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Selection is tracked by the permission's English code (the identifier
  // the backend's Change-Roles endpoint actually expects), not its Arabic
  // display name.
  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectAllPermissions = () => {
    setSelectedPermissions(new Set(allPermissions.map((p) => p.key)));
  };

  const clearAllPermissions = () => {
    setSelectedPermissions(new Set());
  };

  // Function to fetch users from API
  const fetchUsers = async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bishahcc.org/api';
      const url = `${API_BASE_URL}/Register/Get-Users/${page}`;
      // Get auth token
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Make the API request
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const data: PaginatedResponse = await response.json();
      setUsers(data.newsPaper);
      setFilteredUsers(data.newsPaper);
      setTotalPages(data.totalPages);
      setTotalCount(data.pageNumber);
      setCurrentPage(data.pageNumber);

    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(`فشل في جلب بيانات المستخدمين: ${error.message || 'خطأ غير معروف'}`);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      router.push('/login');
    } else if (!isAdmin()) {
      setLoading(false);
      fetchUsers(currentPage);

    } else {
      setLoading(false);
      fetchUsers(currentPage);
    }
  }, [user, isAdmin, router, currentPage]);

  // Filter users based on search term
  useEffect(() => {

    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const result = users.filter(user =>
      user.fullName.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.phoneNumber.includes(searchTerm)
    );

    setFilteredUsers(result);

  }, [searchTerm, users]);

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bishahcc.org/api';
        const url = `${API_BASE_URL}/Register/Delete/${id}`;

        // Get auth token
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Make the API request
        const response = await fetch(url, {
          method: 'DELETE',
          headers,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API error: ${response.status}`);
        }

        // Refresh the user list
        fetchUsers(currentPage);
      } catch (error) {
        console.error('Failed to delete user:', error);
        setError(`فشل في حذف المستخدم: ${error.message || 'خطأ غير معروف'}`);
      }
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchUsers(newPage);
    }
  };

  // Handle permission button click — opens the modal and loads this user's
  // current permissions so their existing checkmarks show up pre-checked.
  const handlePermissionClick = async (userId: number, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setSelectedPermissions(new Set());
    setIsPermissionModalOpen(true);
    setUserPermissionsLoading(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bishahcc.org/api';
      const response = await fetch(`${API_BASE_URL}/Register/Get-User-Permissions/${userId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const current = extractPermissionArray(data)
        .map(mapPermissionItem)
        .filter((p): p is Permission => !!p);

      // Match against the loaded catalogue by either key or name (case
      // -insensitive) — this endpoint may return English codes while the
      // catalogue displays Arabic names, or vice versa.
      const currentIdentifiers = new Set(
        current.flatMap((c) => [c.key, c.name]).map((s) => s.trim().toLowerCase())
      );
      const matched = allPermissions.filter(
        (p) =>
          currentIdentifiers.has(p.key.trim().toLowerCase()) ||
          currentIdentifiers.has(p.name.trim().toLowerCase())
      );

      // Fall back to whatever the endpoint returned directly if nothing in
      // the catalogue matched (e.g. the catalogue hasn't loaded yet).
      const keys = matched.length > 0 ? matched.map((p) => p.key) : current.map((p) => p.key);
      setSelectedPermissions(new Set(keys));
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);
      toast.error('تعذّر تحميل صلاحيات المستخدم الحالية');
    } finally {
      setUserPermissionsLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (id: number) => {
    const user = users.find(user => user.id === id);
    if (!user) return;
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
    });
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    // Validate form
    if (!editFormData.fullName.trim()) {
      toast.error('الرجاء إدخال الاسم الكامل');
      return;
    }
    
    if (!editFormData.email.trim()) {
      toast.error('الرجاء إدخال البريد الإلكتروني');
      return;
    }
    
    if (!editFormData.phoneNumber.trim()) {
      toast.error('الرجاء إدخال رقم الهاتف');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bishahcc.org/api';
      const url = `${API_BASE_URL}/Register/Update/${editingUser.id}`;
      
      // Get auth token
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Prepare request body
      const requestBody = {
        ...editFormData,
        id: editingUser.id
      };
      
      // Make the API request
      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      // Close modal and show success message
      closeEditModal();
      toast.success('تم تحديث بيانات المستخدم بنجاح');
      
      // Refresh the user list
      fetchUsers(currentPage);
      
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error(`فشل في تحديث بيانات المستخدم: ${error.message || 'خطأ غير معروف'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Close permission modal
  const closePermissionModal = () => {
    setIsPermissionModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserName('');
    setSelectedPermissions(new Set());
  };

  // Save user permissions
  const saveUserPermissions = async () => {
    if (!selectedUserId) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bishahcc.org/api';
      const url = `${API_BASE_URL}/Admin/Change-Roles`;

      // Get auth token
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Selected permissions, by their English code (e.g. "ManageNewsPaper")
      // — that's what Change-Roles expects, not the Arabic display name.
      const permissionNames: string[] = Array.from(selectedPermissions);

      // Prepare request body
      const requestBody = {
        userId: selectedUserId.toString(),
        permissionName: permissionNames
      };

      // Make the API request
      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      // Close modal and show success message
      closePermissionModal();
      toast.success('تم تحديث الصلاحيات بنجاح');

    } catch (error) {
      console.error('Failed to update permissions:', error);
      setError(`فشل في تحديث الصلاحيات: ${error.message || 'خطأ غير معروف'}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminListContainer}>
      <div className={styles.listHeader}>
        <h1><FaUsers className={styles.headerIcon} /> إدارة المستخدمين</h1>
        <Link href="/admin/clients/add" className={styles.addButton}>
          <FaPlus /> إضافة مستخدم جديد
        </Link>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="ابحث هنا..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>الرقم</th>
              <th>الاسم الكامل</th>
              <th>البريد الإلكتروني</th>
              <th>رقم الهاتف</th>
              <th>الإجراءات</th>
              <th>تخصيص الصلاحيات</th>

            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={user.isActive ? '' : styles.inactiveRow}>
                <td className='text-black'>{(currentPage - 1) * 10 + index + 1}</td>
                <td className='text-black'>{user.fullName}</td>
                <td className='text-black'>{user.email}</td>
                <td className='text-black'>{user.phoneNumber}</td>
                <td className={styles.actionsCell}>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEditClick(user.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(user.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
                <td>
                  <button
                    className={styles.permissionButton}
                    onClick={() => handlePermissionClick(user.id, user.fullName)}
                    title="تخصيص الصلاحيات"
                  >
                    <FaUserPlus />
                  </button>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronRight />
          </button>

          <div className={styles.pageInfo}>
            الصفحة {currentPage} من {totalPages} (إجمالي: {totalCount})
          </div>

          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronLeft />
          </button>
        </div>
      )}

      {/* Permission Modal */}
      {isPermissionModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.permissionModal}>
            <div className={styles.modalHeader}>
              <h2>تخصيص الصلاحيات</h2>
              <span className={styles.userName}>المستخدم: {selectedUserName}</span>
              <button
                className={styles.closeModalButton}
                onClick={closePermissionModal}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              {!permissionsLoading && !permissionsError && allPermissions.length > 0 && (
                <div className={styles.catalogueActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={selectAllPermissions}
                  >
                    تحديد الكل
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={clearAllPermissions}
                  >
                    إلغاء تحديد الكل
                  </button>
                </div>
              )}
              <div className={styles.permissionsGrid}>
                <div className={styles.permissionSection}>
                  <h3>الصلاحيات</h3>
                  {permissionsLoading || userPermissionsLoading ? (
                    <p>جاري تحميل الصلاحيات...</p>
                  ) : permissionsError ? (
                    <p className={styles.errorMessage}>{permissionsError}</p>
                  ) : allPermissions.length === 0 ? (
                    <p>لا توجد صلاحيات متاحة</p>
                  ) : (
                    allPermissions.map((p) => (
                      <div key={p.key} className={styles.permissionItem}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedPermissions.has(p.key)}
                            onChange={() => togglePermission(p.key)}
                          />
                          <span className={styles.checkboxCustom}>
                            {selectedPermissions.has(p.key) && <FaCheck />}
                          </span>
                          {p.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>

              <button
                className={styles.saveButton}
                onClick={saveUserPermissions}
                disabled={loading}
              >
                {loading ? <FaSpinner className={styles.spinner} /> : <FaCheck />} حفظ الصلاحيات
              </button>
              <button
                className={styles.cancelButton}
                onClick={closePermissionModal}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.editModal}>
            <div className={styles.modalHeader}>
              <h2>تعديل بيانات المستخدم</h2>
              <span className={styles.userName}>{editingUser?.fullName}</span>
              <button
                className={styles.closeModalButton}
                onClick={closeEditModal}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              <form onSubmit={handleUpdateUser} className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">الاسم الكامل</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleInputChange}
                    className={styles.formControl}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className={styles.formControl}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">رقم الهاتف</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleInputChange}
                    className={styles.formControl}
                    required
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <FaSpinner className={styles.spinner} /> : <FaCheck />} حفظ التغييرات
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={closeEditModal}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default AdminClientsPage;
