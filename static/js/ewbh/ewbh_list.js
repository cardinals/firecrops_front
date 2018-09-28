//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            zddwListShow: true,
            basicInfoShow: false,
            activeName: "first",
            uuid: '',
            dzid: '',
            searchForm: { dwmc: '' },
            zddwListData: [],//重点单位列表
            currentPage: 1,//当前页
            pageSize: 9,//分页大小
            total: 0,//总记录数
            zddwDetails: {},
            xfllData: [],//消防力量
            xfclData: [],//消防车辆
            xfsyData: [],//消防水源
            xfssData: [],//消防设施


        }
    },
    created: function () {
        // debugger
        this.shiroData = shiroGlobal;
        // isEwbh = false;
        // this.uuid = '337ABEE6E91549D4B00DD0C26DCEE6A5';//重点单位id
        this.getZddwList();
    },
    methods: {
        returnZddw: function () {
            this.zddwListShow = true;
            this.basicInfoShow = false;
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
        currentPageChange: function (val) {
            if (this.currentPage != val) {
                this.currentPage = val;
                this.getZddwList();
            }
        },
        //获取重点单位详情
        getZddwDetail: function (val) {
            this.zddwDetails = val;
            this.uuid = val.uuid;
            this.getXfllListByZddwId();
            this.getXfssListByZddwId();
            this.getXfsyListByZddwGis();
            this.getXfclListByZddwGis();
            this.zddwListShow = false;
            this.basicInfoShow = true;
        },

        //根据重点单位id获取消防队伍信息
        getXfllListByZddwId: function () {
            axios.get('/dpapi/importantunits/doFindXfllListByZddwId/' + this.uuid).then(function (res) {
                this.xfllData = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位id获取消防设施信息
        getXfssListByZddwId: function () {
            var params = {
                uuid: this.uuid
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