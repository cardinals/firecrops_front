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
            //建筑选择
            buildingSearch: true,
            //建筑选择页面
            buildingListVisible: false,
            loading_building: false,
            //0新增
            status: '',
            //当前页
            currentPage_building: 1,
            //分页大小
            pageSize_building: 5,
            //总记录数
            total_building: 0,
            //新建数据
            addForm: {
                dxid: "",
                dwmc: "",//单位名称
                jxdwlx: "",//单位类型
                dwdz: "",//单位地址
                dwgk: "",//单位概况
                xzqh: [],//行政区划
                zbdh: "",//值班电话
                xfgx: [],//消防管辖
                xqfzr: "",//辖区负责人
                xqfzrdh: "",//辖区负责人电话
                lon: "",
                lat: "",
                plqkd: "",
                plqkn: "",
                plqkx: "",
                plqkb: "",
                gnfqms: "",//功能分区描述
                zdbwms: "",//重点部位描述
                zbxftd: "",//周边消防通道
                bz: "",//备注
                jzfl:"",//建筑分类
                jzxxList: [],
                xfssList:[],
                
            },
            //搜索表单
            searchForm_building: {
                jzmc: ''
            },
            //建筑form
            buildingForm: {
                jzid: "",
                jzmc: "",
                jzwz: "",
                jzsyxz: [],
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
            //新增建筑修改标识（0新增，uuid修改）
            statusAddBuilding:'',
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
            dialogTitle:"选择建筑信息",

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
                yalx: [
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
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("九小场所管理", "九小场所新增");
        } else if (type == "BJ") {
            loadBreadcrumb("九小场所管理", "九小场所编辑");
        }
        this.shiroData = shiroGlobal;
        //this.XFSSLX();//消防设施类型
        this.getAllXzqhDataTree();//行政区划
        this.XFGX();//消防管辖级联选择
        this.JXDWLX();//九小单位类型
        this.JZSYXZ();//建筑使用性质
        this.JZJG();//建筑结构
        this.JZFL();//建筑分类
    },
    mounted: function () {
        this.status = getQueryString("ID");
        //this.searchClick();
    },
    methods: {
        //行政区划级联选择数据
        getAllXzqhDataTree: function () {
            axios.get('/api/codelist/getXzqhTreeByUser').then(function (res) {
                this.allXzqhDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //消防管辖级联选择
        XFGX: function () {
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            };
            axios.post('/dpapi/xfdz/findSjdzByUser', param).then(function (res) {
                this.XFGX_dataTree = res.data.result;
                this.XFSSLX();//消防设施类型
            }.bind(this), function (error) {
                console.log(error);
            });
        },
        //九小单位类型
        JXDWLX: function(){
            axios.get('/api/codelist/getCodetype/JXDWLX').then(function (res) {
                this.JXDWLX_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //建筑使用性质
        JZSYXZ: function(){
            axios.get('/api/codelist/getDzlxTree/JZSYXZ').then(function (res) {
                this.JzsyxzDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //建筑结构
        JZJG: function(){
            axios.get('/api/codelist/getCodetype/JZJG').then(function (res) {
                this.JZJG_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //建筑分类
        JZFL: function () {
            axios.get('/api/codelist/getCodetype/JZFL').then(function (res) {
                this.jzflData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //消防设施类型
        XFSSLX: function(){
            axios.get('/api/codelist/getDzlxTree/XFSSLX').then(function (res) {
                this.XfsslxDataTree = res.data.result;
                this.searchClick();
            }.bind(this), function (error) {
                console.log(error);
            })
        }, 

        //获取建筑信息列表
        getJzxxList: function(type, index){
            if (type == 'page') {
                this.tableData_building = [];
            } else {
                if (type == 'init') {
                    this.jzIndex = index;
                    this.searchForm_building.jzmc = '';
                    this.addBuildingVisible = false;
                    this.buildingSearch = true;
                }
                this.currentPage_building = 1;
            }
            this.buildingListVisible = true;
            this.loading_building = true;
            var params = {
                jzmc: this.searchForm_building.jzmc,
                pageSize: this.pageSize_building,
                pageNum: this.currentPage_building,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid,
                jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
            };
            axios.post('/dpapi/jxcsjzxx/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage_building - 1) * this.pageSize_building);
                this.tableData_building = tableTemp.concat(res.data.result.list);
                this.total_building = res.data.result.total;
                this.loading_building = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //选择建筑，返回建筑名称和id
        selectRow_building: function (val) {
            this.addForm.jzxxList[this.jzIndex].jzid = val.jzid;
            this.addForm.jzxxList[this.jzIndex].jzmc = val.jzmc;
            this.buildingListVisible = false;
        },
        //建筑弹出页翻页
        currentPageChange_building: function (val) {
            if (this.currentPage_building != val) {
                this.currentPage_building = val;
                this.getJzxxList('page', this.jzIndex);
            }
        },

        //建筑查询条件清空
        clearJzxx: function (val) {
            this.searchForm_building.jzmc = '';
            this.getJzxxList('reset', this.jzIndex);
        },

        //建筑删除
        removeDomain: function (item) {
            var index = this.buildingForm.indexOf(item)
            if (index !== -1) {
                this.buildingForm.splice(index, 1)
            }
        },
        //建筑信息移除
        removeDomainJzxx: function(item){
            var index = this.addForm.jzxxList.indexOf(item);
            if (index !== -1) {
                this.addForm.jzxxList.splice(index, 1);
            }
            
        },
        //消防信息删除
        removeFireDomain: function (item) {
            var index = this.addForm.xfssList.indexOf(item)
            if (index !== -1) {
                this.addForm.xfssList.splice(index, 1)
            }
        },

        //建筑信息新增
        addDomainJzxx: function(){
            this.addForm.jzxxList.push({
                jzid: '',
                jzmc: '',
                key: Date.now()
            });
        },
        //新建建筑信息
        addJzxx: function(){
            this.addBuildingVisible = true;
            this.buildingSearch = false;
            this.dialogTitle = "新建建筑信息";
            this.statusAddBuilding = 0;
        },
        //建筑信息编辑跳转
        buildingEdit: function (val) {
            this.buildingSearch = false;
            this.addBuildingVisible = true;
            this.dialogTitle = "编辑建筑信息";
            this.statusAddBuilding = val.jzid;
            this.loading = true;
            axios.get('/dpapi/jxcsjzxx/' + val.jzid).then(function (res) {
                this.buildingForm = res.data.result;
                //建筑使用性质格式化
                if (this.buildingForm.jzsyxz == null) {
                    this.buildingForm.jzsyxz = [];
                }
                else if (this.buildingForm.jzsyxz.endsWith("000")) {
                    var jzsyxz = this.buildingForm.jzsyxz;
                    this.buildingForm.jzsyxz = [];
                    this.buildingForm.jzsyxz.push(jzsyxz);
                } else {
                    var jzsyxz1 = this.buildingForm.jzsyxz.substring(0, 1) + '000'
                    var jzsyxz2 = this.buildingForm.jzsyxz
                    this.buildingForm.jzsyxz = [];
                    this.buildingForm.jzsyxz.push(jzsyxz1, jzsyxz2);
                }
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
            
        },
        //关闭新建建筑页面
        cancelAddBuilding: function(){
            this.buildingForm = [];
            this.addBuildingVisible = false;
            this.buildingSearch = true;
            
        },
        //消防信息增加
        addFireDomain: function () {
            this.addForm.xfssList.push({
                xfssmc: '',
                xfsslx: [],
                wz: '',
                sl: '',
                bz: '',
                cjrid: '',
                cjrmc: '',
                cjsj: '',
                xgrid: '',
                xgrmc: '',
                xgsj: '',
                jdh: '',
                datasource:'',
                key: Date.now()
            });
        },
        
        //初始化查询
        searchClick: function () {
            this.loading1 = true;
            if (this.status == 0) {  //新增
            //    this.addForm.yazt = '01';
                this.loading1 = false;
            } else {  //修改
                //基本信息查询
                axios.get('/dpapi/jxcsjbxx/' + this.status).then(function (res) {
                    var result = res.data.result;
                    this.addForm = res.data.result;
                    //行政区划
                    var xzqhArray = [];
                    if (result.xzqh != null && result.xzqh != "" && result.xzqh.substr(2, 4) != "0000") {
                        xzqhArray.push(result.xzqh.substr(0, 2) + "0000");
                        if (result.xzqh.substr(4, 2) != "00") {
                            xzqhArray.push(result.xzqh.substr(0, 4) + "00");
                        }
                    }
                    xzqhArray.push(result.xzqh);
                    this.addForm.xzqh = xzqhArray;
                    //消防管辖
                    var xfgxArray = [];
                    var temp = this.addForm.xfgx;
                    for (var i in this.XFGX_dataTree) {
                        if (temp == this.XFGX_dataTree[i].dzid) {
                            xfgxArray.push(this.XFGX_dataTree[i].dzid);
                        } else {
                            for (var j in this.XFGX_dataTree[i].children) {
                                if (temp == this.XFGX_dataTree[i].children[j].dzid) {
                                    xfgxArray.push(this.XFGX_dataTree[i].dzid, this.XFGX_dataTree[i].children[j].dzid);
                                } else {
                                    for (var k in this.XFGX_dataTree[i].children[j].children) {
                                        if (temp == this.XFGX_dataTree[i].children[j].children[k].dzid) {
                                            xfgxArray.push(this.XFGX_dataTree[i].dzid, this.XFGX_dataTree[i].children[j].dzid, this.XFGX_dataTree[i].children[j].children[k].dzid);
                                        } else {
                                            for (var n in this.XFGX_dataTree[i].children[j].children[k].children) {
                                                if (temp == this.XFGX_dataTree[i].children[j].children[k].children[n].dzid) {
                                                    xfgxArray.push(this.XFGX_dataTree[i].dzid, this.XFGX_dataTree[i].children[j].dzid, this.XFGX_dataTree[i].children[j].children[k].dzid, this.XFGX_dataTree[i].children[j].children[k].children[n].dzid);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.addForm.xfgx = xfgxArray;
                    //doFindPhoto("JXDWLX", this.jbxxData.jxdwlx);
                    
                }.bind(this), function (error) {
                    console.log(error)
                })
                //消防设施查询
                axios.get('/dpapi/jxcsxfss/doFindXfssByDwid/' + this.status).then(function (res) {
                    this.addForm.xfssList = res.data.result;
                     //消防设施类型格式化
                    for(var i in this.addForm.xfssList){
                        var xfsslx_tmp = this.addForm.xfssList[i].xfsslx;
                        if (xfsslx_tmp != '' && xfsslx_tmp != null) {
                            if (xfsslx_tmp.endsWith("000")) {
                                var jbxx_xfsslx = xfsslx_tmp;
                                xfsslx_tmp = [];
                                xfsslx_tmp.push(jbxx_xfsslx);
                            } else {
                                var jbxx_xfsslx1 = xfsslx_tmp.substring(0, 1) + '000';
                                var jbxx_xfsslx2 = xfsslx_tmp;
                                xfsslx_tmp = [];
                                xfsslx_tmp.push(jbxx_xfsslx1, jbxx_xfsslx2);
                            }
                        } else {
                            xfsslx_tmp = [];
                        }
                        this.addForm.xfssList[i].xfsslx = xfsslx_tmp;
                    }
                    
                }.bind(this), function (error) {
                    console.log(error)
                })
                //建筑信息查询
                axios.get('/dpapi/jxcsjzxx/doFindJzxxByDwid/' + this.status).then(function (res) {
                    this.addForm.jzxxList = res.data.result;
                }.bind(this), function (error) {
                    console.log(error)
                })
                //附件查询
                axios.get('/dpapi/yafjxz/doFindByPlanId/' + this.status).then(function (res) {
                    // var name = res.data.result[0].wjm;
                    // var url = "http://localhost:80/upload/" + res.data.result[0].xzlj
                    if (res.data.result.length > 0) {
                        this.fileList = [{
                            uuid: res.data.result[0].uuid,
                            name: res.data.result[0].wjm,
                            url: baseUrl + "/upload/" + res.data.result[0].xzlj
                        }]
                    }

                }.bind(this), function (error) {
                    console.log(error)
                })
                this.upLoadData.yaid = this.status;
                this.loading1 = false;
            }
        },
        
        //保存/提交前校验
        checkedBefore: function () {
            if (this.addForm.dwmc == null || this.addForm.dwmc == "") {
                this.$message.warning({
                    message: "请填写单位名称！",
                    showClose: true
                });
                return false;
            } else if (this.addForm.jxdwlx == []) {
                this.$message.warning({
                    message: "选择九小单位类型！",
                    showClose: true
                });
                return false;
            }  else if (this.addForm.xfgx == [] ||this.addForm.xfgx.length == 0) {
                this.$message.warning({
                    message: "请选择消防管辖！",
                    showClose: true
                });
                return false;
            }
            
            for (var i = 0; i < this.addForm.jzxxList.length; i++) {
                if (this.addForm.jzxxList[i].jzmc == "") {
                    this.$message.warning({
                        message: "请选择/填写单位建筑情况" + (i + 1) + "的单位名称! 或删除空白单位建筑情况！",
                        showClose: true
                    });
                    return false;
                }
            }
            for (var i = 0; i < this.addForm.xfssList.length; i++) {
                if (this.addForm.xfssList[i].xfssmc == "") {
                    this.$message.warning({
                        message: "请填写消防设施" + (i + 1) + "的消防设施名称! 或删除空白消防设施！",
                        showClose: true
                    });
                    return false;
                }
            }
            return true;
        },
        //点击保存事件
        /** 
        save: function (formName) {
            if (this.checkedBefore() == true) {
                if (this.status == 0) {//新增
                    var params = {
                        dxid: this.addForm.dxid,
                        dwmc: this.addForm.dwmc,
                        jxdwlx: this.addForm.jxdwlx,
                        dwdz: this.addForm.dwdz,
                        dwgk: this.addForm.dwgk,
                        bz: this.addForm.bz,
                        buildingList: this.buildingForm,
                        zzrid: this.shiroData.userid,
                        zzrmc: this.shiroData.realName,
                        jgid: this.shiroData.organizationVO.uuid,
                        jgbm: this.shiroData.organizationVO.jgid,
                        jgmc: this.shiroData.organizationVO.jgmc,
                        jdh: this.shiroData.organizationVO.jgid
                    };
                    axios.post('/dpapi/digitalplanlist/insertByVO', params).then(function (res) {
                        //this.upLoadData.yaid = res.data.result.uuid;
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
                        buildingList: this.buildingForm,
                        zzrid: this.shiroData.userid,
                        zzrmc: this.shiroData.realName,
                        jdh: this.shiroData.organizationVO.jgid
                    };
                    axios.post('/dpapi/digitalplanlist/doUpdateByVO', params).then(function (res) {
                        if (this.isFile) {
                            var params1 = {
                                yaid: this.status,
                                deleteFlag: 'Y',
                                xgsj: '1',
                                xgrid: this.shiroData.userid,
                                xgrmc: this.shiroData.realName
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
        */
        //提交点击事件
        submit: function (formName) {
            if (this.checkedBefore() == true) {
                this.getXfsslx();
                if (this.status == 0) { //新增
                    var params = {
                      //  dxid: this.addForm.dxid,
                        dwmc: this.addForm.dwmc,
                        jxdwlx: this.addForm.jxdwlx,
                        dwdz: this.addForm.dwdz,//单位地址
                        dwgk: this.addForm.dwgk,//单位概况
                        xzqh: this.addForm.xzqh[this.addForm.xzqh.length -1],//行政区划
                        zbdh: this.addForm.zbdh,//值班电话
                        xfgx: this.addForm.xfgx[this.addForm.xfgx.length -1],//消防管辖
                        xqfzr: this.addForm.xqfzr,//辖区负责人
                        xqfzrdh: this.addForm.xqfzrdh,//辖区负责人电话
                        jzfl: this.addForm.jzfl,//建筑分类
                        jzsl: this.addForm.jzxxList.length,//建筑数量
                        zdmj: this.addForm.zdmj,//占地面积
                        jzmj: this.addForm.jzmj,//建筑面积
                        lon: this.addForm.lon,
                        lat: this.addForm.lat,
                        plqkd: this.addForm.plqkd,
                        plqkn: this.addForm.plqkn,
                        plqkx: this.addForm.plqkx,
                        plqkb: this.addForm.plqkb,
                        gnfqms: this.addForm.gnfqms,//功能分区描述
                        zdbwms: this.addForm.zdbwms,//重点部位描述
                        zbxftd: this.addForm.zbxftd,//周边消防通道
                        bz: this.addForm.bz,//备注
                        cjrid: this.shiroData.userid,
                        cjrmc: this.shiroData.realName,
                        jzxxList: this.addForm.jzxxList,//建筑信息
                        xfssList: this.addForm.xfssList,//消防设施
                        datasource: this.shiroData.organizationVO.jgid,
                        jdh:this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                        sjzt: '03',     //数据状态（01编辑中，03待审批，04已驳回，05已审批）
                        shzt: '01'      //审核状态（01未审核，02未通过。03已通过，99其他）
                    };
                    axios.post('/dpapi/jxcsjbxx/doInsertByVo', params).then(function (res) {
                        //this.upLoadData.yaid = res.data.result.uuid;
                        if (this.isFile) {
                            this.submitUpload();//附件上传
                        } else {
                            this.$message({
                                message: "成功保存并提交",
                                showClose: true
                            });
                            loadDiv("jxcsplan/jxcsplan_list");
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else { //修改
                    var params = {
                        uuid: this.addForm.uuid,
                        dwmc: this.addForm.dwmc,
                        jxdwlx: this.addForm.jxdwlx,
                        dwdz: this.addForm.dwdz,//单位地址
                        dwgk: this.addForm.dwgk,//单位概况
                        xzqh: this.addForm.xzqh[this.addForm.xzqh.length -1],//行政区划
                        zbdh: this.addForm.zbdh,//值班电话
                        xfgx: this.addForm.xfgx[this.addForm.xfgx.length -1],//消防管辖
                        xqfzr: this.addForm.xqfzr,//辖区负责人
                        xqfzrdh: this.addForm.xqfzrdh,//辖区负责人电话
                        jzfl: this.addForm.jzfl,//建筑分类
                        jzsl: this.addForm.jzxxList.length,//建筑数量
                        zdmj: this.addForm.zdmj,//占地面积
                        jzmj: this.addForm.jzmj,//建筑面积
                        lon: this.addForm.lon,
                        lat: this.addForm.lat,
                        plqkd: this.addForm.plqkd,
                        plqkn: this.addForm.plqkn,
                        plqkx: this.addForm.plqkx,
                        plqkb: this.addForm.plqkb,
                        gnfqms: this.addForm.gnfqms,//功能分区描述
                        zdbwms: this.addForm.zdbwms,//重点部位描述
                        zbxftd: this.addForm.zbxftd,//周边消防通道
                        bz: this.addForm.bz,//备注
                        datasource: this.shiroData.organizationVO.jgid,
                        jdh:this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                        jzxxList: this.addForm.jzxxList,//建筑信息
                        xfssList: this.addForm.xfssList,//消防设施
                        xgrid: this.shiroData.userid,
                        xgrmc: this.shiroData.realName,
                        sjzt: '03',     //数据状态（01编辑中，03待审批，04已驳回，05已审批）
                        shzt: '01'      //审核状态（01未审核，02未通过。03已通过，99其他）
                    };
                    axios.post('/dpapi/jxcsjbxx/doUpdateJxcsByVO', params).then(function (res) {
                        if (this.isFile) {
                            var params1 = {
                                yaid: this.status,
                                deleteFlag: 'Y',
                                xgsj: '1',
                                xgrid: this.shiroData.userid,
                                xgrmc: this.shiroData.realName
                            };
                            axios.post('/dpapi/yafjxz/doUpdateByVO', params1).then(function (res) {
                                this.submitUpload();//附件上传
                            }.bind(this), function (error) {
                                console.log(error);
                            })
                        } else {
                            this.$message({
                                message: "成功保存九小场所信息",
                                showClose: true
                            });
                            loadDiv("jxcsplan/jxcsplan_list");
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
        cancel: function () {
            loadDiv("jxcsplan/jxcsplan_list");
        },
        //新增建筑提交
        submitBuildingForm: function(){
            if (this.buildingForm.jzmc == null || this.buildingForm.jzmc == "") {
                this.$message.warning({
                    message: "请填写建筑名称！",
                    showClose: true
                });
            }else{
                var jzsyxzString = "";
                if (this.buildingForm.jzsyxz != "" && this.buildingForm.jzsyxz.length > 0) {
                    jzsyxzString = this.buildingForm.jzsyxz[this.buildingForm.jzsyxz.length - 1];
                }
                var params = {
                    jzmc: this.buildingForm.jzmc,//建筑名称
                    jzwz: this.buildingForm.jzwz,//建筑位置
                    jzsyxz: jzsyxzString,//建筑使用性质
                    jzjg: this.buildingForm.jzjg,//建筑结构
                    zdmj: this.buildingForm.zdmj,//占地面积
                    jzmj: this.buildingForm.jzmj,//建筑面积
                    dsgd: this.buildingForm.dsgd,//地上高度
                    dxgd: this.buildingForm.dxgd,//地下高度
                    dscs: this.buildingForm.dscs,//地上层数
                    dxcs: this.buildingForm.dxcs,//底下层数
                    bnc: this.buildingForm.bnc,//避难层
                    yjddsc: this.buildingForm.yjddsc,//预计到达时长
                    xqxclx: this.buildingForm.xqxclx,//辖区行车路线
                    gnms: this.buildingForm.gnms,//功能描述
                    bz: this.buildingForm.bz,//备注
                };
                if (this.statusAddBuilding == 0) { //新增
                    var params0 = {
                        cjrid: this.shiroData.userid,
                        cjrmc: this.shiroData.realName,
                        jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                        datasource: this.shiroData.organizationVO.jgid,
                    };
                    Object.assign(params, params0);
                    axios.post('/dpapi/jxcsjzxx/doInsertBuildingByVO', params).then(function (res) {
                        if (res.data.result != null) {
                            this.$alert('保存成功', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    var val={
                                        jzid:res.data.result.jzid,
                                        jzmc:res.data.result.jzmc,
                                    }
                                    this.selectRow_building(val);
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
                } else { //修改
                    var params0 = {
                        jzid: this.buildingForm.jzid,
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
            }
        },
        //消防设施类型转换
        getXfsslx: function(){
            for(var i in this.addForm.xfssList){
                var length = this.addForm.xfssList[i].xfsslx.length;
                this.addForm.xfssList[i].xfsslx = this.addForm.xfssList[i].xfsslx[length - 1];
            }
        },
        //附件上传
        submitUpload: function () {
            this.$refs.upload.submit();
        },
        //附件上传成功回调方法
        handleSuccess: function (response, file, fileList) {
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
        handleRemove: function (file, fileList) {
            var fs = document.getElementsByName('file');
            if (fs.length > 0) {
                fs[0].value = null
            }
            console.log(file, fileList);
            this.isFile = false;
        },
        handlePreview: function (file) {
            console.log(file);
        },
        handleChange: function (file, fileList) {
            if (fileList.length == 1) {
                const isZip = file.name.endsWith("zip");
                const isRAR = file.name.endsWith("rar");
                if (isZip) {
                    this.isFile = true;
                }
                else {
                    this.$message.error('仅可上传zip格式压缩文件!');
                    this.fileList.splice(0, this.fileList.length);
                }

            } else if (fileList.length > 1) {
                this.$message.warning('当前限制上传 1 个压缩文件');
                fileList.splice(1, fileList.length - 1);
            }
        },
        ifShowDown: function (val) {
            var templete = $('.templete'),
                space = $('.space'),
                $this = $(this);
            if (val == '03') {
                templete.css('display', 'block');
                space.css('display', 'none');
            } else {
                templete.css('display', 'none');
                space.css('display', 'block');
            }
        },
        templeteDown: function (val) {
            window.open(baseUrl + "/dpapi/yafjxz/downTemplet");
        }
    },

})