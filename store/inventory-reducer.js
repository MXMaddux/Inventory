const inventoryReducer = (state, action) => {
    switch (action.type) {
      case "ADD_PRODUCT":
        return [...state, action.product];
      case "UPDATE_PRODUCT":
        return state.map((product) =>
          product.id === action.product.id ? action.product : product
        );
      case "DELETE_PRODUCT":
        return state.filter((product) => product.id !== action.productId);
      default:
        return state;
    }
  };
  
  export default inventoryReducer;
  