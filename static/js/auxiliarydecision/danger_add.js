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
            typeData: [],
            shiroData: [],
            //校验
            addFormRules:{
                name:[
                    { required: true, message: '请输入中文名', trigger: 'blur' }
                ]
            },
            //搜索表单
            addForm: {
                name: "",
                englishName: "",
                cas: "",
                rtecs: "",
                un: "",
                dangerId: "",
                expression: "",
                type: "",
                flag: "",
                alias: "",
                gbId: "",
                property: "",
                airDetermine: "",
                waterDetermine: "",
                tabu: "",
                thesaurus: "",
                symptom: "",
                firstaid: "",
                defendWay: "",
                dispose: "",
                store: "",
                leakWay: "",
                traffic: "",
                caution: "",
                bernProperty: "",
                mainApplication: "",
                poisionProperty: "",
                seprarate: "",
                publicSafety: "",
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: "",
                jdh: ""
            },

        }
    },
    created: function () {
        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("化学危险品", "化学危险品新增");
        } else if (type == "BJ") {
            loadBreadcrumb("化学危险品", "化学危险品编辑");
        }
        /**当前登陆用户 by li.xue 20180808 */
        this.shiroData = shiroGlobal;
        this.getTypeData();
    },
    mounted: function () {
        this.status = getQueryString("ID");
        this.searchClick();
    },
    methods: {
        handleNodeClick(data) {
        },
        //表格查询事件
        searchClick: function () {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                axios.get('/dpapi/danger/' + this.status).then(function (res) {
                    this.addForm = res.data.result;
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //化危品类型查询
        getTypeData: function () {
            axios.get('/api/codelist/getCodetype/HXWXPLX').then(function (res) {
                this.typeData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //保存
        save: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    if (this.addForm.name == "" || this.addForm == null) {
                        this.$message.warning({
                            message: '请输入中文名',
                            showClose: true
                        });
                    } else {
                        axios.post('/dpapi/danger/doCheckName', this.addForm).then(function (res) {
                            if (res.data.result > 0) {
                                this.$message.warning({
                                    message: '中文名已存在，请重新命名',
                                    showClose: true
                                });
                            } else {
                                this.$refs[formName].validate((valid) => {
                                    if (valid) {
                                        if (this.status == 0) {//新增
                                            this.addForm.cjrid = this.shiroData.userid;
                                            this.addForm.cjrmc = this.shiroData.realName;
                                            this.addForm.jdh = this.shiroData.organizationVO.jgid.substr(0, 2) + '000000';
                                            this.addForm.datasource = this.shiroData.organizationVO.jgid;
                                            axios.post('/dpapi/danger/insertByVO', this.addForm).then(function (res) {
                                                if (res.data.result >= 1) {
                                                    this.$alert('成功保存' + res.data.result + '条化危品信息', '提示', {
                                                        type: 'success',
                                                        confirmButtonText: '确定',
                                                        callback: action => {
                                                            loadDiv("auxiliarydecision/danger_list");
                                                            //window.location.href = "danger_list.html?index=" + this.activeIndex
                                                        }
                                                    });
                                                } else {
                                                    this.$alert('保存失败', '提示', {
                                                        type: 'error',
                                                        confirmButtonText: '确定',
                                                        callback: action => {
                                                            loadDiv("auxiliarydecision/danger_list");
                                                            //window.location.href = "danger_list.html?index=" + this.activeIndex
                                                        }
                                                    });
                                                }
                                            }.bind(this), function (error) {
                                                console.log(error);
                                            })
                                        } else {//修改
                                            this.addForm.xgrid = this.shiroData.userid;
                                            this.addForm.xgrmc = this.shiroData.realName;
                                            axios.post('/dpapi/danger/doUpdateDanger', this.addForm).then(function (res) {
                                                if (res.data.result >= 1) {
                                                    this.$alert('成功修改' + res.data.result + '条化危品信息', '提示', {
                                                        type: 'success',
                                                        confirmButtonText: '确定',
                                                        callback: action => {
                                                            loadDiv("auxiliarydecision/danger_list");
                                                            //window.location.href = "danger_list.html?index=" + this.activeIndex
                                                        }
                                                    });
                                                } else {
                                                    this.$alert('修改失败', '提示', {
                                                        type: 'error',
                                                        confirmButtonText: '确定',
                                                        callback: action => {
                                                            loadDiv("auxiliarydecision/danger_list");
                                                            //window.location.href = "danger_list.html?index=" + this.activeIndex
                                                        }
                                                    });
                                                }
                                            }.bind(this), function (error) {
                                                console.log(error);
                                            })
                                        }
                                    }
                                });
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }
                }
            });

        },
        cancel: function () {
            loadDiv("auxiliarydecision/danger_list");
            //window.location.href = "danger_list.html?index=" + this.activeIndex
        }
    },

})