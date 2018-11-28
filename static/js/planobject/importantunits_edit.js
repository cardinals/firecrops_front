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
            uuid: "",
            //编辑表单
            editForm: {
                dwmc: '',
                dwxz: '',
                dwdz: '',
                xzqh: '',
                fhdj: '',
                zbdh: '',
                dwgk: '',
                gisX: '',
                gisY: '',
                lon: '',
                lat: '',
                plqkd: '',
                plqkn: '',
                plqkx: '',
                plqkb: '',
                fhdzid: '',
                mhdzid: '',
                xfzrr: '',
                xfzrrdh: '',
                xfglr: '',
                xfglrdh: '',
                xfllList: [],
                xfsssl: '',
                jzfl: '',
                jzsl: '',
                zdmj: '',
                jzmj: '',
                jzxxList: [],
                zdbwList: [],
                bz: "",
                jdh: "",
                //创建人、修改人
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: "",
            },
            //消防队站下拉框Data
            xfdzData: [],
            //单位性质下拉框Data
            dwxzData: [],
            //行政区划下拉框Data
            xzqhData: [],
            //防火等级下拉框Data
            fhdjData: [],
            //建筑分类下拉框Data
            jzflData: [],
            //单位消防队伍类型下拉框
            xfdwlxData: [{ codeName: '企业专职消防队', codeValue: '0A01' }, { codeName: '微型消防站', codeValue: '0A03' }],
            //重点部位类型下拉框
            zdbwlxData: [],
            //使用性质下拉框
            syxzData: [],
            //建筑机构下拉框
            jzjgData: [],
            //储罐类型
            cglxData: [],
            //建筑信息弹出框--------------------------------
            buildingListVisible: false,
            loading_building: false,
            //建筑序号：
            jzIndex: '',
            //当前页
            currentPage_building: 1,
            //分页大小
            pageSize_building: 5,
            //总记录数
            total_building: 0,
            //搜索表单
            searchForm_building: {
                jzmc: ''
            },
            //选择建筑弹出框Table数据
            tableData_building: [],
            //选择建筑弹出框Table高度
            tableheight_buliding: 243,
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
            xfdzProps: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid'
            },
            //信息校验规则
            inforRules: {
                dwmc: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
                dwxz: [{ required: true, message: '请选择单位性质', trigger: 'change' }],
                fhdj: [{ required: true, message: '请选择防火等级', trigger: 'change' }],
                fhdzid: [{
                    validator: (rule, value, callback) => {
                        if (value.length == 0) {
                            callback(new Error("请选择单位防火管辖大队"));
                        } else {
                            callback();
                        }

                    }, trigger: 'change'
                }],
                mhdzid: [{
                    validator: (rule, value, callback) => {
                        if (value.length == 0) {
                            callback(new Error("请选择单位灭火责任队站"));
                        } else {
                            callback();
                        }

                    }, trigger: 'change'
                }],
                zdbwmc: [{ required: true, message: '请输入重点部位名称', trigger: 'blur' }],
                zdbwlx: [{ required: true, message: '请选择重点部位类型', trigger: 'change' }],
                xfdwrs: [{ pattern: /^[1-9]\d*|0$/, message: '消防队伍人数应为正整数', trigger: 'blur' }],
                xfdwcls: [{ pattern: /^[1-9]\d*|0$/, message: '消防队伍车辆数应为正整数', trigger: 'blur' }],
                jzsl: [{ pattern: /^[1-9]\d*|0$/, message: '建筑数量应为正整数', trigger: 'blur' }],
            },
            //当前登陆用户
            shiroData: [],
        }
    },
    created: function () {
        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("重点单位", "重点单位新增");
        } else if (type == "BJ") {
            loadBreadcrumb("重点单位", "重点单位编辑");
        }
        /**当前登陆用户 by li.xue 20180808 */
        this.shiroData = shiroGlobal;
        this.status = getQueryString("ID");
        this.getDwxzData();
        this.getFhdjData();
        this.getXzqhData();
        this.getJzflData();
        this.getXfdzData();
    },
    methods: {
        //获取重点单位详情
        getDetails: function () {
            this.loading = true;
            axios.get('/dpapi/importantunits/' + this.status).then(function (res) {
                var result = res.data.result
                this.editForm = result;
                //行政区划
                var xzqhArray = [];
                if (result.xzqh != null && result.xzqh != "") {
                    if (result.xzqh.substr(2, 4) != "0000") {
                        xzqhArray.push(result.xzqh.substr(0, 2) + "0000");
                        if (result.xzqh.substr(4, 2) != "00") {
                            xzqhArray.push(result.xzqh.substr(0, 4) + "00");
                        }
                    }
                    xzqhArray.push(this.editForm.xzqh);
                }
                this.editForm.xzqh = xzqhArray;
                //防火队站
                this.editForm.fhdzid = this.getXfdzArray(result.fhdzid);
                //灭火队站
                this.editForm.mhdzid = this.getXfdzArray(result.mhdzid);

                //根据重点单位ID获取消防队伍信息
                this.getXfllListByZddwId(this.status);

                //根据重点单位ID获取单位建筑信息
                this.getJzxxListByZddwId(this.status);

                //根据重点单位ID获取重点部位信息
                this.getZdbwListByZddwId(this.status);

                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //获取消防队站级联下拉框数组Array
        getXfdzArray: function (temp) {
            var xfdzArray = [];
            if (temp != null && temp != "") {
                for (var i in this.xfdzData) {
                    if (temp == this.xfdzData[i].dzid) {
                        xfdzArray.push(this.xfdzData[i].dzid);
                    } else {
                        for (var j in this.xfdzData[i].children) {
                            if (temp == this.xfdzData[i].children[j].dzid) {
                                xfdzArray.push(this.xfdzData[i].dzid, this.xfdzData[i].children[j].dzid);
                            } else {
                                for (var k in this.xfdzData[i].children[j].children) {
                                    if (temp == this.xfdzData[i].children[j].children[k].dzid) {
                                        xfdzArray.push(this.xfdzData[i].dzid, this.xfdzData[i].children[j].dzid, this.xfdzData[i].children[j].children[k].dzid);
                                    } else {
                                        for (var n in this.xfdzData[i].children[j].children[k].children) {
                                            if (temp == this.xfdzData[i].children[j].children[k].children[n].dzid) {
                                                xfdzArray.push(this.xfdzData[i].dzid, this.xfdzData[i].children[j].dzid, this.xfdzData[i].children[j].children[k].dzid, this.xfdzData[i].children[j].children[k].children[n].dzid);
                                            }else {
                                                for (var m in this.xfdzData[i].children[j].children[k].children[n].children) {
                                                    if (temp == this.xfdzData[i].children[j].children[k].children[n].children[m].dzid) {
                                                        xfdzArray.push(this.xfdzData[i].dzid, this.xfdzData[i].children[j].dzid, this.xfdzData[i].children[j].children[k].dzid, this.xfdzData[i].children[j].children[k].children[n].dzid, this.xfdzData[i].children[j].children[k].children[n].children[m].dzid);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return xfdzArray;
        },

        //根据重点单位ID获取消防队伍信息
        getXfllListByZddwId: function (zddwid) {
            axios.get('/dpapi/importantunits/doFindXfllListByZddwId/' + zddwid).then(function (res) {
                this.editForm.xfllList = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //根据重点单位ID获取重点单位建筑信息
        getJzxxListByZddwId: function (zddwId) {
            axios.get('/dpapi/importantunits/doFindJzxxListByZddwId/' + zddwId).then(function (res) {
                this.editForm.jzxxList = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //根据重点单位ID获取重点部位信息
        getZdbwListByZddwId: function (zddwId) {
            axios.get('/dpapi/importantparts/doFindZdbwListByZddwId/' + zddwId).then(function (res) {
                if (res.data.result.length > 0) {
                    //重点部位类型
                    this.getZdbwlxData();
                    //使用性质
                    this.getSyxzData();
                    //建筑结构
                    this.getJzjgData();
                    //储罐类型
                    this.getCglxData();
                }
                this.editForm.zdbwList = res.data.result;
                //重点部位类型不能修改
                for (var i in this.editForm.zdbwList) {
                    this.editForm.zdbwList[i].zdbwlxDisabled = false;
                    switch (this.editForm.zdbwList[i].zdbwlx) {
                        case "10":
                            this.editForm.zdbwList[i].zzl = [];
                            this.editForm.zdbwList[i].cgl = [];
                            if (this.editForm.zdbwList[i].jzl == null) {
                                this.editForm.zdbwList[i].jzl = [];
                            }
                            break;
                        case "20":
                            this.editForm.zdbwList[i].jzl = [];
                            this.editForm.zdbwList[i].cgl = [];
                            if (this.editForm.zdbwList[i].zzl == null) {
                                this.editForm.zdbwList[i].zzl = [];
                            }
                            break;
                        case "30":
                            this.editForm.zdbwList[i].jzl = [];
                            this.editForm.zdbwList[i].zzl = [];
                            if (this.editForm.zdbwList[i].cgl == null) {
                                this.editForm.zdbwList[i].cgl = [];
                            }
                            break;
                        default:
                            this.editForm.zdbwList[i].jzl = [];
                            this.editForm.zdbwList[i].zzl = [];
                            this.editForm.zdbwList[i].cgl = [];
                            break;
                    }
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //单位性质下拉框
        getDwxzData: function () {
            axios.get('/api/codelist/getCodeTypeOrderByNum/DWXZ').then(function (res) {
                this.dwxzData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //防火等级下拉框
        getFhdjData: function () {
            axios.get('/api/codelist/getCodetype/FHDJ').then(function (res) {
                this.fhdjData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //行政区划下拉框
        getXzqhData: function () {
            axios.get('/api/codelist/getXzqhTreeByUser').then(function (res) {
                this.xzqhData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //防火队站、灭火队站级联下拉框
        getXfdzData: function () {
            var organization = this.shiroData.organizationVO;
            var params = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUserAll', params).then(function (res) {
                this.xfdzData = res.data.result;
                if (this.status != 0) {
                    //根据重点单位id获取重点单位详情
                    this.getDetails();
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //重点部位类型下拉框
        getZdbwlxData: function () {
            axios.get('/api/codelist/getCodetype/ZDBWLX').then(function (res) {
                this.zdbwlxData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //使用性质下拉框
        getSyxzData: function () {
            axios.get('/api/codelist/getDzlxTree/JZSYXZ').then(function (res) {
                this.syxzData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //建筑结构下拉框
        getJzjgData: function () {
            axios.get('/api/codelist/getCodetype/JZJG').then(function (res) {
                this.jzjgData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //储罐类型下拉框
        getCglxData: function () {
            axios.get('/api/codelist/getCodetype/CGLX').then(function (res) {
                this.cglxData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //建筑分类下拉框
        getJzflData: function () {
            axios.get('/api/codelist/getCodetype/JZFL').then(function (res) {
                this.jzflData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //单位消防力量新增
        addDomainXfll: function () {
            this.editForm.xfllList.push({
                xfdwlx: '',
                xfdwrs: '',
                xfdwcls: '',
                xfdwlxr: '',
                xfdwdh: '',
                key: Date.now()
            });
        },

        //单位消防力量移除
        removeDomainXfll: function (item) {
            var index = this.editForm.xfllList.indexOf(item);
            if (index !== -1) {
                this.editForm.xfllList.splice(index, 1);
            }
        },

        //建筑信息新增
        addDomainJzxx: function () {
            this.editForm.jzxxList.push({
                jzid: '',
                jzmc: '',
                key: Date.now()
            });
        },

        //建筑信息移除
        removeDomainJzxx: function (item) {
            var index = this.editForm.jzxxList.indexOf(item);
            if (index !== -1) {
                this.editForm.jzxxList.splice(index, 1);
            }

        },

        //获取建筑信息列表
        getJzxxList: function (type, index) {
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
                jzmc: this.searchForm_building.jzmc.replace(/%/g,"\\%"),
                jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
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

        //建筑弹出页翻页
        currentPageChange_building: function (val) {
            if (this.currentPage_building != val) {
                this.currentPage_building = val;
                this.getJzxxList('page', this.jzIndex);
            }
        },

        //选择建筑，返回建筑名称和id
        selectRow_building: function (val) {
            this.editForm.jzxxList[this.jzIndex].jzid = val.jzid;
            this.editForm.jzxxList[this.jzIndex].jzmc = val.jzmc;
            this.buildingListVisible = false;
        },

        //建筑查询条件清空
        clearJzxxList: function (val) {
            this.searchForm_building.jzmc = '';
            this.getJzxxList('reset', this.jzIndex);
        },

        //重点部位新增
        addDomainZdbw: function () {
            if (this.zdbwlxData.length == 0) {
                this.getZdbwlxData();
            }
            this.editForm.zdbwList.push({
                zdbwmc: '',
                zdbwlx: '',
                zdbwwz: '',
                wxxfx: '',
                zysx: '',
                bz: '',
                jzl: {},
                zzl: {},
                cgl: {},
                cjrid: '',
                cjrmc: '',
                xgrid: '',
                xgrmc: '',
                zdbwlxDisabled: false,
                key: Date.now()
            });
        },

        //重点部位移除
        removeDomainZdbw: function (item) {
            var index = this.editForm.zdbwList.indexOf(item);
            if (index !== -1) {
                this.editForm.zdbwList.splice(index, 1);
            }
        },

        //危险介质新增
        addDomainWxjz: function (index) {
            this.editForm.zdbwList[index].jzl.wxjzList.push({
                jzmc: '',
                jzsjcl: '',
                jzlhtx: '',
                jzbz: '',
                key: Date.now()
            });
        },

        //危险介质移除
        removeDomainWxjz: function (index, item) {
            var temp = this.editForm.zdbwList[index].jzl.wxjzList.indexOf(item);
            if (temp !== -1) {
                this.editForm.zdbwList[index].jzl.wxjzList.splice(temp, 1);
            }
        },

        //储罐新增
        addDomainCg: function (index) {
            if (this.cglxData.length == 0) {
                this.getCglxData();
            }
            this.editForm.zdbwList[index].cgl.cgList.push({
                sjlx: 'BW',
                cgmc: '',
                cglx: '',
                cgrl: '',
                cgzj: '',
                cggd: '',
                cgzc: '',
                gdmj: '',
                gzyl: '',
                ccwd: '',
                ccjzmc: '',
                ccjzlhxz: '',
                ccjzsjcl: '',
                ccjzywgd: '',
                bz: '',
                key: Date.now()
            });
        },

        //储罐移除
        removeDomainCg: function (index, item) {
            var temp = this.editForm.zdbwList[index].cgl.cgList.indexOf(item);
            if (temp !== -1) {
                this.editForm.zdbwList[index].cgl.cgList.splice(temp, 1);
            }
        },

        //重点部位类型Change
        zdbwlxChange: function (index) {
            var zdbwlx = this.editForm.zdbwList[index].zdbwlx;
            if (zdbwlx == "10") {
                if (this.syxzData.length == 0) {
                    this.getSyxzData();
                }
                if (this.jzjgData.length == 0) {
                    this.getJzjgData();
                }
                this.editForm.zdbwList[index].jzl = {
                    syxzList: [],
                    jzjg: '',
                    qymj: '',
                    gnms: '',
                    wxjzList: [],
                }
            } else if (zdbwlx == "20") {
                if (this.jzjgData.length == 0) {
                    this.getJzjgData();
                }
                this.editForm.zdbwList[index].zzl = {
                    jzjg: '',
                    zzzc: '',
                    zdmj: '',
                    zzgd: '',
                    jsfzr: '',
                    jsfzrdh: '',
                    ylxx: '',
                    cwxx: '',
                    gylc: '',
                }
            } else if (zdbwlx == "30") {
                this.editForm.zdbwList[index].cgl = {
                    cgsl: '',
                    cgjg: '',
                    zrj: '',
                    ccjzms: '',
                    jsfzr: '',
                    jsfzrdh: '',
                    pkqkd: '',
                    pkqkn: '',
                    pkqkx: '',
                    pkqkb: '',
                    cgList: [],
                }
            }
        },

        //作废
        //保存前校验
        validateForm: function () {
            if (this.editForm.dwmc == '' || this.editForm.dwmc == null) {
                this.$message.warning({
                    message: '请输入单位名称',
                    showClose: true
                });
                return false;
            } else if (this.editForm.dwxz == '' || this.editForm.dwxz == null) {
                this.$message.warning({
                    message: '请选择单位性质',
                    showClose: true
                });
                return false;
            } else if (this.editForm.fhdj == '' || this.editForm.fhdj == null) {
                this.$message.warning({
                    message: '请选择防火等级',
                    showClose: true
                });
                return false;
            } else if (this.editForm.fhdzid == '' || this.editForm.fhdzid == null) {
                this.$message.warning({
                    message: '请选择单位防火队站',
                    showClose: true
                });
                return false;
            } else if (this.editForm.mhdzid == '' || this.editForm.mhdzid == null) {
                this.$message.warning({
                    message: '请选择单位灭火队站',
                    showClose: true
                });
                return false;
            } else if (this.editForm.zdbwList.length > 0) {
                for (var i in this.editForm.zdbwList) {
                    if (this.editForm.zdbwList[i].zdbwmc == '' || this.editForm.zdbwList[i].zdbwmc == null) {
                        this.$message.warning({
                            message: '请输入重点部位名称',
                            showClose: true
                        });
                        return false;
                    } else if (this.editForm.zdbwList[i].zdbwlx == '' || this.editForm.zdbwList[i].zdbwlx == null) {
                        this.$message.warning({
                            message: '请选择重点部位类型',
                            showClose: true
                        });
                        return false;
                    }
                }
            }
            return true;
        },

        //保存
        save: function (editForm) {
            this.$refs[editForm].validate((valid) => {
                if (valid) {
                    var jgid = this.shiroData.organizationVO.jgid;
                    //行政区划
                    var xzqhString = "";
                    if (this.editForm.xzqh != "" && this.editForm.xzqh.length > 0) {
                        xzqhString = this.editForm.xzqh[this.editForm.xzqh.length - 1];
                    }
                    //防火队站ID
                    var fhdzidString = this.editForm.fhdzid[this.editForm.fhdzid.length - 1];
                    //灭火队站ID
                    var mhdzidString = this.editForm.mhdzid[this.editForm.mhdzid.length - 1];
                    var params = {
                        dwmc: this.editForm.dwmc,
                        dwxz: this.editForm.dwxz,
                        dwdz: this.editForm.dwdz,
                        xzqh: xzqhString,
                        fhdj: this.editForm.fhdj,
                        zbdh: this.editForm.zbdh,
                        dwgk: this.editForm.dwgk,
                        gisX: this.editForm.gisX,
                        gisY: this.editForm.gisY,
                        lon: this.editForm.lon,
                        lat: this.editForm.lat,
                        plqkd: this.editForm.plqkd,
                        plqkn: this.editForm.plqkn,
                        plqkx: this.editForm.plqkx,
                        plqkb: this.editForm.plqkb,
                        fhdzid: fhdzidString,
                        mhdzid: mhdzidString,
                        xfzrr: this.editForm.xfzrr,
                        xfzrrdh: this.editForm.xfzrrdh,
                        xfglr: this.editForm.xfglr,
                        xfglrdh: this.editForm.xfglrdh,
                        xfllList: this.editForm.xfllList,
                        xfsssl: this.editForm.xfsssl,
                        jzfl: this.editForm.jzfl,
                        jzsl: this.editForm.jzsl,
                        zdmj: this.editForm.zdmj,
                        jzmj: this.editForm.jzmj,
                        jzxxList: this.editForm.jzxxList,
                        zdbwList: this.editForm.zdbwList,
                        bz: this.editForm.bz,
                        jdh: jgid.substr(0, 2) + '000000',
                        datasource: jgid,
                        cjrid: "",
                        cjrmc: "",
                        xgrid: "",
                        xgrmc: "",
                    };
                    if (this.status == 0) {//新增
                        axios.get('/dpapi/importantunits/doCheckName/' + this.editForm.dwmc).then(function (res) {
                            if (res.data.result > 0) {
                                this.$message.warning({
                                    message: '中文名已存在，请重新命名',
                                    showClose: true
                                });
                            } else {
                                params.cjrid = this.shiroData.userid;
                                params.cjrmc = this.shiroData.realName;

                                //重点部位中创建人信息
                                for (var i in params.zdbwList) {
                                    params.zdbwList[i].cjrid = this.shiroData.userid;
                                    params.zdbwList[i].cjrmc = this.shiroData.realName;
                                }

                                axios.post('/dpapi/importantunits/doInsertByVO', params).then(function (res) {
                                    if (res.data.result != null) {
                                        this.$alert('保存成功', '提示', {
                                            type: 'success',
                                            confirmButtonText: '确定',
                                            callback: action => {
                                                loadDiv("planobject/importantunits_list");
                                            }
                                        });
                                    } else {
                                        this.$alert('保存失败', '提示', {
                                            type: 'error',
                                            confirmButtonText: '确定',
                                            callback: action => {
                                                loadDiv("planobject/importantunits_list");
                                            }
                                        });
                                    }
                                }.bind(this), function (error) {
                                    console.log(error);
                                })
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })


                    } else {//修改
                        params.xgrid = this.shiroData.userid;
                        params.xgrmc = this.shiroData.realName;
                        params.uuid = this.editForm.uuid;

                        //重点部位中修改人信息
                        for (var i in params.zdbwList) {
                            params.zdbwList[i].xgrid = this.shiroData.userid;
                            params.zdbwList[i].xgrmc = this.shiroData.realName;
                            //对重点部位建筑类、装置类、储罐类对象进行处理
                            switch (params.zdbwList[i].zdbwlx) {
                                case "10":
                                    params.zdbwList[i].zzl = null;
                                    params.zdbwList[i].cgl = null;
                                    if (params.zdbwList[i].jzl.length == 0) {
                                        params.zdbwList[i].jzl = null;
                                    }
                                    break;
                                case "20":
                                    params.zdbwList[i].jzl = null;
                                    params.zdbwList[i].cgl = null;
                                    if (params.zdbwList[i].zzl.length == 0) {
                                        params.zdbwList[i].zzl = null;
                                    }
                                    break;
                                case "30":
                                    params.zdbwList[i].jzl = null;
                                    params.zdbwList[i].zzl = null;
                                    if (params.zdbwList[i].cgl.length == 0) {
                                        params.zdbwList[i].cgl = null;
                                    }
                                    break;
                                default:
                                    params.zdbwList[i].jzl = null;
                                    params.zdbwList[i].zzl = null;
                                    params.zdbwList[i].cgl = null;
                                    break;
                            }
                        }

                        axios.post('/dpapi/importantunits/doUpdateByVO', params).then(function (res) {
                            if (res.data.result != null) {
                                this.$alert('保存成功', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("planobject/importantunits_list");
                                    }
                                });
                            } else {
                                this.$alert('保存失败', '提示', {
                                    type: 'error',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("planobject/importantunits_list");
                                    }
                                });
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }
                } else {
                    console.log('error save!!');
                    //返回顶部
                    $("#app").animate({ scrollTop: 0 }, scrollSpeed);
                    return false;
                }
            });
        },

        //取消按钮
        cancel: function () {
            loadDiv("planobject/importantunits_list");
        },

        //判断对象{}为空对象
        validateIsEmptyObject: function (obj) {
            for (var key in obj) {
                return false;
            }
            return true;
        },

    },

})