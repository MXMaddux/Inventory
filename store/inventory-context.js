import { createContext, useReducer } from "react";


export const ProductsContext = createContext({
    products: [],
    addProduct: ({ title, stockAmount, idealAmount, code, size, company }) => {},
    setProducts: (products) => {},
    deleteProduct: (id) => {},
    updateProduct: (id, { title, stockAmount, idealAmount, code, size, company }) => {},
  });
  
  function productsReducer(state, action) {
    switch (action.type) {
        // case 'ADD_PRODUCT':
        //   return [action.payload, ...state];
      case 'ADD':
        return [action.payload, ...state];
      case 'SET':
        return action.payload.sort();
      case 'UPDATE':
        const updatableProductIndex = state.findIndex(
          (product) => product.id === action.payload.id
        );
        const updatableProduct = state[updatableProductIndex];
        const updatedItem = { ...updatableProduct, ...action.payload.data };
        const updatedProducts = [...state];
        updatedProducts[updatableProductIndex] = updatedItem;
        return updatedProducts;
      case 'DELETE':
        return state.filter((product) => product.id !== action.payload);
      default:
        return state;
    } 
  }
  
  function ProductsContextProvider({ children }) {
    const [productsState, dispatch] = useReducer(productsReducer, []);
  
    function addProduct(productData) {
      dispatch({ type: 'ADD', payload: productData });
    }
  
    function setProducts(newProducts) {
      dispatch({ type: 'SET', payload: newProducts });
    }
  
    function deleteProduct(id) {
      dispatch({ type: 'DELETE', payload: id });
    }
  
    function updateProduct(id, productData) {
      dispatch({ type: 'UPDATE', payload: { id: id, data: productData } });
    }
    
  
    const value = {
      products: productsState,
      addProduct: addProduct,
      setProducts: setProducts,
      deleteProduct: deleteProduct,
      updateProduct: updateProduct,
    };
  
    return (
      <ProductsContext.Provider value={value}>
        {children}
      </ProductsContext.Provider>
    );
  }
  
  

  export default ProductsContextProvider;