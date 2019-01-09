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
import { Button } from "react-native-elements";

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

  handlePress = () => {
    this.props.navigation.navigate("InfoScreen", {});
  };

  render() {
    return (
      <SafeAreaView forceInset={{ horizontal: "always", top: "always" }}>
        <ScrollView>
          <View style={styles.list}>
            {this.props.screenProps.newOrdersList.map((l, i) => (
              <HomeLists
                handlePress={this.handlePress}
                key={l.id}
                updated_at={l.updated_at}
                entity_name={l.entity.name}
                id={l.id}
                period={l.period}
                nav={this.props.navigation}
                allProps={l}
                acceptNewOrder={this.props.screenProps.acceptNewOrder}
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
