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
                xzqh: "",//行政区划
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
                jzxxList: [],
                xfssList:[],
                jzfl:""
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
        this.getAllXzqhDataTree();//行政区划
        this.XFGX();//消防管辖级联选择
        this.JXDWLX();//九小单位类型
        this.JZSYXZ();//建筑使用性质
        this.JZJG();//建筑结构
        this.XFSSLX();//消防设施类型
        this.JZFL();//建筑分类
    },
    mounted: function () {
        this.status = getQueryString("ID");
        this.searchClick();
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
                }
                this.currentPage_building = 1;
            }
            this.buildingListVisible = true;
            this.loading_building = true;
            var params = {
                jzmc: this.searchForm_building.jzmc,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2) + '000000',
                pageSize: this.pageSize_building,
                pageNum: this.currentPage_building,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/building/page', params).then(function (res) {
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
        clearJzxxList: function (val) {
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

        //建筑信息增加
        /** 
        addDomain: function () {
            this.buildingForm.push({
                zqbw: '',
                zdbwid: '',
                jzmc: '',
                jzid: '',
                rswz: [],
                zqdj: [],
                qhyy: '',
                rsmj: '',
                zhcs: '',
                gyjzhzwxx: '',
                qhbwgd: '',
                zqms: '',
                zqsdyj: '', 
                keypointsMap: {
                    zsyd: '',
                    tbjs: '',
                },
                key: Date.now()
            });
        },
        */
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
        },
        //关闭新建建筑页面
        cancelAddBuilding: function(){
            this.buildingForm = [];
            this.addBuildingVisible = false;
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
                key: Date.now()
            });
        },
        
        //初始化查询
        searchClick: function () {
            this.loading1 = true;
            if (this.status == 0) {  //新增
                this.addForm.yazt = '01';
                this.loading1 = false;
            } else {  //修改
                //预案基本信息查询
                axios.get('/dpapi/digitalplanlist/' + this.status).then(function (res) {
                    this.addForm = res.data.result;
                    //预案类型格式化
                    if (this.addForm.yalx.endsWith("0000")) {
                        var yalx = this.addForm.yalx;
                        this.addForm.yalx = [];
                        this.addForm.yalx.push(yalx);
                    } else {
                        var yalx1 = this.addForm.yalx.substring(0, 1) + '0000'
                        var yalx2 = this.addForm.yalx
                        this.addForm.yalx = [];
                        this.addForm.yalx.push(yalx1, yalx2);
                    }
                    //行政区划赋值
                    axios.get('/dpapi/importantunits/' + this.addForm.dxid).then(function (res) {
                        this.addForm.xzqh = res.data.result.xzqh;
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                }.bind(this), function (error) {
                    console.log(error)
                })
                //灾情设定查询
                axios.get('/dpapi/disasterset/doFindByPlanId/' + this.status).then(function (res) {
                    this.buildingForm = res.data.result;
                    for (var i = 0; i < this.buildingForm.length; i++) {
                        //燃烧物质
                        if (this.buildingForm[i].rswz != null && this.buildingForm[i].rswz != "") {
                            if (this.buildingForm[i].rswz.endsWith("00")) {
                                var rswz = this.buildingForm[i].rswz;
                                this.buildingForm[i].rswz = [];
                                this.buildingForm[i].rswz.push(rswz);
                            } else {
                                var rswz1 = this.buildingForm[i].rswz.substring(0, 1) + '00'
                                var rswz2 = this.buildingForm[i].rswz
                                this.buildingForm[i].rswz = [];
                                this.buildingForm[i].rswz.push(rswz1, rswz2);
                            }
                        } else {
                            this.buildingForm[i].rswz = [];
                        }
                        //灾情等级
                        if (this.buildingForm[i].zqdj != null && this.buildingForm[i].zqdj != "") {
                            if (this.buildingForm[i].zqdj.endsWith("00")) {
                                var zqdj = this.buildingForm[i].zqdj;
                                this.buildingForm[i].zqdj = [];
                                this.buildingForm[i].zqdj.push(zqdj);
                            } else {
                                var zqdj1 = this.buildingForm[i].zqdj.substring(0, 2) + '00'
                                var zqdj2 = this.buildingForm[i].zqdj
                                this.buildingForm[i].zqdj = [];
                                this.buildingForm[i].zqdj.push(zqdj1, zqdj2);
                            }
                        } else {
                            this.buildingForm[i].zqdj = [];
                        }
                    }
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
            }  else if (this.addForm.xfgx == []) {
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
        //提交点击事件
        submit: function (formName) {
            if (this.checkedBefore() == true) {
                if (this.status == 0) { //新增
                    var params = {
                      //  dxid: this.addForm.dxid,
                        dwmc: this.addForm.dwmc,
                        jxdwlx: this.addForm.jxdwlx,
                        dwdz: this.addForm.dwdz,//单位地址
                        dwgk: this.addForm.dwgk,//单位概况
                        xzqh: this.addForm.xzqh,//行政区划
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
                        
                        jdh: this.shiroData.organizationVO.jgid
                        
                    };debugger;
                    axios.post('/dpapi/jxcsjbxx/doInsertByVo', params).then(function (res) {
                        this.upLoadData.yaid = res.data.result.uuid;
                        if (this.isFile) {
                            this.submitUpload();//附件上传
                        } else {
                            this.$message({
                                message: "成功保存并提交预案信息",
                                showClose: true
                            });
                            loadDiv("digitalplan/digitalplan_list");
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