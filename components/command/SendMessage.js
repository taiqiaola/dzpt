import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, Text, Button, TouchableNativeFeedback, 
    TextInput, Alert, ToastAndroid} from 'react-native';

import Style from '../style/Style';
import cfg from '../../common/config.json';

export default class SendMessage extends Component{
    constructor(props){
        super(props);
        
        let itemData = [
            {id: 'duanxin', name: '短信通知', radioStatus: 'radio_unselected'},
            {id: 'tuisong', name: '推送通知', radioStatus: 'radio_unselected'},
            {id: 'shijian', name: '事件通知', radioStatus: 'radio_selected'}
        ];

        this.state = {
            data: itemData,
            sms_nr: ''
        }
    }

    //点击每一条
    itemOnClick(item){
        let {data} = this.state;
        data.map((elt) => {
            if(elt.id === item.id){
                console.log(item.id);
                elt.radioStatus === 'radio_selected' ? (
                    elt.radioStatus = 'radio_unselected'
                ) : (
                    elt.radioStatus = 'radio_selected'
                )
            }
        });
        this.setState({data});
    }

    async onSubmit(){
        let check = true, is_not_sms = '', is_not_push = '', is_not_event = '1';
        let {data, sms_nr} = this.state;
        let {userInfo: {t_user_id, p_app_id}} = this.props.screenProps;
        let {selectedUser} = this.props.navigation.state.params;
        let ch_str = selectedUser.join();//转为字符串
        let YLPLAN_ID = 206;//此参数临时使用，后面会动态获取

        data.map((elt) => {
            switch (elt.id) {
                case 'duanxin':
                    is_not_sms = elt.radioStatus === 'radio_selected' ? '1' : '';
                    break;
                case 'tuisong':
                    is_not_push = elt.radioStatus === 'radio_selected' ? '1' : '';
                    break;
                case 'shijian':
                    is_not_event = elt.radioStatus === 'radio_selected' ? '1' : '';
                    break;
            }
        });
        
        if(is_not_sms === '' && is_not_push === '' && is_not_event === ''){
            check = false;
            ToastAndroid.show('请选择命令', ToastAndroid.SHORT);
        }else if(sms_nr === ''){
            check = false;
            ToastAndroid.show('短信内容为空', ToastAndroid.SHORT);
        }
        
        if(check){
            try {
                let response = await fetch(cfg.url+'servlets/MessageJsonSvlt?tag=send_message_add&f=f', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: '&is_not_sms='+is_not_sms+'&is_not_push='+is_not_push+
                        '&is_not_event='+is_not_event+'&sms_nr='+sms_nr+
                        '&t_user_id='+t_user_id+'&p_app_id='+p_app_id+'&jhid='+YLPLAN_ID+
                        '&w_b_command_order_and_message_down_ch_str='+ch_str
                });
                let responseJSON = await response.json();
                let {STATUS} = responseJSON;
                if (STATUS === 1) {
                    ToastAndroid.show('发送成功', ToastAndroid.SHORT);
                    this.props.navigation.goBack();
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    
    render(){
        let {selectedUser} = this.props.navigation.state.params;
        let {data, sms_nr} = this.state;
        let item = null;
        item = data.map((elt) => {
            return(
                <TouchableNativeFeedback key={elt.id} onPress={() => this.itemOnClick(elt)}>
                    <View style={S.itemViewStyle}>
                        <Image style={Style.checkBoxStyle} source={{uri: elt.radioStatus}}/>
                        <Text style={S.textStyle}>{elt.name}</Text>
                    </View>
                </TouchableNativeFeedback>
            )
        });

        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <ScrollView>
                    <Text style={S.topTextStyle}>
                        {`已选中${selectedUser.length}人，将发送消息。`}
                    </Text>
                    <Text style={Style.tipsTextStyle}>{`消息类别`}</Text>
                    <View style={S.viewStyle}>
                        {item}
                    </View>
                    <Text style={Style.tipsTextStyle}>{`消息内容`}</Text>
                    <View style={S.viewStyle}>
                        <View style={S.qtnrStyle}>
                            <TextInput 
                                style={S.inputStyle}
                                autoCapitalize='none'
                                placeholder='请简要说明，500字以内...'
                                maxLength={500}
                                // autoFocus={true}
                                multiline={true}
                                underlineColorAndroid='transparent'
                                value={sms_nr}
                                onChangeText={(text) => this.setState({sms_nr: text})}
                            />
                        </View>
                    </View>
                    <View style={Style.buttonStyle}>
                        <Button
                            onPress={() => this.onSubmit()}
                            title="发送消息"
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const S = StyleSheet.create({
    topTextStyle: {
        fontSize: 14,
        color: 'gray',
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
    },
    viewStyle: {
        marginRight: 10,
        marginLeft: 10
    },
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
    },
    qtnrStyle: {
        backgroundColor: '#FFFFFF',
        height: 160,
        flexDirection: 'row',
        marginTop: 5,
    },
    inputStyle: {
        flex: 1,
        alignItems: 'flex-start',
        height: 160,
        marginRight: 5,
        marginLeft: 5
    }
});