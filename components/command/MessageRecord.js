import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableNativeFeedback, ActivityIndicator} from 'react-native';

import Style from '../style/Style';
import Loading from '../loading/Loading';
import Common from '../../common/Common';
import cfg from '../../common/config.json';

export default class MessageRecord extends Component{
    constructor(props) {
        super(props);
        this.state = {
            jumpPage: 1,
            messageData: [],
            isLoading: true,
            footText: '---没有更多数据了---',
            endReachedThreshold: '-1000'
        };
        this.getMessageRecordData = this.getMessageRecordData.bind(this);
        this.keyExtractor = this.keyExtractor.bind(this);
        this.footerComponent = this.footerComponent.bind(this);
        this.endReached = this.endReached.bind(this);
    }

    keyExtractor = (item) => item.T_MESSAGE_ID;

    componentDidMount() {
        //加载信息
        this.getMessageRecordData();
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    
    async getMessageRecordData() {
        let {userInfo: {p_app_id}} = this.props.screenProps;
        let {jumpPage} = this.state;
        // console.log(jumpPage);
        const whereSql = ' order by tm.send_time desc';
        try {
            let response = await fetch(cfg.url+'servlets/MessageJsonSvlt?tag=message_list_for_page&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'jumpPage='+jumpPage+'&p_app_id='+p_app_id+'&whereSql='+whereSql
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
                            endReachedThreshold: '-1000',
                        });
                    }
                }

                let {messageData} = this.state;
                preTimeData.map((elt) => {
                    messageData.push(elt);
                });

                this.setState({
                    isLoading: false,
                    messageData
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
            this.getMessageRecordData();
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
        let {navigate} = this.props.navigation;
        let {keyExtractor, endReached, footerComponent} = this;
        let {messageData, isLoading, endReachedThreshold} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {
                    isLoading ? <Loading/> : (
                        messageData.length == 0 ? (
                            <View style={S.noDataStyle}>
                                <Text style={S.noDataTextStyle}>{`没有消息记录`}</Text>
                            </View>
                        ) : (
                            <FlatList
                                ItemSeparatorComponent={() => (<View style={{height: 1,}}/>)}
                                ListFooterComponent={footerComponent}
                                // getItemLayout={(data, index) => ({
                                //     length: 140,
                                //     offset: (140 + 1) * index,
                                //     index
                                // })}
                                initialNumToRender={6}
                                data={messageData}
                                keyExtractor={keyExtractor}
                                renderItem={({item}) => (
                                    <TouchableNativeFeedback onPress={() => 
                                        navigate('CommandMessageDetail', {
                                            send_username: item.T_NAME_1,
                                            receive_username: item.T_NAME_2,
                                            send_time: item.CREATE_TIME_1,
                                            re_phone: item.RE_PHONE,
                                            sms_nr: item.SMS_NR,
                                            sms_zt: item.SMS_ZT
                                        })
                                    }>
                                        <View style={S.itemStyle}>
                                            <Text style={S.firstTextStyle} numberOfLines={1}>{item.SMS_NR}</Text>
                                            <Text style={S.otherTextStyle}>{`发送人：${Common.replaceNull(item.T_NAME_1)}`}</Text>
                                            <Text style={S.otherTextStyle}>{`接收人：${Common.replaceNull(item.T_NAME_2)}`}</Text>
                                            <Text style={S.otherTextStyle}>{`接收号码：${Common.replaceNull(item.RE_PHONE)}`}</Text>
                                            <Text style={S.otherTextStyle}>{`发送时间：${Common.replaceNull(item.CREATE_TIME_1)}`}</Text>
                                            <View style={{flexDirection: 'row',}}>
                                                <Text style={S.otherTextStyle}>{`发送状态：`}</Text>
                                                {
                                                    item.SMS_ZT === '1' ?  (
                                                        <Text style={[S.otherTextStyle, {color: 'green'}]}>{`成功`}</Text>
                                                    ) : (
                                                        <Text style={[S.otherTextStyle, {color: 'red'}]}>{`失败`}</Text>
                                                    )
                                                }
                                            </View>
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
        height: 140,
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