import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useQuery, gql } from "@apollo/client";

// Query untuk mendapatkan detail postingan berdasarkan ID
const GET_POST_BY_ID = gql`
  query PostById($id: String!) {
    postById(_id: $id) {
      _id
      content
      tags
      imgUrl
      authorId
      postUser {
        _id
        name
        username
        email
      }
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

const PostDetail = ({ route }) => {
  const { postId } = route.params;
  const { loading, error, data } = useQuery(GET_POST_BY_ID, {
    variables: { id: postId },
  });

  const [commentText, setCommentText] = React.useState("");

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error fetching post: {error.message}</Text>
      </SafeAreaView>
    );
  }

  const post = data.postById;

  const handleAddComment = () => {
    if (commentText.trim()) {
      // Logika untuk menambahkan komentar baru
      setCommentText("");
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text style={styles.commentContent}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.postContainer}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: "https://via.placeholder.com/50",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{post.postUser.username}</Text>
        </View>
        <Text style={styles.content}>{post.content}</Text>
        <Image source={{ uri: post.imgUrl }} style={styles.postImage} />
        <View style={styles.interaction}>
          <Text style={styles.interactionText}>Likes: {post.likes.length}</Text>
          <Text style={styles.interactionText}>
            Comments: {post.comments.length}
          </Text>
        </View>
      </View>
      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Komentar</Text>
        <FlatList
          data={post.comments}
          renderItem={renderComment}
          keyExtractor={(item) => item._id}
        />
      </View>
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Tambahkan komentar..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity
          style={styles.commentButton}
          onPress={handleAddComment}
        >
          <Text style={styles.commentButtonText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#14171A",
  },
  content: {
    fontSize: 16,
    color: "#14171A",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  interaction: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  interactionText: {
    fontSize: 14,
    color: "#657786",
  },
  commentsSection: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
    paddingVertical: 10,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#14171A",
  },
  commentContent: {
    fontSize: 14,
    color: "#657786",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
    padding: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#E1E8ED",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: "#1DA1F2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  commentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PostDetail;
