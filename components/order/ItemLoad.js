import React, {Component} from 'react';
import {StyleSheet, View, Alert, Text, TouchableNativeFeedback, Image, TextInput, 
    Button} from 'react-native';

import Style from '../style/Style';
import EveryItem from './EveryItem';

export default class ItemLoad extends Component{
    render(){
        let {data, itemOnClick, index, rs, qtnr, qtnrChange, rsChange, 
            aboveItemOnClick, belowItemOnClick} = this.props;
        let itemView = [];

        if(index == 41 || index == 44){
            itemView.push(
                <View key={1} style={S.preGroupViewStyle}>
                {
                    data.map((elt, i) => {
                        return <EveryItem key={i} {...{data: elt, onClick: itemOnClick}}/>
                    })
                }
                </View>
            )
        }
        else if(index == 42 || index == 43){
            itemView.push(
                <View key={1} style={S.preGroupViewStyle}>
                    <TouchableNativeFeedback onPress={() => itemOnClick(data[0])}>
                        <View style={S.itemViewStyle}>
                            <Image style={Style.checkBoxStyle} source={{uri: data[0].radioStatus}}/>
                            <Text style={S.textStyle}>
                                {`${data[0].b_class_name}，人数`}
                            </Text>
                            <TextInput
                                style={S.rsStyle}
                                placeholder='0'
                                keyboardType='numeric'
                                value={rs}
                                onChangeText={(text) => rsChange(text)}
                            />
                            <Text style={S.textStyle}>{`人`}</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <EveryItem {...{data: data[1], onClick: itemOnClick}}/>
                </View>
            );
        }
        else if(index == 45){
            for(let i = 0; i < data.length - 1; i = i + 2){
                itemView.push(
                    <View key={i} style={S.preGroupViewStyle}>
                        <EveryItem {...{data: data[i], onClick: aboveItemOnClick}}/>
                        <EveryItem {...{data: data[i+1], onClick: belowItemOnClick}}/>
                    </View>
                );
            }
            itemView.push(
                <View key={5} style={S.preGroupViewStyle}>
                    <EveryItem {...{data: data[8], onClick: itemOnClick}}/>
                </View>
            );
        }
        else if(index == 46){
            for(let i = 0; i < data.length - 1; i = i + 2){
                itemView.push(
                    <View key={i} style={S.preGroupViewStyle}>
                        <EveryItem {...{data: data[i], onClick: aboveItemOnClick}}/>
                        <EveryItem {...{data: data[i+1], onClick: belowItemOnClick}}/>
                    </View>
                );
            }
        }
        else if(index == 47){
            itemView = (
                <View style={S.qtnrStyle}>
                    <TextInput 
                        style={S.inputStyle}
                        autoCapitalize='none'
                        placeholder='请简要说明，100字以内...'
                        maxLength={100}
                        autoFocus={true}
                        multiline={true}
                        underlineColorAndroid='transparent'
                        value={qtnr}
                        onChangeText={(text) => qtnrChange(text)}
                    />
                </View>
            );
        }
        
        return (
            <View>
                {itemView}
            </View>
        );
    }
}

const S = StyleSheet.create({
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
    },
    qtnrStyle: {
        backgroundColor: '#FFFFFF',
        height: 160,
        flexDirection: 'row',
        marginTop: 5,
    },
    inputStyle: {
        flex: 1,
        alignItems: 'flex-start',
        height: 160,
        marginRight: 5,
        marginLeft: 5
    },
    rsStyle: {
        fontSize: 17,
        color: 'red',
        width: 50,
        textAlign: 'center'
    },
    preGroupViewStyle: {
        marginTop: 5
    }
});