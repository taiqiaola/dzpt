import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, TouchableNativeFeedback, FlatList, 
    ToastAndroid, Dimensions, ActivityIndicator} from 'react-native';
import {SegmentedControl, WingBlank} from 'antd-mobile';

import Style from '../style/Style';
import Loading from '../loading/Loading';
import cfg from '../../common/config.json';

export default class MyOrderPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            orderJumpPage: 1,
            max_order_id: '',//加载该页面时，数据库中最大的order_id
            max_t_order_id: '',//任何时候，数据库中最大的order_id
            last_refresh_max_id: '',//每次刷新之前，数据库中最大的order_id
            orderData: [],
            orderFootText: '---没有更多数据了---',
            orderEndReachedThreshold: '-1000',
            isRefreshing: false,
        };
        this.keyExtractor = this.keyExtractor.bind(this);
        this.pullDownRefresh = this.pullDownRefresh.bind(this);
        this.refresh = this.refresh.bind(this);
        this.orderFooterComponent = this.orderFooterComponent.bind(this);
        this.getOrderData = this.getOrderData.bind(this);
        this.orderEndReached = this.orderEndReached.bind(this);
        this.reloadOrderData = this.reloadOrderData.bind(this);
    }
    
    componentDidMount() {
        this.getOrderData();
        //定时器，30秒刷新一次
        // this.interval = setInterval(() => {
        //     this.refresh();
        // }, 20000);
    }
    
    componentWillUnmount(){
        this.timeout && clearTimeout(this.timeout);
        // this.interval && clearInterval(this.interval);
    }
    
    orderEndReached(){
        this.timeout = setTimeout(() => {
            this.setState({
                orderJumpPage: this.state.orderJumpPage + 1
            });
            this.getOrderData();
        }, 1000);
    }

    orderFooterComponent(){
        let {orderFootText} = this.state;
        return (
            <View style={Style.footViewStyle}>
                {/* <ActivityIndicator 
                    animating={true}
                    size='small' 
                    color='#FF4500' 
                    style={Style.footLoading}
                /> */}
                <Text>{orderFootText}</Text>
            </View>
        )
    }

    keyExtractor = (item) => item.T_ORDER_ID;

    reloadOrderData(){
        this.setState({
            orderData: []
        });
        this.getOrderData();
    }
    
    async getOrderData(){
        let {navigate, p_app_id, t_user_id} = this.props.screenProps;
        let {orderJumpPage, max_order_id, orderData} = this.state;
        const whereSql = ' order by tmp.inner_count asc, tmp.create_time desc, tmp.t_order_id desc';
        const whereSql1 = ' and re_t_user_id = ';
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=order_list_for_page&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'order_type=1&jumpPage='+orderJumpPage+'&whereSql='+whereSql
                    +'&whereSql1='+whereSql1+'&max_id='+max_order_id
                    +'&re_t_user_id='+t_user_id+'&p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, maxPage, unreadOrderNum, maxTOrderId, row_array: preTimeData} = responseJSON;
            if (STATUS === 1) {
                // unreadOrderNum == '0' ? null : (
                //     tabs[0]='我的指令('+unreadOrderNum+')'
                // );

                //如果maxPage=0，说明没有数据，即默认不显示尾部组件
                if(maxPage == 0){
                    this.setState({
                        max_order_id: 0,
                        max_t_order_id: 0,
                        last_refresh_max_id: 0
                    });
                }else if(maxPage > 0){
                    this.setState({
                        max_order_id: maxTOrderId,
                        max_t_order_id: maxTOrderId,
                        last_refresh_max_id: maxTOrderId
                    });
                    //如果maxPage=1，说明只有一页数据，则正常显示即可
                    //有多页数据
                    if(maxPage > 1){
                        //还没到最后一页
                        if(orderJumpPage < maxPage){
                            this.setState({
                                orderFootText: '正在加载更多数据...',
                                orderEndReachedThreshold: '0.05'
                            });
                        }
                        //已经到最后一页
                        else if(orderJumpPage === maxPage){
                            this.setState({
                                orderFootText: '---已经到底了---',
                                orderEndReachedThreshold: '-1000'
                            });
                        }
                    }
                    //数据push进去
                    preTimeData.map((elt) => {

                        let back_class_array = [];//返回结果中的b_class_id的数组集合
                        let back_data_array = [];//返回结果中的b_data_id的数组集合
                        let back_rs = '';//返回结果中的rs，当有人数传回时，只可能有一个结果

                        elt.BACK_LIST.map((elt_1) => {
                            back_class_array.push(elt_1.B_CLASS_ID);
                            back_data_array.push(elt_1.RESULT_B_DATA_ID);
                            back_rs = elt_1.RS == null ? '' : elt_1.RS;
                        });

                        elt.back_class_array = back_class_array;
                        elt.back_data_array = back_data_array;
                        elt.back_rs = back_rs;
                        // console.log(elt);
                        orderData.push(elt);
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
        let {max_t_order_id, orderData} = this.state;
        // console.log(max_t_order_id);
        this.setState({
            last_refresh_max_id: max_t_order_id
        });
        // console.log(this.state.last_refresh_max_id);
        
        const whereSql = ' order by tmp.inner_count asc, tmp.create_time asc, tmp.t_order_id asc';
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=new_order_list&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'order_type=1&whereSql='+whereSql+'&max_id='+max_t_order_id
                    +'&re_t_user_id='+t_user_id+'&p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, maxTOrderId, new_list: newData} = responseJSON;
            if (STATUS === 1) {
                if(newData.length > 0){
                    // console.log(newData.length);
                    this.setState({
                        max_t_order_id: maxTOrderId
                    });
                    newData.map((elt) => {
                        orderData.unshift(elt);
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
        let {orderFooterComponent, keyExtractor, pullDownRefresh, orderEndReached, reloadOrderData} = this;
        let {last_refresh_max_id, orderData, orderEndReachedThreshold, isRefreshing, isLoading} = this.state;
        //为了让提示居中，获取空白处的高度，状态栏24，标题栏56，上tab栏40，下tab栏52
        let noDataViewHeight = Dimensions.get('window').height - 172;
        return (
            isLoading ? <Loading/> : (
                <FlatList
                    ItemSeparatorComponent={() => (<View style={{height: 1,}}/>)}
                    ListFooterComponent={orderData.length === 0 ? null : orderFooterComponent}
                    ListEmptyComponent={() => (
                        <View style={[S.noDataStyle, {height: noDataViewHeight}]}>
                            <Text style={S.noDataTextStyle}>{`没有指令记录`}</Text>
                        </View>
                    )}
                    onRefresh={pullDownRefresh}
                    refreshing={isRefreshing}
                    initialNumToRender={6}
                    data={orderData}
                    keyExtractor={keyExtractor}
                    renderItem={({item}) => (
                        <TouchableNativeFeedback onPress={() => 
                            navigate('SelfReportDetail', {
                                topText: item.B_CLASS_NAME,
                                index: item.TARGET_B_CLASS_ID,
                                t_order_id: item.T_ORDER_ID,
                                back_class_array: item.back_class_array,
                                back_data_array: item.back_data_array,
                                back_rs: item.back_rs,
                                reloadOrderData
                            })
                        }>
                            <View style={S.itemStyle}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={S.firstTextStyle}>{item.B_CLASS_NAME}</Text>
                                    {
                                        item.T_ORDER_ID > last_refresh_max_id ? (
                                            <Text style={{color: 'red'}}>{`new`}</Text>
                                        ) : null
                                    }
                                </View>
                                <Text style={S.otherTextStyle}>{`下达人：${item.T_NAME_1}`}</Text>
                                <Text style={S.otherTextStyle}>{`下达时间：${item.CREATE_TIME_1}`}</Text>
                                <Text style={S.otherTextStyle}>{`所属任务：${item.TASK_NAME}`}</Text>
                                <View style={{flexDirection: 'row',}}>
                                    <Text style={S.otherTextStyle}>{`发送状态：`}</Text>
                                    {
                                        item.INNER_COUNT === '1' ?  (
                                            <Text style={[S.otherTextStyle, {color: 'green'}]}>{`已上报`}</Text>
                                        ) : (
                                            <Text style={[S.otherTextStyle, {color: 'red'}]}>{`未上报`}</Text>
                                        )
                                    }
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    )}
                    onEndReachedThreshold={orderEndReachedThreshold}
                    onEndReached={orderEndReached}
                />
            )
        )
    }
}

const S = StyleSheet.create({
    noDataStyle: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataTextStyle: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center'
    },
    itemStyle: {
        height: 120,
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
    }
});