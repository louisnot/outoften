import React from 'react'
import { createAppContainer} from 'react-navigation';
import {createBottomTabNavigator } from 'react-navigation-tabs';

import { Icon } from 'react-native-elements';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import { createStackNavigator } from 'react-navigation-stack';
import LegalTerms from '../screens/LegalTerms';
import Help from '../screens/Help';

const TabNavigator = createBottomTabNavigator(
    {
    Home: {screen : HomeScreen,
    navigationOptions :{
        
        tabBarIcon : ({tintColor}) => (
            <Icon
                name='star'
                type='material'
                size={22}
                color={tintColor}
            />
        )

        }
    },
    Profile: {screen : ProfileScreen,
            navigationOptions :{
            tabBarIcon : ({tintColor}) => (
                <Icon
                    name='pencil-outline'
                    type='material-community'
                    size={22}
                    color={tintColor}
                />
            )
        }
    }
    },
    {
        tabBarOptions:{
            activeTintColor : 'red',
            inactiveTintColor : 'lightgrey',
            showLabel: false
        },
        
    }
    

);
const AppNavigator = createStackNavigator(
        {
            Home:TabNavigator,
            Setting:SettingScreen,
            EULA:LegalTerms,
            Help:Help
        },
        {
            headerMode:'none'
        }
    )
const Nav = createAppContainer(AppNavigator)


export default class Navigator extends React.Component{
    render(){
        return <Nav
            screenProps={{jwt: this.props.jwt, deleteJWT : this.props.deleteJWT}}
            navigation={this.props.navigation}
            />
    }
}