import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import upIcon from '../icons/arrow_up.png';
import commentIcon from '../icons/comment.png';

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

  styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingLeft: 16,
      paddingRight: 16,
    },
    toTop: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 8,
      right: 8,
      width: 40,
      height: 40,
      marginRight: 16,
      marginBottom: 16,
      borderRadius: 20,
      borderWidth: 1,
      backgroundColor: '#ababab',
    },
    toTopText: {
      position: 'relative',
      fontSize: 20,
      top: 4,
      backgroundColor: 'transparent',
    }
  });

  // componentWillReceiveProps(newProps) {
  //   if(newProps.navigation.state.routeName !== this.props.navigation.state.routeName) {
  //     this._fetchList(newProps.navigation.state.params.list);
  //   }
  // }

  render() {
    return (
      <View style={{ flex :1 }}>
        <FlatList
          ref={ref => this.list = ref}
          style={this.styles.container}
          data={this.state.threads}
          onEndReached={this._fetchThreads.bind(this)}
          keyExtractor={(item, index) => item.data && item.data.name}
          renderItem={({ item }) => <ListItem item={item} />}
          ItemSeparatorComponent={ListItemSeparator}
          ListHeaderComponent={ListItemSeparator}
          ListFooterComponent={ListItemSeparator}
        />
        <TouchableOpacity onPress={this._scrollToTop.bind(this)}>
          <View style={this.styles.toTop}>
            <Image source={upIcon} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _fetchThreads() {
    if(!this.state.fetching) {
      this.setState({ fetching: true, });
      const url = 'https://www.reddit.com/' +
        `${this.props.navigation.state.params.list}.json?raw_json=1` +
        (this.state.after ? `&after=${this.state.after}` : '');
      console.log(url);
      fetch(url)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({
          threads: this.state.threads.concat(json.data.children),
          after: json.data.after,
          fetching: false,
        });
      })
      .catch(e => console.error(e));
    }
  }

  _scrollToTop() {
    this.list.scrollToIndex({ index: 0, viewPosition: 1, });
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


class ListItem extends Component {
  styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      padding: 8,
      backgroundColor: '#e3e3e3',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#757575',
      borderRadius: 5,
    },
    leftBlock: {
    },
    centerBlock: {
      flex: 1,
    },
    rightBlock: {
      flexDirection: 'column',
    },
    titleText: {
      fontSize: 16,
    },
    byline: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bylineText: {
      fontSize: 12,
    },
  });

  render() {
    const { data } = this.props.item;
    return (
      <View style={this.styles.card}>
        <View style={this.styles.leftBlock}>
          <Image src={null} />
        </View>
        <View style={this.styles.centerBlock}>
          <View>
            <Text style={this.styles.titleText}>{data.title}</Text>
          </View>
          <View style={this.styles.byline}>
            <Text style={this.styles.bylineText}>{data.author}</Text>
            <Text style={this.styles.bylineText}>{`r/${data.subreddit}`}</Text>
          </View>
        </View>
        <View style={this.styles.rightBlock}>
          <Text>{data.score}</Text>
          <Image source={commentIcon} />
        </View>
      </View>
    );
  }
}


class ListItemSeparator extends Component {
  render() {
    return <View style={{ height: 16 }} />;
  }
}