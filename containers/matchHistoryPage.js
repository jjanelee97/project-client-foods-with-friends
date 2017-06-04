/*
List of people the user has been matched with
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, ListView, ScrollView } from 'react-native';
import ChatPage from '../components/chatPage';
import MatchedPerson from '../components/matchedPerson';
import MatchProfile from '../containers/matchProfile';
import { getMatchHistory } from '../actions';

class MatchHistoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      change: true,
      refreshing: false,
      history: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: () => true,
      }),
    };

    this.showProfileDetail = this.showProfileDetail.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  componentDidMount() {
    this.props.getMatchHistory();
  }

  componentWillReceiveProps(nextProps) {
    const historyReverse = [...nextProps.history];
    const history = historyReverse.reverse();
    const check = [];
    const people = [];
    for (let i = 0; i < history.length; i += 1) {
      if (people.length === 0 || !check.includes(history[i].User)) {
        people.push({ User: history[i].User, match_time: history[i].match_time });
        check.push(history[i].User);
      }
    }
    console.log(people);
    this.setState({ history: people });
    console.log(historyReverse);
    if (history) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state.history),
      });
    }
  }

  onRefresh() {
    // this.setState({ refreshing: true });
    this.componentWillReceiveProps().then(() => {
      this.setState({ refreshing: false });
    });
  }

  fetchData() {
    this.setState({ change: !this.state.change });
  }

  // go to chat with the matched person, which can lead to their profile
  showProfileDetail(person) {
    this.props.navigator.push({
      showTabBar: false,
      translucent: false,
      tabBarVisible: false,
      title: 'Chat',
      component: ChatPage,
      passProps: person,
      rightButtonIcon: require('../imgs/user.png'),
      onRightButtonPress: () => {
        this.props.navigator.push({
          translucent: 'false',
          title: 'Match Profile',
          component: MatchProfile,
          tabBarVisible: false,
          passProps: person,
        });
      },
    });
  }

  // render each matched person cell in the chat list
  renderCell(person) {
    return (
      <TouchableOpacity onPress={() => { this.showProfileDetail(person); }} underlayColor="#dddddd">
        <MatchedPerson userid={person.User} time={person.match_time} />
      </TouchableOpacity>
    );
  }

  renderList() {
    let matches = [];
    if (this.state.history === null) {
      return (
        <View><Text>Loading...</Text></View>
      );
    } else {
      matches = this.state.history.map((person) => {
        return (
          <TouchableOpacity key={person.User} onPress={() => { this.showProfileDetail(person); }} underlayColor="#dddddd">
            <MatchedPerson userid={person.User} time={person.match_time} />
          </TouchableOpacity>
        );
      });
    }
    return (
      <View>
        {matches}
      </View>
    );
  }

  render() {
    return (
      <ScrollView>
        {this.renderList()}
      </ScrollView>
    );
  }
}

//   render() {
//     const ds = new ListView.DataSource({ rowHasChanged: () => true });
//     if (this.state.history === null) {
//       return (
//         <View><Text>Loading...</Text></View>
//       );
//     } else if (this.state.history.length === 0) {
//       return (
//         <View style={styles.empty}><Text style={styles.emptyText}>You have not matched with anyone yet... come back later!</Text></View>
//       );
//     } else {
//       return (
//         <View style={styles.view}>
//           <ListView
//             removeClippedSubviews={false}
//             dataSource={ds.cloneWithRows(this.state.history)}
//             renderRow={person => <View>{this.renderCell(person)}</View>}
//             style={styles.listView}
//           />
//         </View>
//       );
//     }
//   }
// }

const mapStateToProps = state => (
  {
    history: state.match.receivedHistory,
  }
);

const mapDispatchToProps = dispatch => (
  {
    getMatchHistory: () => dispatch(getMatchHistory()),
  }
);

export default (connect(mapStateToProps,
  mapDispatchToProps)(MatchHistoryPage));
