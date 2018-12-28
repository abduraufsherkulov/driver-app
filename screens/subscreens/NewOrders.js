import React from "react";
import { SafeAreaView } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import {
  AsyncStorage,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Platform
} from "react-native";

import axios from "axios";
import HomeLists from "./newOrders/HomeLists";

const isAndroid = Platform.OS === "android";

class NewOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      openUp: "",
      id: ""
    };
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  async componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content");
      isAndroid && StatusBar.setBackgroundColor("#8ac53f");
    });
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
        // console.log(response.data.orders);
      })
      .catch(error => {
        console.log(error.response, "error");
      });
  }

  handlePress = () => {
    this.props.navigation.navigate("InfoScreen");
  };

  static navigationOptions = {
    tabBarLabel: "Заказы",
    tabBarIcon: ({ tintColor, focused, horizontal }) => (
      <Ionicons
        name={focused ? "ios-home" : "ios-home-outline"}
        size={horizontal ? 20 : 26}
        style={{ color: tintColor }}
      />
    )
  };
  render() {
    return (
      <SafeAreaView forceInset={{ horizontal: "always", top: "always" }}>
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    marginTop: 0,
    borderColor: "#FD6B78",
    backgroundColor: "#fff"
  }
});

export default NewOrders;
