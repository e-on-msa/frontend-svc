// src/components/Challenge/ChallengeSearchSection.jsx

import ChallengeSearchBar from "./ChallengeSearchBar";
import ChallengeFilterButton from "./ChallengeFilterButton";
import ChallengeCreateButton from "./ChallengeCreateButton";

const ChallengeSearchSection = ({
  search,
  setSearch,
  onSearch,
  onFilter,
  onClearFilters,  
  onCreate,
  interestList,
  visionList
}) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        margin: "10px 0"
      }}
    >
      <div style={{ width: "90%", minWidth: "440px", margin: "10px auto" }}>
        {/* 검색창 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <div style={{ flex: 1 }}>
            <ChallengeSearchBar
              search={search}
              setSearch={setSearch}
              onSearch={onSearch}
            />
          </div>
          {/* 필터 해제 버튼 */}
          <button
            onClick={onClearFilters}
            style={{
              background: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "14px",
              color: "#1f2937",
              cursor: "pointer"
            }}
          >
            필터 해제
          </button>
        </div>

        {/* 검색창 아래 버튼 2개 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "9px"
          }}
        >
          {/* 왼쪽: 필터 버튼 */}
          <div>
            <ChallengeFilterButton 
            onApply={onFilter} 
            interestList={interestList}
            visionList={visionList}
            />
          </div>
          {/* 오른쪽: 챌린지 생성 버튼 */}
          <div>
            <ChallengeCreateButton onClick={onCreate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSearchSection;
