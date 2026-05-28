// src/pages/Suggestion/PreferenceInterest.jsx
import React, { useState, useEffect } from "react";
import styles from "../../styles/Pages/Preference.module.css";
import {
  getInterestCategories,
  getInterestsByCategory
} from "../../api/preference";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";

const PreferenceInterest = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState(null);
  const [interests, setInterests] = useState([]);
  // 선택을 { interest_id, interest_detail } 객체로 저장
  const [selectedInterests, setSelectedInterests] = useState([]);

  // ✅ localStorage에서 로그인된 사용자 ID 가져오기
  const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

  useEffect(() => {
    getInterestCategories().then((data) => {
      setCategories(data || []);
      // 처음 진입 시 첫 카테고리를 자동 선택하고 싶다면 주석 해제
      // if (data?.length) setSelectedCategoryCode(data[0].category_code);
    });
  }, []);

  useEffect(() => {
    if (selectedCategoryCode) {
      getInterestsByCategory(selectedCategoryCode).then((data) =>
        setInterests(data || [])
      );
    } else {
      setInterests([]);
    }
  }, [selectedCategoryCode]);

  const toggleInterest = (interest) => {
    // interest = { interest_id, interest_detail, ... }
    setSelectedInterests((prev) => {
      const exists = prev.some((i) => i.interest_id === interest.interest_id);
      return exists
        ? prev.filter((i) => i.interest_id !== interest.interest_id)
        : [...prev, { interest_id: interest.interest_id, interest_detail: interest.interest_detail }];
    });
  };

  const handleNext = async () => {
    // ✅ 예외 처리: 선택 항목 없는 경우
    if (selectedInterests.length === 0) {
      alert("관심 분야를 최소 1개 이상 선택해주세요.");
      return;
    }

    try {
      // ✅ 이미 id를 들고 있으므로 카테고리 변경과 무관하게 안전
      const interestIds = selectedInterests.map((i) => i.interest_id);

      await axios.post("/api/preferences/interests", {
        userId,
        interestIds
      });

      navigate("/suggestion/preferences/vision");
    } catch (err) {
      console.error("❌ 관심사 저장 실패", err);
      alert("관심사 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>관심 분야 선택</h2>

      <div className={styles.selectorRow}>
        <div className={styles.column}>
          {categories.map((cat) => (
            <button
              key={cat.category_code}
              className={`${styles.categoryBtn} ${
                cat.category_code === selectedCategoryCode ? styles.active : ""
              }`}
              onClick={() => setSelectedCategoryCode(cat.category_code)}
              type="button"
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        <div className={styles.column}>
          {interests.map((interest) => (
            <button
              key={interest.interest_id}
              className={`${styles.detailBtn} ${
                selectedInterests.some(
                  (i) => i.interest_id === interest.interest_id
                )
                  ? styles.selected
                  : ""
              }`}
              onClick={() => toggleInterest(interest)}
              type="button"
            >
              {interest.interest_detail}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.submitBtn} onClick={handleNext} type="button">
        선택 완료
      </button>
    </div>
  );
};

export default PreferenceInterest;
