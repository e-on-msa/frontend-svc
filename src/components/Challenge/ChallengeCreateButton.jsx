import { useNavigate } from "react-router-dom";
import ChallengeCreate from "../../pages/Challenge/ChallengeCreate";

const ChallengeCreateButton = ({ onClick }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={ onClick }
      style={{
        border: "1.5px solid #e5e7eb",
        background: "#fff",
        borderRadius: "8px",
        padding: "8px 22px",
        color: "#a1a1aa",
        fontWeight: "bold",
        fontSize: "15px",
        cursor: "pointer"
      }}
    >
      개설 신청
    </button>
  );
};

export default ChallengeCreateButton;
