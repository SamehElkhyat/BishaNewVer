"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
} from "react-icons/fa";
import styles from "../../../styles/GeneralAssembly.module.css";

// General Assembly meetings data
const assemblyMeetings = [
  {
    id: 1,
    year: 2023,
    title: "غرفة بيشة تعقد جمعيتها العمومية",
    image: "/assembly-placeholder.jpg",
    date: "15 مارس 2023",
    description:
      "عقدت غرفة بيشة اجتماع الجمعية العمومية السنوي برئاسة سعادة رئيس مجلس الإدارة، وبحضور أعضاء مجلس الإدارة والمشتركين، حيث تم خلال الاجتماع مناقشة جدول الأعمال واستعراض التقرير السنوي وإقرار الميزانية للعام المالي القادم.",
  },
  {
    id: 2,
    year: 2022,
    title: "غرفة بيشة تعقد جمعيتها العمومية",
    image: "/assembly-placeholder.jpg",
    date: "20 مارس 2022",
    description:
      "عقدت غرفة بيشة اجتماع الجمعية العمومية السنوي برئاسة سعادة رئيس مجلس الإدارة، وبحضور أعضاء مجلس الإدارة والمشتركين، حيث تم خلال الاجتماع مناقشة جدول الأعمال واستعراض التقرير السنوي وإقرار الميزانية للعام المالي القادم.",
  },
  {
    id: 3,
    year: 2021,
    title: "غرفة بيشة تعقد جمعيتها العمومية",
    image: "/assembly-placeholder.jpg",
    date: "18 مارس 2021",
    description:
      "عقدت غرفة بيشة اجتماع الجمعية العمومية السنوي برئاسة سعادة رئيس مجلس الإدارة، وبحضور أعضاء مجلس الإدارة والمشتركين، حيث تم خلال الاجتماع مناقشة جدول الأعمال واستعراض التقرير السنوي وإقرار الميزانية للعام المالي القادم.",
  },
  {
    id: 4,
    year: 2020,
    title: "انعقاد الجمعية العمومية لغرفة بيشة 2020",
    image: "/assembly-placeholder.jpg",
    date: "22 مارس 2020",
    description:
      "عقدت غرفة بيشة اجتماع الجمعية العمومية السنوي برئاسة سعادة رئيس مجلس الإدارة، وبحضور أعضاء مجلس الإدارة والمشتركين، حيث تم خلال الاجتماع مناقشة جدول الأعمال واستعراض التقرير السنوي وإقرار الميزانية للعام المالي القادم.",
  },
  {
    id: 5,
    year: 2019,
    title: "انعقاد الجمعية العمومية لغرفة بيشة",
    image: "/assembly-placeholder.jpg",
    date: "25 مارس 2019",
    description:
      "عقدت غرفة بيشة اجتماع الجمعية العمومية السنوي برئاسة سعادة رئيس مجلس الإدارة، وبحضور أعضاء مجلس الإدارة والمشتركين، حيث تم خلال الاجتماع مناقشة جدول الأعمال واستعراض التقرير السنوي وإقرار الميزانية للعام المالي القادم.",
  },
  {
    id: 6,
    year: 2018,
    title: "غرفة بيشة تعقد جمعيتها العمومية",
    image: "/assembly-placeholder.jpg",
    date: "19 مارس 2018",
    description:
      "عقدت غرفة بيشة اجتماع الجمعية العمومية السنوي برئاسة سعادة رئيس مجلس الإدارة، وبحضور أعضاء مجلس الإدارة والمشتركين، حيث تم خلال الاجتماع مناقشة جدول الأعمال واستعراض التقرير السنوي وإقرار الميزانية للعام المالي القادم.",
  },
  {
    id: 7,
    year: 2017,
    title: "غرفة بيشة تعقد اجتماع الجمعية العمومية السنوي",
    image: "/assembly-placeholder.jpg",
    date: "21 مارس 2017",
    description:
      "عقدت غرفة بيشة اجتماع الجمعية العمومية السنوي برئاسة سعادة رئيس مجلس الإدارة، وبحضور أعضاء مجلس الإدارة والمشتركين، حيث تم خلال الاجتماع مناقشة جدول الأعمال واستعراض التقرير السنوي وإقرار الميزانية للعام المالي القادم.",
  },
  {
    id: 8,
    year: 2016,
    title: "عمومية غرفة بيشة توصي بالبدء في إنشاء مبنى الغرفة الجديد",
    image: "/assembly-placeholder.jpg",
    date: "23 مارس 2016",
    description:
      "عقدت غرفة بيشة اجتماع الجمعية العمومية السنوي برئاسة سعادة رئيس مجلس الإدارة، وبحضور أعضاء مجلس الإدارة والمشتركين، حيث تم خلال الاجتماع مناقشة جدول الأعمال واستعراض التقرير السنوي وإقرار الميزانية للعام المالي القادم، كما أوصت الجمعية بالبدء في إنشاء مبنى الغرفة الجديد.",
  },
];

