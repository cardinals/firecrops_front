//axios默认设置cookie
axios.defaults.withCredentials = true;
new Vue({
    el: '#app',
    data: function () {
        return {
            //菜单编号
            activeIndex: '',
            //新增修改标识（0新增，uuid修改）
            status: '',
            //显示加载中样
            loading: false,
            allTypesDataTree: [],
            azxsDataTree: [],
            pmylxDataTree: [],
            role_data: [],
            detailForm: {},
            //搜索表单
            addForm: {
                jbxx_xfssmc: '',
                jbxx_jzid: '',
                jbxx_jzmc: '',
                jbxx_iszddw: '',
                jbxx_zddwid: '',
                jbxx_zddwmc: '',
                jbxx_xfsslx: [],
                jbxx_bz: '',
                jbxx_jdh:'',
                cjrid: '',
                cjrmc: '',
                xgrid: '',
                xgrmc: '',
                detailMap: {}
            },
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
            //表高度变量
            tableheight: 243,

            //消防设备弹出页---------------------------------------------------
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
                jzmc: ''
            },
            tableData_building: [],

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
                dwmc: ''
            },
            tableData_units: [],
        }
    },
    created: function () {
        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("消防设施管理", "消防设施管理新增");
        } else if (type == "BJ") {
            loadBreadcrumb("消防设施管理", "消防设施管理编辑");
        }
        this.status = getQueryString("ID");
        this.getAllTypesDataTree();//消防设施类型级联选择数据
        this.getAzxsDataTree();
        this.getPmylxDataTree();
        this.roleData();
    },
    mounted: function () {

        this.searchClick();
    },
    methods: {
        XfssChange: function () {
            // this.detailForm = {};
            if (this.addForm.jbxx_xfsslx[1] == '1001' || this.addForm.jbxx_xfsslx[1] == '1002' ||
                this.addForm.jbxx_xfsslx[1] == '1003' || this.addForm.jbxx_xfsslx[1] == '2010' ||
                this.addForm.jbxx_xfsslx[1] == '3005') {
                this.detailForm = {
                    wz: '',
                    sl: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '1004') {
                this.detailForm = {
                    wz: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '1005') {
                this.detailForm = {
                    wz: '',
                    ywyjgb: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '2001') {
                this.detailForm = {
                    wz: '',
                    xhssl: '',
                    xhszdll: '',
                    plbsl: '',
                    plbzdll: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '2002') {
                this.detailForm = {
                    wz: '',
                    sxrl: '',
                    bjsd: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '2003') {
                this.detailForm = {
                    wz: '',
                    ywqsj: '',
                    bjsd: '',
                    qsjwz: '',
                    sxrl: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '2004' || this.addForm.jbxx_xfsslx[1] == '2005' ||
                this.addForm.jbxx_xfsslx[1] == '3003') {
                this.detailForm = {
                    wz: '',
                    sl: '',
                    sfky: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '2006') {
                this.detailForm = {
                    wz: '',
                    azxs: '',
                    xh: '',
                    jskcc: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '2007') {
                this.detailForm = {
                    wz: '',
                    ywplxt: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '2008') {
                this.detailForm = {
                    wz: '',
                    ywlqsxt: '',
                    gsqd: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '2009') {
                this.detailForm = {
                    wz: '',
                    sl: '',
                    isky: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '3001') {
                this.detailForm = {
                    wz: '',
                    pmylx: '',
                    pmycl: '',
                    pmbzdll: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '3002') {
                this.detailForm = {
                    wz: '',
                    isky: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '3004') {
                this.detailForm = {
                    wz: '',
                    xh: '',
                    sl: '',
                    ll: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '4001' || this.addForm.jbxx_xfsslx[1] == '4002') {
                this.detailForm = {
                    wz: '',
                    sl: '',
                    edyl: ''
                }
            } else if (this.addForm.jbxx_xfsslx[0] == '5000') {
                this.detailForm = {
                    wz: '',
                    iszdbj: '',
                    isldkz: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '6001') {
                this.detailForm = {
                    wz: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '6002') {
                this.detailForm = {
                    qbwz: '',
                    isky: ''
                }
            } else if (this.addForm.jbxx_xfsslx[0] == '7000') {
                this.detailForm = {
                    qymj: '',
                    qywz: '',
                    fgss: '',
                    fgwz: ''
                }
            } else if (this.addForm.jbxx_xfsslx[1] == '8001' || this.addForm.jbxx_xfsslx[1] == '8002') {
                this.detailForm = {
                    qbwz: '',
                    zyfw: ''
                }
            } else if (this.addForm.jbxx_xfsslx[0] == '9000') {
                this.detailForm = {
                    wz: '',
                    ms: ''
                }
            }
        },

        //建筑弹出页---------------------------------------------------------------
        buildingList: function (type) {
            if (type == 'page') {
                this.tableData_building = [];
            } else {
                if (type == 'init') {
                    this.searchForm_building.jzmc = '';
                }
                this.currentPage_building = 1;
            }
            this.buildingListVisible = true;
            this.loading_building = true;
            var params = {
                jzmc: this.searchForm_building.jzmc,
                pageSize: this.pageSize_building,
                pageNum: this.currentPage_building
            };
            axios.post('/dpapi/building/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage_building - 1) * this.pageSize_building);
                this.tableData_building = tableTemp.concat(res.data.result.list);
                this.total_building = res.data.result.total;
                this.loading_building = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //建筑弹出页翻页
        currentPageChange_building: function (val) {
            if (this.currentPage_building != val) {
                this.currentPage_building = val;
                this.buildingList('page');
            }
        },
        //选择建筑，返回建筑名称和id
        selectRow_building: function (val) {
            this.addForm.jbxx_jzid = val.jzid;
            this.addForm.jbxx_jzmc = val.jzmc;
            this.buildingListVisible = false;
        },
        //建筑查询条件清空
        clearBuildingList: function (val) {
            this.searchForm_building.jzmc = '';
            this.buildingList('reset');
        },

        //单位弹出页---------------------------------------------------------------
        unitsList: function (type) {
            if (type == 'page') {
                this.tableData_units = [];
            } else {
                if (type == 'init') {
                    this.searchForm_units.dwmc = '';
                }
                this.currentPage_units = 1;
            }
            this.unitsListVisible = true;
            this.loading_units = true;
            var params = {
                dwmc: this.searchForm_units.dwmc,
                pageSize: this.pageSize_units,
                pageNum: this.currentPage_units
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
        //单位弹出页翻页
        currentPageChange_units: function (val) {
            if (this.currentPage_units != val) {
                this.currentPage_units = val;
                this.unitsList('page');
            }
        },
        //选择单位，返回单位名称和id
        selectRow_units: function (val) {
            this.addForm.jbxx_zddwid = val.uuid;
            this.addForm.jbxx_zddwmc = val.dwmc;
            this.unitsListVisible = false;
        },
        //单位查询条件清空
        clearUnitsList: function (val) {
            this.searchForm_units.dwmc = '';
            this.unitsList('reset');
        },
        iszddwChange: function (val) {
            if (val == '0') {
                this.addForm.jbxx_zddwid = '';
                this.addForm.jbxx_zddwmc = '';
            }
        },

        //当前登录用户信息
        roleData: function () {
            axios.post('/api/shiro').then(function (res) {
                this.role_data = res.data;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //表格查询事件
        searchClick: function () {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                axios.get('/dpapi/firefacilities/' + this.status).then(function (res) {
                    this.addForm = res.data.result;
                    //消防设施类型格式化
                    if (this.addForm.jbxx_xfsslx != '' && this.addForm.jbxx_xfsslx != null) {
                        if (this.addForm.jbxx_xfsslx.endsWith("000")) {
                            var jbxx_xfsslx = this.addForm.jbxx_xfsslx;
                            this.addForm.jbxx_xfsslx = [];
                            this.addForm.jbxx_xfsslx.push(jbxx_xfsslx);
                        } else {
                            var jbxx_xfsslx1 = this.addForm.jbxx_xfsslx.substring(0, 1) + '000';
                            var jbxx_xfsslx2 = this.addForm.jbxx_xfsslx;
                            this.addForm.jbxx_xfsslx = [];
                            this.addForm.jbxx_xfsslx.push(jbxx_xfsslx1, jbxx_xfsslx2);
                        }
                    } else {
                        this.addForm.jbxx_xfsslx = [];
                    }
                    var params = {
                        jbxx_xfssid: this.status,
                        jbxx_xfsslx: getQueryString("xfsslx")
                    }
                    axios.post('/dpapi/firefacilities/doFindXfssDetail', params).then(function (res) {
                        this.detailForm = res.data.result;
                        if (this.addForm.jbxx_xfsslx[1] == '3001') {
                            //泡沫液类型格式化
                            if (this.detailForm.pmylx != '' && this.detailForm.pmylx != null) {
                                if (this.detailForm.pmylx.endsWith("0000")) {
                                    var pmylx = this.detailForm.pmylx;
                                    this.detailForm.pmylx = [];
                                    this.detailForm.pmylx.push(pmylx);
                                } else {
                                    var pmylx1 = this.detailForm.pmylx.substring(0, 4) + '0000';
                                    var pmylx2 = this.detailForm.pmylx;
                                    this.detailForm.pmylx = [];
                                    this.detailForm.pmylx.push(pmylx1, pmylx2);
                                }
                            } else {
                                this.detailForm.pmylx = [];
                            }
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //消防设施类型级联选择数据
        getAllTypesDataTree: function () {
            axios.get('/api/codelist/getDzlxTree/XFSSLX').then(function (res) {
                this.allTypesDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //水泵接合器安装形式
        getAzxsDataTree: function () {
            axios.get('/api/codelist/getCodetype/SBJHQAZXS').then(function (res) {
                this.azxsDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //泡沫液类型
        getPmylxDataTree: function () {
            axios.get('/api/codelist/getPmylxTree/PMYLX').then(function (res) {
                this.pmylxDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //保存前校验
        checkForm: function () {
            if (this.addForm.jbxx_xfssmc == '' || this.addForm == null) {
                this.$message.warning({
                    message: '请输入消防设施名称',
                    showClose: true
                });
                return false;
            }else if (this.addForm.jbxx_iszddw == '') {
                this.$message.warning({
                    message: '请选择是否属于重点单位',
                    showClose: true
                });
                return false;
            }else if (this.addForm.jbxx_iszddw == '1' && this.addForm.jbxx_zddwid == '') {
                this.$message.warning({
                    message: '请选择所属重点单位',
                    showClose: true
                });
                return false;
            }else if (this.addForm.jbxx_xfsslx.length==0) {
                this.$message.warning({
                    message: '请选择消防设施类型',
                    showClose: true
                });
                return false;
            }
            return true;
        },
        //保存
        save: function () {
            if (this.checkForm() == true) {
                if (this.status == 0) {//新增
                    this.addForm.cjrid = this.role_data.userid;
                    this.addForm.cjrmc = this.role_data.realName;
                    this.addForm.jbxx_jdh = this.role_data.organizationVO.jgid;
                    this.addForm.detailMap = this.detailForm;
                    var params = this.addForm;
                    if (params.jbxx_xfsslx.length > 0) {
                        params.jbxx_xfsslx = params.jbxx_xfsslx[params.jbxx_xfsslx.length - 1];
                    }
                    if (params.jbxx_xfsslx == '3001') {
                        params.detailMap.pmylx = params.detailMap.pmylx[params.detailMap.pmylx.length - 1];
                    }
                    axios.post('/dpapi/firefacilities/insertByVO', params).then(function (res) {
                        if (res.data.result != null && res.data.result != '') {
                            this.$alert('保存成功', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("buildingzoning/firefacilities_list");
                                }
                            });
                        } else {
                            this.$alert('保存失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("buildingzoning/firefacilities_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {//修改
                    this.addForm.xgrid = this.role_data.userid;
                    this.addForm.xgrmc = this.role_data.realName;
                    this.addForm.detailMap = this.detailForm;
                    var params = this.addForm;
                    if (params.jbxx_xfsslx.length > 0) {
                        params.jbxx_xfsslx = params.jbxx_xfsslx[params.jbxx_xfsslx.length - 1];
                    }
                    if (params.jbxx_xfsslx == '3001') {
                        params.detailMap.pmylx = params.detailMap.pmylx[params.detailMap.pmylx.length - 1];
                    }
                    axios.post('/dpapi/firefacilities/doUpdateFirefacilities', params).then(function (res) {
                        if (res.data.result != null && res.data.result != '') {
                            this.$alert('修改成功', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("buildingzoning/firefacilities_list");
                                }
                            });
                        } else {
                            this.$alert('修改失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("buildingzoning/firefacilities_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                }
            }
        },
        //取消
        cancel: function () {
            loadDiv("buildingzoning/firefacilities_list");
        }
    },

})