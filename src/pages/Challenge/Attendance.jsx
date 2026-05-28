// Attendance.jsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import Header from "../../components/Common/Header";
import AttendanceList from "../../components/Attendance/AttendanceList";

const Attendance = () => {
  const { challengeId } = useParams();
  // 오늘 날짜를 기본값으로
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  if (!challengeId) return null;

  return (
    <div>
      <Header />

      {/* 날짜 선택 UI */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ fontSize: 16, padding: "6px 12px" }}
        />
      </div>

      <div
        style={{
          maxWidth: 920,
          margin: "0 auto 40px",
          padding: 38,
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 8px #eee",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 32, fontSize: 28 }}>
          출석 ( {selectedDate} )
        </h2>

        {/* ★ Date와 challengeId를 모두 넘겨야 함 */}
        <AttendanceList challengeId={challengeId} date={selectedDate} />
      </div>
    </div>
  );
};

export default Attendance;
