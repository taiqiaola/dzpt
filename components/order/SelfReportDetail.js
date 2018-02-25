import React, {Component} from 'react';
import {StyleSheet, View, Alert, Text, TouchableOpacity, Image, 
    Button, AsyncStorage, ToastAndroid} from 'react-native';
import Storage from 'react-native-storage';

import Style from '../style/Style';
import Loading from '../loading/Loading';
import ItemLoad from './ItemLoad';
import cfg from '../../common/config.json';

let storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
});

let itemData = [
    {b_class_id: 411, b_class_name: '大范围火灾', radioStatus: 'radio_unselected'},
    {b_class_id: 412, b_class_name: '小范围火灾', radioStatus: 'radio_unselected'},
    {b_class_id: 413, b_class_name: '大范围停电', radioStatus: 'radio_unselected'},
    {b_class_id: 414, b_class_name: '小范围停电', radioStatus: 'radio_unselected'},
    {b_class_id: 415, b_class_name: '大范围停气', radioStatus: 'radio_unselected'},
    {b_class_id: 416, b_class_name: '小范围停气', radioStatus: 'radio_unselected'},
    {b_class_id: 417, b_class_name: '大范围停水', radioStatus: 'radio_unselected'},
    {b_class_id: 418, b_class_name: '小范围停水', radioStatus: 'radio_unselected'},
    {b_class_id: 419, b_class_name: '没有灾害', radioStatus: 'radio_unselected'}
];

export default class SelfReportDetail extends Component{
    constructor(props){
        super(props);

        let {back_rs} = this.props.navigation.state.params;
        back_rs = back_rs == null ? '' : back_rs,
        // console.log(back_rs);
        this.state = {
            isLoading: true,
            data: [],
            rs: back_rs,
            qtnr: '',
            p_app_id: '',
            t_task_id: ''
        };
        this.selfReportSubmit = this.selfReportSubmit.bind(this);
        this.itemOnClick = this.itemOnClick.bind(this);
        this.aboveItemOnClick = this.aboveItemOnClick.bind(this);
        this.belowItemOnClick = this.belowItemOnClick.bind(this);
        this.qtnrChange = this.qtnrChange.bind(this);
        this.rsChange = this.rsChange.bind(this);
        this.getClassListData = this.getClassListData.bind(this);
    }

    componentDidMount() {
        //组件挂载完成之后，读取存储中的t_user_id
        storage.load({
            key: 'tTaskId'
        }).then((ret) => {
            // 如果找到数据，则在then方法中返回
            let t_task_id = ret;
            this.setState({t_task_id});
            
            this.getClassListData();
        }).catch(() => {
            // 如果没有找到数据且没有sync方法，或者有其他异常，则在catch中返回
            this.setState({isLoading: false});
        });
    }
    
