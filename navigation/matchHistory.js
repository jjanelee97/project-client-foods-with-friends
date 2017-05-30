import React, { Component } from 'react';
import { NavigatorIOS, Image } from 'react-native';

import MatchHistoryPage from '../containers/matchHistoryPage';

class MatchHistory extends Component {
  static navigationOptions = {
    tabBarLabel: 'My Matches',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../imgs/list-menu.png')}
      />
   ),
  };

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: MatchHistoryPage,
          title: 'My Matches',
          translucent: false,
          passProps: {},
        }}
        style={{ flex: 1 }}
        barTintColor="#f3f3f3"
        tintColor="#008888"
      />
    );
  }
}

export default MatchHistory;
