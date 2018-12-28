import React, { Component } from "react";

import moment from "moment";
import {
  Text,
  Card,
  Tile,
  Icon,
  ListItem,
  Avatar,
  View
} from "react-native-elements";

import MyOrdersModal from "./MyOrdersModal";

class MyOrdersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
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
    console.log(allProps);
    this.props.nav.navigate("MyInfoScreen", {
      all: allProps
    });
  };
  render() {
    const { id, handlePress, entity_name, updated_at, period } = this.props;
    let status;
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
      status = timeLeft;
    } else {
      status = "Заказ уже готова";
    }
    return (
      <React.Fragment>
        <ListItem
          onPress={this.handlePress}
          title={entity_name}
          subtitle={status}
          chevron
          bottomDivider
          buttonGroup={{
            buttons: ["Получил"],
            onPress: this.handleModal
          }}
        />
        <MyOrdersModal
          openUp={this.state.opened}
          closed={this.handleClose}
          order_id={this.props.id}
          entity_name={entity_name}
        />
      </React.Fragment>
    );
  }
}

export default MyOrdersList;
