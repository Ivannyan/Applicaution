import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const HomeScreenAdmin = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Function to fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firebase
          .firestore()
          .collection("users")
          .get();
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error (e.g., show error message)
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = () => {
    const filteredData = filteredUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredUsers(filteredData);
  };

  const handleUserClick = (user) => {
    navigation.replace("UserDetails", { user });
  };

  const handleOpenMapsLink = (googleMapsLink) => {
    if (googleMapsLink) {
      Linking.openURL(googleMapsLink).catch((error) =>
        console.error("Failed to open Google Maps link:", error)
      );
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text>{item.name}</Text>
        <Text>{item.email}</Text>
        <Text>{item.phone}</Text>
      </View>
      <TouchableOpacity onPress={() => handleOpenMapsLink(item.googleMapsLink)}>
        <Text style={{ color: "blue", textDecorationLine: "underline" }}>
          Track
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        placeholder="Search"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => (item.id ? item.id.toString() : null)}
      />
    </View>
  );
};

const UserDetails = ({ route }) => {
  <View>
    <Text>wiwi</Text>
  </View>;
};

const ProfileScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userData, setUserData] = useState(null);
  const [phone, setPhone] = useState("");
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        try {
          const users = await firebase
            .firestore()
            .collection("users")
            .doc(currentUser.uid)
            .get();
          if (users.exists) {
            const userData = users.data();
            setUserData(userData);
            setPhone(userData.phone); // Set initial phone number
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

  return (
    <View style={styles.container}>
      {isLoggedIn && userData ? (
        <View>
          <Image source={userData.profilePic} style={styles.profilePic} />
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
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    margin: 5,
  },
  entryDiv: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: "80%",
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
  },
});

const App = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Users" component={HomeScreenAdmin} />
      <Tab.Screen name="Track" component={UserDetails} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default App;
