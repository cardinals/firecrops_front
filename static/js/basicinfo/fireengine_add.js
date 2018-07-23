//加载面包屑
window.onload = function () {
    var type = getQueryString("type");
    if (type == "XZ") {
        loadBreadcrumb("消防车辆管理", "消防车辆信息新增");
    } else if (type == "BJ") {
        loadBreadcrumb("消防车辆管理", "消防车辆信息编辑");
    }
}
//axios默认设置cookie
axios.defaults.withCredentials = true;
new Vue({
    el: '#app',
    data: function () {
        return {
            //菜单编码
            activeIndex: '',
            //显示加载中样
            loading: false,
            loading1: false,
            //主页面------------------------------------------
            visible: false,
            //0新增
            status: '',
            //zjc 07.23
            //搜索表单
            searchForm: {
                ssdz: "",
                cllx: [],
                cphm: "",
                clzt: "",
                clbm: "",
                gpsbh: ""
            },
            tableData: [],
            allTeamsData: [],
            allTypesData: [],
            allStatesData: [],

    
            //新建数据
            addForm: {
                dxid: "",//重点单位
                dxmc: "",
                xzqh: "",
                yamc: "",//预案名称
                yalx: [],//预案类型
                yajb: "",//预案级别
                yazt: "",//预案状态
                bz: "",//备注
                disasterList: []
            },
            //灾情设定
            dynamicValidateForm: [],

            //预案基本信息data
            role_data: {},
            // detailData: {},
            //灾情信息data
            zqIndex: '',
            dzIndex: '',
            RSWZ_dataTree: [],
            ZQDJ_dataTree: [],
            QHYY_data: [],
            ZHCS_data: [],
            HZWXX_data: [],
            DJFALX_data: [],


            //级联选择器匹配结果集字段
            props: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },
            rowdata: '',
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
            total: 10,
            //行数据保存
            rowdata: {},
            //序号
            indexData: 0,
            //删除的弹出框
            deleteVisible: false,
            //新建页面是否显示
            addFormVisible: false,
            addLoading: false,
            addFormRules: {
                permissionname: [{ required: true, message: "请输入权限名称", trigger: "blur" }]
            },
            //详情页显示flag
            detailVisible:false,
            //选中的值显示
            sels: [],
            //选中的序号
            selectIndex: -1,
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
            
        }
    },
    created: function () {
        
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("消防车辆管理", "消防车辆信息新增");
        } else if (type == "BJ") {
            loadBreadcrumb("消防车辆管理", "消防车辆信息编辑");
        }

        this.searchClick('click');
        this.getAllTypesData();
        this.getAllStatesData();
        this.getAllTeamsData();
    },
    mounted: function () {
        this.status = getQueryString("ID");
        // var url = location.search;
        // if (url.indexOf("?") != -1) {
        //     var str = url.substr(1);
        //     this.status = str.substring(3);
        // }
        this.searchClick();
    },
    methods: {
        //初始化查询
        searchClick: function (type) {
            //按钮事件的选择
            if(type == 'page'){
                this.tableData = [];
            }else{
                this.currentPage = 1;
            }
            this.loading=true;
            var _self = this;
            //add by zjc 20180613
            this.searchForm.uuid = this.GetQueryString("uuid");
            var isCldj = this.GetQueryString("cldj");
            //end add
            var params={
                uuid: this.searchForm.uuid,
                ssdz :this.searchForm.ssdz,
                cllx :this.searchForm.cllx[this.searchForm.cllx.length-1],
                cphm :this.searchForm.cphm,
                clzt :this.searchForm.clzt,
                clbm :this.searchForm.clbm,
                gpsbh :this.searchForm.gpsbh,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            axios.post('/dpapi/fireengine/page',params).then(function(res){
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loadingData();
                if(isCldj == 1){
                    var val = this.tableData[0];
                    this.informClick(val)
                }
                this.rowdata = this.tableData;
                this.loading=false;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        //根据参数部分和参数名来获取参数值 
        GetQueryString(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
        //获取所有车辆类型
        getAllTypesData: function (){
            axios.post('/api/codelist/getYjlxTree/CLLX').then(function (res) {
                this.allTypesData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //获取所有车辆状态
        getAllStatesData: function (){
            var params= {
                codetype : "CLZT",
                list : [2,4]
            };
            axios.post('/api/codelist/getCodelisttree',params).then(function(res){
                this.allStatesData=res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        //获取所有队站信息
        getAllTeamsData: function () {
            axios.get('/dpapi/util/doSearchContingents').then(function (res) {
                this.allTeamsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //以下是过去代码
        //当前页修改事件
        currentPageChange_units: function (val) {
            this.currentPage_units = val;
            this.keyunitList();
        },
        //选择重点单位，返回单位名称和id
        selectRow_units: function (val) {
            this.addForm.dxmc = val.dwmc;
            this.addForm.dxid = val.uuid;
            this.addForm.xzqh = val.xzqh;
            this.unitsListVisible = false;
        },
        //重点单位弹出页关闭
        closeDialog_units: function (val) {
            this.unitsListVisible = false;
        },
        //重点单位查询条件清空
        clearkeyunitList: function (val) {
            this.searchForm_units.dwmc = "";
        },
        //重点单位删除
        clearYadx: function (val) {
            this.addForm.dxmc = "";
            this.addForm.dxid = "";
        },
        
        //当前页修改事件
        currentPageChange_parts: function (val) {
            this.currentPage_parts = val;
            // console.log("当前页: " + val);
            var _self = this;
            _self.loadingData(); //重新加载数据
        },
        //选择重点部位，返回重点部位名称和id
        selectRow_parts: function (val) {
            var index = this.zqIndex;
            this.dynamicValidateForm[index].zdbwid = val.zdbwid
            this.dynamicValidateForm[index].zqbw = val.zdbwmc
            this.partsListVisible = false;
        },
        //灾情部位弹出页关闭
        closeDialog_parts: function (val) {
            this.partsListVisible = false;
        },
        //灾情部位查询条件清空
        clearpartsList: function (val) {
            this.searchForm_parts.zdbwmc = "";
        },
        //所属建筑选择弹出页---------------------------------------------------------------
        buildingList: function (val) {
            this.zqIndex = val;
            if (this.addForm.dxid == null || this.addForm.dxid == "") {
                this.$message({
                    message: "请先选择预案对象",
                    showClose: true,
                });
            } else {
                this.buildingListVisible = true;
                this.loading_building = true;
                var params = {
                    zddwid: this.addForm.dxid,
                    jzmc: this.searchForm_building.jzmc
                };
                axios.post('/dpapi/digitalplanlist/doSearchJzListByZddwId', params).then(function (res) {
                    this.tableData_building = res.data.result;
                    this.total_building = res.data.result.length;
                    this.loading_building = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //当前页修改事件
        currentPageChange_building: function (val) {
            this.currentPage_building = val;
            // console.log("当前页: " + val);
            var _self = this;
            _self.loadingData(); //重新加载数据
        },
        //选择建筑，返回建筑名称和id
        selectRow_building: function (val) {
            var index = this.zqIndex;
            this.dynamicValidateForm[index].jzid = val.jzid
            this.dynamicValidateForm[index].jzmc = val.jzmc
            this.buildingListVisible = false;
        },
        //所属建筑弹出页关闭
        closeDialog_building: function (val) {
            this.buildingListVisible = false;
        },
        //所属建筑查询条件清空
        clearbuildingList: function (val) {
            this.searchForm_building.jzmc = "";
        },
        //消防队站选择弹出页---------------------------------------------------------------
        fireStaList: function (val, val1) {
            this.zqIndex = val;
            this.dzIndex = val1;
            if (this.addForm.dxid == null || this.addForm.dxid == "") {
                this.$message({
                    message: "请先选择预案对象",
                    showClose: true,
                });
            } else {
                this.fireStaListVisible = true;
                this.loading_fireSta = true;
                if (this.addForm.xzqh != null && this.addForm.xzqh != '') {
                    var params = {
                        xzqh: this.addForm.xzqh.substring(0, 2),
                        dzmc: this.searchForm_fireSta.dzmc
                    };
                    axios.post('/dpapi/xfdz/doSearchProvinceList', params).then(function (res) {
                        this.tableData_fireSta = res.data.result;
                        this.total_fireSta = res.data.result.length;
                        this.loading_fireSta = false;
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {
                    this.loading_fireSta = false;
                }
            }
        },
        //当前页修改事件
        currentPageChange_fireSta: function (val) {
            this.currentPage_fireSta = val;
            // console.log("当前页: " + val);
            var _self = this;
            _self.loadingData(); //重新加载数据
        },
        //选择消防队站，返回消防队站名称和id
        selectRow_fireSta: function (val) {
            var index = this.zqIndex;
            var index1 = this.dzIndex;
            this.dynamicValidateForm[index].forcedevList[index1].dzid = val.dzid
            this.dynamicValidateForm[index].forcedevList[index1].dzmc = val.dzmc
            this.fireStaListVisible = false;
        },
        //消防队站弹出页关闭
        closeDialog_fireSta: function (val) {
            this.fireStaListVisible = false;
        },
        //消防队站查询条件清空
        clearfireStaList: function (val) {
            this.searchForm_fireSta.dzmc = "";
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

        //保存/提交前校验
        checkedBefore: function () {
            if (this.addForm.dxid == null || this.addForm.dxid == "") {
                this.$message.warning({
                    message: "请选择预案对象！",
                    showClose: true
                });
                return false;
            } else if (this.addForm.yamc == null || this.addForm.yamc == "") {
                this.$message.warning({
                    message: "请填写预案名称！",
                    showClose: true
                });
                return false;
            } else if (this.addForm.yajb == null || this.addForm.yajb == "") {
                this.$message.warning({
                    message: "请选择预案级别！",
                    showClose: true
                });
                return false;
            } else if (this.addForm.yalx == []) {
                this.$message.warning({
                    message: "请选择预案类型！",
                    showClose: true
                });
                return false;
            }
            for (var i = 0; i < this.dynamicValidateForm.length; i++) {
                if (this.dynamicValidateForm[i].zqbw == "") {
                    this.$message.warning({
                        message: "请选择/填写灾情" + (i + 1) + "的灾情部位! 或删除空白灾情！",
                        showClose: true
                    });
                    return false;
                } else {
                    for (var k = 0; k < this.dynamicValidateForm[i].forcedevList.length; k++) {
                        if (this.dynamicValidateForm[i].forcedevList[k].dzid == "") {
                            this.$message.warning({
                                message: "请为灾情" + (i + 1) + "中力量部署选择消防队站！或删除空白力量部署！",
                                showClose: true
                            });
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        //点击保存事件
        save: function (formName) {
            // this.$refs[formName].validate((valid) => {
            if (this.checkedBefore() == true) {
                if (this.status == 0) {//新增
                    var params = {
                        dxid: this.addForm.dxid,
                        dxmc: this.addForm.dxmc,
                        yamc: this.addForm.yamc,
                        yalx: this.addForm.yalx[this.addForm.yalx.length - 1],
                        yazt: '01',
                        yajb: this.addForm.yajb,
                        bz: this.addForm.bz,
                        disasterList: this.dynamicValidateForm,
                        zzrid: this.role_data.userid,
                        zzrmc: this.role_data.realName,
                        jgid: this.role_data.organizationVO.uuid,
                        jgbm: this.role_data.organizationVO.jgid,
                        jgmc: this.role_data.organizationVO.jgmc
                    };
                    axios.post('/dpapi/digitalplanlist/insertByVO', params).then(function (res) {
                        this.upLoadData.yaid = res.data.result.uuid;
                        if (this.isFile) {
                            this.submitUpload();//附件上传
                        } else {
                            this.$message({
                                message: "成功保存预案信息",
                                showClose: true
                            });
                            loadDiv("digitalplan/digitalplan_list");
                            //window.location.href = "digitalplan_list.html?index=" + this.activeIndex;
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {//修改
                    var params = {
                        uuid: this.status,
                        dxid: this.addForm.dxid,
                        dxmc: this.addForm.dxmc,
                        yamc: this.addForm.yamc,
                        yalx: this.addForm.yalx[this.addForm.yalx.length - 1],
                        yazt: '01',
                        yajb: this.addForm.yajb,
                        bz: this.addForm.bz,
                        disasterList: this.dynamicValidateForm,
                        zzrid: this.role_data.userid,
                        zzrmc: this.role_data.realName
                    };
                    axios.post('/dpapi/digitalplanlist/doUpdateByVO', params).then(function (res) {
                        if (this.isFile) {
                            var params1 = {
                                yaid: this.status,
                                deleteFlag: 'Y',
                                xgsj: '1',
                                xgrid: this.role_data.userid,
                                xgrmc: this.role_data.realName
                            };
                            axios.post('/dpapi/yafjxz/doUpdateByVO', params1).then(function (res) {
                                this.submitUpload();//附件上传
                            }.bind(this), function (error) {
                                console.log(error);
                            })
                        } else {
                            this.$message({
                                message: "成功保存预案信息",
                                showClose: true
                            });
                            loadDiv("digitalplan/digitalplan_list");
                            //window.location.href = "digitalplan_list.html?index=" + this.activeIndex;
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            // });
        },
        //提交点击事件
        submit: function (formName) {
            // this.$refs[formName].validate((valid) => {
                if (this.checkedBefore() == true) {
                    if (this.status == 0) { //新增
                        var params = {
                            dxid: this.addForm.dxid,
                            dxmc: this.addForm.dxmc,
                            yamc: this.addForm.yamc,
                            yalx: this.addForm.yalx[this.addForm.yalx.length - 1],
                            yazt: '03',
                            shzt: '01',
                            yajb: this.addForm.yajb,
                            bz: this.addForm.bz,
                            disasterList: this.dynamicValidateForm,
                            zzrid: this.role_data.userid,
                            zzrmc: this.role_data.realName,
                            jgid: this.role_data.organizationVO.uuid,
                            jgbm: this.role_data.organizationVO.jgid,
                            jgmc: this.role_data.organizationVO.jgmc
                        };
                        axios.post('/dpapi/digitalplanlist/insertByVO', params).then(function (res) {
                            this.upLoadData.yaid = res.data.result.uuid;
                            if (this.isFile) {
                                this.submitUpload();//附件上传
                            } else {
                                this.$message({
                                    message: "成功保存并提交预案信息",
                                    showClose: true
                                });
                                loadDiv("digitalplan/digitalplan_list");
                                //window.location.href = "digitalplan_list.html?index=" + this.activeIndex;
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    } else { //修改
                        var params = {
                            uuid: this.status,
                            dxid: this.addForm.dxid,
                            dxmc: this.addForm.dxmc,
                            yamc: this.addForm.yamc,
                            yalx: this.addForm.yalx[this.addForm.yalx.length - 1],
                            yazt: '03',
                            shzt: '01',
                            yajb: this.addForm.yajb,
                            bz: this.addForm.bz,
                            disasterList: this.dynamicValidateForm,
                            zzrid: this.role_data.userid,
                            zzrmc: this.role_data.realName
                        };
                        axios.post('/dpapi/digitalplanlist/doUpdateByVO', params).then(function (res) {
                            if (this.isFile) {
                                var params1 = {
                                    yaid: this.status,
                                    deleteFlag: 'Y',
                                    xgsj: '1',
                                    xgrid: this.role_data.userid,
                                    xgrmc: this.role_data.realName
                                };
                                axios.post('/dpapi/yafjxz/doUpdateByVO', params1).then(function (res) {
                                    this.submitUpload();//附件上传
                                }.bind(this), function (error) {
                                    console.log(error);
                                })
                            } else {
                                this.$message({
                                    message: "成功保存预案信息",
                                    showClose: true
                                });
                                loadDiv("digitalplan/digitalplan_list");
                                //window.location.href = "digitalplan_list.html?index=" + this.activeIndex;
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            // });
        },
        //附件上传
        submitUpload:function() {
            this.$refs.upload.submit();
        },
        //附件上传成功回调方法
        handleSuccess:function(response, file, fileList) {
            if (response) {
                this.$message({
                    message: "成功保存预案信息",
                    showClose: true,
                    duration: 0
                });
            }
            loadDiv("digitalplan/digitalplan_list");
           //window.location.href = "digitalplan_list.html?index=" + this.activeIndex;
        },
        //附件移除
        handleRemove:function(file, fileList) {
            var fs = document.getElementsByName('file');
            if (fs.length > 0) {
                fs[0].value = null
            }
            console.log(file, fileList);
            this.isFile = false;
        },
        handlePreview:function(file) {
            console.log(file);
        },
        handleChange: function (file, fileList) {
            if (fileList.length == 1) {
                // this.isFile = true;
                const isZip = file.name.endsWith("zip");
                const isRAR = file.name.endsWith("rar");
                // if (isZip || isRAR) {
                //     this.isFile = true;
                // } 
                if (isZip) {
                    this.isFile = true;
                }
                else {
                    // this.$message.error('仅可上传zip/rar格式压缩文件!');
                    this.$message.error('仅可上传zip格式压缩文件!');
                    this.fileList.splice(0, this.fileList.length);
                }

            } else if (fileList.length > 1) {
                this.$message.warning('当前限制上传 1 个压缩文件');
                fileList.splice(1, fileList.length - 1);
            }
        },
        ifShowDown:function(val){
            var templete = $('.templete'),
                space = $('.space'),
                $this = $(this);
            if(val=='03'){
                templete.css('display', 'block');
                space.css('display', 'none');
            }else{
                templete.css('display', 'none');
                space.css('display', 'block');
            }
        },
        templeteDown:function(val){
            window.open(baseUrl+"/dpapi/yafjxz/downTemplet");
        }
    },

})