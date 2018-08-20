//异步加载详情页
$(function () {
    //动态加载main
    var paramUrl = getQueryString("url");
    loadDiv(urlRewrite(paramUrl));
});
/**header-box by li.xue 20180628 */
var shiroGlobal = "";
var realname = "";
var permissions = [];
axios.get('/api/shiro').then(function (res) {
    if(res.data.organizationVO == null || res.data.organizationVO == ""){
        res.data.organizationVO = {
            uuid: "",
            jgjc: ""
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

//axios默认设置cookie
axios.defaults.withCredentials = true;	
new Vue({
    el: '#app',
    data: function () {
        return {
            index: '',
            resourceinfo: '',
            url: '',
        }
    },
    created: function () {
        //菜单选中
        /**
        var index = getQueryString("index");
        if(index=="" || index == ""){
            index = "1";
        }
        $("#activeIndex").val(index);
        this.activeIndex = index;
        */
    },
    methods: {
       
    },

})