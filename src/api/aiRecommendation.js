// src/api/aiRecommendation.js
import axios from './axiosInstance';

export const fetchAIRecommendations = async () => {
  const response = await axios.get('/api/recommendations/recommend');
  return response.data;
};
