import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  Animated
} from "react-native";
import Navigator from "./config/router";

import * as Animatable from "react-native-animatable";
MyCustomComponent = Animatable.createAnimatableComponent(Image);

import { Asset, AppLoading, SplashScreen } from "expo";
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import {decode, encode} from 'base-64'

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

class App extends React.Component {
  state = {
    isSplashReady: false,
    isAppReady: false,

    isLoadingComplete: false,
    splashAnimation: new Animated.Value(0.01),
    splashAnimationComplete: false
  };

  componentDidMount() {
    SplashScreen.preventAutoHide();
    this._loadAsync();
  }
  _loadAsync = async () => {
    try {
      await this._loadResourcesAsync();
    } catch (e) {
      this._handleLoadingError(e);
    } finally {
      this._handleFinishLoading();
    }
  };
  render() {
    if (!this.state.isLoadingComplete) {
      return <View />;
    }
    return (
      <View style={styles.bodyPart}>
        <Navigator />

        {this._maybeRenderLoadingImage()}
      </View>
    );
  }
  _maybeRenderLoadingImage = () => {
    if (this.state.splashAnimationComplete) {
      return null;
    }

    return (
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          opacity: this.state.splashAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          })
        }}
      >
        <Animated.Image
          source={require("./assets/splash.png")}
          style={{
            width: undefined,
            height: undefined,
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            resizeMode: "contain",
            transform: [
              {
                scale: this.state.splashAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 4]
                })
              }
            ]
          }}
          onLoadEnd={this._animateOut}
        />
      </Animated.View>
    );
  };
  _animateOut = () => {
    SplashScreen.hide();
    Animated.timing(this.state.splashAnimation, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true
    }).start(() => {
      this.setState({ splashAnimationComplete: true });
    });
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      // Asset.loadAsync([
      //   require("./assets/images/logo-evos.png"),
      //   require("./assets/images/wallpaper_3.jpg")
      // ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        regular: require("./assets/fonts/GoogleSans-Regular.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  // _cacheSplashResourcesAsync = async () => {
  //   const png = require("./assets/splash.png");
  //   return Asset.fromModule(png).downloadAsync();
  // };

  // _cacheResourcesAsync = async () => {
  //   SplashScreen.hide();
  //   const images = [
  // require("./assets/images/logo-evos.png"),
  // require("./assets/images/wallpaper_3.jpg")
  //   ];

  //   const cacheImages = images.map(image => {
  //     return Asset.fromModule(image).downloadAsync();
  //   });

  //   await Promise.all(cacheImages);
  //   this.setState({ isAppReady: true });
  // };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  bodyPart: {
    flex: 1
    //paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
  },
  statusBar: {
    backgroundColor: "white",
    height: Constants.statusBarHeight
  }
});

export default App;
