import { useParams } from "react-router-dom";
import ChallengeDetailContent from "./ChallengeDetailContent";
import { useEffect, useState } from "react";
import {
    getChallengeDetail,
    getParticipationDetailForUser,
} from "../../api/challengeApi";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/Challenge/ChallengeDetail.module.css";

const ChallengeDetailComponent = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const userId = user?.user_id;

    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookmarked, setBookmarked] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [participationId, setParticipationId] = useState(null);
    const [participationState, setParticipationState] = useState(null);

    // detail 정보와 참여상태를 모두 fetch하는 함수로 분리!
    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await getChallengeDetail(id, userId);
            setChallenge(res.data);
            setBookmarked(!!res.data.is_bookmarked);

            try {
                const participationRes = await getParticipationDetailForUser(
                    id,
                    userId
                );
                const mp = participationRes.data?.my_participation || null;
                if (mp) {
                    setParticipationState(mp.participating_state);
                    setIsJoined(mp.participating_state !== "취소");
                    setParticipationId(mp.participating_id);
                } else {
                    setParticipationState(null);
                    setIsJoined(false);
                    setParticipationId(null);
                }
            } catch (e) {
                setParticipationState(null);
                setIsJoined(false);
                setParticipationId(null);
            }
        } catch (e) {
            setChallenge(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDetail();
        // eslint-disable-next-line
    }, [id, userId]);

    if (loading)
        return (
            <div>
                <div className={styles.centeredMessage}>로딩 중...</div>
            </div>
        );
    if (!challenge)
        return (
            <div>
                <div className={styles.centeredMessage}>
                    존재하지 않는 챌린지입니다.
                </div>
            </div>
        );

    return (
        <div className={styles.componentContent}>
            <ChallengeDetailContent
                challenge={challenge}
                bookmarked={bookmarked}
                setBookmarked={setBookmarked}
                userId={userId}
                isJoined={isJoined}
                setIsJoined={setIsJoined}
                participationId={participationId}
                setParticipationId={setParticipationId}
                participationState={participationState}
                userAge={user?.age}
                refresh={fetchDetail}
            />
        </div>
    );
};

export default ChallengeDetailComponent;
