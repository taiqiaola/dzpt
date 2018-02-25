import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Alert, TouchableNativeFeedback, 
    Platform, Modal, TouchableOpacity} from 'react-native';
import {StackNavigator} from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
const SHA1 = require("crypto-js/sha1");

import Style from '../style/Style';
import cfg from '../../common/config.json';

export default class Setting extends Component{
    constructor(props){
        super(props);
        this.state = {
            zustr: '',
            image_icon: 'default_icon',
            modalVisible: false
        };
        this.reloadInfo = this.reloadInfo.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '我的',
            headerTitleStyle: {alignSelf: 'center'}
        }
    };

    componentDidMount() {
        this.loadInfo();
    }

    reloadInfo(){
        this.loadInfo();
    }

    async loadInfo(){
        let {userInfo: {t_user_id, p_app_id}} = this.props.screenProps;
        let YLPLAN_ID = 206;
        try {
            let response = await fetch(cfg.url+'servlets/UserJsonSvlt?tag=user_info_by_id&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: '&t_user_id='+t_user_id+'&jhid='+YLPLAN_ID
            });
            let responseJSON = await response.json();
            let {STATUS, zustr, user: {user_icon}} = responseJSON;
            if (STATUS === 1) {
                user_icon == null ? null : (this.downLoader(user_icon))
                this.setState({zustr});
            }
        } catch (error) {
            console.error(error);
        }
    }

    downLoader(icon){
        // let dirs = RNFetchBlob.fs.dirs;
        let url = cfg.url+'user_img/'+icon;
        let path = RNFetchBlob.fs.dirs.CacheDir+SHA1(url)+".jpg";
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

    render(){
        let {navigate} = this.props.navigation;
        let {userInfo: {name, loginname}, userLogout} = this.props.screenProps;
        let {zustr, image_icon, modalVisible} = this.state;
        let {reloadInfo} = this;
        // console.log('image_icon:', image_icon);
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={modalVisible}
                    onShow={() => {}}
                    onRequestClose={() => {
                        // this.setState({modalVisible: false});
                    }}
                >
                    <View style={S.modalStyle}>
                        <View style={S.subView}>
                            <Text style={S.titleText}>{`所在组`}</Text>  
                            <Text style={S.contentText}>{zustr}</Text>
                            <TouchableNativeFeedback onPress={() => {
                                    this.setState({modalVisible: false});
                                }
                            }>
                                <View style={S.buttonView}>
                                    <Text style={S.buttonText}>{`确定`}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </Modal>
                <TouchableNativeFeedback onPress={() => {
                    Alert.alert(
                        '所在组', zustr, [{text: '确定', style: 'cancel'}], 
                        {cancelable: false}
                    );
                    // this.setState({modalVisible: true});
                }}>
                    <View style={S.infoStyle}>
                        <View style={S.imageViewStyle}>
                            <Image style={S.imageStyle} source={{uri: image_icon}}/>
                        </View>
                        <View style={S.nameStyle}>
                            <Text style={{fontSize: 20, color: 'black'}}>{name}</Text>
                            <Text numberOfLines={1}>{`所在组：${zustr}`}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                    navigate('MyPlanRemind');
                }}>
                    <View style={[S.itemStyle, {marginTop: 10}]}>
                        <Text style={{fontSize: 16, color: 'black', marginLeft: 10,}}>{`我的预案库`}</Text>
                        <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                    navigate('SettingUserInfo', {reloadInfo});
                }}>
                    <View style={S.itemStyle}>
                        <Text style={{fontSize: 16, color: 'black', marginLeft: 10,}}>{`个人信息维护`}</Text>
                        <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                    </View>
                </TouchableNativeFeedback>
                {/* <View style={{height: 20}}></View> */}
                <TouchableNativeFeedback onPress={() => {
                    Alert.alert(
                        '版本检查', 
                        '当前版本是最新版本！', 
                        [
                            {text: '确定',}
                        ], 
                        {cancelable: false}
                    );
                }}>
                    <View style={S.itemStyle}>
                        <Text style={{fontSize: 16, color: 'black', marginLeft: 10,}}>{`检查版本`}</Text>
                        <View style={S.displayInfoStyle}>
                            {/* <View style={S.newVersionStyle}>
                                <Text style={S.displayTextStyle}>{'new'}</Text>
                            </View> */}
                            <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                    navigate('About');
                }}>
                    <View style={[S.itemStyle, {marginBottom: 10}]}>
                        <Text style={{fontSize: 16, color: 'black', marginLeft: 10,}}>{`关于`}</Text>
                        <Image style={Style.rightIconStyle} source={{uri: 'right_icon'}}/>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => {
                    Alert.alert(
                        '注销账号', 
                        '确定注销当前账号吗？', 
                        [
                            {text: '取消'},
                            {text: '确定', onPress: () => userLogout(), style: 'cancel'}
                        ], 
                        {cancelable: false}
                    );
                }}>
                    <View style={S.logoutStyle}>
                        <Text style={{fontSize: 16, color: 'red',}}>{`退出登录`}</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }
}

const S = StyleSheet.create({
    modalStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    subView: {
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 2,
        borderWidth: 0.2,
        borderColor: '#fff',
    },
    titleText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentText: {
        margin: 8,
        fontSize: 16,
        textAlign: 'center',
    },
    buttonView: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 10,
        // marginBottom: 10,
    },
    buttonStyle: {  
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#3393F2',
        fontWeight: 'bold'
    },
    displayInfoStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    newVersionStyle: {
        borderRadius: 10, 
        backgroundColor: 'red', 
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    displayTextStyle: {
        fontSize: 13,
        color: 'white',
    },
    infoStyle: {
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageViewStyle: {
        width: 80, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    imageStyle: {
        width: 60,
        height: 60,
        borderRadius: 50
    },
    nameStyle: {
        flex: 1,
        height: 60,
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    itemStyle: {
        backgroundColor: '#FFFFFF',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoutStyle: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    }
});