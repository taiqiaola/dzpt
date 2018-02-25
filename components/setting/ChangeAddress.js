import React, {Component} from 'react';
import {StyleSheet, View, Alert, TextInput, Image, 
    Text, Button, TouchableNativeFeedback, ToastAndroid} from 'react-native';
import Picker from 'react-native-picker';

import Style from '../style/Style';
import area from '../../common/area.json';
import cfg from '../../common/config.json';

export default class ChangeAddress extends Component{
    constructor(props){
        super(props);
        this.state = {
            area: '请选择',
            address: ''
        };
        this.changeAddressSubmit = this.changeAddressSubmit.bind(this);
        this.createAreaData = this.createAreaData.bind(this);
        this.chooseArea = this.chooseArea.bind(this);
    }

    createAreaData(){
        let data = [];
        let len = area.length;
        for(let i = 0; i < len; i++){
            let city = [];
            for(let j = 0, cityLen = area[i]['city'].length; j < cityLen; j++){
                let _city = {};
                _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(_city);
            }

            let _data = {};
            _data[area[i]['name']] = city;
            data.push(_data);
        }
        return data;
    }

    chooseArea(){
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '',
            pickerConfirmBtnColor: [18, 150, 219, 1],
            pickerCancelBtnColor: [217, 18 , 48, 1],
            pickerToolBarBg: [245, 252 , 255, 1],
            pickerBg: [224, 224 , 224, 1],
            pickerData: this.createAreaData(),
            // selectedValue: ['北京', '北京', '东城区'],
            onPickerConfirm: data => {
                this.setState({
                    area: data
                });
            },
            onPickerCancel: data => {
                // Alert.alert(`quxiao`);
            },
            onPickerSelect: data => {
                // Alert.alert(`xuanz`);
            }
        });

        Picker.show();
    }

    componentWillUnmount(){
        Picker.hide();
    }
    
    async changeAddressSubmit(){
        let {t_user_id, p_app_id, reloadUserInfo} = this.props.navigation.state.params;
        let {area, address} = this.state;
        let allAddress = area + '' + address;
        allAddress = allAddress.replace(/,/g, '');

        Picker.hide();
        if(area === '请选择'){
            ToastAndroid.show('请选择所在地区', ToastAndroid.SHORT);
        }else if(address === ''){
            ToastAndroid.show('请输入详细地址', ToastAndroid.SHORT);
        }else {
            try {
                let response = await fetch(cfg.url+'servlets/UserJsonSvlt?tag=user_update&f=f', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 't_user_id='+t_user_id+'&address='+allAddress+'&p_app_id='+p_app_id+''
                });
                let responseJSON = await response.json();
                let {STATUS} = responseJSON;
                if (STATUS === 1) {
                    reloadUserInfo();
                    this.props.navigation.goBack();
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    render(){
        let {changeAddressSubmit, chooseArea, onFocus} = this;
        let {area, address} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <View style={S.viewStyle}>
                    <View style={S.allAddressStyle}>
                        <TouchableNativeFeedback onPress={chooseArea}>
                            <View style={S.areaStyle}>
                                <Text style={{fontSize: 16, color: 'black', marginLeft: 10,}}>
                                    {`所在地区`}
                                </Text>
                                <View style={S.displayInfoStyle}>
                                    <Text style={S.displayTextStyle}>{area}</Text>
                                    <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <View style={S.addressStyle}>
                            <TextInput 
                                style={S.inputStyle}
                                autoCapitalize='none'
                                placeholder='请输入详细街道地址'
                                underlineColorAndroid='transparent'
                                onFocus={() => Picker.hide()}
                                value={address}
                                onChangeText={(text) => this.setState({address: text})}
                            />
                        </View>
                    </View>
                    <View style={Style.buttonStyle}>
                        <Button
                            onPress={changeAddressSubmit}
                            title="保存"
                            accessibilityLabel="Learn more about this blue button"
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const S = StyleSheet.create({
    viewStyle: {
        flex: 1,
    },
    displayInfoStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    displayTextStyle: {
        fontSize: 13,
        color: 'gray'
    },
    allAddressStyle: {
        marginTop: 15,
    },
    areaStyle: {
        backgroundColor: '#FFFFFF',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 1
    },
    addressStyle: {
        backgroundColor: '#FFFFFF',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputStyle: {
        flex: 1,
        marginRight: 5,
        marginLeft: 5
    }
});