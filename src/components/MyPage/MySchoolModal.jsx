// components/Modals/MySchoolModal.jsx
import { useState } from "react";
import styles from "../../styles/MyPage/MySchoolModal.module.css";
import { searchRegionByName } from "../../api/regionApi";
import { searchSchoolsByName } from "../../api/schoolApi";
import { toast } from "react-toastify";

const MySchoolModal = ({ type, onClose, onConfirm }) => {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);
    const [afterSearch, setAfterSearch] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSearchClick = async () => {
        if (!keyword.trim()) return;

        try {
            if (type === "school") {
                const res = await searchSchoolsByName(keyword);
                setResults(res?.data || []);
                // console.log(res?.data);
            } else {
                const res = await searchRegionByName(keyword);
                setResults(res?.data.data.regions || []);
                console.log(res?.data.data.regions);
            }
            setAfterSearch(true);
        } catch (error) {
            console.error("검색 실패", error);
        }
    };

    const handleSelect = (item) => {
        const isSame =
            type === "school"
                ? selectedItem?.schoolCode === item.schoolCode
                : selectedItem?.region_id === item.region_id;

        setSelectedItem(isSame ? null : item);
    };

    const handleSubmit = () => {
        if (selectedItem) {
            const code =
                type === "school"
                    ? selectedItem.schoolCode
                    : selectedItem.region_id;
            onConfirm(type, code);
        } else {
            toast.error(
                `${type === "school" ? "학교를" : "지역을"} 선택해야 합니다.`
            );
        }
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContainer}>
                <h2>{type === "school" ? "학교 검색" : "지역 검색"}</h2>

                <div className={styles.searchRow}>
                    <input
                        type="text"
                        placeholder={
                            type === "school"
                                ? "학교명은 띄어쓰기 없이 작성해주세요."
                                : "예: 서울특별시 강남구"
                        }
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className={styles.input}
                    />
                    <button
                        onClick={handleSearchClick}
                        className={styles.searchBtn}>
                        검색
                    </button>
                </div>

                {/* 결과 테이블 */}
                <div className={styles.resultTableContainer}>
                    <table className={styles.resultTable}>
                        {type === "school" ? (
                            <colgroup>
                                <col style={{ width: "40%" }} />
                                <col style={{ width: "60%" }} />
                            </colgroup>
                        ) : (
                            <colgroup>
                                <col style={{ width: "30%" }} />
                                <col style={{ width: "70%" }} />
                            </colgroup>
                        )}
                        <thead>
                            {type === "school" ? (
                                <tr>
                                    <th>이름</th>
                                    <th>주소지</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th>번호</th>
                                    <th>지역명</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {!afterSearch ? (
                                // 검색 전에는 아무것도 표시하지 않음
                                <tr>
                                    <td
                                        className={styles.placeHolder}
                                        colSpan={2}>
                                        검색어를 입력하여 검색을 진행해주세요.
                                    </td>
                                </tr>
                            ) : results.length === 0 ? (
                                // 검색 후 결과 없음
                                <tr>
                                    <td
                                        colSpan={2}
                                        style={{
                                            textAlign: "center",
                                            padding: "1rem",
                                        }}>
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                // 결과 있음
                                results.map((item) => {
                                    const isSelected =
                                        type === "school"
                                            ? selectedItem?.schoolCode ===
                                              item.schoolCode
                                            : selectedItem?.region_id ===
                                              item.region_id;

                                    return (
                                        <tr
                                            key={
                                                item.schoolCode ||
                                                item.region_id
                                            }
                                            onClick={() => handleSelect(item)}
                                            className={
                                                isSelected
                                                    ? styles.selectedRow
                                                    : ""
                                            }>
                                            <td>
                                                {item.name || item.region_id}
                                            </td>
                                            <td>
                                                {item.address ||
                                                    item.region_name}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className={styles.actions}>
                    <button className={styles.confirmBtn1} onClick={onClose}>
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        // disabled={!selectedItem}
                        className={styles.confirmBtn2}>
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MySchoolModal;
