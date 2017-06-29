import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Home from './src/Home';

const Navigator = StackNavigator({
  Home: { screen: Home },
});

export default class App extends Component {
  render() {
    return <Navigator />;
  }
}