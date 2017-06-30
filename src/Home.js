import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import List from './List';

export default class Home extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    params = navigation.state.params;
    return {
      title: params && params.list,
    };
  };

  constructor(...args) {
    super(...args);
    this.state = { list: this.props.navigation.state.list || 'hot' };
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this._cycleList.bind(this)} title={this.state.list || ''} />
        <List list={this.state.list} />
      </View>
    );
  }

  _cycleList() {
    let list;
    switch(this.state.list) {
       case 'hot': list = 'new'; break;
       case 'new': list = 'rising'; break;
       case 'rising': list = 'controversial'; break;
       case 'controversial': list = 'top'; break;
       default: list = 'hot'; break;
    }
    this.setState({ list });
    this.props.navigation.setParams({ list: list });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});