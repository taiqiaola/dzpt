import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, Text} from 'react-native';

import cfg from '../../common/config.json';

export default class MessageDetail extends Component{
    componentDidMount(){
        let {message_zt} = this.props.navigation.state.params;
        message_zt === '1' ? (
            this.changeMessageZT()
        ) : null
    }

    async changeMessageZT(){
        console.log('changeMessageZT');
        let {t_message_id, reloadMessageData} = this.props.navigation.state.params;
        try {
            let response = await fetch(cfg.url+'servlets/MessageJsonSvlt?tag=message_update&f=f', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 't_message_id='+t_message_id+'&message_zt=2'
            });
            let responseJSON = await response.json();
            let {STATUS} = responseJSON;
            if (STATUS === 1) {
                reloadMessageData();
            }
        } catch (error) {
          console.error(error);
        }
    }

    render(){
        let {send_username, send_time, msg_nr} = this.props.navigation.state.params;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <View style={S.viewStyle}>
                    <Text style={S.infoStyle}>{`发送人：`}</Text>
                    <Text style={S.textStyle}>{send_username}</Text>
                </View>
                <View style={S.viewStyle}>
                    <Text style={S.infoStyle}>{`发送时间：`}</Text>
                    <Text style={S.textStyle}>{send_time}</Text>
                </View>
                <View style={S.viewStyle}>
                    <Text style={S.infoStyle}>{`消息内容：`}</Text>
                    <Text style={S.textStyle}>{msg_nr}</Text>
                </View>
            </View>
        );
    }
}

const S = StyleSheet.create({
    viewStyle: {
        // backgroundColor: 'blue',
        marginTop: 10,
        marginRight: 0,
        // marginBottom: 10,
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
        // marginBottom: 10,
        marginLeft: 25
    }
});