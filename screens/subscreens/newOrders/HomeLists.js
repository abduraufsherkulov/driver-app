import React, { Component } from "react";

import moment from "moment";
import { Card, Tile, ListItem, Avatar, Input } from "react-native-elements";
import { Text, View, Stylesheet, Image } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Font } from "expo";
import MainModal from "./MainModal";
import TouchableScale from "react-native-touchable-scale";
const two_point = require("../../../assets/images/two_point.png");

class HomeLists extends Component {
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
    const { allProps } = this.props;
    this.props.nav.navigate("InfoScreen", {
      all: allProps,
      acceptNewOrder: this.props.acceptNewOrder,
      getFromRest: this.props.getFromRest,
      nav: this.props.nav
    });
  };
  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../../../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../../../assets/fonts/GoogleSans-Medium.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    const {
      id,
      handlePress,
      entity_name,
      updated_at,
      period,
      allProps
    } = this.props;

    let time_status;
    //current time
    let now = moment();
    //the time when the food will be ready
    let readyTime = moment(updated_at).add(+period, "minutes");
    //the difference between readyTime and Now
    let pickTime = moment.duration(readyTime.diff(now));
    //timeLeft in minutes
    let timeLeft = pickTime.asMinutes().toFixed(0);
    // if time left is less than 0, print order ready

    if (timeLeft > 0) {
      time_status = (
        <Text
          style={{
            fontFamily: "regular",
            backgroundColor: "rgba(216, 121, 112, 1)"
          }}
        >
          {timeLeft}
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
    console.log(this.props.allProps);
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
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.7,
              shadowRadius: 2,
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
                      <Image source={two_point} />
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
                        {this.props.allProps.user.delivery_text}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "medium",
                          fontSize: 12,
                          color: "#848484"
                        }}
                      >
                        {this.props.allProps.entity.name}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",

                      borderColor: "#d9d9d9",
                      borderTopWidth: 1
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "regular",
                        color: "gray",
                        paddingTop: 9
                      }}
                    >
                      {this.props.allProps.user.delivery_price}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "regular",
                        color: "gray",
                        paddingTop: 9
                      }}
                    >
                      {this.props.allProps.user.delivery_price}
                    </Text>
                  </View>
                </View>
              }
              // subtitle={
              // }
            />
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../../../assets/loader.gif")}
            />
          </View>
        )}
      </React.Fragment>
    );
  }
}

export default HomeLists;
