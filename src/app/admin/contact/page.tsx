"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/AdminList.module.css';
import { FaEnvelope, FaUser, FaPhone, FaCalendarAlt, FaEye, FaReply, FaSearch, FaComments } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import PaginationComponent from '../../../components/PaginationComponent';

// Contact data interface
interface Contact {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
  reply?: string;
}

// Pagination response interface
interface PaginatedContactResponse {
  contacts: Contact[];
  totalCount: number;
  pageNumber: number;
  totalPages: number;
}

const AdminContactPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState('');
  
  // Modal states
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Function to fetch contacts from API
  const fetchContacts = async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bishahcc.org/api';
      const url = `${API_BASE_URL}/Contact/GetAll/${page}`;
      
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

      const data: PaginatedContactResponse = await response.json();
      
      setContacts(data.contacts || []);
      setFilteredContacts(data.contacts || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      setCurrentPage(data.pageNumber || 1);

    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      setError(`فشل في جلب بيانات الرسائل: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      setContacts([]);
      setFilteredContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      router.push('/login');
    } else if (!isAdmin()) {
      router.push('/');
    } else {
      fetchContacts(currentPage);
    }
  }, [user, isAdmin, router, currentPage]);

  // Filter contacts based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const result = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTermLower) ||
      contact.email.toLowerCase().includes(searchTermLower) ||
      contact.serviceType.toLowerCase().includes(searchTermLower) ||
      contact.phoneNumber.includes(searchTerm)
    );

    setFilteredContacts(result);
  }, [searchTerm, contacts]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchContacts(newPage);
    }
  };

  // Open contact details modal
  const openContactModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewModalOpen(true);
  };

  // Close contact modal
  const closeContactModal = () => {
    setIsViewModalOpen(false);
    setSelectedContact(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <h1><FaComments className={styles.headerIcon} /> إدارة الرسائل والشكاوي</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
   
      
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="ابحث في الرسائل..."
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
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>رقم الهاتف</th>
              <th>نوع الخدمة</th>
              <th>تاريخ الإرسال</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact, index) => (
                <tr key={contact.id} className={!contact.isRead ? styles.unreadRow : ''}>
                  <td className='text-black'>{(currentPage - 1) * 10 + index + 1}</td>
                  <td className='text-black'>{contact.name}</td>
                  <td className='text-black'>{contact.email}</td>
                  <td className='text-black'>{contact.phoneNumber}</td>
                  <td className='text-black' title={contact.serviceType}>
                    {contact.serviceType.length > 30 ? `${contact.serviceType.substring(0, 30)}...` : contact.serviceType}
                  </td>
                  <td className='text-black'>{contact.createdAt ? formatDate(contact.createdAt) : 'غير محدد'}</td>
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.viewButton}
                      onClick={() => openContactModal(contact)}
                      title="عرض التفاصيل"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.noResults}>
                  لا توجد رسائل
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Contact Details Modal */}
      {isViewModalOpen && selectedContact && (
        <div className={styles.modalOverlay}>
          <div className={styles.contactModal}>
            <div className={styles.modalHeader}>
              <h2>تفاصيل الرسالة</h2>
              <button 
                className={styles.closeModalButton}
                onClick={closeContactModal}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.contactDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.label}><FaUser /> الاسم:</span>
                  <span className={styles.value}>{selectedContact.name}</span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.label}><FaEnvelope /> البريد الإلكتروني:</span>
                  <span className={styles.value}>{selectedContact.email}</span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.label}><FaPhone /> رقم الهاتف:</span>
                  <span className={styles.value}>{selectedContact.phoneNumber}</span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.label}><FaCalendarAlt /> تاريخ الإرسال:</span>
                  <span className={styles.value}>{selectedContact.createdAt ? formatDate(selectedContact.createdAt) : 'غير محدد'}</span>
                </div>
                
                <div className={styles.detailRow}>
                  <span className={styles.label}>نوع الخدمة:</span>
                  <span className={styles.value}>{selectedContact.serviceType}</span>
                </div>
                
                <div className={styles.messageSection}>
                  <h3>نص الرسالة:</h3>
                  <div className={styles.messageContent}>
                    {selectedContact.message}
                  </div>
                </div>
                
                {selectedContact.reply && (
                  <div className={styles.replySection}>
                    <h3><FaReply /> الرد:</h3>
                    <div className={styles.replyContent}>
                      {selectedContact.reply}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelButton}
                onClick={closeContactModal}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default AdminContactPage;
