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
            //新建建筑信息
            addBuildingVisible: false,
            //建筑选择页面
            buildingListVisible: false,
            loading_building: false,
            //0新增
            status: '',
            type: '',
            jzid: "",//页面获取的建筑id
            //当前页
            currentPage_building: 1,
            //分页大小
            pageSize_building: 5,
            //总记录数
            total_building: 0,
            //新建数据
            editForm: {
                jzid: "",
                jzmc: "",
                jzwz: "",
                jzsyxz: "",
                jzjg: "",
                zdmj: "",
                jzmj: "",
                dsgd: "",
                dxgd: "",
                dscs: "",
                dxcs: "",
                bnc: "",
                yjddsc: "",
                xqxclx: "",
                gnms: "",
                bz: "",
                jdh: "",
                datasource: "",
                //创建人、修改人
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: "",
            },
            //搜索表单
            searchForm_building: {
                jzmc: ''
            },
            //建筑form
            buildingForm: [],
            //选择建筑弹出框Table数据
            tableData_building: [],
            //选择建筑弹出框Table高度
            tableheight_buliding: 243,

            shiroData: [],
            //基本信息
            allXzqhDataTree: [],//行政区划
            XFGX_dataTree: [],//消防管辖级联选择
            JXDWLX_data: [],//九小单位类型
            //建筑信息
            JzsyxzDataTree: [],//建筑使用性质
            JZJG_data: [],//建筑结构
            jzflData: [],//建筑分类
            //消防设施
            XfsslxDataTree: [],//消防设施类型

            //级联下拉框
            ssdzProps: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid'
            },
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
            //校验规则
            rules: {
                dwmc: [
                    { required: true, message: '请输入单位名称', trigger: 'blur' }
                ],
                xfgx: [
                    { required: true, message: '请选择消防管辖', trigger: 'blur' }
                ],
                yamc: [
                    { required: true, message: '请输入预案名称', trigger: 'blur' }
                ],
                jzsyxz: [
                    { type: 'array', required: true, message: '请选择预案类型', trigger: 'change' }
                ],
            },
            //上传文件Data
            fileList: [],
            isFile: false,
            upLoadData: {
                yaid: ""
            },

        }
    },
    created: function () {
        this.jzid = getQueryString("ID");
        this.type = getQueryString("type");
        if (this.type == "XZ") {
            loadBreadcrumb("九小建筑管理", "九小建筑新增");
        } else if (this.type == "BJ") {
            loadBreadcrumb("九小建筑管理", "九小建筑编辑");
        }
        this.shiroData = shiroGlobal;
        this.JZSYXZ();//建筑使用性质
        this.JZJG();//建筑结构
    },
    mounted: function () {
        if (this.type == "BJ") {
            this.getDetails(this.jzid);
        }
    },
    methods: {
        //建筑使用性质
        JZSYXZ: function () {
            axios.get('/api/codelist/getDzlxTree/JZSYXZ').then(function (res) {
                this.JzsyxzDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //建筑结构
        JZJG: function () {
            axios.get('/api/codelist/getCodetype/JZJG').then(function (res) {
                this.JZJG_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //建筑基本信息查询
        getDetails: function (val) {
            this.loading = true;
            axios.get('/dpapi/jxcsjzxx/' + val).then(function (res) {
                this.editForm = res.data.result;
                //建筑使用性质格式化
                if (this.editForm.jzsyxz == null) {
                    this.editForm.jzsyxz = '';
                }
                else if (this.editForm.jzsyxz.endsWith("000")) {
                    var jzsyxz = this.editForm.jzsyxz;
                    this.editForm.jzsyxz = [];
                    this.editForm.jzsyxz.push(jzsyxz);
                } else {
                    var jzsyxz1 = this.editForm.jzsyxz.substring(0, 1) + '000'
                    var jzsyxz2 = this.editForm.jzsyxz
                    this.editForm.jzsyxz = [];
                    this.editForm.jzsyxz.push(jzsyxz1, jzsyxz2);
                }
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //关闭新建建筑页面
        cancel: function () {
            loadDiv("jxcsplan/jxcsjzxx_list");
        },
        //保存/提交前校验
        checkedBefore: function () {
            if (this.editForm.jzmc == null || this.editForm.jzmc == "") {
                this.$message.warning({
                    message: "请填写建筑名称！",
                    showClose: true
                });
                return false;
            }
            // else if (this.editForm.xfgx == []) {
            //     this.$message.warning({
            //         message: "请选择消防管辖！",
            //         showClose: true
            //     });
            //     return false;
            // }
            return true;
        },
        //提交点击事件
        submit: function (formName) {
            // debugger;
            if (this.checkedBefore() == true) {
                var jzsyxzString = "";
                if (this.editForm.jzsyxz != "" && this.editForm.jzsyxz.length > 0) {
                    jzsyxzString = this.editForm.jzsyxz[this.editForm.jzsyxz.length - 1];
                }
                var params = {
                    jzmc: this.editForm.jzmc,//建筑名称
                    jzwz: this.editForm.jzwz,//建筑位置
                    jzsyxz: jzsyxzString,//建筑使用性质
                    jzjg: this.editForm.jzjg,//建筑结构
                    zdmj: this.editForm.zdmj,//占地面积
                    jzmj: this.editForm.jzmj,//建筑面积
                    dsgd: this.editForm.dsgd,//地上高度
                    dxgd: this.editForm.dxgd,//地下高度
                    dscs: this.editForm.dscs,//地上层数
                    dxcs: this.editForm.dxcs,//底下层数
                    bnc: this.editForm.bnc,//避难层
                    yjddsc: this.editForm.yjddsc,//预计到达时长
                    xqxclx: this.editForm.xqxclx,//辖区行车路线
                    gnms: this.editForm.gnms,//功能描述
                    bz: this.editForm.bz,//备注
                };
                if (this.type == 'XZ') { //新增
                    var params0 = {
                        cjrid: this.shiroData.userid,
                        cjrmc: this.shiroData.realName,
                        jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                        datasource: this.shiroData.organizationVO.jgid,
                    };
                    Object.assign(params, params0);
                    axios.post('/dpapi/jxcsjzxx/doInsertByVO', params).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功保存' + res.data.result + '条建筑信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("jxcsplan/jxcsjzxx_list");
                                }
                            });
                        } else {
                            this.$alert('保存失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else if (this.type == 'BJ') { //修改
                    var params0 = {
                        jzid: this.editForm.jzid,
                        zzrid: this.shiroData.userid,
                        zzrmc: this.shiroData.realName
                    };
                    Object.assign(params, params0);
                    axios.post('/dpapi/jxcsjzxx/doUpdateByVO', params).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功修改' + res.data.result + '条建筑信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("jxcsplan/jxcsjzxx_list");
                                }
                            });
                        } else {
                            this.$alert('修改失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                            });
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
        }
    }

})