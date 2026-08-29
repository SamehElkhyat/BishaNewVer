"use client";

import React, { useState } from 'react';
import { FaSearch, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from '../../../styles/Committees.module.css';

// Committees data
const committeesData = [
  {
    id: 1,
    name: "اللجنة الأولى",
    members: [
      { name: "فايز محمد الجبيري", position: "الرئيس" },
      { name: "شريفة شيبان الشهراني", position: "النائب" },
      { name: "راجح محمد الجبيري", position: "عضو" },
      { name: "صالح الوتيد", position: "عضو" },
      { name: "فايز محمد السعدي", position: "عضو" },
      { name: "مشاري محمد السريعي", position: "عضو" },
      { name: "علي شوكان", position: "عضو" }
    ]
  },
  {
    id: 2,
    name: "اللجنة الثانية",
    members: [
      { name: "محمد مفلح ال جرمان", position: "الرئيس" },
      { name: "علي خالد كدسة", position: "النائب" },
      { name: "احمد عبيد ملحان", position: "عضو" },
      { name: "ذيب عبدالمانع كدم", position: "عضو" },
      { name: "عبيد مبارك القحطاني", position: "عضو" },
      { name: "سعد عبدالله القرني", position: "عضو" }
    ]
  },
  {
    id: 3,
    name: "اللجنة الثالثة",
    members: [
      { name: "فايز عبدالله اليتيم", position: "الرئيس" },
      { name: "مقعد عامر الشهراني", position: "نائب" },
      { name: "مثيب عبدالرحمن المعاوي", position: "عضو" },
      { name: "سالم مترك المعاوي", position: "عضو" },
      { name: "حنان عبدالله القرني", position: "عضو" },
      { name: "ابتسام عايض العمري", position: "عضو" },
      { name: "حنان واكد العلياني", position: "عضو" },
      { name: "مبارك محمد الشهراني", position: "عضو" },
      { name: "مشعل عايض الحارثي", position: "عضو" },
      { name: "نوره سعد الشهراني", position: "عضو" },
      { name: "عائشه محمد المنبهي", position: "عضو" },
      { name: "فاطمه محمد المنبهي", position: "عضو" },
      { name: "متعب عبدالله سعد", position: "عضو" },
      { name: "تركي عبدالله سعد", position: "عضو" },
      { name: "متعب عبدالله سعد", position: "عضو" },
      { name: "فالح علي عبدالله", position: "عضو" },
      { name: "عبد العزيز سلطان سواط", position: "عضو" },
      { name: "مها لزمع الشهراني", position: "عضو" }
    ]
  },
  {
    id: 4,
    name: "اللجنة الرابعة",
    members: [
      { name: "سعيد علي كدسة", position: "الرئيس" },
      { name: "صالح سفر الغامدي", position: "النائب" },
      { name: "راجح المسردي", position: "عضو" },
      { name: "محمد مسعد القرني", position: "عضو" },
      { name: "حسن علي الصعيري", position: "عضو" },
      { name: "فهد موسى المرحبي", position: "عضو" }
    ]
  },
  {
    id: 5,
    name: "اللجنة الخامسة",
    members: [
      { name: "عايض مسفر زعاب", position: "الرئيس" },
      { name: "عون حالان الحارثي", position: "النائب" },
      { name: "عبدالله شخص الغامدي", position: "عضو" },
      { name: "عبدالله ناصر جزوا", position: "عضو" },
      { name: "عبدالله عامر الدعرمي", position: "عضو" },
      { name: "شارع فهد الجهمي", position: "عضو" }
    ]
  },
  {
    id: 6,
    name: "اللجنة السادسة",
    members: [
      { name: "مسفر مفلح المساعد", position: "الرئيس" },
      { name: "هياء آل مرعي", position: "النائب" },
      { name: "سيف آل رويبع", position: "عضو" },
      { name: "مسعود محمد المليحي", position: "عضو" },
      { name: "محمد حسن الصعيري", position: "عضو" },
      { name: "ناصر عبدالله الشهراني", position: "عضو" }
    ]
  },
  {
    id: 7,
    name: "اللجنة السابعة",
    members: [
      { name: "سعيد عثمان ال فرحة", position: "الرئيس" },
      { name: "موضي عثمان الدعرمي", position: "النائب" },
      { name: "محمد سعد صليهم", position: "عضو" },
      { name: "شعيب عبدالله القرني", position: "عضو" },
      { name: "عبدالله الحارثي", position: "عضو" },
      { name: "هاله ظافر الشهري", position: "عضو" }
    ]
  },
  {
    id: 8,
    name: "اللجنة الثامنة",
    members: [
      { name: "عبدالرحمن ناصر مشوط", position: "الرئيس" },
      { name: "احمد علي طاوي", position: "النائب" },
      { name: "سعيد طراد فالح الأكلبي", position: "عضو" },
      { name: "عبدالله محمد نمشان", position: "عضو" },
      { name: "عبدالله عبدالرحمن ولمان", position: "عضو" },
      { name: "عبيد مبارك القحطاني", position: "عضو" }
    ]
  }
];

const CommitteesPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedCommittee, setExpandedCommittee] = useState<number | null>(null);

  // Filter committees based on search term
  const filteredCommittees = committeesData.filter(committee => {
    if (searchTerm === '') return true;
    
    // Search in committee name
    if (committee.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    
    // Search in members' names
    return committee.members.some(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Toggle expanded committee
  const toggleCommittee = (id: number) => {
    setExpandedCommittee(expandedCommittee === id ? null : id);
  };

  return (
    <div className={styles.committeesContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>اللجان القطاعية</h1>
          <p className={styles.pageDescription}>
            اللجان القطاعية في غرفة بيشة تعمل على تطوير مختلف القطاعات الاقتصادية في المحافظة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="ابحث عن لجنة أو عضو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>

        <div className={styles.committeesGrid}>
          {filteredCommittees.length > 0 ? (
            filteredCommittees.map((committee) => (
              <div 
                key={committee.id} 
                className={`${styles.committeeCard} ${expandedCommittee === committee.id ? styles.expanded : ''}`}
              >
                <div 
                  className={styles.committeeHeader} 
                  onClick={() => toggleCommittee(committee.id)}
                >
                  <div className={styles.committeeIcon}>
                    <FaUsers className={styles.usersIcon} />
                  </div>
                  
                  <h2 className={styles.committeeName}>{committee.name}</h2>
                  
                  <div className={styles.expandButton}>
                    {expandedCommittee === committee.id ? 
                      <FaChevronUp className={styles.chevronIcon} /> : 
                      <FaChevronDown className={styles.chevronIcon} />
                    }
                  </div>
                </div>
                
                {expandedCommittee === committee.id && (
                  <div className={styles.committeeContent}>
                    <div className={styles.membersTitle}>
                      <h3>الأعضاء</h3>
                    </div>
                    
                    <div className={styles.membersList}>
                      {committee.members.map((member, index) => (
                        <div key={index} className={styles.memberCard}>
                          <div className={styles.memberAvatar}>
                            {member.name.charAt(0)}
                          </div>
                          
                          <div className={styles.memberInfo}>
                            <h4 className={styles.memberName}>{member.name}</h4>
                            <span className={styles.memberPosition}>{member.position}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <h3>لا توجد نتائج مطابقة للبحث</h3>
              <p>يرجى تغيير معايير البحث والمحاولة مرة أخرى.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommitteesPage;
