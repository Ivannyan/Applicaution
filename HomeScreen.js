import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import "firebase/compat/storage";
import { launchImageLibrary } from "react-native-image-picker";

const Tab = createBottomTabNavigator();

const data = [
  {
    id: "1",
    image: require("./imagesrc/243442072_162748646043856_7245198722716944821_n.jpg"),
    phoneNumber: "09452430130",
  },
  {
    id: "2",
    image: require("./imagesrc/308925687_139284825503152_1160358178294733299_n.jpg"),
    phoneNumber: "09777042440",
  },
  {
    id: "3",
    image: require("./imagesrc/242550982_577364097015937_3908156845349347803_n.jpg"),
    phoneNumber: "189",
  },
  {
    id: "4",
    image: require("./imagesrc/248596293_207887928125005_1361781019530783515_n.jpg"),
    phoneNumber: "09498454510",
  },
  {
    id: "5",
    image: require("./imagesrc/download.png"),
    phoneNumber: "911",
  },
  {
    id: "6",
    image: require("./imagesrc/988.png"),
    phoneNumber: "09663514518",
  },
  // Add more items with images and phone numbers as needed
];

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Please allow location access to use this feature."
          );
          return;
        }

        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (newLocation) => {
            setLocation(newLocation.coords);
          }
        );
      } catch (error) {
        console.error("Error starting location tracking:", error);
      }
    };

    if (tracking) {
      startLocationTracking();
    }

    return () => {
      // Clean up watcher when unmounting or stopping tracking
      Location.hasStartedLocationUpdatesAsync().then((isTracking) => {
        if (isTracking) {
          Location.stopLocationUpdatesAsync();
        }
      });
    };
  }, [tracking]);

  const handleStartTracking = () => {
    setTracking(true);
  };

  const handleStopTracking = () => {
    setTracking(false);
  };

  const handleSendToAdmin = async () => {
    if (!location) {
      Alert.alert(
        "No Location",
        "Please wait for GPS to get a fix before sending to admin."
      );
      return;
    }

    const { latitude, longitude } = location;
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    console.log("Sending Google Maps link to admin:", mapsLink);

    try {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        await firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .update({ googleMapsLink: mapsLink });
        console.log("Google Maps link saved to Firestore.");
      } else {
        console.log("No user signed in.");
      }
    } catch (error) {
      console.error("Error saving Google Maps link to Firestore:", error);
      Alert.alert("Error", "Failed to save Google Maps link.");
    }

    // Reset location after sending
    setLocation(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        )}
      </MapView>
      <View style={{ position: "absolute", bottom: 16, alignSelf: "center" }}>
        {!tracking ? (
          <Button title="Start Tracking" onPress={handleStartTracking} />
        ) : (
          <>
            <Button title="Stop Tracking" onPress={handleStopTracking} />
            <Button
              title="Send to Admin"
              onPress={handleSendToAdmin}
              disabled={!location}
            />
          </>
        )}
      </View>
    </View>
  );
};

const CallScreen = () => {
  const handleImagePress = (phoneNumber) => {
    const phoneNumberWithPrefix = `tel:${phoneNumber}`;
    Linking.openURL(phoneNumberWithPrefix)
      .then(() => console.log(`Calling ${phoneNumber}`))
      .catch((error) => console.error(`Failed to call ${phoneNumber}`, error));
  };
  return (
    <View style={styles.container}>
      <View style={styles.entryDiv}></View>
      <View style={styles.gridContainer}>
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleImagePress(item.phoneNumber)}
          >
            <Image source={item.image} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const UserProfile = () => {
  const [image, setImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userData, setUserData] = useState(null);
  const [phone, setPhone] = useState("");
  const [editable, setEditable] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [idPic, setIdPic] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        try {
          const userDoc = await firebase
            .firestore()
            .collection("users")
            .doc(currentUser.uid)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserData(userData);
            setPhone(userData.phone); // Set initial phone number
            setProfilePic(userData.profilePic);
            setIdPic(userData.idPic);
          } else {
            console.log("User data not found.");
          }
        } catch (error) {
          console.log("Error getting user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const navigation = useNavigation();
  const handlePress = () => {
    navigation.replace("LoginScreen"); // Replace the current screen with "HomeScreen"
  };
  const handlePress1 = () => {
    navigation.replace("LoginScreen"); // Replace the current screen with "HomeScreen"
  };
  const handleSignOut = () => {
    setIsLoggedIn(false);
  };

  const handleEditPhone = () => {
    setEditable(!editable);
  };

  const handleConfirmPhone = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      // Update phone number in Firestore
      await firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid)
        .update({ phone: phone });

      // Update local state and show success message
      setEditable(false);
      Alert.alert("Success", "Phone number updated successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const uploadImage = async (imagePickerResult, imageName, fieldToUpdate) => {
    const currentUser = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref(`images/${imageName}`);

    try {
      if (!imagePickerResult.cancelled) {
        const localUri = imagePickerResult.uri;
        const filename = localUri.split("/").pop();

        // Infer the MIME type from the file extension
        const response = await fetch(localUri);
        const blob = await response.blob();

        // Upload the image to Firebase storage
        const snapshot = await storageRef.put(blob);

        // Get the download URL of the uploaded image
        const downloadURL = await snapshot.ref.getDownloadURL();

        // Update user document with download URL of the uploaded image
        await firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .update({ [fieldToUpdate]: downloadURL });

        Alert.alert("Success", "Image uploaded successfully!");
      } else {
        console.log("Image picker canceled.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  const handleProfilePicUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow gallery access to upload images."
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
        setProfilePic(result.uri);
        uploadImage(result.uri, "profilePic.jpg", "profilePic");
      }
    } catch (error) {
      console.error("Error picking image from gallery:", error);
      Alert.alert("Error", "Failed to pick image from gallery.");
    }
  };

  const handleIdPicUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow gallery access to upload images."
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
        setIdPic(result.uri);
        uploadImage(result.uri, "idPic.jpg", "idPic");
      }
    } catch (error) {
      console.error("Error picking image from gallery:", error);
      Alert.alert("Error", "Failed to pick image from gallery.");
    }
  };

  return (
    <View style={styles.container}>
      {isLoggedIn && userData ? (
        <View>
          {profilePic && (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          )}
          <Button
            title="Upload Profile Picture"
            onPress={handleProfilePicUpload}
          />
          <Text>Name: {userData.name}</Text>
          <Text>Email: {userData.email}</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            editable={editable}
          />
          <Button
            title={editable ? "Confirm" : "Edit Phone"}
            onPress={editable ? handleConfirmPhone : handleEditPhone}
          />
          {idPic && <Image source={{ uri: idPic }} style={styles.idPic} />}
          <Button title="Upload ID Picture" onPress={handleIdPicUpload} />
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      ) : (
        <View>
          <Text>Please sign in to view your profile</Text>
          <Button title="Login" onPress={handlePress} />
          <Button title="Sign Up" onPress={handlePress1} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  idPic: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: "80%",
  },
  image: {
    width: 150,
    height: 150,
    margin: 5,
  },
});

const App = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Call" component={CallScreen} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
};

export default App;
