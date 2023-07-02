import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { GlobalStyles } from "../constants/styles";
import { ProductsContext } from "../store/inventory-context";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { updateProduct } from "../util/http";
import axios from "axios";
import HowManyModal from "../components/UI/HowManyModal";
import { API_KEY } from "@env";


const SubtractOneFromStockAmount = ({ onScanComplete }) => {
  const productsCtx = useContext(ProductsContext);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [scannedData, setScannedData] = useState(null); // Store scanned data
  const [showModal, setShowModal] = useState(false); // Show/Hide modal

  const handleBarCodeScanned = async (data) => {
    setShowLoadingOverlay(true);

    if (onScanComplete) {
      onScanComplete();
    }

    if (!isDataFetched) {
      setIsDataFetched(true);

      try {
        const result = await fetchData(data);
        

        if (result && result.title) {
          // Find the product to update in the context
          const productToUpdate = productsCtx.products.find(
            (product) => product.code === parseInt(data.data, 10)
          );
          

          if (productToUpdate) {
            setScannedData(data); // Store scanned data
            setShowModal(true);
          }
        } else {
          console.error("Invalid product data");
        }
      } catch (error) {
        console.error("There has been a problem with fetching the data: ", error);
      }

      setIsDataFetched(false);
      setShowLoadingOverlay(false);
    }
  };

  const fetchData = async (barcodeData) => {
    const barcodeNumber = parseInt(barcodeData.data, 10);
    const options = {
      method: "GET",
      url: "https://barcodes-lookup.p.rapidapi.com/",
      params: {
        query: barcodeNumber,
      },
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "barcodes-lookup.p.rapidapi.com",
      },
    };
  
    try {
      const response = await axios.request(options);
      const result = response.data.product;
      // console.log(result)
      // console.log(result.title)
  
      if (result && result.title) {
        return result;
      } else {
        throw new Error("Invalid API response: Missing product title");
      }
    } catch (error) {
      console.error("There has been a problem with fetching the data: ", error);
      return null; // Return null instead of throwing an error
    }
  };
  

  const handleQuantitySelected = async (quantity) => {
    setShowModal(false);
  
    if (scannedData) {
      const barcodeNumber = parseInt(scannedData.data, 10);
      const productToUpdate = productsCtx.products.find(
        (product) => product.code === barcodeNumber
      );
  
      if (productToUpdate) {
        const updatedStockAmount = productToUpdate.stockAmount - quantity;
        const updatedProduct = {
          ...productToUpdate,
          stockAmount: updatedStockAmount < 0 ? 0 : updatedStockAmount,
        };
  
        try {
          await updateProduct(productToUpdate.id, updatedProduct);
          productsCtx.updateProduct(updatedProduct);
        } catch (error) {
          console.error("There has been a problem with updating the product: ", error);
        }
      }
    }
  };
  
  

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Camera permission not granted");
      }
    })();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={styles.barcodebox}
        />
      </View>

      {showLoadingOverlay && <LoadingOverlay />}

      {showModal && scannedData && (
        <HowManyModal
          onQuantitySelected={handleQuantitySelected}
          scannedData={scannedData}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default SubtractOneFromStockAmount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
    alignItems: "center",
    justifyContent: "center",
  },
  barcodebox: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: GlobalStyles.colors.primary500,
  },
});