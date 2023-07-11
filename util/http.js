import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const BACKEND_URL = "https://inventory-app-32915-default-rtdb.firebaseio.com";

export const storeProduct = async (productData) => {
  const response = await axios.post(
    BACKEND_URL + "/inventory.json",
    productData
  );
  const id = response.data.name;
  return id;
};

export const addNewProduct = async (productInfo) => {
  await storeProduct(productInfo);
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(BACKEND_URL + "/inventory.json");
    const userID = await AsyncStorage.getItem('userID');
    const products = [];
    const data = response.data
    for (const key in data) {
      const productObj = {
        id: key,
        stockAmount: data[key].stockAmount,
        idealAmount: data[key].idealAmount,
        title: data[key].title,
        code: data[key].code,
        size: data[key].size,
        company: data[key].company,
        userID: data[key].userID,
      };
      products.push(productObj);
    }
    return products.filter(product => product.userID === userID);
  } catch (error) {
    console.error("There was an error fetching products:", error);
    throw error;
  }
};


export const updateProduct = async (id, productData) => {
  

  const response = await axios.patch(
    BACKEND_URL + `/inventory/${id}.json`,
    productData
  );
  return response.data;
};

export const deleteProduct = (id) => {
  return axios.delete(BACKEND_URL + `/inventory/${id}.json`);
};