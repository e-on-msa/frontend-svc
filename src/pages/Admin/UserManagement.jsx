import { useEffect, useState } from "react";
import { getAllUserState, updateUserState } from "../../api/adminApi";
// import Header from "../../components/Common/Header";
import styles from "../../styles/Admin/UserManagement.module.css";
import { toast } from "react-toastify";

const UserManagement = () => {
    const [userList, setUserList] = useState([]);
    const [updatedStates, setUpdatedStates] = useState({});

    const fetchAllUsers = async () => {
        try {
            const response = await getAllUserState();
            setUserList(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("게시판 개설 신청 목록 조회 실패", err);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const stateCodeMap = {
        active: "활성화",
        inactive: "비활성화",
        deleted: "삭제됨",
        banned: "사용 정지",
        default: "알 수 없음",
    };

    const handleChange = (userId, newState) => {
        setUpdatedStates((prev) => ({
            ...prev,
            [userId]: newState,
        }));
    };

    const handleStateUpdate = async (userId) => {
        const newState = updatedStates[userId];
        if (!newState) return; // 상태 변경

        // 서버 전송
        try {
            await updateUserState(userId, newState);
            toast(`사용자 상태를 업데이트했습니다.`, {
                icon: "💜",
                className: "my-toast",
                progressClassName: "custom-progress-bar",
            });
            setUserList((prev) =>
                prev.map((user) =>
                    user.user_id === userId
                        ? { ...user, state_code: newState }
                        : user
                )
            );
        } catch (err) {
            console.error("사용자 상태 업데이트 실패", err);
            toast.error("사용자 상태 업데이트에 실패했습니다.", {
                className: "my-toast",
                progressClassName: "custom-progress-bar",
            });
        }
    };

    return (
        <div className={styles.container}>
            {/* <Header /> */}
            <h3 className={styles.title}>사용자 목록</h3>

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div>사용자명</div>
                    <div>나이</div>
                    <div>타입</div>
                    <div>이메일</div>
                    <div>상태</div>
                </div>
                {userList.map((req) => (
                    <div key={req.user_id} className={styles.tableRow}>
                        <div>{req.name}</div>
                        <div>{req.age}</div>
                        <div>{req.type}</div>
                        <div>{req.email}</div>
                        {/* <div>{stateCodeMap[req.state_code]}</div> */}
                        <div>
                            {req.type === "admin" ? (
                                ""
                            ) : req.state_code === "deleted" ? (
                                <div className={styles.deleted}>
                                    {stateCodeMap[req.state_code]}
                                </div>
                            ) : (
                                <div>
                                    <select
                                        clsasName={styles.select}
                                        value={
                                            updatedStates[req.user_id] ||
                                            req.state_code
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                req.user_id,
                                                e.target.value
                                            )
                                        }>
                                        {Object.entries(stateCodeMap)
                                            .filter(
                                                ([code]) => code !== "default"
                                            ) // default 제거
                                            .map(([code, label]) => (
                                                <option key={code} value={code}>
                                                    {label}
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        className={styles.selectBtn}
                                        onClick={() =>
                                            handleStateUpdate(req.user_id)
                                        }>
                                        변경
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;
