import React, { useContext, useEffect } from 'react';
import { ProductsContext } from '../store/inventory-context';
import { fetchProducts } from '../util/http';
import ProductsOutput from '../components/InventoryOutput/ProductsOutput';
import Button from '../components/UI/Button';

const AllProducts = () => {
  const productsCtx = useContext(ProductsContext);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const products = await fetchProducts();
        productsCtx.setProducts(products);
      } catch (error) {
        console.error('There was an error retrieving products:', error);
      }
    };

    getProducts();
  }, []);

  return (
    <>
    <ProductsOutput
      products={productsCtx.products}
      // title="Order products in orange"
      fallbackText="No items found. Add some products."
    />
    </>
  );
};

export default AllProducts;