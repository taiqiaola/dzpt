import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Alert, 
    TouchableNativeFeedback, ToastAndroid, Platform} from 'react-native';
import {ActionSheet} from 'antd-mobile';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob';
const SHA1 = require("crypto-js/sha1");

import Style from '../style/Style';
import Loading from '../loading/Loading';
import Common from '../../common/Common';
import cfg from '../../common/config.json';

export default class SettingUserInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            image_icon: 'default_icon',
            userInfo: '',
            isLoading: true,
            options: [],
            corpData: [],
            corpIdArray: []
        };
        this.reloadUserInfo = this.reloadUserInfo.bind(this);
    }

    showImageActionSheet(){
        const BUTTONS = ['拍照', '我的相册', '取消'];
        ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: BUTTONS.length - 1,
          maskClosable: true,
        },
        (index) => {
            switch(index) {
                case 0:
                    ImagePicker.openCamera({
                        width: 400,
                        height: 400,
                        cropping: true
                    }).then(image => {
                        let path = image.path;
                        // console.log(image);
                        // console.log(path);
                        this.upLoader(path);
                    });
                    break;
                case 1:
                    ImagePicker.openPicker({
                        width: 400, 
                        height: 400, 
                        cropping: true
                    }).then(image => { 
                        let path = image.path;
                        // console.log(image);
                        // console.log(path);
                        this.upLoader(path);
                    });
                    break;
            }
        });
    }

    showSexActionSheet(){
        const BUTTONS = ['男', '女', '取消'];
        ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: BUTTONS.length - 1,
          maskClosable: true,
        },
        (buttonIndex) => {
            console.log(buttonIndex);
            // ToastAndroid.show(BUTTONS[buttonIndex], ToastAndroid.SHORT);
            buttonIndex != 2 ? this.onSubmit('sex', buttonIndex+1) : null
        });
    }

    uuid() {
        let uuid = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            uuid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        uuid[14] = "4";
        uuid[19] = hexDigits.substr((uuid[19] & 0x3) | 0x8, 1);
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    
        return uuid.join('');
    }

    upLoader(path){
        let {userInfo: {t_user_id}} = this.props.screenProps;
        let {reloadInfo} = this.props.navigation.state.params;
        let body = [{
            name: 'file',
            filename: Common.uuid()+'.jpg',
            data: RNFetchBlob.wrap(path)
        }];
        RNFetchBlob.fetch('POST', cfg.url+'servlets/UploaderSvlt?f=f&t_user_id='+t_user_id, {
            'Content-Type' : 'multipart/form-data',
        }, body)
        .then((response)=> {
            let status = response.respInfo.status;
            if (status === 200){
                // console.log('上传成功');
                reloadInfo();
                //重新加载user信息
                this.loadUserInfo();
            }
        })
        .catch((error) => {
            console.log(error);
        });
        
        // try {
        //     let formData = new FormData();
        //     let file = {
        //         uri: path, 
        //         type: 'multipart/form-data', 
        //         name: this.uuid()+'.jpg'
        //     };
        //     formData.append('file', file);

        //     let options = {};
        //     options.method = 'post';
        //     options.body = formData;

        //     let response = await fetch(cfg.url+'servlets/UploaderSvlt?f=f&t_user_id='+t_user_id, options);
        //     let {status} = response;
        //     if (status === 200) {
        //         console.log('上传成功');
        //     }
        // } catch (error) {
        //     console.error(error);
        // }
    }

    downLoader(icon){
        // let dirs = RNFetchBlob.fs.dirs;
        let url = cfg.url+'user_img/'+icon;
        let path = RNFetchBlob.fs.dirs.CacheDir+SHA1(url)+".jpg";
        // console.log('icon:', icon);
        // console.log('url:', url);
        // console.log('SHA1(url):', SHA1(url));

        RNFetchBlob.fs.exists(path).then((isExist) => {
            if(isExist){
                console.log('已存在');
                // console.log('path:', path);
                Platform.OS === 'android' ? (
                    this.setState({image_icon: 'file://' + path})
                ) : (
                    this.setState({image_icon: path})
                )
            }else {
                console.log('不存在');
                RNFetchBlob.config({path}).fetch('GET', url, {})
                .then((res) => {
                    // console.log('res.path:', res.path());
                    Platform.OS === 'android' ? (
                        this.setState({image_icon: 'file://' + res.path()})
                    ) : (
                        this.setState({image_icon: res.path()})
                    )
                })
                .catch((error) => {
                    this.setState({image_icon: 'default_icon'});
                    console.log(error);
                });
            }
        })
    }

    reloadUserInfo(){
        //重新加载user信息
        this.loadUserInfo();
    }

    componentDidMount() {
        //加载user信息
        this.loadUserInfo();
        //获得corp数据
        // this.getCorpData();
    }

    componentWillUnmount(){
        Picker.hide();
    }

    async getCorpData(){
        let {userInfo: {p_app_id}} = this.props.screenProps;
        try {
            let response = await fetch(cfg.url+'servlets/CorpJsonSvlt?tag=corp_list_select&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: '&p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, corps} = responseJSON;
            if (STATUS === 1) {
                let {corpData, corpIdArray} = this.state;
                corps.map((elt) => {
                    //单位名称所在的数组
                    corpData.push(elt.syscorp_name);
                    //单位id所在的数组
                    corpIdArray.push(elt.syscorp_id);
                });
                this.setState({corpData, corpIdArray});
            }
        } catch (error) {
            console.error(error);
        }
    }

    async loadUserInfo(){
        let {userInfo: {t_user_id, p_app_id}} = this.props.screenProps;
        try {
            let response = await fetch(cfg.url+'servlets/UserJsonSvlt?tag=user_info_by_id&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: '&t_user_id='+t_user_id
            });
            let responseJSON = await response.json();
            let {STATUS, user: userInfo} = responseJSON;
            let {user_icon} = userInfo;
            if (STATUS === 1) {
                user_icon == null ? null : (this.downLoader(user_icon))
                this.setState({
                    userInfo,
                    isLoading: false
                });
            }
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    showCorpPicker(){
        let {corpData, corpIdArray} = this.state;
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '',
            pickerConfirmBtnColor: [18, 150, 219, 1],
            pickerCancelBtnColor: [217, 18, 48, 1],
            pickerToolBarBg: [245, 252, 255, 1],
            pickerBg: [242, 242, 242, 1],
            pickerData: corpData,
            // selectedValue: ['北京', '北京', '东城区'],
            onPickerConfirm: (data, index) => {
                this.onSubmit('syscorp_id', corpIdArray[index]);
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
    
    //共用的提交函数
    async onSubmit(param, data){
        let {userInfo: {t_user_id, p_app_id}} = this.props.screenProps;
        try {
            let response = await fetch(cfg.url+'servlets/UserJsonSvlt?tag=user_update&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 't_user_id='+t_user_id+'&'+param+'='+data+'&p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS} = responseJSON;
            if (STATUS === 1) {
                this.loadUserInfo();
                // Picker.hide();
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    render(){
        let {userInfo: {t_user_id, p_app_id}} = this.props.screenProps;
        let {reloadUserInfo} = this;
        let {image_icon, userInfo, isLoading} = this.state;
        // console.log('image_icon:', image_icon);
        let {navigate} = this.props.navigation;
        let {loginname, name, sex, sj, syscorp_id, syscorp_name, address} = userInfo;

        let sexText = '';
        if(sex === '1'){
            sexText = '男';
        }else if(sex === '2'){
            sexText = '女';
        }

        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {isLoading ? <Loading/> : null}
                <TouchableNativeFeedback onPress={() => {
                    Picker.hide();
                    this.showImageActionSheet();
                }}>
                    <View style={[S.imageItemStyle, {marginTop: 15}]}>
                        <Text style={S.tipsTextStyle}>{`头像`}</Text>
                        <View style={S.displayInfoStyle}>
                            <Image style={S.imageStyle} source={{uri: image_icon}}/>
                            <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                {/* <View style={{height: 1,}}></View> */}
                <TouchableNativeFeedback onPress={() => {
                        Picker.hide();
                        Alert.alert(
                            '提示', 
                            '用户名不允许更改！', 
                            [
                                {text: '确定',}
                            ], 
                            {cancelable: false}
                        );
                    }
                }>
                    <View style={S.itemStyle}>
                        <Text style={S.tipsTextStyle}>{`用户名`}</Text>
                        <View style={S.displayInfoStyle}>
                            <Text style={S.displayTextStyle}>{loginname}</Text>
                            <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                {/* <View style={{height: 1,}}></View> */}
                <TouchableNativeFeedback onPress={() => {
                        Picker.hide();
                        Alert.alert(
                            '提示', 
                            '姓名不允许更改！', 
                            [
                                {text: '确定',}
                            ], 
                            {cancelable: false}
                        );
                    }
                }>
                    <View style={S.itemStyle}>
                        <Text style={S.tipsTextStyle}>{`姓名`}</Text>
                        <View style={S.displayInfoStyle}>
                            <Text style={S.displayTextStyle}>{name}</Text>
                            <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                {/* <View style={{height: 1,}}></View> */}
                <TouchableNativeFeedback onPress={() => {
                    Picker.hide();
                    this.showSexActionSheet();
                }}>
                    <View style={S.itemStyle}>
                        <Text style={S.tipsTextStyle}>{`性别`}</Text>
                        <View style={S.displayInfoStyle}>
                            <Text style={S.displayTextStyle}>{sexText}</Text>
                            <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                        Picker.hide();
                        navigate('ChangeSJ', {
                            sj,
                            t_user_id,
                            p_app_id,
                            reloadUserInfo
                        });
                    }
                }>
                    <View style={[S.itemStyle, {marginTop: 20}]}>
                        <Text style={S.tipsTextStyle}>{`手机`}</Text>
                        <View style={S.displayInfoStyle}>
                            <Text style={S.displayTextStyle}>{sj}</Text>
                            <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                {/* <View style={{height: 1,}}></View> */}
                <TouchableNativeFeedback onPress={() => {
                    // this.showCorpPicker();
                    navigate('ChangeCorp', {
                        syscorp_id,
                        reloadUserInfo
                    });
                }}>
                    <View style={S.itemStyle}>
                        <Text style={S.tipsTextStyle}>{`所属单位`}</Text>
                        <View style={S.displayInfoStyle}>
                            <Text style={S.displayTextStyle}>{syscorp_name}</Text>
                            <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                {/* <View style={{height: 1,}}></View> */}
                <TouchableNativeFeedback onPress={() => {
                        Picker.hide();
                        navigate('ChangeAddress', {
                            t_user_id,
                            p_app_id,
                            reloadUserInfo
                        });
                    }
                }>
                    <View style={S.itemStyle}>
                        <Text style={S.tipsTextStyle}>{`联系地址`}</Text>
                        <View style={S.displayInfoStyle}>
                            <Text style={S.displayTextStyle}>{address}</Text>
                            <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }
}

const S = StyleSheet.create({
    displayTextStyle: {
        fontSize: 13,
        color: 'gray'
    },
    displayInfoStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    imageStyle: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    tipsTextStyle: {
        fontSize: 16,
        color: 'black',
        marginLeft: 10,
        width: 80,
    },
    partStyle: {
        marginTop: 15,
        marginRight: 0,
        marginBottom: 5,
        marginLeft: 0,
    },
    imageItemStyle: {
        backgroundColor: '#FFFFFF',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemStyle: {
        backgroundColor: '#FFFFFF',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});