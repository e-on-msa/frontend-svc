import styles from "../../styles/Calendar/WeekSelector.module.css";
import { useContext, useMemo } from "react";
import { CurrentDateContext } from "../../contexts/CurrentDateContext";

const WeekSelector = () => {
    const { currentDate, setCurrentDate } = useContext(CurrentDateContext);

    // 현재 월 기준 주차 리스트 생성
    const weeks = useMemo(() => {
        const startOfMonth = currentDate.clone().startOf("month");
        const endOfMonth = currentDate.clone().endOf("month");

        const weekList = [];
        let cursor = startOfMonth.clone().startOf("week");

        while (cursor.isBefore(endOfMonth.clone().endOf("week"))) {
            const start = cursor.clone();
            const end = cursor.clone().endOf("week");

            // 이 주에 하루라도 currentDate의 달이 포함되어 있다면 포함
            const hasDayInCurrentMonth = Array.from({ length: 7 }).some(
                (_, i) => {
                    return (
                        cursor.clone().add(i, "day").month() ===
                        currentDate.month()
                    );
                }
            );

            if (hasDayInCurrentMonth) {
                weekList.push({ start, end });
            }

            cursor = cursor.add(1, "week");
        }

        return weekList;
    }, [currentDate]);

    // currentDate가 속한 주차 index
    const selectedWeekIndex = useMemo(() => {
        return weeks.findIndex(
            (week) =>
                currentDate.isSame(week.start, "day") ||
                (currentDate.isAfter(week.start, "day") &&
                    currentDate.isBefore(week.end, "day"))
        );
    }, [weeks, currentDate]);

    const handleWeekChange = (e) => {
        const index = Number(e.target.value);
        const week = weeks[index];

        // 주차 내에서 currentDate의 월과 같은 날짜를 찾음
        const newDate = Array.from({ length: 7 })
            .map((_, i) => week.start.clone().add(i, "day"))
            .find((d) => d.month() === currentDate.month());

        setCurrentDate(newDate || week.start); // 없으면 그냥 시작일로 fallback
    };

    return (
        <div className={styles.selectorWrapper}>
            <select
                className={styles.selector}
                value={selectedWeekIndex}
                onChange={handleWeekChange}>
                {weeks.map((_, index) => (
                    <option key={index} value={index}>
                        {index + 1}
                    </option>
                ))}
            </select>
            <span>주차</span>
        </div>
    );
};

export default WeekSelector;
