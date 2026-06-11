import { useState, useEffect } from "react";
import ChallengeSearchSection from "./ChallengeSearchSelection";
import ChallengeList from "./ChallengeList";
import Pagination from "./Pagination";
import {
    getChallengeList,
    participateChallenge,
    cancelParticipation,
    checkAbsence,
} from "../../api/challengeApi";
import axiosInstance from "../../api/axiosInstance";
import styles from "../../styles/Challenge/Challenge.module.css";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const itemsPerPage = 5;

const ChallengeComponent = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [challenges, setChallenges] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const { user } = useAuth();
    const userId = user?.user_id;

    // ─── 필터 상태: 모달에서 내려오는 값들을 담음 ───
    const emptyFilters = {
        status: [],
        date: "",
        minAge: "",
        maxAge: "",
        interestId: "",
        visionId: "",
    };

    const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
    // 관심사/비전 옵션을 미리 받아오기
    const [interestOptions, setInterestOptions] = useState([]);
    const [visionOptions, setVisionOptions] = useState([]);

    const handleClearFilters = () => {
        setAppliedFilters(emptyFilters);
        setCurrentPage(1);
    };

    useEffect(() => {
        // (optional) 로그인한 유저 콘솔
    }, [user]);

    useEffect(() => {
        axiosInstance
            .get("/api/interests")
            .then((res) => setInterestOptions(res.data))
            .catch((err) => console.error("관심사 조회 실패:", err));

        axiosInstance
            .get("/api/visions")
            .then((res) => setVisionOptions(res.data))
            .catch((err) => console.error("비전 조회 실패:", err));
    }, []);

    // ─── 챌린지 목록 조회 함수 ───
    const fetchChallenges = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
            };

            if (search) {
                params.q = search;
            }

            const { status, date, minAge, maxAge, interestId, visionId } =
                appliedFilters;

            // 1) 상태 필터
            if (Array.isArray(status) && status.length > 0) {
                const mapped = status
                    .map((s) => {
                        if (s === "진행중") return "ACTIVE";
                        if (s === "완료") return "CLOSED";
                        if (s === "취소됨") return "CANCELLED";
                        return null;
                    })
                    .filter(Boolean);
                    if (mapped.length === 1) {
                        params.state = mapped[0];  // 하나면 그냥 문자열
                    } else if (mapped.length > 1) {
                        params.state = mapped;     // 여러 개면 배열 (axios가 ?state=ACTIVE&state=CLOSED로 변환)
                    }
            }

            if (date) params.date = date;
            if (minAge) params.minAge = minAge;
            if (maxAge) params.maxAge = maxAge;
            if (interestId) params.interestId = Number(interestId);
            if (visionId) params.visionId = Number(visionId);

            const res = await getChallengeList(params);
            setChallenges(res.data.challenges);
            setTotalCount(res.data.totalItems);
        } catch (err) {
            console.error("챌린지 조회 중 오류:", err);
            setChallenges([]);
            setTotalCount(0);
        }
        setLoading(false);
    };

    // 검색어, 페이지, appliedFilters 바뀔 때마다 호출
    useEffect(() => {
        fetchChallenges();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, currentPage, appliedFilters]);

    const handleSearch = () => {
        setCurrentPage(1);
    };

    // "필터 적용" 콜백
    const handleApplyFilter = (filtersFromModal) => {
        setAppliedFilters(filtersFromModal);
        setCurrentPage(1);
    };

    // 챌린지 생성 페이지로 이동 (결석 체크)
    const handleCreate = async () => {
        if (!userId) {
            toast("로그인이 필요합니다.");
            return;
        }
        try {
            const res = await checkAbsence();
            if (res.data.hasAbsence) {
                toast(
                    "최근 1주일 내 결석 기록이 있어 챌린지 개설이 제한됩니다.",
                    {
                        icon: "💜",
                        className: "my-toast",
                        progressClassName: "custom-progress-bar",
                    }
                );
                return;
            }
            window.location.href = "/challenge/create";
        } catch (err) {
            toast("결석 체크 중 오류가 발생했습니다.");
            console.error(err);
        }
    };

    // 참여 / 참여 취소 로직
    const handleApply = async ({
        challenge_id,
        isJoined,
        participationId,
        participationState,
        isOwner,
        isClosed,
    }) => {
        if (actionLoading) return;
        setActionLoading(true);

        if (isOwner || isClosed) {
            toast("신청할 수 없는 챌린지입니다.", {
            icon: "💜",
            className: "my-toast",
            progressClassName: "custom-progress-bar",
            });
            return;
        }

        try {
            if (isJoined) {
                if (!participationId) {
                    toast("참여 기록이 없습니다.", {
                        icon: "💜",
                        className: "my-toast",
                        progressClassName: "custom-progress-bar",
                    });
                    setActionLoading(false);
                    return;
                }
                await cancelParticipation(participationId);
                toast("참여가 취소되었습니다.", {
                    icon: "💜",
                    className: "my-toast",
                    progressClassName: "custom-progress-bar",
                });
            } else {
                if (participationId && participationState === "취소") {
                    await cancelParticipation(participationId);
                    await new Promise((res) => setTimeout(res, 200));
                    await participateChallenge(challenge_id, {});
                    toast("참여가 완료되었습니다!", {
                        icon: "💜",
                        className: "my-toast",
                        progressClassName: "custom-progress-bar",
                    });
                } else {
                    await participateChallenge(challenge_id, {});
                    toast("참여가 완료되었습니다!", {
                        icon: "💜",
                        className: "my-toast",
                        progressClassName: "custom-progress-bar",
                    });
                }
            }
            await fetchChallenges();
        } catch (error) {
            toast("참여 처리 중 오류가 발생했습니다.", {
                icon: "💜",
                className: "my-toast",
                progressClassName: "custom-progress-bar",
            });
            console.error(error);
        }
        setActionLoading(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className={styles.componentContainer}>
            <div className={styles.componentContent}>
                {/* 검색/필터/생성 섹션 */}
                <ChallengeSearchSection
                    search={search}
                    setSearch={setSearch}
                    onSearch={handleSearch}
                    onCreate={handleCreate}
                    onClearFilters={handleClearFilters}
                    interestList={interestOptions}
                    visionList={visionOptions}
                    onFilter={handleApplyFilter}
                />
                {/* 챌린지 리스트 or 로딩 메시지 */}
                {loading ? (
                    <div className={styles.loading}>로딩 중...</div>
                ) : (
                    <>
                        <ChallengeList
                            challenges={challenges}
                            onApply={handleApply}
                            userAge={user?.age}
                            userId={user?.user_id}
                            actionLoading={actionLoading}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChallengeComponent;
