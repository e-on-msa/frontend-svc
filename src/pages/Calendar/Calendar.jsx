import styles from "../../styles/Pages/Calendar.module.css";
import Header from "../../components/Common/Header";
import SchoolSearchBar from "../../components/Calendar/SchoolSearchBar";
import ViewNavigator from "../../components/Calendar/ViewNavigator";
import CalendarView from "../../components/Calendar/CalendarView";
import AcademicEventsList from "../../components/Calendar/AcademicEventsList";

const Calendar = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.content}>
                <div className={styles.schollSearchBar}>
                    <SchoolSearchBar />
                </div>
                <div className={styles.viewNavigator}>
                    <ViewNavigator />
                </div>
                <div className={styles.calendarView}>
                    <CalendarView />
                </div>
                <div className={styles.academicEventsList}>
                    <AcademicEventsList />
                </div>
            </div>
        </div>
    );
};

export default Calendar;
