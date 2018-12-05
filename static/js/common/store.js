/**
const key = "user";
const isLogin = "isLogin";
const store = new Vuex.Store({
    state: {
        user: null,
        isLogin: false,
    },
    getters: {
        getStorage: function(state) {
            if(!state.user){
                state.user = JSON.parse(localStorage.getItem(key));
                state.isLogin = localStorage.getItem(isLogin);
            }
            return state.user;
        }
    },
    mutations: {
        $_setLogin(state, value){
            state.isLogin = value;
            localStorage.setItem(isLogin, value);
        },
        $_setStorage(state, value){
            state.user = value;
            localStorage.setItem(key, JSON.stringify(value));
        },
        $_removeStorage(state){
            state.user = null;
            localStorage.removeItem(key);
        }
    }
});
*/
axios.interceptors.request.use(
    config => {
        if(config.url != '/api/login' && config.url != '/api/getSession' && config.url != "/api/shiro"){
            axios.get('/api/getSession').then(function (res) {
                if(res.data == '0'){
                    alert("用户超时，请重新登陆");
                    window.location.href = "/templates/login.html"; 
                }
            }.bind(this), function (error) {
                console.log(error)
            })
            /**
            if(config.url == '/api/shiro'){
                localStorage.setItem("time", new Date().getTime());
            }else{
                if(localStorage.getItem("isLogin") && (new Date().getTime()-localStorage.getItem("time")<30*60*1000)){
                    localStorage.setItem("time", new Date().getTime());
                }else{
                    alert("用户超时，请重新登陆");
                    window.location.href = "/templates/login.html"; 
                    // this.$alert('用户超时，请重新登陆', '提示信息', {
                    //     confirmButtonText: '确定',
                    //     callback: action => {
                    //         window.location.href = "/templates/login.html"; 
                    //     }
                    // });
                }
            }
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            // config.headers.Authorization = `token ${store.state.token}`;
            */
        }
        return config;
    },
    err => {
        return Promise.reject(err);
});