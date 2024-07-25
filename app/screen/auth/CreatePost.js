import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useMutation, gql } from "@apollo/client";

const ADD_POST = gql`
  mutation AddPost($input: CreatePostInput) {
    addPost(input: $input) {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      updatedAt
      postUser {
        _id
        name
        username
        email
      }
      likes {
        username
        createdAt
        updatedAt
      }
      comments {
        content
        username
        createdAt
        updatedAt
      }
    }
  }
`;

const CreatePost = ({ navigation }) => {
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tags, setTags] = useState("");
  const [addPost, { loading, error }] = useMutation(ADD_POST);

  const handleAddPost = async () => {
    if (content && imgUrl && tags) {
      try {
        await addPost({
          variables: {
            input: {
              content,
              imgUrl,
              tags: tags.split(","),
            },
          },
        });

        navigation.goBack();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text>Error: {error.message}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Konten"
        value={content}
        onChangeText={setContent}
      />
      <TextInput
        style={styles.input}
        placeholder="URL Gambar"
        value={imgUrl}
        onChangeText={setImgUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Tag (pisahkan dengan koma)"
        value={tags}
        onChangeText={setTags}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddPost}>
        <Text style={styles.buttonText}>Tambahkan Postingan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#E1E8ED",
    borderWidth: 1,
    borderRadius: 20,
    width: "90%",
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#F5F8FA",
  },
  button: {
    backgroundColor: "#1DA1F2",
    borderRadius: 25,
    paddingVertical: 15,
    width: "90%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 11,
    padding: 2,
    fontWeight: "bold",
  },
});

export default CreatePost;
