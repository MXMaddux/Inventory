import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";

const ProductsSummary = ({ products, company, title, code, idealAmount, amountToOrder, stockAmount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.period}>{title}</Text>
      <Text style={styles.period}>{company}</Text>
      <Text style={styles.period}>{code}</Text>
      <Text style={styles.period}>{stockAmount}</Text>
      <Text style={styles.period}>{idealAmount}</Text>
      <Text style={styles.period}>{amountToOrder}</Text>
    </View>
  );
};

export default ProductsSummary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary700,
    width: "100%"
  },
  period: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 8
  }
});
