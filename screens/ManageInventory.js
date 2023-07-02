import React, { useContext, useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { ProductsContext } from "../store/inventory-context";
import ProductForm from "../components/ManageInventory/ProductForm";
import { storeProduct, updateProduct, deleteProduct } from "../util/http";



function ManageInventory({ route, navigation }) {
  const productsCtx = useContext(ProductsContext);

  const editedProductId = route.params?.productId;
  const isEditing = !!editedProductId;

  const selectedProduct = productsCtx.products.find(
    (product) => product.id === editedProductId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Product" : "Add Product",
    });
  }, [navigation, isEditing]);

  async function deleteProductHandler() {
    productsCtx.deleteProduct(editedProductId);
    await deleteProduct(editedProductId)
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  const confirmHandler = async (productData) => {
    if (isEditing) {
      productsCtx.updateProduct(editedProductId, productData);
      await updateProduct(editedProductId, productData);
    } else {
      const id = await storeProduct(productData);
      productsCtx.addProduct({ productData, id: id });
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ProductForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={selectedProduct}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteProductHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageInventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
