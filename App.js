import React, { useState, useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import MenuModal from "./components/UI/MenuModal";
import ProductsContextProvider from "./store/inventory-context";
import { ScannerProvider } from "./store/ScannerContext";
import Home from "./screens/Home";
import { GlobalStyles } from "./constants/styles";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import IconButton from "./components/UI/IconButton"
import AuthContextProvider, { AuthContext } from "./store/auth-context";



const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();



function AuthStack({authCtx}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: "Signup",
        }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedStack({authCtx}) {
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {authCtx.isAuthenticated ? (
        <AuthenticatedStack authCtx={authCtx}/>
      ) : (
        <AuthStack authCtx={authCtx}/>
      )}
    </NavigationContainer>
  );
}


const InventoryOverview = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: GlobalStyles.colors.primary50,
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
      })}
    >
      <BottomTabs.Screen
        name="Home"
        component={Home}
        options={{
          title: "Stylist Inventory App",
          tabBarLabel: "All Products",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="MenuModal"
        component={MenuModal}
        options={{
          title: "Menu",
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bars" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
};

function Root() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      try {
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          authCtx.authenticate(storedToken);
        }
      } catch (error) {
        console.log("Error fetching token:", error);
        // Handle the error condition here (e.g., show an error message)
      } finally {
        setIsAppLoading(false);
        SplashScreen.preventAutoHideAsync();
      }
    }

    fetchToken();
  }, []);

  useEffect(() => {
    if (!isAppLoading) {
      SplashScreen.hideAsync();
    }
  }, [isAppLoading]);

  if (isAppLoading) {
    return (
      <View style={styles.container}>
        {/* Render your loading overlay here */}
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <ScannerProvider>
        <ProductsContextProvider>
          {authCtx.isAuthenticated ? (
            <AuthenticatedStack />
          ) : (
            <AuthStack />
          )}          
        </ProductsContextProvider>
      </ScannerProvider>
    </>
  );
}

export default function App() {
  return (
    <AuthContextProvider>
      {/* <NavigationContainer>
        <Root />
      </NavigationContainer> */}
      <Navigation />
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary500,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    marginRight: 8,
  },
  minusButton: {
    marginRight: 8,
  },
});