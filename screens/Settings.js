import React from "react";
import { AsyncStorage, Button, View } from "react-native";

class Settings extends React.Component {
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Log out" onPress={this._signOutAsync} />
      </View>
    );
  }
}
export default Settings;
