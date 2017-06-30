import React, { Component, PureComponent } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import upIcon from '../icons/arrow_up.png';
import commentIcon from '../icons/comment.png';

export default class List extends Component {
  state = {
    threads: [],
    threadIDs: {},
    after: undefined,
    fetching: false,
    refreshing: false,
  };

  componentWillMount() {
    this._fetchThreads();
  }

  componentWillReceiveProps(newProps) {
    if(newProps.list !== this.props.list) {
      this._fetchThreads(true);
    }
  }

  render() {
    return (
      <View style={{ flex :1 }}>
        <FlatList
          ref={ref => this.list = ref}
          style={styles.container}
          data={this.state.threads}
          onEndReached={this._onEndReached.bind(this)}
          onRefresh={this._onRefresh.bind(this)}
          refreshing={this.state.refreshing}
          keyExtractor={(item, index) => item.data && item.data.name}
          renderItem={({ item }) => <ListItem item={item} />}
          ItemSeparatorComponent={ListItemSeparator}
        />
        <TouchableOpacity onPress={this._scrollToTop.bind(this)}>
          <View style={styles.jumpToTop}>
            <Image source={upIcon} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _fetchThreads(refresh) {
    if(!this.state.fetching || refresh) {
      let nextState = { fetching: true };
      if(refresh) {
        nextState = {
          threads: [],
          threadIDs: {},
          fetching: true,
          after: undefined,
          refreshing: refresh,
        };
      }
      this.setState(nextState);
      const url = 'https://www.reddit.com/' +
        `${this.props.list}.json?raw_json=1` +
        (this.state.after && !refresh ? `&after=${this.state.after}` : '');
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
          refreshing: false,
        });
      })
      .catch(e => console.error(e));
    }
  }

  _onEndReached() {
    this._fetchThreads();
  }

  _onRefresh() {
    this._fetchThreads(true);
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
  //  IMAGE necessary                             //
  //  IMAGE                                       //
  //                                              //
  //  User                                  Score //
  //  Comment Count                     Subreddit //
  //////////////////////////////////////////////////
class ListItem extends PureComponent {
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
          style={{ paddingRight: 8 }} />
      : null;
    return (
      <View style={styles.card}>
        <View style={styles.titleRow}>
          {image}
          <Text style={styles.titleText}>{data.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.unimportantText}>{`u/${data.author}`}</Text>
          <Text style={styles.unimportantText}>{data.score}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.unimportantText}>{`${data.num_comments} comments`}</Text>
          <Text style={styles.unimportantText}>{data.subreddit_name_prefixed}</Text>
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  jumpToTop: {
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
    fontSize: 16,
  },
  unimportantText: {
    fontSize: 12,
  },
});