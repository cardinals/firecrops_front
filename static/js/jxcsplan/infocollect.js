//异步加载详情页
$(function () {
    var shiroGlobal = "";
    // loadDiv("home");
});

//退出登录
function logout(){
    window.location.href = "../login.html";
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