const GeneralAssemblyPage = () => {
  const [expandedMeeting, setExpandedMeeting] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterYear, setFilterYear] = useState<number | null>(null);

  // Toggle expanded meeting
  const toggleMeeting = (id: number) => {
    if (expandedMeeting === id) {
      setExpandedMeeting(null);
    } else {
      setExpandedMeeting(id);
    }
  };

  // Filter meetings based on search term and year
  const filteredMeetings = assemblyMeetings.filter((meeting) => {
    const matchesSearch =
      searchTerm === "" ||
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = filterYear === null || meeting.year === filterYear;

    return matchesSearch && matchesYear;
  });

  // Get unique years for filter
  const years = [...new Set(assemblyMeetings.map((meeting) => meeting.year))];

  return (
    <div className={styles.assemblyContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>الجمعية العمومية</h1>
          <p className={styles.pageDescription}>
            اجتماعات الجمعية العمومية لغرفة بيشة
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
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

          <div className={styles.yearFilter}>
            <select
              value={filterYear || ""}
              onChange={(e) =>
                setFilterYear(e.target.value ? Number(e.target.value) : null)
              }
              className={styles.yearSelect}
            >
              <option value="">جميع السنوات</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.timelineContainer}>
          <div className={styles.timeline}></div>

          <div className={styles.meetingsContainer}>
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className={`${styles.meetingCard} ${
                    expandedMeeting === meeting.id ? styles.expanded : ""
                  }`}
                >
                  <div
                    className={styles.meetingHeader}
                    onClick={() => toggleMeeting(meeting.id)}
                  >
                    <div className={styles.yearBadge}>
                      <span>{meeting.year}</span>
                    </div>

                    <div className={styles.meetingTitle}>
                      <h2>{meeting.title}</h2>
                      <div className={styles.meetingDate}>
                        <FaCalendarAlt className={styles.dateIcon} />
                        <span>{meeting.date}</span>
                      </div>
                    </div>

                    <div className={styles.expandButton}>
                      {expandedMeeting === meeting.id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                  </div>

                  {expandedMeeting === meeting.id && (
                    <div className={styles.meetingContent}>
                      <div className={styles.meetingImageContainer}>
                        <Image
                          src={meeting.image}
                          alt={meeting.title}
                          width={600}
                          height={400}
                          className={styles.meetingImage}
                          loading="lazy"
                        />
                      </div>

                      <div className={styles.meetingDescription}>
                        <p>{meeting.description}</p>
                      </div>

                      <div className={styles.meetingActions}>
                        <button className={styles.actionButton}>
                          عرض التقرير السنوي
                        </button>
                        <button className={styles.actionButton}>
                          عرض الصور
                        </button>
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
    </div>
  );
};

export default GeneralAssemblyPage;
