import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Alert, Button, TouchableNativeFeedback} from 'react-native';
import {StackNavigator} from 'react-navigation';

import Style from '../style/Style';

let data = [
    {id: 'TaskAdminister', name: '任务管理', icon: 'renwuguanli'},
    {id: 'QuakeCenter', name: '地震元素', icon: 'dizhenyuansu'},
    {id: 'SelectUser', name: '指令下达', icon: 'zhilingxiada'},
    {id: 'SelectUser', name: '发送消息', icon: 'fasongxiaoxi'},
    {id: 'CommandIssueRecord', name: '指令下达记录', icon: 'zhilingxiadajilu'},
    {id: 'SelfReportRecord', name: '自主上报记录', icon: 'zizhushangbaojilu'},
    {id: 'MessageRecord', name: '消息记录', icon: 'xiaoxijilu'}
];

export default class Command extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '应急指挥',
            headerTitleStyle: {alignSelf: 'center'}
        }
    };

    render() {
        let {navigate} = this.props.navigation;
        return(
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <View style={Style.buttonStyle}>
                    <Button
                        onPress={() => navigate('OneKeyStartTask')}
                        title="一键启动任务"
                        color='#FFB90F'
                        accessibilityLabel="Learn more about this yellow button"
                    />
                </View>
                <Text style={Style.tipsTextStyle}>{`指挥功能`}</Text>
                <TouchableNativeFeedback onPress={() => {navigate(`TaskAdminister`);}}>
                    <View style={S.itemStyle}>
                        <View style={S.tipsStyle}>
                            <Image style={S.tipsImageStyle} source={{uri: 'renwuguanli'}}/>
                            <Text style={S.textStyle}>{`任务管理`}</Text>
                        </View>
                        <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {navigate(`QuakeCenter`);}}>
                    <View style={S.itemStyle}>
                        <View style={S.tipsStyle}>
                            <Image style={S.tipsImageStyle} source={{uri: 'dizhenyuansu'}}/>
                            <Text style={S.textStyle}>{`地震元素`}</Text>
                        </View>
                        <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                    </View>
                </TouchableNativeFeedback>
                {/* <View style={{height: 1,}}></View> */}
                <TouchableNativeFeedback onPress={() => {navigate(`SelectUser`, {fromPage: 'CommandIssue'});}}>
                    <View style={S.itemStyle}>
                        <View style={S.tipsStyle}>
                            <Image style={S.tipsImageStyle} source={{uri: 'zhilingxiada'}}/>
                            <Text style={S.textStyle}>{`指令下达`}</Text>
                        </View>
                        <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {navigate(`SelectUser`, {fromPage: 'SendMessage'});}}>
                    <View style={S.itemStyle}>
                        <View style={S.tipsStyle}>
                            <Image style={S.tipsImageStyle} source={{uri: 'fasongxiaoxi'}}/>
                            <Text style={S.textStyle}>{`发送消息`}</Text>
                        </View>
                        <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                    </View>
                </TouchableNativeFeedback>
                {/* <View style={{height: 1, backgroundColor: '#DEDEDE'}}></View> */}
                <Text style={Style.tipsTextStyle}>{`记录查看`}</Text>
                <TouchableNativeFeedback onPress={() => {navigate(`CommandIssueRecord`);}}>
                    <View style={S.itemStyle}>
                        <View style={S.tipsStyle}>
                            <Image style={S.tipsImageStyle} source={{uri: 'zhilingxiadajilu'}}/>
                            <Text style={S.textStyle}>{`指令下达记录`}</Text>
                        </View>
                        <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {navigate(`SelfReportRecord`);}}>
                    <View style={S.itemStyle}>
                        <View style={S.tipsStyle}>
                            <Image style={S.tipsImageStyle} source={{uri: 'zizhushangbaojilu'}}/>
                            <Text style={S.textStyle}>{`自主上报记录`}</Text>
                        </View>
                        <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {navigate(`MessageRecord`);}}>
                    <View style={S.itemStyle}>
                        <View style={S.tipsStyle}>
                            <Image style={S.tipsImageStyle} source={{uri: 'xiaoxijilu'}}/>
                            <Text style={S.textStyle}>{`消息记录`}</Text>
                        </View>
                        <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }
}

const S = StyleSheet.create({
    viewStyle: {
        marginBottom: 10,
    },
    itemStyle: {
        backgroundColor: '#FFFFFF',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tipsStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tipsImageStyle: {
        width: 18,
        height: 18,
        marginLeft: 15
    },
    textStyle: {
        fontSize: 16,
        color: 'black',
        marginLeft: 30,
    }
});