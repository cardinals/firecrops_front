//加载面包屑
window.onload = function () {
    var type = getQueryString("type");
    if (type == "XZ") {
        loadBreadcrumb("消防车辆管理", "消防车辆管理新增");
    } else if (type == "BJ") {
        loadBreadcrumb("消防车辆管理", "消防车辆管理编辑");
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
            allXzqhDataTree: [],
            allStatesData: [],
            //新建数据
            addForm: {
                //新信息
                sccj: "",
                xzqh: [],	//行政区划
                sccj: "",	//生产厂家
                jglgd: '0.00',	//举高类车辆高度(m)
                sbll: '0.00',	//水泵流量(L/s)
                zsl: '0.00',	 //载水量(t)
                xfpll: '0.00',	//消防炮流量(L/s)
                sbedyl: '0.00',	//水泵额定压力(Mpa)
                czmhjlb: "",	//车载灭火剂类别
                czmhjl: '0.00',//车载灭火剂量(t)
                mhjhhb: "",//灭火剂混合比
                clmc: "",
                gisX: '0.00',//
                gisY: '0.00',//
                ssdz: [],//所属队站
                cllx: [],//车辆类型
                clzt: "",
                cphm: "",
                clbm: "",
                gpsbh: "",
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: "",
                bz: ''
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
            detailVisible: false,
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

            //所属队站
            ssdzProps: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid'
            },
        }
    },
    created: function () {

        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("消防车辆管理", "消防车辆管理新增");
        } else if (type == "BJ") {
            loadBreadcrumb("消防车辆管理", "消防车辆管理编辑");
        }

        this.searchClick('click');
        this.getAllTypesData();
        this.getAllStatesData();
        this.getAllXzqhDataTree();
        // this.getAllTeamsData();
        this.roleData();
    },
    mounted: function () {
        this.status = getQueryString("ID");
        // var url = location.search;
        // if (url.indexOf("?") != -1) {
        //     var str = url.substr(1);
        //     this.status = str.substring(3);
        // }
        // this.searchClick();
    },
    methods: {
        //当前登录用户信息
        roleData: function () {
            axios.post('/api/shiro').then(function (res) {
                this.role_data = res.data;
                this.getAllTeamsData();
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //初始化查询
        searchClick: function (type) {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else { //修改
                axios.get('/dpapi/fireengine/' + this.status).then(function (res) {
                    //修改存在问题
                    this.addForm = res.data.result;
                    //车辆类型格式化
                    if (this.addForm.cllx != '' && this.addForm.cllx != null) {
                        if (this.addForm.cllx.endsWith("000000")) {
                            var cllx = this.addForm.cllx;
                            this.addForm.cllx = [];
                            this.addForm.cllx.push(cllx);
                        } else if (this.addForm.cllx.endsWith("0000")) {
                            var cllx1 = this.addForm.cllx.substring(0, 2) + '000000';
                            var cllx2 = this.addForm.cllx;
                            this.addForm.cllx = [];
                            this.addForm.cllx.push(cllx1, cllx2);
                        } else if (this.addForm.cllx.endsWith("00")) {
                            var cllx1 = this.addForm.cllx.substring(0, 2) + '000000';
                            var cllx2 = this.addForm.cllx.substring(0, 4) + '0000';
                            var cllx3 = this.addForm.cllx;
                            this.addForm.cllx = [];
                            this.addForm.cllx.push(cllx1, cllx2,cllx3);
                        }else {
                            var cllx1 = this.addForm.cllx.substring(0, 2) + '000000';
                            var cllx2 = this.addForm.cllx.substring(0, 4) + '0000';
                            var cllx3 = this.addForm.cllx.substring(0, 4) + '00';
                            var cllx4 = this.addForm.cllx;
                            this.addForm.cllx = [];
                            this.addForm.cllx.push(cllx1, cllx2,cllx3,cllx4);
                        }
                    }else {
                        this.addForm.cllx = [];
                    }
                    //行政区划格式化
                    if (this.addForm.xzqh != '' && this.addForm.xzqh != null) {
                        if (this.addForm.xzqh.endsWith("0000")) {
                            var xzqh = this.addForm.xzqh;
                            this.addForm.xzqh = [];
                            this.addForm.xzqh.push(xzqh);
                        } else if (this.addForm.xzqh.endsWith("00")) {
                            var xzqh1 = this.addForm.xzqh.substring(0, 2) + '0000';
                            var xzqh2 = this.addForm.xzqh;
                            this.addForm.xzqh = [];
                            this.addForm.xzqh.push(xzqh1, xzqh2);
                        } else {
                            var xzqh1 = this.addForm.xzqh.substring(0, 2) + '0000';
                            var xzqh2 = this.addForm.xzqh.substring(0, 4) + '00';
                            var xzqh3 = this.addForm.xzqh;
                            this.addForm.xzqh = [];
                            this.addForm.xzqh.push(xzqh1, xzqh2, xzqh3);
                        }
                    } else {
                        this.addForm.xzqh = [];
                    }
                    //队站格式化
                    if (this.addForm.ssdz != '' && this.addForm.ssdz != null) {
                        for (var i in this.allTeamsData) {
                            if (this.allTeamsData[i].dzid == this.addForm.ssdz) {
                                var ssdz = this.addForm.ssdz;
                                this.addForm.ssdz = [];
                                this.addForm.ssdz.push(ssdz);
                            } else {
                                for (var k in this.allTeamsData[i].children) {
                                    if (this.allTeamsData[i].children[k].dzid == this.addForm.ssdz) {
                                        var ssdz1 = this.allTeamsData[i].dzid;
                                        var ssdz2 = this.allTeamsData[i].children[k].dzid;
                                        this.addForm.ssdz = [];
                                        this.addForm.ssdz.push(ssdz1, ssdz2);
                                    } else {
                                        for (var j in this.allTeamsData[i].children[k].children) {
                                            if (this.allTeamsData[i].children[k].children[j].dzid == this.addForm.ssdz) {
                                                var ssdz1 = this.allTeamsData[i].dzid;
                                                var ssdz2 = this.allTeamsData[i].children[k].dzid;
                                                var ssdz3 = this.allTeamsData[i].children[k].children[j].dzid;
                                                this.addForm.ssdz = [];
                                                this.addForm.ssdz.push(ssdz1, ssdz2, ssdz3);
                                            } else {
                                                for (var s in this.allTeamsData[i].children[k].children[j].children) {
                                                    if (this.allTeamsData[i].children[k].children[j].children[s].dzid == this.addForm.ssdz) {
                                                        var ssdz1 = this.allTeamsData[i].dzid;
                                                        var ssdz2 = this.allTeamsData[i].children[k].dzid;
                                                        var ssdz3 = this.allTeamsData[i].children[k].children[j].dzid;
                                                        var ssdz4 = this.allTeamsData[i].children[k].children[j].children[s].dzid;
                                                        this.addForm.ssdz = [];
                                                        this.addForm.ssdz.push(ssdz1, ssdz2, ssdz3, ssdz4);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        this.addForm.ssdz = [];
                    }
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })

            }
        },
        //行政区划级联选择器数据
        getAllXzqhDataTree: function () {
            axios.get('/api/codelist/getXzqhTreeByUser').then(function (res) {
                this.allXzqhDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //根据参数部分和参数名来获取参数值 
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        //获取所有车辆类型
        getAllTypesData: function () {
            axios.post('/api/codelist/getYjlxTree/CLLX').then(function (res) {
                this.allTypesData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //获取所有车辆状态
        getAllStatesData: function () {
            var params = {
                codetype: "CLZT",
                list: [2, 4]
            };
            axios.post('/api/codelist/getCodelisttree', params).then(function (res) {
                this.allStatesData = res.data.result;
            }.bind(this), function (error) {
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
                    this.searchClick();
                }.bind(this), function (error) {
                    console.log(error);
                })
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //对数据进行校验

        jglgdChange: function (value) {
            if (!(/(^\d+$)/.test(value.replace(".", "")))) {
                this.$message.warning({
                    message: "请输入数字或小数！",
                    showClose: true
                });
                this.addForm.jglgd = '';
            } 
        },
        sbllChange: function (value) {
            if (!(/(^\d+$)/.test(value.replace(".", "")))) {
                this.$message.warning({
                    message: "请输入数字或小数！",
                    showClose: true
                });
                this.addForm.sbll = '';
            } 
        },
        zslChange: function (value) {
            if (!(/(^\d+$)/.test(value.replace(".", "")))) {
                this.$message.warning({
                    message: "请输入数字或小数！",
                    showClose: true
                });
                this.addForm.zsl = '';
            } 
        },
        xfpllChange: function (value) {
            if (!(/(^\d+$)/.test(value.replace(".", "")))) {
                this.$message.warning({
                    message: "请输入数字或小数！",
                    showClose: true
                });
                this.addForm.xfpll = '';
            } 
        },
        sbedylChange: function (value) {
            if (!(/(^\d+$)/.test(value.replace(".", "")))) {
                this.$message.warning({
                    message: "请输入数字或小数！",
                    showClose: true
                });
                this.addForm.sbedyl = '';
            } 
        },
        czmhjlChange: function (value) {
            if (!(/(^\d+$)/.test(value.replace(".", "")))) {
                this.$message.warning({
                    message: "请输入数字或小数！",
                    showClose: true
                });
                this.addForm.czmhjl = '';
            } 
        },
        gisXChange: function (value) {
            if (!(/(^\d+$)/.test(value.replace(".", "")))) {
                this.$message.warning({
                    message: "请输入数字或小数！",
                    showClose: true
                });
                this.addForm.gisX = '';
            } 
        },
        gisYChange: function (value) {
            if (!(/(^\d+$)/.test(value.replace(".", "")))) {
                this.$message.warning({
                    message: "请输入数字或小数！",
                    showClose: true
                });
                this.addForm.gisY = '';
            } 
        },
        pickerOptions0: {
            disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
            }
        },
        //点击保存事件
        save: function () {
            //必填项
            if (this.addForm.ssdz == null || this.addForm.ssdz == "") {
                this.$message.warning({
                    message: "请选择所属队站！",
                    showClose: true
                });
                return false;
            } else if (this.addForm.cllx == null || this.addForm.cllx == "") {
                this.$message.warning({
                    message: "请选择车辆类型！",
                    showClose: true
                });
                return false;
            } 
            else if (this.addForm.clmc == null || this.addForm.clmc == "") {
                this.$message.warning({
                    message: "请填写车辆名称！",
                    showClose: true
                });
                return false;
            } 
            else if (this.addForm.cphm == null || this.addForm.cphm == "") {
                this.$message.warning({
                    message: "请填写车牌号码！",
                    showClose: true
                });
                return false;
            } else {

                if (this.status == 0) {//新增
                    this.addForm.cjrid = this.role_data.userid;
                    this.addForm.cjrmc = this.role_data.realName;
                    if (this.addForm.cllx.length > 0) {
                        this.addForm.cllx = this.addForm.cllx[this.addForm.cllx.length - 1];
                    } else {
                        this.addForm.cllx = '';
                    }
                    if (this.addForm.xzqh.length > 0) {
                        this.addForm.xzqh = this.addForm.xzqh[this.addForm.xzqh.length - 1];
                    } else {
                        this.addForm.xzqh = '';
                    }
                    if (this.addForm.ssdz.length > 0) {
                        this.addForm.ssdz = this.addForm.ssdz[this.addForm.ssdz.length - 1];
                    } else {
                        this.addForm.ssdz = '';
                    }
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

                    this.addForm.xgrid = this.role_data.userid;
                    this.addForm.xgrmc = this.role_data.realName;
                    if (this.addForm.cllx.length > 0) {
                        this.addForm.cllx = this.addForm.cllx[this.addForm.cllx.length - 1];
                    } else {
                        this.addForm.cllx = '';
                    }
                    if (this.addForm.xzqh.length > 0) {
                        this.addForm.xzqh = this.addForm.xzqh[this.addForm.xzqh.length - 1];
                    } else {
                        this.addForm.xzqh = '';
                    }
                    if (this.addForm.ssdz.length > 0) {
                        this.addForm.ssdz = this.addForm.ssdz[this.addForm.ssdz.length - 1];
                    } else {
                        this.addForm.ssdz = '';
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
            }
        },
        //取消
        cancel: function () {
            loadDiv("basicinfo/fireengine_list");
        },
        
    },

})