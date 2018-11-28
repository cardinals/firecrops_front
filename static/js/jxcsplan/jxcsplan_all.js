//异步加载详情页
$(function () {
    var unscid = getQueryString("unscid");
    var params = {
        unscid : unscid,
    }
    /**header-box by li.xue 20180628 */
    shiroGlobal = "";
    realname = "";
    permissions = [];
    axios.get('/api/shiro').then(function (res) {
        if(res.data.organizationVO == null || res.data.organizationVO == ""){
            res.data.organizationVO = {
                uuid: "",
                jgjc: "",
                jgid: ""
            }
        }
        shiroGlobal = res.data;
        //用户权限
        for(var i in res.data.permissions){
            permissions.push(res.data.permissions[i]);
        }
        realname = res.data.realName;
        document.querySelector("#realname").innerHTML = realname;
        if(res.data == null && realname == null && realname == ""){
            window.location.href = "login.html";
        }
        //如果是九小用户且不是新增，查询数据状态
        if(shiroGlobal.username == 'jxcs' && shiroGlobal.dwid!= null){
            axios.get('/dpapi/jxcsjbxx/' + shiroGlobal.dwid).then(function (res) {
                if(res.data.result.sjzt == '03' || res.data.result.sjzt == '05'){//已提交已通过
                    var params = {
                        ID: res.data.result.uuid
                    }
                    loadDivParam("jxcsplan/jxcsplan_detail", params);//跳转确认页
                }else{
                    loadDiv("jxcsplan/jxcsplan_add");//跳转到到新增页
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        }else{//管理端，或九小新增
            loadDiv("jxcsplan/jxcsplan_add");
        }
    }.bind(this), function (error) {
        console.log(error)
    });
    
});

//退出登录
function logout(){
    $('#login-out-form')[0].submit();
    // window.location.href = "../login.html";
}

//axios默认设置cookie
axios.defaults.withCredentials = true;	
new Vue({
    el: '#app',
    data: function () {
        return {
        }
    },
    created: function () {
    
    },
    methods: {
        
    },

})