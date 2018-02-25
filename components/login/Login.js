import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, TextInput, Button, 
    ScrollView, ImageBackground, Dimensions} from 'react-native';
import {StackNavigator} from 'react-navigation';

import Validation from '../util/validation';

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            loginname: '',
            password: '',
            loginnameErr: false,
            passwordErr: false
        };

        this.validator = new Validation();

        this.validator.addByValue('loginname', [
            {strategy: 'isEmpty', errorMsg: '账号不能为空'},
            {strategy: 'hasSpace', errorMsg: '账号不能有空格'},
            {strategy: 'minLength:5', errorMsg: '最短为5'},
            {strategy: 'maxLength:12', errorMsg: '最长为12'}
        ]);

        this.validator.addByValue('password', [
            {strategy: 'isEmpty', errorMsg: '密码不能为空'},
            {strategy: 'hasSpace', errorMsg: '密码不能有空格'},
            {strategy: 'minLength:5', errorMsg: '最短为5'},
            {strategy: 'maxLength:12', errorMsg: '最长为12'}

        ]);
    }
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '登录',
            headerTitleStyle: {alignSelf: 'center'}
        }
    };

    render(){
        let {loginname, password, loginnameErr, passwordErr} = this.state;
        let {userLogin, buttonTitle} = this.props.screenProps;
        let {height, width} = Dimensions.get('window');

        let loginnameErrMsg = loginnameErr ? (
            <Text style={{color: 'red',}}>{loginnameErr}</Text>
        ) : null;
        let passwordErrMsg = passwordErr ? (
            <Text style={{color: 'red',}}>{passwordErr}</Text>
        ) : null;

        return (
            <ImageBackground style={{flex: 1, height: height+24, width: width}} source={{uri: 'login_bg'}} opacity={0.3}>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                    <ScrollView>
                        <View style={S.logoViewStyle}>
                            <Image style={S.imageStyle} source={{uri: 'logo'}}/>
                            <Text style={S.textStyle}>{`南京地震应急决策指挥平台`}</Text>
                        </View>
                        <View style={S.inputViewStyle}>
                            <View style={S.inputStyle}>
                                {/* <Text style={{width: 60, fontSize: 17,}}>{`账号`}</Text> */}
                                <TextInput 
                                    style={{width: 300}}
                                    autoCapitalize='none' 
                                    placeholder='请输入账号'
                                    maxLength={12}
                                    value={loginname}
                                    onChangeText={(text) => {
                                        let msg = this.validator.valiOneByValue('loginname', text);
                                        this.setState({loginname: text, loginnameErr: msg});
                                    }}
                                />
                            </View>
                            <View style={{height: 10}}>{loginnameErrMsg}</View>
                            <View style={S.inputStyle}>
                                {/* <Text style={{width: 60, fontSize: 17,}}>{`密码`}</Text> */}
                                <TextInput 
                                    style={{width: 300}}
                                    autoCapitalize='none' 
                                    placeholder='请输入密码'
                                    maxLength={12}
                                    /* secureTextEntry={true} */
                                    value={password}
                                    onChangeText={(text) => {
                                        let msg = this.validator.valiOneByValue('password', text);
                                        this.setState({password: text, passwordErr: msg});
                                    }}
                                />
                            </View>
                            <View style={{height: 10}}>{passwordErrMsg}</View>
                        </View>
                        <View style={S.buttonViewStyle}>
                            <View style={S.buttonStyle}>
                                <Button
                                    // disabled={(loginnameErr||passwordErr)?true:false}
                                    onPress={() => {
                                        this.setState({
                                            loginnameErr: this.validator.valiOneByValue('loginname', loginname),
                                            passwordErr: this.validator.valiOneByValue('password', password)
                                        });
                                        if(!loginnameErr && !passwordErr && loginname != '' && password != ''){
                                            userLogin(loginname, password);
                                        }
                                    }}
                                    title={buttonTitle}
                                    accessibilityLabel="Learn more about this blue button"
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        );
    }
}

const S = StyleSheet.create({
    logoViewStyle: {
        marginTop: 50,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: 100,
        height: 100,
    },
    textStyle: {
        fontSize: 25,
        color: 'black',
        marginTop: 20
    },
    inputViewStyle: {
        alignItems: 'center',
        marginBottom: 20,
    },
    inputStyle: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonViewStyle: {
        alignItems: 'center',
    },
    buttonStyle: {
        marginBottom: 10,
        width: 300
    }
});