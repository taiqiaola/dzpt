import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView, Text} from 'react-native';

export default class About extends Component{
    render(){
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                <ScrollView contentContainerStyle={{flex: 1,}}>
                    <View style={S.logoViewStyle}>
                        <Image style={S.imageStyle} source={{uri: 'logo'}}/>
                        <Text style={S.textStyle}>{`南京地震应急决策指挥平台`}</Text>
                        <Text style={S.versionStyle}>{`v8.8.4`}</Text>
                    </View>
                </ScrollView>
                <View style={{height: 30, justifyContent: 'center', alignItems: 'center',}}>
                    <Text style={{color: '#c6c6c6', fontSize: 11,}}>
                        {`Powered By 南京协同软件有限责任公司`}
                    </Text>
                </View>
            </View>
        );
    }
}

const S = StyleSheet.create({
    logoViewStyle: {
        alignItems: 'center'
    },
    imageStyle: {
        marginTop: 30,
        width: 60,
        height: 60,
    },
    textStyle: {
        fontSize: 20,
        color: 'black',
        marginTop: 12
    },
    versionStyle: {
        fontSize: 13,
        color: 'gray',
        marginTop: 5
    }
});