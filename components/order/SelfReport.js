import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, Text, TouchableOpacity, 
    Alert, TouchableNativeFeedback} from 'react-native';

let allData = [
    {name: '震感情况', iconName: 'zhenganqingkuang'},
    {name: '人员死亡情况', iconName: 'renyuansiwangqingkuang'},
    {name: '人员受伤情况', iconName: 'renyuanshoushangqingkuang'},
    {name: '房屋损坏情况', iconName: 'fangwusunhuaiqingkuang'},
    {name: '次生灾害', iconName: 'cishengzaihai'},
    {name: '基础设施情况', iconName: 'jichusheshiqingkuang'},
    {name: '其他', iconName: 'qita'},
]

export default class SelfReport extends Component{
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '自主上报',
            headerRight: (
                <TouchableOpacity onPress={() => {
                        navigation.navigate('MyReportRecord');
                    }
                }>
                    <View style={S.rightViewStyle}>
                        <Image style={S.iconStyle} source={{uri: 'zizhushangbaojilu'}}/>
                        {/* <Text style={S.rightTextStyle}>{`上报记录`}</Text> */}
                    </View>
                </TouchableOpacity>
            )
        }
    };

    render(){
        let {navigate} = this.props.navigation;
        let data = null;
        let preRow = [];
        data = allData.map((elt, i) => {
            return (
                <View key={i} style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                    <TouchableNativeFeedback onPress={
                        () => {
                            navigate('SelfReportDetail', {
                                topText: elt.name,
                                index: i + 41
                            });
                        }
                    }>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                            <Image style={S.imageStyle} source={{uri: elt.iconName}}/>
                            <Text style={S.textStyle}>{elt.name}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            )
        });
        
        for(let i = 0; i < data.length-1; i+=3){
            preRow.push(
                <View key={i} style={{flex: 1, flexDirection: 'row',}}>
                    {data[i]}
                    {data[i+1]}
                    {data[i+2]}
                </View>
            );
        }

        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {preRow}
                <View style={{flex: 1, flexDirection: 'row',}}>
                    {data[6]}
                    <View style={{flex: 1,}}></View>
                    <View style={{flex: 1,}}></View>
                </View>
                <View style={{flex: 1, flexDirection: 'row',}}></View>
            </View>
        );
    }
}

const S = StyleSheet.create({
    rightViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 18
    },
    iconStyle: {
        width: 20,
        height: 20
    },
    rightTextStyle: {
        fontSize: 18,
        color: '#1296db',
    },
    imageStyle: {
        width: 70,
        height: 70,
    },
    textStyle: {
        fontSize: 15,
        color: 'black',
        marginTop: 10,
        marginBottom: 0,
    },
});