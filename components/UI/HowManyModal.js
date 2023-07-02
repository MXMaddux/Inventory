import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { Picker } from "@react-native-picker/picker";
import Button from "./Button";
import { useNavigation } from "@react-navigation/native";

const HowManyModal = ({ onQuantitySelected }) => {
  const [selectedValue, setSelectedValue] = useState("1");
  const navigation = useNavigation();

  const handleQuantitySelection = () => {
    const quantity = parseInt(selectedValue, 10);
    onQuantitySelected(quantity);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>How Many?</Text>
      <View style={styles.button}>
        <Button children="Select" onPress={handleQuantitySelection} />
      </View>
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={setSelectedValue}
        itemStyle={{
          backgroundColor: GlobalStyles.colors.primary100,
          color: GlobalStyles.colors.primary700,
          fontSize: 18,
          borderRadius: 4,
        }}
      >
        <Picker.Item label="1" value="1" />
        <Picker.Item label="2" value="2" />
        <Picker.Item label="3" value="3" />
        <Picker.Item label="4" value="4" />
        <Picker.Item label="5" value="5" />
        <Picker.Item label="6" value="6" />
        <Picker.Item label="7" value="7" />
        <Picker.Item label="8" value="8" />
        <Picker.Item label="9" value="9" />
        <Picker.Item label="10" value="10" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary200,
  },
  text: {
    fontSize: 20,
    margin: 8,
    marginBottom: 16,
    color: GlobalStyles.colors.primary700
  },
  picker: {
    width: 100,
    height: 50,
    marginBottom: 20,
    marginTop: 8,
  },
  button: {
    width: 100,
    marginBottom: 10,
  },
});

export default HowManyModal;
