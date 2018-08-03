//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            //权限下拉框
            allPermissions: [],
            //搜索表单
            searchForm: {
                permissionname: "",
                createTime:new Array()
            },
            tableData: [],
            //后台返回全部资源列表
            allPermissionList: [],
            //表高度变量
            tableheight: 443,
            //显示加载中样
            loading: false,
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
            //新建页面是否显示
            addFormVisible: false,
            addFormRules: {
                permissionname: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
                permissioninfo: [{ required: true, message: "请输入权限描述", trigger: "blur" }]
            },
            //新建数据
            addForm: {
                permissionname: "",
                permissioninfo: ""
            },
            //选中的序号
            selectIndex: -1,
            //修改界面是否显示
            editFormVisible: false,
            editFormRules: {
                permissionname: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
                permissioninfo: [{ required: true, message: "请输入权限描述", trigger: "blur" }]
            },
            //修改界面数据
            editForm: {
                permissionname: "",
                permissioninfo: ""
            }
        }
    },
    created: function () {
        /**菜单选中 by li.xue 20180628*/
		//$("#activeIndex").val(getQueryString("index"));
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("权限管理", "-1");
        this.getAllPermissions();
        this.searchClick('click');
    },
    methods: {
        //所有的权限列表
        getAllPermissions: function () {
            axios.get('/api/permission/getAll').then(function (res) {
                this.allPermissions = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        handleNodeClick(data) {
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
                permissionname: this.searchForm.permissionname,
                createTimeBegin: this.searchForm.createTime[0],
                createTimeEnd: this.searchForm.createTime[1],
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };

            axios.post('/api/permission/findByVO', params).then(function (res) {
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                _self.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },

        //表格重新加载数据
        loadingData: function () {
            var _self = this;
            _self.loading = true;
            setTimeout(function () {
                console.info("加载数据成功");
                _self.loading = false;
            }, 300);
        },

        //新建：弹出Dialog
        addClick: function () {
            var _self = this;
            _self.addFormVisible = true;

        },

        //新建：保存
        addSubmit: function (val) {
            var _self = this;
            axios.get('/api/permission/getNum/' + this.addForm.permissionname).then(function (res) {
                if (res.data.result != 0) {
                    _self.$message({
                        message: "权限名已存在!",
                        type: "error"
                    });
                } else {
                    var params = {
                        permissionname: val.permissionname,
                        permissioninfo: val.permissioninfo
                    }
                    axios.post('/api/permission/insertByVO', params).then(function (res) {
                        var addData = res.data.result;
                        addData.createTime = new Date();
                        _self.tableData.unshift(addData);
                        _self.total = _self.tableData.length;
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                    this.addFormVisible = false;
                    _self.loadingData();//重新加载数据
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //修改：弹出Dialog
        editClick: function(val) {
            var _self = this;
            var permissionid = val.permissionid;
            //获取选择的行号
            for (var k = 0; k < _self.tableData.length; k++) {
                if (_self.tableData[k].permissionid == permissionid) {
                    _self.selectIndex = k;
                }
            }
            //直接从table中取值放在form表单中
            this.editForm = Object.assign({}, _self.tableData[_self.selectIndex]);
            this.editFormVisible = true;
        },

        //修改：保存
        editSubmit: function (val) {
            var params = {
                permissionid: val.permissionid,
                permissionname: val.permissionname,
                permissioninfo: val.permissioninfo
            };
            axios.post('/api/permission/updateByVO', params).then(function (res) {
                this.tableData[this.selectIndex].permissionname = val.permissionname;
                this.tableData[this.selectIndex].permissioninfo = val.permissioninfo;
                this.tableData[this.selectIndex].alterName = res.data.result.alterName;
                this.tableData[this.selectIndex].alterTime = new Date();
            }.bind(this), function (error) {
                console.log(error)
            })
            this.editFormVisible = false;
        },

        //删除:批量删除
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
                ids.push(row.permissionid);
            }
            this.$confirm("确认删除吗？", "提示", { type: "warning" })
                .then(function () {
                    var params = {
                        ids: ids
                    }
                    axios.post('/api/permission/deleteByIds', params).then(function (res) {
                        for (var d = 0; d < ids.length; d++) {
                            for (var k = 0; k < _self.tableData.length; k++) {
                                if (_self.tableData[k].permissionid == ids[d]) {
                                    _self.tableData.splice(k, 1);
                                }
                            }
                        }
                        _self.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        _self.total = _self.tableData.length;
                        _self.loadingData(); //重新加载数据
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                })
                .catch(function (e) {
                    if (e != "cancel") console.log("出现错误：" + e);
                });
        },
        closeDialog: function (val) {
            this.addFormVisible = false;
            val.permissionname = "";
            val.permissioninfo = "";
            this.$refs["addForm"].resetFields();
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.permissionname = "",
            this.searchForm.createTime = new Array(),
            this.searchClick('reset');
        },
    },

})