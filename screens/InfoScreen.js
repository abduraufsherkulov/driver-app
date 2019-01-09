import React, { Component } from "react";
import { Text, Button } from "react-native-elements";

import {
  Platform,
  StyleSheet,
  Image,
  View,
  Linking,
  Dimensions
} from "react-native";
import {
  Constants,
  Location,
  Permissions,
  MapView,
  Polyline,
  IntentLauncherAndroid
} from "expo";

import { Font } from "expo";

import MainModal from "./subscreens/newOrders/MainModal";

const PIN_RESTRAUNT = require("../assets/images/restraunt.png");

import axios from "axios";

const SCREEN_WIDTH = Dimensions.get("window").width;

class MyInfoScreenTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
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
              color: "white"
            }}
          >
            {"Номер заказа: " + this.props.navigation.getParam("all").id}
          </Text>
        ) : null}
      </Text>
    );
  }
}

class InfoScreen extends Component {
  constructor(props) {
    super(props);

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
    const url = `tel://${allVal.user.phone}`;
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
    this._isMounted = true;

    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
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

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    const providerStatus = await Location.getProviderStatusAsync();

    let allVal = this.props.navigation.getParam("all");

    let lat = +allVal.entity.latitude;
    let long = +allVal.entity.longitude;

    if (providerStatus.locationServicesEnabled === false) {
      await this.openGeneralLocationSettings();
      console.log("after");

      let providerStatusSecond = await Location.getProviderStatusAsync();
      if (providerStatusSecond.locationServicesEnabled === true) {
        await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        }).then(this.locationChanged);

        let driverLat = this.state.location.coords.latitude;
        let driverLong = this.state.location.coords.longitude;

        const myUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${driverLat},${driverLong}&destination=${lat},${long}&mode=driving&units=metric&alternatives=false&key=AIzaSyAzYOL6bw06c3P1Tq3aZoXH34RviHjyAro`;
        axios({
          method: "get",
          url: myUrl
        })
          .then(response => {
            let getLength = response.data.routes[0]["legs"][0]["steps"].length;
            let steps = response.data.routes[0]["legs"][0]["steps"];
            let i = 0;
            let mainArr = [];
            for (i; i < getLength; i++) {
              let start = {};
              start.latitude = steps[i].start_location.lat;
              start.longitude = steps[i].start_location.lng;
              let end = {};
              end.latitude = steps[i].end_location.lat;
              end.longitude = steps[i].end_location.lng;

              mainArr.push(start);
              mainArr.push(end);
            }
            this.setState({
              distance: response.data.routes[0]["legs"][0]["distance"],
              duration: response.data.routes[0]["legs"][0]["duration"],
              poly: mainArr
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
        this.setState({
          region: {
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.1,
            longitudeDelta: 0.05
          }
        });
      }
    } else {
      await Location.getCurrentPositionAsync({
        enableHighAccuracy: true
      }).then(this.locationChanged);

      let driverLat = this.state.location.coords.latitude;
      let driverLong = this.state.location.coords.longitude;

      const myUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${driverLat},${driverLong}&destination=${lat},${long}&mode=driving&units=metric&alternatives=false&key=AIzaSyAzYOL6bw06c3P1Tq3aZoXH34RviHjyAro`;
      axios({
        method: "get",
        url: myUrl
      })
        .then(response => {
          let getLength = response.data.routes[0]["legs"][0]["steps"].length;
          let steps = response.data.routes[0]["legs"][0]["steps"];
          let i = 0;
          let mainArr = [];
          for (i; i < getLength; i++) {
            let start = {};
            start.latitude = steps[i].start_location.lat;
            start.longitude = steps[i].start_location.lng;
            let end = {};
            end.latitude = steps[i].end_location.lat;
            end.longitude = steps[i].end_location.lng;

            mainArr.push(start);
            mainArr.push(end);
          }
          this.setState({
            distance: response.data.routes[0]["legs"][0]["distance"],
            duration: response.data.routes[0]["legs"][0]["duration"],
            poly: mainArr
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
    }
  };

  locationChanged = location => {
    this.setState({
      location,
      region: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.05
      },
      asyncing: true
    });
  };
  openGeneralLocationSettings = async () => {
    if (Platform.OS === "ios") {
      await Linking.openURL("App-Prefs:root=Privacy&path=LOCATION");
      return;
    }

    await IntentLauncherAndroid.startActivityAsync(
      IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
    );
    console.log("before");
  };

  handlePress = () => {
    let allVal = this.props.navigation.getParam("all");
    this.props.nav.navigate(MainModal, {
      all: allVal
    });
  };

  componentWillUnmount() {
    if (this.state.asyncing) {
      this.locationPromise.remove();
    }
    this._isMounted = false;
  }
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: "Номер заказа: " + navigation.getParam("all").id,
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
        strokeWidth={7}
        strokeColor="#00a8ff"
        lineCap="round"
      />
    ) : null;
    return (
      <View style={{ flex: 1 }}>
        {this.state.fontLoaded ? (
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 0.5 }}
              initialRegion={{
                latitude: +allVal.entity.latitude,
                longitude: +allVal.entity.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
              showsUserLocation={true}
              region={this.state.region}
              // onLayout={() => {
              //   this.mark.showCallout();
              // }}
            >
              <MapView.Marker
                // ref={ref => {
                //   this.mark = ref;
                // }}
                image={require("../assets/images/restraunt.png")}
                coordinate={{
                  latitude: +allVal.entity.latitude,
                  longitude: +allVal.entity.longitude
                }}
                title={allVal.entity.name}
                //description={text}
              />
              <MapView.Marker
                // ref={ref => {
                //   this.mark = ref;
                // }}
                image={require("../assets/images/home.png")}
                coordinate={{
                  latitude: +allVal.user.latitude,
                  longitude: +allVal.user.longitude
                }}
                title={
                  allVal.user.name.first_name + " " + allVal.user.name.last_name
                }
                //description={text}
              />
              {polygam}
            </MapView>
            <View style={{ flex: 0.5 }}>
              <View style={{ flex: 1, marginTop: 5 }}>
                <Text
                  style={{
                    flex: 0.1,
                    fontSize: 15,
                    color: "rgba(216, 121, 112, 1)",
                    fontFamily: "regular",
                    marginLeft: 40
                  }}
                >
                  ИНФО
                </Text>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: "row",
                    marginTop: 0,
                    marginHorizontal: 15
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoTypeLabel}>Дистанция</Text>
                      {/* <Text style={styles.infoTypeLabel}>Длительность</Text> */}
                      <Text style={styles.infoTypeLabel}>Цена</Text>
                      <Text style={styles.infoTypeLabel}>Имя клиента</Text>
                      <Text style={styles.infoTypeLabel}>Номер телефона</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.infoAnswerLabel}>
                        {this.state.distance.text} (≈ {this.state.duration.text}
                        )
                      </Text>
                      {/* <Text style={styles.infoAnswerLabel}>
                        {this.state.duration.text}
                      </Text> */}
                      <Text style={styles.infoAnswerLabel}>
                        {allVal.user.delivery_price} Сум
                      </Text>
                      <Text style={styles.infoAnswerLabel}>
                        {allVal.user.name.first_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "green",
                          fontFamily: "regular",
                          paddingBottom: 10
                        }}
                        onPress={this._pressCall}
                      >
                        {allVal.user.phone}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flex: 0.4,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Button
                    containerStyle={{ marginVertical: 20 }}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    buttonStyle={{
                      height: 45,
                      width: SCREEN_WIDTH - 80,
                      borderRadius: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#8ac53f"
                    }}
                    // linearGradientProps={{
                    //   colors: ["rgba(214,116,112,1)", "rgba(233,174,87,1)"],
                    //   start: [1, 0],
                    //   end: [0.2, 0]
                    // }}
                    title={"Принят"}
                    titleStyle={{
                      fontFamily: "regular",
                      fontSize: 20,
                      color: "white",
                      textAlign: "center"
                    }}
                    onPress={this.handleModal}
                    activeOpacity={0.5}
                  />
                </View>
              </View>
            </View>

            <MainModal
              openUp={this.state.opened}
              closed={this.handleClose}
              order_id={allVal.id}
              entity_name={allVal.entity.name}
              acceptNewOrder={this.props.acceptNewOrder}
              getFromRest={this.props.getFromRest}
              all={allVal}
            />
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Button title="log out" onPress={this._signOutAsync} />
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

export default InfoScreen;
