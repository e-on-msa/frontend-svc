import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 locale 추가
import { createContext, useState } from "react";

export const CurrentDateContext = createContext();

const CurrentDateProvider = ({ children }) => {
    // 현재 날짜 상태 관리
    const [currentDate, setCurrentDate] = useState(dayjs());

    return (
        <CurrentDateContext.Provider value={{ currentDate, setCurrentDate }}>
            {children}
        </CurrentDateContext.Provider>
    );
};

export default CurrentDateProvider;
