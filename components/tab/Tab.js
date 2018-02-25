import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, Text, Alert} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';

import Map from '../content/Map';
import Command from '../content/Command';
import Order from '../content/Order';
import Event from '../content/Event';
import Setting from '../content/Setting';

const S = StyleSheet.create({
    tabIcon: {
        width: 22,
        height: 22
    }
});

export default Tab = TabNavigator({
    Map: {
        screen: Map,
        navigationOptions: {
            tabBarLabel: '地图',
            tabBarIcon: ({tintColor}) => (
                <Image source={{uri: 'map_icon'}} style={[{tintColor: tintColor}, S.tabIcon]}/>
            )
        }
    },
    Command: {
        screen: Command,
        navigationOptions: {
            tabBarLabel: '应急指挥',
            tabBarIcon: ({tintColor}) => (
                <Image source={{uri: 'command_icon'}} style={[{tintColor: tintColor}, S.tabIcon]}/>
            )
        }
    },
    Order: {
        screen: Order,
        navigationOptions: {
            tabBarLabel: '指令与消息',
            tabBarIcon: ({tintColor}) => (
                <Image source={{uri: 'order_icon'}} style={[{tintColor: tintColor}, S.tabIcon]}/>
            )
        }
    },
    // Event: {
    //     screen: Event,
    //     navigationOptions: {
    //         tabBarLabel: '系统事件',
    //         tabBarIcon: ({tintColor}) => (
    //             <Image source={{uri: 'event_icon'}} style={[{tintColor: tintColor}, S.tabIcon]}/>
    //         )
    //     }
    // },
    Setting: {
        screen: Setting,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor}) => (
                <Image source={{uri: 'setting_icon'}} style={[{tintColor: tintColor}, S.tabIcon]}/>
            )
        }
    }
},
{
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true,
    backBehavior: 'none',
    tabBarOptions: {
        inactiveTintColor: '#707070',
        activeTintColor: '#2c2c2c',
        showIcon: true,
        style: {
            height: 52,
            backgroundColor: '#FFFFFF',
        },
        iconStyle: {
            width: 25,
            height: 25,
            marginTop: -2
        },
        labelStyle: {
            width: 65,
            marginTop: 0,
            fontSize: 11
        },
        indicatorStyle: {
            height: 0
        }
    }
});