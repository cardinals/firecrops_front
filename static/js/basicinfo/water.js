new Vue({
    el: "#detailDisplay",
    data: function () {
        return {
            activeName: "first",  
            //页面获取的pkid
            id:"",
            //页面获取的水源类型
            sylx:"",
            //详情Data
            detailData: {},
           //地图经度
           bdLon:0,
           //地图纬度
           bdLat:0,
           loading:false,
           isXHS:false,
           isXFSH:false,
           isXFSC:false,
           isTRSYQSD:false

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
            //获取选中行水源类型
            this.sylx = this.GetQueryString("sylx");
            //改变url网址
            var stateObject = {};
            var title = "消防水源信息";
            var url=window.location.href;
            if(url.indexOf("?") != -1)
                url = url.split("?")[0];
            url += '?index=71';
            history.pushState(stateObject,title,url);
            //history.back();
            
            switch(this.sylx){
                case '01':
                    this.isXHS = true;
                    break;
                case '02':
                    this.isXFSH = true;
                    break;
                case '03':
                    this.isXFSC = true;
                    break;
                case '04':
                    this.isTRSYQSD = true;
                    break;
            }
            this.loading = true;
            var params = {
                uuid : this.id,
                sylx : this.sylx
            }
            axios.post('/dpapi/xfsy/findSyAndSxByVo', params).then(function (res) {
                this.detailData = res.data.result;
                this.loading=false;
            }.bind(this), function (error) {
                console.log(error);
            })
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
