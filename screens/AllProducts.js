import React, { useContext, useEffect, useState } from 'react';
import { ProductsContext } from '../store/inventory-context';
import { fetchProducts } from '../util/http';
import ProductsOutput from '../components/InventoryOutput/ProductsOutput';
import Button from '../components/UI/Button';

const AllProducts = () => {
  const productsCtx = useContext(ProductsContext);
  const [products, setProducts] = useState(productsCtx.products);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        productsCtx.setProducts(fetchedProducts);
      } catch (error) {
        console.error('There was an error retrieving products:', error);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    setProducts(productsCtx.products);
  }, [productsCtx.products]);

  const handleUpdateProduct = async (productId, updatedProduct) => {
    try {
      await updateProduct(productId, updatedProduct);
      const updatedProducts = products.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            stockAmount: updatedProduct.stockAmount,
          };
        }
        return product;
      });
      productsCtx.setProducts(updatedProducts);
    } catch (error) {
      console.error('There was an error updating the product:', error);
    }
  };

  return (
    <>
      <ProductsOutput
        products={products}
        onUpdateProduct={handleUpdateProduct}
        fallbackText="No items found. Add some products."
      />
    </>
  );
};

export default AllProducts;
