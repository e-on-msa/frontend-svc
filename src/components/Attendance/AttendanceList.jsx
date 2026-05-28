// AttendanceList.jsx

import { useEffect, useState } from "react";
import AttendanceItem from "./AttendanceItem";
import {
  getChallengeAttendances,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} from "../../api/challengeApi";

const AttendanceList = ({ challengeId, date }) => {
  const [rows, setRows] = useState([]);     // 참여자 + 그날 출석 상태
  const [loading, setLoading] = useState(true);

  // ─── 날짜별/챌린지별 조회 ───
  useEffect(() => {
    // challengeId 또는 date가 없으면 조회 X
    if (!challengeId || !date) return;

    const fetchRows = async () => {
      setLoading(true);
      try {
        // date 파라미터를 꼭 넘겨야, 백엔드에서 해당 날짜 출석만 LEFT JOIN으로 가져옵니다
        const res = await getChallengeAttendances(challengeId, date);
        setRows(
          res.data.map((p) => ({
            participationId: p.participating_id,
            userId: p.participant.user_id,
            name: p.participant.name,
            attendanceId: p.attendances[0]?.attendance_id ?? null,
            status: p.attendances[0]?.attendance_state ?? "",
            reason: p.attendances[0]?.memo ?? "",
          }))
        );
      } catch (err) {
        setRows([]); // 에러남 → 빈 배열
      }
      setLoading(false);
    };

    fetchRows();
  }, [challengeId, date]); // ← date 변경 시에도 재실행

  // ─── 상태/사유 토글 헬퍼 ───
  const patchRow = (id, updater) =>
    setRows((prev) =>
      prev.map((r) => (r.participationId === id ? { ...r, ...updater(r) } : r))
    );

  const toggleStatus = (id, newStatus) =>
    patchRow(id, (r) => ({
      status: r.status === newStatus ? "" : newStatus,
      reason: r.status === newStatus ? "" : r.reason,
    }));

  const changeReason = (id, reason) => patchRow(id, () => ({ reason }));

  // ─── 저장 로직: DELETE / PATCH / POST 분기 ───
  const handleSave = async () => {
    for (const r of rows) {
      if (r.attendanceId && r.status === "") {
        console.log("[DELETE 요청] attendanceId:", r.attendanceId);
        await deleteAttendance(r.attendanceId);
        continue;
      }

      // 2) 수정: attendanceId가 있고, status가 비어있지 않으면 PATCH
      if (r.attendanceId) {
        console.log("[PATCH 요청] attendanceId:", r.attendanceId, "status:", r.status, "reason:", r.reason);
        await updateAttendance(r.attendanceId, {
          attendance_state: r.status,
          memo: r.reason,
        });
        continue;
      }

      // 3) 신규 추가: attendanceId가 없고, status가 비어있지 않으면 POST
      if (!r.attendanceId && r.status !== "") {
         console.log("[POST 요청] participationId:", r.participationId, "status:", r.status);
        await addAttendance(r.participationId, {
          attendance_date: date,
          attendance_state: r.status,
          memo: r.reason,
        });
      }
    }
    alert("저장 완료!");
    const res = await getChallengeAttendances(challengeId, date);
    setRows(
      res.data.map((p) => ({
        participationId: p.participating_id,
        userId: p.participant.user_id,
        name: p.participant.name,
        attendanceId: p.attendances[0]?.attendance_id ?? null,
        status: p.attendances[0]?.attendance_state ?? "",
        reason: p.attendances[0]?.memo ?? "",
      }))
    );
  };

  if (loading) return <div style={{ textAlign: "center" }}>로딩 중…</div>;

  return (
    <div>
      {rows.map((r, i) => (
        <AttendanceItem
          key={r.participationId}
          num={i + 1}
          name={r.name}
          date={date}                 
          status={r.status}
          reason={r.reason}
          onStatus={(s) => toggleStatus(r.participationId, s)}
          onReason={(memo) => changeReason(r.participationId, memo)}
          onDelete={() => toggleStatus(r.participationId, "")}
        />
      ))}

      <button
        style={{
          display: "block",
          margin: "36px auto 0",
          padding: "13px 38px",
          background: "#38bdf8",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: 17,
          cursor: "pointer",
        }}
        onClick={handleSave}
      >
        저장
      </button>
    </div>
  );
};

export default AttendanceList;
