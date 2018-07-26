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
            allXzqhDataTree: [],
            allSsdzDataTree: [],
            role_data: [],
            //搜索表单
            addForm: {
                zbmc: '',
                zbbm: '',
                ssdz: '',
                ssdzmc: '',
                xzqh: '',
                zblx: '',
                sccj: '',
                zcbl: '',
                kysl: '',
                shsl: '',
                zzsl: 0,
                bz: '',
                cjrid: '',
                cjrmc: '',
                xgrid: '',
                xgrmc: '',
                equipengineVOList: []
            },
            engineForm: [{
                clid: '',
                clmc: '',
                clzzs: ''
            }],
            clIndex: '',
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
            ssdzProps: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid'
            },
            //消防车辆弹出页---------------------------------------------------
            engineListVisible: false,
            loading_engine: false,
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 5,
            //总记录数
            total: 0,
            //搜索表单
            searchForm: {
                clmc: '',
                cphm: ''
            },
            tableData: [],
            //表高度变量
            tableheight: 243,
        }
    },
    created: function () {
        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("装备器材", "装备器材新增");
        } else if (type == "BJ") {
            loadBreadcrumb("装备器材", "装备器材编辑");
        }
        this.status = getQueryString("ID");
        this.getAllTypesDataTree();//装备类型级联选择数据
        this.getAllXzqhDataTree();//行政区划
        // this.getAllSsdzDataTree();
        this.roleData();
    },
    mounted: function () {

        // this.searchClick();
    },
    methods: {
        //车辆+
        addDomain: function () {
            this.engineForm.push({
                clid: '',
                clmc: '',
                clzzs: ''
            });
        },
        //车辆-
        removeDomain: function (item) {
            var index = this.engineForm.indexOf(item)
            if (index !== -1) {
                this.engineForm.splice(index, 1)
            }
        },
        //消防车辆弹出页---------------------------------------------------------------
        engineList: function (val) {
            this.clIndex = val;
            this.engineListVisible = true;
            this.loading_engine = true;
            var params = {
                clmc: this.searchForm.clmc,
                cphm: this.searchForm.cphm
            };
            axios.post('/dpapi/fireengine/list', params).then(function (res) {
                this.tableData = res.data.result;
                this.total = res.data.result.length;
                this.loading_engine = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //当前页修改事件
        currentPageChange: function (val) {
            this.currentPage = val;
            // console.log("当前页: " + val);
            var _self = this;
            _self.loadingData(); //重新加载数据
        },
        //表格重新加载数据
        loadingData: function () {
            var _self = this;
            _self.loading_engine = true;
            setTimeout(function () {
                console.info("加载数据成功");
                _self.loading_engine = false;
            }, 300);
        },
        //选择车辆，返回车辆名称和id
        selectRow: function (val) {
            var index = this.clIndex;
            this.engineForm[index].clid = val.uuid
            this.engineForm[index].clmc = val.clmc
            this.engineListVisible = false;
        },
        //车辆查询条件清空
        clearEngineList: function (val) {
            this.searchForm.clmc = "";
            this.searchForm.cphm = "";
        },

        //当前登录用户信息
        roleData: function () {
            axios.post('/api/shiro').then(function (res) {
                this.role_data = res.data;
                this.getAllSsdzDataTree();
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
                axios.get('/dpapi/firedrug/' + this.status).then(function (res) {
                    this.addForm = res.data.result;
                    //药剂类型格式化
                    if (this.addForm.yjlx.endsWith("000000")) {
                        var yjlx = this.addForm.yjlx;
                        this.addForm.yjlx = [];
                        this.addForm.yjlx.push(yjlx);
                    } else if (this.addForm.yjlx.endsWith("0000")) {
                        var yjlx1 = this.addForm.yjlx.substring(0, 2) + '000000';
                        var yjlx2 = this.addForm.yjlx;
                        this.addForm.yjlx = [];
                        this.addForm.yjlx.push(yjlx1, yjlx2);
                    } else if (this.addForm.yjlx.endsWith("00")) {
                        var yjlx1 = this.addForm.yjlx.substring(0, 2) + '000000';
                        var yjlx2 = this.addForm.yjlx.substring(0, 4) + '0000';
                        var yjlx3 = this.addForm.yjlx;
                        this.addForm.yjlx = [];
                        this.addForm.yjlx.push(yjlx1, yjlx2, yjlx3);
                    }
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //装备类型级联选择数据
        getAllTypesDataTree: function () {
            var params = {
                codetype: "ZBQCLX",
                list: [1, 2, 4, 6, 8]
            };
            axios.post('/api/codelist/getCodelisttree2', params).then(function (res) {
                this.allTypesDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //行政区划级联选择数据
        getAllXzqhDataTree: function () {
            axios.get('/api/codelist/getXzqhTreeByUser').then(function (res) {
                this.allXzqhDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //所属队站级联选择器数据
        getAllSsdzDataTree: function () {
            var organization = this.role_data.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUser', param).then(function (res) {
                this.allSsdzDataTree = res.data.result;
                this.searchClick();
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        // kyslChange: function (value) {
        //     this.addForm.zcbl = value + this.addForm.shsl;
        // },
        // shslChange: function (value) {
        //     this.addForm.zcbl = value + this.addForm.kysl;
        // },
        // zzslChange: function (value) {
        //     for (var i in this.engineForm) {
        //         this.addForm.zzsl = this.addForm.zzsl + this.engineForm[i].clzzs;
        //     }
        // },
        checkForm: function () {
            if (this.addForm.zbmc == '' || this.addForm == null) {
                this.$message.warning({
                    message: '请输入装备名称',
                    showClose: true
                });
                return false;
            }
            for (var i in this.engineForm) {
                if (this.engineForm[i].clid == '' && this.engineForm[i].clzzs == 0) {
                    this.removeDomain(this.engineForm[i]);
                    return true;
                } else if (this.engineForm[i].clid == '' && this.engineForm[i].clzzs > 0) {
                    this.$message.warning({
                        message: '请选择消防车辆',
                        showClose: true
                    });
                    return false;
                }
            }
            return true;
        },
        //保存
        save: function () {
            if (this.checkForm() == true) {
                if (this.status == 0) {//新增
                    this.addForm.cjrid = this.role_data.userid;
                    this.addForm.cjrmc = this.role_data.realName;
                    this.addForm.scsj = dateFormat(new Date(this.addForm.scsj));
                    for (var i in this.engineForm) {
                        this.addForm.zzsl = parseInt(this.addForm.zzsl) + parseInt(this.engineForm[i].clzzs);
                    }
                    this.addForm.zcbl = parseInt(this.addForm.kysl) + parseInt(this.addForm.shsl) + parseInt(this.addForm.zzsl);
                    if (this.addForm.zblx.length > 0) {
                        this.addForm.zblx = this.addForm.zblx[this.addForm.zblx.length - 1];
                    }
                    if (this.addForm.xzqh.length > 0) {
                        this.addForm.xzqh = this.addForm.xzqh[this.addForm.xzqh.length - 1];
                    }
                    if (this.addForm.ssdz.length > 0) {
                        this.addForm.ssdz = this.addForm.ssdz[this.addForm.ssdz.length - 1];
                    }
                    this.addForm.equipengineVOList = this.engineForm;
                    axios.post('/dpapi/equipmentsource/insertByVO', this.addForm).then(function (res) {
                        if (res.data.result.uuid != null && res.data.result.uuid != '') {
                            this.$alert('保存成功', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/equipment_list");
                                }
                            });
                        } else {
                            this.$alert('保存失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/equipment_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {//修改
                    this.addForm.xgrid = this.role_data.userid;
                    this.addForm.xgrmc = this.role_data.realName;
                    this.addForm.scsj = dateFormat(new Date(this.addForm.scsj));
                    this.addForm.yjlx = this.addForm.yjlx[this.addForm.yjlx.length - 1];
                    axios.post('/dpapi/firedrug/doUpdateDrug', this.addForm).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功修改' + res.data.result + '条消防药剂信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/equipment_list");
                                }
                            });
                        } else {
                            this.$alert('修改失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/equipment_list");
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
            loadDiv("basicinfo/equipment_list");
        }
    },

})