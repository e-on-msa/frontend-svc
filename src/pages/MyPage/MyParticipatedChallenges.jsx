import { useEffect, useState } from "react";
import { getMyParticipatedChallenges } from "../../api/challengeApi";
import Header from "../../components/Common/Header";
import styles from "../../styles/MyPage/MyParticipatedChallenges.module.css";

const MyParticipatedChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    // 로그인 유저 ID 받아오는 방법 (예시)
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    const fetchMyChallenges = async () => {
        try {
            setLoading(true);
            const response = await getMyParticipatedChallenges(userId);
            setChallenges(response.data.challenges || []);
        } catch (error) {
            console.error("내가 신청한 챌린지 목록 조회 실패", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyChallenges();
        // eslint-disable-next-line
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>내가 신청한 챌린지</h2>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div>챌린지명</div>
                    <div>기간</div>
                    <div>상태</div>
                    <div>참여 상태</div>
                </div>

                {loading ? (
                    <div className={styles.empty}>로딩 중...</div>
                ) : challenges.length === 0 ? (
                    <div className={styles.empty}>신청한 챌린지가 없습니다.</div>
                ) : (
                    challenges.map((item) => (
                        <div key={item.challenge_id} className={styles.tableRow}>
                            <div>{item.title}</div>
                            <div>
                                {item.start_date?.slice(0, 10)} ~ {item.end_date?.slice(0, 10)}
                            </div>
                            <div>
                                {/* 챌린지 승인 상태 */}
                                {item.status === "PENDING" && "승인 대기"}
                                {item.status === "APPROVED" && "승인됨"}
                                {item.status === "REJECTED" && "거절됨"}
                            </div>
                            <div>
                                {/* 내가 신청한 상태 */}
                                {item.my_participation?.participating_state || "-"}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyParticipatedChallenges;
