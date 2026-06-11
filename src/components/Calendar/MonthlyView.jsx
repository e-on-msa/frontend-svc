import styles from "../../styles/Calendar/CalendarView.module.css";
import { CurrentDateContext } from "../../contexts/CurrentDateContext";
import { SearchTypeContext } from "../../contexts/SearchTypeContext";
import { ViewContext } from "../../contexts/ViewContext";
import { useContext } from "react";
import EventBadge from "./EventBadge";

const MonthlyView = () => {
    const { schedules } = useContext(ViewContext);
    const { currentDate } = useContext(CurrentDateContext);
    const { searchType } = useContext(SearchTypeContext);

    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");

    const startDayOfWeek = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();

    const days = [];

    // 지난 달의 날짜 채우기
    for (let i = 0; i < startDayOfWeek; i++) {
        const date = startOfMonth.subtract(startDayOfWeek - i, "day");
        days.push({
            date,
            currentMonth: false,
        });
    }

    // 이번 달의 날짜 채우기
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            date: currentDate.date(i),
            currentMonth: true,
        });
    }

    // 다음 달의 날짜 채우기
    const totalCells = days.length;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
        days.push({
            date: endOfMonth.add(i, "day"),
            currentMonth: false,
        });
    }

    if (!schedules) {
        return <div>불러오는 중...</div>; // 혹은 아무것도 렌더링하지 않게 return null;
    }

    // console.log(searchType, ": 🔁 MonthlyView를 재렌더링");

    return (
        <div className={styles.calendarView}>
            <div className={styles.days}>
                {days.map(({ date, currentMonth }, index) => {
                    const targetDate =
                        searchType.type === "region"
                            ? date.format("YYYY-MM-DD") // 예: 2025-06-13
                            : date.format("YYYYMMDD"); // 예: 20250613

                    const filteredEvents = schedules.filter((schedule) => {
                        if (searchType.type === "region") {
                            return (
                                schedule.averageDate === targetDate &&
                                schedule.schoolType === searchType.schoolType
                            );
                        } else {
                            return schedule.AA_YMD === targetDate;
                        }
                    });

                    return (
                        <div
                            key={index}
                            className={`${styles.day} ${
                                currentMonth ? "" : styles.otherMonth
                            }`}>
                            <div>{date.date()}</div>
                            <div className={styles.eventContainer}>
                                {currentMonth &&
                                    filteredEvents.length > 0 &&
                                    filteredEvents.map((event, i) => (
                                        <EventBadge
                                            key={`${targetDate}-${
                                                event.EVENT_NM ||
                                                event.eventName
                                            }`}
                                            event_name={
                                                event.EVENT_NM ||
                                                event.eventName
                                            }
                                        />
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthlyView;
