import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/UI/Button";
import Input from "../components/ManageInventory/Input";
import { addNewProduct, fetchProducts } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { ProductsContext } from "../store/inventory-context";
import { ScannerContext, useScanner } from "../store/ScannerContext";
import { AuthContext } from "../store/auth-context";
import { GlobalStyles } from "../constants/styles";

const AddProduct = ({ onSubmit, defaultValues, route, navigation}) => {
  const {info : scannedInfo} = route.params;
  const productsCtx = useContext(ProductsContext);
  const authCtx = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [company, setCompany] = useState("");
  const [size, setSize] = useState("");
  const [stockAmount, setStockAmount] = useState("");
  const [idealAmount, setIdealAmount] = useState("");
  const [inputs, setInputs] = useState({
    stockAmount: {
      value: defaultValues ? defaultValues.stockAmount.toString() : "",
      isValid: true,
    },
    idealAmount: {
      value: defaultValues ? defaultValues.idealAmount.toString() : "",
      isValid: true,
    },
    title: {
      value: defaultValues ? defaultValues.title : "",
      isValid: true,
    },
    code: {
      value: defaultValues ? defaultValues.code.toString() : "",
      isValid: true,
    },
    company: {
      value: defaultValues ? defaultValues.company : "",
      isValid: true,
    },
    size: {
      value: defaultValues ? defaultValues.size.toString() : "",
      isValid: true,
    },
  });

  const [loading, setLoading] = useState(true);

  

  
  useEffect(() => {
    if (scannedInfo && Object.keys(scannedInfo).length > 0) {
      if (scannedInfo.title) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          title: { value: scannedInfo.title, isValid: true },
        }));
        setTitle(scannedInfo.title);
      }
  
      if (scannedInfo.code) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          code: { value: scannedInfo.code.toString(), isValid: true },
        }));
        setCode(scannedInfo.code.toString());
      }
  
      if (scannedInfo.company) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          company: { value: scannedInfo.company, isValid: true },
        }));
        setCompany(scannedInfo.company);
      }
  
      if (scannedInfo.size) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          size: { value: scannedInfo.size.toString(), isValid: true },
        }));
        setSize(scannedInfo.size.toString());
      }
  
      setInputs((prevInputs) => ({
        ...prevInputs,
        stockAmount: { value: "", isValid: true },
        idealAmount: { value: "", isValid: true },
      }));
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

  }, [scannedInfo]);

  
  function handleCancel() {
    navigation.navigate("Home");
  }

  function inputChangedHandler(inputIdentifier, inputValue) {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [inputIdentifier]: { value: inputValue, isValid: true },
    }));

    switch (inputIdentifier) {
      case "stockAmount":
        setStockAmount(inputValue);
        break;
      case "idealAmount":
        setIdealAmount(inputValue);
        break;
      case "title":
        setTitle(inputValue);
        break;
      case "code":
        setCode(inputValue);
        break;
      case "company":
        setCompany(inputValue);
        break;
      case "size":
        setSize(inputValue);
        break;
      default:
        break;
    }
  }

  async function handleSubmit() {
    const userID = await AsyncStorage.getItem('userID');
    console.log("🚀 ~ file: AddProduct.js:141 ~ handleSubmit ~ userID:", userID);
    const productData = {
      title,
      code,
      company,
      size,
      stockAmount: parseInt(stockAmount),
      idealAmount: parseInt(idealAmount),
      userID,
    };

    if (
      productData.title === "" ||
      productData.code === "" ||
      productData.company === "" ||
      productData.size === "" ||
      isNaN(productData.stockAmount) ||
      isNaN(productData.idealAmount)
    ) {
      Alert.alert("Invalid Input", "Please check the input fields.", [
        { text: "Okay", style: "destructive" },
      ]);
      return;
    }

    try {
      setLoading(true);

      // Check if the barcode number is already assigned to another product
      const products = await fetchProducts();
      // console.log(products);
      const existingProduct = products.find(
        (product) => product.code === productData.code
      );
      if (existingProduct) {
        Alert.alert(
          "Barcode already assigned",
          "That barcode number is already assigned to another product.",
          [{ text: "Okay", style: "destructive" }]
        );
        setLoading(false);
        navigation.navigate("Home");
        return;
      }

      await addNewProduct(productData);
      setLoading(false);
      productsCtx.refreshProducts();
      onSubmit();
      navigation.navigate("Home");
      Alert.alert("Success", "Product added successfully.", [
        { text: "Okay", style: "destructive" },
      ]);
    } catch (error) {
      setLoading(false);
      navigation.navigate("Home");
    }
  }

  if (loading) {
    return <LoadingOverlay />;
  }

  const formIsInvalid =
    !inputs.stockAmount.isValid ||
    !inputs.idealAmount.isValid ||
    !inputs.title.isValid ||
    !inputs.code.isValid ||
    !inputs.company.isValid ||
    !inputs.size.isValid;


  return (
    <>
      <ScrollView style={styles.container}>
        {loading ? (
          <LoadingOverlay />
        ) : (
          <View style={styles.container}>
            {/* Rest of the code */}
            <View style={styles.form}>
              {/* Input components */}
              <View>
                <Input
                  label="Name Of Product"
                  invalid={!inputs.title.isValid}
                  textInputConfig={{
                    onChangeText: (text) => inputChangedHandler("title", text),
                    value: inputs.title.value,
                    multiline: true,
                    maxHeight: 30
                  }}
                />
              </View>
              <View style={styles.inputsRow}>
                <Input
                  style={styles.rowInput}
                  label="Stock Amount"
                  invalid={!inputs.stockAmount.isValid}
                  textInputConfig={{
                    keyboardType: "decimal-pad",
                    onChangeText: (text) =>
                      inputChangedHandler("stockAmount", text),
                    value: inputs.stockAmount.value,
                  }}
                />
                <Input
                  style={styles.rowInput}
                  label="Ideal Amount"
                  invalid={!inputs.idealAmount.isValid}
                  textInputConfig={{
                    keyboardType: "decimal-pad",
                    onChangeText: (text) =>
                      inputChangedHandler("idealAmount", text),
                    value: inputs.idealAmount.value,
                  }}
                />
              </View>
              <View style={styles.inputsRow}>
                <Input
                  style={styles.rowInput}
                  label="Company"
                  invalid={!inputs.company.isValid}
                  textInputConfig={{
                    onChangeText: (text) =>
                      inputChangedHandler("company", text),
                    value: inputs.company.value,
                  }}
                />
                <Input
                  style={styles.rowInput}
                  label="Barcode"
                  invalid={!inputs.code.isValid}
                  textInputConfig={{
                    keyboardType: "decimal-pad",
                    onChangeText: (text) => inputChangedHandler("code", text),
                    value: inputs.code.value,
                  }}
                />
              </View>
            </View>
            <View style={styles.inputsRow}>
              <Input
                style={styles.rowInput}
                label="Size oz/ml"
                invalid={!inputs.size.isValid}
                textInputConfig={{
                  keyboardType: "decimal-pad",
                  onChangeText: (text) => inputChangedHandler("size", text),
                  value: inputs.size.value,
                }}
              />
            </View>
          </View>
        )}
        {formIsInvalid && (
          <Text style={styles.errorText}>
            Invalid input values - please check your entered data!
          </Text>
        )}
        <View style={styles.buttons}>
          <Button style={styles.button} mode="flat" onPress={handleCancel}>
            Cancel
          </Button>
          <Button style={styles.button} onPress={handleSubmit}>
            Submit
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.orange500,
    margin: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  button: {
    minWidth: 100,
    marginHorizontal: 8,
  },
  scanner: {
    marginTop: "40%",
  },
});
