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
            history.back();
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
                debugger;
                this.loading=false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
         //跳转到地图页面并带上UUID和点击参数水源
        tz:function(){
            // console.log(this.tableData);
            var uuid = this.detailData.uuid;
            var sylx = this.detailData.sylx;
            window.location.href = "../bigscreen/big_screen_map_pro.html?uuid="+uuid+"&sylx="+sylx+"&shuidj=1";
        }
    }
})
