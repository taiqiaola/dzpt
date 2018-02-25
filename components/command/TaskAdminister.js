import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, Alert, Image, TouchableOpacity, 
    ToastAndroid, AsyncStorage, TouchableNativeFeedback} from 'react-native';
import {ActionSheet} from 'antd-mobile';
import Storage from 'react-native-storage';

import Loading from '../loading/Loading';
import Common from '../../common/Common';
import cfg from '../../common/config.json';

let storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
});

let taskData = [
    {TASK_NAME: '123', NAME: '123', CREATE_TIME_1: '123', T_IS_CURRENT_LOAD_TASK: '2'},
    {TASK_NAME: '456', NAME: '456', CREATE_TIME_1: '456', T_IS_CURRENT_LOAD_TASK: '1'}
];

export default class TaskAdminister extends Component{
    constructor(props){
        super(props);
        this.state = {
            jumpPage: 1,
            taskData: [],
            isLoading: true,
            footText: '---没有更多数据了---',
            endReachedThreshold: '-1000'
        };
        this.keyExtractor = this.keyExtractor.bind(this);
        this.addData = this.addData.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '任务管理',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.state.params.navigatePress()}>
                    <View style={S.toolbarStyle}>
                        <Image style={S.iconStyle} source={{uri: 'add_icon'}}/>
                        {/* <Text style={S.textStyle}>{`添加`}</Text> */}
                    </View>
                </TouchableOpacity>
            )
        }
    };

    showActionSheet(isLoadTask, t_task_id, task_name, task_ms) {
        let {navigate} = this.props.navigation;
        let {updateData} = this;
        let BUTTONS = [];
        isLoadTask === '1' ? (
            BUTTONS = ['查看', '修改', '载入', '删除', '取消']
        ) : (
            BUTTONS = ['查看', '修改', '取消']
        )
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            maskClosable: true,
        },
        (index) => {
            switch(BUTTONS[index]) {
                case '查看':
                    navigate('TaskInfo', {
                        task_name, task_ms
                    });
                    break;
                case '修改':
                    navigate('UpdateTaskInfo', {
                        t_task_id, task_name, task_ms, updateData
                    });
                    break;
                case '载入':
                    //先移除存储，再重新存储
                    storage.remove({key: 'tTaskId'});
                    storage.save({key: 'tTaskId', data: t_task_id});
                    ToastAndroid.show('载入', ToastAndroid.SHORT);
                    this.props.navigation.goBack();
                    break;
                case '删除':
                    Alert.alert(
                        '删除任务', 
                        '您确定要删除'+task_name+'吗？', 
                        [
                            {text: '取消'},
                            {text: '确定', onPress: () => this.taskDelete(t_task_id), style: 'cancel'}
                        ], 
                        {cancelable: false}
                    );
                    break;
            }
        });
    }

    keyExtractor = (item) => item.T_TASK_ID;

    componentDidMount() {
        let {navigate} = this.props.navigation;
        let {addData} = this;

        //加载信息
        this.getTaskData();

        //组件挂载完成之后设置方法
        this.props.navigation.setParams({
            navigatePress: () => {
                navigate('AddTask', {addData});
            }
        });
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }
    
    async getTaskData(){
        let {userInfo: {p_app_id}} = this.props.screenProps;
        let {jumpPage} = this.state;
        // console.log(jumpPage);
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=task_list_for_page&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'jumpPage='+jumpPage+'&p_app_id='+p_app_id
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

                let {taskData} = this.state;
                preTimeData.map((elt) => {
                    taskData.push(elt);
                });

                this.setState({
                    taskData,
                    isLoading: false,
                });
            }
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    endReached(){
        this.timer = setTimeout(() => {
            this.setState({
                jumpPage: this.state.jumpPage + 1
            });
            // console.log(this.state.jumpPage);
            this.getTaskData();
        }, 1000);
    }

    footerComponent(){
        let {footText} = this.state;
        return (
            <View style={S.footStyle}>
                <Text>{footText}</Text>
            </View>
        )
    }

    async taskDelete(t_task_id){
        try {
            let response = await fetch(cfg.url+'servlets/TaskJsonSvlt?tag=task_del&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 't_task_id='+t_task_id
            });
            let responseJSON = await response.json();
            let {STATUS} = responseJSON;
            if (STATUS === 1) {
                ToastAndroid.show('删除成功', ToastAndroid.SHORT);
                //删除任务后的处理逻辑
                let {taskData} = this.state;
                for(let i = 0; i < taskData.length; i++) {
                    if(taskData[i].T_TASK_ID == t_task_id) {
                        taskData.splice(i, 1);
                        break;
                    }
                }
                this.setState({taskData});
            }
        } catch (error) {
            console.error(error);
        }
    }

    //添加任务的回调函数
    addData() {
        this.setState({
            jumpPage: 1,
            taskData: [],
            isLoading: true,
            footText: '---没有更多数据了---',
            endReachedThreshold: '-1000'
        });
        this.getTaskData();
    }

    //修改任务信息的回调函数
    updateData(id, name, ms) {
        let {taskData} = this.state;
        taskData.map((elt) => {
            if(elt.T_TASK_ID == id){
                elt.task_name = name;
                elt.TASK_NAME = name;
                elt.task_ms = ms;
                elt.TASK_MS = ms;
            }
        });
        this.setState({taskData});
    }

    render(){
        let {keyExtractor} = this;
        let {taskData, isLoading, endReachedThreshold} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {
                    isLoading ? <Loading/> : (
                        taskData.length == 0 ? (
                            <View style={S.noDataStyle}>
                                <Text style={S.noDataTextStyle}>{`没有任务记录`}</Text>
                            </View>
                        ) : (
                            <FlatList
                                ItemSeparatorComponent={() => (<View style={{height: 1,}}/>)}
                                ListFooterComponent={() => this.footerComponent()}
                                initialNumToRender={6}
                                data={taskData}
                                keyExtractor={keyExtractor}
                                renderItem={({item}) => (
                                    <TouchableNativeFeedback onPress={() => {
                                        let isLoadTask = item.T_IS_CURRENT_LOAD_TASK;
                                        let t_task_id = item.T_TASK_ID;
                                        let task_name = item.TASK_NAME;
                                        let task_ms = item.TASK_MS;
                                        this.showActionSheet(isLoadTask, t_task_id, task_name, task_ms);
                                    }}>
                                        <View style={S.itemStyle}>
                                            <Text style={S.firstTextStyle} numberOfLines={1}>{Common.replaceNull(item.TASK_NAME)}</Text>
                                            <Text style={S.otherTextStyle}>{`创建人：${Common.replaceNull(item.NAME)}`}</Text>
                                            <Text style={S.otherTextStyle}>{`创建时间：${Common.replaceNull(item.CREATE_TIME_1)}`}</Text>
                                            <View style={{flexDirection: 'row',}}>
                                                <Text style={S.otherTextStyle}>{`是否为当前任务：`}</Text>
                                                {
                                                    item.T_IS_CURRENT_LOAD_TASK === '1' ?  (
                                                        <Text style={[S.otherTextStyle, {color: 'green'}]}>{`否`}</Text>
                                                    ) : (
                                                        <Text style={[S.otherTextStyle, {color: 'red'}]}>{`是`}</Text>
                                                    )
                                                }
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                )}
                                onEndReachedThreshold={endReachedThreshold}
                                onEndReached={() => this.endReached()}
                            />
                        )
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
        width: 17,
        height: 17
    },
    textStyle: {
        fontSize: 18,
        color: '#1296db',
    },
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
    footStyle: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    }
});