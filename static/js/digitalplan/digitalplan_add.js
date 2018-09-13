//加载面包屑
window.onload = function () {
    var type = getQueryString("type");
    if (type == "XZ") {
        loadBreadcrumb("重点单位预案", "重点单位预案新增");
    } else if (type == "BJ") {
        loadBreadcrumb("重点单位预案", "重点单位预案编辑");
    }
}
//axios默认设置cookie
axios.defaults.withCredentials = true;
new Vue({
    el: '#app',
    data: function () {
        return {
            //菜单编码
            activeIndex: '',
            //显示加载中样
            loading: false,
            loading1: false,
            //主页面------------------------------------------
            visible: false,
            //0新增
            status: '',
            //新建数据
            addForm: {
                dxid: "",//重点单位
                dxmc: "",
                xzqh: "",
                yamc: "",//预案名称
                yalx: [],//预案类型
                yajb: "",//预案级别
                yazt: "",//预案状态
                bz: "",//备注
                disasterList: []
            },
            //灾情设定
            dynamicValidateForm: [],

            //预案基本信息data
            YALX_dataTree: [],
            YAJB_data: [],
            YAZT_data: [],
            shiroData: [],
            // detailData: {},
            //灾情信息data
            zqIndex: '',
            dzIndex: '',
            RSWZ_dataTree: [],
            ZQDJ_dataTree: [],
            QHYY_data: [],
            ZHCS_data: [],
            HZWXX_data: [],
            DJFALX_data: [],
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
            //校验规则
            rules: {
                dxmc: [
                    { required: true, message: '请选择预案对象', trigger: 'blur' }
                ],
                yamc: [
                    { required: true, message: '请输入预案名称', trigger: 'blur' }
                ],
                yalx: [
                    { type: 'array', required: true, message: '请选择预案类型', trigger: 'change' }
                ],
                yajb: [
                    { required: true, message: '请选择预案级别', trigger: 'change' }
                ]
            },
            //上传文件Data
            fileList: [],
            isFile: false,
            upLoadData: {
                yaid: ""
            },
            //重点单位弹出页---------------------------------------------------
            unitsListVisible: false,
            loading_units: false,
            //当前页
            currentPage_units: 1,
            //分页大小
            pageSize_units: 5,
            //总记录数
            total_units: 0,
            //搜索表单
            searchForm_units: {
                dwmc: ""
            },
            tableData_units: [],
            //表高度变量
            tableheight_units: 243,

            //灾情部位弹出页---------------------------------------------------
            partsListVisible: false,
            loading_parts: false,
            //当前页
            currentPage_parts: 1,
            //分页大小
            pageSize_parts: 5,
            //总记录数
            total_parts: 0,
            //搜索表单
            searchForm_parts: {
                zdbwmc: ""
            },
            tableData_parts: [],
            //表高度变量
            tableheight_parts: 243,

            //所属建筑弹出页---------------------------------------------------
            buildingListVisible: false,
            loading_building: false,
            //当前页
            currentPage_building: 1,
            //分页大小
            pageSize_building: 5,
            //总记录数
            total_building: 0,
            //搜索表单
            searchForm_building: {
                zdbwmc: ""
            },
            tableData_building: [],
            //表高度变量
            tableheight_building: 243,

            //消防队站弹出页---------------------------------------------------
            fireStaListVisible: false,
            loading_fireSta: false,
            //当前页
            currentPage_fireSta: 1,
            //分页大小
            pageSize_fireSta: 5,
            //总记录数
            total_fireSta: 0,
            //搜索表单
            searchForm_fireSta: {
                dzmc: ""
            },
            tableData_fireSta: [],
            //表高度变量
            tableheight_fireSta: 243,

        }
    },
    created: function () {
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("重点单位预案", "重点单位预案新增");
        } else if (type == "BJ") {
            loadBreadcrumb("重点单位预案", "重点单位预案编辑");
        }
        this.shiroData = shiroGlobal;
        this.YALX_tree();
        this.RSWZ_tree();
        this.ZQDJ_tree();
        this.YAJB();
        this.YAZT();
        this.QHYY();
        this.ZHCS();
        this.HZWXX();
        this.DJFALX();
    },
    mounted: function () {
        this.status = getQueryString("ID");
        this.searchClick();
    },
    methods: {
        //灾情删除
        removeDomain: function (item) {
            var index = this.dynamicValidateForm.indexOf(item)
            if (index !== -1) {
                this.dynamicValidateForm.splice(index, 1)
            }
        },
        //力量部署删除
        removellbs: function (item, num) {
            var index = this.dynamicValidateForm[num].forcedevList.indexOf(item)
            if (index !== -1) {
                this.dynamicValidateForm[num].forcedevList.splice(index, 1)
            }
        },
        //灾情增加
        addDomain: function () {
            this.dynamicValidateForm.push({
                zqbw: '',
                zdbwid: '',
                jzmc: '',
                jzid: '',
                rswz: [],
                zqdj: [],
                qhyy: '',
                rsmj: '',
                zhcs: '',
                gyjzhzwxx: '',
                qhbwgd: '',
                zqms: '',
                zqsdyj: '',
                forcedevList: [],
                keypointsMap: {
                    zsyd: '',
                    tbjs: '',
                },
                key: Date.now()
            });
        },
        //力量部署增加
        addDomainllbs: function (val) {
            this.dynamicValidateForm[val].forcedevList.push({
                dzid: '',
                dzmc: '',
                djfalx: '',
                tkwz: '',
                clzbts: ''
            })
        },

        //预案类型级联选择
        YALX_tree: function () {
            var params = {
                codetype: "YALX",
                list: [1, 2, 4, 6, 8]
            };
            axios.post('/api/codelist/getCodelisttree2', params).then(function (res) {
                this.YALX_dataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //燃烧物质级联选择
        RSWZ_tree: function () {
            axios.get('/api/codelist/getRswzTree/RSWZ').then(function (res) {
                this.RSWZ_dataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //灾情等级级联选择
        ZQDJ_tree: function () {
            axios.get('/api/codelist/getDzlxTree/ZQDJ').then(function (res) {
                this.ZQDJ_dataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //预案级别下拉框
        YAJB: function () {
            axios.get('/api/codelist/getCodetype/YAJB').then(function (res) {
                this.YAJB_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //预案状态下拉框
        YAZT: function () {
            axios.get('/api/codelist/getCodetype/YAZT').then(function (res) {
                this.YAZT_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //起火原因下拉框
        QHYY: function () {
            axios.get('/api/codelist/getCodetype/QHYY').then(function (res) {
                this.QHYY_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //灾害场所下拉框
        ZHCS: function () {
            axios.get('/api/codelist/getCodetype/ZHCS').then(function (res) {
                this.ZHCS_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //火灾危险性下拉框
        HZWXX: function () {
            axios.get('/api/codelist/getCodetype/HZWXX').then(function (res) {
                this.HZWXX_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //调集方案类型下拉框
        DJFALX: function () {
            axios.get('/api/codelist/getCodetype/DJFALX').then(function (res) {
                this.DJFALX_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //初始化查询
        searchClick: function () {
            this.loading1 = true;
            if (this.status == 0) {  //新增
                this.addForm.yazt = '01';
                this.loading1 = false;
            } else {  //修改
                //预案基本信息查询
                axios.get('/dpapi/digitalplanlist/' + this.status).then(function (res) {
                    this.addForm = res.data.result;
                    //预案类型格式化
                    if (this.addForm.yalx.endsWith("0000")) {
                        var yalx = this.addForm.yalx;
                        this.addForm.yalx = [];
                        this.addForm.yalx.push(yalx);
                    } else {
                        var yalx1 = this.addForm.yalx.substring(0, 1) + '0000'
                        var yalx2 = this.addForm.yalx
                        this.addForm.yalx = [];
                        this.addForm.yalx.push(yalx1, yalx2);
                    }
                    //行政区划赋值
                    axios.get('/dpapi/importantunits/' + this.addForm.dxid).then(function (res) {
                        this.addForm.xzqh = res.data.result.xzqh;
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                }.bind(this), function (error) {
                    console.log(error)
                })
                //灾情设定查询
                axios.get('/dpapi/disasterset/doFindByPlanId/' + this.status).then(function (res) {
                    this.dynamicValidateForm = res.data.result;
                    for (var i = 0; i < this.dynamicValidateForm.length; i++) {
                        //燃烧物质
                        if (this.dynamicValidateForm[i].rswz != null && this.dynamicValidateForm[i].rswz != "") {
                            if (this.dynamicValidateForm[i].rswz.endsWith("00")) {
                                var rswz = this.dynamicValidateForm[i].rswz;
                                this.dynamicValidateForm[i].rswz = [];
                                this.dynamicValidateForm[i].rswz.push(rswz);
                            } else {
                                var rswz1 = this.dynamicValidateForm[i].rswz.substring(0, 1) + '00'
                                var rswz2 = this.dynamicValidateForm[i].rswz
                                this.dynamicValidateForm[i].rswz = [];
                                this.dynamicValidateForm[i].rswz.push(rswz1, rswz2);
                            }
                        } else {
                            this.dynamicValidateForm[i].rswz = [];
                        }
                        //灾情等级
                        if (this.dynamicValidateForm[i].zqdj != null && this.dynamicValidateForm[i].zqdj != "") {
                            if (this.dynamicValidateForm[i].zqdj.endsWith("00")) {
                                var zqdj = this.dynamicValidateForm[i].zqdj;
                                this.dynamicValidateForm[i].zqdj = [];
                                this.dynamicValidateForm[i].zqdj.push(zqdj);
                            } else {
                                var zqdj1 = this.dynamicValidateForm[i].zqdj.substring(0, 2) + '00'
                                var zqdj2 = this.dynamicValidateForm[i].zqdj
                                this.dynamicValidateForm[i].zqdj = [];
                                this.dynamicValidateForm[i].zqdj.push(zqdj1, zqdj2);
                            }
                        } else {
                            this.dynamicValidateForm[i].zqdj = [];
                        }
                    }
                }.bind(this), function (error) {
                    console.log(error)
                })
                //附件查询
                axios.get('/dpapi/yafjxz/doFindByPlanId/' + this.status).then(function (res) {
                    // var name = res.data.result[0].wjm;
                    // var url = "http://localhost:80/upload/" + res.data.result[0].xzlj
                    if (res.data.result.length > 0) {
                        this.fileList = [{
                            uuid: res.data.result[0].uuid,
                            name: res.data.result[0].wjm,
                            url: baseUrl + "/upload/" + res.data.result[0].xzlj
                        }]
                    }

                }.bind(this), function (error) {
                    console.log(error)
                })
                this.upLoadData.yaid = this.status;
                this.loading1 = false;
            }
        },
        //重点单位选择弹出页---------------------------------------------------------------
        keyunitList: function (type) {
            if (type == 'page') {
                this.tableData = [];
            } else {
                if (type == 'init') {
                    this.searchForm_units.dwmc = ''
                }
                this.currentPage = 1;
            }
            this.unitsListVisible = true;
            this.loading_units = true;
            var params = {
                dwmc: this.searchForm_units.dwmc,
                mhdzid: this.shiroData.organizationVO.uuid,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSize_units,
                pageNum: this.currentPage_units,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/importantunits/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage_units - 1) * this.pageSize_units);
                this.tableData_units = tableTemp.concat(res.data.result.list);
                this.total_units = res.data.result.total;
                this.loading_units = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //当前页修改事件
        currentPageChange_units: function (val) {
            if (this.currentPage_units != val) {
                this.currentPage_units = val;
                this.keyunitList('page');
            }
        },
        //选择重点单位，返回单位名称和id
        selectRow_units: function (val) {
            this.addForm.dxmc = val.dwmc;
            this.addForm.dxid = val.uuid;
            this.addForm.xzqh = val.xzqh;
            this.unitsListVisible = false;
        },
        //重点单位弹出页关闭
        closeDialog_units: function (val) {
            this.unitsListVisible = false;
        },
        //重点单位查询条件清空
        clearkeyunitList: function (val) {
            this.searchForm_units.dwmc = "";
            this.keyunitList('reset');
        },
        //重点单位删除
        clearYadx: function (val) {
            this.addForm.dxmc = "";
            this.addForm.dxid = "";
        },
        //灾情部位选择弹出页---------------------------------------------------------------
        partsList: function (type, val) {
            if (this.addForm.dxid == null || this.addForm.dxid == "") {
                this.$message({
                    message: "请先选择预案对象",
                    showClose: true,
                });
            } else {
                if (type == 'page') {
                    this.tableData = [];
                } else {
                    if (type == 'init') {
                        this.zqIndex = val;
                        this.searchForm_parts.zdbwmc = ''
                    }
                    this.currentPage = 1;
                }
                this.partsListVisible = true;
                this.loading_parts = true;
                var params = {
                    zddwid: this.addForm.dxid,
                    zdbwmc: this.searchForm_parts.zdbwmc,
                    pageSize: this.pageSize_parts,
                    pageNum: this.currentPage_parts
                };
                axios.post('/dpapi/importantparts/page', params).then(function (res) {
                    var tableTemp = new Array((this.currentPage_parts - 1) * this.pageSize_parts);
                    this.tableData_parts = tableTemp.concat(res.data.result.list);
                    this.total_parts = res.data.result.total;
                    this.loading_parts = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //当前页修改事件
        currentPageChange_parts: function (val) {
            if (this.currentPage_parts != val) {
                this.currentPage_parts = val;
                this.partsList('page', '');
            }
        },
        //选择重点部位，返回重点部位名称和id
        selectRow_parts: function (val) {
            var index = this.zqIndex;
            this.dynamicValidateForm[index].zdbwid = val.zdbwid
            this.dynamicValidateForm[index].zqbw = val.zdbwmc
            this.partsListVisible = false;
        },
        //灾情部位弹出页关闭
        closeDialog_parts: function (val) {
            this.partsListVisible = false;
        },
        //灾情部位查询条件清空
        clearpartsList: function (val) {
            this.searchForm_parts.zdbwmc = "";
            this.partsList('reset', '');
        },
        //所属建筑选择弹出页---------------------------------------------------------------
        buildingList: function (type, val) {
            if (this.addForm.dxid == null || this.addForm.dxid == "") {
                this.$message({
                    message: "请先选择预案对象",
                    showClose: true,
                });
            } else {
                if (type == 'page') {
                    this.tableData = [];
                } else {
                    if (type == 'init') {
                        this.zqIndex = val;
                        this.searchForm_building.jzmc = ''
                    }
                    this.currentPage = 1;
                }
                this.buildingListVisible = true;
                this.loading_building = true;
                var params = {
                    zddwid: this.addForm.dxid,
                    jzmc: this.searchForm_building.jzmc,
                    pageSize: this.pageSize_building,
                    pageNum: this.currentPage_building
                };
                axios.post('/dpapi/digitalplanlist/doSearchJzListByZddwId', params).then(function (res) {
                    var tableTemp = new Array((this.currentPage_building - 1) * this.pageSize_building);
                    this.tableData_building = tableTemp.concat(res.data.result.list);
                    this.total_building = res.data.result.total;
                    this.loading_building = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //当前页修改事件
        currentPageChange_building: function (val) {
            if (this.currentPage_building != val) {
                this.currentPage_building = val;
                this.buildingList('page', '');
            }
        },
        //选择建筑，返回建筑名称和id
        selectRow_building: function (val) {
            var index = this.zqIndex;
            this.dynamicValidateForm[index].jzid = val.jzid
            this.dynamicValidateForm[index].jzmc = val.jzmc
            this.buildingListVisible = false;
        },
        //所属建筑弹出页关闭
        closeDialog_building: function (val) {
            this.buildingListVisible = false;
        },
        //所属建筑查询条件清空
        clearbuildingList: function (val) {
            this.searchForm_building.jzmc = "";
            this.buildingList('reset', '');
        },
        //消防队站选择弹出页---------------------------------------------------------------
        fireStaList: function (type, val, val1) {
            if (this.addForm.dxid == null || this.addForm.dxid == "") {
                this.$message({
                    message: "请先选择预案对象",
                    showClose: true,
                });
            } else {
                if (type == 'page') {
                    this.tableData = [];
                } else {
                    if (type == 'init') {
                        this.zqIndex = val;
                        this.dzIndex = val1;
                        this.searchForm_fireSta.dzmc = ''
                    }
                    this.currentPage = 1;
                }
                this.fireStaListVisible = true;
                this.loading_fireSta = true;
                if (this.addForm.xzqh != null && this.addForm.xzqh != '') {
                    var params = {
                        xzqh: this.addForm.xzqh.substring(0, 2),
                        dzmc: this.searchForm_fireSta.dzmc,
                        pageSize: this.pageSize_fireSta,
                        pageNum: this.currentPage_fireSta
                    };
                    axios.post('/dpapi/xfdz/doSearchProvinceList', params).then(function (res) {
                        var tableTemp = new Array((this.currentPage_fireSta - 1) * this.pageSize_fireSta);
                        this.tableData_fireSta = tableTemp.concat(res.data.result.list);
                        this.total_fireSta = res.data.result.total;
                        this.loading_fireSta = false;
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {
                    this.loading_fireSta = false;
                }
            }
        },
        //当前页修改事件
        currentPageChange_fireSta: function (val) {
            if (this.currentPage_fireSta != val) {
                this.currentPage_fireSta = val;
                this.fireStaList('page', '', '');
            }
        },
        //选择消防队站，返回消防队站名称和id
        selectRow_fireSta: function (val) {
            var index = this.zqIndex;
            var index1 = this.dzIndex;
            this.dynamicValidateForm[index].forcedevList[index1].dzid = val.dzid
            this.dynamicValidateForm[index].forcedevList[index1].dzmc = val.dzmc
            this.fireStaListVisible = false;
        },
        //消防队站弹出页关闭
        closeDialog_fireSta: function (val) {
            this.fireStaListVisible = false;
        },
        //消防队站查询条件清空
        clearfireStaList: function (val) {
            this.searchForm_fireSta.dzmc = "";
            this.fireStaList('reset', '', '');
        },

        //保存/提交前校验
        checkedBefore: function () {
            if (this.addForm.dxid == null || this.addForm.dxid == "") {
                this.$message.warning({
                    message: "请选择预案对象！",
                    showClose: true
                });
                return false;
            } else if (this.addForm.yamc == null || this.addForm.yamc == "") {
                this.$message.warning({
                    message: "请填写预案名称！",
                    showClose: true
                });
                return false;
            } else if (this.addForm.yajb == null || this.addForm.yajb == "") {
                this.$message.warning({
                    message: "请选择预案级别！",
                    showClose: true
                });
                return false;
            } else if (this.addForm.yalx == []) {
                this.$message.warning({
                    message: "请选择预案类型！",
                    showClose: true
                });
                return false;
            }
            for (var i = 0; i < this.dynamicValidateForm.length; i++) {
                if (this.dynamicValidateForm[i].zqbw == "") {
                    this.$message.warning({
                        message: "请选择/填写灾情" + (i + 1) + "的灾情部位! 或删除空白灾情！",
                        showClose: true
                    });
                    return false;
                } else {
                    for (var k = 0; k < this.dynamicValidateForm[i].forcedevList.length; k++) {
                        if (this.dynamicValidateForm[i].forcedevList[k].dzid == "") {
                            this.$message.warning({
                                message: "请为灾情" + (i + 1) + "中力量部署选择消防队站！或删除空白力量部署！",
                                showClose: true
                            });
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        //点击保存事件
        save: function (formName) {
            if (this.checkedBefore() == true) {
                if (this.status == 0) {//新增
                    var params = {
                        dxid: this.addForm.dxid,
                        dxmc: this.addForm.dxmc,
                        yamc: this.addForm.yamc,
                        yalx: this.addForm.yalx[this.addForm.yalx.length - 1],
                        yazt: '01',
                        yajb: this.addForm.yajb,
                        bz: this.addForm.bz,
                        disasterList: this.dynamicValidateForm,
                        zzrid: this.shiroData.userid,
                        zzrmc: this.shiroData.realName,
                        jgid: this.shiroData.organizationVO.uuid,
                        jgbm: this.shiroData.organizationVO.jgid,
                        jgmc: this.shiroData.organizationVO.jgmc,
                        jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                        datasource: this.shiroData.organizationVO.jgid
                    };
                    axios.post('/dpapi/digitalplanlist/insertByVO', params).then(function (res) {
                        this.upLoadData.yaid = res.data.result.uuid;
                        if (this.isFile) {
                            this.submitUpload();//附件上传
                        } else {
                            this.$message({
                                message: "成功保存预案信息",
                                showClose: true
                            });
                            loadDiv("digitalplan/digitalplan_list");
                            //window.location.href = "digitalplan_list.html?index=" + this.activeIndex;
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {//修改
                    var params = {
                        uuid: this.status,
                        dxid: this.addForm.dxid,
                        dxmc: this.addForm.dxmc,
                        yamc: this.addForm.yamc,
                        yalx: this.addForm.yalx[this.addForm.yalx.length - 1],
                        yazt: '01',
                        yajb: this.addForm.yajb,
                        bz: this.addForm.bz,
                        disasterList: this.dynamicValidateForm,
                        zzrid: this.shiroData.userid,
                        zzrmc: this.shiroData.realName,
                        jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                        datasource: this.shiroData.organizationVO.jgid
                    };
                    axios.post('/dpapi/digitalplanlist/doUpdateByVO', params).then(function (res) {
                        if (this.isFile) {
                            var params1 = {
                                yaid: this.status,
                                deleteFlag: 'Y',
                                xgsj: '1',
                                xgrid: this.shiroData.userid,
                                xgrmc: this.shiroData.realName
                            };
                            axios.post('/dpapi/yafjxz/doUpdateByVO', params1).then(function (res) {
                                this.submitUpload();//附件上传
                            }.bind(this), function (error) {
                                console.log(error);
                            })
                        } else {
                            this.$message({
                                message: "成功保存预案信息",
                                showClose: true
                            });
                            loadDiv("digitalplan/digitalplan_list");
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            // });
        },
        //提交点击事件
        submit: function (formName) {
            if (this.checkedBefore() == true) {
                if (this.status == 0) { //新增
                    var params = {
                        dxid: this.addForm.dxid,
                        dxmc: this.addForm.dxmc,
                        yamc: this.addForm.yamc,
                        yalx: this.addForm.yalx[this.addForm.yalx.length - 1],
                        yazt: '03',
                        shzt: '01',
                        yajb: this.addForm.yajb,
                        bz: this.addForm.bz,
                        disasterList: this.dynamicValidateForm,
                        zzrid: this.shiroData.userid,
                        zzrmc: this.shiroData.realName,
                        jgid: this.shiroData.organizationVO.uuid,
                        jgbm: this.shiroData.organizationVO.jgid,
                        jgmc: this.shiroData.organizationVO.jgmc,
                        jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                        datasource: this.shiroData.organizationVO.jgid
                    };
                    axios.post('/dpapi/digitalplanlist/insertByVO', params).then(function (res) {
                        this.upLoadData.yaid = res.data.result.uuid;
                        if (this.isFile) {
                            this.submitUpload();//附件上传
                        } else {
                            this.$message({
                                message: "成功保存并提交预案信息",
                                showClose: true
                            });
                            loadDiv("digitalplan/digitalplan_list");
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else { //修改
                    var params = {
                        uuid: this.status,
                        dxid: this.addForm.dxid,
                        dxmc: this.addForm.dxmc,
                        yamc: this.addForm.yamc,
                        yalx: this.addForm.yalx[this.addForm.yalx.length - 1],
                        yazt: '03',
                        shzt: '01',
                        yajb: this.addForm.yajb,
                        bz: this.addForm.bz,
                        disasterList: this.dynamicValidateForm,
                        zzrid: this.shiroData.userid,
                        zzrmc: this.shiroData.realName,
                        jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                        datasource: this.shiroData.organizationVO.jgid
                    };
                    axios.post('/dpapi/digitalplanlist/doUpdateByVO', params).then(function (res) {
                        if (this.isFile) {
                            var params1 = {
                                yaid: this.status,
                                deleteFlag: 'Y',
                                xgsj: '1',
                                xgrid: this.shiroData.userid,
                                xgrmc: this.shiroData.realName
                            };
                            axios.post('/dpapi/yafjxz/doUpdateByVO', params1).then(function (res) {
                                this.submitUpload();//附件上传
                            }.bind(this), function (error) {
                                console.log(error);
                            })
                        } else {
                            this.$message({
                                message: "成功保存预案信息",
                                showClose: true
                            });
                            loadDiv("digitalplan/digitalplan_list");
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            // });
        },
        //附件上传
        submitUpload: function () {
            this.$refs.upload.submit();
        },
        //附件上传成功回调方法
        handleSuccess: function (response, file, fileList) {
            if (response) {
                this.$message({
                    message: "成功保存预案信息",
                    showClose: true,
                    duration: 0
                });
            }
            loadDiv("digitalplan/digitalplan_list");
            //window.location.href = "digitalplan_list.html?index=" + this.activeIndex;
        },
        //附件移除
        handleRemove: function (file, fileList) {
            var fs = document.getElementsByName('file');
            if (fs.length > 0) {
                fs[0].value = null
            }
            console.log(file, fileList);
            this.isFile = false;
        },
        handlePreview: function (file) {
            console.log(file);
        },
        handleChange: function (file, fileList) {
            if (fileList.length == 1) {
                const isZip = file.name.endsWith("zip");
                const isRAR = file.name.endsWith("rar");
                if (isZip) {
                    this.isFile = true;
                }
                else {
                    this.$message.error('仅可上传zip格式压缩文件!');
                    this.fileList.splice(0, this.fileList.length);
                }

            } else if (fileList.length > 1) {
                this.$message.warning('当前限制上传 1 个压缩文件');
                fileList.splice(1, fileList.length - 1);
            }
        },
        ifShowDown: function (val) {
            var templete = $('.templete'),
                space = $('.space'),
                $this = $(this);
            if (val == '03') {
                templete.css('display', 'block');
                space.css('display', 'none');
            } else {
                templete.css('display', 'none');
                space.css('display', 'block');
            }
        },
        templeteDown: function (val) {
            window.open(baseUrl + "/dpapi/yafjxz/downTemplet");
        },
        //取消
        cancel: function () {
            loadDiv("digitalplan/digitalplan_list");
        },
    },

})