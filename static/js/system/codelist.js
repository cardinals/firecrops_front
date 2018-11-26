//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            //菜单选中
            activeIndex: '',
            visible: false,
            //搜索表单
            searchForm: {
                codetype: "",
                codetypeName: "",
                createTime:new Array()
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
            //修改界面表单值是否发生改变
            editFormFlag: false,
            //修改界面是否显示
            editFormVisible: false,
            editFormRules: {
                codetype: [
                    { required: true, message: "请输入代码集类型", trigger: "blur" },
                    { pattern: /^[a-zA-Z0-9_-]{2,30}$/, message: '长度为2-30个字母、数字、_-符号',trigger: 'blur'},
                ],
                codetypeName: [{ required: true, message: "请输入代码集类型名称", trigger: "blur" }],
                language: [{ pattern: /^[a-zA-Z0-9_-]{1,8}$/, message: '长度为2-8个字母、数字、_-符号',trigger: 'blur'},]
            },
            //修改界面数据
            editForm: {
                codetype: "",
                codetypeName: "",
                remark: "",
                language: "zh_CN"
            },
            //代码集名称-旧
            codetypeOld: "",
            //Dialog Title
            dialogTitle: "代码集编辑",
            //选中的序号
            editIndex: -1,
            //当前登陆用户
            shiroData: "",
        }
    },
    created: function () {
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("代码集管理", "-1");
        //当前登陆用户
        this.shiroData = shiroGlobal;
        this.searchClick('click');
    },
    methods: {
        handleNodeClick(data) {
        },
        
        //日期控件变化时格式化
        dateChange(val) {
            this.searchForm.createTime.splice(0,this.searchForm.createTime.length);
            this.searchForm.createTime.push(val.substring(0,val.indexOf("至")));
            this.searchForm.createTime.push(val.substring(val.indexOf("至") + 1));
        },

        codetypeCilck: function (val) {
            var params = {
                codeid: val.codeid
            }
            loadDivParam("system/codelist_detail", params);
        },

        //查询，初始化
        searchClick: function(type) {
            //按钮事件的选择
            if(type == 'page'){
                this.tableData = [];     
            }else{
                this.currentPage = 1;
            }
            var params = {
                codetype: this.searchForm.codetype.replace(/%/g,"\\%"),
                codetypeName: this.searchForm.codetypeName.replace(/%/g,"\\%"),
                createTimeBegin: this.searchForm.createTime[0],
                createTimeEnd: this.searchForm.createTime[1],
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            axios.post('/api/codelist/findByVO', params).then(function (res) {
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
            this.dialogTitle = "代码集新增";
            //清空edit表单
            if (this.$refs["editForm"] !== undefined) {
                this.$refs["editForm"].resetFields();
            }
            this.editFormVisible = true;
        },

        //修改：弹出Dialog
        editClick: function(val, index) {
            this.editIndex = index;
            this.dialogTitle = "代码集编辑";
            axios.get('/api/codelist/' + val.codeid).then(function (res) {
                this.editForm = res.data.result;
                //保存当前用户名codetype
                this.codetypeOld = this.editForm.codetype;
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
                        codetype: val.codetype,
                        codetypeName: val.codetypeName,
                        remark: val.remark
                    }
                    if(this.dialogTitle == "代码集新增"){
                        axios.get('/api/codelist/getNum/' + this.editForm.codetype).then(function(res){
                            if(res.data.result != 0){
                                this.$message({
                                    message: "代码集类型已存在",
                                    type: "error"
                                });
                            }else{
                                axios.post('/api/codelist/insertByVO', params).then(function (res) {
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
                    }else if(this.dialogTitle == "代码集编辑"){
                        params.codeid = val.codeid;
                        params.alterId = this.shiroData.userid;
                        params.alterName = this.shiroData.realName;
                        if(this.editForm.codetype == this.codetypeOld){
                            this.editSubmitUpdateDB(params);
                        }else{
                            axios.get('/api/codelist/getNum/' + this.editForm.codetype).then(function(res){
                                if(res.data.result != 0){
                                    this.$message({
                                        message: "代码集类型已存在",
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
            axios.post('/api/codelist/updateByVO', params).then(function (res) {
                var result = res.data.result;
                this.tableData[this.editIndex].codetype = result.codetype;
                this.tableData[this.editIndex].codetypeName = result.codetypeName;
                this.tableData[this.editIndex].remark = result.remark;
                this.tableData[this.editIndex].language = result.language;
                this.tableData[this.editIndex].alterName = result.alterName;
                this.tableData[this.editIndex].alterTime = new Date();
                this.editFormVisible = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //删除:批量删除
        removeSelection: function(){
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
                axios.post('/api/codelist/deleteByList', this.multipleSelection).then(function (res) {
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
            this.searchForm.codetype = "",
            this.searchForm.codetypeName = "",
            this.searchForm.createTime = new Array(),
            this.searchClick('reset');
        },
    },
})