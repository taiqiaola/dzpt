import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';

export default class CommandMessageDetail extends Component{
    render(){
        let {send_username, receive_username, send_time, re_phone, 
            sms_nr, sms_zt} = this.props.navigation.state.params;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <ScrollView>
                    <View style={S.viewStyle}>
                        <Text style={S.infoStyle}>{`发送人：`}</Text>
                        <Text style={S.textStyle}>{send_username}</Text>
                    </View>
                    <View style={S.viewStyle}>
                        <Text style={S.infoStyle}>{`接收人：`}</Text>
                        <Text style={S.textStyle}>{receive_username}</Text>
                    </View>
                    <View style={S.viewStyle}>
                        <Text style={S.infoStyle}>{`发送时间：`}</Text>
                        <Text style={S.textStyle}>{send_time}</Text>
                    </View>
                    <View style={S.viewStyle}>
                        <Text style={S.infoStyle}>{`接收号码：`}</Text>
                        <Text style={S.textStyle}>{re_phone}</Text>
                    </View>
                    <View style={S.viewStyle}>
                        <Text style={S.infoStyle}>{`消息内容：`}</Text>
                        <Text style={S.textStyle}>{sms_nr}</Text>
                    </View>
                    <View style={S.viewStyle}>
                        <Text style={S.infoStyle}>{`发送状态：`}</Text>
                        {
                            sms_zt === '1' ?  (
                                <Text style={[S.textStyle, {color: 'green'}]}>{`成功`}</Text>
                            ) : (
                                <Text style={[S.textStyle, {color: 'red'}]}>{`失败`}</Text>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const S = StyleSheet.create({
    viewStyle: {
        marginTop: 10
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