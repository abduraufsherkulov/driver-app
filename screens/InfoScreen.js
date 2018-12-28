import React, { Component } from "react";
import { View, Text } from "react-native-elements";

class InfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    title: "Welcome",
    headerStyle: {
      backgroundColor: "red",
      paddingTop: 0,
      height: 40
    },
    headerTitleStyle: { color: "green" },
    headerLeftContainerStyle: {
      padding: 0
    },
    headerTitleContainerStyle: {
      padding: 0
    },
    headerForceInset: { top: "never", bottom: "never" }
  };
  render() {
    return <Text>123</Text>;
  }
}

export default InfoScreen;
