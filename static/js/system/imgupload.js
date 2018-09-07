//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            //搜索表单
            searchForm: {
                id: "",
                pic_type: "",
                pic_name: "",
            },
            //表数据
            tableData: [],
            //图片类型
            allTypes: [],
            //已存图片类型
            allSavedTypes: [],
            allAddTypeNames:[],
            allEditTypeNames:[],
            //选择的图片名称
            picName:[],
            //图片预览
            imgPreviewData:{},
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
            //新建页面是否显示
            addFormVisible: false,
            addFormRules: {
                picType: [
                    { required: true, message: '请输入图片类型', trigger: 'blur' },
                    { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
                ],
                picName: [
                    { required: true, message: '请输入图片名称', trigger: 'blur' },
                    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                ],
            },
            //新建数据
            addForm: {
                picType: "",
                picName: "",
                inputPicType:"",
                inputPicName:"",
                inputPicTypeName:"",
                inputPicValue:""
            },
            //选中的序号
            selectIndex: -1,
            //修改界面是否显示
            editFormVisible: false,
            editFormRules: {
                picType: [
                    { required: true, message: '请输入图片类型', trigger: 'blur' },
                    { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
                ],
                picName: [
                    { required: true, message: '请输入图片名称', trigger: 'blur' },
                    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                ],
            },
            //修改界面数据
            editForm: {
                picType: "",
                picName: "",
                inputPicType:"",
                inputPicName:"",
                inputPicTypeName:"",
                inputPicValue:""
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
                picType:""
            },
            picName:'',
            picType:'',
            //新增下拉不可用
            selectDisabled:false,
            //修改下拉不可用
            selectEditDisabled:false,
            //新增界面手动输入按钮不可用
            btnAddDisabled:false,
            //修改界面手动输入按钮不可用
            btnEditDisabled:false,
            //变更前修改页面名称数据
            savedPicName:'',
            savedInputPicName:'',
            savedInputPicValue:''
        }
    },
    created: function () {
        /**菜单选中 by li.xue 20180628*/
		// $("#activeIndex").val(getQueryString("index"));
		/**面包屑 by li.xue 20180628*/
		var type = getQueryString("type");
        loadBreadcrumb("图片管理", "-1");
        this.getAllTypes();
        this.getSavedImgTypes();
        this.searchClick('click');
    },
    methods: {
         //文件上传前
        beforeImgUpload (file) {
            const self = this;  //this必须赋值
            self.upLoadData.picName = self.picName;
            self.upLoadData.picType = self.picType;
            const isLt2M = file.size / 1024 / 1024 < 0.5;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 500kb!');
                fileList.splice(0,fileList.length);
            }
            return isLt2M;
        },
        //图片上传
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            var fs = document.getElementsByName('file');
            if(fs.length > 0) {
                fs[0].value=null
            }
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning('限制选择 1 个图片！');
        },
        handleChange(file, fileList){
            if(fileList.length > 1){
                fileList.splice(1,fileList.length-1);
                this.$message.warning('限制选择 1 个图片！');
            }
            const isLt2M = file.size / 1024 / 1024 < 0.5;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 500kb!');
                fileList.splice(0,fileList.length);
            }
            return isLt2M;
        },
        handleSuccess(response, file, fileList){
            fileList.splice(0,fileList.length);
            this.addFormVisible = false;
            this.editFormVisible = false;
        },
        //清空
        clearClick: function () {
            this.searchForm.pic_name="";
            this.searchForm.pic_type="";
            this.searchClick('reset');
        },
        //新增自行输入
        inputClick:function(){
            document.getElementById('inputPicType').style.display = "inline";
            document.getElementById('inputPicName').style.display = "inline";
            document.getElementById('inputPicTypeName').style.display = "inline";
            document.getElementById('inputPicValue').style.display = "inline";
            document.getElementById('closeBtn').style.display = "inline";
            this.selectDisabled = true;
            this.btnAddDisabled = true;
            this.addForm.picType = "";
            this.addForm.picName = "";
        },
        //自行输入关闭
        closeClick:function(){
            document.getElementById('inputPicType').style.display = "none";
            document.getElementById('inputPicName').style.display = "none";
            document.getElementById('inputPicTypeName').style.display = "none";
            document.getElementById('inputPicValue').style.display = "none";
            document.getElementById('closeBtn').style.display = "none";
            this.selectDisabled = false;
            this.btnAddDisabled = false;
            this.addForm.inputPicType = "";
            this.addForm.inputPicName = "";
            this.addForm.inputPicTypeName = "";
            this.addForm.inputPicValue = "";
        },
        //修改自行输入
        inputEditClick:function(){
            document.getElementById('inputEditPicType').style.display = "inline";
            document.getElementById('inputEditPicName').style.display = "inline";
            document.getElementById('inputEditPicTypeName').style.display = "inline";
            document.getElementById('inputEditPicValue').style.display = "inline";
            document.getElementById('closeEditBtn').style.display = "inline";
            this.selectEditDisabled = true;
            this.btnEditDisabled = true;
            this.editForm.picType = "";
            this.editForm.picName = "";
        },
        //修改自行输入关闭
        closeEditClick:function(){
            document.getElementById('inputEditPicType').style.display = "none";
            document.getElementById('inputEditPicName').style.display = "none";
            document.getElementById('inputEditPicTypeName').style.display = "none";
            document.getElementById('inputEditPicValue').style.display = "none";
            document.getElementById('closeEditBtn').style.display = "none";
            this.selectEditDisabled = false;
            this.btnEditDisabled = false;
            this.editForm.inputPicType = "";
            this.editForm.inputPicName = "";
            this.editForm.inputPicTypeName = "";
            this.editForm.inputPicValue = "";
        },
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
                picName: this.searchForm.pic_name,
                picType: this.searchForm.pic_type,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            }
            axios.post('/api/imgupload/findByVO', params).then(function (res) {
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
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
        
        //表格重新加载数据
        loadingData: function () {
            var _self = this;
            _self.loading = true;
            setTimeout(function () {
                console.info("加载数据成功");
                _self.loading = false;
            }, 300);
        },
        //图片预览
        imgPreview: function(val){
            var _self = this;
            var pkid = val.pkid;
            axios.get('/api/imgupload/doFindById/' + pkid).then(function (res) {
                this.imgPreviewData = res.data.result;
                var photo = document.getElementById("flag");
                this.photo64 =  this.imgPreviewData.photo64;
                photo.src = "data:image/png;base64,"+this.photo64;
            }.bind(this), function (error) {
                console.log(error)
            })
            _self.imgViewVisible = true;
        },
        //获取所有的类型
        getAllTypes: function () {
            axios.get('/api/imgupload/getAll').then(function (res) {
                this.allTypes = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //获取已有图片类型
        getSavedImgTypes: function () {
            axios.get('/api/imgupload/getSaved').then(function (res) {
                this.allSavedTypes = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //新增图片类型名称下拉框
        getAddTypeNames: function () {
            axios.get('/api/codelist/getCodetype/'+this.addForm.picType).then(function (res) {
                this.allAddTypeNames = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },       
        //修改图片类型名称下拉框
        getEditTypeNames: function () {
            axios.get('/api/codelist/getCodetype/'+this.editForm.picType).then(function (res) {
                this.allEditTypeNames = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //新增页面清除类型名称
        clearAddTypeNames:function(){
            this.allAddTypeNames = [];
            this.addForm.picName = "";
        },
        //修改页面清除类型名称
        clearEditTypeNames:function(){
            this.allEditTypeNames = [];
            this.editForm.picName = "";
        },
        //新建事件
        addClick: function () {
            var _self = this;
            _self.addFormVisible = true;
        },
        //新建提交点击事件
        addSubmit: function (val) {
            var _self = this;
            if(this.selectDisabled == false){  
                if(val.picName!=null && val.picName!="" && val.picType!="" && val.picType!=null)
                {
                    axios.get('/api/imgupload/getNum/' + this.addForm.picName).then(function(res){
                        var sameNameOccured = false;
                        var picNameList= res.data.result;
                        axios.get('/api/imgupload/getInputNum/' + val.picType).then(function (res) {
                            var sameTypeNames = res.data.result;
                            for(var k=0;k<sameTypeNames.length;k++){
                                if(sameTypeNames[k].picName == val.picName){
                                    sameNameOccured = true;
                                }
                            }
                            if(picNameList != 0 && sameNameOccured){
                                _self.$message({
                                    message: "图片名已存在!",
                                    type: "error"
                                });
                            }else{
                                var picTypename = "";
                                var picValue = "";
                                for(var i = 0;i<this.allTypes.length;i++){
                                    if(this.allTypes[i].codetype == val.picType){
                                        picTypename = this.allTypes[i].codetypeName;
                                    }
                                }
                                for(var k = 0;k<this.allAddTypeNames.length;k++){
                                    if(this.allAddTypeNames[k].codeName == val.picName){
                                        picValue = this.allAddTypeNames[k].codeValue;
                                    }
                                }
                                var params = {
                                    picName: val.picName,
                                    picType: val.picType,
                                    picValue: picValue,
                                    picTypename: picTypename
                                }
                                this.picName = val.picName;
                                this.picType = val.picType;
                                axios.post('/api/imgupload/detail/insertByVO', params).then(function(res){
                                    _self.total = _self.tableData.length;
                                    this.submitUpload();
                                    this.searchClick('insert');
                                    this.editFormVisible = false;
                                }.bind(this),function(error){
                                    console.log(error)
                                })
                                _self.loadingData();//重新加载数据
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }.bind(this),function(error){
                        console.log(error)
                    })
                }else{
                    _self.$message({
                        message: "图片类型和图片名称都不能为空!",
                        type: "error"
                    });
                }
            }else{
                if(val.inputPicName!=null && val.inputPicName!="" && val.inputPicType!="" && val.inputPicType!=null
                && val.inputPicTypeName!="" && val.inputPicTypeName!=null && val.inputPicValue!="" && val.inputPicValue!=null)
                {
                    axios.get('/api/imgupload/getNum/' + this.addForm.inputPicName).then(function(res){
                        var sameNameOccured = false;
                        var picNameList= res.data.result;
                        axios.get('/api/imgupload/getInputNum/' + val.inputPicType).then(function (res) {
                            var sameTypeNames = res.data.result;
                            for(var k=0;k<sameTypeNames.length;k++){
                                if(sameTypeNames[k].picName == val.inputPicName){
                                    sameNameOccured = true;
                                }
                            }
                            if(picNameList != 0 && sameNameOccured){
                                _self.$message({
                                    message: "图片名已存在!",
                                    type: "error"
                                });
                            }else{
                                axios.get('/api/imgupload/getInputNum/' + val.inputPicType).then(function(res){
                                    var picSaved= res.data.result;
                                    var picValueOccured = false;
                                    var picNameInCodelist= false;
                                    for(var i=0;i<picSaved.length;i++){
                                        if(picSaved[i].picValue == val.inputPicValue){
                                            picValueOccured = true;
                                        }
                                    }
                                    axios.get('/api/codelist/getCodetype/'+val.inputPicType).then(function (res) {
                                        var AddTypeNames = res.data.result;
                                        if(AddTypeNames.length!=0 && AddTypeNames != null){
                                            for(var i=0;i<AddTypeNames.length;i++){
                                                if(AddTypeNames[i].codeValue == val.inputPicValue){
                                                    picValueOccured =true;
                                                }
                                                if(AddTypeNames[i].codeName == val.inputPicName){
                                                    picNameInCodelist = true;
                                                }
                                            }
                                        }
                                        if(!picValueOccured && !picNameInCodelist){ 
                                            var params = {
                                                picName: val.inputPicName,
                                                picTypename: val.inputPicTypeName,
                                                picType:val.inputPicType,
                                                picValue:val.inputPicValue
                                            }
                                            this.picName = val.inputPicName;
                                            this.picType = val.inputPicType;
                                            axios.post('/api/imgupload/detail/insertByVO', params).then(function(res){
                                                _self.total = _self.tableData.length;
                                                this.submitUpload();
                                                this.searchClick('update');

                                            }.bind(this),function(error){
                                                console.log(error)
                                            })
                                            _self.loadingData();//重新加载数据
                                        }
                                        else if(picNameInCodelist && picValueOccured){
                                            _self.$message({
                                                message: "此图片名称已存于选项且图片代码已存在，请点击选择输入!",
                                                type: "error"
                                            });
                                        }
                                        else if(picNameInCodelist && !picValueOccured){
                                            _self.$message({
                                                message: "此图片名称已存于选项，请点击选择输入!",
                                                type: "error"
                                            });
                                        }
                                        else{
                                            _self.$message({
                                                message: "此图片代码已存在!",
                                                type: "error"
                                            });
                                        }
                                    }.bind(this), function (error) {
                                        console.log(error);
                                    })
                                }.bind(this),function(error){
                                    console.log(error)
                                })
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }.bind(this),function(error){
                        console.log(error)
                    })
                }else{
                    _self.$message({
                        message: "图片类型、代码和图片名称、代码都不能为空!",
                        type: "error"
                    });
                }
            }

        },
        //表格修改事件
        editClick: function (val) {
            var _self = this;
            var pkid = val.pkid;
            axios.get('/api/imgupload/doFindById/' + pkid).then(function (res) {
                this.editForm = res.data.result;
                var inCodeTypes = false;
                var ispicTypename =[];
                axios.get('/api/codelist/getCodetype/'+this.editForm.picType).then(function (res) {
                    ispicTypename = res.data.result;

                    for(var i = 0;i<this.allTypes.length;i++){
                        if(this.allTypes[i].codetype == this.editForm.picType){
                            for(var k=0;k<ispicTypename.length;k++){
                                if(this.editForm.picName == ispicTypename[k].codeName){
                                    inCodeTypes = true;
                                }
                            }
                        }
                    }
                    this.savedInputPicName = this.editForm.picName;
                    if(!inCodeTypes){
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
                }.bind(this),function(error){
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
            if(this.selectEditDisabled == false){  
                if(val.picName!=null && val.picName!="" && val.picType!="" && val.picType!=null)
                {
                    axios.get('/api/imgupload/getNum/' + val.picName).then(function(res){
                        var sameNameOccured = false;
                        var picNameList= res.data.result;
                        axios.get('/api/imgupload/getInputNum/' + val.picType).then(function (res) {
                            var sameTypeNames = res.data.result;
                            for(var k=0;k<sameTypeNames.length;k++){
                                if(sameTypeNames[k].picName == val.picName){
                                    sameNameOccured = true;
                                }
                            }
                            if(picNameList != 0 && sameNameOccured && val.picName != this.savedInputPicName){
                                _self.$message({
                                    message: "图片名已存在!",
                                    type: "error"
                                });
                            }else{
                                var picTypename = "";
                                var picValue = "";
                                for(var i = 0;i<this.allTypes.length;i++){
                                    if(this.allTypes[i].codetype == val.picType){
                                        picTypename = this.allTypes[i].codetypeName;
                                    }
                                }
                                for(var k = 0;k<this.allEditTypeNames.length;k++){
                                    if(this.allEditTypeNames[k].codeName == val.picName){
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
                                axios.post('/api/imgupload/detail/updateByVO', params).then(function (res) {
                                    this.submitUpload();
                                    this.searchClick('update');
                                    this.editFormVisible = false;
                                }.bind(this), function (error) {
                                    console.log(error)
                                })
                                _self.loadingData();
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }.bind(this),function(error){
                        console.log(error)
                    })
                }
                else{
                    _self.$message({
                        message: "图片类型和图片名称都不能为空!",
                        type: "error"
                    });
                } 
            }
            else{
                if(val.inputPicName!=null && val.inputPicName!="" && val.inputPicType!="" && val.inputPicType!=null
                && val.inputPicTypeName!="" && val.inputPicTypeName!=null && val.inputPicValue!="" && val.inputPicValue!=null)
                {
                    axios.get('/api/imgupload/getNum/' + val.inputPicName).then(function(res){
                        var sameNameOccured = false;
                        var picNameList= res.data.result;
                        axios.get('/api/imgupload/getInputNum/' + val.inputPicType).then(function (res) {
                            var sameTypeNames = res.data.result;
                            for(var k=0;k<sameTypeNames.length;k++){
                                if(sameTypeNames[k].picName == val.inputPicName){
                                    sameNameOccured = true;
                                }
                            }
                            if(picNameList != 0 && sameNameOccured && val.inputPicName != this.savedInputPicName){
                                _self.$message({
                                    message: "图片名已存在!",
                                    type: "error"
                                });
                            }else{
                                axios.get('/api/imgupload/getInputNum/' + val.inputPicType).then(function(res){
                                    var picSaved= res.data.result;
                                    var picValueOccured = false;
                                    var picNameInCodelist= false;
                                    for(var i=0;i<picSaved.length;i++){
                                        if(picSaved[i].picValue == val.inputPicValue && val.inputPicValue != this.savedInputPicValue){
                                            picValueOccured = true;
                                        }
                                    }
                                    axios.get('/api/codelist/getCodetype/'+val.inputPicType).then(function (res) {
                                        var AddTypeNames = res.data.result;
                                        if(AddTypeNames.length!=0 && AddTypeNames != null){
                                            for(var i=0;i<AddTypeNames.length;i++){
                                                if(AddTypeNames[i].codeValue == val.inputPicValue && val.inputPicValue != this.savedInputPicValue){
                                                    picValueOccured =true;
                                                }
                                                if(AddTypeNames[i].codeName == val.inputPicName && val.inputPicName != this.savedInputPicName){
                                                    picNameInCodelist = true;
                                                }
                                            }
                                        }
                                        if(!picValueOccured && !picNameInCodelist){ 
                                            var params = {
                                                pkid: val.pkid,
                                                picName: val.inputPicName,
                                                picTypename: val.inputPicTypeName,
                                                picType:val.inputPicType,
                                                picValue:val.inputPicValue
                                            };
                                            this.picName = val.inputPicName;
                                            this.picType = val.inputPicType;
                                            axios.post('/api/imgupload/detail/updateByVO', params).then(function (res) {
                                                this.submitUpload();
                                                this.searchClick('update');
                                                this.editFormVisible = false;
                                            }.bind(this), function (error) {
                                                console.log(error)
                                            })
                                            _self.loadingData();//重新加载数据
                                        }
                                        else if(picNameInCodelist && picValueOccured){
                                            _self.$message({
                                                message: "此图片名称已存于选项且图片代码已存在，请点击选择输入!",
                                                type: "error"
                                            });
                                        }
                                        else if(picNameInCodelist && !picValueOccured){
                                            _self.$message({
                                                message: "此图片名称已存于选项，请点击选择输入!",
                                                type: "error"
                                            });
                                        }
                                        else{
                                            _self.$message({
                                                message: "此图片代码已存在!",
                                                type: "error"
                                            });
                                        }
                                    }.bind(this), function (error) {
                                        console.log(error)
                                    })
                                }.bind(this),function(error){
                                    console.log(error)
                                })
                            }
                        }.bind(this),function(error){
                            console.log(error)
                        })
                    }.bind(this),function(error){
                        console.log(error)
                    })
                }
                else{
                    _self.$message({
                        message: "图片类型和图片名称都不能为空!",
                        type: "error"
                    });
                } 
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
                ids.push(row.pkid);
            }
            this.$confirm("确认删除吗？", "提示", { type: "warning" })
                .then(function () {
                    var params = {
                        ids: ids
                    }
                    axios.post('/api/imgupload/detail/deleteByIds', params).then(function (res) {
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
        
        closeDialog: function (val) {
            this.addFormVisible = false;
            this.$refs["addForm"].resetFields();
            this.$refs.upload.clearFiles();
            this.closeClick();
        },
        closeEditDialog: function (val) {
            this.editFormVisible = false;
            this.$refs.upload.clearFiles();
            document.getElementById('inputEditPicType').style.display = "none";
            document.getElementById('inputEditPicName').style.display = "none";
            document.getElementById('inputEditPicTypeName').style.display = "none";
            document.getElementById('inputEditPicValue').style.display = "none";
            document.getElementById('closeEditBtn').style.display = "none";
            this.selectEditDisabled = false;
            this.btnEditDisabled = false;
        },
    },

})