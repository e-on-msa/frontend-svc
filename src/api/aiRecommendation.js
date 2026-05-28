// src/api/aiRecommendation.js
import axios from 'axios';

export const fetchAIRecommendations = async () => {
  const response = await axios.get('/api/recommend', {
    withCredentials: true, // 로그인 세션 유지
  });
  return response.data;
};
