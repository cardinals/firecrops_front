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
            //Dialog Title
            dialogTitle: "用户编辑",
            //组织机构
            zzjgData: [],
            jgidprops: {
                value: 'dzid',
                label: 'dzjc',
                children: 'children'
            },
            //选中的序号
            editIndex: -1,
            //修改界面是否显示
            editFormVisible: false,
            editLoading: false,
            editFormRules: {
                realname: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                ],
                mobile: [
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
                ],
                organizationId: [
                    { required: true, message: '请选择组织机构', trigger: 'select' }
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
                sex: 0,
                mobile: "",
                email: "",
                roles: []
            },
            editFormSelect: [],
            editRoles: [],
            roleDetailVisible: false,
            roleDetailList: [],
            roleDetailSelect: [],
            //操作方式
            operation: "insert",
            //登陆用户
            shiroData: ""
        }
    },
    created: function () {
		/**面包屑 by li.xue 20180628*/
        loadBreadcrumb("用户管理", "-1");
        this.shiroData = shiroGlobal;
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
            // axios.post('/api/organization/getOrganizationtree').then(function (res) {
            //     this.zzjgData = res.data.result;
            //     if(this.dialogTitle == "用户编辑"){
            //         this.editSearch(val);
            //     }
            // }.bind(this), function (error) {
            //     console.log(error);
            // })
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUserAll', param).then(function (res) {
                this.zzjgData = res.data.result;
                if(this.dialogTitle == "用户编辑"){
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

        //新增事件
        addClick: function () {
            this.dialogTitle = "用户新增";
            this.getAllRoles();
            this.getZzjgData(null);
            this.editFormVisible = true;
        },
        //表格修改事件
        editClick: function(val, index) {
            this.editIndex = index;
            this.dialogTitle = "用户编辑";
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
                        if(temp == this.zzjgData[i].dzid){
                            zzjgArray.push(this.zzjgData[i].dzid);
                        }else{
                            for(var j in this.zzjgData[i].children){
                                if(temp == this.zzjgData[i].children[j].dzid){
                                    zzjgArray.push(this.zzjgData[i].dzid, this.zzjgData[i].children[j].dzid);
                                }else{
                                    for(var k in this.zzjgData[i].children[j].children){
                                        if(temp == this.zzjgData[i].children[j].children[k].dzid){
                                            zzjgArray.push(this.zzjgData[i].dzid, this.zzjgData[i].children[j].dzid, this.zzjgData[i].children[j].children[k].dzid);
                                        }else{
                                            for(var n in this.zzjgData[i].children[j].children[k].children){
                                                if(temp == this.zzjgData[i].children[j].children[k].children[n].dzid){
                                                    zzjgArray.push(this.zzjgData[i].dzid, this.zzjgData[i].children[j].dzid, this.zzjgData[i].children[j].children[k].dzid, this.zzjgData[i].children[j].children[k].children[n].dzid);
                                                }else{
                                                    for(var m in this.zzjgData[i].children[j].children[k].children[n].children){
                                                        if(temp == this.zzjgData[i].children[j].children[k].children[n].children[m].dzid){
                                                            zzjgArray.push(this.zzjgData[i].dzid, this.zzjgData[i].children[j].dzid, this.zzjgData[i].children[j].children[k].dzid, this.zzjgData[i].children[j].children[k].children[n].dzid, this.zzjgData[i].children[j].children[k].children[n].children[m].dzid);
                                                        }
                                                    }
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

        //保存前校验
        validateSave: function(){
            if(this.editForm.username=="" || this.editForm.username==null) {
                this.$message.warning({
                    message: '请输入用户名！',
                    showClose: true
                });
                return false;
            }else if(this.editForm.realname=="" || this.editForm.realname==null){
                this.$message.warning({
                    message: '请输入真实姓名！',
                    showClose: true
                });
                return false;
            }else if(this.editForm.organizationId=="" || this.editForm.organizationId==null || this.editForm.organizationId==[]){
                this.$message.warning({
                    message: '请选择组织机构！',
                    showClose: true
                });
                return false;
            }else if(this.editForm.mobile!="" && this.editForm.mobile!=null){
                var mobileReg = '/^[1][3,4,5,7,8][0-9]{9}$/';
                if (!mobileReg.test(this.editForm.mobile)){
                    this.$message.warning({
                        message: '请输入正确手机号！',
                        showClose: true
                    });
                    return false;
                }
            }else if(this.editForm.roles==[]){
                this.$message.warning({
                    message: '请选择用户角色！',
                    showClose: true
                });
                return false;
            }else if(this.editForm.roles==[]){
                this.$message.warning({
                    message: '请选择用户角色！',
                    showClose: true
                });
                return false;
            }
            return true;
        },

        //编辑提交点击事件
        editSubmit: function(val) {
            if(this.validateSave()){
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
                var params = {
                    username: val.username,
                    password: val.password,
                    realname: val.realname,
                    organizationId: organizationIdString,
                    birth: val.birth,
                    sex: val.sex,
                    mobile: val.mobile,
                    email: val.email,
                    roles: roleList
                }
                if(this.dialogTitle == "用户新增"){
                    if(this.editForm.password=="" || this.editForm.password==null){
                        this.$message.warning({
                            message: '请输入密码！',
                            showClose: true
                        });
                        return false;
                    }else if(this.editForm.checkPass=="" || this.editForm.checkPass==null){
                        this.$message.warning({
                            message: '请输入确认密码！',
                            showClose: true
                        });
                        return false;
                    }else if(this.editForm.password!=this.editForm.checkPass){
                        this.$message.warning({
                            message: '两次密码输入不一致！',
                            showClose: true
                        });
                        return false;
                    }
                    axios.get('/api/account/getNum/' + this.editForm.username).then(function(res){
                        if(res.data.result != 0){
                            this.$message({
                                message: "用户名已存在!",
                                type: "error"
                            });
                        }else{
                            axios.post('/api/user/insertByVO', params).then(function(res){
                                var addData = res.data.result;
                                this.tableData.unshift(addData);
                                this.total = this.tableData.length;
                            }.bind(this),function(error){
                                console.log(error)
                            })
                            this.editFormVisible = false;
                        }
                    }.bind(this),function(error){
                        console.log(error)
                    })
                }else if(this.dialogTitle == "用户编辑"){
                    params.pkid = val.pkid;
                    params.userid = val.userid;
                    params.alterId = this.shiroData.userid;
                    params.alterName = this.shiroData.realName;
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
                        this.editFormVisible = false;
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                }
            }
        },
        
        //获取复选框选中值
        getCheckValue(val){
            this.editFormSelect = val;
        },
        
        //保存点击事件
        editSubmit2: function (val) {
            var _self = this;
            this.editRoles = [];
            for (var i = 0; i < this.editFormSelect.length; i++) {
                for (var k = 0; k < this.allRoles.length; k++) {
                    if (this.allRoles[k].rolename == this.editFormSelect[i]) {
                        this.editRoles.push(this.allRoles[k]);
                    }
                }
            }
            this.editForm.roles.splice(0, this.editForm.roles.length);
            for (var i = 0; i < this.editRoles.length; i++) {
                this.editForm.roles.push(this.editRoles[i]);
            }

            if (val.password == val.checkPass) {
                var params = {
                    pkid: val.pkid,
                    userid: val.userid,
                    username: val.username,
                    password: val.password,
                    realname: val.realname,
                    birth: val.birth,
                    sex: val.sex,
                    mobile: val.mobile,
                    email: val.email,
                    roles: val.roles
                };
                axios.post('/api/user/updateByVO', params).then(function (res) {
                    this.tableData[this.selectIndex].username = val.username;
                    this.tableData[this.selectIndex].realname = val.realname;
                    this.tableData[this.selectIndex].birth = val.birth;
                    this.tableData[this.selectIndex].sex = val.sex;
                    this.tableData[this.selectIndex].mobile = val.mobile;
                    this.tableData[this.selectIndex].email = val.email;
                    this.tableData[this.selectIndex].roles = val.roles;
                    this.editFormVisible = false;
                }.bind(this), function (error) {
                    console.log(error)
                })

                this.editFormVisible = false;
                _self.loadingData();
            }
            else {
                _self.$message({
                    message: "两次密码输入不一致！",
                    type: "error"
                });
                return;
            }
        },
        //删除所选，批量删除
        removeSelection: function () {
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
        //查看详情
        closeDialog: function (val) {
            this.editFormVisible = false;
            // val.username ='';
            // val.realname = '';
            // val.password = '';
            // val.checkPass = '';
            // val.birth = '';
            // val.sex = '';
            // val.mobile = '';
            // val.email ='';
            this.$refs["editForm"].resetFields();
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