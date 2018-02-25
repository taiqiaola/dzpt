import React, {Component} from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';

export default class Loading extends Component {
    render() {
        return (
            <View>
                <ActivityIndicator 
                    animating={true}
                    size='large' 
                    color='#FF4500' 
                    style={S.loading}
                />
                <Text style={S.textStyle}>{`玩命加载中...`}</Text>
            </View>
        );
    }
}

const S = StyleSheet.create({
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        height: 60
    },
    textStyle: {
        fontSize: 13,
        color: 'gray',
        textAlign: 'center'
    }
});