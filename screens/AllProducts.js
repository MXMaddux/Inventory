import React, { useState, useEffect } from 'react';
import { ProductsContext } from '../store/inventory-context';
import { fetchProducts } from '../util/http';
import ProductsOutput from '../components/InventoryOutput/ProductsOutput';
import ProductsList from '../components/InventoryOutput/ProductsList';
import ProductsSummary from '../components/InventoryOutput/ProductsSummary';


const AllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("There was an error retrieving products:", error);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    const updateProducts = async () => {
      try {
        const updatedProducts = await fetchProducts();
        setProducts(updatedProducts);
      } catch (error) {
        console.error("There was an error fetching products:", error);
      }
    };

    const interval = setInterval(() => {
      updateProducts();
    }, 5000); // Refresh products every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* <ProductsSummary products={products} /> */}
      <ProductsList products={products} />
    </>
  );
};

export default AllProducts;
