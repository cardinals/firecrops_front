new Vue({
    el: "#detailDisplay",
    data: function () {
        return {
            activeName: "first",
            //页面获取的pkid
            id: "",
            //页面获取的水源类型
            sylx: "",
            //详情Data
            detailData: [],
            //预案名称id
            yamcData: [],
            //多条预案的id
            idData: [],
            //地图经度
            bdLon: 0,
            //地图纬度
            bdLat: 0,
            loading: false,
            isXHS: false,
            isXFSH: false,
            isXFSC: false,
            isTRSYQSD: false,
            //表高度变量
            tableheight: 143,

        }
    },
    mounted: function () {
        this.loadDetails();
    },

    methods: {
        //根据参数部分和参数名来获取参数值 
        GetQueryString(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
        loadDetails:function(){
            //取得选中行id
            this.id = this.GetQueryString("id");
           
            //改变url网址
            // var stateObject = {};
            // var title = "消防水源信息";
            // var url=window.location.href;
            // if(url.indexOf("?") != -1)
            //     url = url.split("?")[0];
            // url += '?index=71';
            // history.pushState(stateObject,title,url);
            
            this.yauuid = this.id;
            
            axios.get('/dpapi/digitalplanlist/doFindListByZddwId/' + this.yauuid).then(function (res) {

               
                this.detailData = res.data.result;
               
                // for(var k = 0; k < this.detailData.length; k++){
                //         if(this.detailData[k].yajb == '03'){
                //             this.idData[k]=this.detailData[k].uuid;
                           
                //         }
                //     };
                this.loading=false;


            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //选择预案名称进行跳转
        informClick(val) {
            if(val.yajb == '03'){
                //取得选中行id
                var uuid = val.uuid;
                window.open(baseUrl+"/planShare/page/" + uuid + "/detail/web");
            }
        },
        //跳转到地图页面并带上UUID和点击参数水源
        tz:function(){
            var uuid = this.detailData.uuid;
            // var sylx = this.detailData.sylx;
            // var cityCode = this.detailData.xzqh;
            // window.location.href = "bigscreen/big_screen_map_pro.html?cityCode="+cityCode+"&uuid="+uuid+"&sylx="+sylx+"&shuidj=1";

            window.location.href = "../all.html?url=/basicinfo/firewater&uuid=" + uuid + "&sydj=1" + "&index=71" + "&type=DT";
        }
    }
})
