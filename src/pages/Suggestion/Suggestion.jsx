import React, { useState } from 'react';
import TimeRecommendation from './TimeRecommendation';

const Suggestion = () => {
  const [tab, setTab] = useState('time'); // 기본값을 'time'으로 설정

  return (
    <div>
      {/* 탭 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <button onClick={() => setTab('activity')}>활동 기반</button>
        <button onClick={() => setTab('time')} style={{ marginLeft: '1rem' }}>
          시기별
        </button>
      </div>

      {/* 탭에 따라 컴포넌트 렌더링 */}
      {tab === 'time' ? (
        <TimeRecommendation /> // ✅ 기본으로 보이도록 설정됨
      ) : (
        <p>활동 기반 추천은 추후 구현 예정입니다.</p>
      )}
    </div>
  );
};

export default Suggestion;
