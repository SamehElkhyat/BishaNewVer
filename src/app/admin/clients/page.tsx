"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaUserPlus, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
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
  passwordHash: string;
  confirmPassword: string;
}

// Permissions interface
interface UserPermissions {
  canDeleteNews: boolean;
  canAddNews: boolean;
  canEditNews: boolean;
  canRegisterAndViewComplaints: boolean;
  canViewClients: boolean;
  canChangePermissions: boolean;
  canUpdateUser: boolean;
  canDeleteUser: boolean;
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
    passwordHash: '',
    confirmPassword: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Permission modal state
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [userPermissions, setUserPermissions] = useState<UserPermissions>({
    canDeleteNews: false,
    canAddNews: false,
    canEditNews: false,
    canRegisterAndViewComplaints: false,
    canViewClients: false,
    canChangePermissions: false,
    canUpdateUser: false,
    canDeleteUser: false,
  });

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

  // Handle permission button click
  const handlePermissionClick = (userId: number, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    // Reset permissions to default
    setUserPermissions({
      canDeleteNews: false,
      canAddNews: false,
      canEditNews: false,
      canRegisterAndViewComplaints: false,
      canViewClients: false,
      canChangePermissions: false,
      canUpdateUser: false,
      canDeleteUser: false,
    });
    setIsPermissionModalOpen(true);
  };

  // Handle permission change
  const handlePermissionChange = (permission: keyof UserPermissions) => {
    setUserPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
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
      passwordHash: '',
      confirmPassword: ''
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
      passwordHash: '',
      confirmPassword: ''
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
    
    // If password is provided, check if it matches confirmation
    if (editFormData.passwordHash && editFormData.passwordHash !== editFormData.confirmPassword) {
      toast.error('كلمة المرور وتأكيدها غير متطابقين');
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

      // Convert permissions object to array of permission names
      const permissionNames: string[] = [];

      if (userPermissions.canDeleteNews) permissionNames.push('حذف الأخبار');
      if (userPermissions.canAddNews) permissionNames.push('إضافة الأخبار');
      if (userPermissions.canEditNews) permissionNames.push('تعديل الأخبار');
      if (userPermissions.canRegisterAndViewComplaints) permissionNames.push('تسجيل والاطلاع على الشكاوي');
      if (userPermissions.canViewClients) permissionNames.push('عملاء');
      if (userPermissions.canChangePermissions) permissionNames.push('تغيير صلاحيات');
      if (userPermissions.canUpdateUser) permissionNames.push('تعديل المستخدم');
      if (userPermissions.canDeleteUser) permissionNames.push('حذف المستخدم');

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
              <th>الحالة</th>
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
                <td>
                  <span className={user.isActive ? styles.activeStatus : styles.inactiveStatus}>
                    {user.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
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
              <div className={styles.permissionsGrid}>

                {/* News Permissions */}
                <div className={styles.permissionSection}>
                  <h3>صلاحيات الأخبار</h3>
                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canAddNews}
                        onChange={() => handlePermissionChange('canAddNews')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canAddNews && <FaCheck />}
                      </span>
                      إضافة الأخبار
                    </label>
                  </div>

                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canEditNews}
                        onChange={() => handlePermissionChange('canEditNews')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canEditNews && <FaCheck />}
                      </span>
                      تعديل الأخبار
                    </label>
                  </div>

                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canDeleteNews}
                        onChange={() => handlePermissionChange('canDeleteNews')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canDeleteNews && <FaCheck />}
                      </span>
                      حذف الأخبار
                    </label>
                  </div>
                </div>


                {/* Other Permissions */}
                <div className={styles.permissionSection}>
                  <h3>صلاحيات أخرى</h3>
                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canRegisterAndViewComplaints}
                        onChange={() => handlePermissionChange('canRegisterAndViewComplaints')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canRegisterAndViewComplaints && <FaCheck />}
                      </span>
                      تسجيل والاطلاع على الشكاوي
                    </label>
                  </div>

                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canViewClients}
                        onChange={() => handlePermissionChange('canViewClients')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canViewClients && <FaCheck />}
                      </span>
                      عملاء
                    </label>
                  </div>

                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canChangePermissions}
                        onChange={() => handlePermissionChange('canChangePermissions')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canChangePermissions && <FaCheck />}
                      </span>
                      تغيير صلاحيات
                    </label>
                  </div>

                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canUpdateUser}
                        onChange={() => handlePermissionChange('canUpdateUser')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canUpdateUser && <FaCheck />}
                      </span>
                      تعديل المستخدم
                    </label>
                  </div>

                  <div className={styles.permissionItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={userPermissions.canDeleteUser}
                        onChange={() => handlePermissionChange('canDeleteUser')}
                      />
                      <span className={styles.checkboxCustom}>
                        {userPermissions.canDeleteUser && <FaCheck />}
                      </span>
                      حذف المستخدم
                    </label>
                  </div>
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

                <div className={styles.formGroup}>
                  <label htmlFor="passwordHash">كلمة المرور (اتركها فارغة إذا لم ترد تغييرها)</label>
                  <input
                    type="password"
                    id="passwordHash"
                    name="passwordHash"
                    value={editFormData.passwordHash}
                    onChange={handleInputChange}
                    className={styles.formControl}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={editFormData.confirmPassword}
                    onChange={handleInputChange}
                    className={styles.formControl}
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
