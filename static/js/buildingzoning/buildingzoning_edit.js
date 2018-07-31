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
            //队站类型
            jzlxData: [],
            //上级队站
            sjdzData: [],
            //行政区划
            xzqhData: [],
            //角色
            shiroData: [],
            //建筑属性
            isJzl: false,
            isZzl: false,
            isCgl: false,
            //编辑表单
            editForm: {
                jzmc: "",
                jzlx: "",
                jzwz: "",
                lon: "",
                lat: "",
                xqxclx: "",
                yjddsc: "",
                bz: "",
                //创建人、修改人
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: "",
                //总队VO
                zongdVO: {
                    dzid: "",
                    xygbrs: "",
                    zfzzxfys: "",
                    wzgys: "",
                    xxzhids: "",
                    xxzhongds: "",
                    zdzxm: "",
                    zdzlxfs: "",
                    zdzwxm: "",
                    zdzwlxfs: "",
                },
                //支队VO
                zhidVO: {
                    dzid: "",
                    xygbrs: "",
                    zfzzxfys: "",
                    xfwys: "",
                    xxdads: "",
                    xxzhongds: "",
                    sfdljj: "",
                    zdzxm: "",
                    zdzlxfs: "",
                    zdzwxm: "",
                    zdzwlxfs: "",
                },
                //大队VO
                dadVO: {
                    dzid: "",
                    xygbrs: "",
                    zfzzxfys: "",
                    xfwys: "",
                    xxzhongds: "",
                    sfdljj: "",
                    ddzxm: "",
                    ddzlxfs: "",
                    jdyxm: "",
                    jdylxfs: "",
                    fddzxm: "",
                    fddzlxfs: "",
                    fjdyxm: "",
                    fjdylxfs: "",
                },
                //中队VO
                zhongdVO: {
                    dzid: "",
                    xyrs: "",
                    zfzzxfys: "",
                    mrzqrs: "",
                    zdzxm: "",
                    zdzlxfs: "",
                    zdyxm: "",
                    zdylxfs: "",
                    fzdyxm: "",
                    fzdylxfs: "",
                    fzdzxm1: "",
                    fzdzlxfs1: "",
                    fzdzxm2: "",
                    fzdzlxfs2: "",
                    fzdzxm3: "",
                    fzdzlxfs3: ""
                },
                //其他消防队伍VO
                qtxfdwVO: {
                    dzid: "",
                    xfdyzrs: "",
                    mrzqrs: "",
                    gxdw: "",
                    gxdwlxfs: "",
                    dzxm: "",
                    dzlxfs: "",
                },
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
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("单位建筑信息", "单位建筑信息新增");
        } else if (type == "BJ") {
            loadBreadcrumb("单位建筑信息", "单位建筑信息编辑");
        }
        this.shiroData = shiroGlobal;
        this.status = getQueryString("ID");
        //建筑类型下拉框
        this.getJzlxData();
    },
    methods: {
        handleNodeClick(data) {
        },
        //建筑类型下拉框
        getJzlxData: function(){
            axios.get('/api/codelist/getCodetype/JZLX').then(function(res){
                this.jzlxData = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },    
        
        //表格查询事件
        searchClick: function () {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                var dzlxParam = getQueryString("dzlx");
                var params = {
                    dzid : this.status,
                    dzlx : dzlxParam
                };
                axios.post('/dpapi/xfdz/findDzDetailByVo',params).then(function (res) {
                    var result = res.data.result;
                    this.editForm = res.data.result;
                    //队站子属性信息
                    if(dzlxParam!=null && dzlxParam!=""){
                        switch(dzlxParam.substr(0,2)){
                            case "02":
                                this.isZongDui = true;
                                this.editForm.zhidVO = {};
                                this.editForm.dadVO = {};
                                this.editForm.zhongdVO = {};
                                this.editForm.qtxfdwVO = {};
                                break;
                            case "03":
                                this.isZhiDui = true;
                                this.editForm.zongdVO = {};
                                this.editForm.dadVO = {};
                                this.editForm.zhongdVO = {};
                                this.editForm.qtxfdwVO = {};
                                break;
                            case "05":
                                this.isDaDui = true;
                                this.editForm.zongdVO = {};
                                this.editForm.zhidVO = {};
                                this.editForm.zhongdVO = {};
                                this.editForm.qtxfdwVO = {};
                                break;
                            case "09":
                                this.isZhongDui = true;
                                this.editForm.zongdVO = {};
                                this.editForm.zhidVO = {};
                                this.editForm.dadVO = {};
                                this.editForm.qtxfdwVO = {};
                                break;
                            case "0A":
                                this.isQiTaXiaoFangDuiWu = true;
                                this.editForm.zongdVO = {};
                                this.editForm.zhidVO = {};
                                this.editForm.dadVO = {};
                                this.editForm.zhongdVO = {};
                                break;
                        }
                    }
                    
                    //队站类型
                    var dzlxArray = [];
                    if(result.dzlx!=null && result.dzlx!="" && result.dzlx.substr(0,2)=="0A" &&result.dzlx!="0A00"){
                        dzlxArray.push("0A00");
                    }
                    dzlxArray.push(result.dzlx);
                    this.editForm.dzlx = dzlxArray;
                    //行政区划
                    var xzqhArray = [];
                    if(result.xzqh!=null && result.xzqh!="" && result.xzqh.substr(2,4)!="0000"){
                        xzqhArray.push(result.xzqh.substr(0,2) + "0000");
                        if(result.xzqh.substr(4,2)!="00"){
                            xzqhArray.push(result.xzqh.substr(0,4) + "00");
                        }
                    }
                    xzqhArray.push(result.xzqh);
                    this.editForm.xzqh = xzqhArray;
                    //上级消防队站
                    var sjdzArray = [];
                    var temp = this.editForm.sjdzid;
                    for(var i in this.sjdzData){
                        if(temp == this.sjdzData[i].dzid){
                            sjdzArray.push(this.sjdzData[i].dzid);
                        }else{
                            for(var j in this.sjdzData[i].children){
                                if(temp == this.sjdzData[i].children[j].dzid){
                                    sjdzArray.push(this.sjdzData[i].dzid, this.sjdzData[i].children[j].dzid);
                                }else{
                                    for(var k in this.sjdzData[i].children[j].children){
                                        if(temp == this.sjdzData[i].children[j].children[k].dzid){
                                            sjdzArray.push(this.sjdzData[i].dzid, this.sjdzData[i].children[j].dzid, this.sjdzData[i].children[j].children[k].dzid);
                                        }else{
                                            for(var n in this.sjdzData[i].children[j].children[k].children){
                                                if(temp == this.sjdzData[i].children[j].children[k].children[n].dzid){
                                                    sjdzArray.push(this.sjdzData[i].dzid, this.sjdzData[i].children[j].dzid, this.sjdzData[i].children[j].children[k].dzid, this.sjdzData[i].children[j].children[k].children[n].dzid);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.editForm.sjdzid = sjdzArray;
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //保存前校验
        validateSave: function(){   
            if (this.editForm.dzmc == "" || this.editForm.dzmc == null) {
                this.$message.warning({
                    message: '请输入队站名称',
                    showClose: true
                });
                return false;
            }else if(this.editForm.dzlx == "" || this.editForm.dzlx == null){
                this.$message.warning({
                    message: '请选择队站类型',
                    showClose: true
                });
                return false;
            }else if(!this.validateNum(this.editForm.lon, "经度应为数值型")){
                return false;
            }else if(!this.validateNum(this.editForm.lat, "纬度应为数值型")){
                return false;
            }else if(!this.validateNum(this.editForm.gisX, "GIS_X应为数值型")){
                return false;
            }else if(!this.validateNum(this.editForm.gisY, "GIS_Y应为数值型")){
                return false;
            }else if(!this.validateNum(this.editForm.gxsys, "管辖水源数应为数值型")){
                return false;
            }else if(!this.validateNum(this.editForm.gxzddws, "管辖重点单位数应为数值型")){
                return false;
            }else if(!this.validateNum(this.editForm.xqmj, "执勤车辆数应为整数型")){
                return false;
            }else if(!this.validateNum(this.editForm.zbqcs, "装备器材数应为整数型")){
                return false;
            }else if(!this.validateNum(this.editForm.mhjzl, "灭火剂总量应为数值型")){
                return false;
            }
            return true;
        },
        //数值型校验
        validateNum: function(val, message){
            var regPos = /^\d+(\.\d+)?$/; //非负浮点数
            if(val!="" && val!=null){
                if(!regPos.test(val)){
                    this.$message.warning({
                        message: message,
                        showClose: true
                    });
                    return false;
                }              
            }
            return true;
        },
        //保存
        save: function (formName) {
            if(this.validateSave()){
                if (this.status == 0) {//新增
                    axios.get('/dpapi/xfdz/doCheckName/' + this.editForm.dzmc).then(function (res) {
                        if (res.data.result > 0) {
                            this.$message.warning({
                                message: '中文名已存在，请重新命名',
                                showClose: true
                            });
                        } else {
                            this.editForm.cjrid = this.shiroData.userid;
                            this.editForm.cjrmc = this.shiroData.realName;
                            this.editForm.dzlx = this.editForm.dzlx[this.editForm.dzlx.length-1];
                            this.editForm.xzqh = this.editForm.xzqh[this.editForm.xzqh.length-1];
                            this.editForm.sjdzid = this.editForm.sjdzid[this.editForm.sjdzid.length-1];
                            axios.post('/dpapi/xfdz/insertByXfdzVO', this.editForm).then(function (res) {
                                if (res.data.result != null) {
                                    this.$alert('成功保存队站信息', '提示', {
                                        type: 'success',
                                        confirmButtonText: '确定',
                                        callback: action => {
                                            loadDiv("basicinfo/firestation_list");
                                        }
                                    });
                                } else {
                                    this.$alert('保存失败', '提示', {
                                        type: 'error',
                                        confirmButtonText: '确定',
                                        callback: action => {
                                            loadDiv("basicinfo/firestation_list");
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
                    this.editForm.xgrid = this.shiroData.userid;
                    this.editForm.xgrmc = this.shiroData.realName;
                    this.editForm.dzlx = this.editForm.dzlx[this.editForm.dzlx.length-1];
                    this.editForm.xzqh = this.editForm.xzqh[this.editForm.xzqh.length-1];
                    this.editForm.sjdzid = this.editForm.sjdzid[this.editForm.sjdzid.length-1];
                    axios.post('/dpapi/xfdz/updateByXfdzVO', this.editForm).then(function (res) {
                        if (res.data.result != null) {
                            this.$alert('成功修改队站信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firestation_list");
                                }
                            });
                        } else {
                            this.$alert('修改失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("basicinfo/firestation_list");
                                }
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                }
            }
        },
        cancel: function () {
            loadDiv("basicinfo/firestation_list");
        },
        //建筑类型变化
        jzlxChange: function(){
            var type = this.editForm.jzlx;
            if(type == "10" || type == "20"){
                this.isJzl = true;
                this.isZzl = false;
                this.isCgl = false;
            }else if(type == "30"){
                this.isJzl = false;
                this.isZzl = true;
                this.isCgl = false;
            }else if(type == "40"){
                this.isJzl = false;
                this.isZzl = true;
                this.isCgl = false;
            }else{
                this.isJzl = false;
                this.isZzl = false;
                this.isCgl = false;
            }
        }
    },
    
})