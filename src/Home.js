import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  Button,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import upIcon from '../icons/arrow_up.png';
import commentIcon from '../icons/comment.png';


export default class Home extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    params = navigation.state.params;
    return {
      title: params && params.list || '',
    };
  };

  state = { list: 'hot' };

  render() {
    return (
      <View style={{flex: 1}}>
        <Button onPress={this._onPress.bind(this)} title={this.state.list} />
        <List list={this.state.list} />
      </View>
    );
  }

  _onPress() {
    let list;
    switch(this.state.list) {
       case 'hot': list = 'new'; break;
       case 'new': list = 'rising'; break;
       case 'rising': list = 'controversial'; break;
       case 'controversial': list = 'top'; break;
       default: list = 'hot'; break;
    }
    this.setState({ list });
  }
}


class List extends Component {
  static styles = StyleSheet.create({
    container: {
      flex: 1,
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
  });

  state = {
    threads: [],
    threadIDs: {},
    after: undefined,
    fetching: false,
  };

  componentWillMount() {
    this._fetchThreads();
  }

  componentWillReceiveProps(newProps) {
    if(newProps.list !== this.props.list) {
      this.setState({
        threads: [],
        threadIDs: {},
        after: undefined,
        fetching: false,
      });
      this._fetchThreads();
    }
  }

  render() {
    return (
      <View style={{ flex :1 }}>
        <FlatList
          ref={ref => this.list = ref}
          style={List.styles.container}
          data={this.state.threads}
          onEndReached={this._fetchThreads.bind(this)}
          keyExtractor={(item, index) => item.data && item.data.name}
          renderItem={({ item }) => <ListItem item={item} />}
          ItemSeparatorComponent={ListItemSeparator}
        />
        <TouchableOpacity onPress={this._scrollToTop.bind(this)}>
          <View style={List.styles.toTop}>
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
        `${this.props.list}.json?raw_json=1` +
        (this.state.after ? `&after=${this.state.after}` : '');
      fetch(url)
      .then(response => response.json())
      .then(json => {
        let threadIDs = this.state.threadIDs;
        const newThreads = json.data.children.filter(item => {
          if(threadIDs[item.data.name]) {
            return false;
          }
          threadIDs[item.data.name] = true;
          return true;
        });
        this.setState({
          threads: this.state.threads.concat(newThreads),
          threadIDs: threadIDs,
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


// const ListsNavigator = StackNavigator({
//   hot: { screen: List },
//   new: { screen: List },
//   rising: { screen: List },
//   controversial: { screen: List },
//   top: { screen: List }
// }, {
//   headerMode: 'none',
//   initialRouteParams: {
//     list: 'hot'
//   }
// })
// export default ListsNavigator;


  //////////////////////////////////////////////////
  //  IMAGE Title should go here and will wrap if //
  //  IMAGE necessary (domain)                    //
  //  IMAGE                                       //
  //                                              //
  //  User                                  Score //
  //  Comment Count                     Subreddit //
  //////////////////////////////////////////////////
class ListItem extends PureComponent {
  static styles = StyleSheet.create({
    card: {
      minHeight: 76,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: '#e3e3e3',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#cdcdcd',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    titleRow: {
      flexDirection: 'row',
    },
    titleText: {
      flex: 1,
      fontSize: 16,
    },
    unimportantText: {
      fontSize: 12,
    },
  });

  render() {
    const { data } = this.props.item;
    const image = data.preview && data.preview.enabled
      ? <Image
          source={{
            uri: data.preview.images[0].resolutions[0].url,
            width: 60,
            height: 60,
            resizeMode: 'cover'
          }}
          style={{ marginRight: 8 }} />
      : null;
    return (
      <View style={ListItem.styles.card}>
        <View style={ListItem.styles.titleRow}>
          {image}
          <View>
            <Text style={ListItem.styles.titleText}>{data.title}</Text>
            {data.domain ? <Text style={ListItem.styles.unimportantText}>{` - (${data.domain})`}</Text> : null}
          </View>
        </View>
        <View style={ListItem.styles.row}>
          <Text style={ListItem.styles.unimportantText}>{`u/${data.author}`}</Text>
          <Text style={ListItem.styles.unimportantText}>{data.score}</Text>
        </View>
        <View style={ListItem.styles.row}>
          <Text style={ListItem.styles.unimportantText}>{`${data.num_comments} comments`}</Text>
          <Text style={ListItem.styles.unimportantText}>{data.subreddit_name_prefixed}</Text>
        </View>
      </View>
    );
  }
}


class ListItemSeparator extends Component {
  render() {
    return <View style={{ height: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#757575' }} />;
  }
}