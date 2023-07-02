import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../../constants/styles";

const ProductItem = ({
  id,
  title,
  company,
  stockAmount,
  code,
  idealAmount,
  size,
  amountToOrder = idealAmount - stockAmount 
}) => {

  const navigation = useNavigation();

  const productPressHandler = () => {
    navigation.navigate("ManageInventory", {
      productId: id,
    });
  };

  return (
    <Pressable
      onPress={productPressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={amountToOrder <= 0 ? styles.productItem : styles.productItemOrder}>
        <View>
          <Text style={[styles.textBase, styles.title]}>
            {title}
          </Text>
          <Text style={amountToOrder === 0 ? styles.textBase : styles.textBaseOrder}>Company: {company}</Text>
          <Text style={amountToOrder === 0 ? styles.textBase : styles.textBaseOrder}>Barcode: {code}</Text>
          <Text style={amountToOrder === 0 ? styles.textBase : styles.textBaseOrder}>In Stock: {stockAmount}</Text>
          <Text style={amountToOrder === 0 ? styles.textBase : styles.textBaseOrder}>Ideal Stock: {idealAmount}</Text>
          <Text style={amountToOrder === 0 ? styles.textBase : styles.textBaseOrder}>Amount To Order: {amountToOrder}</Text>
          <Text style={amountToOrder === 0 ? styles.textBase : styles.textBaseOrder}>Size: {size} oz/ml</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  productItem: {
    padding: 12,
    marginVertical: 5,
    backgroundColor: GlobalStyles.colors.primary500,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    alignItems: "center"
  },
  productItemOrder: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.orange500,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  textBase: {
    color: GlobalStyles.colors.primary50,
  },
  textBaseOrder: {
    color: "#ffffff",
    fontWeight: "bold"
  },
  textBaseOrderDark: {
    color: GlobalStyles.colors.primary700,
    fontWeight: "bold"
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
  }
});
