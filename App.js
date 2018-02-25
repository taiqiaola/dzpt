import React, {Component} from 'react';
import {StyleSheet, Alert, AsyncStorage, ToastAndroid} from 'react-native';
import Storage from 'react-native-storage';

import StartPage from './components/startPage/StartPage';
import Login from './components/login/Login';
import Home from './components/home/Home';
import cfg from './common/config.json';

let storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
});

export default class index extends Component {
    constructor() {
        super();
        this.state = {
            userInfo: null,
            isStartPage: true,
            buttonTitle: '登录'
        };
        this.userLogin = this.userLogin.bind(this);
        this.userLogout = this.userLogout.bind(this);
    }

    async userLogin(loginname, password) {
        this.setState({buttonTitle: '登录中...'});
        try {
            let response = await fetch(cfg.url+'servlets/UserJsonSvlt?tag=user_login&f=f', {
                method: 'POST',
                // headers: {
                //   'Accept': 'application/json',
                //   'Content-Type': 'application/json',
                // },
                // body: JSON.stringify({
                //   loginname: loginname,
                //   password: password,
                //   device_type: 1,
                //   p_sys_id: '7'
                // }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'loginname='+loginname+'&password='+password+'&device_type=1&p_sys_id=7'
            });
            let responseJSON = await response.json();
            // console.log(responseJSON);
            let {STATUS, MESSAGE, user: userInfo, task: {t_task_id}} = responseJSON;
            switch (STATUS) {
                case 1:
                    this.setState({
                        userInfo,
                        buttonTitle: '登录'
                    });
                    
                    //存储数据
                    storage.save({key: 'userInfo', data: userInfo});
                    storage.save({key: 'tTaskId', data: t_task_id});

                    this.getYLPLANID(userInfo.P_APP_ID);
                    break;
                case 2:
                    ToastAndroid.show(MESSAGE, ToastAndroid.SHORT);
                    this.setState({
                        buttonTitle: '登录'
                    });
                    break;
            }
        } catch(error) {
            this.setState({
                buttonTitle: '登录'
            });
            console.error(error);
        }
    }

    async getYLPLANID(p_app_id){
        try {
            let response = await fetch(cfg.url+'servlets/PostTFSvlt?tag=getYLPLAN_ID&f=f', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'p_app_id='+p_app_id
            });
            let responseJSON = await response.json();
            let {STATUS, YLPLAN_ID} = responseJSON;
            if(STATUS === 1) {
                //存储YLPLAN_ID
                storage.save({key: 'ylplanId', data: YLPLAN_ID});
            }
        } catch(error) {
            console.error(error);
        }
    }

    userLogout() {
        //移除
        storage.remove({key: 'userInfo'});
        storage.remove({key: 'tTaskId'});
        storage.remove({key: 'ylplanId'});

        this.setState({
            userInfo: null,
            isStartPage: false
        });
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            storage.load({
                key: 'userInfo'
            }).then((ret) => {
                // 如果找到数据，则在then方法中返回
                let userInfo = ret;
                this.setState({
                    userInfo,
                    isStartPage: false
                });
            }).catch(() => {
                // 如果没有找到数据且没有sync方法，或者有其他异常，则在catch中返回
                this.setState({
                    userInfo: null,
                    isStartPage: false
                });
            });
        }, 1000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        let {userInfo, isStartPage, buttonTitle} = this.state;
        let {userLogin, userLogout} = this;
        return (
            isStartPage ? (
                <StartPage/>
            ) : (
                userInfo ? (
                    <Home screenProps={{userInfo, userLogout}}/>
                ) : (
                    <Login screenProps={{userLogin, buttonTitle}}/>
                )
            )
        );
    }
}
