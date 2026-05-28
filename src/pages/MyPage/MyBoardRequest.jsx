import { useEffect, useState } from "react";
import { getMyBoardRequests } from "../../api/myPageApi";
import styles from "../../styles/MyPage/MyBoardRequest.module.css";

const MyBoardRequest = () => {
    const [myRequest, setMyRequest] = useState([]);

    const fetchMyBoardRequest = async () => {
        try {
            const response = await getMyBoardRequests();
            console.log("response.data:", response.data);
            setMyRequest(response.data);
        } catch (error) {
            console.error("게시판 개설 신청 목록 조회 실패", error);
        }
    };

    useEffect(() => {
        fetchMyBoardRequest();
    }, []);

    return (
        <div className={styles.container}>
            {/* <h2 className={styles.title}>게시판 개설 신청 목록</h2> */}

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div>게시판 이름</div>
                    <div>타입</div>
                    <div>대상</div>
                    <div>신청 사유</div>
                    <div>신청 일자</div>
                    <div>승인/거절</div>
                </div>

                {myRequest.length === 0 ? (
                    <div className={styles.empty}>신청된 게시판이 없습니다.</div>
                ) : (
                    myRequest.map((req) => (
                        <div key={req.request_id} className={styles.tableRow}>
                            <div>{req.requested_board_name}</div>
                            <div>{req.requested_board_type}</div>
                            <div>{req.board_audience}</div>
                            <div className={styles.reason}>{req.request_reason}</div>
                            <div>{new Date(req.request_date).toLocaleDateString()}</div>
                            <div className={styles.request_status}>{req.request_status}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyBoardRequest;
