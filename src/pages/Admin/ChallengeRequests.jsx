// src/pages/Admin/ChallengeRequests.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getAdminChallengeRequests,
    approveChallengeRequest,
    rejectChallengeRequest,
} from "../../api/myPageApi";
// import Header from '../../components/Common/Header';
import styles from "../../styles/Admin/AdminChallengeRequests.module.css";

const ChallengeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        try {
            const res = await getAdminChallengeRequests();
            setRequests(res.data);
        } catch (err) {
            console.error("챌린지 개설 요청 조회 실패", err);
            setError(err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            await approveChallengeRequest(id);
            setRequests((prev) => prev.filter((r) => r.challenge_id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "승인 중 오류 발생");
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectChallengeRequest(id);
            setRequests((prev) => prev.filter((r) => r.challenge_id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "거절 중 오류 발생");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>챌린지 개설 요청 목록</h2>

            {error && <p className={styles.error}>Error: {error}</p>}

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    {/* <div>ID</div> */}
                    <div>제목</div>
                    <div>연락처</div>
                    <div>마감일</div>
                    <div>승인/거절</div>
                </div>

                {requests.length === 0 ? (
                    <div className={styles.empty}>
                        대기중인 요청이 없습니다.
                    </div>
                ) : (
                    requests.map((req) => (
                        // <div key={req.challenge_id} className={styles.tableRow}>
                        <Link
                            key={req.challenge_id}
                            to={`/admin/challenge-requests/${req.challenge_id}`}
                            className={`${styles.tableRow} ${styles.tooltip}`}>
                            {/* <div>{req.challenge_id}</div> */}
                            <div>{req.title}</div>
                            <div>{req.creator_contact}</div>
                            <div>
                                {new Date(
                                    req.application_deadline
                                ).toLocaleDateString()}
                            </div>
                            <div className={styles.actions}>
                                <button
                                    className={styles.approveBtn}
                                    onClick={(e) => {
                                        e.preventDefault(); // 링크 이동 방지
                                        handleApprove(req.challenge_id);
                                    }}>
                                    승인
                                </button>
                                <button
                                    className={styles.rejectBtn}
                                    onClick={(e) => {
                                        e.preventDefault(); // 링크 이동 방지
                                        handleReject(req.challenge_id);
                                    }}>
                                    거절
                                </button>
                            </div>
                            {/* 툴팁 내용 */}
                            <span className={styles.tooltipText}>
                                {`클릭 시 ${req.title}의 상세보기를 확인할 수 있습니다.`}
                            </span>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChallengeRequests;
