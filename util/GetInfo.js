import axios from "axios";
import {  useState } from "react";
import { API_KEY } from "@env";


export const useGetInfo = async (barcodeNumber, updateScannedInfo) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [size, setSize] = useState(0);
  const [code, setCode] = useState(null);

  const options = {
    method: "GET",
    url: "https://barcodes-lookup.p.rapidapi.com/",
    params: {
      query: barcodeNumber,
    },
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": "barcodes-lookup.p.rapidapi.com",
    },
  };
  try {
    const response = await axios.request(options);
    const result = response.data.product;
  
    setTitle(result.title);
    setCompany(result.manufacturer);
    setCode(barcodeNumber);
    setSize(0);
  
    let updatedInfo = {
      title: title,
      code: code,
      company: company,
      size: size,
    };
    updateScannedInfo(updatedInfo);
    
  
    return { result, title, code, size, updatedInfo };
  } catch (error) {
    console.error("There has been a problem with your fetch info: " + error);
    throw new Error("There has been a problem with your fetch info: " + error)
  }
}