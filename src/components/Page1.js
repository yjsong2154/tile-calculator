import React, { useState } from 'react';

const Page1 = ({ onConfirm, initialMargin }) => {
  const [margin, setMargin] = useState(initialMargin || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (margin === '' || isNaN(margin)) {
      alert('올바른 숫자를 입력해주세요.');
      return;
    }
    onConfirm(margin);
  };

  return (
    <div className="page-container page1-container">
      <div className="glass-panel">
        <h1 className="title">작업 기준 설정</h1>
        <p className="subtitle">최소 마진(기준값)을 입력해주세요.</p>
        <form onSubmit={handleSubmit} className="margin-form">
          <input
            type="number"
            className="big-input"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            placeholder="예: 10"
            autoFocus
          />
          <button type="submit" className="primary-btn">확인</button>
        </form>
      </div>
    </div>
  );
};

export default Page1;

