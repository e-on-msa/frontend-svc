import { useState } from "react";
import { banUser, unbanUser, extendBan } from "../../api/adminApi";
import styles from "./BanModal.module.css";      // 선택

export default function BanModal({ userId, onClose, refetch }) {
  const [mode, setMode] = useState("ban");       // ban | extend | unban
  const [hours, setHours] = useState(72);        // 기본 3일
  const [reason, setReason] = useState("");

  const submit = async () => {
    try {
      if (mode === "ban") {
        await banUser({ user_id: userId, duration_hours: hours, reason });
      } else if (mode === "extend") {
        await extendBan(userId, hours);
      } else {
        await unbanUser(userId);
      }
      refetch();      // 목록 다시 가져오기
      onClose();
    } catch (err) {
      console.error(err);
      alert("처리 실패");
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>이용 정지 설정</h3>

        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="ban">정지</option>
          <option value="extend">정지 연장</option>
          <option value="unban">정지 해제</option>
        </select>

        {mode !== "unban" && (
          <>
            <label>기간 (시간)</label>
            <input
              type="number"
              min="1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </>
        )}

        {mode === "ban" && (
          <>
            <label>사유</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </>
        )}

        <div className={styles.btnRow}>
          <button onClick={submit}>확인</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
