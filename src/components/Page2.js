import React, { useState, useEffect } from 'react';

const Page2 = ({ minMargin, onBack }) => {
  const [reference, setReference] = useState('');
  const [topForward, setTopForward] = useState(['', '', '', '']);
  const [topReverse, setTopReverse] = useState(['', '', '', '']);
  const [bottomForward, setBottomForward] = useState(['', '', '', '']);
  const [bottomReverse, setBottomReverse] = useState(['', '', '', '']);
  
  // 기준선 색상을 결정하기 위한 상태
  const [allPassed, setAllPassed] = useState(false);

  // 배열 복사 유틸리티
  const copyArray = (arr) => [...arr];

  // 입력 핸들러
  const handleInputChange = (setter, index, value, arr) => {
    const newArr = copyArray(arr);
    newArr[index] = value;
    setter(newArr);
  };

  // 행 추가 핸들러 (4개씩 추가)
  const handleAddRow = (setter, arr) => {
    setter([...arr, '', '', '', '']);
  };

  // 일괄 수치 변경 (위쪽 +, 아래쪽 -)
  const handlePlusButton = (val) => {
    const applyDelta = (arr, delta) => arr.map(item => item === '' ? '' : String(Number(item) + delta));
    setTopForward(prev => applyDelta(prev, val));
    setTopReverse(prev => applyDelta(prev, val));
    setBottomForward(prev => applyDelta(prev, -val));
    setBottomReverse(prev => applyDelta(prev, -val));
  };

  // 일괄 수치 변경 (위쪽 -, 아래쪽 +)
  const handleMinusButton = (val) => {
    const applyDelta = (arr, delta) => arr.map(item => item === '' ? '' : String(Number(item) + delta));
    setTopForward(prev => applyDelta(prev, -val));
    setTopReverse(prev => applyDelta(prev, -val));
    setBottomForward(prev => applyDelta(prev, val));
    setBottomReverse(prev => applyDelta(prev, val));
  };

  // 나머지 계산
  const getRemainder = (val) => {
    if (val === '' || reference === '' || isNaN(val) || isNaN(reference) || Number(reference) === 0) return null;
    return Number(val) % Number(reference);
  };

  // 색상 판별 클래스 (나머지가 minMargin보다 '크면' success, '작거나 같으면' error)
  // minMargin 비교 확인 필요: 현재는 ">" 사용
  const getStatusClass = (remainder) => {
    if (remainder === null) return '';
    return remainder > minMargin ? 'status-success' : 'status-error';
  };

  // 전체 색상 동기화 (모든 유효 입력칸의 기준 충족 여부 확인)
  useEffect(() => {
    const allArrays = [...topForward, ...topReverse, ...bottomForward, ...bottomReverse];
    let hasValidInput = false;
    let hasError = false;

    for (let val of allArrays) {
      if (val !== '') {
        hasValidInput = true;
        const remainder = getRemainder(val);
        if (remainder !== null && remainder <= minMargin) {
          hasError = true;
          break;
        }
      }
    }

    if (hasValidInput && !hasError && reference !== '' && Number(reference) !== 0) {
      setAllPassed(true);
    } else {
      setAllPassed(false);
    }
  }, [topForward, topReverse, bottomForward, bottomReverse, reference, minMargin]);
  

  const renderInputRow = (arr, setter, title) => {
    // 4개씩 분할해서 렌더링
    const rows = [];
    for (let i = 0; i < arr.length; i += 4) {
      const chunk = arr.slice(i, i + 4);
      rows.push(
        <div className="input-row" key={`${title}-row-${i}`}>
          {chunk.map((val, idx) => {
            const actualIndex = i + idx;
            const remainder = getRemainder(val);
            const statusClass = getStatusClass(remainder);
            
            return (
              <div className="input-cell" key={`${title}-${actualIndex}`}>
                <input 
                  type="number" 
                  value={val} 
                  onChange={(e) => handleInputChange(setter, actualIndex, e.target.value, arr)}
                  placeholder=""
                />
                <div className={`remainder-display ${statusClass}`}>
                  {remainder !== null ? remainder : <span className="empty-line"></span>}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="section-group">
        <div className="section-header">
          <h3>{title}</h3>
        </div>
        <div className="rows-container">
          {rows}
          <div className="add-btn-container">
            <button className="icon-btn add-row-btn" onClick={() => handleAddRow(setter, arr)}>⊕</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container page2-container">
      <div className="header-nav">
        <button className="back-btn" onClick={onBack}>
          <span className="arrow">←</span> 뒤로 (기준: {minMargin})
        </button>
      </div>

      {/* 상단 그룹 */}
      <div className="group-wrapper top-group">
        {renderInputRow(topForward, setTopForward, '정방향')}
        {renderInputRow(topReverse, setTopReverse, 'Reverse')}
      </div>

      {/* 중앙 통제 영역 */}
      <div className={`central-control ${allPassed ? 'all-passed' : 'has-error'}`}>
        <div className="control-left">
          <span className="ref-label">기준</span>
          <input 
            type="number" 
            className="ref-input" 
            value={reference} 
            onChange={(e) => setReference(e.target.value)} 
          />
        </div>
        <div className="control-divider">
          <div className="divider-line"></div>
        </div>
        <div className="control-actions">
          <div className="action-row top-actions">
             <button onClick={() => handlePlusButton(1)}>⊕ 1</button>
             <button onClick={() => handlePlusButton(5)}>⊕ 5</button>
             <button onClick={() => handlePlusButton(10)}>⊕ 10</button>
          </div>
          <div className="action-row bottom-actions">
             <button onClick={() => handleMinusButton(1)}>⊖ 1</button>
             <button onClick={() => handleMinusButton(5)}>⊖ 5</button>
             <button onClick={() => handleMinusButton(10)}>⊖ 10</button>
          </div>
        </div>
      </div>

      {/* 하단 그룹 */}
      <div className="group-wrapper bottom-group">
        {renderInputRow(bottomForward, setBottomForward, '정방향')}
        {renderInputRow(bottomReverse, setBottomReverse, 'Reverse')}
      </div>

    </div>
  );
};

export default Page2;

