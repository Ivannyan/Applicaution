import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

export default function SignInScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pictureUri, setPictureUri] = useState(null);

  // Request permission for camera
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  // Function to handle image selection from gallery
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPictureUri(result.uri);
    }
  };

  const handleSignIn = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      // Creating user in Firebase Authentication
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      // Adding user's name to Firebase Authentication user profile
      await userCredential.user.updateProfile({
        displayName: name,
        phoneNumber: phone,
      });

      // Uploading picture to Firebase Storage (you may need to implement this part)
      let pictureUrl = "";
      if (pictureUri) {
        const response = await fetch(pictureUri);
        const blob = await response.blob();
        const pictureRef = firebase
          .storage()
          .ref()
          .child(`userPictures/${userCredential.user.uid}`);
        await pictureRef.put(blob);
        pictureUrl = await pictureRef.getDownloadURL();
      }

      // Creating user document in Firestore
      await firebase
        .firestore()
        .collection("users")
        .doc(userCredential.user.uid)
        .set({
          name: name,
          email: email,
          phone: phone || "",
          pictureUrl: pictureUrl || "",
        });

      Alert.alert("Success", "Account created successfully!");
      navigation.goBack(); // Navigate back to login screen after sign in

      // Log in the newly created user to retrieve additional details
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          console.log("User signed in:", user);

          // Retrieve additional user details from Firestore
          const userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const { phone, pictureUrl } = userData;
            console.log("User data:", userData);
            console.log("Phone:", phone);
            console.log("Picture URL:", pictureUrl);

            // Navigate to another screen upon successful login
            // For example:
            // navigation.navigate("HomeScreen");
          } else {
            console.log("User data not found.");
          }
        })
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert("Error", errorMessage);
        });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sign In Screen</Text>
      <TextInput
        style={{ borderWidth: 1, width: 200, margin: 10, padding: 5 }}
        placeholder="Name"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={{ borderWidth: 1, width: 200, margin: 10, padding: 5 }}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={{ borderWidth: 1, width: 200, margin: 10, padding: 5 }}
        placeholder="Phone"
        onChangeText={setPhone}
        value={phone}
      />
      <TextInput
        style={{ borderWidth: 1, width: 200, margin: 10, padding: 5 }}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Pick Image" onPress={handlePickImage} />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
}
