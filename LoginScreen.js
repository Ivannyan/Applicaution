import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import adminAccounts from "./Admin.json"; // Import the JSON file
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen({ navigation }) {
  const [emailOrContact, setEmailOrContact] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = () => {
    if (emailOrContact && password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(emailOrContact, password)
        .then((userCredential) => {
          // Check if the user is an admin based on email
          const userEmail = userCredential.user.email;
          const isAdmin = checkAdmin(userEmail);
          if (isAdmin) {
            // Navigate to Admin Panel after successful login
            navigation.navigate("HomeScreenAdmin");
          } else {
            // Navigate to Profile Tab for regular users
            navigation.navigate("HomeScreen");
          }
        })
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert("Error", errorMessage);
        });
    } else {
      Alert.alert(
        "Error",
        "Please enter email or contact number and password."
      );
    }
  };

  // Function to check if a user is an admin
  const checkAdmin = (email) => {
    // Implement your logic to check if the email belongs to an admin
    // For example, you could compare it against a list of admin emails from the JSON file
    const adminEmails = adminAccounts.map((account) => account.email);
    return adminEmails.includes(email);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Screen</Text>
      <TextInput
        placeholder="Email or Contact Number"
        onChangeText={(text) => setEmailOrContact(text)}
        value={emailOrContact}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10, width: 300 }}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 10, width: 300 }}
      />
      <Button title="Log In" onPress={handleLogIn} />
      <Button
        title="Sign In"
        onPress={() => navigation.navigate("SignInScreen")}
      />
    </View>
  );
}
