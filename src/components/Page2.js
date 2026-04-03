import React, { useState, useEffect } from 'react';

const Page2 = ({ minMargin, onBack }) => {
  const [reference, setReference] = useState('');
  const [topForward, setTopForward] = useState(['', '', '', '']);
  const [topReverse, setTopReverse] = useState(['', '', '', '']);
  const [bottomForward, setBottomForward] = useState(['', '', '', '']);
  const [bottomReverse, setBottomReverse] = useState(['', '', '', '']);
  
  // 기준선 색상을 결정하기 위한 상태
  const [allPassed, setAllPassed] = useState(false);
  
  // +/- 누적 값 상태
  const [adjustmentCounter, setAdjustmentCounter] = useState(0);

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

  // 일괄 수치 변경 (위쪽 -, 아래쪽 +) - 요구사항에 맞춰 반전
  const handlePlusButton = (val) => {
    const applyDelta = (arr, delta) => arr.map(item => item === '' ? '' : String(Number(item) + delta));
    setTopForward(prev => applyDelta(prev, -val));
    setTopReverse(prev => applyDelta(prev, -val));
    setBottomForward(prev => applyDelta(prev, val));
    setBottomReverse(prev => applyDelta(prev, val));
    setAdjustmentCounter(prev => prev + val);
  };

  // 일괄 수치 변경 (위쪽 +, 아래쪽 -) - 요구사항에 맞춰 반전
  const handleMinusButton = (val) => {
    const applyDelta = (arr, delta) => arr.map(item => item === '' ? '' : String(Number(item) + delta));
    setTopForward(prev => applyDelta(prev, val));
    setTopReverse(prev => applyDelta(prev, val));
    setBottomForward(prev => applyDelta(prev, -val));
    setBottomReverse(prev => applyDelta(prev, -val));
    setAdjustmentCounter(prev => prev - val);
  };

  // 나머지 계산 (Reverse인 경우 배수와의 차이 계산)
  const getRemainder = (val, isReverse) => {
    if (val === '' || reference === '' || isNaN(val) || isNaN(reference) || Number(reference) === 0) return null;
    const numVal = Number(val);
    const refVal = Number(reference);
    
    let result;
    if (isReverse) {
      const rem = numVal % refVal;
      result = rem === 0 ? 0 : refVal - rem;
    } else {
      result = numVal % refVal;
    }
    
    // 부동소수점 오차 보정을 위해 소수점 4자리에서 반올림
    return parseFloat(result.toFixed(4));
  };

  // 색상 판별 클래스 (나머지가 minMargin보다 '크면' success, '작거나 같으면' error)
  // minMargin 비교 확인 필요: 현재는 ">" 사용
  const getStatusClass = (remainder) => {
    if (remainder === null) return '';
    return remainder > minMargin ? 'status-success' : 'status-error';
  };

  // 전체 색상 동기화 (모든 유효 입력칸의 기준 충족 여부 확인)
  useEffect(() => {
    const arraysWithConfig = [
      { arr: topForward, isReverse: false },
      { arr: topReverse, isReverse: true },
      { arr: bottomForward, isReverse: false },
      { arr: bottomReverse, isReverse: true }
    ];
    let hasValidInput = false;
    let hasError = false;

    for (let { arr, isReverse } of arraysWithConfig) {
      for (let val of arr) {
        if (val !== '') {
          hasValidInput = true;
          const remainder = getRemainder(val, isReverse);
          if (remainder !== null && remainder <= minMargin) {
            hasError = true;
            break;
          }
        }
      }
      if (hasError) break;
    }

    if (hasValidInput && !hasError && reference !== '' && Number(reference) !== 0) {
      setAllPassed(true);
    } else {
      setAllPassed(false);
    }
  }, [topForward, topReverse, bottomForward, bottomReverse, reference, minMargin]);
  

  const renderInputRow = (arr, setter, title, isReverse) => {
    // 4개씩 분할해서 렌더링
    const rows = [];
    for (let i = 0; i < arr.length; i += 4) {
      const chunk = arr.slice(i, i + 4);
      rows.push(
        <div className="input-row" key={`${title}-row-${i}`}>
          {chunk.map((val, idx) => {
            const actualIndex = i + idx;
            const remainder = getRemainder(val, isReverse);
            const statusClass = getStatusClass(remainder);
            
            return (
              <div className="input-cell" key={`${title}-${actualIndex}`}>
                <input 
                  type="number" 
                  step="any"
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
        {renderInputRow(topForward, setTopForward, '거실쪽', false)}
        {renderInputRow(topReverse, setTopReverse, 'Reverse', true)}
      </div>

      {/* 중앙 통제 영역 */}
      <div className={`central-control ${allPassed ? 'all-passed' : 'has-error'}`}>
        <div className="control-left">
          <span className="ref-label">기준</span>
          <input 
            type="number" 
            step="any"
            className="ref-input" 
            value={reference} 
            onChange={(e) => setReference(e.target.value)} 
          />
          {adjustmentCounter !== 0 && (
            <span className={`adjustment-counter ${allPassed ? 'status-success' : 'status-error'}`}>
              {adjustmentCounter > 0 ? `+${adjustmentCounter}` : adjustmentCounter}
            </span>
          )}
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
        {renderInputRow(bottomForward, setBottomForward, '주방쪽', false)}
        {renderInputRow(bottomReverse, setBottomReverse, 'Reverse', true)}
      </div>

    </div>
  );
};

export default Page2;

