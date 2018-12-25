import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import Home from "../screens/Home";
import Settings from "../screens/Settings";
import Login from "../screens/Login";
import AuthLoading from "../screens/AuthLoading";

const TabNavigator = createBottomTabNavigator({
  Home: { screen: Home },
  Settings: { screen: Settings }
});

const AuthStack = createStackNavigator({ Login: Login });

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
