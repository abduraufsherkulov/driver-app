import React from "react";
import moment from "moment";
import {
  AsyncStorage,
  View,
  ScrollView,
  StyleSheet,
  Image,
  ListView
} from "react-native";

import axios from "axios";
import HomeLists from "./subscreens/newOrders/HomeLists";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
  }
  async componentDidMount() {
    let token = await AsyncStorage.getItem("access_token");
    const url = "https://api.delivera.uz/drivers/orders";
    axios({
      method: "get",
      url: url,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: token
      }
    })
      .then(response => {
        this.setState({
          orders: response.data.orders
        });
        console.log(typeof response.data.orders[0].period);
        console.log(moment(response.data.orders[0].updated_at));
        console.log(
          moment(response.data.orders[0].updated_at).add(20, "minutes")
        );
        console.log(
          moment(response.data.orders[0].updated_at).subtract(20, "minutes")
        );
        let now = moment();
        console.log(now);
      })
      .catch(error => {
        console.log(error.response, "error");
      });
  }

  handlePress = () => console.log("this is an example method");
  render() {
    console.log(this.state.orders);
    return (
      <ScrollView>
        <View style={styles.list}>
          {this.state.orders.map((l, i) => (
            <HomeLists
              handlePress={this.handlePress}
              key={i}
              updated_at={l.updated_at}
              entity_name={l.entity.name}
              id={l.id}
              period={l.period}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    marginTop: 0,
    borderTopWidth: 1,
    borderColor: "#FD6B78",
    backgroundColor: "#fff"
  }
});

export default Home;
