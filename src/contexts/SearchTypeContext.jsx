import { createContext, useState } from "react";

export const SearchTypeContext = createContext();

const SearchTypeProvider = ({ children }) => {
    // 현재 검색 타입 상태 관리
    const [searchType, setSearchType] = useState({
        type: "school", //"school" 또는 "region", 기본형 "school"
        grade: 1, // 숫자형 학년 정보 (1~6학년 가능, 중학교는 1~3학년만)
        year: null, // 기본 값이 null
        schoolType: "middle", // 기본 값은 "middle", 그 외는 "elementary"
    });

    const [schoolAddress, setSchoolAdress] =
        useState("서울특별시 송파구 송이로 45"); // 가락중학교 기준

    return (
        <SearchTypeContext.Provider
            value={{
                searchType,
                setSearchType,
                schoolAddress,
                setSchoolAdress,
            }}>
            {children}
        </SearchTypeContext.Provider>
    );
};

export default SearchTypeProvider;
