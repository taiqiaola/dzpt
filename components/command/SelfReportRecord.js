import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text, FlatList, ToastAndroid, 
    TouchableNativeFeedback, ActivityIndicator} from 'react-native';

import Style from '../style/Style';
import Loading from '../loading/Loading';
import Common from '../../common/Common';
import cfg from '../../common/config.json';

export default class SelfReportRecord extends Component{
    constructor(props) {
        super(props);
        this.state = {
            jumpPage: 1,
            reportData: [],
            isLoading: true,
            footText: '---没有更多数据了---',
            endReachedThreshold: '-1000'
        };
        this.getReportRecordData = this.getReportRecordData.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.footerComponent = this.footerComponent.bind(this);
        this.endReached = this.endReached.bind(this);
    }

    keyExtractor = (item) => item.T_ORDER_ID;

    componentDidMount() {
        //加载信息
        this.getReportRecordData();
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    
    async getReportRecordData() {
        let {userInfo: {p_app_id}} = this.props.screenProps;
        let {jumpPage} = this.state;
        // console.log(jumpPage);
        const whereSql = ' order by tmp.create_time desc';
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=order_list_for_page&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'order_type=2&jumpPage='+jumpPage+'&p_app_id='+p_app_id+'&whereSql='+whereSql
            });
            let responseJSON = await response.json();
            let {STATUS, maxPage, row: preTimeData} = responseJSON;
            if (STATUS === 1) {
                //如果maxPage=0，说明没有数据，即默认不显示尾部组件
                //如果maxPage=1，说明只有一页数据，则正常显示即可
                //有多页数据
                if(maxPage > 1){
                    //还没到最后一页
                    if(jumpPage < maxPage){
                        this.setState({
                            footText: '正在加载更多数据...',
                            endReachedThreshold: '0.05'
                        });
                    }
                    //已经到最后一页
                    else if(jumpPage === maxPage){
                        this.setState({
                            footText: '---已经到底了---',
                            endReachedThreshold: '-1000'
                        });
                    }
                }

                let {reportData} = this.state;
                preTimeData.map((elt) => {
                    reportData.push(elt);
                });

                this.setState({
                    isLoading: false,
                    reportData
                });
            }
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    endReached() {
        this.timer = setTimeout(() => {
            this.setState({
                jumpPage: this.state.jumpPage + 1
            });
            // console.log(this.state.jumpPage);
            this.getReportRecordData();
        }, 1000);
    }

    footerComponent() {
        let {footText} = this.state;
        return (
            <View style={Style.footViewStyle}>
                {/* <ActivityIndicator 
                    animating={true}
                    size='small' 
                    color='#FF4500' 
                    style={Style.footLoading}
                /> */}
                <Text>{footText}</Text>
            </View>
        )
    }

    render() {
        let {keyExtractor, endReached, footerComponent} = this;
        let {reportData, isLoading, endReachedThreshold} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {
                    isLoading ? <Loading/> : (
                        reportData.length == 0 ? (
                            <View style={S.noDataStyle}>
                                <Text style={S.noDataTextStyle}>{`没有上报记录`}</Text>
                            </View>
                        ) : (
                            <FlatList
                                ItemSeparatorComponent={() => (<View style={{height: 1,}}/>)}
                                ListFooterComponent={footerComponent}
                                // getItemLayout={(data, index) => ({
                                //     length: 100,
                                //     offset: (100 + 1) * index,
                                //     index
                                // })}
                                initialNumToRender={6}
                                data={reportData}
                                keyExtractor={keyExtractor}
                                renderItem={({item}) => (
                                    <TouchableNativeFeedback onPress={() => 
                                        ToastAndroid.show(item.B_CLASS_NAME, ToastAndroid.SHORT)
                                    }>
                                        <View style={S.itemStyle}>
                                            <Text style={S.firstTextStyle}>{Common.replaceNull(item.B_CLASS_NAME)}</Text>
                                            <Text style={S.otherTextStyle}>{`上报人：${Common.replaceNull(item.T_NAME_1)}`}</Text>
                                            <Text style={S.otherTextStyle}>{`上报时间：${Common.replaceNull(item.CREATE_TIME_1)}`}</Text>
                                            <Text style={S.otherTextStyle}>{`所属任务：${Common.replaceNull(item.TASK_NAME)}`}</Text>
                                            {/* <Text style={S.otherTextStyle}>{`上报情况：`}</Text> */}
                                        </View>
                                    </TouchableNativeFeedback>
                                )}
                                onEndReachedThreshold={endReachedThreshold}
                                onEndReached={endReached}
                            />
                        )
                    )
                }
            </View>
        );
    }
}

const S = StyleSheet.create({
    noDataStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    noDataTextStyle: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center'
    },
});