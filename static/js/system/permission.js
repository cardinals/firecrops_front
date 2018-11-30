//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            //搜索表单
            searchForm: {
                permissionname: "",
                permissioninfo: "",
                createTime: new Array()
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
            //选中的序号
            editIndex: -1,
            //修改界面是否显示
            editFormVisible: false,
            editFormRules: {
                permissionname: [
                    { required: true, message: "请输入权限名称", trigger: "blur" },
                    { pattern: /^[a-zA-Z0-9]{2,15}$/, message: '长度为2-15个字母或数字',trigger: 'blur'},
                ],
                permissioninfo: [{ required: true, message: "请输入权限描述", trigger: "blur" }]
            },
            //修改界面数据
            editForm: {
                permissionname: "",
                permissioninfo: ""
            },
            //权限名称-旧
            permissionnameOld: "",
            //Dialog Title
            dialogTitle: "权限编辑",
             //当前登陆用户
            shiroData: "",
        }
    },
    created: function () {
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("权限管理", "-1");
        this.shiroData = shiroGlobal;
        this.searchClick('click');
    },
    methods: {
        handleNodeClick(data) {
        },

        //日期控件变化时格式化
        dateChange(val) {
            this.searchForm.createTime.splice(0,this.searchForm.createTime.length);
            this.searchForm.createTime.push(val.substring(0, val.indexOf("至")));
            this.searchForm.createTime.push(val.substring(val.indexOf("至") + 1));
        },

        //查询，初始化
        searchClick: function(type) {
            //按钮事件的选择
            if(type == 'page'){
                this.tableData = [];    
            }else{
                this.currentPage = 1;
            }
            this.loading = true;//表格重新加载
            var params = {
                permissionname: this.searchForm.permissionname.replace(/%/g,"\\%"),
                permissioninfo: this.searchForm.permissioninfo.replace(/%/g,"\\%"),
                createTimeBegin: this.searchForm.createTime[0],
                createTimeEnd: this.searchForm.createTime[1],
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };

            axios.post('/api/permission/findByVO', params).then(function (res) {
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //表格勾选事件
        selectionChange: function (val) {

            this.multipleSelection = val;
            
        },

        //新建：弹出Dialog
        addClick: function () {

            this.dialogTitle = "权限新增";
            //清空edit表单
            if (this.$refs["editForm"] !== undefined) {
                this.$refs["editForm"].resetFields();
            }
            this.editFormVisible = true;

        },

        //修改：弹出Dialog
        editClick: function(val, index) {

            this.editIndex = index;
            this.dialogTitle = "权限编辑";
            var params = {
                permissionid: val.permissionid
            };


            axios.post('/api/permission/findByVO', params).then(function (res) {
                this.editForm = res.data.result.list[0];
                //保存当前用户名permissionname
                this.permissionnameOld = this.editForm.permissionname;
            }.bind(this), function (error) {
                console.log(error)
            })
            this.editFormVisible = true;

        },

        //新增/修改：保存
        editSubmit: function (val) {

            this.$refs["editForm"].validate((valid) => {
                if (valid) {

                    var params = {
                        permissionid: val.permissionid,
                        permissionname: val.permissionname,
                        permissioninfo: val.permissioninfo
                    };
                    if(this.dialogTitle == "权限新增"){
                        axios.get('/api/permission/getNum/' + this.editForm.permissionname).then(function(res){
                            if(res.data.result != 0){
                                this.$message({
                                    message: "权限名已存在",
                                    type: "error"
                                });
                            }else{
                                axios.post('/api/permission/insertByVO', params).then(function (res) {
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
                    }else if(this.dialogTitle == "权限编辑"){
                        params.permissionid = val.permissionid;
                        params.alterId = this.shiroData.userid;
                        params.alterName = this.shiroData.realName;
                        if(this.editForm.permissionname == this.permissionnameOld){
                            this.editSubmitUpdateDB(params);
                        }else{
                            axios.get('/api/permission/getNum/' + this.editForm.permissionname).then(function(res){
                                if(res.data.result != 0){
                                    this.$message({
                                        message: "权限名已存在",
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
            axios.post('/api/permission/updateByVO', params).then(function (res) {
                var result = res.data.result;
                this.tableData[this.editIndex].permissionname = result.permissionname;
                this.tableData[this.editIndex].permissioninfo = result.permissioninfo;
                this.tableData[this.editIndex].alterName = result.alterName;
                this.tableData[this.editIndex].alterTime = new Date();
                this.editFormVisible = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //删除:批量删除
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
                axios.post('/api/permission/deleteByList', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条权限信息",
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
            val.permissionname = "";
            val.permissioninfo = "";
            this.$refs["editForm"].resetFields();

        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.permissionname = "",
            this.searchForm.permissioninfo = "",
            this.searchForm.createTime = new Array(),
            this.searchClick('reset');
        },
    },

})