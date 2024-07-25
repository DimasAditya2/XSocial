import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { authContext } from "../context/authContext";
import * as SecureStore from "expo-secure-store";

export default function LogoutButton() {
  const { setIsSignedIn } = useContext(authContext);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsSignedIn(false);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  text: {
    color: "#000",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
