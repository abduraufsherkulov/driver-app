import React from "react";
import { AsyncStorage, Button, View, StatusBar, Platform } from "react-native";

const isAndroid = Platform.OS === "android";

class Dashboard extends React.Component {
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content");
      isAndroid && StatusBar.setBackgroundColor("yellow");
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Log out" onPress={this._signOutAsync} />
      </View>
    );
  }
}
export default Dashboard;
