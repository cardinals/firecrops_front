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
                disasterList: []//灾情设定
            },

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
            //信息校验规则
            inforRules: {
                dxmc: [{ required: true, message: '请选择预案对象', trigger: 'blur' }],
                yamc: [{ required: true, message: '请输入预案名称', trigger: 'blur' }],
                yalx: [{
                    validator: (rule, value, callback) => {
                        if (value.length == 0) {
                            callback(new Error("请选择预案类型"));
                        } else {
                            callback();
                        }

                    }, trigger: 'change'
                }],
                yajb: [{ required: true, message: '请选择预案级别', trigger: 'change' }],
                zqbw: [{ required: true, message: '请输入或选择灾情部位', trigger: 'blur' }],
                dzmc: [{ required: true, message: '请选择消防队站', trigger: 'blur' }]
            },
            //上传文件Data
            fileList: [],
            deleteFile: [],
            isFile: false,
            //上传图片Data
            picList: [],
            deletePics: [],
            isPic: false,

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
        removeDisaster: function (item) {
            var index = this.addForm.disasterList.indexOf(item)
            if (index !== -1) {
                this.addForm.disasterList.splice(index, 1)
            }
        },
        //力量部署删除
        removellbs: function (item, num) {
            var index = this.addForm.disasterList[num].forcedevList.indexOf(item)
            if (index !== -1) {
                this.addForm.disasterList[num].forcedevList.splice(index, 1)
            }
        },
        //灾情增加
        addDomain: function () {
            this.addForm.disasterList.push({
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
                }
            });
        },
        //力量部署增加
        addDomainllbs: function (val) {
            this.addForm.disasterList[val].forcedevList.push({
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
                axios.get('/dpapi/xfdz/doFindDzlxByOrgId/' + this.shiroData.organizationVO.uuid).then(function (res1) {
                    var dzlx = res1.data.result;
                    switch (dzlx) {
                        case '0100':
                            this.YAJB_data.push(res.data.result[0]);
                        case '0200':
                            this.YAJB_data.push(res.data.result[1]);
                        case '0300':
                            this.YAJB_data.push(res.data.result[2]);
                        default:
                            this.YAJB_data.push(res.data.result[3]);
                    }

                }.bind(this), function (error) {
                    console.log(error);
                })
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
                    this.addForm.disasterList = res.data.result;
                    for (var i = 0; i < this.addForm.disasterList.length; i++) {
                        //燃烧物质
                        if (this.addForm.disasterList[i].rswz != null && this.addForm.disasterList[i].rswz != "") {
                            if (this.addForm.disasterList[i].rswz.endsWith("00")) {
                                var rswz = this.addForm.disasterList[i].rswz;
                                this.addForm.disasterList[i].rswz = [];
                                this.addForm.disasterList[i].rswz.push(rswz);
                            } else {
                                var rswz1 = this.addForm.disasterList[i].rswz.substring(0, 1) + '00'
                                var rswz2 = this.addForm.disasterList[i].rswz
                                this.addForm.disasterList[i].rswz = [];
                                this.addForm.disasterList[i].rswz.push(rswz1, rswz2);
                            }
                        } else {
                            this.addForm.disasterList[i].rswz = [];
                        }
                        //灾情等级
                        if (this.addForm.disasterList[i].zqdj != null && this.addForm.disasterList[i].zqdj != "") {
                            if (this.addForm.disasterList[i].zqdj.endsWith("00")) {
                                var zqdj = this.addForm.disasterList[i].zqdj;
                                this.addForm.disasterList[i].zqdj = [];
                                this.addForm.disasterList[i].zqdj.push(zqdj);
                            } else {
                                var zqdj1 = this.addForm.disasterList[i].zqdj.substring(0, 2) + '00'
                                var zqdj2 = this.addForm.disasterList[i].zqdj
                                this.addForm.disasterList[i].zqdj = [];
                                this.addForm.disasterList[i].zqdj.push(zqdj1, zqdj2);
                            }
                        } else {
                            this.addForm.disasterList[i].zqdj = [];
                        }
                    }
                }.bind(this), function (error) {
                    console.log(error)
                })
                var yafj = {
                    yaid: this.status,
                    kzm: '.zip'
                }
                //附件查询
                axios.post('/dpapi/yafjxz/doFindByPlanId', yafj).then(function (res) {
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
                var yafj1 = {
                    yaid: this.status,
                    kzm: 'pic'
                }
                //图片查询
                axios.post('/dpapi/yafjxz/doFindByPlanId', yafj1).then(function (res) {
                    var picData = res.data.result;
                    if (picData.length > 0) {
                        for (var i in picData) {
                            this.picList.push({
                                uuid: picData[i].uuid,
                                name: picData[i].wjm,
                                url: baseUrl + "/upload/" + picData[i].xzlj
                            });
                        }
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
                jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
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
                this.$message.warning({
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
            this.addForm.disasterList[index].zdbwid = val.zdbwid
            this.addForm.disasterList[index].zqbw = val.zdbwmc
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
                this.$message.warning({
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
            this.addForm.disasterList[index].jzid = val.jzid
            this.addForm.disasterList[index].jzmc = val.jzmc
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
                this.$message.warning({
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
                //行政区划
                var xzqh = "";
                if (this.addForm.xzqh != null && this.addForm.xzqh != '') {
                    xzqh = this.addForm.xzqh.substring(0, 2);
                }
                //队站ID
                var dzid = "";
                if (this.shiroData.organizationVO.jgid != '01000000') {
                    dzid = this.shiroData.organizationVO.uuid;
                }
                var params = {
                    xzqh: xzqh,
                    dzid: dzid,
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
            this.addForm.disasterList[index].forcedevList[index1].dzid = val.dzid
            this.addForm.disasterList[index].forcedevList[index1].dzmc = val.dzmc
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

        //点击保存事件
        save: function (addForm) {
            this.$refs[addForm].validate((valid) => {
                if (valid) {
                    if (this.status == 0) {//新增
                        var params = {
                            dxid: this.addForm.dxid,
                            dxmc: this.addForm.dxmc,
                            yamc: this.addForm.yamc,
                            yalx: this.addForm.yalx[this.addForm.yalx.length - 1],
                            yazt: '01',
                            yajb: this.addForm.yajb,
                            bz: this.addForm.bz,
                            disasterList: this.addForm.disasterList,
                            zzrid: this.shiroData.userid,
                            zzrmc: this.shiroData.realName,
                            jgid: this.shiroData.organizationVO.uuid,
                            jgbm: this.shiroData.organizationVO.jgid,
                            jgmc: this.shiroData.organizationVO.jgmc,
                            jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                            datasource: this.shiroData.organizationVO.jgid
                        };
                        axios.post('/dpapi/digitalplanlist/insertByVO', params).then(function (res) {
                            this.upLoadData.yaid = res.data.result.uuid;
                            if (this.isFile) {
                                this.$refs.upload.submit();//附件上传
                            } else if (this.isPic) {
                                this.$refs.uploadPics.submit();//图片上传
                            } else {
                                // this.$message({
                                //     message: "成功保存预案信息",
                                //     showClose: true
                                // });
                                // loadDiv("digitalplan/digitalplan_list");

                                this.$alert('成功保存预案信息', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("digitalplan/digitalplan_list");
                                    }
                                });
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
                            disasterList: this.addForm.disasterList,
                            zzrid: this.shiroData.userid,
                            zzrmc: this.shiroData.realName,
                            jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                            datasource: this.shiroData.organizationVO.jgid
                        };
                        axios.post('/dpapi/digitalplanlist/doUpdateByVO', params).then(function (res) {
                            if (this.deleteFile.length > 0) {
                                axios.post('/dpapi/yafjxz/doUpdateByVO', this.deleteFile).then(function (res) {
                                }.bind(this), function (error) {
                                    console.log(error);
                                })
                            }
                            if (this.deletePics.length > 0) {
                                axios.post('/dpapi/yafjxz/doUpdateByVO', this.deletePics).then(function (res) {
                                }.bind(this), function (error) {
                                    console.log(error);
                                })
                            }
                            if (this.isFile) {
                                this.$refs.upload.submit();//附件上传
                            } else if (this.isPic) {
                                this.$refs.uploadPics.submit();
                            } else {
                                this.$alert('成功保存预案信息', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("digitalplan/digitalplan_list");
                                    }
                                });
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }
                } else {
                    console.log('error save!!');
                    return false;
                }
            });
        },
        //提交点击事件
        submit: function (addForm) {
            this.$refs[addForm].validate((valid) => {
                if (valid) {
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
                            disasterList: this.addForm.disasterList,
                            zzrid: this.shiroData.userid,
                            zzrmc: this.shiroData.realName,
                            jgid: this.shiroData.organizationVO.uuid,
                            jgbm: this.shiroData.organizationVO.jgid,
                            jgmc: this.shiroData.organizationVO.jgmc,
                            jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                            datasource: this.shiroData.organizationVO.jgid
                        };
                        axios.post('/dpapi/digitalplanlist/insertByVO', params).then(function (res) {
                            this.upLoadData.yaid = res.data.result.uuid;
                            if (this.isFile) {
                                this.$refs.upload.submit();
                            } else if (this.isPic) {
                                this.$refs.uploadPics.submit();
                            } else {
                                this.$alert('成功保存预案信息', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("digitalplan/digitalplan_list");
                                    }
                                });
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
                            disasterList: this.addForm.disasterList,
                            zzrid: this.shiroData.userid,
                            zzrmc: this.shiroData.realName,
                            jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                            datasource: this.shiroData.organizationVO.jgid
                        };
                        axios.post('/dpapi/digitalplanlist/doUpdateByVO', params).then(function (res) {
                            if (this.deleteFile.length > 0) {
                                axios.post('/dpapi/yafjxz/doUpdateByVO', this.deleteFile).then(function (res) {
                                }.bind(this), function (error) {
                                    console.log(error);
                                })
                            }
                            if (this.deletePics.length > 0) {
                                axios.post('/dpapi/yafjxz/doUpdateByVO', this.deletePics).then(function (res) {
                                }.bind(this), function (error) {
                                    console.log(error);
                                })
                            }
                            if (this.isFile) {
                                this.$refs.upload.submit();
                            } else if (this.isPic) {
                                this.$refs.uploadPics.submit();
                            } else {
                                this.$alert('成功保存预案信息', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("digitalplan/digitalplan_list");
                                    }
                                });
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //附件上传成功回调方法
        fileSuccess: function (response, file, fileList) {
            if (response) {
                if (this.isPic) {
                    this.$refs.uploadPics.submit();
                } else {
                    this.$alert('成功保存预案信息', '提示', {
                        type: 'success',
                        confirmButtonText: '确定',
                        callback: action => {
                            loadDiv("digitalplan/digitalplan_list");
                        }
                    });
                }
            }
            loadDiv("digitalplan/digitalplan_list");
        },
        //图片上传成功回调方法
        picSuccess: function (response, file, fileList) {
            if (response) {
                this.$alert('成功保存预案信息', '提示', {
                    type: 'success',
                    confirmButtonText: '确定',
                    callback: action => {
                        loadDiv("digitalplan/digitalplan_list");
                    }
                });
            }
            loadDiv("digitalplan/digitalplan_list");
        },
        //附件移除
        fileRemove: function (file, fileList) {
            var fs = document.getElementsByName('file');
            if (fs.length > 0) {
                fs[0].value = null
            }
            console.log(file, fileList);
            if (file.status == 'success') {
                this.deleteFile.push({
                    uuid: file.uuid,
                    deleteFlag: 'Y',
                    xgrid: this.shiroData.userid,
                    xgrmc: this.shiroData.realName
                });
            }
            this.isFile = false;
        },
        //附件移除（图片）
        picRemove: function (file, fileList) {
            console.log(file, fileList);
            if (file.status == 'success') {
                this.deletePics.push({
                    uuid: file.uuid,
                    deleteFlag: 'Y',
                    xgrid: this.shiroData.userid,
                    xgrmc: this.shiroData.realName
                });
            }
            this.isPic = false;
        },
        handlePreview: function (file) {
            console.log(file);
        },
        handleChange: function (file, fileList) {
            if (fileList.length == 1) {
                const isZip = file.name.toLowerCase().endsWith("zip");
                const isRAR = file.name.toLowerCase().endsWith("rar");
                if (isZip) {
                    this.isFile = true;
                } else {
                    this.$message.warning('仅可上传zip格式压缩文件!');
                    fileList.splice(-1, 1);
                }
            } else if (fileList.length > 1) {
                this.$message.warning('当前限制上传 1 个压缩文件');
                fileList.splice(1, fileList.length - 1);
            }
        },
        PicChange: function (file, fileList) {
            const isPng = file.name.toLowerCase().endsWith("png");
            const isJpg = file.name.toLowerCase().endsWith("jpg");
            if (isPng || isJpg) {
                this.isPic = true;
            } else {
                this.$message.warning('上传图片只能是 png/jpg 格式!');
                fileList.splice(-1, 1);
            }
        },
        //大中队级预案显示模板下载按钮
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
        //大中队级预案模板下载
        templeteDown: function (val) {
            window.open(baseUrl + "/dpapi/yafjxz/downTemplet");
        },
        //取消
        cancel: function () {
            loadDiv("digitalplan/digitalplan_list");
        },
    },

})