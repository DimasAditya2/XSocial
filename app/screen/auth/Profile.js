import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useQuery, gql } from "@apollo/client";

const USER_BY_ID = gql`
  query UserById($id: String!) {
    userById(_id: $id) {
      _id
      name
      username
      email
    }
  }
`;

const GET_FOLLOW = gql`
  query GetFollow($userId: ID!) {
    getFollow(userId: $userId) {
      followers {
        username
      }
      following {
        username
      }
    }
  }
`;

const Profile = ({ route }) => {
  const { userId } = route.params;

  const {
    loading: loadingUser,
    error: errorUser,
    data: userData,
  } = useQuery(USER_BY_ID, {
    variables: { id: userId },
  });

  const {
    loading: loadingFollow,
    error: errorFollow,
    data: followData,
  } = useQuery(GET_FOLLOW, {
    variables: { userId: userId },
  });

  if (loadingUser || loadingFollow) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (errorUser || errorFollow) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>
          Error fetching data:{" "}
          {errorUser ? errorUser.message : errorFollow.message}
        </Text>
      </SafeAreaView>
    );
  }

  const user = userData.userById;
  const followersCount = followData.getFollow.followers.length;
  const followingCount = followData.getFollow.following.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://animeuknews.net/app/uploads/2019/05/1.jpg" }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.followInfo}>
          <Text style={styles.followCount}>{followingCount} Mengikuti |</Text>
          <Text style={styles.followCount}>{followersCount} Pengikut</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#14171A",
    marginBottom: 5,
  },
  username: {
    fontSize: 18,
    color: "#657786",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#657786",
    marginBottom: 10,
  },
  followInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  followCount: {
    fontSize: 16,
    color: "#14171A",
  },
});

export default Profile;
