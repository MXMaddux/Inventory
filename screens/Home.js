import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { GlobalStyles } from "../constants/styles";
import AllProducts from "./AllProducts";
import { ProductsContext } from "../store/inventory-context";
import { fetchProducts } from "../util/http";
import { useIsFocused } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const productsCtx = useContext(ProductsContext);
  const [products, setProducts] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const updateProducts = async () => {
      try {
        // Fetch the updated products from the context or API
        const updatedProducts = await fetchProducts();

        // Update the products in the context
        productsCtx.setProducts(updatedProducts);
        setProducts(updatedProducts);
      } catch (error) {
        console.error("There was an error fetching products:", error);
      }
    };

    // Call the updateProducts function to initially fetch and update the products
    updateProducts();
  }, []);

  useEffect(() => {
    // Add a listener to refresh the products when the screen is focused
    const refreshProducts = navigation.addListener("focus", () => {
      const updatedProducts = productsCtx.products;
      setProducts(updatedProducts);
    });

    // Clean up the listener when the component unmounts
    return refreshProducts;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.orderContainer}>
        <Text style={styles.orderText}>Order Products In Orange</Text>
      </View>
      <AllProducts products={products} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary700,
  },
  orderContainer: {
    backgroundColor: "#ffffff",
    flexDirection: "column",
    padding: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  orderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.colors.orange500
  }
});