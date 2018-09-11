//axios默认设置cookie
axios.defaults.withCredentials = true;
new Vue({
    el: '#app',
    data: function () {
        return {
            //菜单编码
            activeIndex: '',
            activeName: "first",  
            isZddw:false,
            isDtjz:false,
            isJzl:false,
            isZzl:false,
            yaxx_lrsj:"",
            isZdy:false,
            //预案搜索表单
            yuAnSearchForm: {
                YAMC:"",
                YADX:"",
                YALX:"",
                YAJB:"",
                SHZT:"",
                LRSJ:"",
                yaxx_lrsj:"",
                begintime_create: "",
                endtime_create: ""
            },
            //预案对象搜索表单
            YADXSearchForm: {
                DXMC:"",
                YADX:"",
                XFGX:"",
                DWXZ:"",
                XZQH:"",
                FHDJ:"",
                DWJZQK:""
            },
            //单位建筑搜索表单
            DWJZSearchForm:{
                JZMC:"",
                JZLX:"",
                JZSYXZ:"",
                JZJG:"",
                JZGD:"",
            },
            //预案信息
            tableData:[{
                yamc: '',
                dxmc: '',
                yalxmc:''
            }],
            //预案对象
            YADXtableData:[],
            //单位建筑
            DWJZtableData:[],
            
            //预案对象
            yadx_data: [
                { codeValue: "", codeName: "全部" },
                { codeValue: "1", codeName: "重点单位" },
                { codeValue: "2", codeName: "消防保卫警卫" },
                { codeValue: "3", codeName: "其他对象" }],
            //预案类型
            yalx_data: [{ codeValue: "", codeName: "全部" }],
            //预案级别
            yajb_data: [{ codeValue: "", codeName: "全部" }],
            //审核状态
            shzt_data: [{ codeValue: "", codeName: "全部" }],
            //录入时间
            lrsj_data: [
                { codeValue: "", codeName: "全部" },
                { codeValue: "today", codeName: "今日" },
                { codeValue: "yesterday", codeName: "昨日" },
                { codeValue: "lastweek", codeName: "最近7日" },
                { codeValue: "lastmonth", codeName: "最近30日" },
                { codeValue: "others", codeName: "自定义时间" }],
            //消防管辖
            xfgx_data:[{ codeValue: "", codeName: "全部" }],
            //单位性质
            dwxz_data:[{ codeValue: "", codeName: "全部" }],
            //行政区划
            xzqh_data:[{ codeValue: "", codeName: "全部" }],
            //防火等级
            fhdj_data:[{ codeValue: "", codeName: "全部" }],
            //单位建筑情况
            dwjzqk_data:[{ codeValue: "", codeName: "全部" }],
            //建筑使用性质
            jzsyxz_data:[{ codeValue: "", codeName: "全部" }],
            //建筑结构
            jzjg_data:[{ codeValue: "", codeName: "全部" }],
            //建筑高度
            jzgd_data:[{ codeValue: "", codeName: "全部" },
            { codeValue: "1", codeName: "<=50m" },
            { codeValue: "2", codeName: ">50m且<=100m" },
            { codeValue: "3", codeName: ">100m" }],
            
            //保卫警卫详情页是否显示
            planDetailVisible: false,
            //显示加载中样
            loading: false,
            //当前页
            // currentPage: 1,
            currentPageYaxx: 1,
            currentPageYadx: 1,
            currentPageJzxx: 1,
            //分页大小
            // pageSize: 10,
            pageSizeYaxx: 10,
            pageSizeYadx: 10,
            pageSizeJzxx: 10,
            //预案信息总记录数
            // total: 0,
            totalYaxx: 0,
            totalYadx: 0,
            totalJzxx: 0,
            //序号
            indexData: 0,
            //tab页
            tabIndex: 0,
            //登录用户
            shiroData: [],
            //预案对象消防管辖显示
            xfgxShow: true,
        }
    },
    created: function () {
        /**菜单选中 by li.xue 20180628*/
        /**
        var index = getQueryString("index");
        $("#activeIndex").val(index);
        this.activeIndex = index;
         */
        
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("高级搜索", "-1");
        /**当前登陆用户 by li.xue 20180807*/
        this.shiroData = shiroGlobal;
        //this.YADX();
        this.YALX();
        this.YAJB();
        this.SHZT();
        this.XFGX();
        this.DWXZ();
        this.XZQH();
        this.FHDJ();
        this.DWJZQK();
        this.JZSYXZ();
        this.JZJG();
        //预案信息
        this.searchClick('click');
    },
    methods: {
        handleNodeClick(data) {
            console.log(data);
        },
        //当前页修改事件
        handleCurrentChange(val) {
            // this.currentPage = val;
            if(this.tabIndex == 0){
                this.currentPageYaxx = val;
                this.searchClick('page');
            }else if(this.tabIndex == 1){
                this.currentPageYadx = val;
                this.searchYADXClick('page');
            }else if(this.tabIndex == 2){
                this.currentPageJzxx = val;
                this.searchDWJZClick('page');
            }
        },

        //高级搜索-预案搜索 查询事件
        searchClick: function(type) {
            //按钮事件的选择
            if(type == 'page'){
                this.tableData = [];        
            }else{
                this.currentPageYaxx = 1;
            }
            this.loading = true;
            var _self = this;
            //制作机构
            var jgid = "";
            if(this.shiroData.organizationVO.jgid.substr(2,6)!='000000'){
                jgid = this.shiroData.organizationVO.uuid;
            }
            var params = {
                yamc : this.yuAnSearchForm.YAMC,
                yadxType : this.yuAnSearchForm.YADX,
                yalx : this.yuAnSearchForm.YALX.substr(0,1),
                yajb : this.yuAnSearchForm.YAJB,
                shzt : this.yuAnSearchForm.SHZT,
                jgid : jgid,
                begintime: this.yuAnSearchForm.begintime_create,
                endtime: this.yuAnSearchForm.endtime_create,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSizeYaxx,
                pageNum: this.currentPageYaxx,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/advancedsearch/gjssYaxxList', params).then(function (res) {
                var tableTemp = new Array((this.currentPageYaxx-1)*this.pageSizeYaxx);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.totalYaxx = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //预案对象查询事件
        searchYADXClick: function(type){
            //按钮事件的选择
            if(type == 'page'){
                this.YADXtableData = []; 
            }else{
                this.currentPageYadx = 1;
            }
            this.loading = true;
            //消防管辖
            var xfgx = '';
            if(this.shiroData.organizationVO.jgid.substr(2,6)!='000000'){
                xfgx = this.shiroData.organizationVO.uuid;
            }
            var params = {
                dxmc : this.YADXSearchForm.DXMC,
                yadxType : this.YADXSearchForm.YADX,
                xfgx : xfgx,
                dwxz : this.YADXSearchForm.DWXZ,
                xzqh : this.YADXSearchForm.XZQH,
                fhdj : this.YADXSearchForm.FHDJ,
                jzfl : this.YADXSearchForm.DWJZQK,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSizeYadx,
                pageNum: this.currentPageYadx,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/advancedsearch/gjssYadxList', params).then(function (res) {
                var tableTemp = new Array((this.currentPageYadx-1)*this.pageSizeYadx);
                this.YADXtableData = tableTemp.concat(res.data.result.list);
                this.totalYadx = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //单位建筑信息查询事件
        searchDWJZClick:function(type){
            //按钮事件的选择
            if(type == 'page'){
                this.DWJZtableData = [];     
            }else{
                this.currentPageJzxx = 1;
            }
            this.loading = true;
            var params = {
                jzmc:this.DWJZSearchForm.JZMC,
                jzlx:this.DWJZSearchForm.JZLX,
                jzl_jzsyxz:this.DWJZSearchForm.JZSYXZ.substr(0,1),
                jzl_jzjg:this.DWJZSearchForm.JZJG,
                jzl_dsgd:this.DWJZSearchForm.JZGD,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSizeJzxx,
                pageNum: this.currentPageJzxx,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/advancedsearch/gjssDwjzList', params).then(function (res) {
                var tableTemp = new Array((this.currentPageJzxx-1)*this.pageSizeJzxx);
                this.DWJZtableData = tableTemp.concat(res.data.result.list);
                this.totalJzxx = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //预案类型初始化
        YALX: function () {
            axios.get('/api/codelist/getCodetype/YALX').then(function (res) {
                for (var i = 0; i < res.data.result.length; i++) {
                    if(res.data.result[i].codeValue.substr(1,4) == '0000'){
                        this.yalx_data.push(res.data.result[i]);
                    }     
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //预案级别初始化
        YAJB:function(){
            axios.get('/api/codelist/getCodetype/YAJB').then(function (res) {
                axios.get('/dpapi/xfdz/doFindDzlxByOrgId/' + this.shiroData.organizationVO.uuid).then(function (res1) {
                    var dzlx = res1.data.result;
                    switch(dzlx){
                        case '0100':
                            this.yajb_data.push(res.data.result[0]); 
                        case '0200':
                            this.yajb_data.push(res.data.result[1]); 
                        case '0300':
                            this.yajb_data.push(res.data.result[2]); 
                        default:
                            this.yajb_data.push(res.data.result[3]); 
                    }
                    
                }.bind(this), function (error) {
                    console.log(error);
                })
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //审核状态初始化
        SHZT:function(){
            axios.get('/api/codelist/getCodetype/YASHZT').then(function (res) {
                for (var i = 0; i < res.data.result.length; i++) {
                    this.shzt_data.push(res.data.result[i]);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //消防管辖初始化
        XFGX:function(){
            if(this.shiroData.organizationVO.uuid == 'eb09df352cda4902b24c54dd2b2ce656'){
                axios.get('/dpapi/util/doSearchContingents').then(function (res) {
                    for (var i = 0; i < res.data.result.length; i++) {
                        this.xfgx_data.push(res.data.result[i]);
                    }
                }.bind(this), function (error) {
                    console.log(error);
                })
            }else{
                axios.get('/dpapi/util/doFindXfdzByZongdId/' + this.shiroData.organizationVO.uuid).then(function (res) {
                    this.xfgx_data = res.data.result;
                    if(this.xfgx_data.length == 0){
                        this.xfgxShow = false;
                    }
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //单位性质初始化
        DWXZ:function(){
            axios.get('/api/codelist/getCodetype/DWXZ').then(function (res) {
                for (var i = 0; i < res.data.result.length; i++) {
                    this.dwxz_data.push(res.data.result[i]);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //行政区划初始化
        XZQH:function(){
            axios.get('/api/codelist/getXzqh/XZQH').then(function (res) {
                for (var i = 0; i < res.data.result.length; i++) {
                    this.xzqh_data.push(res.data.result[i]);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //防火等级初始化
        FHDJ:function(){
            axios.get('/api/codelist/getCodetype/FHDJ').then(function (res) {
                for (var i = 0; i < res.data.result.length; i++) {
                    this.fhdj_data.push(res.data.result[i]);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //单位建筑情况初始化
        DWJZQK:function(){
            axios.get('/api/codelist/getCodetype/JZLX').then(function (res) {
                for (var i = 0; i < res.data.result.length; i++) {
                    this.dwjzqk_data.push(res.data.result[i]);
                }
            }.bind(this), function (error) {
                console.log(error);
            }) 
        },
        //建筑使用性质初始化
        JZSYXZ:function(){
            axios.get('/api/codelist/getCodetype/JZSYXZ').then(function (res) {
                for (var i = 0; i < res.data.result.length; i++) {
                    if(res.data.result[i].codeValue.substr(1,3) == '000')
                    this.jzsyxz_data.push(res.data.result[i]);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //建筑结构初始化
        JZJG:function(){
            axios.get('/api/codelist/getCodetype/JZJG').then(function (res) {
                for (var i = 0; i < res.data.result.length; i++) {
                    this.jzjg_data.push(res.data.result[i]);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
       

        //预案对象信息中对象类型为重点单位时显示其他搜索条件
        isZddwShow:function(){
            if(this.YADXSearchForm.YADX == "1")
                this.isZddw = true;
            else{
                this.isZddw = false;
                this.YADXSearchForm.DWXZ="";
                this.YADXSearchForm.XZQH="";
                this.YADXSearchForm.FHDJ="";
                this.YADXSearchForm.DWJZQK="";
            }
        },
        //根据建筑类型展示不同的查询条件
        selectJzlx:function(){
            switch(this.DWJZSearchForm.JZLX){
                case '':
                    this.isZzl = false;
                    this.isJzl = false;
                    this.isDtjz = false;
                    break;
                case '10':
                    this.isDtjz = true;
                    this.isJzl = false;
                    this.isZzl = false;
                    break;
                case '20':
                    this.isJzl = true;
                    this.isDtjz = false;
                    this.isZzl = false;
                    break;
                case '30':
                    this.isZzl = true;
                    this.isJzl = false;
                    this.isDtjz = false;
                    break;
                case '40':
                    this.isZzl = false;
                    this.isJzl = false;
                    this.isDtjz = false;
                    break;
            }
            this.DWJZSearchForm.JZSYXZ="";
            this.DWJZSearchForm.JZJG="";
            this.DWJZSearchForm.JZGD="";
        },
        /* 
        //预案种类全选
        handleCheckedYazlChange(value) {
            if (value.currentTarget.defaultValue == "全部") {
                this.checkedYazl = [];
                if (value.currentTarget.checked == true) {
                    for (var i = 0; i < this.yazl_data.length; i++) {
                        this.checkedYazl.push(this.yazl_data[i].codeName);
                    }
                }
            } else {
                if (value.currentTarget.checked == false) {
                    for (var i = 0; i < this.checkedYazl.length; i++) {
                        if (this.checkedYazl[i] == "全部") {
                            this.checkedYazl.splice(i, 1);
                        }
                    }
                } else if (value.currentTarget.checked == true) {
                    if (this.checkedYazl.length == this.yazl_data.length - 1) {
                        this.checkedYazl.push('全部');
                    }
                }
            }
        },
        //对象种类全选
        handleCheckedDxzlChange(value) {
            if (value.currentTarget.defaultValue == "全部") {
                this.checkedDxzl = [];
                if (value.currentTarget.checked == true) {
                    for (var i = 0; i < this.dxzl_data.length; i++) {
                        this.checkedDxzl.push(this.dxzl_data[i].codeName);
                    }
                }
            } else {
                if (value.currentTarget.checked == false) {
                    for (var i = 0; i < this.checkedYazl.length; i++) {
                        if (this.checkedDxzl[i] == "全部") {
                            this.checkedDxzl.splice(i, 1);
                        }
                    }
                } else if (value.currentTarget.checked == true) {
                    if (this.checkedDxzl.length == this.dxzl_data.length - 1) {
                        this.checkedDxzl.push('全部');
                    }
                }
            }
        },
        //预案类型全选
        handleCheckedYalxChange(value) {
            if (value.currentTarget.defaultValue == "全部") {
                this.checkedYalx = [];
                if (value.currentTarget.checked == true) {
                    for (var i = 0; i < this.yalx_data.length; i++) {
                        this.checkedYalx.push(this.yalx_data[i].codeName);
                    }
                }
            } else {
                if (value.currentTarget.checked == false) {
                    for (var i = 0; i < this.checkedYazl.length; i++) {
                        if (this.checkedYalx[i] == "全部") {
                            this.checkedYalx.splice(i, 1);
                        }
                    }
                } else if (value.currentTarget.checked == true) {
                    if (this.checkedYalx.length == this.yalx_data.length - 1) {
                        this.checkedYalx.push('全部');
                    }
                }
            }
        },*/
        //预案详情跳转
        planDetails(val) {
            switch(val.yadxType){
                case '重点单位':
                    var params = {
                        ID: val.uuid,
                        type: "GJSS"
                    }
                    loadDivParam("digitalplan/digitalplan_detail", params);
                    //window.location.href = "digitalplan_detail.html?ID=" + val.uuid + "&index=" + this.activeIndex + "&type=GJSS";
                    break;
                case '消防保卫警卫':
                    var _self = this;
                    _self.planDetailVisible = true;
                    var shortURL = top.location.href.substr(0, top.location.href.indexOf("?")) + "?pkid=" + val.uuid + "&index=" + this.activeIndex + "&type=GJSS";
                    history.pushState(null, null, shortURL)
                    //异步加载详情页
                    $(function () {
                        $.ajax({
                            url: '../../../templates/digitalplan/guardobjectsplan_detail.html',
                            cache: true,
                            async: true,
                            success: function (html) {
                                $("#detailDialog").html(html);
                            }
                        });
                    });
                    break;
                case '其他对象':
                    var _self = this;
                    _self.planDetailVisible = true;
                    var shortURL = top.location.href.substr(0, top.location.href.indexOf("?")) + "?uuid=" + val.uuid + "&index=" + this.activeIndex + "&type=GJSS";
                    history.pushState(null, null, shortURL)
                    //异步加载详情页
                    $(function () {
                        $.ajax({
                            url: '../../../templates/digitalplan/otherobjectsplan_detail.html',
                            cache: true,
                            async: true,
                            success: function (html) {
                                $("#detailDialog").html(html);
                            }
                        });
                    });
                    break;
            }
        },
        //预案对象详情跳转
        /**如果对象类型为重点单位点击预案名称跳转到详情页，
         * 如果对象类型为消防保卫警卫、其他对象
         * 则跳转到这两个页面的查询页面，直接查询其对象。
         */
        YadxDetails(val) {
            var params = {
                ID: val.uuid,
                type: "GJSS"
            }
            var loadDivUrl; 
            switch(val.yadxType){
            case '重点单位':
                loadDivUrl = "planobject/importantunits_detail";
                //window.location.href = "../planobject/importantunits_detail.html?ID=" + val.uuid + "&index=" + this.activeIndex + "&type=GJSS";
                break;
            case '消防保卫警卫':
                loadDivUrl = "planobject/guardobjects_detail";
                //window.location.href = "../planobject/guardobjects_detail.html?id=" + val.uuid + "&index=" + this.activeIndex + "&type=GJSS";
                break;
            case '其他对象':
                loadDivUrl = "planobject/otherobjects_detail";
                //window.location.href = "../planobject/otherobjects_detail.html?id=" + val.uuid + "&index=" + this.activeIndex + "&type=GJSS";
                break;
            }
            loadDivParam(loadDivUrl, params); 
        },
        //单位建筑详情跳转
        buildingDetails(val) {
            var params = {
                id: val.jzid,
                jzlx: val.jzlx,
                type: "GJSS"
            }
            loadDivParam("buildingzoning/buildingzoning_detail", params); 
            //window.location.href = "../buildingzoning/building_zoning_detail.html?id=" + val.jzid +"&jzlx=" +val.jzlx + "&index=" + this.activeIndex + "&type=GJSS";
        },

        clearClick: function () {
            this.yuAnSearchForm.YAMC = "";
            this.yuAnSearchForm.YADX = "";
            this.yuAnSearchForm.YALX = "";
            this.yuAnSearchForm.YAJB = "";
            this.yuAnSearchForm.SHZT = "";
            this.yuAnSearchForm.LRSJ = "";
            this.yuAnSearchForm.begintime_create = "";
            this.yuAnSearchForm.endtime_create = "";
            this.searchClick('reset');
        },
        clearYADXClick:function(){
            this.YADXSearchForm.DXMC = "";
            this.YADXSearchForm.YADX = "";
            this.YADXSearchForm.XFGX = "";
            this.searchYADXClick('reset');
        },
        //单位建筑
        clearDWJZClick:function(){
            this.DWJZSearchForm.JZMC="";
            this.DWJZSearchForm.JZLX="";
            this.searchDWJZClick('reset');
        },
        //获取制作时间范围
        lrsjFormat:function(){
            switch(this.yuAnSearchForm.LRSJ){
                case '':
                    this.isZdy = false;
                    this.yuAnSearchForm.begintime_create = "";
                    this.yuAnSearchForm.endtime_create = "";
                    break;
                case 'today':
                    this.isZdy = false;
                    var date = new Date();      //当前时间
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    month = month < 10 ? "0" + month : month;
                    day = day < 10 ? "0" + day : day;
                    this.yuAnSearchForm.begintime_create = year + "/" + month + "/" + day;
                    this.yuAnSearchForm.endtime_create = year + "/" + month + "/" + day; 
                    break;
                case 'yesterday':
                    this.isZdy = false;
                    var date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    month = month < 10 ? "0" + month : month;
                    day = day < 10 ? "0" + day : day;
                    this.yuAnSearchForm.begintime_create = year + "/" + month + "/" + day;
                    this.yuAnSearchForm.endtime_create = year + "/" + month + "/" + day; 
                    break;
                case 'lastweek':
                    this.isZdy = false;
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    month = month < 10 ? "0" + month : month;
                    day = day < 10 ? "0" + day : day;
                    this.yuAnSearchForm.endtime_create = year + "/" + month + "/" + day;
                    
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    year = date.getFullYear();
                    month = date.getMonth() + 1;
                    day = date.getDate();
                    month = month < 10 ? "0" + month : month;
                    day = day < 10 ? "0" + day : day;
                    this.yuAnSearchForm.begintime_create = year + "/" + month + "/" + day; 
                    break;
                case 'lastmonth':
                    this.isZdy = false;
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    month = month < 10 ? "0" + month : month;
                    day = day < 10 ? "0" + day : day;
                    this.yuAnSearchForm.endtime_create = year + "/" + month + "/" + day;
                    
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
                    year = date.getFullYear();
                    month = date.getMonth() + 1;
                    day = date.getDate();
                    month = month < 10 ? "0" + month : month;
                    day = day < 10 ? "0" + day : day;
                    this.yuAnSearchForm.begintime_create = year + "/" + month + "/" + day;
                    break;
                case 'others':
                    this.isZdy = true;
                    //清空自定义时间控件的值
                    this.yaxx_lrsj = "";
                    break;
            }
            
        },
        //自定义时间
        timeChange(val) {
            if(val == ""){
                this.yuAnSearchForm.begintime_create = "";
                this.yuAnSearchForm.endtime_create = "";
            }else{
                this.yuAnSearchForm.begintime_create = val.substring(0,val.indexOf("至"));
                this.yuAnSearchForm.endtime_create = val.substring(val.indexOf("至")+1)
            }
        },
        //点击tab页时，数据加载
        handleClick(tab, event) {
            this.tabIndex = tab.index;
            if(tab.index == 0){
                this.clearClick();
                // this.searchClick('click');
            }else if(tab.index == 1){
                this.clearYADXClick();
                // this.searchYADXClick('click');
            }else if(tab.index == 2){
                this.clearDWJZClick();
                // this.searchDWJZClick('click');
            }
        },
        //展开 收起
        spread:function(){
            var a = document.getElementById("xfgxSpread").innerText;  
            if(a=="展开"){
                document.getElementById('xfgxDiv').style.height='auto';
                document.getElementById("xfgxSpread").innerText="收起";
            }else if(a=="收起"){
                document.getElementById('xfgxDiv').style.height='34px';
                document.getElementById("xfgxSpread").innerText="展开";
            }
            
        },
        spread_dwxz:function(){
            var a = document.getElementById("dwxzSpread").innerText;  
            if(a=="展开"){
                document.getElementById('dwxzDiv').style.height='auto';
                document.getElementById("dwxzSpread").innerText="收起";
            }else if(a=="收起"){
                document.getElementById('dwxzDiv').style.height='34px';
                document.getElementById("dwxzSpread").innerText="展开";
            }
            
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
        
        closeDialog: function (val) {
            this.planDetailVisible = false;
        },
        
    },

})