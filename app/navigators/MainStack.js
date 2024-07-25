import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screen/Login";
import Home from "../screen/auth/Home";
import { useContext, useEffect } from "react";
import { authContext } from "../context/authContext";
import LogoutButton from "../screen/LogoutButton";
import Profile from "../screen/auth/Profile";
import PostDetail from "../screen/auth/PostDetail";
import Register from "../screen/Register";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "react-native";
import CreatePost from "../screen/auth/CreatePost";
import SearchUser from "../screen/auth/SearchUser";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="AddPost" component={CreatePost} />
      <Tab.Screen name="SearchUser" component={SearchUser} />
    </Tab.Navigator>
  );
}

export default function MainStack() {
  const { isSignedIn } = useContext(authContext);

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isSignedIn ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="XE MEDIA"
              component={HomeTabs}
              options={{
                headerRight: () => <LogoutButton />,
                headerRightContainerStyle: {
                  paddingRight: 10,
                },
              }}
            />
            <Stack.Screen name="PostDetail" component={PostDetail} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
