import React, {Component} from 'react';
import {StyleSheet, View, Alert, TextInput, Text, TouchableOpacity, 
    FlatList, Image, TouchableNativeFeedback, ScrollView} from 'react-native';

import Style from '../style/Style';
import Loading from '../loading/Loading';
import cfg from '../../common/config.json';

export default class ChangeCorp extends Component {
    constructor(props){
        super(props);

        let syscorp_id = props.navigation.state.params.syscorp_id;
        this.state = {
            isLoading: true,
            corpData: [],
            filterData: [],
            selected_id: syscorp_id
        };
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '修改所属单位',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.state.params.navigatePress()}>
                    <View style={S.toolbarStyle}>
                        <Image style={S.iconStyle} source={{uri: 'submit_icon'}}/>
                    </View>
                </TouchableOpacity>
            )
        }
    };

    componentDidMount() {
        //获得corp数据
        this.getCorpData();

        //组件挂载完成之后设置方法
        this.props.navigation.setParams({
            navigatePress: () => this.onSubmit()
        });
    }

    async getCorpData() {
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
            let {STATUS, corps: corpData} = responseJSON;
            if (STATUS === 1) {
                let syscorp_id = this.props.navigation.state.params.syscorp_id;
                corpData.map((elt) => {
                    //先添加unselected属性
                    if(elt.syscorp_id == syscorp_id){
                        elt.radioStatus = 'radio_selected';
                    }else {
                        elt.radioStatus = 'radio_unselected';
                    }
                });
                this.setState({
                    isLoading: false,
                    corpData,
                    filterData: corpData

                });
            }
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    //点击每一条
    itemOnClick(item) {
        let {filterData} = this.state;
        filterData.map((elt) => {
            if(elt.syscorp_id == item.syscorp_id){
                elt.radioStatus = 'radio_selected';
            }else {
                elt.radioStatus = 'radio_unselected';
            }
        });
        this.setState({filterData, selected_id: item.syscorp_id});
    }
    
    async onSubmit(id) {
        let {userInfo: {t_user_id, p_app_id}} = this.props.screenProps;
        let {syscorp_id, reloadUserInfo} = this.props.navigation.state.params;
        let {selected_id} = this.state;
        if(syscorp_id == selected_id) {
            this.props.navigation.goBack();
        }else {
            try {
                let response = await fetch(cfg.url+'servlets/UserJsonSvlt?tag=user_update&f=f', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 't_user_id='+t_user_id+'&syscorp_id='+selected_id+'&p_app_id='+p_app_id
                });
                let responseJSON = await response.json();
                let {STATUS} = responseJSON;
                if (STATUS === 1) {
                    reloadUserInfo();
                    this.props.navigation.goBack();
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    changeSJSubmit(){
        Alert.alert('123');
        this.props.navigation.state.params.title = "123";
    }

    searchCorp(event){
        let text = event.nativeEvent.text;
        // Alert.alert(text);
        let {corpData, filterData} = this.state;
        let filter = [];
        corpData.map((elt) => {
            if(elt.syscorp_name.indexOf(text) >= 0){
                filter.push(elt);
            }
        })
        this.setState({filterData: filter});
    }

    render() {
        let {isLoading, filterData} = this.state;
        let items = [];
        filterData === [] ? (
            items.push(
                <View style={S.noDataStyle}>
                    <Text style={S.noDataTextStyle}>{`没有单位`}</Text>
                </View>
            )
        ) : (
            filterData.map((item) => {
                items.push(
                    <TouchableNativeFeedback key={item.SYSCORP_ID} onPress={() => this.itemOnClick(item)}>
                        <View style={S.itemViewStyle}>
                            <Image style={Style.checkBoxStyle} source={{uri: item.radioStatus}}/>
                            <Text style={S.textStyle}>{item.syscorp_name}</Text>
                        </View>
                    </TouchableNativeFeedback>
                );
            })
        )
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {
                    isLoading ? <Loading/> : (
                        <View style={{flex: 1}}>
                            <View style={{height: 50}}>
                                <View style={S.searchBox}>
                                    <Image source={{uri: 'search_icon'}} style={S.searchIcon}/>
                                    <TextInput 
                                        style={S.inputText}
                                        keyboardType='web-search'
                                        underlineColorAndroid='transparent'
                                        placeholder='搜索'
                                        onChange={(event) => this.searchCorp(event)}
                                    />
                                </View>
                            </View>
                            <ScrollView>
                                <View style={{flex: 1}}>
                                    {items}
                                </View>
                            </ScrollView>
                        </View>
                    )
                }
            </View>
        );
    }
}

const S = StyleSheet.create({
    toolbarStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 56
    },
    iconStyle: {
        width: 24,
        height: 24
    },
    searchBox:{
        height: 30,
        flexDirection: 'row',
        flex: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        margin: 5,
    },  
    searchIcon: { 
        height: 18,
        width: 18,
        marginLeft: 10,
        marginRight: 5,
        resizeMode: 'stretch'
    },   
    inputText: {
        flex: 1,
        backgroundColor: 'transparent',        
        fontSize: 15,
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
    itemViewStyle: {
        backgroundColor: '#FFFFFF',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 1
    },
    textStyle: {
        fontSize: 16,
        color: 'black',
    }
});