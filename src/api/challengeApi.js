// src/api/challengeApi.js

import axiosInstance from "./axiosInstance";

// 1. 챌린지 생성
export const createChallenge = (data) => {
  return axiosInstance.post("/api/challenges", data);
};

// 2. 챌린지 목록 조회 (페이징 포함)
export const getChallengeList = (params) => {
  // params: { page, limit, ... }
  return axiosInstance.get("/api/challenges", { params });
};

// 3. 챌린지 상세 조회
export const getChallengeDetail = (challengeId, userId) => {
  return axiosInstance.get(`/api/challenges/${challengeId}`, { params: { user_id: userId } });
};

// 4. 챌린지 수정
export const updateChallenge = (challengeId, data) => {
  return axiosInstance.patch(`/api/challenges/${challengeId}`, data);
};

// 5. 챌린지 삭제
export const deleteChallenge = (challengeId) => {
  return axiosInstance.delete(`/api/challenges/${challengeId}`);
};

// 6. 챌린지 상태변경
export const updateChallengeState = (challengeId, state) => {
  return axiosInstance.patch(`/api/challenges/${challengeId}/state`, { state });
};


// 7. 챌린지 참여 신청
export const participateChallenge = (challengeId, data) => {
  return axiosInstance.post(`/api/challenges/${challengeId}/participations`, data);
};


// 8. 챌린지 참여 취소
export const cancelParticipation = (participationId, data) => {
  return axiosInstance.patch(`/api/participations/${participationId}`, data);
};

// 8+. 챌린지 참여 조회
export const getParticipationDetail = (participationId) => {
  return axiosInstance.get(`/api/participations/${participationId}`);
};

export const getParticipationDetailForUser = (challengeId, userId) => {
  return axiosInstance.get(`/api/challenges/${challengeId}`, {
    params: { user_id: userId }
  });
};

// 9. 챌린지 출석 기록 조회
export const getChallengeAttendances = (challengeId, date) => {
  return axiosInstance.get(
    `/api/challenges/${challengeId}/attendance`,
    { params: { date } }   // ?date=YYYY-MM-DD
  );
};

// 10. 출석 기록 추가
export const addAttendance = (participationId, data) => {
  return axiosInstance.post(`/api/participations/${participationId}/attendances`, data);
};

// 11. 출석 기록 수정
export const updateAttendance = (attendanceId, data) => {
  return axiosInstance.patch(`/api/attendances/${attendanceId}`, data);
};

// 12. 출석 기록 삭제
export const deleteAttendance = (attendanceId) => {
  return axiosInstance.delete(`/api/attendances/${attendanceId}`);
};

// 13. 챌린지 리뷰 작성
export const createReview = (challengeId, data) => {
  return axiosInstance.post(`/api/challenges/${challengeId}/reviews`, data);
};

// 14. 챌린지 리뷰 목록 조회
export const getChallengeReviews = (challengeId) => {
  return axiosInstance.get(`/api/challenges/${challengeId}/reviews`);
};

// 15. 리뷰 수정
export const updateReview = (reviewId, data) => {
  return axiosInstance.patch(`/api/reviews/${reviewId}`, data);
};

// 16. 리뷰 삭제
export const deleteReview = (reviewId) => {
  return axiosInstance.delete(`/api/reviews/${reviewId}`);
};

// 17. 챌린지 북마크 추가
export const addBookmark = (challengeId, userId) => {
  return axiosInstance.post(`/api/challenges/${challengeId}/bookmarks`, { user_id: userId });
};

// 18. 북마크 해제
export const removeBookmark = (challengeId, userId) => {
  return axiosInstance.delete(`/api/challenges/${challengeId}/bookmarks`, { data: { user_id: userId } });
};

// 19. 첨부파일 업로드 (multipart/form-data)
export const uploadAttachment = (challengeId, formData) => {
  return axiosInstance.post(`/api/challenges/${challengeId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 20. 첨부파일 목록 조회
export const getAttachments = (challengeId) => {
  return axiosInstance.get(`/api/challenges/${challengeId}/attachments`);
};

// 21. 첨부파일 삭제
export const deleteAttachment = (attachmentId) => {
  return axiosInstance.delete(`/api/attachments/${attachmentId}`);
};

// 22. 최근 7일 이내 결석 체크
export const checkAbsence = (userId) => {
  return axiosInstance.get('/api/attendances/check-absence', { params: { user_id: userId } });
};

// 23. 내가 신청한 챌린지
export const getMyParticipatedChallenges = (userId) => {
  return axiosInstance.get('/api/challenges/my/participated', {
    params: { user_id: userId }
  });
};

// 24. 내가 개설한 챌린지
export const getMyCreatedChallenges = (userId) => {
  return axiosInstance.get('/api/challenges/my/created', {
    params: { user_id: userId }
  });
};
