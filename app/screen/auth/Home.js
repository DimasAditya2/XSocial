import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useQuery, gql } from "@apollo/client";

const GET_POSTS = gql`
  query Posts {
    posts {
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

const Home = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  console.log(data, "<----");

  const handleSearch = (text) => {
    setSearch(text);
    if (data?.posts) {
      const filtered = data.posts.filter(
        (post) =>
          post.content.toLowerCase().includes(text.toLowerCase()) ||
          (post.postUser &&
            post.postUser.username.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredPosts(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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
        <Text>Error fetching posts: {error.message}</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{
              uri:
                item.postUser && item.postUser.wkwkw
                  ? item.postUser.wkwk
                  : "https://animeuknews.net/app/uploads/2019/05/1.jpg",
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", { userId: item.postUser._id })
          }
        >
          <Text style={styles.username}>
            {item.postUser ? item.postUser.username : "User"}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      <Image
        source={{
          uri:
            item.imgUrl || "https://animeuknews.net/app/uploads/2019/05/1.jpg",
        }}
        style={styles.postImage}
      />
      <View style={styles.interaction}>
        <TouchableOpacity>
          <Text style={styles.interactionText}>Likes: {item.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PostDetail", { postId: item._id })
          }
        >
          <Text style={styles.interactionText}>
            Comments: {item.comments.length}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Cari postingan"
        value={search}
        onChangeText={handleSearch}
      />
      <Text style={{ textAlign: "center", fontWeight: "thin", color: "grey" }}>
        Tarik ke atas untuk refresh
      </Text>

      <FlatList
        data={search ? filteredPosts : data.posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 50,
    borderColor: "#E1E8ED",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    margin: 15,
    backgroundColor: "#F5F8FA",
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
});

export default Home;
