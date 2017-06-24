import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

class List extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: navigation.state.params.list
    }
  };

  state = {
    threads: [],
    after: undefined,
  };

  componentWillMount() {
    this._fetchList(this.props.navigation.state.params.list);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.navigation.state.routeName !== this.props.navigation.state.routeName) {
      this._fetchList(newProps.navigation.state.params.list);
    }
  }

  render() {
    return (
      <View style={{ flex :1 }}>
        <Text>{'abcd'}</Text>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.threads}
          renderItem={item => <View><Text>{item.data && item.data.title}</Text></View>}
          keyExtractor={item => item.data && item.data.name || 0}
        />
        <Text>{'efgh'}</Text>
      </View>
    );
  }

  _fetchList(listName) {
    fetch(`https://www.reddit.com/${listName}.json?raw_json=1`)
    .then(response => response.json())
    .then(json => {
      this.setState({
        threads: json.data.children,
        after: json.data.after
      });
    })
    .catch(e => console.error(e));
  }
}

const ListsNavigator = StackNavigator({
  hot: { screen: List },
  new: { screen: List },
  rising: { screen: List },
  controversial: { screen: List },
  top: { screen: List }
}, {
  headerMode: 'none',
  initialRouteParams: {
    list: 'hot'
  }
})
export default ListsNavigator;

