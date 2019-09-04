import React, { Component } from "react";
import { Text, Button } from "react-native-elements";

import {
  Platform,
  StyleSheet,
  Image,
  View,
  Linking,
  Dimensions,
  AsyncStorage
} from "react-native";
import {
  Location,
  MapView,
  IntentLauncherAndroid
} from "expo";
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import BottomDrawer from "rn-bottom-drawer";

import * as Font from 'expo-font';

import { Feather } from "@expo/vector-icons";

import Polyline from "@mapbox/polyline";
import MainModal from "./subscreens/newOrders/MainModal";

const PIN_RESTRAUNT = require("../assets/images/restraunt.png");

import axios from "axios";

const SCREEN_WIDTH = Dimensions.get("window").width;

const TAB_BAR_HEIGHT = 49;

class InfoScreenTitle extends Component {
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

class InfoScreen extends Component {
  _isMounted = false;
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
      },
      loading: false,
      order_id: +""
    };
  }

  _pressCall = () => {
    let allVal = this.props.navigation.getParam("all");
    const url = `tel:+${allVal.user.phone}`;
    Linking.openURL(url);
  };

  handleSubmit = event => {
    let allVal = this.props.navigation.getParam("all");
    let finished = this.props.navigation.getParam("finished");
    const { params } = this.props.navigation.state;
    this.setState({
      loading: true
    });
    const data = JSON.stringify({
      order_id: this.state.order_id
    });
    const url = "https://api.delivera.uz/drivers/accept";

    axios({
      method: "post",
      url: url,
      data: data,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: this.state.token
      }
    })
      .then(response => {
        console.log(response.data);
        if (response.data.reason === "Accepted") {
          params.getFromRest();
          params.acceptNewOrder();
          this.setState(
            {
              loading: false
            },
            () => {
              finished();
              this.props.navigation.goBack();
              this.props.navigation.navigate("MyInfoMapScreen", {
                all: allVal
              });
            }
          );
        }
      })
      .catch(error => {
        console.log(error.response);
      });

    event.preventDefault();
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
      regular: require("../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../assets/fonts/GoogleSans-Medium.ttf")
    });

    let allVal = this.props.navigation.getParam("all");
    let token = await AsyncStorage.getItem("access_token");
    let order_id = allVal.id;
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

    this.setState({ fontLoaded: true, token: token, order_id: order_id });
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
    let userLat = +allVal.user.latitude;
    let userLong = +allVal.user.longitude;
    let overVIew = allVal.user.map_info.points;
    let polyway = Polyline.decode(overVIew);

    if (providerStatus.locationServicesEnabled === false) {
      await this.openGeneralLocationSettings();
      console.log("after");

      let providerStatusSecond = await Location.getProviderStatusAsync();
      if (providerStatusSecond.locationServicesEnabled === true) {
        console.log('top');
        await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        }).then(this.locationChanged);

        let driverLat = this.state.location.coords.latitude;
        let driverLong = this.state.location.coords.longitude;
        // console.log(response.data);
        if (this._isMounted) {
          let coords = polyway.map((point, index) => {
            return {
              latitude: point[0],
              longitude: point[1]
            };
          });

          this.setState({
            poly: coords
          });
        }
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
      console.log('bottom');
      await Location.getCurrentPositionAsync({
        enableHighAccuracy: true
      }).then(this.locationChanged);

      let driverLat = this.state.location.coords.latitude;
      let driverLong = this.state.location.coords.longitude;

      if (this._isMounted) {
        let coords = polyway.map((point, index) => {
          return {
            latitude: point[0],
            longitude: point[1]
          };
        });
        this.setState({
          poly: coords
        });
      }
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
    console.log('called');
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
    headerTitle: (
      <InfoScreenTitle
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
  onRegionChange =(region)=> {
    console.log(region);
    this.setState({ region });
  }
  render() {
    // console.log(this.props.navigation.state.routeName);
    // console.log('rendered');
    let allVal = this.props.navigation.getParam("all");
    let text = "Waiting..";
    let { estimated_time, delivery_distance, delivery_price } = allVal.user;

    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    //#fb5607;
    //5caa57
    let polygam;
    if (this.state.poly) {
      // let pushMe = this.generateColor(
      //   "#fb5607",
      //   "#5caa57",
      //   this.state.poly.length
      // );
      polygam = (
        <MapView.Polyline
          coordinates={this.state.poly}
          strokeWidth={5}
          strokeColor="#00b3fd"
          // strokeColors={pushMe.length === 0 ? "#00a8ff" : pushMe}
          lineCap="round"
        />
      );
    }
    return (
      <View style={{ flex: 1 }}>
        {this.state.fontLoaded ? (
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 1 }}
              showsUserLocation={true}
              region={this.state.region}
            >
              <MapView.Marker
                // image={require("../assets/images/restraunt.png")}
                coordinate={{
                  latitude: +allVal.entity.latitude,
                  longitude: +allVal.entity.longitude
                }}
                title={allVal.entity.name}
              >
                <Image
                  style={{ width: 38, height: 38 }}
                  source={require("../assets/images/restraunt.png")}
                />
              </MapView.Marker>
              <MapView.Marker
                // image={require("../assets/images/home.png")}
                coordinate={{
                  latitude: +allVal.user.latitude,
                  longitude: +allVal.user.longitude
                }}
                title={
                  allVal.user.name.first_name + " " + allVal.user.name.last_name
                }
              >
                <Image
                  style={{ width: 38, height: 38 }}
                  source={require("../assets/images/home.png")}
                />
              </MapView.Marker>
              {polygam}
            </MapView>
            <BottomDrawer
              shadow={true}
              containerHeight={400}
              offset={100}
              startUp={false}
              downDisplay={330}
            >
              <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={{ flex: 0.2, justifyContent: "center" }}>
                  <Feather
                    name="chevrons-up"
                    size={22}
                    color="rgba(47,44,60,1)"
                    style={{ alignSelf: "center" }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#acacac",
                      fontFamily: "regular",
                      alignSelf: "center"
                    }}
                  >
                    Информация о заказе
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.6,
                    flexDirection: "column",
                    marginHorizontal: 26
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderBottomColor: "#f0f0f0",
                      borderTopColor: "#f0f0f0"
                    }}
                  >
                    <Text style={styles.infoTypeLabel}>Расстояние</Text>
                    <Text style={styles.infoAnswerLabel}>
                      {delivery_distance} км.
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: "#f0f0f0"
                    }}
                  >
                    <Text style={styles.infoTypeLabel}>Время</Text>
                    <Text style={styles.infoAnswerLabel}>
                      {parseInt(estimated_time.text, 10)} мин.
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: "#f0f0f0"
                    }}
                  >
                    <Text style={styles.infoTypeLabel}>Стоимость доставки</Text>
                    {allVal.payment_type.code === "payme" ? (
                      <Text
                        style={{
                          fontFamily: "bold",
                          color: "#5caa57",
                          fontSize: 14,
                          flex: 1
                        }}
                      >
                        ОПЛАЧЕН
                      </Text>
                    ) : (
                      <Text style={styles.infoAnswerLabel}>
                        {delivery_price} сум
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: "#f0f0f0"
                    }}
                  >
                    <Text style={styles.infoTypeLabel}>Цена заказа</Text>
                    <Text style={styles.infoAnswerLabel}>
                      {allVal.totalPrice} сум
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flex: 0.2,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Button
                    containerStyle={{ marginVertical: 20 }}
                    loading={this.state.loading}
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
                      backgroundColor: "#5caa57",
                      elevation: 0
                    }}
                    title={"Принять заказ"}
                    titleStyle={{
                      fontFamily: "regular",
                      fontSize: 20,
                      color: "white",
                      textAlign: "center"
                    }}
                    onPress={this.handleSubmit}
                    loadingProps={{ size: "small", color: "white" }}
                  />
                </View>
              </View>
            </BottomDrawer>

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
    flex: 1,
    fontSize: 14,
    color: "#acacac",
    fontFamily: "regular"
  },
  infoAnswerLabel: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    fontFamily: "regular"
  }
});

export default InfoScreen;
