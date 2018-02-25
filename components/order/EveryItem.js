import React, {Component} from 'react';
import {StyleSheet, View, TouchableNativeFeedback, Image, Text} from 'react-native';

import Style from '../style/Style';

export default class EveryItem extends Component{
    render(){
        let {data, onClick} = this.props;
        return (
            <TouchableNativeFeedback onPress={() => onClick(data)}>
                <View style={S.itemViewStyle}>
                    <Image style={Style.checkBoxStyle} source={{uri: data.radioStatus}}/>
                    <Text style={S.textStyle}>{data.b_class_name}</Text>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

const S = StyleSheet.create({
    itemViewStyle: {
        backgroundColor: '#FFFFFF',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 1
    },
    textStyle: {
        fontSize: 16,
        color: 'black',
    }
});