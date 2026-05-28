// src/pages/Challenge/ChallengeCreate.jsx
import { createChallenge, uploadAttachment } from "../../api/challengeApi";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Common/Header";
import ChallengeCreateForm from "../../components/Challenge/ChallengeCreateForm";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import styles from "../../styles/Challenge/ChallengeCreate.module.css";

const ChallengeCreate = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const handleSubmit = async (formData, photoFile, consentFile) => {
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
                        ? (() => {
                              switch (formData.repeatCycle) {
                                  case "주 1회":
                                      return "WEEKLY";
                                  case "격주":
                                      return "BIWEEKLY";
                                  case "월 1회":
                                      return "MONTHLY";
                                  default:
                                      return "NONE";
                              }
                          })()
                        : "NONE",
                intermediate_participation: formData.allowJoinMid === "허용",
                days: formData.days.map((day) => {
                    switch (day) {
                        case "월":
                            return "Monday";
                        case "화":
                            return "Tuesday";
                        case "수":
                            return "Wednesday";
                        case "목":
                            return "Thursday";
                        case "금":
                            return "Friday";
                        case "토":
                            return "Saturday";
                        case "일":
                            return "Sunday";
                        default:
                            return day;
                    }
                }),
                interestIds: formData.interestIds,
                visionIds: formData.visionIds,
                creator_contact: formData.phone,
                user_id: user.user_id,
            };

            const res = await createChallenge(req);
            const challengeId = res.data.id;

            if (photoFile) {
                const photoFormData = new FormData();
                photoFormData.append("file", photoFile);
                photoFormData.append("type", "PHOTO");
                await uploadAttachment(challengeId, photoFormData);
            }

            if (consentFile) {
                const consentFormData = new FormData();
                consentFormData.append("file", consentFile);
                consentFormData.append("type", "CONSENT");
                await uploadAttachment(challengeId, consentFormData);
            }
            toast("챌린지 생성 완료!", {
                icon: "💜",
                className: "my-toast",
                progressClassName: "custom-progress-bar",
            });
            navigate("/challenge");
        } catch (err) {
            console.error("서버 에러 응답 전체:", err.response?.data);
            toast(
                err?.response?.data?.message || "챌린지 생성에 실패했습니다.",
                {
                    icon: "💜",
                    className: "my-toast",
                    progressClassName: "custom-progress-bar",
                }
            );
        }
    };

    if (loading || !user) return <div>로딩 중...</div>;

    return (
        <div>
            <div className={styles.header}>
                <Header />
            </div>

            <ChallengeCreateForm
                mode="create"
                onSubmit={handleSubmit}
                user_id={user.user_id}
            />
        </div>
    );
};

export default ChallengeCreate;
