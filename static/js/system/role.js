//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            tableheight: 441,//表高度变量
            //角色下拉框
            allRoles: [],
            //查询表单
            searchForm: {
                rolename: '',
                roleinfo: '',
                createTime: new Array()
            },
            //表数据
            tableData: [],
            //后台返回全部资源列表
            allResourceList: [],
            defaultKeys: ['17'],

            //删除成功后台返回数据
            delStatus: "success",
            //显示加载中样
            loading: false,
            labelPosition: 'right',
            //多选值
            multipleSelection: [],
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 10,
            //总记录数
            total: 0,
            //序号
            indexData: 0,
            //资源列表是否显示
            resourceVisible: false,
            //删除的弹出框
            deleteVisible: false,
            //新建页面是否显示
            addFormVisible: false,
            addLoading: false,
            addFormRules: {
                rolename: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
                roleinfo: [{ required: true, message: "请输入角色描述", trigger: "blur" }]
            },
            //新建数据
            addForm: {
                rolename: "",
                roleinfo: "",
                resource: []
            },
            //选中的序号
            selectIndex: -1,
            //修改界面是否显示
            editFormVisible: false,
            editLoading: false,
            editFormRules: {
                rolename: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
            },
            //修改界面数据
            editForm: {
                rolename: "",
                roleinfo: "",
                resource: []
            },
            //树状选中状态
            defaultCheckKeys: [],

            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'resourceinfo'
            },

            //角色对应资源
            resourceList: [],

            //新修改页面的复选树
            checkprops: {
                label: 'name',
                children: 'zones'
            },
            count: 1,

        }
    },
    created: function () {
        /**菜单选中 by li.xue 20180628*/
		//$("#activeIndex").val(getQueryString("index"));
		/**面包屑 by li.xue 20180628*/
        loadBreadcrumb("角色管理", "-1");
        this.getAllRoles();
        this.searchClick('click');
    },
    methods: {
        //所有的角色列表
        getAllRoles: function() {
            axios.get('/api/role/getAll').then(function (res) {
                this.allRoles = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        getAllResources: function () {
            axios.get('/api/resource/getAll').then(function (res) {
                this.allResourceList = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //日期控件变化时格式化
        dateChange(val) {
            this.searchForm.createTime.splice(0,this.searchForm.createTime.length);
            this.searchForm.createTime.push(val.substring(0,val.indexOf("至")));
            this.searchForm.createTime.push(val.substring(val.indexOf("至")+1));
        },
        
        //查询，初始化
        searchClick: function(type) {
            //按钮事件的选择
            if(type == 'page'){
                this.tableData = [];
            }else{
                this.currentPage = 1;
            }
            var _self = this;
            _self.loading = true;//表格重新加载
            var params = {
                rolename: this.searchForm.rolename,
                roleinfo: this.searchForm.roleinfo,
                createTimeBegin: this.searchForm.createTime[0],
                createTimeEnd: this.searchForm.createTime[1],
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            axios.post('/api/role/findByVO', params).then(function (res) {
                this.tableData = res.data.result;
                this.total = res.data.result.length;
                _self.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //资源详情
        resourceDetails: function (id) {
            var _self = this;
            _self.resourceVisible = true;
            axios.get('/api/resource/getResource/' + id).then(function (res) {
                this.resourceList = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })

        },

        handleNodeClick(data) {
        },

        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.rolename = "",
            this.searchForm.roleinfo = "",
            this.searchForm.createTime = new Array(),
            this.searchClick('reset');
        },

        //新建：弹出Dialog
        addClick: function () {
            var _self = this;
            _self.addFormVisible = true;
            this.getAllResources();
        },
        //新建：提交
        addSubmit: function (val) {
            var _self = this;
            axios.get('/api/role/getNum/' + this.addForm.rolename).then(function (res) {
                if (res.data.result != 0) {
                    _self.$message({
                        message: "角色名已存在!",
                        type: "error"
                    });
                } else {
                    val.resource = this.$refs.tree.getCheckedNodes();
                    var params = {
                        rolename: val.rolename,
                        roleinfo: val.roleinfo,
                        resources: val.resource
                    }
                    axios.post('/api/role/insertByVO', params).then(function (res) {
                        var addData = res.data.result;
                        addData.createTime = new Date();
                        _self.tableData.unshift(addData);
                        _self.total = _self.tableData.length;
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                    this.addFormVisible = false;
                    loadingData();//重新加载数据
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //删除：批量删除
        removeSelection: function () {
            var _self = this;
            var multipleSelection = this.multipleSelection;
            if (multipleSelection.length < 1) {
                _self.$message({
                    message: "请至少选中一条记录",
                    type: "error"
                });
                return;
            }
            var ids = [];
            for (var i = 0; i < multipleSelection.length; i++) {
                var row = multipleSelection[i];
                ids.push(row.roleid);
            }
            this.$confirm("确认删除吗？", "提示", { type: "warning" })
                .then(function () {
                    var params = {
                        ids: ids
                    }
                    axios.post('/api/role/deleteByIds', params).then(function (res) {
                        for (var d = 0; d < ids.length; d++) {
                            for (var k = 0; k < _self.tableData.length; k++) {
                                if (_self.tableData[k].roleid == ids[d]) {
                                    _self.tableData.splice(k, 1);
                                }
                            }
                        }
                        _self.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        _self.total = _self.tableData.length;
                        loadingData(); //重新加载数据
                    }.bind(this), function (error) {
                        console.log(error)
                    })

                })
                .catch(function (e) {
                    if (e != "cancel") console.log("出现错误：" + e);
                });
        },

        //修改：弹出Dialog
        editClick: function (val) {
            var _self = this;
            var roleid = val.roleid;
            axios.get('/api/resource/getChildren/' + roleid).then(function (res) {
                this.defaultCheckKeys = res.data.result;
                //获取选择的行号
                for (var k = 0; k < _self.tableData.length; k++) {
                    if (_self.tableData[k].roleid == roleid) {
                        _self.selectIndex = k;
                    }
                }

                //直接从table中取值放在form表单中
                this.editForm = Object.assign({}, _self.tableData[_self.selectIndex]);
                this.getAllResources();
            }.bind(this), function (error) {
                console.log(error)
            })
            this.editFormVisible = true;
        },

        //修改：保存按钮
        editSubmit: function (val) {
            val.resource = this.$refs.tree.getCheckedNodes();

            var params = {
                roleid: val.roleid,
                rolename: val.rolename,
                roleinfo: val.roleinfo,
                resources: val.resource
            };
            axios.post('/api/role/updateByVO', params).then(function (res) {
                this.tableData[this.selectIndex].rolename = val.rolename;
                this.tableData[this.selectIndex].roleinfo = val.roleinfo;
                this.tableData[this.selectIndex].alterName = res.data.result.alterName;
                this.tableData[this.selectIndex].alterTime = new Date();
                this.tableData[this.selectIndex].resources = val.resource;
            }.bind(this), function (error) {
                console.log(error)
            })
            this.editFormVisible = false;
        },

        closeDialog: function (val) {
            this.addFormVisible = false;
            val.rolename = "";
            val.roleinfo = "";
            this.defaultCheckKeys = [];
            this.$refs["addForm"].resetFields();
        },
        closeresourceDialog: function () {
            this.resourceVisible = false;
        }
    },

})