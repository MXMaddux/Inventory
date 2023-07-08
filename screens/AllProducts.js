import React, { useContext, useEffect, useState } from 'react';
import { ProductsContext } from '../store/inventory-context';
import { fetchProducts } from '../util/http';
import ProductsOutput from '../components/InventoryOutput/ProductsOutput';
import Button from '../components/UI/Button';

const AllProducts = () => {
  const productsCtx = useContext(ProductsContext);
  const [products, setProducts] = useState(productsCtx.products);
  // console.log("🚀 ~ file: AllProducts.js:9 ~ AllProducts ~ productsCtx:", productsCtx);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const products = await fetchProducts();
        productsCtx.setProducts(products);
        setProducts(products);
        // console.log("Here are the products from AllProducts.js: ", products)
      } catch (error) {
        console.error('There was an error retrieving products:', error);
      }
    };

    getProducts();
  }, []);

  return (
    <>
    <ProductsOutput
      products={products}
      // title="Order products in orange"
      fallbackText="No items found. Add some products."
    />
    </>
  );
};

export default AllProducts;
