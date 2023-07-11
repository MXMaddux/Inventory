import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import ProductsList from "./ProductsList";
import ProductsSummary from "./ProductsSummary";

const ProductsOutput = ({ products, fallbackText }) => {
  let content = null;

  if (products.length > 0) {
    content = (
      <>
        <ProductsSummary products={products} />
        <ProductsList products={products} />
      </>
    );
  } else {
    content = (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>{fallbackText}</Text>
      </View>
    );
  }

  return <View style={styles.container}>{content}</View>;
};

export default ProductsOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary700,
    width: "100%",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#ffffff",
  },
});
