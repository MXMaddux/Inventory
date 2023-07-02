import React, { useState, useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import MenuModal from "./components/UI/MenuModal";
import Home from "./screens/Home";
import { GlobalStyles } from "./constants/styles";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import IconButton from "./components/UI/IconButton"

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

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

function AuthStack() {
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
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.primary100 },
      }}
    >
      <Stack.Screen
        name="InventoryOverview"
        component={InventoryOverview}
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
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
            headerTintColor: "white",
            contentStyle: { backgroundColor: GlobalStyles.colors.primary100 },
          }}
        >
          {/* Add your screens here */}
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Authenticated"
            component={AuthenticatedStack}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </AuthContextProvider>
    </NavigationContainer>
  );
}

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

  if (isAppLoading) {
    return <View style={styles.container} />;
  }

  SplashScreen.hideAsync();

  return (
    <>
      <StatusBar style="light" />
      <Navigation />
    </>
  );
}

export default function App() {
  return (
    <AuthContextProvider>
      <Root />
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
