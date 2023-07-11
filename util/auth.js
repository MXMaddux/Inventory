import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AUTH_API_KEY } from "@env";
const AUTH_API_KEY = "AIzaSyCAdo2HNq5vCEByKJLdx_bZmeUSxZkm9wM ";

export async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${AUTH_API_KEY}`;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });
  try {
    await AsyncStorage.setItem('userID', response.data.localId);
    await AsyncStorage.setItem('token', response.data.idToken);
  } catch (e) {
  }
}

export function createUser(email, password) {
  return authenticate('signUp', email, password);
}

export function login(email, password) {
  return authenticate('signInWithPassword', email, password);
}