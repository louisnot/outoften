import React from 'react'
import { createAppContainer} from 'react-navigation';
import {createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';


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
const Nav = createAppContainer(TabNavigator)

export default class Navigator extends React.Component{
    render(){
        return <Nav
            screenProps={{jwt: this.props.jwt, deleteJWT : this.props.deleteJWT}}
            />
    }
}
