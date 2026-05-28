import { useEffect, useState } from "react";
import { getMyCreatedChallenges } from "../../api/challengeApi";
import Header from "../../components/Common/Header";
//import styles from "../../styles/MyPage/MyBoardRequest.module.css";
import styles from "../../styles/MyPage/MyCreatedChallenges.module.css";


const MyCreatedChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    // 로그인 유저 ID 받아오는 방법 (실제 프로젝트 상황에 맞게 조정)
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    const fetchCreatedChallenges = async () => {
        try {
            setLoading(true);
            const response = await getMyCreatedChallenges(userId);
            setChallenges(response.data.challenges || []);
        } catch (error) {
            console.error("내가 개설한 챌린지 목록 조회 실패", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreatedChallenges();
        // eslint-disable-next-line
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>내가 개설한 챌린지</h2>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div>챌린지명</div>
                    <div>기간</div>
                    <div>승인/거절</div>
                    <div>진행 상태</div>
                    <div>신청자 수</div>
                </div>

                {loading ? (
                    <div className={styles.empty}>로딩 중...</div>
                ) : challenges.length === 0 ? (
                    <div className={styles.empty}>개설한 챌린지가 없습니다.</div>
                ) : (
                    challenges.map((item) => (
                        <div key={item.challenge_id} className={styles.tableRow}>
                            <div>{item.title}</div>
                            <div>
                                {item.start_date?.slice(0, 10)} ~ {item.end_date?.slice(0, 10)}
                            </div>
                            <div>
                                {/* 승인/거부/대기 */}
                                {item.status === "PENDING" && "승인 대기"}
                                {item.status === "APPROVED" && "승인됨"}
                                {item.status === "REJECTED" && "거절됨"}
                            </div>
                            <div>
                                {/* 진행 상태 */}
                                {item.challenge_state === "ACTIVE" && "진행중"}
                                {item.challenge_state === "CLOSED" && "종료"}
                                {item.challenge_state === "CANCELLED" && "취소"}
                            </div>
                            <div>
                                {item.applicants_count}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyCreatedChallenges;
