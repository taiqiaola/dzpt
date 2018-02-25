import {StackNavigator} from 'react-navigation';

import Tab from '../tab/Tab';

import MapSearch from '../map/MapSearch';

import OneKeyStartTask from '../command/OneKeyStartTask';
import TaskAdminister from '../command/TaskAdminister';
import AddTask from '../command/AddTask';
import TaskInfo from '../command/TaskInfo';
import UpdateTaskInfo from '../command/UpdateTaskInfo';
import QuakeCenter from '../command/QuakeCenter';
import SelectUser from '../command/SelectUser';
import CommandIssue from '../command/CommandIssue';
import SendMessage from '../command/SendMessage';
import CommandIssueRecord from '../command/CommandIssueRecord';
import SelfReportRecord from '../command/SelfReportRecord';
import MessageRecord from '../command/MessageRecord';
import CommandMessageDetail from '../command/CommandMessageDetail';

import SelfReport from '../order/SelfReport';
import SelfReportDetail from '../order/SelfReportDetail';
import MyReportRecord from '../order/MyReportRecord';
import MessageDetail from '../order/MessageDetail';

import MyPlanRemind from '../setting/MyPlanRemind';
import SettingUserInfo from '../setting/SettingUserInfo';
import About from '../setting/About';
import ChangeSJ from '../setting/ChangeSJ';
import ChangeCorp from '../setting/ChangeCorp';
import ChangeAddress from '../setting/ChangeAddress';

export default Home = StackNavigator({
    Home: {screen: Tab},
    MapSearch: {screen: MapSearch},
    OneKeyStartTask: {screen: OneKeyStartTask},
    TaskAdminister: {screen: TaskAdminister},
    TaskInfo: {
        screen: TaskInfo,
        navigationOptions: {
            headerTitle: '任务详情'
        }
    },
    UpdateTaskInfo: {
        screen: UpdateTaskInfo,
        navigationOptions: {
            headerTitle: '修改任务'
        }
    },
    AddTask: {
        screen: AddTask,
        navigationOptions: {
            headerTitle: '创建任务'
        }
    },
    QuakeCenter: {screen: QuakeCenter,},
    SelectUser: {screen: SelectUser},
    CommandIssue: {
        screen: CommandIssue,
        navigationOptions: {
            headerTitle: '指令下达'
        }
    },
    SendMessage: {
        screen: SendMessage,
        navigationOptions: {
            headerTitle: '发送消息'
        }
    },
    CommandIssueRecord: {
        screen: CommandIssueRecord,
        navigationOptions: {
            headerTitle: '指令下达记录'
        }
    },
    SelfReportRecord: {
        screen: SelfReportRecord,
        navigationOptions: {
            headerTitle: '自主上报记录'
        }
    },
    MessageRecord: {
        screen: MessageRecord,
        navigationOptions: {
            headerTitle: '消息记录'
        }
    },
    CommandMessageDetail: {
        screen: CommandMessageDetail,
        navigationOptions: {
            headerTitle: '消息详情'
        }
    },
    SelfReport: {screen: SelfReport},
    SelfReportDetail: {
        screen: SelfReportDetail,
        navigationOptions: {
            headerTitle: '自主上报'
        }
    },
    MyReportRecord: {
        screen: MyReportRecord,
        navigationOptions: {
            headerTitle: '我的上报记录'
        }
    },
    MessageDetail: {
        screen: MessageDetail,
        navigationOptions: {
            headerTitle: '消息详情',
        }
    },
    MyPlanRemind: {
        screen: MyPlanRemind,
        navigationOptions: {
            headerTitle: '我的预案库',
        }
    },
    SettingUserInfo: {
        screen: SettingUserInfo,
        navigationOptions: {
            headerTitle: '个人信息维护',
        }
    },
    About: {
        screen: About,
        navigationOptions: {
            headerTitle: '关于',
        }
    },
    ChangeSJ: {
        screen: ChangeSJ,
        navigationOptions: {
            headerTitle: '修改手机',
        }
    },
    ChangeCorp: {screen: ChangeCorp},
    ChangeAddress: {
        screen: ChangeAddress,
        navigationOptions: {
            headerTitle: '修改联系地址',
        }
    }
});
