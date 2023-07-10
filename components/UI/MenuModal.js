import React, {useContext} from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../../constants/styles";
import { AuthContext } from "../../store/auth-context";

const MenuModal = () => {
  const navigation = useNavigation();
  authCtx = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate("ScannerScreen")}>
        <View style={styles.menuContainer}>
          <Text style={styles.text}>Add New Product</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() =>
          navigation.navigate("AddOneToStockAmount", { key: Date.now() })
        }
      >
        <View style={styles.menuContainer}>
          <Text style={styles.text}>Add to stock amount</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() =>
          navigation.navigate("SubtractOneFromStockAmount", { key: Date.now() })
        }
      >
        <View style={styles.menuContainer}>
          <Text style={styles.text}>Subtract from stock amount</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
        authCtx.logout()
        navigation.navigate("Login", { key: Date.now() })
        }
        }
      >
        <View style={styles.menuContainer}>
          <Text style={styles.text}>Logout</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default MenuModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: GlobalStyles.colors.primary100,
  },
  menuContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    paddingTop: 8,
    minWidth: "70%",
    backgroundColor: GlobalStyles.colors.primary500,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: GlobalStyles.colors.primary50,
  },
});
