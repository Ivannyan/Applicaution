import React from "react";
import App from "./App.js";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

const FirstScreen = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.replace("HomeScreen"); // Replace the current screen with "HomeScreen"
  };

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

  const handleImagePress = (phoneNumber /*: string*/) => {
    const phoneNumberWithPrefix = `tel:${phoneNumber}`;
    Linking.openURL(phoneNumberWithPrefix);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.EntryDiv}>
        <Text style={styles.Title}>{"\n"}TIAONG</Text>
        <Text style={styles.Title}>APPLICAUTION</Text>
        <Text>ONE ALERT AWAY{"\n"}</Text>
        <Button title="Enter" onPress={handlePress}></Button>
      </View>
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

export default FirstScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start", // Move the container to the top
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
  EntryDiv: {
    justifyContent: "center",
    alignItems: "center",
  },
  Title: {
    fontWeight: "900",
    fontSize: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
