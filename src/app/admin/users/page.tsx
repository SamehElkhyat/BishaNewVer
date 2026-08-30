"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import { FaUser, FaPlus, FaEdit, FaTrash, FaSearch, FaUserCog } from 'react-icons/fa';
import Link from 'next/link';
import { usersAPI } from '../../../services/api';

const UsersPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
  }, [user, isAdmin, router]);

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

      const data = await response.json();
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

  // Filter users based on search term
  useEffect(() => {
    const filteredUsers = users.filter(user =>
      user.fullName.includes(searchTerm) ||
      user.email.includes(searchTerm) ||
      user.phoneNumber.includes(searchTerm)
    );
    setFilteredUsers(filteredUsers);
  }, [searchTerm, users]);

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذا المستخدم؟')) return;
    try {
      setError('');
      await usersAPI.delete(id);
      // After successful deletion, update the users list
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('حدث خطأ أثناء حذف المستخدم');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || '');
    setShowRoleModal(true);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
    setSelectedRole('');
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      setError('');
      await usersAPI.changeRole(selectedUser.id, selectedRole);

      // Update the user in the local state
      setUsers(users.map(u =>
        u.id === selectedUser.id ? { ...u, role: selectedRole } : u
      ));

      closeRoleModal();
    } catch (err) {
      console.error('Error changing user role:', err);
      setError('حدث خطأ أثناء تغيير صلاحيات المستخدم');
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
        <h1><FaUser className={styles.headerIcon} /> إدارة المستخدمين</h1>
        <Link href="/admin/users/add" className={styles.addButton}>
          <FaPlus /> إضافة مستخدم جديد
        </Link>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchInputContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="بحث عن مستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {filteredUsers.length === 0 ? (
        <div className={styles.noResults}>لا توجد نتائج</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>رقم الهاتف</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={!user.isActive ? styles.inactiveRow : ''}>
                  <td className='text-black'>{user.fullName}</td>
                  <td className='text-black'>{user.email}</td>
                  <td className='text-black'>{user.phoneNumber}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.roleButton}
                        onClick={() => openRoleModal(user)}
                        title="تغيير الصلاحيات"
                      >
                        <FaUserCog />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(user.id)}
                        title="حذف"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>تغيير صلاحيات المستخدم</h2>
            <p>المستخدم: {selectedUser?.fullName}</p>

            <div className={styles.formGroup}>
              <label htmlFor="role">الصلاحية:</label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={styles.selectInput}
              >
                <option value="">اختر الصلاحية</option>
                <option value="User">مستخدم عادي</option>
                <option value="Admin">مدير النظام</option>
                <option value="Editor">محرر</option>
              </select>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.primaryButton}
                onClick={handleRoleChange}
                disabled={!selectedRole}
              >
                حفظ التغييرات
              </button>
              <button
                className={styles.secondaryButton}
                onClick={closeRoleModal}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
