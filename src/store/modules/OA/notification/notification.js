import { ajaxRequest, ajaxProxyRequest} from '@/components/util/base';
import $ from 'jquery'
const Notification = {
    state:{
        infoId:null,
        viewStatus:null,//已阅人员：viewed    未阅人员：unviewed
        noticeId:null,
        messageGroup:{
            groupId:null,
            groupName:null,
            remark:null,
        },
        messageMember:{
            groupId:null,

        }
    },
    mutations:{
        SET_ID(state,payload){
            state.infoId = payload;
        },
        SET_VIEWSTAUTS(state,payload){
            state.viewStatus = payload;
        },
        SET_NOTICEDID(state,payload){
            state.noticeId = payload;
        },
        SET_MESSAGE(state,payload){
            state.messageGroup.groupId = payload.groupId;
            state.messageGroup.groupName = payload.groupName;
            state.messageGroup.remark = payload.remark;
        },
        SET_MEMBER(state,payload){
            state.messageMember.groupId = payload;
        }
    },
    actions:{
        get_info({commit},id){
            return new Promise((resolve,reject)=>{
                ajaxRequest('get','back/notice/'+id,{},res=>{
                    resolve(res)
                })      
            })
        },
        get_view({commit,state},type){
            return new Promise((resolve,reject)=>{
                let param = {
                    noticeId:type.noticeId,
                    page:type.page,
                    rows:type.rows,
                    total:type.total,
                    sc:type.sc,
                    orderProperty:type.orderProperty,
                    orderType:type.orderType,
                }
                if(type.status== 'viewed'){
                    // 获取已阅人员信息
                    ajaxRequest('get','back/notice/retrieveNamedNoticePerson',param,res=>{
                        resolve(res)
                    })
                }
                if(type.status == 'unviewed'){
                    // 获取未阅人员信息
                    ajaxRequest('get','back/notice/retrieveNoticePerson',param,res=>{
                        resolve(res)
                    })
                    
                }
            })
        },
        // 收件组人员查找
        get_message_group_member({commit,state},data){
            return new Promise((resolve,reject)=>{
                ajaxRequest('get','back/group/retrieveGroupPersons',{},res=>{
                    resolve(res)
                })
            })
        },
        // 收件组名称重复检测
        judge_groupName_distinct({commit,state},data){
            return new Promise((resolve,reject)=>{
                ajaxRequest('get','back/group/judgeGroupName',data,res=>{
                    resolve(res)
                })
            })
        },
    }
}
export default Notification
