// src/components/ChallengeRecommendPanelHistory.jsx *(임시로 만들어봄)
import React, { useMemo, useState } from 'react';
import { useChallengeRecommendHistory } from '../hooks/useChallengeRecommendHistory';

export default function ChallengeRecommendPanelHistory({
  challenges,
  apiBase,
  title = '프로필 맞춤 추천 (History)',
  placeholder = '하고 싶은 활동이나 관심사를 자유롭게 적어보세요…',
  defaultText = '',
  ctaText = 'AI 추천',
  onPick,
}) {
  const [userText, setUserText] = useState(defaultText);
  const { recommend, loading, error, recommendedIds, clear, runs, clearHistory } =
    useChallengeRecommendHistory({ apiBase });

  const idToChallenge = useMemo(() => {
    const m = new Map();
    (challenges || []).forEach(c => m.set(c.id, c));
    return m;
  }, [challenges]);

  const recommendedChallenges = useMemo(
    () => (recommendedIds || []).map(id => idToChallenge.get(id)).filter(Boolean),
    [recommendedIds, idToChallenge]
  );

  const listToShow =
    recommendedChallenges.length > 0 ? recommendedChallenges : (challenges || []).slice(0, 8);

  return (
    <section aria-labelledby="recommendation-title" className="recommendation-container">
      <div className="header">
        <h2 id="recommendation-title">{title}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {recommendedIds.length > 0 && (
            <button className="ghost" onClick={clear} aria-label="추천 초기화">초기화</button>
          )}
          {runs.length > 0 && (
            <button className="ghost" onClick={clearHistory} aria-label="히스토리 삭제">히스토리 삭제</button>
          )}
        </div>
      </div>

      <div className="control-row">
        <textarea
          value={userText}
          onChange={e => setUserText(e.target.value)}
          placeholder={placeholder}
          rows={3}
          aria-label="나의 관심사/설명"
        />
        <button
          className="primary"
          onClick={() => recommend(userText.trim(), challenges)}
          disabled={loading || !userText.trim() || (challenges || []).length === 0}
        >
          {loading ? '분석 중…' : ctaText}
        </button>
      </div>

      {error && <p role="alert" className="error">⚠️ {error}</p>}

      {/* 결과 카드 */}
      <div className="grid">
        {listToShow.map((c) => (
          <article key={c.id} className={`card ${recommendedIds.includes(c.id) ? 'highlight' : ''}`}>
            {c.thumbnailUrl && <img src={c.thumbnailUrl} alt="" loading="lazy" />}
            <div className="card-body">
              <h3 className="card-title">{c.title || `챌린지 #${c.id}`}</h3>
              <p className="card-desc">{c.text}</p>
              {Array.isArray(c.tags) && c.tags.length > 0 ? (
                <ul className="tag-row">
                  {c.tags.map(tag => <li key={tag} className="tag">{tag}</li>)}
                </ul>
              ) : null}
              <div className="card-actions">
                <button className="secondary" onClick={() => onPick && onPick(c.id)}>담기</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 히스토리 목록 */}
      <div className="history">
        <h3>실행 히스토리</h3>
        {runs.length === 0 ? (
          <p className="muted">아직 히스토리가 없어요.</p>
        ) : (
          <ul>
            {runs.map((r, idx) => (
              <li key={idx}>
                <div className="history-row">
                  <time>{new Date(r.ts).toLocaleString()}</time>
                  <div className="history-text">{r.userText}</div>
                  <div className="history-ids">IDs: {r.recommendedIds.join(', ') || '-'}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        .recommendation-container { display: grid; gap: 16px; }
        .header { display:flex; justify-content:space-between; align-items:center; }
        .control-row { display:grid; gap:8px; }
        textarea { width:100%; border:1px solid #ddd; border-radius:8px; padding:12px; font-size:14px; }
        button.primary { padding:10px 14px; border-radius:8px; border:0; cursor:pointer; }
        button.secondary, button.ghost { padding:8px 12px; border-radius:8px; border:1px solid #ddd; background:#fff; cursor:pointer; }
        .error { color:#b00020; }
        .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:12px; }
        .card { border:1px solid #eee; border-radius:12px; overflow:hidden; background:#fff; display:flex; flex-direction:column; }
        .card.highlight { outline:2px solid #6b8afd; }
        .card img { width:100%; height:132px; object-fit:cover; background:#f6f7f9; }
        .card-body { display:grid; gap:8px; padding:12px; }
        .card-title { font-size:16px; margin:0; }
        .card-desc { font-size:13px; color:#444; margin:0; }
        .tag-row { display:flex; flex-wrap:wrap; gap:6px; list-style:none; padding:0; margin:4px 0 0; }
        .tag { font-size:12px; border:1px solid #eee; border-radius:999px; padding:4px 8px; }
        .card-actions { display:flex; gap:8px; }
        .history { border-top: 1px dashed #eee; padding-top: 8px; }
        .history-row { display:grid; grid-template-columns: 160px 1fr auto; gap:8px; align-items:start; }
        .history-text { color:#333; }
        .history-ids { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:12px; color:#555; }
        .muted { color:#777; }
      `}</style>
    </section>
  );
}
