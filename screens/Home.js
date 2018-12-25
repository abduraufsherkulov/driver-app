import React from "react";
import { AsyncStorage, Text, View, Button } from "react-native";
import axios from "axios";
class Home extends React.Component {
  async componentDidMount() {
    let token = await AsyncStorage.getItem("access_token");
    const url = "https://api.delivera.uz/drivers/test";
    axios({
      method: "get",
      url: url,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        Accept: "application/json, text/plain, */*"
      }
    })
      .then(response => {
        console.log(response, "resp");
      })
      .catch(error => {
        console.log(error.response, "error");
      });
  }
  render() {
    setTimeout(async () => {
      console.log(await AsyncStorage.getItem("access_token"), "token");
    }, 2000);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Home!</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate("Login")}
        />
      </View>
    );
  }
}

export default Home;
