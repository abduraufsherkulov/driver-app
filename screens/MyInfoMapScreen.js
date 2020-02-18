import React, { Component } from "react";
import { Text, Button } from "react-native-elements";

import {
  Platform,
  StyleSheet,
  Image,
  View,
  Linking,
  Dimensions,
  BackHandler
} from "react-native";

import MapView from 'react-native-maps';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import BottomDrawer from "rn-bottom-drawer";
import * as Font from 'expo-font';
import { Feather } from "@expo/vector-icons";
import Constants from 'expo-constants';

import MyOrdersModal from "./subscreens/myOrders/MyOrdersModal";
import Polyline from "@mapbox/polyline";

const PIN_RESTRAUNT = require("../assets/images/restraunt.png");

import axios from "axios";

const SCREEN_WIDTH = Dimensions.get("window").width;

class MyInfoMapScreenTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../assets/fonts/GoogleSans-Medium.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text>
        {this.state.fontLoaded ? (
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 18,
              color: "black"
            }}
          >
            {"Номер заказа: " + this.props.main_id}
          </Text>
        ) : null}
      </Text>
    );
  }
}

class MyInfoMapScreen extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);

    this._didFocusSubscription = props.navigation.addListener(
      "didFocus",
      payload =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );

    this.state = {
      location: { coords: { latitude: 0, longitude: 0 } },
      errorMessage: null,
      imgsrc: {
        restraunt: "",
        customer: ""
      },
      fontLoaded: false,
      opened: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.1,
        longitudeDelta: 0.05
      },
      asyncing: false,
      distance: {
        text: "",
        value: +""
      },
      duration: {
        text: "",
        value: +""
      }
    };
  }

  _isMounted = false;

  _pressCall = () => {
    let allVal = this.props.navigation.getParam("all");
    const url = `tel:+${allVal.user.phone}`;
    Linking.openURL(url);
  };

  handleModal = () => {
    this.setState({
      opened: true
    });
  };
  handleClose = () => {
    this.setState({
      opened: false
    });
  };

  async componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      payload =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
    this._isMounted = true;

    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../assets/fonts/GoogleSans-Medium.ttf")
    });

    this.setState({ fontLoaded: true });
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      if (this._isMounted) {
        await this._getLocationAsync();
      }
    }
  }
  onBackButtonPressAndroid = () => {
    this.props.navigation.popToTop();
    return true;
  };
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    const providerStatus = await Location.getProviderStatusAsync();

    let allVal = this.props.navigation.getParam("all");
    let overVIew = allVal.user.map_info.points;
    let polyway = Polyline.decode(overVIew);

    let lat = +allVal.entity.latitude;
    let long = +allVal.entity.longitude;

    let userLat = +allVal.user.latitude;
    let userLong = +allVal.user.longitude;

    if (providerStatus.locationServicesEnabled === false) {
      await this.openGeneralLocationSettings();

      const providerStatusSecond = await Location.getProviderStatusAsync();

      if (providerStatusSecond.locationServicesEnabled === true) {
        await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        }).then(this.locationChanged);

        let driverLat = this.state.location.coords.latitude;
        let driverLong = this.state.location.coords.longitude;

        if (allVal.status.code === "in_process") {
          const myUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${driverLat},${driverLong}&destination=${lat},${long}&mode=driving&units=metric&alternatives=false&key=AIzaSyAzYOL6bw06c3P1Tq3aZoXH34RviHjyAro`;
          axios({
            method: "get",
            url: myUrl
          })
            .then(response => {
              let polyway = Polyline.decode(
                response.data.routes[0]["overview_polyline"].points
              );
              let coords = polyway.map((point, index) => {
                return {
                  latitude: point[0],
                  longitude: point[1]
                };
              });

              this.setState({
                poly: coords
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          let coords = polyway.map((point, index) => {
            return {
              latitude: point[0],
              longitude: point[1]
            };
          });
          this.setState({
            poly: coords
          });

          this.locationPromise = await Location.watchPositionAsync(
            {
              enableHighAccuracy: true,
              timeInterval: 2000
            },
            this.locationChanged
          );
        }
      } else {
        this.setState({
          region: {
            latitude: lat,
            longitude: long
          }
        });
      }
    } else {
      await Location.getCurrentPositionAsync({ enableHighAccuracy: true }).then(
        this.locationChanged
      );

      let driverLat = this.state.location.coords.latitude;
      let driverLong = this.state.location.coords.longitude;

      if (allVal.status.code === "in_process") {
        const myUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${driverLat},${driverLong}&destination=${lat},${long}&mode=driving&units=metric&alternatives=false&key=AIzaSyAzYOL6bw06c3P1Tq3aZoXH34RviHjyAro`;
        axios({
          method: "get",
          url: myUrl
        })
          .then(response => {
            let polyway = Polyline.decode(
              response.data.routes[0]["overview_polyline"].points
            );
            let coords = polyway.map((point, index) => {
              return {
                latitude: point[0],
                longitude: point[1]
              };
            });

            this.setState({
              poly: coords
            });
          })
          .catch(error => {
            console.log(error);
          });

        this.locationPromise = await Location.watchPositionAsync(
          {
            enableHighAccuracy: true,
            timeInterval: 2000
          },
          this.locationChanged
        );
      } else {
        let coords = polyway.map((point, index) => {
          return {
            latitude: point[0],
            longitude: point[1]
          };
        });
        this.setState({
          poly: coords
        });

        this.locationPromise = await Location.watchPositionAsync(
          {
            enableHighAccuracy: true,
            timeInterval: 2000
          },
          this.locationChanged
        );
      }
    }
  };

  locationChanged = location => {
    this.setState({
      location,
      region: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta
      },
      asyncing: true
    });
  };
  openGeneralLocationSettings = async () => {
    if (Platform.OS === "ios") {
      await Linking.openURL("App-Prefs:root=Privacy&path=LOCATION");
      return;
    }

    await IntentLauncher.startActivityAsync(
      IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
    );
  };

  handlePress = () => {
    let allVal = this.props.navigation.getParam("all");
    console.log(allVal);
    this.props.nav.navigate(MyOrdersModal, {
      all: allVal
    });
  };

  componentWillUnmount() {
    if (this.state.asyncing) {
      this.locationPromise.remove();
    }
    this._isMounted = false;

    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <MyInfoMapScreenTitle
        navigation={navigation}
        main_id={navigation.getParam("all").id}
      />
    ),
    headerStyle: {
      backgroundColor: "white",
      paddingTop: 0,
      height: 60
    },
    headerTitleStyle: { color: "rgba(126,123,138,1)" },
    headerLeftContainerStyle: {
      padding: 0
    },
    headerTitleContainerStyle: {
      padding: 0
    },
    headerForceInset: { top: "never", bottom: "never" }
  });
  onRegionChange = (delta) => {
    this.setState({
      region: {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: delta.latitudeDelta,
        longitudeDelta: delta.longitudeDelta
      }
    });
  }

  render() {
    let allVal = this.props.navigation.getParam("all");
    let text = "Waiting..";

    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    let polygam = this.state.poly ? (
      <MapView.Polyline
        coordinates={this.state.poly}
        strokeWidth={5}
        strokeColor="#00b3fd"
        lineCap="round"
      />
    ) : null;
    let button_title =
      allVal.status.code === "in_process" ? "Получил" : "Доставлен";
    return (
      <View style={{ flex: 1 }}>
        {this.state.fontLoaded ? (
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: +allVal.entity.latitude,
                longitude: +allVal.entity.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
              showsUserLocation={true}
              region={this.state.region}
              onRegionChangeComplete={this.onRegionChange}
            // onLayout={() => {
            //   this.mark.showCallout();
            // }}
            >
              <MapView.Marker
                // ref={ref => {
                //   this.mark = ref;
                // }}
                // image={require("../assets/images/restraunt.png")}
                coordinate={{
                  latitude: +allVal.entity.latitude,
                  longitude: +allVal.entity.longitude
                }}
                title={allVal.entity.name}
              //description={text}
              >
                <Image
                  style={{ width: 38, height: 38 }}
                  source={require("../assets/images/restraunt.png")}
                />
              </MapView.Marker>
              <MapView.Marker
                // ref={ref => {
                //   this.mark = ref;
                // }}
                // image={require("../assets/images/home.png")}
                coordinate={{
                  latitude: +allVal.user.latitude,
                  longitude: +allVal.user.longitude
                }}
                title={
                  allVal.user.name.first_name + " " + allVal.user.name.last_name
                }
              //description={text}
              >
                <Image
                  style={{ width: 38, height: 38 }}
                  source={require("../assets/images/home.png")}
                />
              </MapView.Marker>
              {polygam}
            </MapView>
          </View>
        ) : (
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <Image
                style={{ width: 100, height: 100 }}
                source={require("../assets/loader.gif")}
              />
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoTypeLabel: {
    fontSize: 15,
    textAlign: "right",
    color: "rgba(126,123,138,1)",
    fontFamily: "regular",
    paddingBottom: 10
  },
  infoAnswerLabel: {
    fontSize: 15,
    color: "rgba(47,44,60,1)",
    fontFamily: "regular",
    paddingBottom: 10
  }
});

export default MyInfoMapScreen;
