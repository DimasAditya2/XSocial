import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../queris";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [registerUser, { loading, error }] = useMutation(REGISTER, {
    onCompleted: () => {
      navigation.navigate("Login");
    },
  });

  const handleRegister = () => {
    registerUser({
      variables: { name, email, username, password },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat akun Anda</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama"
        placeholderTextColor="#657786"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#657786"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#657786"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Kata Sandi"
        placeholderTextColor="#657786"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Daftar</Text>
      </TouchableOpacity>

      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Sudah punya akun? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>Masuk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1DA1F2",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#657786",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#E1E8ED",
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
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
  },
  loginText: {
    color: "#657786",
  },
  loginLink: {
    color: "#1DA1F2",
    fontWeight: "bold",
  },
});

export default Register;
