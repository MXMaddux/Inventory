import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { GlobalStyles } from "../constants/styles";
import { ProductsContext } from "../store/inventory-context";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { updateProduct } from "../util/http";
import axios from "axios";
import HowManyModal from "../components/UI/HowManyModal";
import { API_KEY } from "@env";

const AddOneToStockAmount = ({ onScanComplete }) => {
  const productsCtx = useContext(ProductsContext);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [scannedData, setScannedData] = useState(null); // Store scanned data
  const [showModal, setShowModal] = useState(false); // Show/Hide modal

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Camera permission not granted");
      }
    })();
  }, []);

  const handleBarCodeScanned = async (data) => {
    if (showModal || showLoadingOverlay) {
      return;
    }

    setShowLoadingOverlay(true);

    if (onScanComplete) {
      onScanComplete();
    }

    try {
      const barcodeNumber = data.data.toString().replace(/^0+/, ""); // Remove leading zeroes
      const result = await fetchData(barcodeNumber);

      console.log("Result from AddOne line 42 AddOne: ", result);
      if (result && result.title) {
        const productToUpdate = productsCtx.products.find(
          (product) => product.code === parseInt(barcodeNumber, 10)
        );
        console.log("Product to update: ", productToUpdate);
        
        if (productToUpdate) {
          setScannedData(data);
          setShowModal(true); // Show the modal
        }
      } else {
        console.error("Invalid product data");
      }
    } catch (error) {
      console.error("There has been a problem with fetching the data: ", error);
    }
    setShowLoadingOverlay(false);
  };

  const fetchData = async (barcodeData) => {
    console.log("Barcode Number is ", barcodeData);
    const options = {
      method: "GET",
      url: "https://barcodes-lookup.p.rapidapi.com/",
      params: {
        query: barcodeData,
      },
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "barcodes-lookup.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const result = response.data.product;

      if (result && result.title) {
        return result;
      } else {
        console.error("Invalid API response: Missing product title");
        return null;
      }
    } catch (error) {
      console.error("There has been a problem with fetching the data: ", error);
      return null;
    }
  };

  const handleQuantitySelected = async (quantity) => {
    setShowModal(true);

    if (scannedData) {
      const barcodeNumber = parseInt(scannedData.data, 10);
      const productToUpdate = productsCtx.products.find(
        (product) => product.code === barcodeNumber
      );

      if (productToUpdate) {
        const updatedStockAmount = productToUpdate.stockAmount + quantity;
        const updatedProduct = {
          ...productToUpdate,
          stockAmount:
            updatedStockAmount > productToUpdate.idealAmount
              ? productToUpdate.idealAmount
              : updatedStockAmount,
        };

        try {
          await updateProduct(productToUpdate.id, updatedProduct);
          productsCtx.updateProduct(productToUpdate.id, updatedProduct);
        } catch (error) {
          console.error(
            "There has been a problem with updating the product: ",
            error
          );
        }
      }
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

      {showLoadingOverlay && <LoadingOverlay />}

      {showModal && scannedData && (
        <HowManyModal
          onQuantitySelected={handleQuantitySelected}
          scannedData={scannedData}
          setShowModal={setShowModal}
        />
      )}
      {!showModal && scannedData && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Scanned Product Code: {scannedData.data.toString()}
          </Text>
        </View>
      )}
    </>
  );
};

export default AddOneToStockAmount;

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
