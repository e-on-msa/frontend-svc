// src/pages/MyPage/InterestPage.jsx
import { useState, useEffect } from 'react';
import api from '../../api/api';

export default function InterestPage() {
  const [categories, setCategories] = useState([]);
  const [lists, setLists]           = useState({}); // { categoryCode: [items] }
  const [selected, setSelected]     = useState([]);
  const [msg, setMsg]               = useState({ type:'', text:'' });

  // 1) 카테고리 + 내 선택 불러오기
  useEffect(() => {
    api.get('/api/interests/categories').then(r => setCategories(r.data.categories));
    api.get('/api/interests/my').then(r => r.data.success && setSelected(r.data.my));
  }, []);

  // 2) 특정 카테고리 열 때 관심사 로딩
  const loadList = code => {
    if (lists[code]) return;
    api.get(`/api/interests/list/${code}`)
      .then(r => setLists(prev => ({ ...prev, [code]: r.data.interests })));
  };

  // 3) 체크박스 토글
  const toggle = id => {
    setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  };

  // 4) 저장
  const save = () => {
    if (selected.length === 0) {
      setMsg({ type:'error', text:'최소 하나 이상 선택하세요.' });
      return;
    }
    api.post('/api/interests/my', { interests: selected })
      .then(r => setMsg({ type:'success', text:r.data.message }))
      .catch(e => setMsg({ type:'error', text:e.response?.data?.message }));
  };

  return (
    <div>
      <h3>관심 분야 설정</h3>
      {msg.text && (
        <p style={{ color: msg.type==='error'?'red':'green' }}>{msg.text}</p>
      )}
      {categories.map(cat => (
        <div key={cat.category_code} style={{ marginBottom: 20 }}>
          <h4 onClick={()=>loadList(cat.category_code)} style={{ cursor:'pointer' }}>
            {cat.category_name} ⯈
          </h4>
          <div>
            {lists[cat.category_code]?.map(item => (
              <label key={item.interest_id} style={{ marginRight: 10 }}>
                <input
                  type="checkbox"
                  checked={selected.includes(item.interest_id)}
                  onChange={()=>toggle(item.interest_id)}
                />
                {item.interest_detail}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={save}>저장</button>
    </div>
  );
}
