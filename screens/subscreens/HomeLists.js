import React, { Component } from "react";

import moment from "moment";
import {
  Text,
  Card,
  Tile,
  Icon,
  ListItem,
  Avatar
} from "react-native-elements";

class HomeLists extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { entity_name, updated_at, period } = this.props;
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
      <ListItem
        onPress={this.handlePress}
        title={entity_name}
        subtitle={status}
        chevron
        bottomDivider
      />
    );
  }
}

export default HomeLists;
