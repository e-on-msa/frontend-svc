import ChallengeCreateForm from "../../components/Challenge/ChallengeCreateForm";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Common/Header";
import axios from "axios";
import { updateChallenge } from "../../api/challengeApi";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/Challenge/ChallengeEdit.module.css";

const ChallengeEdit = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/challenges/${id}`).then(res => setChallenge(res.data));
  }, [id]);

  const handleUpdate = async (formData, file) => {
    try {
      const req = {
        title: formData.title,
        description: formData.content,
        minimum_age: formData.minAge,
        maximum_age: formData.maxAge,
        maximum_people: Number(formData.maximum_people),
        application_deadline: formData.deadline
          ? formData.deadline + "T23:59:59"
          : null,
        start_date: formData.startDate
          ? formData.startDate + "T07:00:00"
          : null,
        end_date: formData.endDate
          ? formData.endDate + "T07:30:00"
          : null,
        is_recuming: formData.isRegular === "정기",
        repeat_type:
          formData.isRegular === "정기"
            ? (formData.repeatCycle === "주 1회"
                ? "WEEKLY"
                : formData.repeatCycle === "격주"
                ? "BIWEEKLY"
                : formData.repeatCycle === "월 1회"
                ? "MONTHLY"
                : "NONE")
            : "NONE",
        intermediate_participation: formData.allowJoinMid === "허용",
        days: formData.days.map(day => {
          switch (day) {
            case "월": return "Monday";
            case "화": return "Tuesday";
            case "수": return "Wednesday";
            case "목": return "Thursday";
            case "금": return "Friday";
            case "토": return "Saturday";
            case "일": return "Sunday";
            default: return day;
          }
        }),
        interestIds: formData.interestIds,
        visionIds: formData.visionIds,
        creator_contact: formData.phone,
      };

      await updateChallenge(id, req);
      alert("수정 완료!");
      navigate(`/challenge/${id}`);
    } catch (err) {
      alert(err?.response?.data?.message || "수정 실패");
    }
  };

  if (!challenge) return <div>로딩중...</div>;
  console.log("initialData:", challenge);

  return (
    <div>
      <div className={styles.header}>
        <Header />
      </div>
      <h2 className={styles.title}>챌린지 수정</h2>
      <ChallengeCreateForm
        mode="edit"
        initialData={challenge}
        user_id={user.user_id}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default ChallengeEdit;
