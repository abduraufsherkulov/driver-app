import React from "react";
import { SafeAreaView } from "react-navigation";
import moment from "moment";
import {
  AsyncStorage,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import axios from "axios";
import MyOrdersList from "./myOrders/MyOrdersList";
import { EvilIcons } from "@expo/vector-icons";
import { Text } from "react-native-elements";

import * as Font from 'expo-font';

const isAndroid = Platform.OS === "android";

import { NavigationLogo } from "../../assets/images/MainSvg";

class MyOrdersTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <NavigationLogo />
      </View>
    );
  }
}
class MyOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      openUp: "",
      id: "",
      refreshing: false,
      fontLoaded: false
    };
  }

  handlePress = () => {
    this.props.navigation.navigate("InfoScreen", {});
  };
  handleHistory = () => {
    console.log("clicked");
  };
  _renderItem = ({ item }) => (
    <View style={styles.list}>
      <MyOrdersList
        handlePress={this.handlePress}
        key={item.id}
        nav={this.props.navigation}
        allProps={item}
        getFromRest={this.props.screenProps.getFromRest}
      />
      <Text />
    </View>
  );
  _keyExtractor = (item, index) => item.id.toString();
  async componentDidMount() {
    await Font.loadAsync({
      medium: require("../../assets/fonts/GoogleSans-Medium.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: <MyOrdersTitle />,
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
    let listHeaderComponent = (
      <View
        style={{
          width: "100%",
          marginHorizontal: 20,
          marginTop: 11
        }}
      >
        <Text style={{ fontFamily: "medium", fontSize: 18, color: "#848484" }}>
          Активные заказы
        </Text>
      </View>
    );
    let listFooterComponent = (
      <View
        style={{
          width: "100%",
          height: 49,
          paddingHorizontal: 20,
          backgroundColor: "rgba(242, 242, 242, 0.7)",
          borderWidth: 1,
          borderColor: "rgba(112, 112, 112, 0.1)"
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, alignItems: "center", flexDirection: "row" }}
          onPress={this.handleHistory}
        >
          <Text
            style={{
              flex: 0.9,
              fontFamily: "medium",
              fontSize: 14,
              color: "#707070"
            }}
          >
            Посмотреть историю
          </Text>
          <Text
            style={{
              flex: 0.1,
              justifyContent: "center",
              flexDirection: "row",
              textAlign: "right"
            }}
          >
            <EvilIcons name="chevron-right" size={20} />
          </Text>
        </TouchableOpacity>
      </View>
    );
    return (
      <SafeAreaView forceInset={{ horizontal: "always", top: "never" }}>
        <FlatList
          data={this.props.screenProps.myOrdersList}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          initialScrollIndex={0}
          initialNumToRender={3}
          ListFooterComponent={listFooterComponent}
          ListHeaderComponent={listHeaderComponent}
          refreshControl={
            <RefreshControl
              refreshing={this.props.screenProps.refreshState}
              onRefresh={this.props.screenProps.refreshMyOrders}
              enabled={true}
              colors={["#8ac53f"]}
              progressBackgroundColor="white"
              size={200}
              tintColor="yellow"
              title="loading"
            />
          }
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1,
    marginTop: 0,
    borderColor: "#FD6B78",
    backgroundColor: "#fff"
  }
});

export default MyOrders;
