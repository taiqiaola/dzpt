import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';

export default class StartPage extends Component{
    render(){
        return (
            <View style={{flex: 1}}>
                <Image style={{flex: 1}} source={{uri: 'start_page'}}/>
            </View>
        );
    }
}