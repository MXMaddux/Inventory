import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { GlobalStyles } from "../../constants/styles";
import { ScannerContext } from "../../store/ScannerContext";
import LoadingOverlay from "../UI/LoadingOverlay";
import axios from "axios";

const Scanner = ({ onScanComplete }) => {
  const { updateScannedInfo } = useContext(ScannerContext);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [size, setSize] = useState("");
  const [code, setCode] = useState(null);
  // const [hasFetchedData, setHasFetchedData] = useState(false); // Flag variable

  const handleBarCodeScanned = (e) => {
    setShowLoadingOverlay(true);

    const scannedData = e;
    const barcodeNumber = scannedData.data;

    if (onScanComplete) {
      onScanComplete();
    }

    if (!isDataFetched) {
      setIsDataFetched(true); // Set the flag to true to prevent multiple requests

      fetchData(barcodeNumber)
        .then((result) => {
          const { title, manufacturer } = result;
          // console.log(title);
          setTitle(title);
          setCompany(manufacturer);
          setCode(barcodeNumber);

          const updatedInfo = {
            title,
            code: barcodeNumber,
            company: manufacturer,
          };

          updateScannedInfo(updatedInfo);
          
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
          onBarCodeScanned={handleBarCodeScanned}
          style={styles.barcodebox}
        />
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
    backgroundColor: GlobalStyles.colors.primary800,
    marginBottom: 8,
  },
  errorText: {
    color: GlobalStyles.colors.error500,
    margin: 10,
  },
});
