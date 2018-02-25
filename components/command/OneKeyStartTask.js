import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, TouchableOpacity, Text, 
    TextInput, AsyncStorage, TouchableNativeFeedback} from 'react-native';
import Picker from 'react-native-picker';
import Storage from 'react-native-storage';
import {MapView, Marker, Polyline} from 'react-native-amap3d';

import cfg from '../../common/config.json';

let storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
});

let djData = [
    'IV级响应(一般地震灾害)',
    'III级响应(较大地震灾害)',
    'II级响应(重大地震灾害)',
    'I级响应(特别重大地震灾害)'
];

export default class OneKeyStartTask extends Component{
    constructor(props){
        super(props);
        this.state = {
            t_task_id: '',
            task_name: '', 
            task_ms: '',
            x: '',
            y: '',
            yxc_m: '',
            zj: '',
            xydj: 1,
            xydj_value: 'I级响应(特别重大地震灾害)',
            zysd: '',
            YLPLAN_ID: ''
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '一键启动任务',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.state.params.navigatePress()}>
                    <View style={S.toolbarStyle}>
                        <Image style={S.iconStyle} source={{uri: 'submit_icon'}}/>
                        {/* <Text style={S.rightTextStyle}>{`提交`}</Text> */}
                    </View>
                </TouchableOpacity>
            )
        }
    };

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

        //组件挂载完成之后设置方法
        this.props.navigation.setParams({
            navigatePress: () => this.onSubmit()
        });
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
        Picker.hide();
    }

    async onSubmit(){
        Picker.hide();

        let {task_name, task_ms, x, y, yxc_m, zj, xydj, xydj_value, zysd, YLPLAN_ID} = this.state;
        let {userInfo: {p_app_id, t_user_id}} = this.props.screenProps;
        let is_not_event = '';
        let coordinate_system = '1';
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=task_add&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 't_user_id='+t_user_id+'&task_name='+task_name+'&task_ms='+task_ms+
                    '&x='+x+'&y='+y+'&yxc_m='+yxc_m+'&t_is_current_load_task=2'+
                    '&ylplan_id='+YLPLAN_ID+'&is_not_event='+is_not_event+'&zj='+zj+
                    '&zysd='+zysd+'&xydj='+xydj+'&xydj_value='+xydj_value+
                    '&p_app_id='+p_app_id+'&coordinate_system='+coordinate_system
            });
            let responseJSON = await response.json();
            let {STATUS, t_task_id} = responseJSON;
            if (STATUS === 1) {
                //先移除存储，再重新存储
                storage.remove({key: 'tTaskId'});
                storage.save({key: 'tTaskId', data: t_task_id});
                ToastAndroid.show('启动任务成功，即将载入...', ToastAndroid.SHORT);
                this.props.navigation.goBack();
            }
        } catch (error) {
            console.error(error);
        }
    }

    showPicker(){
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '',
            pickerConfirmBtnColor: [18, 150, 219, 1],
            pickerCancelBtnColor: [217, 18 , 48, 1],
            pickerToolBarBg: [245, 252 , 255, 1],
            pickerBg: [224, 224 , 224, 1],
            pickerData: djData,
            onPickerConfirm: (data, index) => {
                this.setState({
                    xydj: 4-index,
                    xydj_value: data
                });
            },
            onPickerCancel: data => {
                
            },
            onPickerSelect: data => {
                
            }
        });

        Picker.show();
    }
    
    render(){
        let {task_name, task_ms, x, y, yxc_m, zj, xydj, zysd} = this.state;
        return(
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <ScrollView style={{flex: 1,}}>
                    {/* <View style={S.viewStyle}>
                        <TouchableNativeFeedback onPress={() => this.itemOnClick()}>
                            <View style={S.itemViewStyle}>
                                <Image style={S.checkBoxStyle} source={{uri: 'radio_selected'}}/>
                                <Text style={S.tipsTextStyle}>{`是否作为事件发布`}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View> */}
                    <View style={S.viewStyle}>
                        <Text style={S.infoStyle}>{`任务名称：`}</Text>
                        <View style={S.itemStyle}>
                            <TextInput 
                                style={S.inputStyle}
                                autoCapitalize='none'
                                placeholder='请输入任务名称'
                                underlineColorAndroid='transparent'
                                onFocus={() => Picker.hide()}
                                value={task_name}
                                onChangeText={(text) => this.setState({task_name: text})}
                            />
                        </View>
                        <Text style={S.infoStyle}>{`任务描述：`}</Text>
                        <View style={[S.itemStyle, {height: 80}]}>
                            <TextInput 
                                style={S.inputStyle}
                                autoCapitalize='none'
                                placeholder='请输入任务描述...'
                                maxLength={100}
                                multiline={true}
                                underlineColorAndroid='transparent'
                                onFocus={() => Picker.hide()}
                                value={task_ms}
                                onChangeText={(text) => this.setState({task_ms: text})}
                            />
                        </View>
                        <Text style={S.infoStyle}>{`地震元素：`}</Text>
                        <View style={S.itemStyle}>
                            <View style={S.leftViewStyle}>
                                <Text style={S.leftTextStyle}>{`震中经度`}</Text>
                            </View>
                            <TextInput 
                                style={S.rightInputStyle}
                                autoCapitalize='none'
                                placeholder='请输入震中经度'
                                underlineColorAndroid='transparent'
                                onFocus={() => Picker.hide()}
                                keyboardType='numeric'
                                value={x}
                                onChangeText={(text) => this.setState({x: text})}
                            />
                        </View>
                        <View style={{height: 1,}}></View>
                        <View style={S.itemStyle}>
                            <View style={S.leftViewStyle}>
                                <Text style={S.leftTextStyle}>{`震中纬度`}</Text>
                            </View>
                            <TextInput 
                                style={S.rightInputStyle}
                                autoCapitalize='none'
                                placeholder='请输入震中纬度'
                                underlineColorAndroid='transparent'
                                onFocus={() => Picker.hide()}
                                keyboardType='numeric'
                                value={y}
                                onChangeText={(text) => this.setState({y: text})}
                            />
                        </View>
                        <View style={{height: 1,}}></View>
                        <View style={S.itemStyle}>
                            <View style={S.leftViewStyle}>
                                <Text style={S.leftTextStyle}>{`影响场`}</Text>
                                <Text style={{fontSize: 13, color: 'gray'}}>{`(米)`}</Text>
                            </View>
                            <TextInput 
                                style={S.rightInputStyle}
                                autoCapitalize='none'
                                placeholder='请输入影响场'
                                underlineColorAndroid='transparent'
                                onFocus={() => Picker.hide()}
                                keyboardType='numeric'
                                value={yxc_m}
                                onChangeText={(text) => this.setState({yxc_m: text})}
                            />
                        </View>
                        <View style={{height: 1,}}></View>
                        <View style={S.itemStyle}>
                            <View style={S.leftViewStyle}>
                                <Text style={S.leftTextStyle}>{`震级`}</Text>
                            </View>
                            <TextInput 
                                style={S.rightInputStyle}
                                autoCapitalize='none'
                                placeholder='请输入震级，0~10'
                                underlineColorAndroid='transparent'
                                onFocus={() => Picker.hide()}
                                keyboardType='numeric'
                                value={zj}
                                onChangeText={(text) => this.setState({zj: text})}
                            />
                        </View>
                        <View style={{height: 1,}}></View>
                        <View style={S.itemStyle}>
                            <View style={S.leftViewStyle}>
                                <Text style={S.leftTextStyle}>{`响应等级`}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.showPicker()}>
                                <View style={S.pickerViewStyle}>
                                    <Text style={{color: '#CD853F'}}>{djData[4-xydj]}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 1,}}></View>
                        <View style={S.itemStyle}>
                            <View style={S.leftViewStyle}>
                                <Text style={S.leftTextStyle}>{`深度`}</Text>
                                <Text style={{fontSize: 13, color: 'gray'}}>{`(千米)`}</Text>
                            </View>
                            <TextInput 
                                style={S.rightInputStyle}
                                autoCapitalize='none'
                                placeholder='请输入深度'
                                underlineColorAndroid='transparent'
                                onFocus={() => Picker.hide()}
                                keyboardType='numeric'
                                value={zysd}
                                onChangeText={(text) => this.setState({zysd: text})}
                            />
                        </View>
                    </View>
                    {/* <MapView 
                        style={{flex: 1}}
                        showsCompass //是否显示指南针
                        showsScale //是否显示比例尺
                        showsLocationButton //是否显示定位按钮
                        locationEnabled //是否启用定位
                        // onLocation={({nativeEvent}) =>
                        //   console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)
                        // }
                    >
                    </MapView> */}
                </ScrollView>
            </View>
        )
    }
}

const S = StyleSheet.create({
    toolbarStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 56
    },
    iconStyle: {
        width: 25,
        height: 25
    },
    rightTextStyle: {
        fontSize: 18,
        color: '#1296db'
    },
    viewStyle: {
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10
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
    },
    inputStyle: {
        flex: 1,
        alignItems: 'flex-start',
        height: 80,
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
    leftViewStyle: {
        flexDirection: 'row',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftTextStyle: {
        fontSize: 17,
        color: 'black',
    },
    rightInputStyle: {
        // backgroundColor: 'red',
        flex: 1,
        // marginRight: 5,
        // marginLeft: 5
    },
    pickerViewStyle: {
        // marginRight: 5,
        // marginLeft: 10,
        paddingLeft: 5,
        justifyContent: 'center',
    }
});