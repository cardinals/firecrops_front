//axios默认设置cookie
axios.defaults.withCredentials = true;
new Vue({
    el: '#app',
    data: function () {
        return {
            //菜单编号
            activeIndex: '',
            //新增修改标识（0新增，uuid修改）
            status: '',
            //显示加载中样
            loading: false,
            allYjlxDataTree: [],
            role_data: [],
            //搜索表单
            addForm: {
                yjmc: "",
                yjbm: "",
                yjlx: "",
                sccj: "",
                pc: "",
                zcbl: "",
                czl: "",
                kcl: "",
                scsj: "",
                hhb: "",
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: ""
            },
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
        }
    },
    created: function () {
        /**菜单选中 by li.xue 20180628*/
        /**
        var index = getQueryString("index");
        $("#activeIndex").val(index);
        this.activeIndex = index;
         */

        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("消防药剂", "消防药剂新增");
        } else if (type == "BJ") {
            loadBreadcrumb("消防药剂", "消防药剂编辑");
        }

        this.getAllYjlxDataTree();
        this.roleData();
    },
    mounted: function () {
        this.status = getQueryString("ID");
        this.searchClick();
    },
    methods: {
        //当前登录用户信息
        roleData: function () {
            axios.post('/api/shiro').then(function (res) {
                this.role_data = res.data;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //表格查询事件
        searchClick: function () {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                axios.get('/dpapi/firedrug/' + this.status).then(function (res) {
                    this.addForm = res.data.result;
                    //药剂类型格式化
                    if (this.addForm.yjlx.endsWith("000000")) {
                        var yjlx = this.addForm.yjlx;
                        this.addForm.yjlx = [];
                        this.addForm.yjlx.push(yjlx);
                    } else if(this.addForm.yjlx.endsWith("0000")){
                        var yjlx1 = this.addForm.yjlx.substring(0, 2) + '000000';
                        var yjlx2 = this.addForm.yjlx;
                        this.addForm.yjlx = [];
                        this.addForm.yjlx.push(yjlx1, yjlx2);
                    }else if(this.addForm.yjlx.endsWith("00")){
                        var yjlx1 = this.addForm.yjlx.substring(0, 2) + '000000';
                        var yjlx2 = this.addForm.yjlx.substring(0, 4) + '0000';
                        var yjlx3 = this.addForm.yjlx;
                        this.addForm.yjlx = [];
                        this.addForm.yjlx.push(yjlx1, yjlx2, yjlx3);
                    }
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //药剂类型级联选择器数据
        getAllYjlxDataTree: function () {
            axios.post('/api/codelist/getYjlxTree/YJLX').then(function (res) {
                this.allYjlxDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        czlChange: function (value) {
            this.addForm.zcbl = value + this.addForm.kcl;
        },
        kclChange: function (value) {
            this.addForm.zcbl = value + this.addForm.czl;
        },
        pickerOptions0: {
            disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
            }
        },
        //保存
        save: function (formName) {
            if (this.addForm.yjmc == "" || this.addForm == null) {
                this.$message.warning({
                    message: '请输入药剂名称',
                    showClose: true
                });
            } else {
                if (this.status == 0) {//新增
                    this.addForm.cjrid = this.role_data.userid;
                    this.addForm.cjrmc = this.role_data.realName;
                    this.addForm.scsj = dateFormat(new Date(this.addForm.scsj));
                    this.addForm.yjlx = this.addForm.yjlx[this.addForm.yjlx.length - 1];
                    axios.post('/dpapi/firedrug/insertByVO', this.addForm).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功保存' + res.data.result + '条消防药剂信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        } else {
                            this.$alert('保存失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {//修改
                    this.addForm.xgrid = this.role_data.userid;
                    this.addForm.xgrmc = this.role_data.realName;
                    this.addForm.scsj = dateFormat(new Date(this.addForm.scsj));
                    this.addForm.yjlx = this.addForm.yjlx[this.addForm.yjlx.length - 1];
                    axios.post('/dpapi/firedrug/doUpdateDrug', this.addForm).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功修改' + res.data.result + '条消防药剂信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        } else {
                            this.$alert('修改失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firedrug_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                }
            }
        },
        //取消
        cancel: function () {
            loadDiv("basicinfo/firedrug_list");
        }
    },

})