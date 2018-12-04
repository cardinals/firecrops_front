//axios默认设置cookie
axios.defaults.withCredentials = true;
var vm = new Vue({
    el: '#app',

    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },

    data: function () {
        return {
            filterText: '',
            //搜索表单
            searchForm: {
                jgsearch: "",
            },
            //机构树数据
            tableData: [],
            //用户列表数据：
            userData: [],
            JGXZ_data: [],
            XZQH_data: [],
            editFlag: true,
            //机构详情数据
            detailData: {
                preparentid: '',
                jgid: '',
                jgmc: '',
                jgjc: '',
                jgxzdm: [],
                jgdz: '',
                jgms: '',
                xzqh: [],
                czhm: '',
                lxr: '',
                lxdh: '',
                xqmj: '',
                xqfw: ''
            },
            editFormRules: {
                jgmc: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
                jgjc: [{ required: true, message: '请输入机构简称', trigger: 'blur' }],
                jgid: [{ required: true, message: '请输入机构编码', trigger: 'blur' }, { pattern: /^[A-Za-z0-9 ]+$/, message: '机构编码应为数字或字母', trigger: 'blur' }],
                jgxzdm: [{
                    validator: (rule, value, callback) => {
                        if (value == "" || value == null) {
                            callback(new Error("请选择机构性质"));
                        } else {
                            callback();
                        }
                    }, trigger: 'change'
                }],
                // xzqh: [{
                //     validator: (rule, value, callback) => {
                //         if (value == "" || value == null) {
                //             callback(new Error("请选择行政区划"));
                //         } else {
                //             callback();
                //         }
                //     }, trigger: 'change'
                // }],
            },
            jgidprops: {
                label: 'jgjc',
                children: 'children'
            },
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 10,
            //总记录数
            total: 0,
            //表高度变量
            tableheight: 185,
            addVisible: false,
            addForm: {
                sjjgid: '',
                preparentid: '',
                jgid: '',
                jgmc: '',
                jgjc: '',
                jgxzdm: '',
                jgdz: '',
                jgms: '',
                xzqh: '',
                czhm: '',
                lxr: '',
                lxdh: '',
                xqmj: '',
                xqfw: ''
            },
            addFormRules: {
                jgmc: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
                jgjc: [{ required: true, message: '请输入机构简称', trigger: 'blur' }],
                jgid: [{ required: true, message: '请输入机构编码', trigger: 'blur' }, { pattern: /^[A-Za-z0-9 ]+$/, message: '机构编码应为数字或字母', trigger: 'blur' }],
                jgxzdm: [{
                    validator: (rule, value, callback) => {
                        if (value == "" || value == null) {
                            callback(new Error("请选择机构性质"));
                        } else {
                            callback();
                        }
                    }, trigger: 'change'
                }],
                // xzqh: [{
                //     validator: (rule, value, callback) => {
                //         if (value == "" || value == null) {
                //             callback(new Error("请选择行政区划"));
                //         } else {
                //             callback();
                //         }
                //     }, trigger: 'change'
                // }],
            },
        };
    },

    created: function () {
        /**菜单选中 by li.xue 20180628*/
        // $("#activeIndex").val(getQueryString("index"));
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("组织机构管理", "-1");
        this.shiroData = shiroGlobal;
        this.getJgidData();
        this.JGXZ();
        this.XZQH();
    },
    mounted: function () {

    },

    methods: {
        //过滤输入框
        filterNode(value, tableData) {
            if (!value) return true;
            return tableData.jgjc.indexOf(value) !== -1;
        },
        //获取所有机构
        getJgidData: function () {
            axios.post('/api/organization/getOrganizationtree').then(function (res) {
                this.tableData = res.data.result;
                //获取节点详情
                this.getJgxqById("eb09df352cda4902b24c54dd2b2ce656");
                //获取组织机构下的用户列表
                this.getUserlistByJgid("eb09df352cda4902b24c54dd2b2ce656");
            }.bind(this), function (error) {
                console.log(error);
            });
        },
        //组织机构详情
        getJgxqById: function (jgid) {
            this.editFlag = true;
            axios.get('/api/organization/doFindById/' + jgid).then(function (res) {
                this.detailData = res.data.result;
                //机构性质格式化
                var jgxzArray = [];
                if (this.detailData.jgxzdm != null && this.detailData.jgxzdm != "") {
                    if (this.detailData.jgxzdm.substr(2) != "00") {
                        jgxzArray.push(this.detailData.jgxzdm.substr(0, 2) + "00");
                    }
                }
                jgxzArray.push(this.detailData.jgxzdm);
                this.detailData.jgxzdm = jgxzArray;
                //行政区划格式化
                var xzqhArray = [];
                if (this.detailData.xzqh != null && this.detailData.xzqh != "" && this.detailData.xzqh.substr(2, 4) != "0000") {
                    xzqhArray.push(this.detailData.xzqh.substr(0, 2) + "0000");
                    if (this.detailData.xzqh.substr(4, 2) != "00") {
                        xzqhArray.push(this.detailData.xzqh.substr(0, 4) + "00");
                    }
                }
                xzqhArray.push(this.detailData.xzqh);
                this.detailData.xzqh = xzqhArray;
                this.detailData.preparentid = this.detailData.jgid.substr(0, 2);
                this.detailData.jgid = this.detailData.jgid.substr(2);
            }.bind(this), function (error) {
                console.log(error);
            });
        },
        //组织机构下的用户
        getUserlistByJgid: function (jgid) {
            axios.get('/api/user/findByJGID/' + jgid).then(function (res) {
                this.userData = res.data.result;
                this.total = res.data.result.length;
            }.bind(this), function (error) {
                console.log(error);
            });
        },
        //获取节点
        currentNodeChange: function (val) {
            //获取节点详情
            this.getJgxqById(val.uuid);
            //获取组织机构下的用户列表
            this.getUserlistByJgid(val.uuid);
        },
        //根据参数部分和参数名来获取参数值 
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        //机构性质
        JGXZ: function () {
            axios.get('/api/codelist/getDzlxTree/JGXZ').then(function (res) {
                this.JGXZ_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //行政区划
        XZQH: function () {
            axios.get('/api/codelist/getXzqhTreeByUser').then(function (res) {
                this.XZQH_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //分页大小修改事件
        pageSizeChange: function (val) {
            this.pageSize = val;
            var _self = this;
            _self.loadingData(); //重新加载数据
        },
        //当前页修改事件
        currentPageChange: function (val) {
            this.currentPage = val;
            var _self = this;
            _self.loadingData(); //重新加载数据
        },
        //表格查询事件
        searchClick: function () {
            var _self = this;
            if (this.searchForm.createTimeBegin != "" && this.searchForm.createTimeEnd != "" && this.searchForm.createTimeBegin > this.searchForm.createTimeEnd) {
                _self.$message({
                    message: "时间选择错误！",
                    type: "error"
                });
                return;
            }
            // this.loading = true;//表格重新加载
            var params = {
                jgsearch: this.searchForm.jgsearch
            }
            axios.post('/api/organization/findByVO', params).then(function (res) {
                this.tableData = res.data.result;
                for (var i = 0; i < this.tableData.length; i++) {
                    //预案类型转码
                    for (var k = 0; k < this.yalxdmData.length; k++) {
                        if (this.yalxdmData[k].codeValue == this.tableData[i].yalxdm) {
                            this.tableData[i].yalxdm = this.yalxdmData[k].codeName;
                        }
                    }

                }
                _self.total = _self.tableData.length;
                this.loading = false;
            }.bind(this), function (error) {
                console.log("failed")
            })
        },
        //左侧树显示的label
        renderContent(createElement, { node, data, store }) {
            // if (data.type == '1') {
            return createElement(
                'span',
                {},
                [
                    createElement('span', {}, [createElement('span', node.label)]),
                    createElement('span', {}, [
                        createElement('el-button', {
                            style: { 'font-size': ' 14px', 'float': 'right', 'margin-right': '10px' },
                            attrs: { 'type': 'text' },
                            on: { click: function () { vm.remove(store, data); } },
                            domProps: { innerHTML: '-' }
                        }),
                        createElement('el-button', {
                            style: { 'font-size': ' 14px', 'float': 'right', 'margin-right': '20px' },
                            attrs: { 'type': 'text' },
                            on: { click: function () { vm.append(store, data); } },
                            domProps: { innerHTML: '+' }
                        })
                    ])
                ]
            );
            // } 
        },
        //新增
        append(store, data) {
            this.addVisible = true;
            this.addForm.sjjgid = data.uuid;
            if (data.jgid.substr(0, 2) == '01') {
                this.addForm.preparentid = '11';
            } else {
                this.addForm.preparentid = data.jgid.substr(0, 2);
            }
        },
        editDetail: function () {
            this.editFlag = false;
        },
        saveDetail: function () {
            var params = {
                uuid: this.detailData.uuid,
                jgmc: this.detailData.jgmc,
                jgjc: this.detailData.jgjc,
                jgxzdm: this.detailData.jgxzdm[this.detailData.jgxzdm.length - 1],
                jgid: this.detailData.preparentid + this.detailData.jgid,
                jgdz: this.detailData.jgdz,
                jgms: this.detailData.jgms,
                xzqh: this.detailData.xzqh[this.detailData.xzqh.length - 1],
                czhm: this.detailData.czhm,
                lxr: this.detailData.lxr,
                lxdh: this.detailData.lxdh,
                xqmj: this.detailData.xqmj,
                xqfw: this.detailData.xqfw,
                xgrid: this.shiroData.userid,
                xgrmc: this.shiroData.realName
            }
            axios.post('/api/organization/doUpdateByVO', params).then(function (res) {
                if (res.data.result > 0) {
                    this.$alert('修改成功', '提示', {
                        type: 'success',
                        confirmButtonText: '确定',
                        callback: action => {
                            this.editFlag = true;
                            this.getJgxqById(params.uuid);
                        }
                    });
                } else {
                    this.$alert('修改失败', '提示', {
                        type: 'error',
                        confirmButtonText: '确定',
                        callback: action => {
                            this.editFlag = true;
                            this.getJgxqById(params.uuid);
                        }
                    });
                }
            }.bind(this), function (error) {
                console.log(error);
            })
            this.editFlag = true;
        },
        addUsers: function () {
        },
        closeDialog: function () {
            this.addVisible = false;
            this.addFormClear();
        },
        addSubmit: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var params = {
                        sjjgid: this.addForm.sjjgid,
                        jgid: this.addForm.preparentid + this.addForm.jgid,
                        jgmc: this.addForm.jgmc,
                        jgjc: this.addForm.jgjc,
                        jgxzdm: this.addForm.jgxzdm[this.addForm.jgxzdm.length - 1],
                        jgdz: this.addForm.jgdz,
                        jgms: this.addForm.jgms,
                        xzqh: this.addForm.xzqh[this.addForm.xzqh.length - 1],
                        czhm: this.addForm.czhm,
                        lxr: this.addForm.lxr,
                        lxdh: this.addForm.lxdh,
                        xqmj: this.addForm.xqmj,
                        xqfw: this.addForm.xqfw,
                        cjrid: this.shiroData.userid,
                        cjrmc: this.shiroData.realName
                    }
                    axios.post('/api/organization/insertByVO', params).then(function (res) {
                        if (res.data.result > 0) {
                            this.$alert('保存成功', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.addVisible = false;
                                    this.getJgidData();
                                    this.addFormClear();
                                }
                            });
                        } else {
                            this.$alert('保存失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.addVisible = false;
                                    this.addFormClear();
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {
                    console.log('error save!!');
                    return false;
                }
            });
        },
        addFormClear: function () {
            this.addForm.sjjgid = '';
            this.addForm.preparentid = '';
            this.addForm.jgid = '';
            this.addForm.jgmc = '';
            this.addForm.jgjc = '';
            this.addForm.jgxzdm = [];
            this.addForm.jgdz = '';
            this.addForm.jgms = '';
            this.addForm.xzqh = [];
            this.addForm.czhm = '';
            this.addForm.lxr = '';
            this.addForm.lxdh = '';
            this.addForm.xqmj = '';
            this.addForm.xqfw = '';
        }
    }

})