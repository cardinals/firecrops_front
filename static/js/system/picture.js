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
            addDialogVisible: false,
            addDialogTitle: '',
            addFormChangeFlag: false,
            fileChangeFlag: false,
            inputTypes: [
                { codeName: '选择录入', codeValue: '0' },
                { codeName: '手动录入', codeValue: '1' }
            ],
            addFormRules: {
                inputType: [
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
                inputType: '',
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
            if (fileList.length > 1) {
                fileList.splice(1, fileList.length - 1);
                this.$message.warning('限制选择 1 个图片！');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 0.5;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过500KB！');
                fileList.splice(0, fileList.length);
                this.fileChangeFlag = false;
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


        //新增页面清除类型名称
        clearAddTypeNames: function () {
            this.allAddTypeNames = [];
            this.addForm.picName = "";
        },
        //新建事件
        addClick: function () {
            this.addDialogVisible = true;
        },
        //新建提交点击事件
        addSubmit: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.addForm.pkid == '' || this.addForm.pkid == null) {//新增
                        if (this.addForm.inputType == '0') {//选择录入
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
                                    picType: this.addForm.picType,
                                    picTypename: this.addForm.picTypename,
                                    picValue: this.addForm.picValue,
                                    picName: this.addForm.picName
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
                        } else if (this.addForm.inputType == '1') {//手动录入
                            if (this.picNameValueExsit) {
                                this.$message.error("图片代码 " + this.addForm.picValue + " 已存在!");
                            } else {
                                var params = {
                                    reserve1: '1',
                                    picType: this.addForm.picType,
                                    picTypename: this.addForm.picTypename,
                                    picValue: this.addForm.picValue,
                                    picName: this.addForm.picName
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
                    } else if (this.addForm.pkid != '' && this.addForm.pkid != null) {//修改
                        if (this.addForm.inputType == '0') {//选择录入

                        } else if (this.addForm.inputType == '1') {//手动录入

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
            var _self = this;
            this.addForm.pkid = val.pkid;
            axios.get('/api/picture/doFindById/' + this.pkid).then(function (res) {
                this.editForm = res.data.result;
                var inCodeTypes = false;
                var ispicTypename = [];
                axios.get('/api/codelist/getCodetype/' + this.editForm.picType).then(function (res) {
                    ispicTypename = res.data.result;

                    for (var i = 0; i < this.allTypes.length; i++) {
                        if (this.allTypes[i].codetype == this.editForm.picType) {
                            for (var k = 0; k < ispicTypename.length; k++) {
                                if (this.editForm.picName == ispicTypename[k].codeName) {
                                    inCodeTypes = true;
                                }
                            }
                        }
                    }
                    this.savedInputPicName = this.editForm.picName;
                    if (!inCodeTypes) {
                        document.getElementById('inputEditPicType').style.display = "inline";
                        document.getElementById('inputEditPicName').style.display = "inline";
                        document.getElementById('inputEditPicTypeName').style.display = "inline";
                        document.getElementById('inputEditPicValue').style.display = "inline";
                        document.getElementById('closeEditBtn').style.display = "inline";
                        this.selectEditDisabled = true;
                        this.btnEditDisabled = true;
                        this.editForm.inputPicTypeName = this.editForm.picTypename;
                        this.editForm.inputPicName = this.editForm.picName;
                        this.editForm.inputPicType = this.editForm.picType;
                        this.editForm.inputPicValue = this.editForm.picValue;
                        this.savedInputPicName = this.editForm.picName;
                        this.savedInputPicValue = this.editForm.picValue;
                        this.editForm.picType = "";
                        this.editForm.picName = "";
                    }
                }.bind(this), function (error) {
                    console.log(error)
                })
            }.bind(this), function (error) {
                console.log(error)
            })
            this.editFormVisible = true;
        },

        //保存点击事件
        editSubmit: function (val) {
            var _self = this;
            if (this.selectEditDisabled == false) {
                if (val.picName != null && val.picName != "" && val.picType != "" && val.picType != null) {
                    axios.get('/api/picture/getNum/' + val.picName).then(function (res) {
                        var sameNameOccured = false;
                        var picNameList = res.data.result;
                        axios.get('/api/picture/getInputNum/' + val.picType).then(function (res) {
                            var sameTypeNames = res.data.result;
                            for (var k = 0; k < sameTypeNames.length; k++) {
                                if (sameTypeNames[k].picName == val.picName) {
                                    sameNameOccured = true;
                                }
                            }
                            if (picNameList != 0 && sameNameOccured && val.picName != this.savedInputPicName) {
                                _self.$message({
                                    message: "图片名已存在!",
                                    type: "error"
                                });
                            } else {
                                var picTypename = "";
                                var picValue = "";
                                for (var i = 0; i < this.allTypes.length; i++) {
                                    if (this.allTypes[i].codetype == val.picType) {
                                        picTypename = this.allTypes[i].codetypeName;
                                    }
                                }
                                for (var k = 0; k < this.allEditTypeNames.length; k++) {
                                    if (this.allEditTypeNames[k].codeName == val.picName) {
                                        picValue = this.allEditTypeNames[k].codeValue;
                                    }
                                }
                                var params = {
                                    pkid: val.pkid,
                                    picName: val.picName,
                                    picType: val.picType,
                                    picValue: picValue,
                                    picTypename: picTypename
                                };
                                this.picName = val.picName;
                                this.picType = val.picType;
                                axios.post('/api/picture/detail/updateByVO', params).then(function (res) {
                                    this.submitUpload();
                                    this.searchClick('update');
                                    this.editFormVisible = false;
                                }.bind(this), function (error) {
                                    console.log(error)
                                })
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                }
                else {
                    _self.$message({
                        message: "图片类型和图片名称都不能为空!",
                        type: "error"
                    });
                }
            }
            else {
                if (val.inputPicName != null && val.inputPicName != "" && val.inputPicType != "" && val.inputPicType != null
                    && val.inputPicTypeName != "" && val.inputPicTypeName != null && val.inputPicValue != "" && val.inputPicValue != null) {
                    axios.get('/api/picture/getNum/' + val.inputPicName).then(function (res) {
                        var sameNameOccured = false;
                        var picNameList = res.data.result;
                        axios.get('/api/picture/getInputNum/' + val.inputPicType).then(function (res) {
                            var sameTypeNames = res.data.result;
                            for (var k = 0; k < sameTypeNames.length; k++) {
                                if (sameTypeNames[k].picName == val.inputPicName) {
                                    sameNameOccured = true;
                                }
                            }
                            if (picNameList != 0 && sameNameOccured && val.inputPicName != this.savedInputPicName) {
                                _self.$message({
                                    message: "图片名已存在!",
                                    type: "error"
                                });
                            } else {
                                axios.get('/api/picture/getInputNum/' + val.inputPicType).then(function (res) {
                                    var picSaved = res.data.result;
                                    var picValueOccured = false;
                                    var picNameInCodelist = false;
                                    for (var i = 0; i < picSaved.length; i++) {
                                        if (picSaved[i].picValue == val.inputPicValue && val.inputPicValue != this.savedInputPicValue) {
                                            picValueOccured = true;
                                        }
                                    }
                                    axios.get('/api/codelist/getCodetype/' + val.inputPicType).then(function (res) {
                                        var AddTypeNames = res.data.result;
                                        if (AddTypeNames.length != 0 && AddTypeNames != null) {
                                            for (var i = 0; i < AddTypeNames.length; i++) {
                                                if (AddTypeNames[i].codeValue == val.inputPicValue && val.inputPicValue != this.savedInputPicValue) {
                                                    picValueOccured = true;
                                                }
                                                if (AddTypeNames[i].codeName == val.inputPicName && val.inputPicName != this.savedInputPicName) {
                                                    picNameInCodelist = true;
                                                }
                                            }
                                        }
                                        if (!picValueOccured && !picNameInCodelist) {
                                            var params = {
                                                pkid: val.pkid,
                                                picName: val.inputPicName,
                                                picTypename: val.inputPicTypeName,
                                                picType: val.inputPicType,
                                                picValue: val.inputPicValue
                                            };
                                            this.picName = val.inputPicName;
                                            this.picType = val.inputPicType;
                                            axios.post('/api/picture/detail/updateByVO', params).then(function (res) {
                                                this.submitUpload();
                                                this.searchClick('update');
                                                this.editFormVisible = false;
                                            }.bind(this), function (error) {
                                                console.log(error)
                                            })
                                        }
                                        else if (picNameInCodelist && picValueOccured) {
                                            _self.$message({
                                                message: "此图片名称已存于选项且图片代码已存在，请点击选择输入!",
                                                type: "error"
                                            });
                                        }
                                        else if (picNameInCodelist && !picValueOccured) {
                                            _self.$message({
                                                message: "此图片名称已存于选项，请点击选择输入!",
                                                type: "error"
                                            });
                                        }
                                        else {
                                            _self.$message({
                                                message: "此图片代码已存在!",
                                                type: "error"
                                            });
                                        }
                                    }.bind(this), function (error) {
                                        console.log(error)
                                    })
                                }.bind(this), function (error) {
                                    console.log(error)
                                })
                            }
                        }.bind(this), function (error) {
                            console.log(error)
                        })
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                }
                else {
                    _self.$message({
                        message: "图片类型和图片名称都不能为空!",
                        type: "error"
                    });
                }
            }
        },
        //新增页-关闭
        closeAddDialog: function () {
            this.addDialogVisible = false;
            this.$refs["addForm"].resetFields();
            this.$refs.upload.clearFiles();
            this.fileChangeFlag = false;
            this.picTypeValueExsit = false;
            this.picNameValueExsit = false;
        },
        inputTypeChange: function (val) {
            this.addForm.picType = '';
            this.addForm.picTypename = '';
            this.addForm.picValue = '';
            this.addForm.picName = '';
        },
        //判断图片类型value是否已存在
        ifPicTypeValueExsit: function (val) {
            if (val != '') {
                var params = {
                    picType: this.addForm.picType
                }
                axios.post('/api/picture/findByVO', params).then(function (res) {
                    if (res.data.result.total > 0) {
                        this.$message.warning("图片类型代码已存在!");
                        this.picTypeValueExsit = true;
                        this.addForm.picTypename = res.data.result.list[0].picTypename;
                        return true;
                    } else {
                        this.picTypeValueExsit = false;
                        this.addForm.picTypename = '';
                        return false;
                    }
                }.bind(this), function (error) {
                    console.log(error)
                })
            }
        },
        //判断某一图片类型下的图片名称value是否已存在
        ifPicNameValueExsit: function (val) {
            if (this.addForm.picType == '') {
                if (this.addForm.inputType == '0') {//选择录入
                    this.$message.error("请先选择图片类型!");
                } else if (this.addForm.inputType == '1') {//手动录入
                    this.$message.error("请先录入图片类型代码!");
                }
            } else {
                if (val != '') {
                    var params = {
                        picType: this.addForm.picType,
                        picValue: val
                    }
                    axios.post('/api/picture/findByVO', params).then(function (res) {
                        if (res.data.result.total > 0) {
                            if (this.addForm.inputType == 0) {//选择录入
                                for (var k = 0; k < this.allAddTypeNames.length; k++) {
                                    if (this.allAddTypeNames[k].codeValue == val) {
                                        this.addForm.picName = this.allAddTypeNames[k].codeName;
                                    }
                                }
                                this.$message.error("图片名称" + this.addForm.picName + "已存在!");
                            } else if (this.addForm.inputType == 1) {//手动录入
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
            }

        },
    },

})