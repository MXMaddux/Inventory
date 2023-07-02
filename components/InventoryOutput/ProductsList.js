import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import ProductItem from './ProductItem'



const ProductsList = ({products}) => {
  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No products to display. Add Some!</Text>
      </View>
    );
  }
  const renderProductItem = (itemData) => {
    // console.log(itemData.item.id)
    if (!itemData.item.id) {
      return null; // or handle the case where the id is missing or null
    }
    return <ProductItem {...itemData.item}/>
    }
  return (
    <FlatList data={products} renderItem={renderProductItem} keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString() + new Date().toString() }/>
  )
}


export default ProductsList

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20
  }
})