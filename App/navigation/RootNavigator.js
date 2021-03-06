import React, { Component } from 'react';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import HomeNavigator from './HomeNavigator';
import AuthNavigator from './AuthNavigator';
import { LoadingScreen } from '../screens/index';
import { withFirebase } from '../config/Firebase';
import { NavigationContainer } from '@react-navigation/native';

const RootStack = createStackNavigator();

class RootNavigator extends Component {
    state = {
        loading: {
            isUserLoading: true,
            isAssetsLoading: true,
            isUserSignedIn: false,
        },
        timerCounting: true,
    };

    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            console.log('Starting app');
            try {
                await this.loadLocalAsync().then(() => {
                    this.setState({ loading: { isAssetsLoading: false } });
                });

                await this.props.firebase.checkUserAuth((result) => {
                    if (result && result.emailVerified) {
                        this.setState({
                            user: result,
                            loading: {
                                isUserLoading: false,
                                isUserSignedIn: true,
                            },
                        });
                    } else {
                        if (result) {
                            this.props.firebase.signOut();
                        }
                        this.setState({
                            loading: {
                                isUserLoading: false,
                            },
                        });
                    }
                });

                setTimeout(() => {
                    this.setState({
                        timerCounting: false,
                    });
                }, 3000);
            } catch (error) {
                console.log(error);
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async loadLocalAsync() {
        return await Promise.all([
            Asset.loadAsync([require('../assets/images/logo.png')]).then(() =>
                console.log('logo done')
            ),
            Font.loadAsync({
                ...Ionicons.font,
                'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.otf'),
                'Futura-Medium-BT': require('../assets/fonts/Futura-Medium-BT.ttf'),
            }).then(() => console.log('font done')),
        ]);
    }

    render() {
        const { loading, timerCounting } = this.state;

        return (
            <NavigationContainer>
                <RootStack.Navigator>
                    {timerCounting || loading.isUserLoading || loading.isAssetsLoading ? (
                        <RootStack.Screen
                            name="Loading"
                            component={LoadingScreen}
                            initialParams={{
                                children: loading,
                            }}
                        />
                    ) : loading.isUserSignedIn ? (
                        <RootStack.Screen name="App" component={HomeNavigator} />
                    ) : (
                        <RootStack.Screen name="Auth" component={AuthNavigator} />
                    )}
                </RootStack.Navigator>
            </NavigationContainer>
        );
    }
}

export default withFirebase(RootNavigator);
