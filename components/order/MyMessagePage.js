import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, TouchableNativeFeedback, FlatList, ToastAndroid, 
    Dimensions, ActivityIndicator} from 'react-native';
import {SegmentedControl, WingBlank} from 'antd-mobile';

import Style from '../style/Style';
import Loading from '../loading/Loading';
import cfg from '../../common/config.json';

export default class MyMessagePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            messageJumpPage: 1,
            max_message_id: '',//加载该页面时，数据库中最大的message_id
            max_t_message_id: '',//任何时候，数据库中最大的message_id
            last_refresh_max_id: '',//每次刷新之前，数据库中最大的message_id
            messageData: [],
            messageFootText: '---没有更多数据了---',
            messageEndReachedThreshold: '-1000',
            isRefreshing: false,
        };
        this.keyExtractor = this.keyExtractor.bind(this);
        this.pullDownRefresh = this.pullDownRefresh.bind(this);
        this.refresh = this.refresh.bind(this);
        this.messageFooterComponent = this.messageFooterComponent.bind(this);
        this.getMessageData = this.getMessageData.bind(this);
        this.messageEndReached = this.messageEndReached.bind(this);
        this.reloadMessageData = this.reloadMessageData.bind(this);
    }
    
    componentDidMount() {
        this.getMessageData();
        //定时器，30秒刷新一次
        // this.interval = setInterval(() => {
        //     this.refresh();
        // }, 20000);
    }

    componentWillUnmount(){
        this.timeout && clearTimeout(this.timeout);
        // this.interval && clearInterval(this.interval);
    }
    
    messageEndReached(){
        this.timeout = setTimeout(() => {
            this.setState({
                messageJumpPage: this.state.messageJumpPage + 1
            });
            this.getMessageData();
        }, 1000);
    }

    messageFooterComponent(){
        let {messageFootText} = this.state;
        return (
            <View style={Style.footViewStyle}>
                {/* <ActivityIndicator 
                    animating={true}
                    size='small' 
                    color='#FF4500' 
                    style={Style.footLoading}
                /> */}
                <Text>{messageFootText}</Text>
            </View>
        )
    }

    keyExtractor = (item) => item.T_MESSAGE_ID;

    reloadMessageData(){
        this.setState({
            messageData: []
        });
        this.getMessageData();
    }
    
    async getMessageData(){
        let {navigate, p_app_id, t_user_id} = this.props.screenProps;
        let {messageJumpPage, max_message_id, messageData} = this.state;
        const whereSql = ' order by tm.message_zt asc, tm.send_time desc';
        const whereSql1 = ' where re_user_id = ';
        try {
            let response = await fetch(cfg.url+'servlets/MessageJsonSvlt?tag=message_list_for_page&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'jumpPage='+messageJumpPage+'&whereSql='+whereSql
                    +'&whereSql1='+whereSql1+'&max_id='+max_message_id
                    +'&re_t_user_id='+t_user_id+'&p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, maxPage, unreadMessageNum, maxTMessageId, row: preTimeData} = responseJSON;
            if (STATUS === 1) {
                // unreadMessageNum == '0' ? null : (
                //     tabs[1]='我的消息('+unreadMessageNum+')'
                // );
                
                //如果maxPage=0，说明没有数据，即默认不显示尾部组件
                if(maxPage == 0){
                    this.setState({
                        max_message_id: 0,
                        max_t_message_id: 0,
                        last_refresh_max_id: 0
                    });
                }else if(maxPage > 0){
                    this.setState({
                        max_message_id: maxTMessageId,
                        max_t_message_id: maxTMessageId,
                        last_refresh_max_id: maxTMessageId
                    });
                    //如果maxPage=1，说明只有一页数据，则正常显示即可
                    //有多页数据
                    if(maxPage > 1){
                        //还没到最后一页
                        if(messageJumpPage < maxPage){
                            this.setState({
                                messageFootText: '正在加载更多数据...',
                                messageEndReachedThreshold: '0.05'
                            });
                        }
                        //已经到最后一页
                        else if(messageJumpPage === maxPage){
                            this.setState({
                                messageFootText: '---已经到底了---',
                                messageEndReachedThreshold: '-1000'
                            });
                        }
                    }
                    //数据push进去
                    preTimeData.map((elt) => {
                        messageData.push(elt);
                    });
                }

                this.setState({isLoading: false});
            }
        } catch (error) {
            console.error(error);
        }
    }

    //下拉刷新函数
    pullDownRefresh(){
        this.setState({isRefreshing: true});
        this.refresh();
        this.setState({isRefreshing: false});
    }
    
    //刷新函数
    async refresh(){
        let {p_app_id, t_user_id, tabs} = this.props;
        let {max_t_message_id, messageData} = this.state;
        // console.log(max_t_message_id);
        this.setState({
            last_refresh_max_id: max_t_message_id
        });
        // console.log(this.state.last_refresh_max_id);
        
        const whereSql = ' order by tm.message_zt asc, tm.send_time asc';
        try {
            let response = await fetch(cfg.url+'servlets/MessageJsonSvlt?tag=new_message_list&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'whereSql='+whereSql+'&max_id='+max_t_message_id
                    +'&re_t_user_id='+t_user_id+'&p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, maxTMessageId, new_list: newData} = responseJSON;
            if (STATUS === 1) {
                if(newData.length > 0){
                    // console.log(newData.length);
                    this.setState({
                        max_t_message_id: maxTMessageId
                    });
                    newData.map((elt) => {
                        messageData.unshift(elt);
                    });
                    ToastAndroid.show('已更新'+newData.length+'条记录', ToastAndroid.SHORT);
                    // console.log(newData.length);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    render(){
        let {navigate, p_app_id, t_user_id} = this.props.screenProps;
        // let {navigate, p_app_id, t_user_id} = this.props;
        let {messageFooterComponent, keyExtractor, pullDownRefresh, messageEndReached, reloadMessageData} = this;
        let {last_refresh_max_id, messageData, messageEndReachedThreshold, isRefreshing, isLoading} = this.state;
        //为了让提示居中，获取空白处的高度，状态栏24，标题栏56，上tab栏40，下tab栏52
        let noDataViewHeight = Dimensions.get('window').height - 172;
        return(
            isLoading ? <Loading/> : (
                <FlatList
                    ItemSeparatorComponent={() => (<View style={{height: 1,}}/>)}
                    ListFooterComponent={messageData.length === 0 ? null : messageFooterComponent}
                    ListEmptyComponent={() => (
                        <View style={[S.noDataStyle, {height: noDataViewHeight}]}>
                            <Text style={S.noDataTextStyle}>{`没有消息记录`}</Text>
                        </View>
                    )}
                    onRefresh={pullDownRefresh}
                    refreshing={isRefreshing}
                    initialNumToRender={6}
                    data={messageData}
                    keyExtractor={keyExtractor}
                    renderItem={({item}) => (
                        <TouchableNativeFeedback onPress={() => 
                            navigate('MessageDetail', {
                                t_message_id: item.T_MESSAGE_ID,
                                send_username: item.T_NAME_1,
                                send_time: item.CREATE_TIME_1,
                                msg_nr: item.SMS_NR,
                                message_zt: item.MESSAGE_ZT,
                                reloadMessageData
                            })
                        }>
                            <View style={S.itemStyle}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={S.firstTextStyle} numberOfLines={1}>{item.SMS_NR}</Text>
                                    {
                                        item.T_MESSAGE_ID > last_refresh_max_id ? (
                                            <Text style={{color: 'red'}}>{`new`}</Text>
                                        ) : null
                                    }
                                </View>
                                <Text style={S.otherTextStyle}>{`发送人：${item.T_NAME_1}`}</Text>
                                <Text style={S.otherTextStyle}>{`发送时间：${item.CREATE_TIME_1}`}</Text>
                                <View style={{flexDirection: 'row',}}>
                                    <Text style={S.otherTextStyle}>{`消息状态：`}</Text>
                                    {
                                        item.MESSAGE_ZT === '2' ?  (
                                            <Text style={[S.otherTextStyle, {color: 'green'}]}>{`已读`}</Text>
                                        ) : (
                                            <Text style={[S.otherTextStyle, {color: 'red'}]}>{`未读`}</Text>
                                        )
                                    }
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    )}
                    onEndReachedThreshold={messageEndReachedThreshold}
                    onEndReached={messageEndReached}
                />
            )
        )
    }
}

const S = StyleSheet.create({
    noDataStyle: {
        // flex: 1,
        // height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataTextStyle: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center'
    },
    itemStyle: {
        height: 100,
        padding: 14,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    firstTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    otherTextStyle: {
        fontSize: 15,
        color: 'gray'
    },
});