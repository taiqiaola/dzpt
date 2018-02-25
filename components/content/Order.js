import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, TouchableOpacity, ToolbarAndroid} from 'react-native';

import OrderTabs from '../order/OrderTabs';

let toolbarActions = [
    {title: '立即上报'},
    {title: '上报记录'},
];

export default class Order extends Component{
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '指令与消息',
            headerTitleStyle: {alignSelf: 'center'},
            headerStyle: {
                elevation: 0
            },
            headerLeft: (
                <TouchableOpacity onPress={() => {
                        // Alert.alert(`123`);
                }}>
                    <View style={S.toolbarStyle}>
                        <Text style={S.textStyle}>{` `}</Text>
                    </View>
                </TouchableOpacity>
            ),
            headerRight: (
                <View style={S.toolbarStyle}>
                    <ToolbarAndroid
                        contentInsetStart={0}
                        actions={toolbarActions}
                        style={S.toolbar}
                        onActionSelected={(i) => {
                            if(i === 0){
                                navigation.navigate('SelfReport');
                            }else if(i === 1){
                                navigation.navigate('MyReportRecord');
                            }
                        }}
                    />
                </View>
            )
        }
    };

    render(){
        let {navigate} = this.props.navigation;
        let {userInfo: {p_app_id, t_user_id}} = this.props.screenProps;
        return(
            <View style={S.content}>
                <OrderTabs screenProps={{navigate, p_app_id, t_user_id}}/>
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
    textStyle: {
        fontSize: 18,
        color: '#1296db'
    },
    toolbar: {
        width: 15,
        height: 56,
    },
    content: {
        flex: 1, 
        backgroundColor: '#EDEDED'
    }
});