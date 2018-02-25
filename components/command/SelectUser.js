import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Text, TouchableOpacity, Alert, 
    Image, ToastAndroid, TouchableNativeFeedback} from 'react-native';
import { SearchBar, Button, WhiteSpace, WingBlank } from 'antd-mobile';

import Style from '../style/Style';
import Loading from '../loading/Loading';
import cfg from '../../common/config.json';

let userData = [
    {t_user_id: 411, b_class_name: '大范围火灾', radioStatus: 'radio_unselected'},
    {t_user_id: 412, b_class_name: '小范围火灾', radioStatus: 'radio_unselected'},
    {t_user_id: 413, b_class_name: '大范围停电', radioStatus: 'radio_unselected'},
    {t_user_id: 414, b_class_name: '小范围停电', radioStatus: 'radio_unselected'}
];

export default class SelectUser extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            userData: [],
            unSelectedNum: '',
            tipText: '全选'
        };
        this.keyExtractor = this.keyExtractor.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        let pms = navigation.state.params;
        return {
            headerTitle: '选择用户',
            headerRight: (
                <TouchableOpacity onPress={() => pms.navigatePress()}>
                    <View style={S.rightViewStyle}>
                        <Image style={S.iconStyle} 
                            source={{uri: pms.fromPage === 'CommandIssue' ? 'zhilingxiada' : 'fasongxiaoxi'}}
                        />
                        {/* <Text style={S.rightTextStyle}>
                            {
                                pms.fromPage === 'CommandIssue' ? '指令下达' : '发送消息'
                            }
                        </Text> */}
                    </View>
                </TouchableOpacity>
            )
        }
    };

    async getUserList(){
        let {userInfo: {p_app_id}} = this.props.screenProps;
        let YLPLAN_ID = 206;
        try {
            let response = await fetch(cfg.url+'servlets/UserJsonSvlt?tag=user_list&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'user_tag=1&jhid='+YLPLAN_ID+'&p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, users: userData} = responseJSON;
            if (STATUS === 1) {
                userData.map((elt) => {
                    //先添加unselected属性
                    elt.radioStatus = 'radio_unselected'
                });

                this.setState({
                    isLoading: false,
                    userData,
                    unSelectedNum: userData.length
                });
            }
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    nextStep(){
        let selectedUser = [], check = true;
        let {navigate, state} = this.props.navigation;
        let {userData} = this.state;

        userData.map((elt) => {
            if(elt.radioStatus === 'radio_selected'){
                selectedUser.push(elt.t_user_id);
            }
        });
        
        if(selectedUser.length === 0){
            check = false;
            ToastAndroid.show('请选择人员', ToastAndroid.SHORT);
        }
        
        if(check){
            state.params.fromPage === 'CommandIssue' ? (
                navigate(`CommandIssue`, {selectedUser})
            ) : (
                navigate(`SendMessage`, {selectedUser})
            )
        }
    }

    componentDidMount() {
        //加载信息
        this.getUserList();

        //组件挂载完成之后设置方法
        this.props.navigation.setParams({
            navigatePress: () => this.nextStep()
        });
    }

    keyExtractor = (item) => item.T_USER_ID;

    //点击每一条
    itemOnClick(item){
        let {userData, unSelectedNum, tipText} = this.state;
        userData.map((elt) => {
            if(elt.t_user_id === item.t_user_id){
                elt.radioStatus === 'radio_selected' ? (
                    elt.radioStatus = 'radio_unselected',
                    unSelectedNum++
                ) : (
                    elt.radioStatus = 'radio_selected',
                    unSelectedNum--
                )
            }
        });
        
        unSelectedNum === 0 ? (
            this.setState({
                userData, 
                unSelectedNum, 
                tipText: '取消全选'
            })
        ) : (
            this.setState({
                userData, 
                unSelectedNum, 
                tipText: '全选'
            })
        )
    }
    
    selectAll(){
        let {userData} = this.state;
        userData.map((elt) => {
            elt.radioStatus = 'radio_selected';
        });
        this.setState({
            userData, 
            unSelectedNum: 0, 
            tipText: '取消全选'
        });
    }
    
    unSelectAll(){
        let {userData} = this.state;
        userData.map((elt) => {
            elt.radioStatus = 'radio_unselected';
        });
        this.setState({
            userData, 
            unSelectedNum: userData.length, 
            tipText: '全选'
        });
    }

    render(){
        let {keyExtractor} = this;
        let {userData, isLoading, unSelectedNum, tipText} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {
                    isLoading ? <Loading/> : (
                        userData.length == 0 ? (
                            <View style={S.noDataStyle}>
                                <Text style={S.noDataTextStyle}>{`没有用户`}</Text>
                            </View>
                        ) : (
                            <View style={{flex: 1}}>
                                <View style={S.topViewStyle}>
                                    <TouchableOpacity onPress={
                                        unSelectedNum === 0 ? (
                                            () => this.unSelectAll()
                                        ) : (
                                            () => this.selectAll()
                                        )
                                    }>
                                        <View>
                                            <Text style={S.topTextStyle}>{tipText}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {/* <View style={{flex: 1}}>
                                        <SearchBar placeholder="搜索"/>
                                    </View> */}
                                </View>
                                <FlatList
                                    ItemSeparatorComponent={
                                        () => <View style={{height: 1,}}/>
                                    }
                                    initialNumToRender={6}
                                    data={userData}
                                    keyExtractor={keyExtractor}
                                    renderItem={({item}) => (
                                        <TouchableNativeFeedback onPress={() => 
                                            this.itemOnClick(item)
                                        }>
                                            <View style={S.itemStyle}>
                                                <Image 
                                                    style={S.checkBoxStyle} 
                                                    source={{uri: item.radioStatus}}
                                                />
                                                <View style={{flex: 1, marginRight: 5,}}>
                                                    <View style={{
                                                        flexDirection: 'row', 
                                                        justifyContent: 'space-between'
                                                    }}>
                                                        <Text style={S.firstTextStyle}>
                                                            {`姓名：${item.NAME}`}
                                                        </Text>
                                                        {/* {
                                                            (item.X == "" || item.Y == "") ? (
                                                                <Text style={{color: 'red'}}>{`无法定位`}</Text>
                                                            ) : (
                                                                <Text style={{color: 'blue'}}>{`定位`}</Text>
                                                            )
                                                        } */}
                                                    </View>
                                                    <Text style={S.otherTextStyle}>
                                                        {`性别：${item.SEX=='1'?'男':'女'}`}
                                                    </Text>
                                                    <Text style={S.otherTextStyle}>
                                                        {`手机号码：${item.SJ==null?'':item.SJ}`}
                                                    </Text>
                                                    <Text style={S.otherTextStyle}>
                                                        {`所在单位：${item.SYSCORP_NAME}`}
                                                    </Text>
                                                    <Text style={S.otherTextStyle}>
                                                        {`所属角色：${item.SYSROLE_NAME}`}
                                                    </Text>
                                                    <Text 
                                                        style={S.otherTextStyle} 
                                                        numberOfLines={1}
                                                    >
                                                        {`所在组：${item.zustr}`}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableNativeFeedback>
                                    )}
                                />
                            </View>
                        )
                    )
                }
            </View>
        );
    }
}

const S = StyleSheet.create({
    rightViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 18
    },
    iconStyle: {
        width: 20,
        height: 20
    },
    rightTextStyle: {
        fontSize: 18,
        color: '#1296db'
    },
    topViewStyle: {
        backgroundColor: '#EFEFF4',
        flexDirection: 'row',
        height: 40,
        paddingLeft: 10,
        alignItems: 'center',
    },
    topTextStyle: {
        fontSize: 16,
        color: '#1C86EE'
    },
    noDataStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataTextStyle: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center'
    },
    itemStyle: {
        flexDirection: 'row',
        height: 140,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    checkBoxStyle: {
        width: 23,
        height: 23,
        marginRight: 5,
        marginLeft: 5
    },
    firstTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    otherTextStyle: {
        fontSize: 15,
        color: 'gray'
    }
});