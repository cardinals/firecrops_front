//异步加载详情页
$(function () {
    var unscid = getQueryString("unscid");
    var params = {
        unscid : unscid,
    }
    loadDiv("jxcsplan/jxcsplan_add");
});
/**header-box by li.xue 20180628 */
var shiroGlobal = "";
var realname = "";
var permissions = [];
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
}.bind(this), function (error) {
    console.log(error)
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