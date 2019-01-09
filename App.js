import React from "react";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import Navigator from "./config/router";
import { Constants } from "expo";
import { YellowBox } from "react-native";

YellowBox.ignoreWarnings(["Require cycle:"]);

class App extends React.Component {
  render() {
    return (
      <View style={styles.bodyPart}>
        <StatusBar
          barStyle="light-content"
          translucent={false}
          backgroundColor="#8ac53f"
          hidden
        />
        <Navigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  bodyPart: {
    flex: 1
    //paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
  },
  statusBar: {
    backgroundColor: "#8ac53f",
    height: Constants.statusBarHeight
  }
});

export default App;
