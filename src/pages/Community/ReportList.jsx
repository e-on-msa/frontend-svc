/* pages/Admin/ReportList.jsx */
import { useEffect, useState } from "react";
import {
  getAllReports           // 신고 목록
} from "../../api/communityApi";
import {
  banUser, unbanUser, extendBan   // 정지/해제 API
} from "../../api/adminApi";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/Community/ReportList.module.css";
import { toast } from "react-toastify";

/* ────────────────── 정지 관리 모달 ────────────────── */
function BanModal({ targetUserId, onClose, refetch }) {
  const [mode,   setMode]   = useState("ban");   // ban | extend | unban
  const [hours,  setHours]  = useState(72);

  const submit = async () => {
    try {
      if (mode === "ban")        await banUser   ({ user_id: targetUserId, duration_hours: hours });
      else if (mode === "extend")await extendBan (targetUserId, hours);
      else                       await unbanUser (targetUserId);

      toast("처리 완료", { icon: "💜" });
      refetch();
      onClose();
    } catch {
      toast("처리 실패", { icon: "⚠️" });
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>정지 관리 (ID: {targetUserId})</h3>

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

        <div className={styles.btnRow}>
          <button onClick={submit}>확인</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── 신고 목록 ────────────────── */
const ReportList = () => {
  const { isLoggedIn, user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banTarget, setBanTarget] = useState(null);

  /* ----- 데이터 가져오기 ----- */
  const fetchReports = async () => {
    try {
      const res = await getAllReports();   // /boards/admin/report
      setReports(res.data);
    } catch (err) {
      console.error("신고 목록 조회 실패:", err);
      toast("목록 불러오기 실패", { icon: "⚠️" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchReports(); }, []);

  if (!isLoggedIn || user?.type !== "admin") {
    return <p className={styles.warn}>관리자 전용 페이지입니다.</p>;
  }

  /* 베이스 URL (이미지는 사용하지 않지만 링크 경로용) */
  const POST_PATH = "/community/posts";

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🚨 신고된 콘텐츠 목록</h2>

      {loading ? (
        <p>로딩 중...</p>
      ) : reports.length === 0 ? (
        <p>신고된 항목이 없습니다.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>타입</th><th>대상 ID</th>
              <th>신고자</th><th>사유</th><th>신고일시</th>
              <th>미리보기</th><th>원문</th>
              <th>정지만료</th><th>조치</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => {
              const isPost     = r.report_type === "post";
              const targetId   = isPost ? r.post_id : r.comment_id;

              /* ---- 미리보기 ---- */
              const preview = isPost
                ? r.Post?.content?.slice(0, 50)     || "(본문 없음)"
                : r.Comment?.content?.slice(0, 50)  || "(댓글 없음)";

              /* ---- 원문 링크 ---- */
              const parentPostId =
              isPost ? targetId : r.Comment?.post_id ?? r.post_id;

              const link = `${POST_PATH}/${parentPostId}${!isPost ? `?comment=${targetId}` : ""}`;

              /* ---- 신고자 정지 만료 ---- */
              const bannedUntil = r.User?.banned_until
                ? new Date(r.User.banned_until).toLocaleString()
                : "—";

              return (
                <tr key={r.report_id}>
                  <td>{r.report_id}</td>
                  <td>{isPost ? "게시글" : "댓글"}</td>
                  <td>{targetId}</td>
                  <td>{r.reporter_id}</td>
                  <td>{r.reason}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>

                  <td className={styles.preview}>{preview}</td>
                  <td>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkBtn}
                    >
                      보기
                    </a>
                  </td>

                  <td>{bannedUntil}</td>
                  <td>
                    <button
                      onClick={() => setBanTarget(r.reporter_id)}
                      className={styles.actionBtn}
                    >
                      {r.User?.banned_until ? "수정" : "정지"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ---- 정지/해제 모달 ---- */}
      {banTarget && (
        <BanModal
          targetUserId={banTarget}
          onClose={() => setBanTarget(null)}
          refetch={fetchReports}
        />
      )}
    </div>
  );
};

export default ReportList;
