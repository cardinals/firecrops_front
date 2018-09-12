new Vue({
    el: "#app",
    data: function () {
        return {
            activeName: "first",
            //页面获取的id
            id: "",
            //页面获取的分区类型
            jzlx:"",
            //详情Data
            detailData: {},
            loading: false,
            //建筑类显示标识
            isJzlShow:false,
            //装置类显示标识
            isZzlShow:false,
            //储罐类显示标识
            isCglShow:false,
            //单个储罐信息
            chuGuanData:[],
            //安全疏散措施显示标识
            AQSSCS:false,
                //安全出口显示标识
                isAqckShow:false,
                //疏散楼梯显示标识
                isSsltShow:false,
                //消防电梯显示标识
                isXfdtShow:false,
                //避难层显示标识
                isBncShow:false,
                //应急广播显示标识
                isYjgbShow:false,
            //消防水系统显示标识
            XFSXT:false,
                //消防泵房显示标识
                isXfbfShow:false,
                //消防水箱显示标识
                isXfsxShow:false,
                //消防水池显示标识
                isXfscShow:false,
                //室内消火栓显示标识
                isSnxhsShow:false,
                //室外消火栓显示标识
                isSwxhsShow:false,
                //水泵接合器显示标识
                isSbjhqShow:false,
                //喷淋系统显示标识
                isPlxtShow:false,
                //冷却水系统显示标识
                isLqsxtShow:false,
                //固定水炮显示标识
                isGdspShow:false,
                //半固定设施显示标识
                isBgdssShow:false,
            //泡沫系统显示标识
            PMXT:false,
                //泡沫系统-泡沫泵房
                isPmbfShow:false,
                //泡沫系统-泡沫消火栓
                isPmxhsShow:false,
                //泡沫系统-固定泡沫炮
                isGdpmpShow:false,
                //泡沫系统-泡沫发生器
                isPmfsqShow:false,
                //泡沫系统-半固定设施
                isPmBgdssShow:false,
            //蒸汽灭火系统显示标识
            ZQMHXT:false,
                //蒸汽灭火系统-固定式
                isGdsShow:false,
                //蒸汽灭火系统-半固定式
                isBgdsShow:false,
            //消防控制室
            XFKZS:false,
            //防排烟措施
            FPYCS:false,
                //排烟口/出烟口
                isPycykShow:false,
                //防排烟措施-防排烟系统
                isFpyxtShow:false,
            //防火分区
            FHFQ:false,
            //其他灭火系统
            QTMHXT:false,
                //其他灭火系统-气体灭火系统
                isQtmhxtShow:false,
                //其他灭火系统-干粉灭火系统
                isGfmhxtShow:false,
            //其他消防设施
            QTXFSS:false,
            //安全出口data
            aqckData:[],
            //疏散楼梯data
            ssltData:[],
            //消防电梯data
            xfdtData:[],
            //避难层data
            bncData:[],
            //应急广播data
            yjgbData:[],
            //消防泵房data
            xfbfData:[],
            //消防水箱data
            xfsxData:[],
            //消防水池
            xfscData:[],
            //室内消火栓
            snxhsData:[],
            //室外消火栓
            swxhsData:[],
            //水泵接合器
            sbjhqData:[],
            //喷淋系统
            plxtData:[],
            //冷却水系统
            lqsxtData:[],
            //固定水炮
            gdspData:[],
            //半固定设施
            bgdssData:[],
            //泡沫系统-泡沫泵房
            pmbfData:[],
            //泡沫系统-泡沫消火栓
            pmxhsData:[],
            //泡沫系统-固定泡沫炮
            gdpmpData:[],
            //泡沫系统-泡沫发生器
            pmfsqData:[],
            //泡沫系统-半固定设施
            pmBgdssData:[],
            //蒸汽灭火系统-固定式
            gdsData:[],
            //蒸汽灭火系统-半固定式
            bgdsData:[],
            //消防控制室
            xfkzsData:[],
            //排烟口/出烟口
            pycykData:[],
            //防排烟措施-防排烟系统
            fpyxtData:[],
            //防火分区
            fhfqData:[],
            //其他灭火系统-气体灭火系统
            qtmhxtData:[],
            //其他灭火系统-干粉灭火系统
            gfmhxtData:[],
            //其他消防设施
            qtxfssData:[]
        }
    },
   /* created: function () {
    },*/
     mounted: function () {
        /**菜单选中 by li.xue 20180628*/
        //$("#activeIndex").val(getQueryString("index"));

        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if(type == "GJSS"){
            loadBreadcrumb("高级搜索", "单位建筑信息");
        }else{
            loadBreadcrumb("单位建筑信息", "单位建筑信息详情");
        }

        this.loading = true;
        //取得选中行id
        this.id = this.GetQueryString("id");
        this.jzlx = this.GetQueryString("jzlx");
        this.details();
        switch(this.jzlx){
            case "30":
                this.isZzlShow = true;
                break;
            case "40":
                this.isCglShow = true;
                break;
            default:
                this.isJzlShow = true;
                break;
        };
        
    },

    methods: {
        //标签页
        handleClick: function (tab, event) {
        },
        //根据参数部分和参数名来获取参数值 
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        
        //详情
        details: function () {
            doFindPhoto("JZLX",this.jzlx);
            var params = {
                jzid : this.id,
                jzlx : this.jzlx
            }
            axios.post('/dpapi/building/findFqDetailByVo', params).then(function (res) {
                this.detailData = res.data.result;
                //通过建筑分区id查询消防设施
                this.loadXfss();
                this.loading=false;
            }.bind(this), function (error) {
                console.log(error);
            })

        },
        //通过建筑分区id查询消防设施
        loadXfss:function(){
            var params = {
                jbxx_jzid:this.id
            }
            axios.post('/dpapi/firefacilities/doFindlist', params).then(function (res) {
                var data = res.data.result;
                for(var i in data){
                    switch(i){
                    //安全疏散措施
                        case'1000':
                            break;
                        case'1001':
                            this.AQSSCS = true;
                            this.isAqckShow = true;
                            this.aqckData = data[i];
                            break;
                        case'1002':
                            this.AQSSCS = true;
                            this.isSsltShow = true;
                            this.ssltData = data[i];
                            break;
                        case'1003':
                            this.AQSSCS = true;
                            this.isXfdtShow = true;
                            this.xfdtData = data[i];
                            break;
                        case'1004':
                            this.AQSSCS = true;
                            this.isBncShow = true;
                            this.bncData = data[i];
                            break;
                        case'1005':
                            this.AQSSCS = true;
                            this.isYjgbShow = true;
                            this.yjgbData = data[i];
                            break;
                    //消防水系统
                        case'2000':
                            break;
                        case'2001':
                            this.XFSXT = true;
                            this.isXfbfShow = true;
                            this.xfbfData = data[i];
                            break;
                        case'2002':
                            this.XFSXT = true;
                            this.isXfsxShow = true;
                            this.xfsxData = data[i];
                            break;
                        case'2003':
                            this.XFSXT = true;
                            this.isXfscShow = true;
                            this.xfscData = data[i];
                            break;
                        case'2004':
                            this.XFSXT = true;
                            this.isSnxhsShow = true;
                            this.snxhsData = data[i];
                            break;
                        case'2005':
                            this.XFSXT = true;
                            this.isSwxhsShow = true;
                            this.swxhsData = data[i];
                            break;
                        case'2006':
                            this.XFSXT = true;
                            this.isSbjhqShow = true;
                            this.sbjhqData = data[i];
                            break;
                        case'2007':
                            this.XFSXT = true;
                            this.isPlxtShow = true;
                            this.plxtData = data[i];
                            break;
                        case'2008':
                            this.XFSXT = true;
                            this.isLqsxtShow = true;
                            this.lqsxtData = data[i];
                            break;
                        case'2009':
                            this.XFSXT = true;
                            this.isGdspShow = true;
                            this.gdspData = data[i];
                            break;
                        case'2010':
                            this.XFSXT = true;
                            this.isBgdssShow = true;
                            this.bgdssData = data[i];
                            break;
                    //泡沫系统
                        case'3000':
                            break;
                        case'3001':
                            this.PMXT = true;
                            this.isPmbfShow = true;
                            this.pmbfData = data[i];
                            break;
                        case'3002':
                            this.PMXT = true;
                            this.isPmxhsShow = true;
                            this.pmxhsData = data[i];
                            break;
                        case'3003':
                            this.PMXT = true;
                            this.isGdpmpShow = true;
                            this.gdpmpData = data[i];
                            break;
                        case'3004':
                            this.PMXT = true;
                            this.isPmfsqShow = true;
                            this.pmfsqData = data[i];
                            break;
                        case'3005':
                            this.PMXT = true;
                            this.isPmBgdssShow = true;
                            this.pmBgdssData = data[i];
                            break;
                    //蒸汽灭火系统
                        case'4000':
                            break;
                        case'4001':
                            this.ZQMHXT = true;
                            this.isGdsShow = true;
                            this.gdsData = data[i];
                            break;
                        case'4002':
                            this.ZQMHXT = true;
                            this.isBgdsShow = true;
                            this.bgdsData = data[i];
                            break;
                    //消防控制室
                        case'5000':
                            this.XFKZS = true;
                            this.xfkzsData = data[i];
                            break;
                    //防排烟措施
                        case'6000':
                            break;
                        case'6001':
                            this.FPYCS = true;
                            this.isPycykShow = true;
                            this.pycykData = data[i];
                            break;
                        case'6002':
                            this.FPYCS = true;
                            this.isFpyxtShow = true;
                            this.fpyxtData = data[i];
                            break;
                    //防火分区
                        case'7000':
                            this.FHFQ = true;
                            this.fhfqData = data[i];
                            break;
                    //其他灭火系统
                        case'8000':
                            break;
                        case'8001':
                            this.QTMHXT = true;
                            this.isQtmhxtShow = true;
                            this.qtmhxtData = data[i];
                            break;
                        case'8002':
                            this.QTMHXT = true;
                            this.isGfmhxtShow = true;
                            this.gfmhxtData = data[i];
                            break;
                    //其他消防设施
                        case'9000':
                            this.QTXFSS = true;
                            this.qtxfssData = data[i];
                            break;
                    }
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        }
    }
})
