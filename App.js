//Paiyak nako

import React, { useState, useEffect } from "react";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FirstScreen from "./FirstScreen";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import SignInScreen from "./SignInScreen";
import HomeScreenAdmin from "./HomeScreenAdmin";
import { AppRegistry, Platform } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const Stack = createStackNavigator();

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the user is an admin after login
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Perform admin check based on user data or role
        // For simplicity, we'll assume the user is admin if email ends with '@admin.com'
        setIsAdmin(user.email.endsWith("@applicaution.com"));
      } else {
        setIsAdmin(false);
      }
    });

    return unsubscribe;
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="FirstScreen"
          component={FirstScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen
          name="HomeScreenAdmin"
          component={HomeScreenAdmin}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const firebaseConfig = {
  apiKey: "AIzaSyDwbFf3A_3RDf_x6UZFwFhkMY_Poxreyh0",
  authDomain: "applicaution-95c8d.firebaseapp.com",
  databaseURL:
    "https://applicaution-95c8d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "applicaution-95c8d",
  storageBucket: "applicaution-95c8d.appspot.com",
  messagingSenderId: "1090515830497",
  appId: "1:1090515830497:web:b6b46e3589d7f89d51d9a0",
  measurementId: "G-TY1579ZMKG",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

AppRegistry.registerComponent("main", () => App);
export default App;

//ahhhhhhhhhghghghghghgh
