import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Alert, TouchableOpacity} from 'react-native';
import {StackNavigator} from 'react-navigation';

export default class Event extends Component{
    constructor(props){
        super(props);
    }
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '系统事件',
            headerTitleStyle: {alignSelf: 'center'},
            headerLeft: (
                <TouchableOpacity onPress={
                    () => {
                        Alert.alert(`123`);
                    }
                }>
                    <View style={S.toolbarStyle}>
                        <Text style={S.textStyle}>{` `}</Text>
                    </View>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity onPress={
                    () => {
                        Alert.alert(`123`);
                    }
                }>
                    <View style={S.toolbarStyle}>
                        <Text style={S.textStyle}>{`发布`}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    render(){
        return(
            <View style={S.content}>
                <Text>{`Event`}</Text>
            </View>
        )
    }
}

const S = StyleSheet.create({
    toolbarStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 18
    },
    textStyle: {
        fontSize: 18,
        color: '#1296db',
    },
    content: {
        flex: 1,
        backgroundColor: '#EDEDED',
        justifyContent: 'center',
        alignItems: 'center'
    }
});