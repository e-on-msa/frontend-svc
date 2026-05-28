// src/components/Challenge/ChallengeFilterButton.jsx

import { useState } from "react";
import { FaFilter } from "react-icons/fa6";
import ChallengeFilterModal from "./ChallengeFilterModal";

const ChallengeFilterButton = ({ onApply,interestList, visionList }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          border: "1.5px solid #e5e7eb",
          background: "#fff",
          borderRadius: "8px",
          padding: "8px 20px",
          color: "#64748b",
          fontWeight: "bold",
          fontSize: "15px",
          cursor: "pointer"
        }}
      >
        <FaFilter /> 필터
      </button>

      {open && (
        <ChallengeFilterModal
          onClose={() => setOpen(false)}
          onApply={(filters) => {
            onApply(filters);
            setOpen(false);
          }}
          interestList={interestList}
          visionList={visionList}
        />
      )}
    </>
  );
};

export default ChallengeFilterButton;
