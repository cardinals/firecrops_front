//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            tableheight: 441,//表高度变量
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
            //修改界面是否显示
            editFormVisible: false,
            editLoading: false,
            editFormRules: {
                rolename: [
                    { required: true, message: "请输入角色名称", trigger: "blur" },
                    { pattern: /^[0-9A-Za-z-_]{2,16}$/, message: '角色名应为2-16位字母、数字、字符-_', trigger: 'blur' },
                ],
                roleinfo: [
                    { required: true, message: "请输入角色描述", trigger: "blur" },
                    { min: 2, max: 20, message: '长度为2-20个字符', trigger: 'blur' }
                ]
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
            //角色名称-旧
            rolenameOld: "",
            //Dialog Title
            dialogTitle: "用户编辑",
            //选中的序号
            editIndex: -1,
            //当前登陆用户
            shiroData: "",
        }
    },
    created: function () {
		/**面包屑 by li.xue 20180628*/
        loadBreadcrumb("角色管理", "-1");
        this.shiroData = shiroGlobal;
        this.searchClick('click');
    },
    methods: {
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
                rolename: this.searchForm.rolename.replace(/%/g,"\\%"),
                roleinfo: this.searchForm.roleinfo.replace(/%/g,"\\%"),
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
            this.resourceVisible = true;
            axios.get('/api/resource/getResource/' + id).then(function (res) {
                this.resourceList = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
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
            this.dialogTitle = "角色新增";
            this.getAllResources();
            //清空edit表单
            this.defaultCheckKeys = [];
            if (this.$refs["editForm"] !== undefined) {
                this.$refs["editForm"].resetFields();
            }
            this.editFormVisible = true;
        },

        //修改：弹出Dialog
        editClick: function (val, index) {
            this.editIndex = index;
            this.dialogTitle = "角色编辑";
            var roleid = val.roleid;
            axios.get('/api/resource/getChildren/' + roleid).then(function (res) {
                this.defaultCheckKeys = res.data.result;
                this.getAllResources();
                var params = {
                    roleid: roleid
                };
                axios.post('/api/role/findByVO', params).then(function (res) {
                    this.editForm = res.data.result[0];
                    //保存当前用户名rolename
                    this.rolenameOld = this.editForm.rolename;
                }.bind(this), function (error) {
                    console.log(error)
                })
            }.bind(this), function (error) {
                console.log(error)
            })
            this.editFormVisible = true;
        },

        //修改：保存按钮
        editSubmit: function (val) {
            this.$refs["editForm"].validate((valid) => {
                if (valid) {
                    val.resource = this.$refs.tree.getCheckedNodes();
                    var params = {
                        rolename: val.rolename,
                        roleinfo: val.roleinfo,
                        resources: val.resource
                    };
                    if(this.dialogTitle == "角色新增"){
                        axios.get('/api/role/getNum/' + this.editForm.rolename).then(function(res){
                            if(res.data.result != 0){
                                this.$message({
                                    message: "角色名已存在",
                                    type: "error"
                                });
                            }else{
                                axios.post('/api/role/insertByVO', params).then(function (res) {
                                    res.data.result.createTime = new Date();
                                    this.tableData.unshift(res.data.result);
                                    this.total = this.tableData.length;
                                }.bind(this), function (error) {
                                    console.log(error)
                                })
                                this.editFormVisible = false;
                            }
                        }.bind(this),function(error){
                            console.log(error)
                        })
                    }else if(this.dialogTitle == "角色编辑"){
                        params.roleid = val.roleid;
                        params.alterId = this.shiroData.userid;
                        params.alterName = this.shiroData.realName;
                        if(this.editForm.rolename == this.rolenameOld){
                            this.editSubmitUpdateDB(params);
                        }else{
                            axios.get('/api/role/getNum/' + this.editForm.rolename).then(function(res){
                                if(res.data.result != 0){
                                    this.$message({
                                        message: "角色名已存在",
                                        type: "error"
                                    });
                                }else{
                                   this.editSubmitUpdateDB(params);
                                }
                            }.bind(this),function(error){
                                console.log(error)
                            })
                        }
                    }
                } else {
                    console.log('error save!!');
                    return false;
                }
            });
        },

        //修改方法-update数据库  by li.xue 2018/11/23 9:39
        editSubmitUpdateDB: function(params){
            axios.post('/api/role/updateByVO', params).then(function (res) {
                var result = res.data.result;
                this.tableData[this.editIndex].rolename = result.rolename;
                this.tableData[this.editIndex].roleinfo = result.roleinfo;
                this.tableData[this.editIndex].alterName = result.alterName;
                this.tableData[this.editIndex].alterTime = new Date();
                this.tableData[this.editIndex].resources = result.resource;
                this.editFormVisible = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //删除：批量删除
        removeSelection: function () {
            if (this.multipleSelection.length < 1) {
                this.$message({
                    message: "请至少选中一条记录",
                    type: "warning"
                });
                return;
            }
            this.$confirm('确认删除选中信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post('/api/role/deleteByList', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条角色信息",
                        showClose: true,
                        onClose: this.searchClick('delete')
                    });
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

        closeDialog: function (val) {
            this.editFormVisible = false;
            this.defaultCheckKeys = [];
            if (this.$refs["editForm"] !== undefined) {
                this.$refs["editForm"].resetFields();
            }
        },
        closeresourceDialog: function () {
            this.resourceVisible = false;
        }
    },

})