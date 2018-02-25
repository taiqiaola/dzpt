import {TabNavigator} from 'react-navigation';

import MyOrderPage from './MyOrderPage';
import MyMessagePage from './MyMessagePage';

let tabs = ['我的指令', '我的消息'];

export default OrderTabs = TabNavigator({
    MyOrderPage: {
        screen: MyOrderPage,
        navigationOptions: {
            tabBarLabel: tabs[0]
        }
    },
    MyMessagePage: {
        screen: MyMessagePage,
        navigationOptions: {
            tabBarLabel: tabs[1]
        }
    }
},
{
    swipeEnabled: true,
    animationEnabled: true,
    lazy: true,
    backBehavior: 'none',
    tabBarOptions: {
        inactiveTintColor: '#707070',
        activeTintColor: '#2c2c2c',
        pressColor: '#707070',
        pressOpacity: 0.1,
        style: {
            height: 40,
            backgroundColor: '#FFFFFF',
        },
        labelStyle: {
            marginTop: 3,
            fontSize: 14,
            fontWeight: 'bold'
        },
        indicatorStyle: {
            backgroundColor: '#1296db',
            height: 2
        }
    }
});