import styles from "../../styles/Calendar/EventBadge.module.css";

// const formatEventName = (name) => {
//     return name
//         .replace(/([가-힣])\(/g, "$1\u200B(") // 괄호 앞 줄바꿈 가능
//         .replace(/([)])([가-힣])/g, "$1\u200B$2") // 닫는 괄호 뒤 줄바꿈
//         .replace(/\s/g, "\u200B "); // 공백 뒤 줄바꿈 가능
// };

const EventBadge = ({ event_name }) => {
    return (
        <div className={styles.eventBadge}>
            <span className={styles.eventTitle}>
                {event_name}
            </span>
        </div>
    );
};

export default EventBadge;
