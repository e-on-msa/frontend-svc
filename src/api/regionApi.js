import axios from "./axiosInstance";

// 1. 전체 지역 조회
export const getRegionList = async () => {
    return axios.get("/regions");
}

// 2. 지역명 검색
export const searchRegionByName = async (regionName) => {
    return axios.get(`/regions/search?region_name=${regionName}`);
}

// 3. 평균 학사일정 조회
export const searchAverageScheduleByName = async (regionName) => {
    return axios.get(`/averageSchedule/region/${regionName}/schedule`);
}

// 4. 학년별 평균 학사일정 조회
export const searchAverageScheduleByGrade = async (regionName, grade) => {
    return axios.get(`/averageSchedule/region/${regionName}/schedule?grade=${grade}`);
}

// 5. 아이디로 지역명 조회
export const searchRegionById = async (regionId) => {
    return axios.get(`/regions/${regionId}`);
}