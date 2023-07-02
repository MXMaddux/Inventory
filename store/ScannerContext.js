

import React, { createContext, useState } from 'react';

const ScannerContext = createContext();

const ScannerProvider = ({ children }) => {
  const [scannedInfo, setScannedInfo] = useState({});

  const updateScannedInfo = (data) => {
    setScannedInfo(data);
  };

  return (
    <ScannerContext.Provider value={{ scannedInfo, setScannedInfo, updateScannedInfo }}>
      {children}
    </ScannerContext.Provider>
  );
};

export { ScannerContext, ScannerProvider }
