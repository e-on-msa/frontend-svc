// src/api/preference.js
import axios from "./axiosInstance";

// 관심 분야 대분류
export const getInterestCategories = async () => {
  const res = await axios.get("/api/interests/categories"); //엔드포인트 수정해야함
  return res.data.categories;
};

// 선택된 대분류의 소분류 리스트
export const getInterestsByCategory = async (categoryCode) => {
  const res = await axios.get(`/api/interests/list/${categoryCode}`);
  return res.data.interests;
};

// 진로 희망 대분류
export const getVisionCategories = async () => {
  const res = await axios.get("/api/visions/categories");
  return res.data.categories;
};

// 진로 희망 소분류
export const getVisionsByCategory = async (categoryCode) => {
  const res = await axios.get(`/api/visions/list/${categoryCode}`);
  return res.data.visions;
};

// 기존 POST → GET 변경 + userId 직접 파라미터에 넣기
export const fetchRecommendationsByPreference = async () => {
  const res = await axios.get(`/api/recommendations/recommend`);
  return res.data;
};