    async getClassListData(){
        let {index, back_class_array} = this.props.navigation.state.params;
        back_class_array = back_class_array == null ? [] : back_class_array;
        let {p_app_id} = this.state;
        try {
            let response = await fetch(cfg.url+'servlets/BaseSvlt?tag=class_list_by_class_pid&f=f', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: '&b_class_pid='+index+'&p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, class_array} = responseJSON;
            if (STATUS === 1) {
                class_array.map((elt) => {
                    //先添加unselected属性
                    elt.radioStatus = 'radio_unselected'
                    //再判断，
                    back_class_array.length > 0 ? (
                        back_class_array.map((id) => {
                            if(elt.b_class_id == id){
                                //id相等，说明已经有上报记录，更改为selected属性
                                elt.radioStatus = 'radio_selected';
                            }
                        })
                    ) : null
                });
                
                this.setState({
                    isLoading: false,
                    data: class_array
                });
            }
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    async selfReportSubmit(){
        let request_url = '', selectedClass = [], check = true;
        let {userInfo: {t_user_id, p_app_id}} = this.props.screenProps;
        let {data, t_task_id, rs, qtnr} = this.state;
        let {index, back_data_array, 
            reloadOrderData} = this.props.navigation.state.params;
        back_data_array = back_data_array == null ? [] : back_data_array;

        if(index === 47){
            selectedClass.push('471');
        }else {
            data.map((elt) => {
                if(elt.radioStatus === 'radio_selected'){
                    selectedClass.push(elt.b_class_id);
                }
            });
        }

        //判断是否选中了灾情情况
        if(selectedClass.length == 0){
            ToastAndroid.show('请先选择需要上报的灾情情况', ToastAndroid.SHORT);
            check = false;
        }else {
            selectedClass.map((elt) => {
                if(elt === '421' || elt === '431'){
                    if(rs === ''){
                        ToastAndroid.show('请输入人数', ToastAndroid.SHORT);
                        check = false;
                    }
                }
                if(elt === '471'){
                    if(qtnr === ''){
                        ToastAndroid.show('请输入内容', ToastAndroid.SHORT);
                        check = false;
                    }
                }
            })
        }

        if(check){
            //数组转为字符串
            let selectedClassString = selectedClass.join();
            let backDataString = back_data_array.join();
            console.log(selectedClassString);
            console.log(backDataString);

            // try {
            //     let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=order_custom_add&f=f', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/x-www-form-urlencoded',
            //         },
            //         body: 'order_type=2&p_app_id='+p_app_id+'&t_task_id='+t_task_id
            //             +'&send_t_user_id='+t_user_id+'&re_t_user_id='+t_user_id
            //             +'&target_b_class_id='+index+'&rs='+rs+'&qtnr='+qtnr
            //             +'&back_b_class_id_list='+selectedClassString
            //             +'&b_data_id_list='+backDataString
            //     });
            //     let responseJSON = await response.json();
            //     let {STATUS} = responseJSON;
            //     if (STATUS === 1) {
            //         reloadOrderData == null ? null : (
            //             reloadOrderData()
            //         )
            //         this.props.navigation.goBack();
            //     }
            // } catch (error) {
            //     console.error(error);
            // }
        }
    }

    //点击每一条
    itemOnClick(item){
        let {data} = this.state;
        data.map((elt) => {
            if(elt.b_class_id === item.b_class_id){
                elt.radioStatus = 'radio_selected';
            }else {
                elt.radioStatus = 'radio_unselected';
            }
        });
        this.setState({data});
    }
    
    //45和46中的多选框，点击上面一个
    aboveItemOnClick(item){
        let {data} = this.state;
        let {index} = this.props.navigation.state.params;
        
        if(index === 45 || index === '45'){
            data[8].radioStatus = 'radio_unselected';
        }

        data.map((elt, i) => {
            if(elt.b_class_id === item.b_class_id){
                elt.radioStatus = 'radio_selected';
                data[i+1].radioStatus = 'radio_unselected';
            }
        });

        this.setState({data});
    }
    
    //45和46中的多选框，点击下面一个
    belowItemOnClick(item){
        let {data} = this.state;
        let {index} = this.props.navigation.state.params;
        
        if(index === 45 || index === '45'){
            data[8].radioStatus = 'radio_unselected';
        }

        data.map((elt, i) => {
            if(elt.b_class_id === item.b_class_id){
                elt.radioStatus = 'radio_selected';
                data[i-1].radioStatus = 'radio_unselected';
            }
        });
        
        this.setState({data});
    }

    qtnrChange(qtnr){
        this.setState({qtnr});
    }

    rsChange(rs){
        this.setState({rs});
    }

    render(){
        let {selfReportSubmit, itemOnClick, qtnrChange, rsChange, 
            aboveItemOnClick, belowItemOnClick} = this;
        let {isLoading, data, rs, qtnr} = this.state;
        let {topText, index, t_order_id, back_class_array, back_data_array} = this.props.navigation.state.params;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {
                    isLoading ? <Loading/> : (
                        <View style={S.allViewStyle}>
                            <View style={S.topStyle}>
                                <Text style={S.topTextStyle}>{topText}</Text>
                            </View>
                            <View style={S.viewStyle}>
                                <ItemLoad {...{
                                    data, itemOnClick, index, rs, qtnr, qtnrChange, 
                                    rsChange, aboveItemOnClick, belowItemOnClick, 
                                    t_order_id, back_class_array, back_data_array
                                }}/>
                            </View>
                            <View style={Style.buttonStyle}>
                                <Button
                                    onPress={selfReportSubmit}
                                    title="提交"
                                />
                            </View>
                        </View>
                    )
                }
            </View>
        );
    }
}

const S = StyleSheet.create({
    allViewStyle: {
        flex: 1,
    },
    topStyle: {
        height: 50,
        paddingTop: 5,
        paddingRight: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        justifyContent: 'center'
    },
    topTextStyle: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    viewStyle: {
        marginRight: 10,
        marginLeft: 10,
        marginTop: -5
    }
});