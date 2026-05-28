import styles from "../../styles/Pages/MySchoolManagement.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
    searchSchoolBySchoolCode,
    saveMySchool,
    deleteMySchool,
    getMySchool,
} from "../../api/schoolApi";
import { searchRegionById } from "../../api/regionApi";
import MySchoolModal from "./MySchoolModal";
import { toast } from "react-toastify";

const MySchoolManagement = () => {
    // const [mySchoolUpdated, setMySchoolUpdated] = useState(false);
    const [school, setSchool] = useState(null); // 학교별
    const [region, setRegion] = useState(null); // 지역별
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const { user } = useContext(AuthContext);
    const userId = user?.user_id; // 로그인된 사용자 ID

    const fetchData = async () => {
        if (!userId) return;
        try {
            const [schoolRes, regionRes] = await Promise.all([
                getMySchool("school"),
                getMySchool("region"),
            ]);

            if (schoolRes.data?.code) {
                const school = await searchSchoolBySchoolCode(
                    schoolRes.data.code
                );
                setSchool(school?.data[0]?.name || null);
            } else {
                setSchool(null);
            }

            if (regionRes.data?.code) {
                const region = await searchRegionById(regionRes.data.code);
                setRegion(region?.data?.data?.region_name || null);
            } else {
                setRegion(null);
            }
        } catch (err) {
            console.error("나의 학교 조회 실패", err);
            setSchool(null);
            setRegion(null);
        }

        // setMySchoolUpdated(false); // 데이터 갱신 후 상태 초기화
    };

    useEffect(() => {
        fetchData();
    }, [userId, school, region]);

    const openSearchModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
    };

    const handleConfirm = async (type, code) => {
        try {
            await saveMySchool(userId, type, code);
            closeModal();
            fetchData();

            toast(
                `${
                    type === "school" ? "학교별" : "지역별"
                } 나의 학교 추가 완료`,
                {
                    icon: "💜",
                    className: "my-toast",
                    progressClassName: "custom-progress-bar",
                }
            );
        } catch (err) {
            console.error("등록 실패", err);
            toast.error("등록에 실패했습니다.");
        }
    };

    const handleDelete = async (type) => {
        try {
            await deleteMySchool(userId, type);
            toast(
                `${
                    type === "school" ? "학교별" : "지역별"
                } 나의 학교 삭제 완료`,
                {
                    icon: "💜",
                    className: "my-toast",
                    progressClassName: "custom-progress-bar",
                }
            );
            fetchData();
        } catch (err) {
            console.error("삭제 실패", err);
            toast.error("삭제에 실패했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            {/* <div className={styles.header}>
                <Header />
            </div> */}
            <div className={styles.content}>
                {/* <div className={styles.title}>나의 학교 관리</div> */}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>분류</th>
                            <th>학교/지역명</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>학교별 나의 학교</td>
                            <td>{school || "등록된 정보 없음"}</td>
                            <td>
                                {!school ? (
                                    <button
                                        className={styles.addBtn}
                                        onClick={() =>
                                            openSearchModal("school")
                                        }>
                                        등록하기
                                    </button>
                                ) : (
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete("school")}>
                                        삭제하기
                                    </button>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>지역별 나의 학교</td>
                            <td>{region || "등록된 정보 없음"}</td>
                            <td>
                                {!region ? (
                                    <button
                                        className={styles.addBtn}
                                        onClick={() =>
                                            openSearchModal("region")
                                        }>
                                        등록하기
                                    </button>
                                ) : (
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete("region")}>
                                        삭제하기
                                    </button>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {modalOpen && (
                <MySchoolModal
                    type={modalType}
                    onClose={closeModal}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
};

export default MySchoolManagement;
