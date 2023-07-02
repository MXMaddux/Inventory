import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Input from "./Input";
import Button from "../UI/Button";
import { GlobalStyles } from "../../constants/styles";
import { useNavigation} from "@react-navigation/native";
import Scanner from "./Scanner";


function ProductForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(false)
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


  function scanHandler () {
setIsScanning(!isScanning)

  }

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function submitHandler() {
    const productData = {
      stockAmount: +inputs.stockAmount.value,
      idealAmount: +inputs.idealAmount.value,
      title: inputs.title.value,
      code: +inputs.code.value,
      company: inputs.company.value,
      size: +inputs.size.value
    };


    const stockAmountIsValid =
      !isNaN(productData.stockAmount) && productData.stockAmount > 0;
    const idealAmountIsValid =
      !isNaN(productData.idealAmount) && productData.idealAmount > 0;
    const codeIsValid = !isNaN(productData.code) && productData.code > 0;
    const titleIsValid = productData.title.trim().length > 0;
    const companyIsValid = productData.company.trim().length > 0;
    const sizeIsValid =
      !isNaN(productData.size) && productData.size > 0;


    if (!stockAmountIsValid || !idealAmountIsValid || !titleIsValid || !codeIsValid || !titleIsValid || !companyIsValid || !sizeIsValid) {
      setInputs((curInputs) => {
        return {
          stockAmount: { value: curInputs.stockAmount.value, isValid: stockAmountIsValid },
          idealAmount: { value: curInputs.idealAmount.value, isValid: idealAmountIsValid },
          title: {
            value: curInputs.title.value,
            isValid: titleIsValid,
          },
          code: { value: curInputs.code.value, isValid: codeIsValid },
          company: {
            value: curInputs.company.value,
            isValid: categoryIsValid,
          },
          size: { value: curInputs.size.value, isValid: sizeIsValid },
        };
      });
      return;
    }

    onSubmit(productData);
  }



  const formIsInvalid =
    !inputs.stockAmount.isValid ||
    !inputs.idealAmount.isValid ||
    !inputs.title.isValid ||
    !inputs.code.isValid ||
    !inputs.company.isValid ||
    !inputs.size.isValid;

  return (
    <View style={styles.form}>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label="Stock Amount"
          invalid={!inputs.stockAmount.isValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "stockAmount"),
            value: inputs.stockAmount.value.toString(),
          }}
        />
        <Input
          style={styles.rowInput}
          label="Ideal Amount"
          invalid={!inputs.idealAmount.isValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "idealAmount"),
            value: inputs.idealAmount.value,
          }}
        />
        <Input
          style={styles.rowInput}
          label="Company"
          invalid={!inputs.company.isValid}
          textInputConfig={{
            onChangeText: inputChangedHandler.bind(this, "company"),
            value: inputs.company.value,
          }}
        />
      </View>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label="Barcode"
          invalid={!inputs.code.isValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "code"),
            value: inputs.code.value,
          }}
        />
        <Input
          style={styles.rowInput}
          label="Size oz/ml"
          invalid={!inputs.size.isValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "size"),
            value: inputs.size.value,
          }}
        />
      </View>
      <View>
      <Input
        label="Title"
        invalid={!inputs.title.isValid}
        textInputConfig={{
          multiline: true,
          // autoCorrect: false // default is true
          onChangeText: inputChangedHandler.bind(this, "title"),
          value: inputs.title.value,
        }}
      />
      </View>
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid input values - please check your entered data!
        </Text>
      )}
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
      {isScanning && 
      <>
        <View style={styles.scanner}>
          <Scanner />
        </View>
      </>
      }
    </View>
  );
}

export default ProductForm;

const styles = StyleSheet.create({
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
  },
  button: {
    minWidth: 100,
    marginHorizontal: 8,
  },
  scanner: {
    marginTop: "40%"
  }
});
