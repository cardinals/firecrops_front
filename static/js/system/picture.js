//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            shiroData: [],
            //搜索表单
            searchForm: {
                id: "",
                pic_type: "",
                pic_name: "",
                selectedImage: null,
            },
            //表数据
            tableData: [],
            //图片类型
            allTypes: [],
            //已存图片类型
            allSavedTypes: [],
            allAddTypeNames: [],
            allEditTypeNames: [],
            //选择的图片名称
            picName: [],
            //图片预览
            imgPreviewData: {},
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
            //图片预览
            previewImg: '',
            //新建页面是否显示
            status: '',
            addDialogVisible: false,
            addDialogTitle: '',
            addFormChangeFlag: false,
            fileChangeFlag: false,
            editInitFlag: false,
            inputTypes: [
                { codeName: '选择录入', codeValue: '0' },
                { codeName: '手动录入', codeValue: '1' }
            ],
            addFormRules: {
                reserve1: [
                    { required: true, message: '必选项', trigger: 'change' }
                ],
                picType: [
                    { required: true, message: '必填项', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9 \-\_ ]+$/, message: '仅可包含数字、字母、-或_', trigger: 'blur' }
                ],
                picTypename: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                picValue: [
                    { required: true, message: '必填项', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9 \-\_ ]+$/, message: '仅可包含数字、字母、-或_', trigger: 'blur' }
                ],
                picName: [
                    { required: true, message: '必填项', trigger: 'blur' },
                ]
            },
            //新建数据
            addForm: {
                reserve1: '',
                pkid: '',
                picType: '',
                picTypename: '',
                picValue: '',
                picName: ''
            },

            editFormSelect: [],
            editRoles: [],
            //图片预览可否显示
            imgViewVisible: false,
            //图片列表
            imageUrl: '',
            fileList: [],
            //上传附加参数
            upLoadData: {
                picName: "",
                picType: ""
            },
            picTypeLabelExsit: false,
            picTypeValueExsit: false,
            picNameLabelExsit: false,
            picNameValueExsit: false,
        }
    },
    created: function () {
        /**菜单选中 by li.xue 20180628*/
        // $("#activeIndex").val(getQueryString("index"));
        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        loadBreadcrumb("图片管理", "-1");
        this.shiroData = shiroGlobal;
        this.getAllTypes();
        this.getSavedImgTypes();
        this.searchClick('click');
    },
    methods: {
        //查询条件-获取已有图片类型
        getSavedImgTypes: function () {
            axios.get('/api/picture/getSaved').then(function (res) {
                this.allSavedTypes = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //表格查询事件
        searchClick: function (type) {
            //按钮事件的选择
            if (type == 'page') {
                this.tableData = [];
            } else {
                this.currentPage = 1;
            }
            this.loading = true;//表格重新加载
            var params = {
                picName: this.searchForm.pic_name.replace(/%/g, "\\%"),
                picType: this.searchForm.pic_type,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            }
            axios.post('/api/picture/findByVO', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //查询条件清空
        clearClick: function () {
            this.searchForm.pic_name = "";
            this.searchForm.pic_type = "";
            this.searchClick('reset');
        },
        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        //删除所选，批量删除
        removeSelection: function () {
            var _self = this;
            var multipleSelection = this.multipleSelection;
            if (multipleSelection.length < 1) {
                this.$message.error("请至少选中一条记录");
                return;
            }
            this.$confirm('确认删除选中信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for (var i = 0; i < this.multipleSelection.length; i++) {
                    this.multipleSelection[i].alterId = this.shiroData.userid;
                    this.multipleSelection[i].alterName = this.shiroData.realName;
                }
                axios.post('/api/picture/doDeleteByVOList', this.multipleSelection).then(function (res) {
                    this.$message.success("成功删除" + res.data.result + "条图片信息");
                    this.searchClick('page');
                }.bind(this), function (error) {
                    console.log(error)
                })
            }).catch(() => {
                this.$message("已取消删除");
            });
        },
        //图片预览
        imgPreview: function (val) {
            this.previewImg = val;
            this.imgViewVisible = true;
        },

        //新增页-图片类型下拉框
        getAllTypes: function () {
            axios.get('/api/picture/getAll').then(function (res) {
                this.allTypes = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //新增页-图片名称下拉框
        getAddTypeNames: function (val) {
            this.addForm.picValue = '';
            axios.get('/api/codelist/getCodetype/' + val).then(function (res) {
                this.allAddTypeNames = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },

        //文件上传前
        beforeImgUpload(file) {
            this.upLoadData.picValue = this.addForm.picValue;
            this.upLoadData.picType = this.addForm.picType;
            const isLt2M = file.size / 1024 / 1024 < 0.5;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 500kb!');
                fileList.splice(0, fileList.length);
            }
            return isLt2M;
        },
        //图片上传
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            this.fileChangeFlag = false;
            var fs = document.getElementsByName('file');
            if (fs.length > 0) {
                fs[0].value = null
            }
            console.log(file, fileList);
        },
        handleChange(file, fileList) {
            this.fileChangeFlag = true;
            const isLt2M = file.size / 1024 / 1024 < 0.5;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过500KB！');
                fileList.splice(0, fileList.length);
                this.fileChangeFlag = false;
            }else{
                this.imageUrl = URL.createObjectURL(file.raw);
            }
            return isLt2M;
        },
        handleSuccess(response, file, fileList) {
            if (response) {
                this.$message.success("图片录入成功");
            } else {
                this.$message.success("图片信息录入成功，图片上传失败");
            }
            this.searchClick('insert');
            this.closeAddDialog();
            fileList.splice(0, fileList.length);
        },


        //新建事件
        addClick: function () {
            this.status = 'XZ';
            this.addDialogVisible = true;
        },
        //新建提交点击事件
        addSubmit: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.addForm.pkid == '' || this.addForm.pkid == null) {//新增
                        if (this.addForm.reserve1 == '0') {//选择录入
                            for (var k = 0; k < this.allAddTypeNames.length; k++) {
                                if (this.allAddTypeNames[k].codeValue == this.addForm.picValue) {
                                    this.addForm.picName = this.allAddTypeNames[k].codeName;
                                }
                            }
                            if (this.picNameValueExsit) {
                                this.$message.error("图片名称" + this.addForm.picName + "已存在!");
                            } else {
                                for (var i = 0; i < this.allTypes.length; i++) {
                                    if (this.allTypes[i].codetype == this.addForm.picType) {
                                        this.addForm.picTypename = this.allTypes[i].codetypeName;
                                    }
                                }
                                var params = {
                                    reserve1: '',
                                    picType: this.addForm.picType,
                                    picTypename: this.addForm.picTypename,
                                    picValue: this.addForm.picValue,
                                    picName: this.addForm.picName,
                                    createId: this.shiroData.userid,
                                    createName: this.shiroData.realName
                                }
                                axios.post('/api/picture/insertByVO', params).then(function (res) {
                                    if (res.data.result > 0) {
                                        if (this.fileChangeFlag) {
                                            this.submitUpload();
                                        } else {
                                            this.$message.success("选择录入成功");
                                            this.searchClick('insert');
                                            this.closeAddDialog();
                                        }
                                    }

                                }.bind(this), function (error) {
                                    console.log(error)
                                })
                            }
                        } else if (this.addForm.reserve1 == '1') {//手动录入
                            var params = {
                                picType: this.addForm.picType
                            }
                            axios.post('/api/picture/findByVO', params).then(function (res) {
                                if (res.data.result.total > 0 && res.data.result.list[0].picTypename != this.addForm.picTypename) {
                                    this.$message.warning("图片类型代码已存在,与图片类型名称不一致!");
                                } else {
                                    if (this.picNameValueExsit) {
                                        this.$message.error("图片代码 " + this.addForm.picValue + " 已存在!");
                                    } else {
                                        var params = {
                                            reserve1: '1',
                                            picType: this.addForm.picType,
                                            picTypename: this.addForm.picTypename,
                                            picValue: this.addForm.picValue,
                                            picName: this.addForm.picName,
                                            createId: this.shiroData.userid,
                                            createName: this.shiroData.realName
                                        }
                                        axios.post('/api/picture/insertByVO', params).then(function (res) {
                                            if (res.data.result > 0) {
                                                if (this.fileChangeFlag) {
                                                    this.submitUpload();
                                                } else {
                                                    this.$message.success("手动录入成功");
                                                    this.searchClick('insert');
                                                    this.closeAddDialog();
                                                }
                                            }
                                        }.bind(this), function (error) {
                                            console.log(error)
                                        })
                                    }
                                }
                            }.bind(this), function (error) {
                                console.log(error)
                            })
                        }
                    } else {//修改
                        if (this.addForm.reserve1 == '0') {//选择录入
                            for (var k = 0; k < this.allAddTypeNames.length; k++) {
                                if (this.allAddTypeNames[k].codeValue == this.addForm.picValue) {
                                    this.addForm.picName = this.allAddTypeNames[k].codeName;
                                }
                            }
                            if (this.picNameValueExsit) {
                                this.$message.error("图片名称" + this.addForm.picName + "已存在!");
                            } else {
                                for (var i = 0; i < this.allTypes.length; i++) {
                                    if (this.allTypes[i].codetype == this.addForm.picType) {
                                        this.addForm.picTypename = this.allTypes[i].codetypeName;
                                    }
                                }
                                var params = {
                                    pkid: this.addForm.pkid,
                                    reserve1: '',
                                    picType: this.addForm.picType,
                                    picTypename: this.addForm.picTypename,
                                    picValue: this.addForm.picValue,
                                    picName: this.addForm.picName,
                                    alterId: this.shiroData.userid,
                                    alterName: this.shiroData.realName
                                }
                                axios.post('/api/picture/updateByVO', params).then(function (res) {
                                    if (res.data.result > 0) {
                                        if (this.fileChangeFlag) {
                                            this.submitUpload();
                                        } else {
                                            this.$message.success("选择录入修改成功");
                                            this.searchClick('insert');
                                            this.closeAddDialog();
                                        }
                                    }

                                }.bind(this), function (error) {
                                    console.log(error)
                                })
                            }
                        } else if (this.addForm.reserve1 == '1') {//手动录入
                            if (this.picNameValueExsit) {
                                this.$message.error("图片代码 " + this.addForm.picValue + " 已存在!");
                            } else {
                                var params = {
                                    pkid: this.addForm.pkid,
                                    reserve1: '1',
                                    picType: this.addForm.picType,
                                    picTypename: this.addForm.picTypename,
                                    picValue: this.addForm.picValue,
                                    picName: this.addForm.picName,
                                    alterId: this.shiroData.userid,
                                    alterName: this.shiroData.realName
                                }
                                axios.post('/api/picture/updateByVO', params).then(function (res) {
                                    if (res.data.result > 0) {
                                        if (this.fileChangeFlag) {
                                            this.submitUpload();
                                        } else {
                                            this.$message.success("手动录入修改成功");
                                            this.searchClick('insert');
                                            this.closeAddDialog();
                                        }
                                    }
                                }.bind(this), function (error) {
                                    console.log(error)
                                })
                            }
                        }
                    }
                } else {
                    console.log('error save!!');
                    return false;
                }
            });

        },
        //表格修改事件
        editClick: function (val) {
            this.status = 'BJ';
            axios.get('/api/picture/doFindById/' + val.pkid).then(function (res) {
                this.addForm.pkid = res.data.result.pkid;
                this.addForm.reserve1 = res.data.result.reserve1;
                this.addForm.picType = res.data.result.picType;
                this.addForm.picValue = res.data.result.picValue;
                this.addForm.picTypename = res.data.result.picTypename;
                this.addForm.picName = res.data.result.picName;
                if (this.addForm.reserve1 == '1') {
                    var params = {
                        picType: this.addForm.picType
                    }
                    axios.post('/api/picture/findByVO', params).then(function (res1) {
                        if (res1.data.result.total > 1) {
                            this.picTypeValueExsit = true;
                        }
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                } else {
                    this.addForm.reserve1 = '0';
                    axios.get('/api/codelist/getCodetype/' + res.data.result.picType).then(function (res2) {
                        this.allAddTypeNames = res2.data.result;
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                }
                this.imageUrl = res.data.result.photo64;
                this.addDialogVisible = true;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //新增页-关闭
        closeAddDialog: function () {
            this.addForm = {
                reserve1: '',
                pkid: '',
                picType: '',
                picTypename: '',
                picValue: '',
                picName: ''
            };
            this.$refs["addForm"].resetFields();
            this.imageUrl = "";
            this.$refs.upload.clearFiles();
            this.fileChangeFlag = false;
            this.picTypeValueExsit = false;
            this.picNameValueExsit = false;
            this.status = '';
            this.addDialogVisible = false;
        },
        inputTypeChange: function (val) {
            if (val == '') {
                this.editInitFlag = true;
            } else {
                if (this.status == 'XZ') {
                    this.addForm.picType = '';
                    this.addForm.picTypename = '';
                    this.addForm.picValue = '';
                    this.addForm.picName = '';
                } else if (this.status == 'BJ') {
                    if (this.editInitFlag) {
                        this.editInitFlag = false;
                    } else {
                        this.addForm.picType = '';
                        this.addForm.picTypename = '';
                        this.addForm.picValue = '';
                        this.addForm.picName = '';
                    }
                }
            }

        },
        //判断图片类型value是否已存在
        ifPicTypeValueExsit: function (val) {
            if (val == '') {
                this.picTypeValueExsit = false;
            } else {
                var params = {
                    picType: this.addForm.picType
                }
                axios.post('/api/picture/findByVO', params).then(function (res) {
                    if (res.data.result.total > 0) {
                        // this.$message.warning("图片类型代码已存在!");
                        this.picTypeValueExsit = true;
                        // this.addForm.picTypename = res.data.result.list[0].picTypename;
                        return true;
                    } else {
                        this.picTypeValueExsit = false;
                        // this.addForm.picTypename = '';
                        return false;
                    }
                }.bind(this), function (error) {
                    console.log(error)
                })
            }
        },
        //判断某一图片类型下的图片名称value是否已存在
        ifPicNameValueExsit: function (val) {
            // if (this.addForm.picType == '') {
            //     if (this.addForm.reserve1 == '0') {//选择录入
            //         this.$message.error("请先选择图片类型!");
            //     } else if (this.addForm.reserve1 == '1') {//手动录入
            //         this.$message.error("请先录入图片类型代码!");
            //     }
            // } else {
            if (val != '') {
                var params = {
                    picType: this.addForm.picType,
                    picValue: val
                }
                axios.post('/api/picture/findByVO', params).then(function (res) {
                    if (res.data.result.total > 0) {
                        if (this.addForm.reserve1 == 0) {//选择录入
                            for (var k = 0; k < this.allAddTypeNames.length; k++) {
                                if (this.allAddTypeNames[k].codeValue == val) {
                                    this.addForm.picName = this.allAddTypeNames[k].codeName;
                                }
                            }
                            this.$message.error("图片名称" + this.addForm.picName + "已存在!");
                        } else if (this.addForm.reserve1 == 1) {//手动录入
                            this.$message.error("图片代码" + val + "已存在!");
                        }
                        this.picNameValueExsit = true;
                        return true;
                    } else {
                        this.picNameValueExsit = false;
                        return false;
                    }
                }.bind(this), function (error) {
                    console.log(error)
                })
            }
            // }

        },
    },

})