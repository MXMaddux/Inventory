import React, { createContext, useState , useContext} from "react";

export const ScannerContext = createContext();
export const useScanner = () => useContext(ScannerContext);
export const ScannerProvider = ({ children }) => {
  const [scannedInfo, setScannedInfo] = useState({});
  const updateScannedInfo = (info) => {
    setScannedInfo(info);
  };

  return (
    <ScannerContext.Provider value={{ scannedInfo, setScannedInfo, updateScannedInfo }}>
      {children}
    </ScannerContext.Provider>
  );
};
