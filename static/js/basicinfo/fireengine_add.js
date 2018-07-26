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
            //新增修改标识（0新增，uuid修改）
            status: '',
            //zjc 07.23
            tableData: [],
            allTeamsData: [],
            allTypesData: [],
            allStatesData: [],
            //新建数据
            addForm: {
                //新信息
                sccj:"",
                xzqh:"",	//行政区划
                sccj:"",	//生产厂家
                jglgd:"",	//举高类车辆高度(m)
                sbll:"",	//水泵流量(L/s)
                zsl:"",	 //载水量(t)
                xfpll:"",	//消防炮流量(L/s)
                sbedyl:"",	//水泵额定压力(Mpa)
                czmhjlb:"",	//车载灭火剂类别
                czmhjl:"",//车载灭火剂量(t)
                mhjhhb:"",//灭火剂混合比
                gisX:"",//
                gisY:"",//
                ssdz: [],
                cllx: [],
                cphm: "",
                clzt: "",
                clbm: "",
                gpsbh: "",
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: ""
            },
            //灾情设定
            dynamicValidateForm: [],
            //预案基本信息data
            role_data: [],
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
            //
            ssdzProps: {
                children: 'children',
                value: 'dzid',
                label: 'dzjc'
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
        this.roleData();
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
        //当前登录用户信息
        roleData: function () {
            axios.post('/api/shiro').then(function (res) {
                this.role_data = res.data;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //初始化查询
        searchClick: function (type) {
            //按钮事件的选择
            if(type == 'page'){
                this.tableData = [];
            }else{
                this.currentPage = 1;
            }
            this.loading=true;
            
            if (this.status == 0) {  //新增
                this.loading = false;
            } else { //修改
                axios.get('/dpapi/fireengine/' + this.status).then(function (res) {
                    //修改存在问题
                    this.addForm = res.data.result;
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })

            }
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
            axios.post('/api/shiro').then(function (res) {
                this.role_data = res.data;
                var organization = this.role_data.organizationVO;
                var params = {
                    dzid: organization.uuid,
                    dzjc: organization.jgjc,
                    dzbm: organization.jgid,
                };
                axios.post('/dpapi/xfdz/findSjdzByUser', params).then(function (res) {
                    this.allTeamsData = res.data.result;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }.bind(this), function (error) {
                console.log(error);
            })
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
            this.addForm_fireSta.dzmc = "";
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
        //点击保存事件
        //保存

        save: function () {
           
                if (this.status == 0) {//新增
                    this.addForm.cjrid = this.role_data.userid;
                    this.addForm.cjrmc = this.role_data.realName;   
                    // if(this.addForm.cllx>0){
                        this.addForm.cllx = this.addForm.cllx[this.addForm.cllx.length - 1];
                    // }                 
                    axios.post('/dpapi/fireengine/insertByVO', this.addForm).then(function (res) {
                       if (res.data.result >= 1) {
                            this.$alert('成功保存' + res.data.result + '条车辆信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/fireengine_list");
                                }
                            });
                        } else {
                            this.$alert('保存失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/fireengine_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {//修改
                    // debugger
                    this.addForm.xgrid = this.role_data.userid;
                    this.addForm.xgrmc = this.role_data.realName;
                    if(this.addForm.cllx>0){
                        this.addForm.cllx = this.addForm.cllx[this.addForm.cllx.length - 1];
                    }
                    axios.post('/dpapi/fireengine/doUpdateFireengine', this.addForm).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功修改' + res.data.result + '条车辆信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/fireengine_list");
                                }
                            });
                        } else {
                            this.$alert('修改失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/fireengine_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } 
 
        },
        //取消
        cancel: function () {
            loadDiv("basicinfo/fireengine_list");
        },
    },

})