import React, { useState } from 'react';
import './App.css';
import Page1 from './components/Page1';
import Page2 from './components/Page2';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [minMargin, setMinMargin] = useState('');

  const goToPage2 = (margin) => {
    setMinMargin(margin);
    setCurrentPage(2);
  };

  const goToPage1 = () => {
    setCurrentPage(1);
  };

  return (
    <div className="App">
      {currentPage === 1 && <Page1 onConfirm={goToPage2} initialMargin={minMargin} />}
      {currentPage === 2 && <Page2 minMargin={Number(minMargin)} onBack={goToPage1} />}
    </div>
  );
}

export default App;
