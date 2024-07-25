import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { authContext } from "../context/authContext";
import { gql, useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";

const LOGIN_QUERY = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      access_token
    }
  }
`;

const Login = ({ navigation }) => {
  const { setIsSignedIn } = useContext(authContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN_QUERY, {
    onCompleted: async (data) => {
      try {
        await SecureStore.setItemAsync(
          "access_token",
          data.loginUser.access_token
        );
        setIsSignedIn(true);
      } catch (error) {
        consolerror.error(error);
      }
    },
    onError: (err) => {
      console.error("Login error", err);
    },
  });

  const handleLogin = () => {
    login({ variables: { username, password } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masuk ke XE</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama Pengguna"
        placeholderTextColor="#AAB8C2"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Kata Sandi"
        placeholderTextColor="#AAB8C2"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Masuk</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error.message}</Text>}

      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupText}>Belum punya akun? Daftar</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>sebelumnya X</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "blue",
    paddingTop: "30",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#1DA1F2",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#AAB8C2",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#F5F8FA",
    color: "#14171A",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1DA1F2",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  forgotPassword: {
    color: "#1DA1F2",
    marginBottom: 20,
  },
  signupText: {
    color: "#1DA1F2",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  footerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#AAB8C2",
  },
});

export default Login;
