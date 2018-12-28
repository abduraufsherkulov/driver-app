import React, { Component } from "react";
import { View, Text } from "react-native-elements";
import { MapView, Marker } from "expo";
class MyInfoScreen extends Component {
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
    let allVal = this.props.navigation.getParam("all");

    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: +allVal.entity.latitude,
          longitude: +allVal.entity.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      >
        <MapView.Marker
          coordinate={{
            latitude: +allVal.entity.latitude,
            longitude: +allVal.entity.longitude
          }}
          title={allVal.entity.name}
          description={"description"}
        />
      </MapView>
    );
  }
}

export default MyInfoScreen;
