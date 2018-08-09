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
            allTypesDataTree: [],
            allXzqhDataTree: [],
            allSsdzDataTree: [],
            role_data: [],
            uuid: "4bb4d6da5a78416d9f923c16965dead0",
            //编辑表单
            editForm:{
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
                jzxxList: [{jzmc: '', jzid: ''}],
                zdbwList:[],
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
            xfdwlxData: [{codeName:'企业专职消防队',codeValue:'0A01'},{codeName:'微型消防站',codeValue:'0A03'}],
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
            tableData_building: [],
            //表数据
            tableData: [],//基本数据
            
            //重点部位显示标识：
            ZDBW: false,
            jzl_zdbwData: [],//建筑类重点部位数据
            zzl_zdbwData: [],//装置类重点部位数据
            cgl_zdbwData: [],//储罐类重点部位数据
            jzfqData: [],//建筑分区原始数据
            JZFQ: false,
            jzl_jzfqData: [],//建筑群-建筑类数据
            zzl_jzfqData: [],//建筑群-装置类数据
            cgl_jzfqData: [],//建筑群-储罐类数据
            //消防力量显示标识：
            XFLL: false,
            //消防力量数据：
            xfllData: [],
            //消防措施显示标识：
            //安全疏散措施显示标识
            AQSSCS: false,
            //安全出口显示标识
            isAqckShow: false,
            //疏散楼梯显示标识
            isSsltShow: false,
            //消防电梯显示标识
            isXfdtShow: false,
            //避难层显示标识
            isBncShow: false,
            //应急广播显示标识
            isYjgbShow: false,
            //消防水系统显示标识
            XFSXT: false,
            //消防泵房显示标识
            isXfbfShow: false,
            //消防水箱显示标识
            isXfsxShow: false,
            //消防水池显示标识
            isXfscShow: false,
            //室内消火栓显示标识
            isSnxhsShow: false,
            //室外消火栓显示标识
            isSwxhsShow: false,
            //水泵接合器显示标识
            isSbjhqShow: false,
            //喷淋系统显示标识
            isPlxtShow: false,
            //冷却水系统显示标识
            isLqsxtShow: false,
            //固定水炮显示标识
            isGdspShow: false,
            //半固定设施显示标识
            isBgdssShow: false,
            //泡沫系统显示标识
            PMXT: false,
            //泡沫系统-泡沫泵房
            isPmbfShow: false,
            //泡沫系统-泡沫消火栓
            isPmxhsShow: false,
            //泡沫系统-固定泡沫炮
            isGdpmpShow: false,
            //泡沫系统-泡沫发生器
            isPmfsqShow: false,
            //泡沫系统-半固定设施
            isPmBgdssShow: false,
            //蒸汽灭火系统显示标识
            ZQMHXT: false,
            //蒸汽灭火系统-固定式
            isGdsShow: false,
            //蒸汽灭火系统-半固定式
            isBgdsShow: false,
            //消防控制室
            XFKZS: false,
            //防排烟措施
            FPYCS: false,
            //排烟口/出烟口
            isPycykShow: false,
            //防排烟措施-防排烟系统
            isFpyxtShow: false,
            //防火分区
            FHFQ: false,
            //其他灭火系统
            QTMHXT: false,
            //其他灭火系统-气体灭火系统
            isQtmhxtShow: false,
            //其他灭火系统-干粉灭火系统
            isGfmhxtShow: false,
            //其他消防设施
            QTXFSS: false,
            //消防措施数据：
            //安全出口data
            aqckData: [],
            //疏散楼梯data
            ssltData: [],
            //消防电梯data
            xfdtData: [],
            //避难层data
            bncData: [],
            //应急广播data
            yjgbData: [],
            //消防泵房data
            xfbfData: [],
            //消防水箱data
            xfsxData: [],
            //消防水池
            xfscData: [],
            //室内消火栓
            snxhsData: [],
            //室外消火栓
            swxhsData: [],
            //水泵接合器
            sbjhqData: [],
            //喷淋系统
            plxtData: [],
            //冷却水系统
            lqsxtData: [],
            //固定水炮
            gdspData: [],
            //半固定设施
            bgdssData: [],
            //泡沫系统-泡沫泵房
            pmbfData: [],
            //泡沫系统-泡沫消火栓
            pmxhsData: [],
            //泡沫系统-固定泡沫炮
            gdpmpData: [],
            //泡沫系统-泡沫发生器
            pmfsqData: [],
            //泡沫系统-半固定设施
            pmBgdssData: [],
            //蒸汽灭火系统-固定式
            gdsData: [],
            //蒸汽灭火系统-半固定式
            bgdsData: [],
            //消防控制室
            xfkzsData: [],
            //排烟口/出烟口
            pycykData: [],
            //防排烟措施-防排烟系统
            fpyxtData: [],
            //防火分区
            fhfqData: [],
            //其他灭火系统-气体灭火系统
            qtmhxtData: [],
            //其他灭火系统-干粉灭火系统
            gfmhxtData: [],
            //其他消防设施
            qtxfssData: [],
            //预案显示标识：
            YA: false,
            //预案数据
            yaData: [],


            engineForm: [{
                clid: '',
                clmc: '',
                clzzs: ''
            }],
            clIndex: '',
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
            //消防车辆弹出页---------------------------------------------------
            engineListVisible: false,
            loading_engine: false,
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 5,
            //总记录数
            total: 0,
            //搜索表单
            searchForm: {
                clmc: '',
                cphm: ''
            },
            tableData: [],
            //表高度变量
            tableheight: 243,
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
        // this.uuid = getQueryString("ID");
        this.getDwxzData();
        this.getFhdjData();
        this.getXzqhData();
        this.getXfdzData();
        this.getJzflData();
        //根据重点单位id获取重点单位详情
        this.getDetails();
    },
    methods: {
        //单位性质下拉框
        getDwxzData: function () {
            axios.get('/api/codelist/getCodeTypeOrderByNum/DWXZ').then(function (res) {
                this.dwxzData = res.data.result;
                // this.dwxzData.sort(this.compare('value'));
                // console.log(this.dwxzData);
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
        getXzqhData: function(){
            axios.get('/api/codelist/getXzqhTreeByUser').then(function(res){
                this.xzqhData = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },

        //防火队站、灭火队站级联下拉框
        getXfdzData: function () {
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.get('/api/codelist/getCodetype/ZDBWLX').then(function (res) {
                this.zdbwlxData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //重点部位类型下拉框
        getZdbwlxData: function(){
            axios.get('/api/codelist/getCodetype/ZDBWLX').then(function (res) {
                this.zdbwlxData = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },

        //使用性质下拉框
        getSyxzData: function(){
            axios.get('/api/codelist/getCodetype/SYXZ').then(function (res) {
                this.syxzData = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },

        //建筑结构下拉框
        getJzjgData: function(){
            axios.get('/api/codelist/getCodetype/JZJG').then(function (res) {
                this.jzjgData = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },

        //储罐类型下拉框
        getCglxData: function(){
            axios.get('/api/codelist/getCodetype/CGLX').then(function (res) {
                this.cglxData = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },

        //单位消防力量新增
        addDomainXfll: function(){
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
        removeDomainXfll: function(item){
            var index = this.editForm.xfllList.indexOf(item);
            if (index !== -1) {
                this.editForm.xfllList.splice(item, 1);
            }
        },

        //建筑信息新增
        addDomainJzxx: function(){
            this.editForm.jzxxList.push({
                jzmc: '',
                key: Date.now()
            });
        },

        //建筑信息移除
        removeDomainJzxx: function(item){
            var index = this.editForm.jzxxList.indexOf(item);
            if (index !== -1) {
                this.editForm.jzxxList.splice(item, 1);
            }
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
                pageSize: this.pageSize_building,
                pageNum: this.currentPage_building
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
        addDomainZdbw: function(){
            this.getZdbwlxData();
            this.editForm.zdbwList.push({
                zdbwmc: '',
                zdbwlx: '',
                zdbwwz: '',
                wxxfx: '',
                zysx: '',
                bz: '',
                jzl: {
                    syxz: '',
                    jzjg: '',
                    qymj: '',
                    gnms: '',
                    wxjzList: [],
                },
                zzl: {},
                cgl: {},
                key: Date.now()
            });
        },

        //重点部位移除
        removeDomainZdbw: function(item){
            var index = this.editForm.zdbwList.indexOf(item);
            if (index !== -1) {
                this.editForm.zdbwList.splice(item, 1);
            }
        },

        //危险介质新增
        addDomainWxjz: function(index){ 
            this.editForm.zdbwList[index].jzl.wxjzList.push({
                jzmc: '',
                jzsjcl: '',
                jzlhtx: '',
                jzbz: '',
                key: Date.now()
            });
        },

        //危险介质移除
        removeDomainWxjz: function(index,item){
            debugger;
            var temp = this.editForm.zdbwList[index].jzl.wxjzList.indexOf(item);
            if (temp !== -1) {
                this.editForm.zdbwList[index].jzl.wxjzList.splice(item, 1);
            }
        },

        //储罐新增
        addDomainCg: function(index){
            this.getCglxData();
            this.editForm.zdbwList[index].cgl.cgList.push({
                cgmc: '',
                cglx: '',
                cgzj: '',
                cggd: '',
                cgzc: '',
                gdmj: '',
                gzyl: '',
                ccwd: '',
                ccjzmc: '',
                ccjzlhtx: '',
                ccjzsjcl: '',
                ccjzywgd: '',
                bz: '',
                key: Date.now()
            });
        },

        //储罐移除
        removeDomainCg: function(index,item){
            var temp = this.editForm.zdbwList[index].cgl.cgList.indexOf(item);
            if (temp !== -1) {
                this.editForm.zdbwList[index].cgl.cgList.splice(item, 1);
            }
        },

        //重点部位类型Change
        zdbwlxChange: function(index){
            var zdbwlx = this.editForm.zdbwList[index].zdbwlx;
            if(zdbwlx == "10"){
                this.getSyxzData();
                this.getJzjgData();
                this.editForm.zdbwList[index].jzl = {
                    syxz: '',
                    jzjg: '',
                    qymj: '',
                    gnms: '',
                    wxjzList: [],
                }
            }else if(zdbwlx == "20"){
                this.getJzjgData();
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
            }else if(zdbwlx == "30"){
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

        //获取重点单位详情
        getDetails: function () {
            this.loading = true;
            axios.get('/dpapi/importantunits/' + this.uuid).then(function (res) {
                this.tableData = res.data.result;
                this.loading = false;
                // //显示图片
                // doFindPhoto("DWXZ", res.data.result.dwxz);
                // // if (this.tableData !== []) {
                //根据重点单位id获取消防队伍信息
                this.getXfllListByZddwIdo();
                // //根据重点单位id获取消防设施信息
                // this.getXfssDetailByVo();
                // //根据重点单位id获取建筑类重点部位详情集合
                // this.getJzlListByZddwId();
                // //根据重点单位id获取装置类重点部位详情集合
                // this.getZzlListByZddwId();
                // //根据重点单位id获取储罐类重点部位详情集合
                // this.getCglListByZddwId();
                // //根据重点单位id获取包含的分区详情
                // this.getJzfqDetailByVo();
                // //根据重点单位id获取预案信息
                // this.getYaListByVo();
                // }
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位id获取消防队伍信息
        getXfllListByZddwIdo: function () {
            axios.get('/dpapi/importantunits/doFindXfllListByZddwId/' + this.uuid).then(function (res) {
                this.xfllData = res.data.result;
                if (this.xfllData.length !== 0) {
                    this.XFLL = true;
                }
                // console.log(this.xfllData);
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位id获取建筑类重点部位详情
        getJzlListByZddwId: function () {
            axios.get('/dpapi/importantparts/doFindJzlListByZddwId/' + this.uuid).then(function (res) {
                this.jzl_zdbwData = res.data.result;
                if (this.jzl_zdbwData.length !== 0) {
                    this.ZDBW = true;
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位id获取装置类重点部位详情
        getZzlListByZddwId: function () {
            axios.get('/dpapi/importantparts/doFindZzlListByZddwId/' + this.uuid).then(function (res) {
                this.zzl_zdbwData = res.data.result;
                if (this.zzl_zdbwData.length !== 0) {
                    this.ZDBW = true;
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位id获取装置类重点部位详情
        getCglListByZddwId: function () {
            axios.get('/dpapi/importantparts/doFindCglListByZddwId/' + this.uuid).then(function (res) {
                this.cgl_zdbwData = res.data.result;
                if (this.cgl_zdbwData.length !== 0) {
                    this.ZDBW = true;
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位id获取建筑分区信息
        getJzfqDetailByVo: function () {
            var params = {
                uuid: this.uuid,
                // jzfl: this.tableData.jzfl
            };
            axios.post('/dpapi/importantunits/doFindBuildingDetailsByVo/', params).then(function (res) {
                this.jzfqData = res.data.result;
                if (this.jzfqData.length > 0) {
                    for (var i = 0; i < this.jzfqData.length; i++) {  //循环LIST
                        var jzlx = this.jzfqData[i].jzlx;//获取LIST里面的对象
                        switch (jzlx) {
                            case "30":
                                this.zzl_jzfqData.push(this.jzfqData[i]);
                                break;
                            case "40":
                                this.cgl_jzfqData.push(this.jzfqData[i]);
                                break;
                            default:
                                this.jzl_jzfqData.push(this.jzfqData[i]);
                                break;
                        };
                    }
                }

                // if (this.tableData.jzfl == 10 || this.tableData.jzfl == 20) {
                //     this.jzl_jzfqData = res.data.result;
                // } else if (this.tableData.jzfl == 30) {
                //     this.zzl_jzfqData = res.data.result;
                // } else if (this.tableData.jzfl == 40) {
                //     this.cgl_jzfqData = res.data.result;
                // }
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //通过重点单位id查询消防设施
        getXfssDetailByVo: function () {
            var params = {
                uuid: this.uuid
            }
            axios.post('/dpapi/importantunits/doFindFireFacilitiesDetailsByVo', params).then(function (res) {
                var data = res.data.result;
                for (var i in data) {
                    switch (i) {
                        //安全疏散措施
                        case '1000':
                            break;
                        case '1001':
                            this.AQSSCS = true;
                            this.isAqckShow = true;
                            this.aqckData = data[i];
                            break;
                        case '1002':
                            this.AQSSCS = true;
                            this.isSsltShow = true;
                            this.ssltData = data[i];
                            break;
                        case '1003':
                            this.AQSSCS = true;
                            this.isXfdtShow = true;
                            this.xfdtData = data[i];
                            break;
                        case '1004':
                            this.AQSSCS = true;
                            this.isBncShow = true;
                            this.bncData = data[i];
                            break;
                        case '1005':
                            this.AQSSCS = true;
                            this.isYjgbShow = true;
                            this.yjgbData = data[i];
                            break;
                        //消防水系统
                        case '2000':
                            break;
                        case '2001':
                            this.XFSXT = true;
                            this.isXfbfShow = true;
                            this.xfbfData = data[i];
                            break;
                        case '2002':
                            this.XFSXT = true;
                            this.isXfsxShow = true;
                            this.xfsxData = data[i];
                            break;
                        case '2003':
                            this.XFSXT = true;
                            this.isXfscShow = true;
                            this.xfscData = data[i];
                            break;
                        case '2004':
                            this.XFSXT = true;
                            this.isSnxhsShow = true;
                            this.snxhsData = data[i];
                            break;
                        case '2005':
                            this.XFSXT = true;
                            this.isSwxhsShow = true;
                            this.swxhsData = data[i];
                            break;
                        case '2006':
                            this.XFSXT = true;
                            this.isSbjhqShow = true;
                            this.sbjhqData = data[i];
                            break;
                        case '2007':
                            this.XFSXT = true;
                            this.isPlxtShow = true;
                            this.plxtData = data[i];
                            break;
                        case '2008':
                            this.XFSXT = true;
                            this.isLqsxtShow = true;
                            this.lqsxtData = data[i];
                            break;
                        case '2009':
                            this.XFSXT = true;
                            this.isGdspShow = true;
                            this.gdspData = data[i];
                            break;
                        case '2010':
                            this.XFSXT = true;
                            this.isBgdssShow = true;
                            this.bgdssData = data[i];
                            break;
                        //泡沫系统
                        case '3000':
                            break;
                        case '3001':
                            this.PMXT = true;
                            this.isPmbfShow = true;
                            this.pmbfData = data[i];
                            break;
                        case '3002':
                            this.PMXT = true;
                            this.isPmxhsShow = true;
                            this.pmxhsData = data[i];
                            break;
                        case '3003':
                            this.PMXT = true;
                            this.isGdpmpShow = true;
                            this.gdpmpData = data[i];
                            break;
                        case '3004':
                            this.PMXT = true;
                            this.isPmfsqShow = true;
                            this.pmfsqData = data[i];
                            break;
                        case '3005':
                            this.PMXT = true;
                            this.isPmBgdssShow = true;
                            this.pmBgdssData = data[i];
                            break;
                        //蒸汽灭火系统
                        case '4000':
                            break;
                        case '4001':
                            this.ZQMHXT = true;
                            this.isGdsShow = true;
                            this.gdsData = data[i];
                            break;
                        case '4002':
                            this.ZQMHXT = true;
                            this.isBgdsShow = true;
                            this.bgdsData = data[i];
                            break;
                        //消防控制室
                        case '5000':
                            this.XFKZS = true;
                            this.xfkzsData = data[i];
                            break;
                        //防排烟措施
                        case '6000':
                            break;
                        case '6001':
                            this.FPYCS = true;
                            this.isPycykShow = true;
                            this.pycykData = data[i];
                            break;
                        case '6002':
                            this.FPYCS = true;
                            this.isFpyxtShow = true;
                            this.fpyxtData = data[i];
                            break;
                        //防火分区
                        case '7000':
                            this.FHFQ = true;
                            this.fhfqData = data[i];
                            break;
                        //其他灭火系统
                        case '8000':
                            break;
                        case '8001':
                            this.QTMHXT = true;
                            this.isQtmhxtShow = true;
                            this.qtmhxtData = data[i];
                            break;
                        case '8002':
                            this.QTMHXT = true;
                            this.isGfmhxtShow = true;
                            this.gfmhxtData = data[i];
                            break;
                        //其他消防设施
                        case '9000':
                            this.QTXFSS = true;
                            this.qtxfssData = data[i];
                            break;
                    }
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        getJzflData: function () {
            axios.get('/api/codelist/getCodetype/JZFL').then(function (res) {
                this.jzflData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //根据重点单位id获取预案信息
        getYaListByVo: function () {
            var params = {
                dxid: this.uuid,
            }
            axios.post('/dpapi/digitalplanlist/list', params).then(function (res) {
                var tempData = res.data.result;
                for (var i = 0; i < tempData.length; i++) {
                    tempData[i].zzsj = tempData[i].zzsj.substring(0, 10);
                }
                this.yaData = tempData;
                if (this.yaData.length !== 0) {
                    this.YA = true;
                }
                // console.log(this.yaData);
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //增加消防力量
        addXfllData:function() {
            this.xfllData.push({
                xfdwlx: '',
                xfdwrs: '',
                xfdwcls: '',
                xfdwlxr: '',
                xfdwdh: '',
                bz: ''
            });
        },
        //灾情删除
        removeXfllData:function(item) {
            var index = this.xfllData.indexOf(item)
            if (index !== -1) {
                this.xfllData.splice(index, 1)
            }
        },

        checkForm: function () {
            if (this.addForm.zbmc == '' || this.addForm == null) {
                this.$message.warning({
                    message: '请输入装备名称',
                    showClose: true
                });
                return false;
            }
            for (var i in this.engineForm) {
                if (this.engineForm[i].clid == '' && this.engineForm[i].clzzs == 0) {
                    this.removeDomain(this.engineForm[i]);
                    return true;
                } else if (this.engineForm[i].clid == '' && this.engineForm[i].clzzs > 0) {
                    this.$message.warning({
                        message: '请选择消防车辆',
                        showClose: true
                    });
                    return false;
                }
            }
            return true;
        },
        //保存
        save: function () {
            if (this.checkForm() == true) {
                if (this.status == 0) {//新增
                    this.addForm.cjrid = this.role_data.userid;
                    this.addForm.cjrmc = this.role_data.realName;
                    this.addForm.scsj = dateFormat(new Date(this.addForm.scsj));
                    for (var i in this.engineForm) {
                        this.addForm.zzsl = parseInt(this.addForm.zzsl) + parseInt(this.engineForm[i].clzzs);
                    }
                    this.addForm.zcbl = parseInt(this.addForm.kysl) + parseInt(this.addForm.shsl) + parseInt(this.addForm.zzsl);
                    if (this.addForm.zblx.length > 0) {
                        this.addForm.zblx = this.addForm.zblx[this.addForm.zblx.length - 1];
                    }
                    if (this.addForm.xzqh.length > 0) {
                        this.addForm.xzqh = this.addForm.xzqh[this.addForm.xzqh.length - 1];
                    }
                    if (this.addForm.ssdz.length > 0) {
                        this.addForm.ssdz = this.addForm.ssdz[this.addForm.ssdz.length - 1];
                    }
                    this.addForm.equipengineVOList = this.engineForm;
                    axios.post('/dpapi/equipmentsource/insertByVO', this.addForm).then(function (res) {
                        if (res.data.result.uuid != null && res.data.result.uuid != '') {
                            this.$alert('保存成功', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/equipment_list");
                                }
                            });
                        } else {
                            this.$alert('保存失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/equipment_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                } else {//修改
                    this.addForm.xgrid = this.role_data.userid;
                    this.addForm.xgrmc = this.role_data.realName;
                    this.addForm.scsj = dateFormat(new Date(this.addForm.scsj));
                    this.addForm.yjlx = this.addForm.yjlx[this.addForm.yjlx.length - 1];
                    axios.post('/dpapi/firedrug/doUpdateDrug', this.addForm).then(function (res) {
                        if (res.data.result >= 1) {
                            this.$alert('成功修改' + res.data.result + '条消防药剂信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/equipment_list");
                                }
                            });
                        } else {
                            this.$alert('修改失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/equipment_list");
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
            loadDiv("basicinfo/equipment_list");
        }
    },

})