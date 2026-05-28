// src/components/Challenge/ChallengeFilterModal.jsx

import { useState } from "react";

const initialFilterState = {
  status: [],       // ['진행중','완료']
  date: "",         // YYYY-MM-DD
  minAge: "",
  maxAge: "",
  interestId: "",
  visionId: ""
};

const statusList = ["진행중", "완료"];

const ChallengeFilterModal = ({
  onClose,
  onApply,
  interestList = [],
  visionList   = []
}) => {
  const [filters, setFilters] = useState(initialFilterState);

  const toggleStatus = (value) =>
    filters.status.includes(value)
      ? filters.status.filter((v) => v !== value)
      : [...filters.status, value];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "32px 26px",
          minWidth: "340px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.13)"
        }}
      >
        <h2 style={{ marginBottom: "16px", fontWeight: "bold", fontSize: "18px" }}>
          필터 조건
        </h2>

        {/* 1) 상태 */}
        <div style={{ marginBottom: "14px" }}>
          <span style={{ fontWeight: "500" }}>상태</span>
          <div style={{ display: "flex", gap: "12px", marginTop: "7px" }}>
            {statusList.map((status) => (
              <label key={status} style={{ fontWeight: "400" }}>
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() =>
                    setFilters((f) => ({
                      ...f,
                      status: toggleStatus(status)
                    }))
                  }
                />{" "}
                {status}
              </label>
            ))}
          </div>
        </div>

        {/* 2) 날짜 */}
        <div style={{ marginBottom: "14px" }}>
          <span style={{ fontWeight: "500" }}>날짜</span>
          <div style={{ marginTop: "7px" }}>
            <input
              type="date"
              value={filters.date}
              onChange={(e) =>
                setFilters((f) => ({ ...f, date: e.target.value }))
              }
              style={{
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #e0e7ef"
              }}
            />
          </div>
        </div>

        {/* 3) 나이 */}
        <div style={{ marginBottom: "14px" }}>
          <span style={{ fontWeight: "500" }}>나이</span>
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              marginTop: "7px"
            }}
          >
            <input
              type="number"
              placeholder="최소"
              min={0}
              value={filters.minAge}
              onChange={(e) => setFilters((f) => ({ ...f, minAge: e.target.value }))}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #e0e7ef",
                width: "72px"
              }}
            />
            ~
            <input
              type="number"
              placeholder="최대"
              min={0}
              value={filters.maxAge}
              onChange={(e) => setFilters((f) => ({ ...f, maxAge: e.target.value }))}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #e0e7ef",
                width: "72px"
              }}
            />
          </div>
        </div>

        {/* 4) 관심사 */}
        <div style={{ marginBottom: "14px" }}>
          <span style={{ fontWeight: "500" }}>관심사</span>
          <div style={{ marginTop: "7px" }}>
            <select
              value={filters.interestId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, interestId: e.target.value }))
              }
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #e0e7ef",
                width: "100%"
              }}
            >
              <option value="">전체 관심사</option>
              {interestList.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5) 비전 */}
        <div style={{ marginBottom: "22px" }}>
          <span style={{ fontWeight: "500" }}>비전</span>
          <div style={{ marginTop: "7px" }}>
            <select
              value={filters.visionId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, visionId: e.target.value }))
              }
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #e0e7ef",
                width: "100%"
              }}
            >
              <option value="">전체 비전</option>
              {visionList.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 확인/취소 */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "7px 18px",
              borderRadius: "7px",
              border: "none",
              background: "#e5e7eb",
              color: "#6b7280",
              fontWeight: "bold",
              fontSize: "15px"
            }}
          >
            취소
          </button>
          <button
            onClick={() => onApply(filters)}
            style={{
              padding: "7px 18px",
              borderRadius: "7px",
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "15px"
            }}
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeFilterModal;
