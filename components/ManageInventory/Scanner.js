import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { GlobalStyles } from "../../constants/styles";
import { ScannerContext } from "../../store/ScannerContext";
import LoadingOverlay from "../UI/LoadingOverlay";
import axios from "axios";

const Scanner = ({ onScanComplete }) => {
  const { updateScannedInfo, setScannedInfo } = useContext(ScannerContext);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [size, setSize] = useState("");
  const [code, setCode] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setShowLoadingOverlay(true);
    setScanned(true);
    setShowLoadingOverlay(true);
    const barcodeNumber = data
    console.log("🚀 ~ file: Scanner.js:27 ~ handleBarCodeScanned ~ barcodeNumber:", barcodeNumber);
    if (!isDataFetched) {
      setIsDataFetched(true); // Set the flag to true to prevent multiple requests

      fetchData(barcodeNumber)
        .then((result) => {
          const { title, manufacturer } = result;
          console.log("🚀 ~ file: Scanner.js:54 ~ .then ~ title, manufacturer:", title, manufacturer);
          // console.log(title);
          setTitle(title);
          setCompany(manufacturer);
          setCode(barcodeNumber);

          const updatedInfo = {
            title,
            code: barcodeNumber,
            company: manufacturer,
          };
          // updateScannedInfo(updatedInfo);
          setScannedInfo(updatedInfo);
          if (onScanComplete) {
            onScanComplete(updatedInfo);
          }
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch info: " + error
          );
          // Handle the error and update the state or perform any necessary actions
        })
        .finally(() => {
          setShowLoadingOverlay(false);
        });
    }
  };

  const fetchData = async (barcodeNumber) => {
    const options = {
      method: "GET",
      url: "https://barcodes-lookup.p.rapidapi.com/",
      params: {
        query: barcodeNumber,
      },
      headers: {
        "X-RapidAPI-Key": "99b4872b10msh97f71b1a7879fd2p16b5c5jsnb18cf77f0664",
        "X-RapidAPI-Host": "barcodes-lookup.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const result = response.data.product;
      // console.log(result.title);
      if (result && result.title) {
        return result;
      } else {
        throw new Error("Invalid API response: Missing product title");
      }
    } catch (error) {
      // console.error("There has been a problem with your fetch info: " + error);
      throw error; // Throw the error to be caught by the promise chain
    }
  };

 

  return (
    <>
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.barcodebox}
        />
        {scanned && <Button title={'Getting Data...'} onPress={() => setScanned(false)} />}
      </View>
    </>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary800,
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  infoText: {
    color: "#ffffff",
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    // backgroundColor: 'white', //GlobalStyles.colors.primary800,
    marginBottom: 8,
  },
  errorText: {
    color: GlobalStyles.colors.error500,
    margin: 10,
  },
});