import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import styles from "../../styles/MyPage/PreferencesAndVisions.module.css";
const PreferencesAndVisions = () => {
    const [data, setData] = useState({ interest: [], vision: [] });
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const visionRes = await axiosInstance.get(
                    "/api/visions/myVisions"
                );
                const interestRes = await axiosInstance.get(
                    "/api/interests/myInterests"
                );

                setData({
                    vision: visionRes.data.my,
                    interest: interestRes.data.my, // 예: ["AI", "디자인", ...]
                });
            } catch (err) {
                setError("조회 중 오류가 발생했습니다.");
                console.error(err);
            }
        };

        fetchData();
    }, []);

    if (error) return <p className={styles.error}>{error}</p>;
    if (!data) return <p>불러오는 중...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.section1}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.title}>나의 관심 분야</h2>
                    <button
                        className={styles.btn}
                        onClick={() => navigate("/mypage/choose-interests")}>
                        수정하기
                    </button>
                </div>
                {data.interest && data.interest.length > 0 ? (
                    <ul className={styles.tagList}>
                        {data.interest.map((item, idx) => (
                            <li key={idx} className={styles.tag}>
                                {item.interest_detail}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className={styles.textContainer}>
                        <div className={styles.text}>
                            선택한 관심 분야가 없습니다.
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.section2}>
                <div className={styles.sectionHeader}>
                    <h2 className={`${styles.title} ${styles.secondTitle}`}>
                        나의 진로 희망
                    </h2>
                    <button
                        className={`${styles.btn} ${styles.secondBtn}`}
                        onClick={() => navigate("/mypage/choose-visions")}>
                        수정하기
                    </button>
                </div>
                {data.vision && data.vision.length > 0 ? (
                    <ul className={styles.tagList}>
                        {data.vision.map((item, idx) => (
                            <li key={idx} className={styles.tag}>
                                {item.vision_detail}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className={styles.textContainer}>
                        <div className={styles.text}>
                            선택한 진로 희망이 없습니다.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreferencesAndVisions;
