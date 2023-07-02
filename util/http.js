import axios from "axios";

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
    const products = [];
    

    for (const key in response.data) {
      const productObj = {
        id: key,
        stockAmount: response.data[key].stockAmount,
        idealAmount: response.data[key].idealAmount,
        title: response.data[key].title,
        code: response.data[key].code,
        size: response.data[key].size,
        company: response.data[key].company,
      };
      products.push(productObj);
    }

    return products;
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