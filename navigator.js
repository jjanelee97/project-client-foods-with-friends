import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, StyleSheet, NavigatorIOS } from 'react-native';
import SignUp from './components/signup';
import Match from './components/match';
import SignIn from './components/signin';
import Profile from './components/profile';
import { signoutUser } from './actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

class Navigator extends Component {
  constructor(props) {
    super(props);
    this.state = { title: 'Sign Up', component: SignUp };

    this.renderPage = this.renderPage.bind(this);
    this.moveToSignup = this.moveToSignup.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.auth !== nextProps.auth) {
      this.renderPage();
    }
  }

  moveToSignup() {
    return (
      <View style={styles.container}>
        <NavigatorIOS
          style={styles.container}
          translucent={false}
          initialRoute={{
            title: 'Sign Up',
            component: SignUp,
          }}
        />
      </View>
    );
  }

  renderNavigator(title, component) {
    return (
      <View style={styles.container}>
        <NavigatorIOS
          style={styles.container}
          translucent={false}
          initialRoute={{
            title: { title },
            component: { component },
          }}
        />
      </View>
    );
  }

  renderPage() {
    console.log(`check ${this.props.page}`);
    if (this.props.auth && !this.props.page) {
      return (
        <View style={styles.container}>
          <NavigatorIOS
            style={styles.container}
            translucent={false}
            initialRoute={{
              title: 'Get a Match!',
              component: Match,
              rightButtonTitle: 'Sign Out',
              onRightButtonPress: () => {
                this.props.signoutUser();
              },
            }}
          />
        </View>
      );
    } else if (this.props.auth && this.props.page) {
      <View style={styles.container}>
        <Profile />
      </View>;
    } else if (!this.props.auth && !this.props.page) {
      return (
        <View style={styles.container}>
          <SignIn />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <SignUp />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderPage()}
      </View>
    );
  }
}

const mapStateToProps = state => (
  {
    auth: state.auth.authenticated,
    page: state.auth.page,
  }
);

const mapDispatchToProps = dispatch => (
  {
    signoutUser: () => dispatch(signoutUser()),
  }
);

export default (connect(mapStateToProps,
  mapDispatchToProps)(Navigator));
