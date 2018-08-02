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
                bz: '',
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
            loadBreadcrumb("装备器材管理", "装备器材管理新增");
        } else if (type == "BJ") {
            loadBreadcrumb("装备器材管理", "装备器材管理编辑");
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
        engineList: function (type,val) {
            if(type == 'page'){
                this.tableData = [];
            }else{
                this.currentPage = 1;
            }
            this.clIndex = val;
            this.engineListVisible = true;
            this.loading_engine = true;
            
            var params = {
                clmc: this.searchForm.clmc,
                cphm: this.searchForm.cphm,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            axios.post('/dpapi/fireengine/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading_engine = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //车辆弹出页翻页
        currentPageChange: function(val) {
            if(this.currentPage != val){
                this.currentPage = val;
                this.engineList('page');
            }
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
            this.engineList('reset',this.clIndex);
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
                axios.get('/dpapi/equipmentsource/' + this.status).then(function (res) {
                    this.addForm = res.data.result;
                    //装备类型格式化
                    if (this.addForm.zblx != '' && this.addForm.zblx != null) {
                        if (this.addForm.zblx.endsWith("0000000")) {
                            var zblx = this.addForm.zblx;
                            this.addForm.zblx = [];
                            this.addForm.zblx.push(zblx);
                        } else if (this.addForm.zblx.endsWith("000000")) {
                            var zblx1 = this.addForm.zblx.substring(0, 1) + '0000000';
                            var zblx2 = this.addForm.zblx;
                            this.addForm.zblx = [];
                            this.addForm.zblx.push(zblx1, zblx2);
                        } else if (this.addForm.zblx.endsWith("0000")) {
                            var zblx1 = this.addForm.zblx.substring(0, 1) + '0000000';
                            var zblx2 = this.addForm.zblx.substring(0, 2) + '000000';
                            var zblx3 = this.addForm.zblx;
                            this.addForm.zblx = [];
                            this.addForm.zblx.push(zblx1, zblx2, zblx3);
                        } else if (this.addForm.zblx.endsWith("00")) {
                            var zblx1 = this.addForm.zblx.substring(0, 1) + '0000000';
                            var zblx2 = this.addForm.zblx.substring(0, 2) + '000000';
                            var zblx3 = this.addForm.zblx.substring(0, 4) + '0000';
                            var zblx4 = this.addForm.zblx;
                            this.addForm.zblx = [];
                            this.addForm.zblx.push(zblx1, zblx2, zblx3, zblx4);
                        }
                    } else {
                        this.addForm.zblx = [];
                    }
                    //行政区划格式化
                    if (this.addForm.xzqh != '' && this.addForm.xzqh != null) {
                        if (this.addForm.xzqh.endsWith("0000")) {
                            var xzqh = this.addForm.xzqh;
                            this.addForm.xzqh = [];
                            this.addForm.xzqh.push(xzqh);
                        } else if (this.addForm.xzqh.endsWith("00")) {
                            var xzqh1 = this.addForm.xzqh.substring(0, 2) + '0000';
                            var xzqh2 = this.addForm.xzqh;
                            this.addForm.xzqh = [];
                            this.addForm.xzqh.push(xzqh1, xzqh2);
                        } else {
                            var xzqh1 = this.addForm.xzqh.substring(0, 2) + '0000';
                            var xzqh2 = this.addForm.xzqh.substring(0, 4) + '00';
                            var xzqh3 = this.addForm.xzqh;
                            this.addForm.xzqh = [];
                            this.addForm.xzqh.push(xzqh1, xzqh2, xzqh3);
                        }
                    } else {
                        this.addForm.xzqh = [];
                    }
                    //所属队站格式化
                    if (this.addForm.ssdz != '' && this.addForm.ssdz != null) {
                        for (var i in this.allSsdzDataTree) {
                            if (this.allSsdzDataTree[i].dzid == this.addForm.ssdz) {
                                var ssdz = this.addForm.ssdz;
                                this.addForm.ssdz = [];
                                this.addForm.ssdz.push(ssdz);
                                break;
                            } else {
                                for (var k in this.allSsdzDataTree[i].children) {
                                    if (this.allSsdzDataTree[i].children[k].dzid == this.addForm.ssdz) {
                                        var ssdz1 = this.allSsdzDataTree[i].dzid;
                                        var ssdz2 = this.allSsdzDataTree[i].children[k].dzid;
                                        this.addForm.ssdz = [];
                                        this.addForm.ssdz.push(ssdz1, ssdz2);
                                        break;
                                    } else {
                                        for (var j in this.allSsdzDataTree[i].children[k].children) {
                                            if (this.allSsdzDataTree[i].children[k].children[j].dzid == this.addForm.ssdz) {
                                                var ssdz1 = this.allSsdzDataTree[i].dzid;
                                                var ssdz2 = this.allSsdzDataTree[i].children[k].dzid;
                                                var ssdz3 = this.allSsdzDataTree[i].children[k].children[j].dzid;
                                                this.addForm.ssdz = [];
                                                this.addForm.ssdz.push(ssdz1, ssdz2, ssdz3);
                                                break;
                                            } else {
                                                for (var s in this.allSsdzDataTree[i].children[k].children[j].children) {
                                                    if (this.allSsdzDataTree[i].children[k].children[j].children[s].dzid == this.addForm.ssdz) {
                                                        var ssdz1 = this.allSsdzDataTree[i].dzid;
                                                        var ssdz2 = this.allSsdzDataTree[i].children[k].dzid;
                                                        var ssdz3 = this.allSsdzDataTree[i].children[k].children[j].dzid;
                                                        var ssdz4 = this.allSsdzDataTree[i].children[k].children[j].children[s].dzid;
                                                        this.addForm.ssdz = [];
                                                        this.addForm.ssdz.push(ssdz1, ssdz2, ssdz3, ssdz4);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        this.addForm.xzqh = [];
                    }
                    var params = {
                        zbid: this.addForm.uuid
                    };
                    axios.post('/dpapi/equipengine/list', params).then(function (res) {
                        this.engineForm = res.data.result;
                        if (this.engineForm == '' || this.engineForm == null) {
                            this.addDomain();
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

        //保存前校验
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
                    this.addForm.zzsl = 0;
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
                    axios.post('/dpapi/equipmentsource/doUpdateEquipment', this.addForm).then(function (res) {
                        if (res.data.result != null && res.data.result != '') {
                            this.$alert('修改成功', '提示', {
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