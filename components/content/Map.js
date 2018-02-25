import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Alert, Button, StatusBar, AsyncStorage, 
    TouchableOpacity, BackHandler, ToastAndroid, WebView} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {MapView, Marker, Polyline} from 'react-native-amap3d';
import Storage from 'react-native-storage';

import cfg from '../../common/config.json';

let storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
});

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: null,
            x: '',
            y: '',
            t_map_level: 11,
            markData: [],
            selectedMark: null,
            t_task_id: '',
            YLPLAN_ID: '',
        };
        this.getClassId = this.getClassId.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        let pms = navigation.state.params;
        return {
            headerTitle: '地图',
            headerTitleStyle: {alignSelf: 'center'},
            headerLeft: (
                <TouchableOpacity onPress={() => {
                        ToastAndroid.show('刷新', ToastAndroid.SHORT);
                    }
                }>
                    <View style={S.toolbarStyle}>
                        <Image style={S.iconStyle} source={{uri: 'refresh_icon'}}/>
                        {/* <Text style={S.textStyle}>{`刷新`}</Text> */}
                    </View>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity onPress={() => pms.navigatePress()}>
                    <View style={S.toolbarStyle}>
                        <Image style={S.iconStyle} source={{uri: 'search_icon'}}/>
                        {/* <Text style={S.textStyle}>{`搜索`}</Text> */}
                    </View>
                </TouchableOpacity>
            )
        }
    };

    openSearch() {
        let {getClassId} = this;
        let {selectedMark} = this.state;
        let {navigate} = this.props.navigation;
        navigate('MapSearch', {getClassId, selectedMark});
    }

    componentWillMount() {
        //加载当前任务信息
        this.loadCurrentTask();
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            //组件挂载完成之后，读取存储中的t_task_id
            storage.getBatchData([
                {key: 'tTaskId'},
                {key: 'ylplanId'}
            ]).then((ret) => {
                // 如果找到数据，则在then方法中返回
                this.setState({
                    t_task_id: ret[0],
                    YLPLAN_ID: ret[1]
                });
            }).catch(() => {
                // 如果没有找到数据且没有sync方法，或者有其他异常，则在catch中返回
                this.setState({isLoading: false});
            });
        }, 1000);

        //组件挂载完成之后设置方法
        this.props.navigation.setParams({
            navigatePress: () => this.openSearch()
        });
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    onBackAndroid = () => {
        if(this.lastBackPressed && this.lastBackPressed+1000 >= Date.now()){
            //最近1秒内按下返回键，退出程序
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
    };

    async loadCurrentTask() {
        let {userInfo: {p_app_id}} = this.props.screenProps;
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=task_list_for_isCurrentLoadsTask&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, task} = responseJSON;
            if (STATUS === 1) {
                if(task.x == '' || task.x == null) {
                    // 加载地图设置表的中心，级别
                    this.loadMapSettingInfo();
                }else {
                    this.setState({task, x: task.x, y: task.y});
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    async loadMapSettingInfo() {
        let {userInfo: {p_app_id}} = this.props.screenProps;
        try {
            let response = await fetch(cfg.url+'servlets/MapSettingJsonSvlt?tag=t_map_setting_info&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, map_setting_info} = responseJSON;
            if (STATUS === 1) {
                this.setState({
                    x: map_setting_info.t_map_x, 
                    y: map_setting_info.t_map_y,
                    t_map_level: map_setting_info.t_map_level
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    getClassId(data) {
        console.log(data);
        // this.setState({markData: data});
        let selectedMark = [];
        data.map((elt) => {
            selectedMark.push(elt.b_class_id);
            this.getMarkerData(elt.b_class_id);
        })
        this.setState({selectedMark});
    }

    async getMarkerData(class_id) {
        let {userInfo: {p_app_id}} = this.props.screenProps;
        let {t_task_id, YLPLAN_ID} = this.state;
        console.log(p_app_id+' '+class_id+' '+t_task_id+' '+YLPLAN_ID);
        try {
            let response = await fetch(cfg.url+'servlets/DataJsonSvlt?tag=data_list_by_id&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'p_app_id='+p_app_id+'&b_class_id='+class_id+'&t_task_id='+t_task_id+'&YLPLAN_ID='+YLPLAN_ID
            });
            let responseJSON = await response.json();
            let {STATUS, data_list} = responseJSON;
            console.log(responseJSON);
            if (STATUS === 1) {
                console.log(data_list);
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        let {x, y, t_map_level, markData, selectedMark} = this.state;
        let markPoints = null;
        markPoints = markData == [] ? null : (
            markData.map((elt) => {
                return (
                    <Marker
                        key={elt.b_class_id}
                        draggable
                        title={elt.b_class_name}
                        description={elt.b_class_name}
                        onDragEnd={({nativeEvent}) =>
                            console.log(`${elt.lat}, ${elt.lon}`)
                        }
                        coordinate={{
                            latitude: elt.lat,
                            longitude: elt.lon,
                        }}
                    />
                )
            })
        )
        
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {/* <StatusBar
                    backgroundColor='white'
                    // translucent={true}
                    // hidden={true}
                    barStyle='dark-content'
                /> */}
                <MapView 
                    style={StyleSheet.absoluteFill}
                    zoomLevel={Number(t_map_level)}
                    coordinate={{latitude: Number(y), longitude: Number(x)}}
                    showsCompass //是否显示指南针
                    showsScale //是否显示比例尺
                    // showsLocationButton //是否显示定位按钮
                    locationEnabled //是否启用定位
                    onLocation={({nativeEvent}) => {
                        // console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`);
                        // console.log(nativeEvent);
                    }}
                >
                    {markPoints}
                </MapView>
            </View>
        )
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
        width: 17,
        height: 17
    },
    textStyle: {
        fontSize: 18,
        color: '#1296db',
    }
});