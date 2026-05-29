import axios from './axiosInstance';

export const fetchTimeRecommendations = async (schoolType, month, grade) => {
  const response = await axios.get(
    '/api/recommendations/time',
    { params: { schoolType, month, grade } }
  );
  return response.data;
};
