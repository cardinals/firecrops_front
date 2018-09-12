//axios默认设置cookie
axios.defaults.withCredentials = true;
new Vue({
    el: '#detailDisplay',
    data: function () {
        return {
            activeName: "first",
            id: "",
            //显示加载中样
            loading: false,
            labelPosition: 'right',
            //基本数据保存
            detailData: {},
            //地图经度
            bdLon: 0,
            //地图纬度
            bdLat: 0,
        }
    },
    mounted: function () {
        this.loadDetails();
    },
    methods: {
        //根据参数部分和参数名来获取参数值 
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        loadDetails: function () {
            //取得选中行id
            this.id = this.GetQueryString("id");
            //改变url网址
            var stateObject = {};
            var title = "消防车辆信息";
            var url = window.location.href;
            if (url.indexOf("?") != -1)
                url = url.split("?")[0];
            url += '?index=73';
            history.pushState(stateObject, title, url);

            axios.get('/dpapi/fireengine/' + this.id).then(function (res) {
                this.detailData = res.data.result;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        test: function () {
            if (!this.detailData.cllx == null || !this.detailData.cllx == ""){
                if(this.detailData.cllx.substr(0,6) == '210102'){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        },
        //跳转到地图页面并带上UUID和点击参数水源
        tz:function(){
            var uuid = this.detailData.uuid;
            var cityCode = this.detailData.xzqh;
            window.location.href = "bigscreen/big_screen_map_pro.html?cityCode"+cityCode+"&uuid="+uuid+"&cldj=1";
        }
    },

})