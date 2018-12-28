import React from "react";
import { StatusBar, Platform } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import Home from "../screens/Home";
import Dashboard from "../screens/Dashboard";
import Login from "../screens/Login";
import AuthLoading from "../screens/AuthLoading";
import MyOrders from "../screens/subscreens/MyOrders";
import NewOrders from "../screens/subscreens/NewOrders";
import InfoScreen from "../screens/InfoScreen";
import MyInfoScreen from "../screens/MyInfoScreen";

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

const HomeTabs = createMaterialTopTabNavigator(
  {
    NewOrders: {
      screen: OrderInfo,
      navigationOptions: {
        title: "Заказы"
      }
    },
    MyOrders: {
      screen: MyOrderInfo,
      navigationOptions: {
        title: "Мои Заказы"
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: "#8ac53f"
      }
    }
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Main: {
      screen: HomeTabs,
      navigationOptions: {
        tabBarLabel: "Главная",
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
        tabBarLabel: "Настройки",
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
