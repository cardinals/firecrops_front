//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            //搜索表单
            searchForm: {
                id: "",
                username: "",
                realname: "",
            },
            //表数据
            tableData: [],
            allRoles: [],
            //表高度变量
            tableheight: 443,
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
            //详情页是否显示
            itemFormVisible: false,
            //组织机构
            zzjgData: [],
            jgidprops: {
                value: 'uuid',
                label: 'jgjc',
                children: 'children'
            },
            //Dialog标题
            dialogTitle: "",
            //选中的序号
            editIndex: -1,
            //修改界面是否显示
            editFormVisible: false,
            editLoading: false,
            editFormRules: {
                realname: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: false, message: '请输入手机号', trigger: 'blur' },
                    { min: 11, max: 11, message: '手机号格式不正确', trigger: 'blur' }
                ],
                email: [
                    { required: false, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                checkPass: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ]
            },
            //修改界面数据
            editForm: {
                userid: "",
                username: "",
                password: "",
                organizationId: "", 
                checkPass: "",
                realname: "",
                birth: "",
                sex: -1,
                phone: "",
                email: "",
                roles: []
            },
            editFormSelect: [],
            editRoles: [],
            roleDetailVisible: false,
            roleDetailList: [],
            roleDetailSelect: [],
            //操作类型
            operation: "",
        }
    },
    created: function () {
        /**菜单选中 by li.xue 20180628*/
		//$("#activeIndex").val(getQueryString("index"));
		/**面包屑 by li.xue 20180628*/
        loadBreadcrumb("用户管理", "-1");
        this.searchClick('click');
    },
    methods: {
        //表格查询事件
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
                username: this.searchForm.username,
                realname: this.searchForm.realname,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            }
            axios.post('/api/user/findByVO', params).then(function (res) {
                this.tableData = res.data.result;
                this.total = res.data.result.length;
                _self.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //制作机构级联选择
        getZzjgData: function(val) {
            axios.post('/api/organization/getOrganizationtree').then(function (res) {
                this.zzjgData = res.data.result;
                if(this.operation == "update"){
                    this.editSearch(val);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.id = "",
            this.searchForm.username = "",
            this.searchForm.realname = "",
            this.searchClick('reset');
        },
        //表格勾选事件
        selectionChange: function (val) {
            for (var i = 0; i < val.length; i++) {
                var row = val[i];
            }
            this.multipleSelection = val;
            console.info(val);
        },
        //性别格式化
        sexFormat: function (row, column) {
            switch (row[column.property]) {
                case '1':
                    return '男';
                    break;
                case '2':
                    return '女';
                    break;
                default:
                    return ""
            }
        },
        
        //增加、修改时“生日”表单赋值
        dateChangebirthday(val) {
            this.editForm.birth = val;
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
        //查看角色详情
        roleDetails: function(id){
            var _self = this;
            _self.roleDetailVisible = true;
            axios.get('/api/role/getRole/' + id).then(function(res){
                this.roleDetailList = res.data.result;
                for(var i=0;i<this.roleDetailList.length;i++){
                    this.roleDetailSelect.push(this.roleDetailList[i].rolename);
                }
            }.bind(this),function(error){
                console.log(error)
            })
        },
        //获取所有的角色
        getAllRoles: function () {
            axios.get('/api/role/getAll').then(function (res) {
                this.allRoles = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //新建事件
        addClick: function () {
            this.operation = "insert";
            this.dialogTitle = "新增用户";
            this.getAllRoles();
            this.getZzjgData();
            this.editFormVisible = true;
        },

        //表格修改事件
        editClick: function(val,index){
            this.editIndex = index;
            this.operation = "update";
            this.dialogTitle = "修改用户";
            this.getAllRoles();
            this.getZzjgData(val);
            this.editFormVisible = true;
        },
        //修改时查询方法
        editSearch: function(val){
            //获取选择行主键
            var params = {
                pkid: val.pkid
            };
            axios.post('/api/user/findByVO', params).then(function(res) {
                this.editForm = res.data.result[0];
                //密码、再次密码置空
                this.editForm.password = '';
                this.editForm.checkPass = '';
                //角色复选框赋值
                var roles = [];
                for (var i = 0; i < this.editForm.roles.length; i++) {
                    roles.push(this.editForm.roles[i].rolename);
                }
                this.editForm.roles = roles;
                //组织机构联动下拉框赋值
                var zzjgArray = [];
                var temp = this.editForm.organizationId;
                if(temp!=null && temp!=""){
                    for(var i in this.zzjgData){
                        if(temp == this.zzjgData[i].uuid){
                            zzjgArray.push(this.zzjgData[i].uuid);
                        }else{
                            for(var j in this.zzjgData[i].children){
                                if(temp == this.zzjgData[i].children[j].uuid){
                                    zzjgArray.push(this.zzjgData[i].uuid, this.zzjgData[i].children[j].uuid);
                                }else{
                                    for(var k in this.zzjgData[i].children[j].children){
                                        if(temp == this.zzjgData[i].children[j].children[k].uuid){
                                            zzjgArray.push(this.zzjgData[i].uuid, this.zzjgData[i].children[j].uuid, this.zzjgData[i].children[j].children[k].uuid);
                                        }else{
                                            for(var n in this.zzjgData[i].children[j].children[k].children){
                                                if(temp == this.zzjgData[i].children[j].children[k].children[n].uuid){
                                                    zzjgArray.push(this.zzjgData[i].uuid, this.zzjgData[i].children[j].uuid, this.zzjgData[i].children[j].children[k].uuid, this.zzjgData[i].children[j].children[k].children[n].uuid);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }  
                }
                this.editForm.organizationId = zzjgArray;
            }.bind(this), function (error) {
                console.log(error)
            }) 
        },
        //获取表单提交数据
        getFormData: function(val){
            //组织机构
            var organizationIdString = "";
            if(val.organizationId.length>0){
                organizationIdString = val.organizationId[val.organizationId.length-1];
            }
            //角色
            var roleList = [];
            for(var i=0;i<val.roles.length;i++){
                for(var j=0;j<this.allRoles.length;j++){
                    if(val.roles[i] == this.allRoles[j].rolename){
                        var temp = {
                            roleid : this.allRoles[j].roleid,
                            rolename: this.allRoles[j].rolename,
                            roleinfo: this.allRoles[j].roleinfo
                        }
                        roleList.push(temp);
                        break;
                    }
                }
            }
            return params = {
                username: val.username,
                password: val.password,
                realname: val.realname,
                organizationId: organizationIdString,
                birth: val.birth,
                sex: val.sex,
                mobile: val.mobile,
                email: val.email,
                roles: roleList
            };
        },
        //新建提交点击事件
        editSubmit: function(val) {
            var _self = this;
            if(val.password != val.checkPass){
                _self.$message({
                    message: "两次密码输入不一致！",
                    type: "error"
                });
                return;
            }else{
                if(this.operation == "insert"){
                    axios.get('/api/account/getNum/' + this.editForm.username).then(function(res){
                        if(res.data.result != 0){
                            _self.$message({
                                message: "用户名已存在!",
                                type: "error"
                            });
                            return;
                        }else{
                            var params = this.getFormData(val);
                            axios.post('/api/user/insertByVO', params).then(function(res){
                                var addData = res.data.result;
                                _self.tableData.unshift(addData);
                                _self.total = _self.tableData.length;
                            }.bind(this),function(error){
                                console.log(error)
                            })
                        }
                    }.bind(this),function(error){
                        console.log(error)
                    })
                }else if(this.operation == "update"){
                    var params = this.getFormData(val);
                    params.pkid = val.pkid;
                    params.userid = val.userid;
                    axios.post('/api/user/updateByVO', params).then(function (res){
                        var result = res.data.result;
                        this.tableData[this.editIndex].username = result.username;
                        this.tableData[this.editIndex].realname = result.realname;
                        this.tableData[this.editIndex].organizationName = result.organizationName;
                        this.tableData[this.editIndex].birth = result.birth;
                        this.tableData[this.editIndex].sex = result.sex;
                        this.tableData[this.editIndex].mobile = result.mobile;
                        this.tableData[this.editIndex].email = result.email;
                        this.tableData[this.editIndex].roles = result.roles;
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                }
            }
            this.editFormVisible = false;
        },
        
        //删除所选，批量删除
        removeSelection: function(){
            this.$confirm('确认删除选中信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post('/api/user/deleteByIds', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条用户信息",
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
        //关闭编辑Dialog
        closeDialog: function (val) {
            this.editFormVisible = false;
            val.username ='';
            val.realname = '';
            val.password = '';
            val.checkPass = '';
            val.birth = '';
            val.sex = '';
            val.mobile = '';
            val.email ='';
            this.$refs["editForm"].resetFields();
            this.operation = "none";
        },
        //展开 收起
        spread: function(){
            var a = document.getElementById("roleSpread").innerText;  
            if(a == "展开"){
                document.getElementById('roleDiv').style.height='auto';
                document.getElementById("roleSpread").innerText="收起";
            }else if(a == "收起"){
                document.getElementById('roleDiv').style.height='34px';
                document.getElementById("roleSpread").innerText="展开";
            }
        
        },
    },
    
})