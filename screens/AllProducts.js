import React, { useContext, useEffect, useState } from 'react';
import { ProductsContext } from '../store/inventory-context';
import { fetchProducts, updateProduct } from '../util/http';
import ProductsOutput from '../components/InventoryOutput/ProductsOutput';

const AllProducts = () => {
  const productsCtx = useContext(ProductsContext);
  const [products, setProducts] = useState(productsCtx.products);
  const [scannedData, setScannedData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        productsCtx.setProducts(fetchedProducts);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('There was an error retrieving products:', error);
      }
    };

    getProducts();
  }, []);

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
      setProducts(updatedProducts);
      setScannedData(null); // Reset scanned data
      setShowModal(true); // Show modal again
      await fetchProducts(); // Fetch the updated products from the database
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
      {showModal && scannedData && (
        <HowManyModal
          onQuantitySelected={handleUpdateProduct}
          scannedData={scannedData}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};


export default AllProducts;
