import React, { createContext, useState } from "react";

export const ScannerContext = createContext();

export const ScannerProvider = ({ children }) => {
  const [scannedInfo, setScannedInfo] = useState(null);

  const updateScannedInfo = (info) => {
    setScannedInfo(info);
  };

  return (
    <ScannerContext.Provider value={{ scannedInfo, setScannedInfo, updateScannedInfo }}>
      {children}
    </ScannerContext.Provider>
  );
};


