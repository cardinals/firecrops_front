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
            allYjlxDataTree: [],
            allXzqhDataTree: [],
            allSsdzDataTree: [],
            shiroData: [],
            //搜索表单
            addForm: {
                yjmc: "",
                yjbm: "",
                yjlx: [],
                sccj: "",
                pc: "",
                zcbl: '',
                czl: '',
                kcl: '',
                scsj: "",
                hhb: "",
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: "",
                xzqh: [],
                ssdz: [],
                ssdzmc: '',
                bz: '',
                jdh: ''
            },
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
        }
    },
    created: function () {
        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("消防药剂管理", "消防药剂管理新增");
        } else if (type == "BJ") {
            loadBreadcrumb("消防药剂管理", "消防药剂管理编辑");
        }
        this.status = getQueryString("ID");
        this.shiroData = shiroGlobal;
        this.getAllSsdzDataTree();
        this.getAllYjlxDataTree();
        this.getAllXzqhDataTree();

    },
    mounted: function () {
        // this.searchClick();
    },
    methods: {
        //表格查询事件
        searchClick: function () {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                axios.get('/dpapi/firedrug/' + this.status).then(function (res) {
                    this.addForm = res.data.result;
                    //药剂类型格式化
                    var yjlxArray = [];
                    if (this.addForm.yjlx != null && this.addForm.yjlx != "" && !this.addForm.yjlx.endsWith("000000")) {
                        yjlxArray.push(this.addForm.yjlx.substr(0, 2) + '000000');
                        if (!this.addForm.yjlx.endsWith("0000")) {
                            yjlxArray.push(this.addForm.yjlx.substr(0, 4) + '0000');
                        }
                    }
                    yjlxArray.push(this.addForm.yjlx);
                    this.addForm.yjlx = yjlxArray;

                    //行政区划格式化
                    var xzqhArray = [];
                    if (this.addForm.xzqh != null && this.addForm.xzqh != "" && this.addForm.xzqh.substr(2, 4) != "0000") {
                        xzqhArray.push(this.addForm.xzqh.substr(0, 2) + "0000");
                        if (this.addForm.xzqh.substr(4, 2) != "00") {
                            xzqhArray.push(this.addForm.xzqh.substr(0, 4) + "00");
                        }
                    }
                    xzqhArray.push(this.addForm.xzqh);
                    this.addForm.xzqh = xzqhArray;

                    //所属队站格式化
                    var sjdzArray = [];
                    var temp = this.addForm.ssdz;
                    for (var i in this.allSsdzDataTree) {
                        if (temp == this.allSsdzDataTree[i].dzid) {
                            sjdzArray.push(this.allSsdzDataTree[i].dzid);
                        } else {
                            for (var j in this.allSsdzDataTree[i].children) {
                                if (temp == this.allSsdzDataTree[i].children[j].dzid) {
                                    sjdzArray.push(this.allSsdzDataTree[i].dzid, this.allSsdzDataTree[i].children[j].dzid);
                                } else {
                                    for (var k in this.allSsdzDataTree[i].children[j].children) {
                                        if (temp == this.allSsdzDataTree[i].children[j].children[k].dzid) {
                                            sjdzArray.push(this.allSsdzDataTree[i].dzid, this.allSsdzDataTree[i].children[j].dzid, this.allSsdzDataTree[i].children[j].children[k].dzid);
                                        } else {
                                            for (var n in this.allSsdzDataTree[i].children[j].children[k].children) {
                                                if (temp == this.allSsdzDataTree[i].children[j].children[k].children[n].dzid) {
                                                    sjdzArray.push(this.allSsdzDataTree[i].dzid, this.allSsdzDataTree[i].children[j].dzid, this.allSsdzDataTree[i].children[j].children[k].dzid, this.allSsdzDataTree[i].children[j].children[k].children[n].dzid);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.addForm.ssdz = sjdzArray;

                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //药剂类型级联选择器数据
        getAllYjlxDataTree: function () {
            axios.post('/api/codelist/getYjlxTree/YJLX').then(function (res) {
                this.allYjlxDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //行政区划级联选择器数据
        getAllXzqhDataTree: function () {
            axios.get('/api/codelist/getXzqhTreeByUser').then(function (res) {
                this.allXzqhDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //所属队站级联选择器数据
        getAllSsdzDataTree: function () {
            var organization = this.shiroData.organizationVO;
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
        czlChange: function (value) {
            this.addForm.zcbl = parseFloat(value) + parseFloat(this.addForm.kcl);
        },
        kclChange: function (value) {
            this.addForm.zcbl = parseFloat(value) + parseFloat(this.addForm.czl);
        },
        
        //保存
        save: function (formName) {
            if (this.addForm.yjmc == "" || this.addForm == null) {
                this.$message.warning({
                    message: '请输入药剂名称',
                    showClose: true
                });
            } else {
                if (this.status == 0) {//新增
                    var params = {
                        yjmc: this.addForm.yjmc,
                        yjbm: this.addForm.yjbm,
                        yjlx: this.addForm.yjlx[this.addForm.yjlx.length - 1],
                        sccj: this.addForm.sccj,
                        pc: this.addForm.pc,
                        zcbl: this.addForm.zcbl,
                        czl: this.addForm.czl,
                        kcl: this.addForm.kcl,
                        scsj: this.addForm.scsj,
                        hhb: this.addForm.hhb,
                        xzqh: this.addForm.xzqh[this.addForm.xzqh.length - 1],
                        ssdz: this.addForm.ssdz[this.addForm.ssdz.length - 1],
                        ssdzmc: this.addForm.ssdzmc,
                        bz: this.addForm.bz,
                        jdh: this.shiroData.organizationVO.jgid,
                        cjrid: this.shiroData.userid,
                        cjrmc: this.shiroData.realName
                    }
                    axios.post('/dpapi/firedrug/insertByVO', params).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功保存' + res.data.result + '条消防药剂信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        } else {
                            this.$alert('保存失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {//修改
                    var params = {
                        yjmc: this.addForm.yjmc,
                        yjbm: this.addForm.yjbm,
                        yjlx: this.addForm.yjlx[this.addForm.yjlx.length - 1],
                        sccj: this.addForm.sccj,
                        pc: this.addForm.pc,
                        zcbl: this.addForm.zcbl,
                        czl: this.addForm.czl,
                        kcl: this.addForm.kcl,
                        scsj: this.addForm.scsj,
                        hhb: this.addForm.hhb,
                        xzqh: this.addForm.xzqh[this.addForm.xzqh.length - 1],
                        ssdz: this.addForm.ssdz[this.addForm.ssdz.length - 1],
                        ssdzmc: this.addForm.ssdzmc,
                        bz: this.addForm.bz,
                        jdh: this.shiroData.organizationVO.jgid,
                        xgrid: this.shiroData.userid,
                        xgrmc: this.shiroData.realName
                    }
                    axios.post('/dpapi/firedrug/doUpdateDrug', params).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功修改' + res.data.result + '条消防药剂信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        } else {
                            this.$alert('修改失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
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
            loadDiv("basicinfo/firedrug_list");
        }
    },

})