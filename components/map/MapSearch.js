import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert, 
    Image, ToastAndroid, TouchableNativeFeedback, Dimensions} from 'react-native';

import Style from '../style/Style';
import Loading from '../loading/Loading';
import cfg from '../../common/config.json';

export default class MapSearch extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true, //是否显示Loading
            needItems: null
        };
    }

    static navigationOptions = ({navigation}) => {
        let pms = navigation.state.params;
        return {
            headerTitle: '地图搜索',
            headerRight: (
                <TouchableOpacity onPress={() => pms.navigatePress()}>
                    <View style={S.rightViewStyle}>
                        <Image style={S.rightIconStyle} source={{uri: 'submit_icon'}}/>
                        {/* <Text style={S.rightTextStyle}>{`确定`}</Text> */}
                    </View>
                </TouchableOpacity>
            )
        }
    };

    componentDidMount() {
        //加载信息
        this.getClassList();
        
        //组件挂载完成之后设置方法
        this.props.navigation.setParams({
            navigatePress: () => this.onSubmit()
        });
    }

    async getClassList() {
        let {userInfo: {p_app_id}} = this.props.screenProps;
        try {
            let response = await fetch(cfg.url+'servlets/BaseSvlt?tag=class_list&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, class_list} = responseJSON;
            if (STATUS === 1) {
                let listItem = [];
                let {selectedMark} = this.props.navigation.state.params;
                class_list.map((elt) => {
                    //添加unselected属性
                    selectedMark == null ? (elt.radioStatus = 'radio_unselected') : (
                        selectedMark.map((id) => {
                            if(id == elt.b_class_id) {
                                elt.radioStatus = 'radio_selected';
                            }else {
                                elt.radioStatus = 'radio_unselected';
                            }
                        })
                    )
                    
                    if(elt.b_class_pid == 2 || elt.b_class_id == 3 || elt.b_class_pid == 41
                        || elt.b_class_pid == 42 || elt.b_class_pid == 43 || elt.b_class_pid == 44
                        || elt.b_class_pid == 45 || elt.b_class_pid == 46 || elt.b_class_pid == 47) {
                        listItem.push(elt);
                    }
                });
                this.setState({
                    isLoading: false,
                    needItems: listItem
                });
            }
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    onSubmit() {
        let selectedItem = [], check = false;
        let {needItems} = this.state;
        let {getClassId} = this.props.navigation.state.params;

        needItems.map((elt) => {
            if(elt.radioStatus === 'radio_selected'){
                check = true;
                selectedItem.push(elt);
            }
        });
        
        if(!check) {
            ToastAndroid.show('请选择需要查询的类别', ToastAndroid.SHORT);
        }else {
            getClassId(selectedItem);
            this.props.navigation.goBack();
        }
    }

    //点击每一条
    itemOnClick(item) {
        let {needItems} = this.state;
        needItems.map((elt) => {
            if(elt.b_class_id === item.b_class_id){
                elt.radioStatus === 'radio_selected' ? (
                    elt.radioStatus = 'radio_unselected'
                ) : (
                    elt.radioStatus = 'radio_selected'
                )
            }
        });
        this.setState({needItems});
    }

    render() {
        let {needItems} = this.state;
        let item = null;
        item = needItems == null ? null : (
            needItems.map((elt) => {
                return (
                    <TouchableNativeFeedback key={elt.b_class_id} 
                        onPress={() => this.itemOnClick(elt)}
                    >
                        <View style={S.itemStyle}>
                            <Image 
                                style={Style.checkBoxStyle} 
                                source={{uri: elt.radioStatus}}
                            />
                            <Text style={S.tipsTextStyle}>{elt.b_class_name}</Text>
                        </View>
                    </TouchableNativeFeedback>
                )
            })
        )
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {this.state.isLoading ? <Loading/> : (
                    <ScrollView>
                        <View style={{flex: 1}}>
                            {item}
                        </View>
                    </ScrollView>
                )}
            </View>
        );
    }
}

const S = StyleSheet.create({
    rightViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 10
    },
    rightIconStyle: {
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
        // marginRight: 10,
        paddingLeft: 10,
        // justifyContent: 'space-between',
        alignItems: 'center',
    },
    topTextStyle: {
        fontSize: 16,
        color: '#1C86EE'
    },
    itemStyle: {
        flexDirection: 'row',
        height: 50,
        // padding: 5,
        // justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        marginBottom: 1
    },
    tipsTextStyle: {
        fontSize: 16,
        color: 'black',
    }
});