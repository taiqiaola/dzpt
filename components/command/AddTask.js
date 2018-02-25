import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text, TextInput, Button, Alert, 
    ToastAndroid, TouchableNativeFeedback, Image, AsyncStorage} from 'react-native';
import Storage from 'react-native-storage';

import cfg from '../../common/config.json';

let storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
});

export default class AddTask extends Component{
    constructor(props){
        super(props);
        this.state = {
            task_name: '', 
            task_ms: '',
            YLPLAN_ID: ''
        };
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            storage.load({
                key: 'ylplanId'
            }).then((ret) => {
                // 如果找到数据，则在then方法中返回
                let YLPLAN_ID = ret;
                this.setState({YLPLAN_ID});
            }).catch(() => {
                // 如果没有找到数据且没有sync方法，或者有其他异常，则在catch中返回
                this.setState({YLPLAN_ID: null});
            });
        }, 1000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    async onSubmit() {
        let {userInfo: {p_app_id, t_user_id}} = this.props.screenProps;
        let {addData} = this.props.navigation.state.params;
        let {task_name, task_ms, YLPLAN_ID} = this.state;
        var is_not_event = '';
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=task_add&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 't_user_id='+t_user_id+'&task_name='+task_name+
                    '&task_ms='+task_ms+'&p_app_id='+p_app_id+
                    '&ylplan_id='+YLPLAN_ID+'&is_not_event='+is_not_event
            });
            let responseJSON = await response.json();
            let {STATUS} = responseJSON;
            if (STATUS === 1) {
                addData();
                ToastAndroid.show('添加成功', ToastAndroid.SHORT);
                this.props.navigation.goBack();
            }
        } catch (error) {
            console.error(error);
        }
    }

    render(){
        let {task_name, task_ms} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <ScrollView>
                    <View style={styles.viewStyle}>
                        <Text style={styles.infoStyle}>{`任务名称：`}</Text>
                        <View style={styles.itemStyle}>
                            <TextInput 
                                style={styles.inputStyle}
                                autoCapitalize='none'
                                placeholder='请输入任务名称'
                                underlineColorAndroid='transparent'
                                value={task_name}
                                onChangeText={(text) => this.setState({task_name: text})}
                            />
                        </View>
                        <Text style={styles.infoStyle}>{`任务描述：`}</Text>
                        <View style={[styles.itemStyle, {height: 160}]}>
                            <TextInput 
                                style={styles.inputStyle}
                                autoCapitalize='none'
                                placeholder='请输入任务描述...'
                                maxLength={100}
                                multiline={true}
                                underlineColorAndroid='transparent'
                                value={task_ms}
                                onChangeText={(text) => this.setState({task_ms: text})}
                            />
                        </View>
                    </View>
                    {/* <View style={styles.viewStyle}>
                        <TouchableNativeFeedback onPress={() => this.itemOnClick()}>
                            <View style={styles.itemViewStyle}>
                                <Image style={styles.checkBoxStyle} source={{uri: 'radio_selected'}}/>
                                <Text style={styles.tipsTextStyle}>{`是否作为事件发布`}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View> */}
                    <View style={styles.buttonStyle}>
                        <Button
                            onPress={() => this.onSubmit()}
                            title="保存"
                            accessibilityLabel="Learn more about this blue button"
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        marginRight: 10,
        marginLeft: 10
    },
    infoStyle: {
        fontSize: 14,
        color: 'gray',
        marginTop: 10,
        marginBottom: 5
    },
    itemStyle: {
      backgroundColor: '#FFFFFF',
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
    //   marginBottom: 5
    },
    inputStyle: {
        flex: 1,
        alignItems: 'flex-start',
        height: 160,
        marginRight: 5,
        marginLeft: 5
    },
    itemViewStyle: {
        backgroundColor: '#FFFFFF',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 1
    },
    checkBoxStyle: {
        width: 23,
        height: 23,
        marginRight: 25,
        marginLeft: 30,
    },
    tipsTextStyle: {
        fontSize: 16,
        color: 'black',
    },
    buttonStyle: {
        flex: 1,
        margin: 10
    }
});