import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text, TextInput, Button, 
    Alert, ToastAndroid} from 'react-native';

import cfg from '../../common/config.json';

export default class UpdateTaskInfo extends Component{
    constructor(props){
        super(props);
        let {task_name, task_ms} = props.navigation.state.params;
        this.state = {
            task_name: task_name, 
            task_ms: task_ms
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(){
        let {t_task_id, updateData} = this.props.navigation.state.params;
        let {task_name, task_ms} = this.state;
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=task_update&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 't_task_id='+t_task_id+'&task_name='+task_name+'&task_ms='+task_ms
            });
            let responseJSON = await response.json();
            let {STATUS} = responseJSON;
            if (STATUS === 1) {
                updateData(t_task_id, task_name, task_ms);
                ToastAndroid.show('修改成功', ToastAndroid.SHORT);
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
                    <View style={S.viewStyle}>
                        <Text style={S.infoStyle}>{`任务名称：`}</Text>
                        <View style={S.itemStyle}>
                            <TextInput 
                                style={S.inputStyle}
                                autoCapitalize='none'
                                placeholder='请输入任务名称'
                                underlineColorAndroid='transparent'
                                value={task_name}
                                onChangeText={(text) => this.setState({task_name: text})}
                            />
                        </View>
                    </View>
                    <View style={S.viewStyle}>
                        <Text style={S.infoStyle}>{`任务描述：`}</Text>
                        <View style={[S.itemStyle, {height: 160}]}>
                            <TextInput 
                                style={S.inputStyle}
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
                    <View style={S.buttonStyle}>
                        <Button
                            onPress={this.onSubmit}
                            title="保存"
                            accessibilityLabel="Learn more about this blue button"
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const S = StyleSheet.create({
    viewStyle: {
        // marginTop: 10,
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
    buttonStyle: {
        flex: 1,
        margin: 10
    }
});