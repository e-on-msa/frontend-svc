// src/pages/MyPage/AdminChallengeDetail.jsx
import { useParams } from "react-router-dom";
// import Header from "../../components/Common/Header";
import ChallengeDetailContent from "../../components/Challenge/ChallengeDetailContent";
import { useEffect, useState } from "react";
import { getAdminChallengeDetail } from "../../api/myPageApi";
import { useAuth } from "../../hooks/useAuth";

export default function AdminChallengeDetail() {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const userId = user?.user_id;

    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getAdminChallengeDetail(id);
                setChallenge(res.data);
            } catch {
                setChallenge(null);
            }
            setLoading(false);
        };
        fetch();
    }, [id, userId]);

    if (authLoading || loading) return <p>로딩 중…</p>;
    if (!challenge) return <p>존재하지 않는 챌린지입니다.</p>;

    return (
        <div>
            {/* <Header /> */}
            <h2 className={StyleSheet.title}>
                챌린지 상세 (관리자 뷰)
            </h2>
            <ChallengeDetailContent
                challenge={challenge}
                // 아래 props가 true 이면 하단 액션 버튼(참여/수정/삭제/북마크)을 숨기하도록 컴포넌트 수정 필요
                hideActions={true}
                hideReviews={true}
                bookmarked={false}
                setBookmarked={() => {}}
                userId={userId}
                isJoined={false}
                setIsJoined={() => {}}
                participationId={null}
                setParticipationId={() => {}}
                participationState={null}
                userAge={user?.age}
                refresh={() => {}}
            />
        </div>
    );
}
