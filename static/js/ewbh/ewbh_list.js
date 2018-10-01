//axios默认设置cookie
axios.defaults.withCredentials = true;

var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            zddwListShow: true,
            basicInfoShow: false,
            activeName: "first",
            type: '',
            uuid: '',//标绘id
            zddwid: '',//单位id
            zddwmc: '',//单位名称
            bhmc: '',
            searchForm: { dwmc: '' },
            zddwListData: [],//重点单位列表
            currentPage: 1,//当前页
            pageSize: 10,//分页大小
            total: 0,//总记录数
            zddwDetails: {},
            ewbhDetails: {},
            xfllData: [],//消防力量
            xfclData: [],//消防车辆
            xfsyData: [],//消防水源
            xfssData: []//消防设施
        }
    },
    created: function () {
        var iframe = document.getElementById("ewbhmain");
        iframe.src = ewbhUrl;
        this.shiroData = shiroGlobal;
        this.type = getQueryString("type");
        this.init();
    },
    methods: {
        init: function () {
            if (this.type == 'XZ') {
                this.getZddwList();
                this.sendInforToIframe();
            } else if (this.type == 'BJ') {
                this.type = 'editInit'
                this.uuid = getQueryString("ID");
                this.zddwid = getQueryString("zddwid");
                this.bhmc = getQueryString("bhmc");
                if(this.zddwid!='null'){
                    this.getZddwInfo();
                }else{
                    this.sendInforToIframe();
                    this.getZddwList();
                }
            }
        },
        //返回重点单位列表
        returnZddw: function () {
            this.zddwListShow = true;
            this.basicInfoShow = false;
            this.zddwid = '';
            this.zddwmc = '';
            this.sendInforToIframe();
            this.getZddwList();
        },
        //重点单位列表查询
        getZddwList: function () {
            var params = {
                dwmc: this.searchForm.dwmc,
                jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/importantunits/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.zddwListData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //翻页
        currentPageChange: function (val) {
            if (this.currentPage != val) {
                this.currentPage = val;
                this.getZddwList();
            }
        },
        //二维标绘详情
        getEwbhDetail: function () {
            axios.get('/dpapi/ewbh/' + this.uuid).then(function (res) {
                this.ewbhDetails = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //重点单位信息
        getZddwInfo: function () {
            axios.get('/dpapi/importantunits/' + this.zddwid).then(function (res) {
                this.getZddwDetail(res.data.result);
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //获取重点单位周边详情
        getZddwDetail: function (val) {
            this.zddwDetails = val;
            this.zddwid = val.uuid;
            this.zddwmc = val.dwmc;
            this.sendInforToIframe();
            this.getXfllListByZddwId();
            this.getXfssListByZddwId();
            this.getXfsyListByZddwGis();
            this.getXfclListByZddwGis();
            this.zddwListShow = false;
            this.basicInfoShow = true;
        },
        //向iframe发送参数
        sendInforToIframe: function () {
            var params = {};
            if (getQueryString("type") === "XZ") {
                params = {
                    type: 'XZ',
                    zddwid: this.zddwid,
                    cjrid: this.shiroData.userid,
                    cjrmc: this.shiroData.realName,
                    jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                    datasource: this.shiroData.organizationVO.jgid
                }
            } else if (getQueryString("type") === "BJ") {
                params = {
                    type: this.type,
                    uuid: this.uuid,
                    wjm: this.bhmc,
                    zddwid: this.zddwid,
                    xgrid: this.shiroData.userid,
                    xgrmc: this.shiroData.realName
                }
                this.type = 'BJ';
            }
            window.setTimeout(function () {
                document.getElementById('ewbhmain').contentWindow.postMessage(params, "http://localhost:8082");
            }, 2000);
        },
        //根据重点单位id获取消防队伍信息
        getXfllListByZddwId: function () {
            axios.get('/dpapi/importantunits/doFindXfllListByZddwId/' + this.zddwid).then(function (res) {
                this.xfllData = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位id获取消防设施信息
        getXfssListByZddwId: function () {
            var params = {
                uuid: this.zddwid
            }
            axios.post('/dpapi/importantunits/doFindFireFacilitiesDetailsByVo', params).then(function (res) {
                this.xfssData = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位坐标获取周边1公里内水源信息
        getXfsyListByZddwGis: function () {
            var params = {
                gisX: this.zddwDetails.gisX,
                gisY: this.zddwDetails.gisY
            }
            axios.post('/dpapi/importantunits/doFindXfsyListByZddwGis', params).then(function (res) {
                this.xfsyData = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位坐标获取周边1公里内车辆信息
        getXfclListByZddwGis: function () {
            var params = {
                gisX: this.zddwDetails.gisX,
                gisY: this.zddwDetails.gisY
            }
            axios.post('/dpapi/importantunits/doFindXfclListByZddwGis', params).then(function (res) {
                this.xfclData = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
    }
})