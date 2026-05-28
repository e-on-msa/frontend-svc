// src/pages/MyPage/ChooseInterest.jsx
import { useState, useEffect } from "react";
import styles from "../../styles/Pages/ChooseInterestVision.module.css";
import {
    getInterestCategories,
    getInterestsByCategory,
} from "../../api/preference";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const ChooseInterest = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategoryCode, setSelectedCategoryCode] = useState(null);
    const [categoryInterests, setCategoryInterests] = useState({}); // { catCode: [interests] }
    const [selectedInterests, setSelectedInterests] = useState({}); // { catCode: [interest_detail] }

    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    // 카테고리 가져오기
    useEffect(() => {
        getInterestCategories().then(setCategories);
    }, []);

    // 선택한 카테고리의 관심사 불러오기 (캐시 없을 때만)
    useEffect(() => {
        const fetchInterests = async () => {
            if (
                selectedCategoryCode &&
                !categoryInterests[selectedCategoryCode]
            ) {
                const result = await getInterestsByCategory(
                    selectedCategoryCode
                );
                setCategoryInterests((prev) => ({
                    ...prev,
                    [selectedCategoryCode]: result,
                }));
            }
        };
        fetchInterests();
    }, [selectedCategoryCode, categoryInterests]);

    // 이전 선택 복원
    // useEffect(() => {
    //     const bootstrap = async () => {
    //         try {
    //             const cats = await getInterestCategories();
    //             setCategories(cats);

    //             const { data } = await axiosInstance.get(
    //                 "/api/interests/myInterests"
    //             );
    //             const grouped = data.my.reduce((acc, cur) => {
    //                 (acc[cur.category_code] ??= []).push(cur.interest_detail);
    //                 return acc;
    //             }, {});
    //             setSelectedInterests(grouped);

    //             const prevCodes = Object.keys(grouped);

    //             // 선택된 카테고리의 목록 캐시 전부 로드
    //             const entries = await Promise.all(
    //                 prevCodes.map(async (c) => [
    //                     c,
    //                     await getInterestsByCategory(c),
    //                 ])
    //             );
    //             setCategoryInterests(Object.fromEntries(entries));

    //             // 마지막에 categoryCode 세팅
    //             // 카테고리, 기존 선택, 상세 캐시까지 다 로드한 뒤에
    //             if (prevCodes.length) {
    //                 setSelectedCategoryCode(prevCodes[0]);
    //             } else if (cats.length) {
    //                 setSelectedCategoryCode(cats[0].category_code);
    //             }
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     };
    //     bootstrap();
    // }, []);

    // useEffect(() => {
    //     console.log("selectedCategoryCode 변경됨:", selectedCategoryCode);
    // }, [selectedCategoryCode]);

    const toggleInterest = (categoryCode, interestDetail) => {
        setSelectedInterests((prev) => {
            const current = prev[categoryCode] || [];
            const updated = current.includes(interestDetail)
                ? current.filter((item) => item !== interestDetail)
                : [...current, interestDetail];

            return {
                ...prev,
                [categoryCode]: updated,
            };
        });
    };

    const handleNext = async () => {
        const flatDetails = Object.values(selectedInterests).flat();
        if (flatDetails.length === 0) {
            alert("관심 분야를 최소 1개 이상 선택해주세요.");
            return;
        }

        // 모든 캐시를 평탄화해서 detail -> id 인덱스 생성
        const allItems = Object.values(categoryInterests).flat();
        const detailToId = new Map(
            allItems.map((i) => [i.interest_detail, i.interest_id])
        );

        const interestIds = flatDetails
            .map((detail) => detailToId.get(detail))
            .filter(Boolean);

        try {
            await axiosInstance.post("/api/preferences/interests", {
                userId,
                interestIds,
            });
            navigate("/mypage/preferences-visions");
        } catch (err) {
            console.error("❌ 관심사 저장 실패", err);
            alert("관심사 저장 중 오류가 발생했습니다.");
        }
    };

    // const deleteAllSelect = async () => {
    //     setCategoryInterests({});
    // };

    return (
        <div className={styles.container}>
            {/* <div className={styles.headerSection}>
                <h2>관심 분야 선택</h2>
                <button onClick={deleteAllSelect}>선택 초기화</button>
            </div> */}
            <h2>관심 분야 선택</h2>
            <div className={styles.selectorRow}>
                <div className={styles.column}>
                    {categories.map((cat) => (
                        <button
                            key={cat.category_code}
                            className={`${styles.categoryBtn} ${
                                cat.category_code === selectedCategoryCode
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() =>
                                setSelectedCategoryCode(cat.category_code)
                            }>
                            {cat.category_name}
                        </button>
                    ))}
                </div>

                <div className={styles.column}>
                    {categoryInterests[selectedCategoryCode]?.map(
                        (interest) => (
                            <button
                                key={interest.interest_detail}
                                className={`${styles.detailBtn} ${
                                    selectedInterests[
                                        selectedCategoryCode
                                    ]?.includes(interest.interest_detail)
                                        ? styles.selected
                                        : ""
                                }`}
                                onClick={() =>
                                    toggleInterest(
                                        selectedCategoryCode,
                                        interest.interest_detail
                                    )
                                }>
                                {interest.interest_detail}
                            </button>
                        )
                    )}
                </div>
            </div>

            <button className={styles.submitBtn} onClick={handleNext}>
                선택 완료
            </button>
        </div>
    );
};

export default ChooseInterest;
