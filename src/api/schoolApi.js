import axios from "./axiosInstance";

// 1. 학교 이름으로 학교 이름 조회
export const searchSchoolsByName = async (schoolName) => {
    return axios.get(`/schoolSchedule/schools?query=${schoolName}`);
};

// 1-1. 행정표준코드로 학교 조회
export const searchSchoolBySchoolCode = async (schoolCode) => {
    return axios.get(`/schoolSchedule/schools/code?query=${schoolCode}`);
}

// 2. 학교 ID로 올해의 전체 학사일정 조회 (서울)
export const getSchoolSchedule = async (schoolId) => {
    return axios.get(`/schoolSchedule/schools/${schoolId}/schedule`);
};

// 3. 학교 ID로 올해의 학년별 학사일정 조회 (서울)
export const getSchoolScheduleByGrade = async (schoolId, grade) => {
    return axios.get(
        `/schoolSchedule/schools/${schoolId}/schedule?grade=${grade}`
    );
};

// 4. 학교 ID로 작년의 전체 학사일정 조회
export const getPrevSchoolSchedule = async (schoolId) => {
    return axios.get(`/schoolSchedule/schools/${schoolId}/schedule?year=prev`);
};

// 5. 학교 ID로 작년의 학년별 학사일정 조회
export const getPrevSchoolScheduleByGrade = async (schoolId, grade) => {
    return axios.get(
        `/schoolSchedule/schools/${schoolId}/schedule?year=prev&grade=${grade}`
    );
};

// 6. 학교 ID + 교육청 코드로 전체 학사일정 조회 (서울 외 지역도 가능)
export const getAllSchoolSchedule = async (schoolId, atptCode, year, grade) => {
    const params = {};

    if (year) params.year = year;
    if (grade) params.grade = grade;

    return axios.get(
        `/schoolSchedule/schools/${schoolId}/${atptCode}/schedule`,
        { params }
    );
};

// 7. 나의 학교 저장
export const saveMySchool = async (userId, type, code) => {
    return axios.post("/mySchool/save", {
        userId,
        type,
        code: String(code),
    });
};

// 8. 나의 학교 삭제
export const deleteMySchool = async (userId, type) => {
    return axios.post("/mySchool/delete", { userId, type });
};

// 9. 나의 학교 조회
export const getMySchool = async (type) => {
    return axios.get("/mySchool/get", { params: { type } });
};