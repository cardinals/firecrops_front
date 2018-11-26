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
            //水源类型
            sylxData: [],
            //上级队站
            sjdzData: [],
            //行政区划
            xzqhData: [],
            //角色
            shiroData: [],
            //可用状态
            kyztData: [],
            //设置形式
            szxsData: [],
            //管网形式
            gwxsData: [],
            //管网压力类型
            gwyllxData: [],
            //接口形式
            jkxsData: [],
            //水源归属
            sygsData: [],
            qsxsData: [],
            //水源类型属性
            isXHS: false,
            isXFSH: false,
            isXFSC: false,
            isTRSYQSD: false,
            //编辑表单
            editForm: {
                symc: "",
                sybm: "",
                sylx: "",
                sydz: "",
                kyzt: "",
                gxdz: [],
                xzqh: "",
                sygs: "",
                lon: "",
                lat: "",
                gisX: "",
                gisY: "",
                gisH: "",
                ssdw: "",
                gsdw: "",
                gsdwlxfs: "",
                bz: "",
                jdh: "",
                //创建人、修改人
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: "",
                //消火栓VO
                xhs_szxs: "",
                xhs_gwylfw: "",
                xhs_gwxs: "",
                xhs_gwzj: "",
                xhs_gwyllx: "",
                xhs_jkxs: "",
                xhs_jkkj: "",
                xhs_zdll: "",
                xhs_jdh: "",
                //消防水鹤VO
                xfsh_gwzj: "",
                xfsh_gwyl: "",
                xfsh_cskgd: "",
                xfsh_zdll: "",
                xfsh_jdh: "",
                //消防水池VO
                xfsc_sybgc: "",
                xfsc_csl: "",
                xfsc_jsll: "",
                xfsc_qszdll: "",
                xfsc_gwxs: "",
                xfsc_tcwz: "",
                xfsc_tsqscls: "",
                xfsc_bssj: "",
                xfsc_jdh: "",
                //天然水源取水点VO
                trsyqsd_trsylx: "",
                trsyqsd_trsyid: "",
                trsy_trsymc: "",
                trsyqsd_sybgc: "",
                trsyqsd_tcwz: "",
                trsyqsd_tsqscls: "",
                trsyqsd_qsxs: "",
                trsyqsd_jdh: ""
            },

            props: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },
            sjdzprops: {
                value: 'dzid',
                label: 'dzjc',
                children: 'children'
            },
            //天然水源弹出页---------------------------------------------------
            statusTrsy: '',
            dialogTitle: "选择天然水源",
            trsyAddForm: {
                trsy_trsymc: '',
                trsy_trsylx: '',
                trsy_sz: '',
                trsy_szms: '',
                trsy_ywksq: '',
                trsy_ksqsj: '',
                trsy_ywqsd: '',
                trsy_jdh: '',
                trsy_cjrid: '',
                trsy_cjrmc: '',
                trsy_xgrid: '',
                trsy_xgrmc: ''
            },
            //天然水源类型
            trsylxData: [],
            //天然水源有无枯水期
            ywksqData: [],
            //水质
            szData: [],
            //有无取水点
            ywqsdData: [{
                codeValue: '1',
                codeName: '有'
            }, {
                codeValue: '0',
                codeName: '无'
            }],
            trsySearch: true,
            trsyAdd: false,
            trsyListVisible: false,
            loading_trsy: false,
            loading_trsyAdd: false,
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 5,
            //总记录数
            total: 0,
            //搜索天然水源
            searchForm: {
                trsy_trsymc: ''
            },
            multipleSelection: [],
            tableData: [],
            //表高度变量
            tableheight: 243,
            //editForm验证rules
            editFormRules:{
                symc: [
                    { required: true, message: '请输入水源名称', trigger: 'blur' }
                ],
                sylx: [
                    { required: true, message: '请选择水源类型', trigger: 'change' }
                ],
                gxdz: [
                    { validator: (rule,value,callback)=>{
                        if(value.length == 0){
                            callback(new Error("请选择管辖队站"));
                        }else{
                            callback();
                        }
               
                    }, trigger: 'change' }
                ],
                sybm:[
                    { required: false, message: '请填写水源编码', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9]+$/, message: '只能输入数字和字母',trigger: 'blur' },
                ],
            },
            trsyFormRules:{
                trsy_trsymc: [
                    { required: true, message: '请输入天然水源名称', trigger: 'blur' }
                ],
            },
        }
    },
    created: function () {
        this.loading = true;
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("消防水源管理", "消防水源管理新增");
        } else if (type == "BJ") {
            loadBreadcrumb("消防水源管理", "消防水源管理编辑");
        }
        this.shiroData = shiroGlobal;
        this.status = getQueryString("ID");
        //上级队站下拉框
        this.getSjdzData();
        //行政区划下拉框
        this.getXzqhData();
        //可用状态下拉框
        this.getKyztData();
        //水源类型下拉框
        this.getSylxData();
        //水源归属下拉框
        this.getSygsData();
        this.getQsxsData();
    },
    methods: {
        //上级机构下拉框
        getSjdzData: function () {
            var organization = this.shiroData.organizationVO;
            var params = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            };
            axios.post('/dpapi/xfdz/findSjdzByUserAll', params).then(function (res) {
                this.sjdzData = res.data.result;
                this.searchClick();
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
        //可用状态下拉框
        getKyztData: function () {
            axios.get('/api/codelist/getCodetype/SYKYZT').then(function (res) {
                this.kyztData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //水源类型下拉框
        getSylxData: function () {
            axios.get('/api/codelist/getCodetype/SYLX').then(function (res) {
                this.sylxData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //设置形式下拉框
        getSzxsData: function () {
            axios.get('/api/codelist/getCodetype/XHSSZXS').then(function (res) {
                this.szxsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //管网形式
        getGwxsData: function () {
            axios.get('/api/codelist/getCodetype/GWXS').then(function (res) {
                this.gwxsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //管网压力类型
        getGwyllxData: function () {
            axios.get('/api/codelist/getCodetype/GWYLLX').then(function (res) {
                this.gwyllxData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //接口形式
        getJkxsData: function () {
            axios.get('/api/codelist/getCodetype/XHSJKXS').then(function (res) {
                this.jkxsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //取水形式
        getQsxsData: function () {
            axios.get('/api/codelist/getCodetype/QSXS').then(function (res) {
                this.qsxsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //水质
        getSzData: function () {
            axios.get('/api/codelist/getCodetype/SYSZ').then(function (res) {
                this.szData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //枯水期
        getTrsyYWKSQ_data: function () {
            axios.get('/api/codelist/getCodetype/SYYWKSQ').then(function (res) {
                this.ywksqData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //天然水源类型trsylxData
        getTrsylxData: function () {
            axios.get('/api/codelist/getCodetype/TRSYLX').then(function (res) {
                this.trsylxData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //水源归属
        getSygsData: function () {
            axios.get('/api/codelist/getCodetype/SYGS').then(function (res) {
                this.sygsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        sygsChange: function (val) {
            if (val == '10') {
                this.editForm.ssdw = '';
            }
        },
        //表格查询事件
        searchClick: function () {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                var sylxParam = getQueryString("sylx");
                var params = {
                    uuid: this.status,
                    sylx: sylxParam
                };
                axios.post('/dpapi/xfsy/findSyAndSxByVo', params).then(function (res) {
                    var result = res.data.result;
                    this.editForm = res.data.result;
                    if (sylxParam != null && sylxParam != "") {
                        switch (sylxParam) {
                            case "01":
                                this.isXHS = true;
                                break;
                            case "02":
                                this.isXFSH = true;
                                break;
                            case "03":
                                this.isXFSC = true;
                                break;
                            case "04":
                                this.isTRSYQSD = true;
                                break;
                        }
                    }

                    //行政区划
                    var xzqhArray = [];
                    if (result.xzqh != null && result.xzqh != "" && result.xzqh.substr(2, 4) != "0000") {
                        xzqhArray.push(result.xzqh.substr(0, 2) + "0000");
                        if (result.xzqh.substr(4, 2) != "00") {
                            xzqhArray.push(result.xzqh.substr(0, 4) + "00");
                        }
                    }
                    xzqhArray.push(result.xzqh);
                    this.editForm.xzqh = xzqhArray;
                    //上级消防队站
                    var sjdzArray = [];
                    var temp = this.editForm.gxdz;
                    for (var i in this.sjdzData) {
                        if (temp == this.sjdzData[i].dzid) {
                            sjdzArray.push(this.sjdzData[i].dzid);
                        } else {
                            for (var j in this.sjdzData[i].children) {
                                if (temp == this.sjdzData[i].children[j].dzid) {
                                    sjdzArray.push(this.sjdzData[i].dzid, this.sjdzData[i].children[j].dzid);
                                } else {
                                    for (var k in this.sjdzData[i].children[j].children) {
                                        if (temp == this.sjdzData[i].children[j].children[k].dzid) {
                                            sjdzArray.push(this.sjdzData[i].dzid, this.sjdzData[i].children[j].dzid, this.sjdzData[i].children[j].children[k].dzid);
                                        } else {
                                            for (var n in this.sjdzData[i].children[j].children[k].children) {
                                                if (temp == this.sjdzData[i].children[j].children[k].children[n].dzid) {
                                                    sjdzArray.push(this.sjdzData[i].dzid, this.sjdzData[i].children[j].dzid, this.sjdzData[i].children[j].children[k].dzid, this.sjdzData[i].children[j].children[k].children[n].dzid);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.editForm.gxdz = sjdzArray;
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //保存前校验
        validateSave: function () {
            if (this.editForm.symc == "" || this.editForm.symc == null) {
                this.$message.warning({
                    message: '请输入水源名称!',
                    showClose: true
                });
                return false;
            } else if (this.editForm.sylx == "" || this.editForm.sylx == null) {
                this.$message.warning({
                    message: '请选择水源类型!',
                    showClose: true
                });
                return false;
            } else if (this.editForm.gxdz.length == 0) {
                this.$message.warning({
                    message: '请选择管辖队站！',
                    showClose: true
                });
                return false;
            }
            return true;
        },

        //保存
        save: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var jdh = this.shiroData.organizationVO.jgid.substr(0,2) + "000000";
                var datasource = this.shiroData.organizationVO.jgid;
                if (this.status == 0) {//新增
                    var params = {
                        symc: this.editForm.symc,
                        sybm: this.editForm.sybm,
                        sylx: this.editForm.sylx,
                        sydz: this.editForm.sydz,
                        kyzt: this.editForm.kyzt,
                        gxdz: this.editForm.gxdz[this.editForm.gxdz.length - 1],
                        xzqh: this.editForm.xzqh[this.editForm.xzqh.length - 1],
                        sygs: this.editForm.sygs,
                        lon: this.editForm.lon,
                        lat: this.editForm.lat,
                        gisX: this.editForm.gisX,
                        gisY: this.editForm.gisY,
                        gisH: this.editForm.gisH,
                        ssdw: this.editForm.ssdw,
                        gsdw: this.editForm.gsdw,
                        gsdwlxfs: this.editForm.gsdwlxfs,
                        bz: this.editForm.bz,
                        jdh: jdh,
                        datasource: datasource,
                        //创建人
                        cjrid: this.shiroData.userid,
                        cjrmc: this.shiroData.realName,
                        //消火栓VO
                        xhs_szxs: this.editForm.xhs_szxs,
                        xhs_gwylfw: this.editForm.xhs_gwylfw,
                        xhs_gwxs: this.editForm.xhs_gwxs,
                        xhs_gwzj: this.editForm.xhs_gwzj,
                        xhs_gwyllx: this.editForm.xhs_gwyllx,
                        xhs_jkxs: this.editForm.xhs_jkxs,
                        xhs_jkkj: this.editForm.xhs_jkkj,
                        xhs_zdll: this.editForm.xhs_zdll,
                        xhs_jdh: jdh,
                        xhs_datasource: datasource,
                        //消防水鹤VO
                        xfsh_gwzj: this.editForm.xfsh_gwzj,
                        xfsh_gwyl: this.editForm.xfsh_gwyl,
                        xfsh_cskgd: this.editForm.xfsh_cskgd,
                        xfsh_zdll: this.editForm.xfsh_zdll,
                        xfsh_jdh: jdh,
                        xfsh_datasource: datasource,
                        //消防水池VO
                        xfsc_sybgc: this.editForm.xfsc_sybgc,
                        xfsc_csl: this.editForm.xfsc_csl,
                        xfsc_jsll: this.editForm.xfsc_jsll,
                        xfsc_qszdll: this.editForm.xfsc_qszdll,
                        xfsc_gwxs: this.editForm.xfsc_gwxs,
                        xfsc_tcwz: this.editForm.xfsc_tcwz,
                        xfsc_tsqscls: this.editForm.xfsc_tsqscls,
                        xfsc_tsqscls: this.editForm.xfsc_tsqscls,
                        xfsc_bssj: this.editForm.xfsc_bssj,
                        xfsc_jdh: jdh,
                        xfsc_datasource: datasource,
                        //天然水源取水点VO
                        trsyqsd_trsylx: this.editForm.trsyqsd_trsylx,
                        trsyqsd_trsyid: this.editForm.trsyqsd_trsyid,
                        trsy_trsymc: this.editForm.trsy_trsymc,
                        trsyqsd_sybgc: this.editForm.trsyqsd_sybgc,
                        trsyqsd_tcwz: this.editForm.trsyqsd_tcwz,
                        trsyqsd_tsqscls: this.editForm.trsyqsd_tsqscls,
                        trsyqsd_qsxs: this.editForm.trsyqsd_qsxs,
                        trsyqsd_jdh: jdh,
                        trsyqsd_datasource: datasource,
                    }
                    axios.post('/dpapi/xfsy/insertByXfsyVO', params).then(function (res) {
                        if (res.data.result != null) {
                            this.$alert('成功保存消防水源信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firewater_list");
                                }
                            });
                        } else {
                            this.$alert('保存失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firewater_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                    } else {//修改
                        var params = {
                            uuid: this.editForm.uuid,
                            sysxxxid: this.editForm.sysxxxid,
                            symc: this.editForm.symc,
                            sybm: this.editForm.sybm,
                            sylx: this.editForm.sylx,
                            sydz: this.editForm.sydz,
                            kyzt: this.editForm.kyzt,
                            gxdz: this.editForm.gxdz[this.editForm.gxdz.length - 1],
                            xzqh: this.editForm.xzqh[this.editForm.xzqh.length - 1],
                            sygs: this.editForm.sygs,
                            lon: this.editForm.lon,
                            lat: this.editForm.lat,
                            gisX: this.editForm.gisX,
                            gisY: this.editForm.gisY,
                            gisH: this.editForm.gisH,
                            ssdw: this.editForm.ssdw,
                            gsdw: this.editForm.gsdw,
                            gsdwlxfs: this.editForm.gsdwlxfs,
                            bz: this.editForm.bz,
                            jdh: jdh,
                            datasource: datasource,
                            //修改人
                            xgrid: this.shiroData.userid,
                            xgrmc: this.shiroData.realName,
                            //消火栓VO
                            xhs_szxs: this.editForm.xhs_szxs,
                            xhs_gwylfw: this.editForm.xhs_gwylfw,
                            xhs_gwxs: this.editForm.xhs_gwxs,
                            xhs_gwzj: this.editForm.xhs_gwzj,
                            xhs_gwyllx: this.editForm.xhs_gwyllx,
                            xhs_jkxs: this.editForm.xhs_jkxs,
                            xhs_jkkj: this.editForm.xhs_jkkj,
                            xhs_zdll: this.editForm.xhs_zdll,
                            xhs_jdh: jdh,
                            xhs_datasource: datasource,
                            //消防水鹤VO
                            xfsh_gwzj: this.editForm.xfsh_gwzj,
                            xfsh_gwyl: this.editForm.xfsh_gwyl,
                            xfsh_cskgd: this.editForm.xfsh_cskgd,
                            xfsh_zdll: this.editForm.xfsh_zdll,
                            xfsh_jdh: jdh,
                            xfsh_datasource: datasource,
                            //消防水池VO
                            xfsc_sybgc: this.editForm.xfsc_sybgc,
                            xfsc_csl: this.editForm.xfsc_csl,
                            xfsc_jsll: this.editForm.xfsc_jsll,
                            xfsc_qszdll: this.editForm.xfsc_qszdll,
                            xfsc_gwxs: this.editForm.xfsc_gwxs,
                            xfsc_tcwz: this.editForm.xfsc_tcwz,
                            xfsc_tsqscls: this.editForm.xfsc_tsqscls,
                            xfsc_tsqscls: this.editForm.xfsc_tsqscls,
                            xfsc_bssj: this.editForm.xfsc_bssj,
                            xfsc_jdh: jdh,
                            xfsc_datasource: datasource,
                            //天然水源取水点VO
                            trsyqsd_trsylx: this.editForm.trsyqsd_trsylx,
                            trsyqsd_trsyid: this.editForm.trsyqsd_trsyid,
                            trsy_trsymc: this.editForm.trsy_trsymc,
                            trsyqsd_sybgc: this.editForm.trsyqsd_sybgc,
                            trsyqsd_tcwz: this.editForm.trsyqsd_tcwz,
                            trsyqsd_tsqscls: this.editForm.trsyqsd_tsqscls,
                            trsyqsd_qsxs: this.editForm.trsyqsd_qsxs,
                            trsyqsd_jdh: jdh,
                            trsyqsd_datasource: datasource,
                        }
                        axios.post('/dpapi/xfsy/updateByXfsyVO', params).then(function (res) {
                            if (res.data.result != null) {
                                this.$alert('成功修改消防水源信息', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("basicinfo/firewater_list");
                                    }
                                });
                            } else {
                                this.$alert('修改失败', '提示', {
                                    type: 'error',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        loadDiv("basicinfo/firewater_list");
                                    }
                                });
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }
                } else {
                    console.log('error submit!!');
                    this.loading = false;
                    return false;
                }
            });
        },
        cancel: function () {
            loadDiv("basicinfo/firewater_list");
        },
        //水源类型变化
        sylxChange: function () {
            var type = this.editForm.sylx;
            if (type == "01") {
                this.isXHS = true;
                this.isXFSH = false;
                this.isXFSC = false;
                this.isTRSYQSD = false;
                //设置形式下拉框
                if (this.szxsData.length == 0)
                    this.getSzxsData();
                //管网形式下拉框
                if (this.gwxsData.length == 0)
                    this.getGwxsData();
                //管网压力类型下拉框
                if (this.gwyllxData.length == 0)
                    this.getGwyllxData();
                //接口形式下拉框
                if (this.jkxsData.length == 0)
                    this.getJkxsData();
            } else if (type == "02") {
                this.isXHS = false;
                this.isXFSH = true;
                this.isXFSC = false;
                this.isTRSYQSD = false;
            } else if (type == "03") {
                this.isXHS = false;
                this.isXFSH = false;
                this.isXFSC = true;
                this.isTRSYQSD = false;
                //管网形式下拉框
                if (this.gwxsData.length == 0)
                    this.getGwxsData();
            } else if (type == "04") {
                this.isXHS = false;
                this.isXFSH = false;
                this.isXFSC = false;
                this.isTRSYQSD = true;
                // if (this.trsylxData.length == 0)
                //     this.getTrsylxData();
                // if (this.ywksqData.length == 0)
                //     this.getTrsyYWKSQ_data();
                // if (this.szData.length == 0)
                //     this.getSzData();
            } else {
                this.isXHS = false;
                this.isXFSH = false;
                this.isXFSC = false;
                this.isTRSYQSD = false;
            }
        },

        //天然水源弹出页---------------------------------------------------------------
        trsyList: function (type, val) {
            if (type == 'page') {
                this.tableData = [];
            } else {
                if (type == 'init') {
                    this.trsyAdd = false;
                    this.trsySearch = true;
                    this.dialogTitle = "选择天然水源";
                    this.searchForm.trsy_trsymc = '';
                }
                this.currentPage = 1;
            }
            this.trsyListVisible = true;
            this.loading_trsy = true;

            var params = {
                trsy_trsymc: this.searchForm.trsy_trsymc.replace(/%/g,"\\%"),
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                // orgUuid: this.shiroData.organizationVO.uuid,
                // orgJgid: datasource
            };
            axios.post('/dpapi/xfsy/doFindTrsyListByVO', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.getTrsylxData();
                this.getSzData();
                this.loading_trsy = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //天然水源弹出页翻页
        currentPageChange: function (val) {
            if (this.currentPage != val) {
                this.currentPage = val;
                this.trsyList('page');
            }
        },
        //选择天然水源，返回天然水源名称和id
        selectRow: function (val) {
            this.editForm.trsyqsd_trsyid = val.trsy_uuid;
            this.editForm.trsy_trsymc = val.trsy_trsymc;
            this.trsyListVisible = false;
        },
        //天然水源查询条件清空
        clearTrsyList: function (val) {
            this.searchForm.trsy_trsymc = "";
            this.trsyList('reset');
        },
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        deleteTrsy: function () {
            this.$confirm('确认删除选中的天然水源?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post('/dpapi/xfsy/doDeleteTrsyByUUId', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条天然水源信息",
                        showClose: true,
                        onClose: this.cancelTrsy()
                    });
                }.bind(this), function (error) {
                    console.log(error)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        addTrsy: function () {
            this.trsyAddForm = {
                trsy_trsymc: '',
                trsy_trsylx: '',
                trsy_sz: '',
                trsy_szms: '',
                trsy_ywksq: '',
                trsy_ksqsj: '',
                trsy_ywqsd: '',
                trsy_jdh: ''
            };
            this.trsyAdd = true;
            this.trsySearch = false;
            this.dialogTitle = "新增天然水源";
            this.statusTrsy = 0;
        },
        editTrsy: function (val) {
            this.trsyAdd = true;
            this.trsySearch = false;
            this.dialogTitle = "修改天然水源";
            this.statusTrsy = val.trsy_uuid;
            var param = {
                trsy_uuid: this.statusTrsy
            }
            axios.post('/dpapi/xfsy/doFindTrsyByUUId', param).then(function (res) {
                if (res.data.result.trsy_ywqsd == '有') {
                    res.data.result.trsy_ywqsd = '1';
                } else if (res.data.result.trsy_ywqsd == '无') {
                    res.data.result.trsy_ywqsd = '0';
                }
                if (res.data.result.trsy_ywksq == '有') {
                    res.data.result.trsy_ywksq = '1';
                } else if (res.data.result.trsy_ywksq == '无') {
                    res.data.result.trsy_ywksq = '0';
                }
                this.trsyAddForm = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        cancelTrsy: function () {
            this.trsyAdd = false;
            this.trsySearch = true;
            this.dialogTitle = "选择天然水源";
            this.clearTrsyList();
        },
        saveTrsy: function (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.statusTrsy == 0) {//新增
                        this.trsyAddForm.trsy_cjrid = this.shiroData.userid;
                        this.trsyAddForm.trsy_cjrmc = this.shiroData.realName;
                        //this.trsyAddForm.trsy_jdh = datasource;
                        this.trsyAddForm.trsy_jdh = this.shiroData.organizationVO.jgid;
                        axios.post('/dpapi/xfsy/insertTrsyByXfsyVO', this.trsyAddForm).then(function (res) {
                            if (res.data.result != null) {
                                this.$alert('成功保存天然水源信息', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        this.cancelTrsy();
                                    }
                                });
                            } else {
                                this.$alert('保存失败', '提示', {
                                    type: 'error',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        this.cancelTrsy();
                                    }
                                });
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    } else {//修改
                        this.trsyAddForm.trsy_xgrid = this.shiroData.userid;
                        this.trsyAddForm.trsy_xgrmc = this.shiroData.realName;
                        axios.post('/dpapi/xfsy/doUpdateTrsyByVO', this.trsyAddForm).then(function (res) {
                            if (res.data.result != null) {
                                this.$alert('成功修改天然水源信息', '提示', {
                                    type: 'success',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        this.cancelTrsy();
                                    }
                                });
                            } else {
                                this.$alert('修改失败', '提示', {
                                    type: 'error',
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        this.cancelTrsy();
                                    }
                                });
                            }
                        }.bind(this), function (error) {
                            console.log(error);
                        })
                    }
                }else {
                    console.log('error submit!!');
                    this.loading = false;
                    return false;
                }
            });
        }
    },

})