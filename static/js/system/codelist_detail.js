//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            codeid: null,
            //搜索表单
            searchForm: {
                codeValue: '',
                codeName: ''
            },
            tableData: [],
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
            total: 10,
            //修改界面是否显示
            editFormVisible: false,
            editFormRules: {
                codeValue: [
                    { required: true, message: "请输入代码值", trigger: "blur" },
                    { pattern: /^[a-zA-Z0-9_-]{1,30}$/, message: '长度为1-30个字母、数字、_-符号',trigger: 'blur'},
                ],
                codeName: [{ required: true, message: "请输入代码名称", trigger: "blur" }]
            },
            //修改界面数据
            editForm: {
                codetype: "",
                codetypeName: ""
            },
            //代码值名称-旧
            codeValueOld: "",
            //Dialog Title
            dialogTitle: "代码集详情编辑",
            //选中的序号
            editIndex: -1,
            //当前登陆用户
            shiroData: "",
        }
    },
    created: function () {
		/**面包屑 by li.xue 20180628*/
        loadBreadcrumb("代码集管理", "代码集详情");
        //当前登陆用户
        this.shiroData = shiroGlobal;

        this.loading = true; //重新加载数据
        this.codeid = getQueryString("codeid");
        var params = {
            codeid: this.codeid,
            pageSize: this.pageSize,
            pageNum: this.currentPage
        };
        axios.post('/api/codelist/detail/doFindByCodeid', params).then(function (res) {
            var tableTemp = new Array((this.currentPage-1)*this.pageSize);
            this.tableData = tableTemp.concat(res.data.result.list);
            this.total = res.data.result.total;
            this.loading = false;
        }.bind(this), function (error) {
            console.log(error)
        })
    },
    methods: {
        handleNodeClick(data) {
        },

        //日期控件格式化
        begindateChange(val) {
            this.searchForm.createTimeBegin = val;
        },
        enddateChange(val) {
            this.searchForm.createTimeEnd = val;
        },

        codetypeCilck: function (val) {
            window.location.href = this.$http.options.root + "/api/codelist/getDetailPage/" + val.codeid;
        },

        //查询，初始化
        searchClick: function(type) {
            //按钮事件的选择
            if(type == 'page'){    
                this.tableData = []; 
            }else{
                this.currentPage = 1;
            }
            this.loading = true;
            var params = {
                codeid: this.codeid,
                codeValue: this.searchForm.codeValue.replace(/%/g,"\\%"),
                codeName: this.searchForm.codeName.replace(/%/g,"\\%"),
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };

            axios.post('/api/codelist/detail/findByVO', params).then(function (res) {
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
            this.dialogTitle = "代码集详情新增";
            //清空edit表单
            if (this.$refs["editForm"] !== undefined) {
                this.$refs["editForm"].resetFields();
            }
            this.editFormVisible = true;
        },

        //修改：弹出Dialog
        editClick: function(val, index) {
            this.editIndex = index;
            this.dialogTitle = "代码集详情编辑";
            var params = {
                codeid: this.codeid,
                pkid: val.pkid
            };
            axios.post('/api/codelist/detail/findByVO', params).then(function (res) {
                this.editForm = res.data.result.list[0];
                //保存当前用户名codevalue
                this.codeValueOld = this.editForm.codeValue;
            }.bind(this), function (error) {
                console.log(error)
            })
            this.editFormVisible = true;
        },

        //修改：保存
        editSubmit: function (val) {
            this.$refs["editForm"].validate((valid) => {
                if (valid) {
                    var params = {
                        codeid: this.codeid,
                        codeValue: val.codeValue,
                        codeName: val.codeName,
                        remark: val.remark
                    };
                    if(this.dialogTitle == "代码集详情新增"){
                        axios.get('/api/codelist/detail/getNum/' + this.codeid + '/' + this.editForm.codeValue).then(function(res){
                            if(res.data.result != 0){
                                this.$message({
                                    message: "代码值已存在",
                                    type: "error"
                                });
                            }else{
                                axios.post('/api/codelist/detail/insertByVO', params).then(function (res) {
                                    var addData = res.data.result;
                                    addData.createTime = new Date();
                                    this.tableData.unshift(addData);
                                    this.total = this.tableData.length;
                                    this.$message({
                                        message: "代码集详情新增成功",
                                        type: "success"
                                    });
                                }.bind(this), function (error) {
                                    console.log(error)
                                })
                                this.editFormVisible = false;
                            }
                        }.bind(this),function(error){
                            console.log(error)
                        })
                    }else if(this.dialogTitle == "代码集详情编辑"){
                        params.pkid = val.pkid;
                        params.alterId = this.shiroData.userid;
                        params.alterName = this.shiroData.realName;
                        if(this.editForm.codeValue == this.codeValueOld){
                            this.editSubmitUpdateDB(params);
                        }else{
                            axios.get('/api/codelist/detail/getNum/' + this.codeid + '/' + this.editForm.codeValue).then(function(res){
                                if(res.data.result != 0){
                                    this.$message({
                                        message: "代码值已存在",
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
            axios.post('/xfxhapi/codelist/detail/updateByVO', params).then(function (res) {
                var result = res.data.result;
                this.tableData[this.editIndex].codeValue = result.codeValue;
                this.tableData[this.editIndex].codeName = result.codeName;
                this.tableData[this.editIndex].remark = result.remark;
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
                axios.post('/api/codelist/detail/deleteByList', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条代码集信息",
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
            this.$refs["editForm"].resetFields();
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.codeValue = "",
            this.searchForm.codeName = "",
            this.searchClick('reset');
        },
    },

})