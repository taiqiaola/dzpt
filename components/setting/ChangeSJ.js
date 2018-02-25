import React, {Component} from 'react';
import {StyleSheet, View, Alert, TextInput, Text, Button, BackHandler} from 'react-native';

import Style from '../style/Style';
import Loading from '../loading/Loading';
import cfg from '../../common/config.json';

export default class ChangeSJ extends Component{
    constructor(props){
        super(props);
        
        let sj = props.navigation.state.params.sj;
        this.state = {
            sj: sj,
            isLoading: true
        };
        this.changeSJSubmit = this.changeSJSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: false})
    }
    
    async changeSJSubmit(){
        let {t_user_id, p_app_id, reloadUserInfo} = this.props.navigation.state.params;
        let {sj} = this.state;
        try {
            let response = await fetch(cfg.url+'servlets/UserJsonSvlt?tag=user_update&f=f', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 't_user_id='+t_user_id+'&sj='+sj+'&p_app_id='+p_app_id+''
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

    render(){
        let {changeSJSubmit} = this;
        let {sj, isLoading} = this.state;
        
        return (
            <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                {
                    isLoading ? (
                        <Loading/>
                    ) : null
                }
                <View style={S.viewStyle}>
                    <View style={S.inputStyle}>
                        <Text style={{width: 60, fontSize: 17, color: 'black'}}>{`新手机`}</Text>
                        <TextInput 
                            style={{flex: 1,}}
                            autoCapitalize='none'
                            placeholder='请重新输入手机'
                            maxLength={11}
                            autoFocus={true}
                            selectTextOnFocus={true}
                            keyboardType='numeric'
                            value={sj}
                            onChangeText={(text) => this.setState({sj: text})}
                        />
                    </View>
                    <View style={Style.buttonStyle}>
                        <Button
                            onPress={changeSJSubmit}
                            title="保存"
                            accessibilityLabel="Learn more about this blue button"
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const S = StyleSheet.create({
    viewStyle: {
        flex: 1
    },
    inputStyle: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginRight: 10,
        marginLeft: 10
    }
});