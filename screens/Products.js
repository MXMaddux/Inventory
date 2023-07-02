import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Scanner from "../components/ManageInventory/Scanner";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";



const Products = () => {
  // const [isScanning, setIsScanning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const navigation = useNavigation();

  const handleScanButtonPress = () => {
    // setIsScanning(!isScanning);
    navigation.navigate('ScannerScreen', { screen: 'ScannerScreen' });
  };

  const handleCancelButtonPress = () => {
    // setIsScanning(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* {isScanning && <Scanner />} */}
      <View style={styles.buttonContainer}>
        <Button
          style={isVisible ? styles.button : styles.buttonPressed}
          onPress={handleCancelButtonPress}
        >
          Cancel
        </Button>
        <Button
          style={isVisible ? styles.button : styles.buttonPressed}
          onPress={handleScanButtonPress}
        >
        <Text>Scan</Text>
          
        </Button>
      </View>
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary800,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: 16,
    alignItems: "center",
  },
  button: {
    width: "30%",
    marginBottom: 64,
    marginTop: "10%",
    marginHorizontal: 8,
  },
  buttonPressed: {
    opacity: 0,
    height: 0,
  },
});
