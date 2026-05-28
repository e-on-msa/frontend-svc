import axiosInstance from "./axiosInstance";

export const getMyBoardRequests = () => {
  return axiosInstance.get("/api/user/board-requests/me");
};

/* ────────────────────────────────────────────────────── */
/* ───────────────── 챌린지 요청 ────────────────────────── */

// 대기 중인 챌린지 요청 목록 조회
export const getAdminChallengeRequests = () => {
  return axiosInstance.get("/api/admin/challenges");
};

// 챌린지 요청 승인
export const approveChallengeRequest = (challengeId) => {
  return axiosInstance.patch(`/api/admin/challenges/${challengeId}/approve`);
};

// 챌린지 요청 거절
export const rejectChallengeRequest = (challengeId) => {
  return axiosInstance.patch(`/api/admin/challenges/${challengeId}/reject`);
};

// 관리자 챌린지 상세 조회
export const getAdminChallengeDetail = (challengeId) => {
  return axiosInstance.get(`/api/admin/challenges/${challengeId}`);
};