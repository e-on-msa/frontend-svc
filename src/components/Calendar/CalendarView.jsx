import styles from "../../styles/Calendar/CalendarView.module.css";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 locale 추가
import { useContext, useMemo } from "react";
import { CurrentDateContext } from "../../contexts/CurrentDateContext";
import { ViewContext } from "../../contexts/ViewContext";
import { SearchTypeContext } from "../../contexts/SearchTypeContext";
import MonthlyView from "./MonthlyView";
import WeeklyView from "./WeeklyView";
import WeekSelector from "./WeekSelector";

const CalendarView = () => {
    // 현재 날짜 상태 관리
    const { currentDate, setCurrentDate } = useContext(CurrentDateContext);
    const { currentView } = useContext(ViewContext);
    const { searchType } = useContext(SearchTypeContext);

    // 현재 기준 날짜
    const now = useMemo(() => {
        if (searchType.year === "prev") {
            return dayjs().subtract(1, "year");
        }
        return dayjs();
    }, [searchType.year]);

    // ✅ 최소/최대 날짜 계산
    const minDate = useMemo(() => {
        const month = now.month();
        return month === 0 || month === 1
            ? now.subtract(1, "year").month(2).startOf("month") // 전년도 3월
            : now.month(2).startOf("month"); // 올해 3월
    }, [now]);

    const maxDate = useMemo(() => {
        const month = now.month();
        return month === 0 || month === 1
            ? now.month(1).endOf("month") // 올해 2월
            : now.add(1, "year").month(1).endOf("month"); // 다음 해 2월
    }, [now]);

    // ✅ 이동 가능 여부 계산
    const canPrevMonth = useMemo(
        () => currentDate.isAfter(minDate, "month"),
        [currentDate, minDate]
    );
    const canNextMonth = useMemo(
        () => currentDate.isBefore(maxDate, "month"),
        [currentDate, maxDate]
    );

    // ✅ 이전 달로 이동
    const prevMonth = () => {
        if (!canPrevMonth) return;

        if (currentDate.month() === 0) {
            setCurrentDate((prev) => prev.subtract(1, "year").month(11));
        } else {
            setCurrentDate((prev) => prev.subtract(1, "month"));
        }
    };

    // ✅ 다음 달로 이동 (12월 처리 포함)
    const nextMonth = () => {
        if (!canNextMonth) return;

        if (currentDate.month() === 11) {
            setCurrentDate((prev) => prev.add(1, "year").month(0));
        } else {
            setCurrentDate((prev) => prev.add(1, "month"));
        }
    };

    return (
        <div className={styles.calendarView}>
            <div className={styles.selectDate}>
                <div
                    className={`${styles.prevMonth} ${
                        canPrevMonth ? "" : styles.disabled
                    }`}
                    onClick={prevMonth}>
                    {"<"}
                </div>
                <div className={styles.monthView}>
                    <div className={styles.year}>{currentDate.year()}</div>
                    <div className={styles.yearText}>년</div>
                    <div className={styles.month}>
                        {currentDate.month() + 1}
                    </div>
                    <div className={styles.monthText}>월</div>
                </div>
                <div
                    className={`${styles.nextMonth} ${
                        canNextMonth ? "" : styles.disabled
                    }`}
                    onClick={nextMonth}>
                    {">"}
                </div>
                {/* 👇 주차 셀렉터를 weekly일 때만 렌더링 */}
                {currentView === "weekly" && (
                    <div className={styles.weekSelectorWrapper}>
                        <WeekSelector />
                    </div>
                )}
            </div>
            <div className={styles.calendar}>
                <div className={styles.weekdays}>
                    {[
                        "일요일",
                        "월요일",
                        "화요일",
                        "수요일",
                        "목요일",
                        "금요일",
                        "토요일",
                    ].map((day, index) => {
                        let className = styles.weekday;
                        if (index === 0) className += ` ${styles.sunday}`;
                        else if (index === 6)
                            className += ` ${styles.saturday}`;

                        return (
                            <div key={day} className={className}>
                                {day}
                            </div>
                        );
                    })}
                </div>
                <div className={styles.calendarViewContent}>
                    {currentView == "monthly" ? (
                        <MonthlyView />
                    ) : (
                        <WeeklyView />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
