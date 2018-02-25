import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, Text, Button, TouchableNativeFeedback, 
    TextInput, Alert, ToastAndroid, AsyncStorage} from 'react-native';
import Storage from 'react-native-storage';    

import Style from '../style/Style';
import cfg from '../../common/config.json';

let storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
});

export default class CommandIssue extends Component{
    constructor(props){
        super(props);

        let itemData = [
            {b_class_id: '41', name: '震感情况', radioStatus: 'radio_unselected'},
            {b_class_id: '42', name: '人员死亡情况', radioStatus: 'radio_unselected'},
            {b_class_id: '43', name: '人员受伤情况', radioStatus: 'radio_unselected'},
            {b_class_id: '44', name: '房屋损坏情况', radioStatus: 'radio_unselected'},
            {b_class_id: '45', name: '次生灾害', radioStatus: 'radio_unselected'},
            {b_class_id: '46', name: '基础设施情况', radioStatus: 'radio_unselected'}
        ];

        this.state = {
            t_task_id: '',
            data: itemData
        }
    }

    componentDidMount() {
        //组件挂载完成之后，读取存储中的信息
        storage.load({
            key: 'tTaskId'
        }).then((ret) => {
            // 如果找到数据，则在then方法中返回
            let t_task_id = ret;
            this.setState({
                t_task_id
            });
        }).catch(() => {
           
        });

        //组件挂载完成之后设置方法
        this.props.navigation.setParams({
            navigatePress: () => this.quakeCenterSubmit()
        });
    }

    //点击每一条
    itemOnClick(item){
        let {data} = this.state;
        data.map((elt) => {
            if(elt.b_class_id === item.b_class_id){
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
        let check = true, is_not_event = '', b_class_id_ch_str = '', classArray = [];
        let {t_task_id, data} = this.state;
        let {userInfo: {t_user_id, p_app_id}} = this.props.screenProps;
        let {selectedUser} = this.props.navigation.state.params;
        let ch_str = selectedUser.join();//转为字符串
        let YLPLAN_ID = 206;//此参数临时使用，后面会动态获取

        data.map((elt) => {
            if(elt.radioStatus === 'radio_selected'){
                classArray.push(elt.b_class_id);
            }
        });
        
        if(classArray.length === 0){
            check = false;
            ToastAndroid.show('请选择命令', ToastAndroid.SHORT);
        }
        
        if(check){
            let b_class_id_str = classArray.join();
            try {
                let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=order_down_add&f=f', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: '&b_class_id_str='+b_class_id_str+'&t_task_id='+t_task_id+
                        '&b_class_id_ch_str='+b_class_id_ch_str+'&is_not_event='+is_not_event+
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
                <TouchableNativeFeedback key={elt.b_class_id} onPress={() => this.itemOnClick(elt)}>
                    <View style={S.itemViewStyle}>
                        <Image style={Style.checkBoxStyle} source={{uri: elt.radioStatus}}/>
                        <Text style={S.tipsTextStyle}>{elt.name}</Text>
                    </View>
                </TouchableNativeFeedback>
            )
        });

        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <ScrollView>
                    <Text style={S.topTextStyle}>
                        {`已选中${selectedUser.length}人，将下达指令。`}
                    </Text>
                    {/* <View style={S.viewStyle}>
                        <TouchableNativeFeedback onPress={() => this.itemOnClick()}>
                            <View style={S.itemViewStyle}>
                                <Image style={Style.checkBoxStyle} source={{uri: 'radio_selected'}}/>
                                <Text style={S.tipsTextStyle}>{`是否作为事件发布`}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View> */}
                    <Text style={Style.tipsTextStyle}>{`指令内容`}</Text>
                    <View style={S.viewStyle}>
                        {item}
                    </View>
                    <View style={Style.buttonStyle}>
                        <Button
                            onPress={() => this.onSubmit()}
                            title='指令下达'
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
    tipsTextStyle: {
        fontSize: 16,
        color: 'black',
    }
});