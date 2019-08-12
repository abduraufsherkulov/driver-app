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
  Constants,
  Location,
  Permissions,
  MapView,
  IntentLauncherAndroid
} from "expo";

import { Font } from "expo";

import { EvilIcons } from "@expo/vector-icons";

// import MyOrdersModal from "./subscreens/myOrders/MyOrdersModal";
import { TwoPoints } from "../assets/images/MainSvg";
const PIN_RESTRAUNT = require("../assets/images/restraunt.png");
const two_point = require("../assets/images/two_point.png");

import axios from "axios";
import MyOrdersModal from "./subscreens/myOrders/MyOrdersModal";

const SCREEN_WIDTH = Dimensions.get("window").width;

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
      errorMessage: null,
      fontLoaded: false,
      asyncing: false,
      loading: false,
      order_id: +"",
      opened: false,
      token: "",
      hash: "",
      password: "",
      hash_valid: true
    };
  }

  _pressCall = () => {
    let allVal = this.props.navigation.getParam("all");
    const url = `tel:+${allVal.user.phone}`;
    Linking.openURL(url);
  };

  handleItems = () => {
    let allVal = this.props.navigation.getParam("all");
    let nav = this.props.navigation.getParam("nav");
    nav.navigate("MyItemsList", {
      all: allVal
    });
  };

  handleSubmit = event => {
    let valProps = this.props.navigation.getParam("all");
    const { params } = this.props.navigation.state;
    this.setState({
      loading: true
    });
    if (valProps.status.code === "in_process") {
      const data = JSON.stringify({
        order_id: valProps.id
      });
      const url = "https://api.delivera.uz/drivers/take";

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
          // console.log(response.data);
          if (response.data.reason === "Accepted") {
            params.getFromRest();
            this.setState(
              {
                loading: false
              },
              () => {
                this.props.navigation.goBack();
              }
            );
          }
        })
        .catch(error => {
          console.log(error.response);
        });

      event.preventDefault();
    } else {
      const data = JSON.stringify({
        code: this.state.hash
      });

      const url = "https://api.delivera.uz/drivers/confirm-order";

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
          token: +this.state.token
        }
      })
        .then(response => {
          if (response.data.status === "Success") {
            this.props.closed();
            this.props.getFromRest();
            this.setState({
              loading: false
            });
          } else if (response.data.status === "Fail") {
            this.setState({
              hash_valid: false,
              loading: false
            });
          }
        })
        .catch(error => {
          console.log(error.response);
        });

      event.preventDefault();
    }
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

    this.setState({ fontLoaded: true, token: token, order_id: order_id });
  }

  handlePress = () => {
    let allVal = this.props.navigation.getParam("all");
    this.props.nav.navigate(MainModal, {
      all: allVal
    });
  };
  handleNavigate = () => {
    let allVal = this.props.navigation.getParam("all");
    let nav = this.props.navigation.getParam("nav");
    nav.navigate("MyInfoMapScreen", {
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
  render() {
    // console.log(this.props.navigation.state.routeName);
    let allVal = this.props.navigation.getParam("all");
    let text = "Waiting..";
    let { delivery_price, name, phone } = allVal.user;

    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    return (
      <View style={{ flex: 1 }}>
        {this.state.fontLoaded ? (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View
                style={{
                  flex: 0.37,
                  justifyContent: "center",
                  marginHorizontal: 26
                }}
              >
                <View
                  style={{
                    flex: 0.2,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "medium",
                      fontSize: 18,
                      color: "#333333"
                    }}
                  >
                    Адрес:
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.4,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <View style={{ flex: 0.1 }}>
                    <TwoPoints />
                  </View>
                  <View
                    style={{
                      flex: 0.9,
                      flexDirection: "column"
                    }}
                  >
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <Text
                        style={{
                          fontFamily: "regular",
                          fontSize: 12,
                          color: "#848484"
                        }}
                      >
                        {allVal.user.delivery_text}
                      </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <Text
                        style={{
                          fontFamily: "regular",
                          fontSize: 12,
                          color: "#848484"
                        }}
                      >
                        {allVal.entity.name}
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
                    // containerStyle={{ marginVertical: 20 }}
                    onPress={this.handleNavigate}
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
                      backgroundColor: "transparent",
                      elevation: 0,
                      borderWidth: 1,
                      borderColor: "#5caa57"
                    }}
                    title={"Показать на карте"}
                    titleStyle={{
                      fontFamily: "regular",
                      fontSize: 20,
                      color: "#5caa57",
                      textAlign: "center"
                    }}
                    // onPress={this.handleSubmit}
                    loadingProps={{ size: "small", color: "white" }}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 0.5,
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
                    borderBottomColor: "#f0f0f0",
                    borderTopColor: "#f0f0f0"
                  }}
                >
                  <Text style={styles.infoTypeLabel}>Имя клиента</Text>
                  <Text style={styles.infoAnswerLabel}>{name.first_name}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    borderTopWidth: 1,
                    borderBottomColor: "#f0f0f0",
                    borderTopColor: "#f0f0f0",
                    justifyContent: "flex-start"
                  }}
                >
                  <Text style={styles.infoTypeLabel}>Тел. номер</Text>
                  <Text style={styles.phone} onPress={this._pressCall}>
                    +{phone}
                  </Text>
                </View>
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
                  <Text style={styles.infoTypeLabel}>Стоимость доставки</Text>
                  <Text style={styles.infoAnswerLabel}>
                    {delivery_price} Сум
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
                  <Text style={styles.infoTypeLabel}>Стоимость заказа</Text>
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
                  <Text style={styles.infoTypeLabel}>Время заказа</Text>
                  <Text style={styles.infoAnswerLabel}>
                    {allVal.created_at}
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
                  <Text
                    style={{
                      flex: 0.5,
                      fontSize: 14,
                      color: "#acacac",
                      fontFamily: "regular"
                    }}
                  >
                    Состав заказа
                  </Text>
                  <Text
                    onPress={this.handleItems}
                    style={{
                      flex: 0.4,
                      fontSize: 14,
                      color: "#333333",
                      fontFamily: "regular"
                    }}
                  >
                    Состав заказа
                  </Text>
                  <Text style={{ flex: 0.1 }}>
                    <EvilIcons name="chevron-right" size={20} />
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 0.13,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {allVal.status.code === "in_process" ? (
                  <Button
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
                    title={"Получил заказ"}
                    titleStyle={{
                      fontFamily: "regular",
                      fontSize: 20,
                      color: "white",
                      textAlign: "center"
                    }}
                    onPress={this.handleSubmit}
                    loadingProps={{ size: "small", color: "white" }}
                  />
                ) : (
                  <Button
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
                    title={"Подтвердить"}
                    titleStyle={{
                      fontFamily: "regular",
                      fontSize: 20,
                      color: "white",
                      textAlign: "center"
                    }}
                    onPress={this.handleModal}
                    loadingProps={{ size: "small", color: "white" }}
                  />
                )}
              </View>
            </View>

            <MyOrdersModal
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
  phone: {
    flex: 1,
    color: "#5caa57",
    fontSize: 14,
    textDecorationColor: "#5caa57",
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    fontFamily: "regular"
  },
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
