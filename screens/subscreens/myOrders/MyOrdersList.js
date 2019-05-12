import React, { Component } from "react";

import moment from "moment";
import { Card, Tile, ListItem, Avatar, Input } from "react-native-elements";
import { Text, View, Stylesheet, Image } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Font } from "expo";
import MyOrdersModal from "./MyOrdersModal";
import TouchableScale from "react-native-touchable-scale";
import {
  TwoPoints,
  SmallCar,
  DollarCoin
} from "../../../assets/images/MainSvg";

class MyOrdersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      fontLoaded: false
    };
  }
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

  handlePress = () => {
    // console.log(this.props.nav);
    const { allProps } = this.props;
    this.props.nav.navigate("MyInfoScreen", {
      all: allProps,
      nav: this.props.nav,
      getFromRest: this.props.getFromRest
    });
  };
  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../../../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../../../assets/fonts/GoogleSans-Medium.ttf"),
      bold: require("../../../assets/fonts/GoogleSans-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    const { id, handlePress, entity_name, allProps } = this.props;
    const { food_accepted_at, period } = allProps;
    let time_status;
    //current time
    let now = moment();
    //the time when the food will be ready
    let readyTime = moment(food_accepted_at).add(+period, "minutes");
    //the difference between readyTime and Now
    let pickTime = moment.duration(readyTime.diff(now));
    //timeLeft in minutes
    let timeLeft = +pickTime.asMinutes().toFixed(0);
    // if time left is less than 0, print order ready

    if (timeLeft > 0) {
      time_status = (
        <Text
          style={{
            fontFamily: "medium",
            color: "#5caa57",
            borderColor: "#5caa57",
            borderWidth: 1,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            fontSize: 14
          }}
        >
          {timeLeft} мин.
        </Text>
      );
    } else {
      time_status = (
        <Text
          style={{
            fontFamily: "medium",
            color: "white",
            backgroundColor: "#5caa57",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            fontSize: 14
          }}
        >
          Готово
        </Text>
      );
    }
    // console.log(this.props.allProps);
    return (
      <React.Fragment>
        {this.state.fontLoaded ? (
          <View
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderRadius: 2,
              borderColor: "#ddd",
              borderBottomWidth: 0,
              elevation: 1,
              marginHorizontal: 20,
              marginTop: 15
            }}
          >
            <ListItem
              scaleProps={{
                friction: 90,
                tension: 100,
                activeScale: 0.95
              }}
              linearGradientProps={{
                colors: ["#fff", "#fff"],
                start: [1, 0],
                end: [0.2, 0]
              }}
              containerStyle={{
                padding: 9
              }}
              onPress={this.handlePress}
              title={
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: 15
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "medium",
                        fontSize: 20
                      }}
                    >
                      {this.props.allProps.user.name.first_name}
                      {/* {"  "} {this.props.allProps.user.name.last_name} */}
                    </Text>
                    {time_status}
                  </View>
                  <View
                    style={{ flex: 1, flexDirection: "row", paddingBottom: 9 }}
                  >
                    <View
                      style={{
                        flex: 0.35,
                        flexDirection: "row",
                        alignItems: "flex-end"
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "medium",
                          color: "#848484",
                          fontSize: 62,
                          marginBottom: -10
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>≈</Text>
                        {Math.round(this.props.allProps.user.delivery_distance)}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "medium",
                          fontSize: 14,
                          color: "#848484"
                        }}
                      >
                        KM
                      </Text>
                    </View>
                    <View style={{ flex: 0.1 }}>
                      <TwoPoints />
                    </View>
                    <View
                      style={{
                        flex: 0.55,
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "medium",
                          fontSize: 12,
                          color: "#848484"
                        }}
                      >
                      {this.props.allProps.entity.name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "medium",
                          fontSize: 12,
                          color: "#848484"
                        }}
                      >
                      {this.props.allProps.user.delivery_text}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderColor: "#d9d9d9",
                      borderTopWidth: 1,
                      paddingTop: 9
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View style={{ paddingRight: 9 }}>
                        <SmallCar />
                      </View>
                      <Text
                        style={{
                          fontFamily: "bold",
                          color: "gray",
                          fontSize: 14
                        }}
                      >
                        {this.props.allProps.user.delivery_price} сум
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View style={{ paddingRight: 9 }}>
                        <DollarCoin />
                      </View>
                      {this.props.allProps.payment_type.code === "payme" ? (
                        <Text
                          style={{
                            fontFamily: "bold",
                            color: "#5caa57",
                            fontSize: 14
                          }}
                        >
                          ОПЛАЧЕН
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontFamily: "bold",
                            color: "gray",
                            fontSize: 14
                          }}
                        >
                          {this.props.allProps.totalPrice} сум
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              }
              // subtitle={
              // }
            />
          </View>
        ) : null}
      </React.Fragment>
    );
  }
}

export default MyOrdersList;
