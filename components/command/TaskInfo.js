import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, Text} from 'react-native';

export default class TaskInfo extends Component{
    render(){
        let {task_name, task_ms} = this.props.navigation.state.params;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <View style={S.viewStyle}>
                    <Text style={S.infoStyle}>{`任务名称：`}</Text>
                    <Text style={S.textStyle}>{task_name}</Text>
                </View>
                <View style={S.viewStyle}>
                    <Text style={S.infoStyle}>{`任务描述：`}</Text>
                    <Text style={S.textStyle}>{task_ms}</Text>
                </View>
            </View>
        );
    }
}

const S = StyleSheet.create({
    viewStyle: {
        marginTop: 10,
        marginRight: 0,
        marginLeft: 0
    },
    infoStyle: {
        fontSize: 14,
        color: 'gray',
        marginTop: 10,
        marginRight: 15,
        marginBottom: 5,
        marginLeft: 15
    },
    textStyle: {
        fontSize: 17,
        color: 'black',
        marginRight: 25,
        marginLeft: 25
    }
});