import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, AsyncStorage, Text, Dimensions} from 'react-native';
import Storage from 'react-native-storage';

import Loading from '../loading/Loading';
import cfg from '../../common/config.json';

let storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
});

export default class MyPlanRemind extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            t_task_id: '',
            xydj: '',
            XYDJ: [],
            zuItems: [],
            corpItems: []
        };
    }

    componentDidMount() {
        //组件挂载完成之后，读取存储中的信息
        storage.load({
            key: 'tTaskId'
        }).then((ret) => {
            // 如果找到数据，则在then方法中返回
            let t_task_id = ret;
            this.setState({t_task_id});
            //得到响应等级
            this.getXYDJ();
        }).catch(() => {
            // 如果没有找到数据且没有sync方法，或者有其他异常，则在catch中返回
            this.setState({isLoading: false});
        });
    }

    async getXYDJ(){
        let {t_task_id} = this.state;
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=query_xydj&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 't_task_id='+t_task_id
            });
            let responseJSON = await response.json();
            let {STATUS, XYDJ} = responseJSON;
            if (STATUS === 1) {
                this.setState({xydj: XYDJ});
            }
            this.myPlanRemind();
        } catch (error) {
            console.error(error);
        }
    }

    async myPlanRemind(){
        let {xydj} = this.state;
        let {userInfo: {t_user_id}} = this.props.screenProps;
        let YLPLAN_ID = 206;
        try {
            let response = await fetch(cfg.url+'servlets/UserJsonSvlt?tag=getPlanRemind&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 't_user_id='+t_user_id+'&jhid='+YLPLAN_ID+'&xydj='+xydj
            });
            let responseJSON = await response.json();
            let {STATUS, XYDJ, zuItems, corpItems} = responseJSON;
            if (STATUS === 1) {
                this.setState({
                    XYDJ, zuItems, corpItems,
                    isLoading: false
                });
            }
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    render(){
        let {isLoading, XYDJ, zuItems, corpItems} = this.state;
        //获取高度，状态栏24，标题栏56
        let viewHeight = Dimensions.get('window').height;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {
                    isLoading ? <Loading/> : (
                        <ScrollView>
                            <View style={S.viewStyle}>
                                <Text style={S.infoStyle}>{`响应级别：`}</Text>
                                {
                                    XYDJ.length === 0 ? (
                                        <Text style={S.textStyle}>{`无`}</Text>
                                    ) : (
                                        <Text style={[S.textStyle, {color: 'red'}]}>{XYDJ[0].XYDJNAME}</Text>
                                    )
                                }
                                
                            </View>
                            <View style={S.viewStyle}>
                                <Text style={S.infoStyle}>{`你所在组职责与预案：`}</Text>
                                {
                                    zuItems.length === 0 ? (
                                        <Text style={S.textStyle}>{`无`}</Text>
                                    ) : (
                                        zuItems.map((elt, i) => {
                                            return (
                                                <View key={i}>
                                                    <Text style={S.textStyle}>{`${elt.YLROLE_NAME}：`}</Text>
                                                    <Text style={S.contentStyle}>{elt.YATX_NR_TONGYONG}</Text>
                                                    <Text style={S.contentStyle}>{elt.YATX_NR}</Text>
                                                </View>
                                            )
                                        })
                                    )
                                }
                            </View>
                            <View style={S.viewStyle}>
                                <Text style={S.infoStyle}>{`你所在单位职责与预案：`}</Text>
                                {
                                    corpItems.length === 0 ? (
                                        <Text style={S.textStyle}>{`无`}</Text>
                                    ) : (
                                        corpItems.map((elt, i) => {
                                            return (
                                                <View key={i}>
                                                    <Text style={S.textStyle}>{`${elt.SYSCORP_NAME}：`}</Text>
                                                    <Text style={S.contentStyle}>{elt.YATX_NR_TONGYONG}</Text>
                                                    <Text style={S.contentStyle}>{elt.YATX_NR}</Text>
                                                </View>
                                            )
                                        })
                                    )
                                }
                            </View>
                        </ScrollView>
                    )
                }
            </View>
        );
    }
}

const S = StyleSheet.create({
    viewStyle: {
        marginTop: 10
    },
    infoStyle: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
        marginRight: 5,
        marginBottom: 5,
        marginLeft: 5
    },
    textStyle: {
        fontSize: 15,
        color: 'black',
        marginRight: 15,
        marginLeft: 15
    },
    contentStyle: {
        fontSize: 15,
        color: 'black',
        marginRight: 25,
        marginLeft: 25
    }
});