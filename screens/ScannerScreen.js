import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native"; // Import the Text component
import Scanner from "../components/ManageInventory/Scanner";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../constants/styles";
import { ScannerProvider } from "../store/ScannerContext";

const ScannerScreen = () => {
  const navigation = useNavigation();

  // Function to navigate to AddProduct screen
  const navigateToAddProduct = () => {
    navigation.navigate("Add Product");
  };

  return (
    <ScannerProvider>
      <View style={styles.container}>
        <Scanner onScanComplete={navigateToAddProduct} />
      </View>
    </ScannerProvider>
  );
};

export default ScannerScreen;



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: GlobalStyles.colors.primary800,
      alignItems: "center",
      justifyContent: "center",
    },
    maintext: {
      fontSize: 16,
      margin: 20
    },
    infoText: {
      color: "#ffffff"
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
      margin: 10
    }
  });