import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, AsyncStorage, Alert, 
    TextInput, ScrollView, Image} from 'react-native';
import Storage from 'react-native-storage';
import Picker from 'react-native-picker';
import {MapView, Marker, Polyline} from 'react-native-amap3d';

import Loading from '../loading/Loading';
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

export default class QuakeCenter extends Component{
    constructor(props){
        super(props);
        this.state = {
            t_task_id: '',
            x: '',
            y: '',
            yxc_m: '',
            zj: '',
            xydj: '',
            xydj_value: '',
            zysd: '',
            isLoading: true
        };
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '地震元素',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.state.params.navigatePress()}>
                    <View style={S.toolbarStyle}>
                        <Image style={S.iconStyle} source={{uri: 'submit_icon'}}/>
                        {/* <Text style={S.rightTextStyle}>{`保存`}</Text> */}
                    </View>
                </TouchableOpacity>
            )
        }
    };

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

    async loadTaskInfo(){
        let {t_task_id} = this.state;
        let {userInfo: {p_app_id}} = this.props.screenProps;
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=task_info_by_id&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 't_task_id='+t_task_id+'&p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, task} = responseJSON;
            if (STATUS === 1) {
                this.setState({
                    x: task.x,
                    y: task.y,
                    yxc_m: task.yxc_m,
                    zj: task.zj,
                    xydj: task.xydj,
                    zysd: task.zysd,
                    isLoading: false
                });
            }
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    async quakeCenterSubmit(){
        Picker.hide();

        let {x, y, yxc_m, zj, xydj, xydj_value, zysd, t_task_id} = this.state;
        let {userInfo: {t_user_id, p_app_id}} = this.props.screenProps;
        let YLPLAN_ID = 206;
        let is_not_event = '';
        let coordinate_system = '1';
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=task_update&f=f', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: '&p_app_id='+p_app_id+'&t_user_id='+t_user_id+'&t_task_id='+t_task_id+
                    '&coordinate_system='+coordinate_system+'&x='+x+'&y='+y+
                    '&yxc_m='+yxc_m+'&zj='+zj+'&xydj='+xydj+'&xydj_value='+xydj_value+
                    '&zysd='+zysd+'&is_not_event='+is_not_event+'&ylplan_id='+YLPLAN_ID
            });
            let responseJSON = await response.json();
            let {STATUS} = responseJSON;
            if (STATUS === 1) {
                this.props.navigation.goBack();
            }
        } catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
        //组件挂载完成之后，读取存储中的信息
        storage.load({
            key: 'tTaskId'
        }).then((ret) => {
            // 如果找到数据，则在then方法中返回
            let t_task_id = ret;
            this.setState({t_task_id});
            //加载task信息
            this.loadTaskInfo();
        }).catch(() => {
            // 如果没有找到数据且没有sync方法，或者有其他异常，则在catch中返回
            this.setState({isLoading: false});
        });

        //组件挂载完成之后设置方法
        this.props.navigation.setParams({
            navigatePress: () => this.quakeCenterSubmit()
        });
    }

    componentWillUnmount(){
        Picker.hide();
    }

    render(){
        let {x, y, yxc_m, zj, xydj, zysd, isLoading} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {
                    isLoading ? (
                        <Loading/>
                    ) : null
                }
                <View style={S.viewStyle}>
                    <View style={S.itemStyle}>
                        <View style={S.leftViewStyle}>
                            <Text style={S.leftTextStyle}>{`震中经度`}</Text>
                        </View>
                        <TextInput 
                            style={S.inputStyle}
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
                            style={S.inputStyle}
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
                            style={S.inputStyle}
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
                            style={S.inputStyle}
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
                            style={S.inputStyle}
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
                <MapView 
                    style={{flex: 1}}
                    showsCompass //是否显示指南针
                    showsScale //是否显示比例尺
                    showsLocationButton //是否显示定位按钮
                    locationEnabled //是否启用定位
                    // onLocation={({nativeEvent}) =>
                    //   console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)
                    // }
                >
                    <Marker
                        draggable
                        title='这是一个可拖拽的标记'
                        color='red'
                        description='Hello world!'
                        onDragEnd={({nativeEvent}) => {
                            this.setState({
                                x: String(nativeEvent.longitude.toFixed(6)), 
                                y: String(nativeEvent.latitude.toFixed(6))
                            })
                            console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)
                        }}
                        coordinate={{
                            latitude: 39.910955,
                            longitude: 116.372965,
                        }}
                    />
                </MapView>
            </View>
        );
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
        width: 24,
        height: 24
    },
    rightTextStyle: {
        fontSize: 18,
        color: '#1296db'
    },
    viewStyle: {
      marginTop: 15,
      marginBottom: 15,
      height: 240,
    },
    itemStyle: {
        backgroundColor: '#FFFFFF',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
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
    inputStyle: {
        flex: 1,
        // marginRight: 5,
        // marginLeft: 5
    },
    pickerViewStyle: {
        // backgroundColor: 'red',
        // flex: 1,
        // marginRight: 5,
        // marginLeft: 10,
        paddingLeft: 5,
        justifyContent: 'center'
    }
});