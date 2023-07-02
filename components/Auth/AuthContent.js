import React, { useState, useContext } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet, View, Text } from "react-native";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

import FlatButton from "../UI/FlatButton";
import AuthForm from "./AuthForm";
import { GlobalStyles } from "../../constants/styles";
import { AuthContext } from "../../store/auth-context";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);

  const switchAuthModeHandler = () => {
    if (isLogin) {
      navigation.navigate("Signup");
    } else {
      navigation.navigate("Login");
    }
  };

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }

    setLoading(true);

    onAuthenticate({ email, password })
      .then(() => {
        setLoading(false);
        // Authentication successful, perform necessary actions
        // For example, navigate to the Home screen
        navigation.navigate("InventoryOverview");
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Authentication Failed", error.message);
      });
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.authContent}>
        <AuthForm
          isLogin={isLogin}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
        />
        <View style={styles.buttons}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={GlobalStyles.colors.accent500}
            />
          ) : (
            <FlatButton onPress={switchAuthModeHandler}>
            <Text>{isLogin ? "Create a new user" : "Log in instead"}</Text>
            </FlatButton>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AuthContent;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary100,
    marginTop: 40,
  },
  authContent: {
    marginTop: 16,
    marginHorizontal: 32,
    width: "90%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: GlobalStyles.colors.primary800,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
