"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaUser, FaUserTie, FaUsers } from "react-icons/fa";
import styles from "../../../styles/Board.module.css";
import axios from "axios";

const BoardPage = () => {
  const [boardMembers, setBoardMembers] = useState([]);

  const GetAllBoard = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Admin/Get-All-BOD`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      setBoardMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetAllBoard();
  }, []);

  return (
    <div className={styles.boardContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>مجلس الإدارة</h1>
          <p className={styles.pageDescription}>أعضاء مجلس إدارة غرفة بيشة</p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* Board Members Section */}
        <div className={styles.membersSection}>
          <div className={styles.sectionTitle}>
            <FaUsers className={styles.sectionIcon} />
            <h2>أعضاء مجلس الإدارة</h2>
          </div>

          <div className={styles.membersGrid}>
            {boardMembers.map((member) => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.memberImageContainer}>
                  <div className={styles.memberImageWrapper}>
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name || "عضو مجلس الإدارة"}
                        width={200}
                        height={200}
                        className={styles.memberImage}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <FaUserTie className={styles.placeholderIcon} />
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberPosition}>{member.possion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
