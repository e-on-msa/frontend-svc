import { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import styles from "../../styles/MyPage/PreferencesAndVisions.module.css"; // 스타일 재사용

export default function ActivityHistory() {
  const { user } = useAuth();

  // 필터 상태
  const [type, setType] = useState("challenge");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [keyword, setKeyword] = useState("");

  // 데이터/페이징
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // 로딩/에러
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get("/api/user/activity-history", {
        params: {
          type,
          from: from || undefined,
          to: to || undefined,
          keyword: keyword || undefined,
          page,
          limit,
        },
      });

      // 백엔드 응답 형식: { data: [], totalPages: N } 가정
      setData(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      setErr(e?.response?.data?.message || "활동 이력 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  // 페이지 바뀔 때마다 조회
  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [page]);

  // 필터 적용 → 1페이지부터 다시 조회
  const applyFilters = () => {
    setPage(1);
    fetchData();
  };

  if (!user) return <p>로딩 중...</p>;

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>활동 이력</h2>
      </div>

      {/* 필터 바 */}
      <div className={styles.sectionHeader} style={{ flexWrap: "wrap", gap: 8 }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="challenge">챌린지 참여</option>
          <option value="challengeCreated">챌린지 개설</option>
          <option value="post">게시글</option>
          <option value="comment">댓글</option>
          <option value="boardRequest">게시판 요청</option>
        </select>

        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <span>~</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />

        <input
          type="text"
          placeholder="검색어 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ minWidth: 180 }}
        />

        <button className={styles.btn} onClick={applyFilters}>
          조회하기
        </button>
      </div>

      {/* 상태 표시 */}
      {err && <div className={styles.error}>{err}</div>}
      {loading && <div className={styles.loading}>불러오는 중…</div>}

      {/* 리스트 */}
      {!loading && !err && (
        <>
          {data.length === 0 ? (
            <div className={styles.text} style={{ textAlign: "center", marginTop: 16 }}>
              해당 조건에 맞는 활동 이력이 없습니다.
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
              {data.map((item, i) => (
                <li key={i} style={{ marginBottom: "1rem", border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                  {/* 각 타입별 렌더링 */}
                  {type === "challenge" && (
                    <div>
                      <strong>{item.Challenge?.title}</strong> <br />
                      참여 상태: {item.participating_state} <br />
                      기간:{" "}
                      {item.Challenge?.start_date
                        ? new Date(item.Challenge.start_date).toLocaleDateString("ko-KR")
                        : "-"}{" "}
                      ~{" "}
                      {item.Challenge?.end_date
                        ? new Date(item.Challenge.end_date).toLocaleDateString("ko-KR")
                        : "-"}
                    </div>
                  )}

                  {type === "post" && (
                    <div>
                      <strong>{item.title}</strong>
                      <p style={{ margin: "6px 0 4px" }}>{item.content}</p>
                      <small>
                        {item.created_at ? new Date(item.created_at).toLocaleString("ko-KR") : ""}
                      </small>
                      <br />
                      💖 게시판: {item.Board?.board_name}
                    </div>
                  )}

                  {type === "comment" && (
                    <div>
                      <p style={{ margin: "6px 0 4px" }}>{item.content}</p>
                      <small>
                        {item.created_at ? new Date(item.created_at).toLocaleString("ko-KR") : ""}
                      </small>
                    </div>
                  )}

                  {type === "boardRequest" && (
                    <div>
                      <strong>{item.requested_board_name}</strong>
                      <br />
                      유형: {item.requested_board_type}, 상태: {item.request_status}
                      <br />
                      신청일:{" "}
                      {item.request_date ? new Date(item.request_date).toLocaleString("ko-KR") : ""}
                    </div>
                  )}

                  {type === "challengeCreated" && (
                    <div>
                      <h4 style={{ margin: "0 0 6px" }}>{item.challenge_title}</h4>
                      <p>상태: {item.challenge_state}</p>
                      <p>
                        기간:{" "}
                        {item.start_date ? new Date(item.start_date).toLocaleDateString("ko-KR") : "-"} ~{" "}
                        {item.end_date ? new Date(item.end_date).toLocaleDateString("ko-KR") : "-"}
                      </p>
                      <p>작성일: {item.created_at ? new Date(item.created_at).toLocaleString("ko-KR") : ""}</p>
                      <p>개설자: {item.creator?.nickname}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div style={{ marginTop: "1rem", display: "flex", gap: 6, justifyContent: "center" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={page === p}
                  style={{
                    marginRight: 4,
                    padding: "6px 10px",
                    borderRadius: 20,
                    border: "1px solid #ddd",
                    background: page === p ? "#f0f0f5" : "#fff",
                    fontWeight: page === p ? 700 : 400,
                    cursor: page === p ? "default" : "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
