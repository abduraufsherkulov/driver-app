import React, { Component } from "react";
import { StatusBar, Platform, AsyncStorage } from "react-native";
import { Text } from "react-native-elements";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import axios from "axios";

import Home from "../screens/Home";
import Dashboard from "../screens/Dashboard";
import Login from "../screens/Login";
import AuthLoading from "../screens/AuthLoading";
import MyOrders from "../screens/subscreens/MyOrders";
import NewOrders from "../screens/subscreens/NewOrders";
import InfoScreen from "../screens/InfoScreen";
import MyInfoScreen from "../screens/MyInfoScreen";
import { Font } from "expo";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
const isAndroid = Platform.OS === "android";

const OrderInfo = createStackNavigator({
  MainOrders: {
    screen: NewOrders,
    navigationOptions: {
      title: "Главная",
      header: null
    }
  },
  InfoScreen: { screen: InfoScreen }
});

const MyOrderInfo = createStackNavigator({
  MyMainOrders: {
    screen: MyOrders,
    navigationOptions: {
      title: "1233",
      header: null
    }
  },
  MyInfoScreen: { screen: MyInfoScreen }
});

class NewOrdersTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text>
        {this.state.fontLoaded ? (
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 18,
              color: "white"
            }}
          >
            {"Заказы".toUpperCase()}
          </Text>
        ) : null}
      </Text>
    );
  }
}

class MyOrdersTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text>
        {this.state.fontLoaded ? (
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 18,
              color: "white"
            }}
          >
            {"Мои заказы".toUpperCase()}
          </Text>
        ) : null}
      </Text>
    );
  }
}
const HomeTabs = createMaterialTopTabNavigator(
  {
    NewOrders: {
      screen: OrderInfo,
      navigationOptions: {
        tabBarLabel: <NewOrdersTitle />
      }
    },
    MyOrders: {
      screen: MyOrderInfo,
      navigationOptions: {
        tabBarLabel: <MyOrdersTitle />
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: "#8ac53f",
        paddingVertical: 10
      },
      labelStyle: { fontSize: 18 }
    }
  }
);

class MaterialTopTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrdersList: [],
      myOrdersList: [],

      fontLoaded: false
    };
  }

  async componentDidMount() {
    this.loadToAction();

    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }

  loadToAction = async () => {
    let token = await AsyncStorage.getItem("access_token");
    const urlOrders = "https://api.delivera.uz/drivers/orders";
    axios({
      method: "get",
      url: urlOrders,
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
          newOrdersList: response.data.orders
        });
      })
      .catch(error => {
        console.log(error.response, "error");
      });
    const urlMyOrders = "https://api.delivera.uz/drivers/my-orders";
    axios({
      method: "get",
      url: urlMyOrders,
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
          myOrdersList: response.data.orders
        });
        // console.log(response.data.orders);
      })
      .catch(error => {
        console.log(error.response, "error");
      });
  };
  loadToMyOrders = async () => {
    let token = await AsyncStorage.getItem("access_token");
    const urlMyOrders = "https://api.delivera.uz/drivers/my-orders";
    axios({
      method: "get",
      url: urlMyOrders,
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
          myOrdersList: response.data.orders
        });
        // console.log(response.data.orders);
      })
      .catch(error => {
        console.log(error.response, "error");
      });
  };

  static router = HomeTabs.router;

  render() {
    return (
      <HomeTabs
        screenProps={{
          newOrdersList: this.state.newOrdersList,
          myOrdersList: this.state.myOrdersList,
          acceptNewOrder: this.loadToAction,
          getFromRest: this.loadToMyOrders
        }}
        navigation={this.props.navigation}
      />
    );
  }
}

class MaterialTopTabsTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center" }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 15,
              color: this.props.focusColor,
              alignSelf: "center"
            }}
          >
            {"Главная".toUpperCase()}
          </Text>
        ) : null}
      </Text>
    );
  }
}

class DashboardTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center" }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 15,
              color: this.props.focusColor,
              alignSelf: "center"
            }}
          >
            {"Настройки".toUpperCase()}
          </Text>
        ) : null}
      </Text>
    );
  }
}
const TabNavigator = createBottomTabNavigator(
  {
    Main: {
      screen: MaterialTopTabs,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <MaterialTopTabsTitle focusColor={focused ? "#8ac53f" : "grey"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => (
          <MaterialCommunityIcons
            name={focused ? "home-map-marker" : "home-outline"}
            size={horizontal ? 20 : 26}
            style={{ color: tintColor }}
          />
        )
      }
    },
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <DashboardTitle focusColor={focused ? "#8ac53f" : "grey"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => {
          return (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={horizontal ? 20 : 26}
              style={{ color: tintColor }}
            />
          );
        }
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "#8ac53f",
      inactiveTintColor: "gray"
    }
  }
);

//const AuthStack = createStackNavigator({ Login: Login });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      App: TabNavigator,
      Auth: Login
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
