import React, { Component } from "react";
import { StatusBar, Platform, AsyncStorage, Image } from "react-native";
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
import MyArchive from "../screens/subscreens/MyArchive";
import InfoScreen from "../screens/InfoScreen";
import MyInfoScreen from "../screens/MyInfoScreen";
import MyInfoMapScreen from "../screens/MyInfoMapScreen";
import MyItemsList from "../screens/subscreens/myOrders/MyItemsList";
import { Font } from "expo";
import DummyInfoScreen from "../screens/DummyInfoScreen";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
const isAndroid = Platform.OS === "android";

const DashboardOrderInfo = createStackNavigator({
  Dashboard: {
    screen: Dashboard
  }
});

const OrderInfo = createStackNavigator({
  MainOrders: {
    screen: NewOrders
  },
  InfoScreen: {
    screen: InfoScreen,
    navigationOptions: {
      tabBarVisible: false
    }
  }
});

const MyOrderInfo = createStackNavigator({
  MyMainOrders: {
    screen: MyOrders
  },
  MyInfoScreen: { screen: MyInfoScreen },
  MyInfoMapScreen: {
    screen: MyInfoMapScreen
  },
  MyItemsList: {
    screen: MyItemsList
  }
});

OrderInfo.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === "InfoScreen") {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};
MyOrderInfo.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (
    routeName === "MyInfoScreen" ||
    routeName === "MyInfoMapScreen" ||
    routeName === "MyItemsList"
  ) {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

class MaterialTopTabsTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center", paddingTop: 4 }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 12,
              color: this.props.focusColor
            }}
          >
            {"Главная"}
          </Text>
        ) : null}
      </Text>
    );
  }
}

class ArchiveTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center", paddingTop: 4 }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 12,
              color: this.props.focusColor,
              alignSelf: "center"
            }}
          >
            {"Мои заказы"}
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
      regular: require("../assets/fonts/GoogleSans-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center", paddingTop: 4 }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 12,
              color: this.props.focusColor,
              alignSelf: "center"
            }}
          >
            {"Профиль"}
          </Text>
        ) : null}
      </Text>
    );
  }
}

const MyMainArchive = createStackNavigator({
  MyMainArchive: {
    screen: MyArchive,
    navigationOptions: {
      title: "1233",
      header: null
    }
  },
  DummyInfoScreen: { screen: DummyInfoScreen }
});

const TabNavigator = createBottomTabNavigator(
  {
    Main: {
      screen: OrderInfo,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <MaterialTopTabsTitle focusColor={focused ? "#5caa57" : "#000000"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => (
          <FontAwesome
            name={focused ? "circle" : "circle-thin"}
            size={horizontal ? 20 : 26}
            style={{ color: tintColor }}
          />
        )
      }
    },
    Archive: {
      screen: MyOrderInfo,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <ArchiveTitle focusColor={focused ? "#5caa57" : "#000000"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => {
          return (
            <FontAwesome
              name={focused ? "circle" : "circle-thin"}
              size={horizontal ? 20 : 26}
              style={{ color: tintColor }}
            />
          );
        }
      }
    },
    Dashboard: {
      screen: DashboardOrderInfo,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <DashboardTitle focusColor={focused ? "#5caa57" : "#000000"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => {
          return (
            <FontAwesome
              name={focused ? "circle" : "circle-thin"}
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
      activeTintColor: "#5caa57",
      inactiveTintColor: "gray",
      style: {
        height: 54,
        paddingTop: 8
      }
    },
    navigationOptions: {
      tabBarVisible: false
    }
  }
);

//const AuthStack = createStackNavigator({ Login: Login });

class MaterialTopTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrdersList: [],
      myOrdersList: [],
      refreshing: false,
      fontLoaded: false
    };
  }

  _onRefreshNewOrders = async () => {
    this.setState({ refreshing: true });

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
        // console.log(response.data);
        this.setState({
          newOrdersList: response.data.orders,
          refreshing: false
        });
      })
      .catch(error => {
        console.log(error, "error in orders refresh");
      });
  };

  _onRefreshMyOrders = async () => {
    this.setState({ refreshing: true });

    let token = await AsyncStorage.getItem("access_token");
    const urlOrders = "https://api.delivera.uz/drivers/my-orders";
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
          myOrdersList: response.data.orders,
          refreshing: false
        });
      })
      .catch(error => {
        console.log(error, "error refresh my-orders");
      });
  };

  async componentDidMount() {
    this.loadToAction();

    this.intervaller = setInterval(() => {
      this.loadToAction();
    }, 20000);

    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../assets/fonts/GoogleSans-Medium.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  componentWillUnmount() {
    clearInterval(this.intervaller);
  }
  loadToAction = async () => {
    this.setState({ refreshing: true });
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
        console.log(error, "error");
      });

    const urlMyOrders = "https://api.delivera.uz/drivers/my-orders";
    // console.log(token);
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
        // console.log(response);
        this.setState({
          myOrdersList: response.data.orders,
          refreshing: false
        });
        // console.log(response.data.orders);
      })
      .catch(error => {
        console.log(error, "error in loadtoaction my-orders");
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
        console.log(error, "error in loadtomyorders");
      });
  };

  static router = TabNavigator.router;

  render() {
    return (
      <TabNavigator
        screenProps={{
          refreshState: this.state.refreshing,
          refreshNewOrders: this._onRefreshNewOrders,
          refreshMyOrders: this._onRefreshMyOrders,
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

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      App: MaterialTopTabs,
      Auth: Login
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
