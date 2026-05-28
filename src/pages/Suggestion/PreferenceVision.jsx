// src/pages/Suggestion/PreferenceVision.jsx
import React, { useState, useEffect } from "react";
import styles from "../../styles/Pages/Preference.module.css";
import {
  getVisionCategories,
  getVisionsByCategory
} from "../../api/preference";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";

const PreferenceVision = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState(null);
  const [visions, setVisions] = useState([]);
  // 선택을 { vision_id, vision_detail } 형태로 관리
  const [selectedVisions, setSelectedVisions] = useState([]);

  // ✅ 로그인 사용자 ID 불러오기
  const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

  useEffect(() => {
    getVisionCategories().then((data) => {
      setCategories(data || []);
      // 필요 시 첫 카테고리 자동 선택
      // if (data?.length) setSelectedCategoryCode(data[0].category_code);
    });
  }, []);

  useEffect(() => {
    if (selectedCategoryCode) {
      getVisionsByCategory(selectedCategoryCode).then((data) =>
        setVisions(data || [])
      );
    } else {
      setVisions([]);
    }
  }, [selectedCategoryCode]);

  const toggleVision = (vision) => {
    // vision = { vision_id, vision_detail, ... }
    setSelectedVisions((prev) => {
      const exists = prev.some((v) => v.vision_id === vision.vision_id);
      return exists
        ? prev.filter((v) => v.vision_id !== vision.vision_id)
        : [...prev, { vision_id: vision.vision_id, vision_detail: vision.vision_detail }];
    });
  };

  const handleNext = async () => {
    // ✅ 예외 처리: 선택하지 않은 경우 경고창 표시
    if (selectedVisions.length === 0) {
      alert("진로 희망을 최소 1개 이상 선택해주세요.");
      return;
    }

    try {
      // ✅ 이미 id를 들고 있으므로 카테고리와 무관하게 안전
      const visionIds = selectedVisions.map((v) => v.vision_id);

      // ✅ 백엔드에 POST
      await axios.post("/api/preferences/visions", {
        userId,
        visionIds
      });

      navigate("/suggestion/recommendation");
    } catch (err) {
      console.error("❌ 진로희망 저장 실패", err);
      alert("진로희망 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>진로 희망 선택</h2>

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
          {visions.map((vision) => (
            <button
              key={vision.vision_id}
              className={`${styles.detailBtn} ${
                selectedVisions.some((v) => v.vision_id === vision.vision_id)
                  ? styles.selected
                  : ""
              }`}
              onClick={() => toggleVision(vision)}
              type="button"
            >
              {vision.vision_detail}
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

export default PreferenceVision;
