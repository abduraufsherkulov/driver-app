import React, { Component } from "react";

import moment from "moment";
import {
  Text,
  Card,
  Tile,
  ListItem,
  Avatar,
  View,
  Input
} from "react-native-elements";

import { Font } from "expo";
import MainModal from "./MainModal";

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
      all: allProps
    });
  };
  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../../../assets/fonts/Georgia.ttf"),
      regular: require("../../../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../../../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../../../assets/fonts/Montserrat-Bold.ttf")
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
          style={{ fontFamily: "regular", color: "rgba(216, 121, 112, 1)" }}
        >
          {timeLeft}
        </Text>
      );
    } else {
      time_status = (
        <Text style={{ fontFamily: "regular", color: "#8ac53f" }}>
          Заказ уже готова
        </Text>
      );
    }

    return (
      <React.Fragment>
        {this.state.fontLoaded ? (
          <React.Fragment>
            <ListItem
              onPress={this.handlePress}
              title={
                <React.Fragment>
                  <Text style={{ fontFamily: "regular" }}>{entity_name}</Text>
                  <Text>
                    <Text style={{ fontFamily: "regular" }}>Сумма: </Text>
                    <Text
                      style={{
                        fontFamily: "regular",
                        color: "#8ac53f",
                        fontSize: 20
                      }}
                    >
                      {this.props.allProps.user.delivery_price}
                    </Text>{" "}
                    Сум
                  </Text>
                </React.Fragment>
              }
              subtitle={time_status}
              chevron
              bottomDivider
              buttonGroup={{
                buttons: ["Принят"],
                onPress: this.handleModal,
                buttonStyle: {
                  backgroundColor: "#8ac53f"
                },
                containerStyle: {
                  height: 70,
                  borderRadius: 40
                },
                textStyle: {
                  color: "white",
                  fontSize: 20,
                  fontFamily: "regular"
                },
                style: {
                  fontSize: 20,
                  color: "red"
                }
              }}
            />
            <MainModal
              openUp={this.state.opened}
              closed={this.handleClose}
              order_id={this.props.id}
              entity_name={entity_name}
              acceptNewOrder={this.props.acceptNewOrder}
              getFromRest={this.props.getFromRest}
              all={this.props.allProps}
            />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default HomeLists;
