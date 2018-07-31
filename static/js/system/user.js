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
            //新建页面是否显示
            addFormVisible: false,
            addLoading: false,
            addFormRules: {
                realname: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                ],
                birth: [
                    { type: 'date', required: false, message: '请选择出生日期', trigger: 'change' }
                ],
                sex: [
                    { required: false, message: '请选择性别', trigger: 'change' }
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

            },
            //新建数据
            addForm: {
                userid: "",
                username: "",
                password: "",
                checkPass: "",
                realname: "",
                birth: "",
                sex: -1,
                phone: "",
                email: "",
                roles: []
            },
            //选中的序号
            selectIndex: -1,
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
                birth: [
                    { type: 'date', required: false, message: '请选择出生日期', trigger: 'change' }
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
            },
            //修改界面数据
            editForm: {
                userid: "",
                username: "",
                password: "",
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
            roleDetailSelect: []
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
            this.addForm.birth = val;
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
            var _self = this;
            /*POST请求全部的角色role列表项传给add页面数据*/
            this.getAllRoles();
            _self.addFormVisible = true;
        },
        //新建提交点击事件
        addSubmit: function (val) {
            var _self = this;
            /*POST请求递交addForm数据传入之后再对前台加载*/
            if(val.password != val.checkPass){
                _self.$message({
                    message: "两次密码输入不一致！",
                    type: "error"
                });
                return;
            }else{
                axios.get('/api/account/getNum/' + this.addForm.username).then(function(res){
                    if(res.data.result != 0){
                        _self.$message({
                            message: "用户名已存在!",
                            type: "error"
                        });
                    }else{
                        var params = {
                            username: val.username,
                            password: val.password,
                            realname: val.realname,
                            birth: val.birth,
                            sex: val.sex,
                            mobile: val.mobile,
                            email: val.email,
                            roles: val.roles
                        }
                        axios.post('/api/user/insertByVO', params).then(function(res){
                            var addData = res.data.result;
                            _self.tableData.unshift(addData);
                            _self.total = _self.tableData.length;
                        }.bind(this),function(error){
                            console.log(error)
                        })
                        this.addFormVisible = false;
                        _self.loadingData();//重新加载数据
                    }
                }.bind(this),function(error){
                    console.log(error)
                })
            }
        },
        //表格修改事件
        editClick: function () {
            var _self = this;
            var multipleSelection = this.multipleSelection;
            if (multipleSelection.length < 1) {
                _self.$message({
                    message: "请至少选中一条记录",
                    type: "error"
                });
                return;
            }
            else if (multipleSelection.length > 1) {
                _self.$message({
                    message: "只能选一条记录进行修改",
                    type: "error"
                });
                return;
            }
            //获取选择行userid
            var userid = multipleSelection[0].userid;
            for (var k = 0; k < _self.tableData.length; k++) {
                if (_self.tableData[k].userid == userid) {
                    _self.selectIndex = k;
                }
            }

            this.editForm = Object.assign({}, _self.tableData[_self.selectIndex]);
            this.editForm.password = '';
            this.editForm.checkPass = '';
            this.getAllRoles();
            this.editFormSelect = [];
            for (var i = 0; i < this.editForm.roles.length; i++) {
                this.editFormSelect.push(this.editForm.roles[i].rolename);
            }
            this.editFormVisible = true;
        },
        //获取复选框选中值
        getCheckValue(val){
            this.editFormSelect = val;
        },
        
        //保存点击事件
        editSubmit: function (val) {
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
            var deletename = [];
            for (var i = 0; i < multipleSelection.length; i++) {
                var row = multipleSelection[i];
                //删除POST请求时传入ids里的roleid作为删除唯一标识
                ids.push(row.pkid);
                deletename.push(row.username);
            }
            this.$confirm("确认删除" + deletename + "吗?", "提示", {
                type: "warning"
            })
                .then(function () {
                    var params = {
                        ids: ids
                    }
                    axios.post('/api/user/deleteByIds', params).then(function (res) {
                        for (var d = 0; d < ids.length; d++) {
                            for (var k = 0; k < _self.tableData.length; k++) {
                                if (_self.tableData[k].pkid == ids[d]) {
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
        //查看详情
        itemClick: function () {
            var _self = this;
            _self.itemFormVisible = true;

        },
        closeDialog: function (val) {
            this.addFormVisible = false;
            val.username ='';
            val.realname = '';
            val.password = '';
            val.checkPass = '';
            val.birth = '';
            val.sex = '';
            val.mobile = '';
            val.email ='';
            this.$refs["addForm"].resetFields();
        }
    },

})