import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

import styles from "./RecommendTabs.module.css";

export default function RecommendTabs() {
  const location = useLocation();

  const tabs = [
    { path: "/recommend/time", label: "학년·월별 추천", icon: <FaCalendarAlt /> },
    { path: "/recommend/profile", label: "내 프로필 맞춤", icon: "🙌" },
    { path: "/recommend/history", label: "활동 기록 맞춤", icon: "📜" },
  ];

  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`${styles.tab} ${
            location.pathname === tab.path ? styles.active : ""
          }`}
        >
          <span className={styles.icon}>{tab.icon}</span>
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
