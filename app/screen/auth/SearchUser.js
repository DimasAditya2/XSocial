import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery, gql } from "@apollo/client";

const USER_BY_USERNAME = gql`
  query UserByUsername($username: String) {
    userByUsername(username: $username) {
      _id
      name
      username
      email
    }
  }
`;

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const { loading, error, data } = useQuery(USER_BY_USERNAME, {
    variables: { username: searchUsername },
    skip: !searchUsername,
  });

  const handleSearch = () => {
    setSearchUsername(username);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Masukkan Username"
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Cari Pengguna</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

      {data && data.userByUsername && (
        <View style={styles.result}>
          <Text style={styles.resultText}>
            Nama: {data.userByUsername.name}
          </Text>
          <Text style={styles.resultText}>
            Username: {data.userByUsername.username}
          </Text>
          <Text style={styles.resultText}>
            Email: {data.userByUsername.email}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#E1E8ED",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#F5F8FA",
  },
  button: {
    backgroundColor: "#1DA1F2",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginVertical: 10,
  },
  result: {
    marginTop: 20,
    padding: 15,
    borderColor: "#E1E8ED",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#F5F8FA",
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default SearchUser;
