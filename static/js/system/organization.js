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
            //的当前选中节点uuid
            currentUuid: '',
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
            pageSize: 5,
            //总记录数
            total: 0,
            //表高度变量
            tableheight: 206,
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
            loading_user: false,
            userVisible: false,
            userEditFlag: false,
            userForm: {
                username: '',
                realname: ''
            },
            userList: [],
            currentPage_user: 1,
            pageSize_user: 5,
            tableheight_user: 243,
            total_user: 0
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
            this.userEditFlag = false;
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
            this.currentUuid = val.uuid;
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
        //当前页修改事件
        currentPageChange: function (val) {
            this.currentPage = val;
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
        //新增组织机构节点
        append(store, data) {
            this.addVisible = true;
            this.addForm.sjjgid = data.uuid;
            if (data.jgid.substr(0, 2) == '01') {
                this.addForm.preparentid = '11';
            } else {
                this.addForm.preparentid = data.jgid.substr(0, 2);
            }
        },
        //移除组织机构节点
        remove(store, data) {
            this.$confirm('确定删除此组织机构?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {
                    uuid: data.uuid,
                    deleteFlag: 'Y',
                    xgrid: this.shiroData.userid,
                    xgrmc: this.shiroData.realName
                }
                axios.post('/api/organization/doDeleteByVO', params).then(function (res) {
                    if (res.data.result > 0) {
                        this.$message.success('删除' + data.jgjc + '成功');
                        this.getJgidData();
                    } else {
                        this.$message.success('删除' + data.jgjc + '失败');
                    }
                }.bind(this), function (error) {
                    console.log(error)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //点击详情编辑按钮
        editDetail: function () {
            this.editFlag = false;
        },
        //保存详情
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
                    this.$message.success('修改成功');
                    this.editFlag = true;
                    this.getJgxqById(params.uuid);
                } else {
                    this.$message.error('修改失败');
                    this.editFlag = true;
                    this.getJgxqById(params.uuid);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
            this.editFlag = true;
        },
        //点击添加用户按钮
        addUsers: function () {
            this.userVisible = true;
            this.userSearch('init');
        },
        //组织机构节点新增保存
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
        //组织机构新增form表单清空
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
        },
        closeAddDialog: function () {
            this.addVisible = false;
            this.addFormClear();
        },
        //移除用户
        removeUser: function (val) {
            var params = {
                pkid: val.pkid,
                organizationId: '',
                alterId: this.shiroData.userid,
                alterName: this.shiroData.realName
            }
            axios.post('/api/user/updateJbxxByVO', params).then(function (res) {
                if (res.data.result > 0) {
                    this.$message.success('移除用户' + val.username + '成功');
                    this.getUserlistByJgid(this.currentUuid);
                } else {
                    this.$message.error('移除用户' + val.username + '失败');
                    this.getUserlistByJgid(this.currentUuid);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //用户添加弹出页-列表查询
        userSearch: function (type) {
            //按钮事件的选择
            if (type == 'page') {
                this.userList = [];
            } else {
                if (type == 'init') {
                    this.userForm.username = '';
                    this.userForm.realname = '';
                }
                this.currentPage_user = 1;
            }
            this.loading_user = true;//表格重新加载
            var params = {
                username: this.userForm.username.replace(/%/g, "\\%"),
                realname: this.userForm.realname.replace(/%/g, "\\%"),
                pageSize: this.pageSize_user,
                pageNum: this.currentPage_user
            }
            axios.post('/api/user/findUsersNoOrg', params).then(function (res) {
                var tableTemp = new Array((this.currentPage_user - 1) * this.pageSize_user);
                this.userList = tableTemp.concat(res.data.result.list);
                this.total_user = res.data.result.total;
                this.loading_user = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //用户添加弹出页-查询条件清空
        userFormClear: function () {
            this.userForm.username = '';
            this.userForm.realname = '';
            this.userSearch('delete');
        },
        //用户添加弹出页-点击添加用户
        selectUser: function (val) {
            var params = {
                pkid: val.pkid,
                organizationId: this.currentUuid,
                alterId: this.shiroData.userid,
                alterName: this.shiroData.realName
            }
            axios.post('/api/user/updateJbxxByVO', params).then(function (res) {
                if (res.data.result > 0) {
                    this.$message.success('添加用户' + val.username + '成功');
                    this.userEditFlag = true;
                    this.userSearch('page');
                } else {
                    this.$message.error('添加用户' + val.username + '失败');
                    this.userSearch('page');
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //
        userFormRefesh: function (val) {
            if (this.userEditFlag == true) {
                this.getUserlistByJgid(this.currentUuid);
            }
        },
        //用户列表翻页事件
        currentPageChange_user: function (val) {
            if (this.currentPage_user != val) {
                this.currentPage_user = val;
                this.userSearch('page');
            }
        },
    }

})