import axios from "./axiosInstance";

// 1. 전체 사용자 계정 상태 조회 (관리자용)
export const getAllUserState = async () => {
    return axios.get("/api/user/state");
};

// 2. 사용자 계정 상태 업데이트 (관리자용)
export const updateUserState = async (userId, stateCode) => {
    return axios.patch("/api/user/state", {
        user_id: userId,
        state_code: stateCode,
    });
};

/** 지정 시간(또는 영구) 정지 */
export const banUser = (payload) =>
  axios.post("/admin/ban", payload);

/** 정지 해제 */
export const unbanUser = (userId) =>
  axios.patch(`/admin/ban/${userId}`, { action: "unban" });

/** 정지 연장 */
export const extendBan = (userId, hours) =>
  axios.patch(`/admin/ban/${userId}`, {
    action: "extend",
    duration_hours: hours,
  });
