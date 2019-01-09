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
import MyOrdersList from "./myOrders/MyOrdersList";

const isAndroid = Platform.OS === "android";

class MyOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myorders: [],
      openUp: "",
      id: ""
    };
  }

  handlePress = () => {
    this.props.navigation.navigate("MyInfoScreen", {});
  };
  render() {
    return (
      <SafeAreaView forceInset={{ horizontal: "always", top: "always" }}>
        <ScrollView>
          <View style={styles.list}>
            {this.props.screenProps.myOrdersList.map((l, i) => (
              <MyOrdersList
                handlePress={this.handlePress}
                key={l.id}
                updated_at={l.updated_at}
                entity_name={l.entity.name}
                id={l.id}
                period={l.period}
                nav={this.props.navigation}
                allProps={l}
                acceptNewOrder={this.props.screenProps.acceptNewOrder}
                getFromRest={this.props.screenProps.getFromRest}
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

export default MyOrders;
