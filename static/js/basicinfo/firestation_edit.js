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
            dzlxData: [],
            //上级队站
            sjdzData: [],
            //行政区划
            xzqhData: [],
            //角色
            shiroData: [],
            //队站属性
            isZongDui: false,
            isZhiDui: false,
            isDaDui: false,
            isZhongDui: false,
            isQiTaXiaoFangDuiWu: false,
            //是否独立接警
            sfdljjData: [{
                codeValue: '1',
                codeName: '是'
            }, {
                codeValue: '0',
                codeName: '否'
            }],
            //编辑表单
            editForm: {
                dzmc: "",
                dzjc: "",
                dzbm: "",
                dzlx: "",
                sjdzid: "",
                dzdz: "",
                xzqh: "",
                lon: "",
                lat: "",
                gisX: "",
                gisY: "",
                gxsys: "",
                gxzddws: "",
                xqfw: "",
                xqmj: "",
                lxr: "",
                lxdh: "",
                czhm: "",
                zqcls: "",
                zbqcs: "",
                mhjzl: "",
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
            //上级队站Disabled
            dzlxDisabled: false,
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
            loadBreadcrumb("消防队站管理", "消防队站管理新增");
        } else if (type == "BJ") {
            loadBreadcrumb("消防队站管理", "消防队站管理编辑");
        }
        this.shiroData = shiroGlobal;
        this.status = getQueryString("ID");
        //方法加载完成之前，页面转圈
        this.loading = true;
        //上级队站下拉框
        this.getSjdzData();
        //队站类型下拉框
        this.getDzlxData();
        //行政区划下拉框
        this.getXzqhData();
    },
    methods: {
        handleNodeClick(data) {
        },
        //队站类型下拉框
        getDzlxData: function(){
            axios.get('/api/codelist/getDzlxTree/DZLX').then(function(res){
                this.dzlxData = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        //上级机构下拉框
        getSjdzData: function(){
            if(this.status == 0){
                this.dzlxDisabled = false;
            }else{
                this.dzlxDisabled = true;
            }
            var organization = this.shiroData.organizationVO;
            var params = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            };
            axios.post('/dpapi/xfdz/findSjdzByUser', params).then(function(res){
                this.sjdzData = res.data.result;
                this.searchClick();
            }.bind(this),function(error){
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
        
        //表格查询事件
        searchClick: function () {
            this.loading = true;
            if(this.status == 0){  //新增
                this.loading = false;
            }else{//修改
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
                            default:
                                this.editForm.zongdVO = {};
                                this.editForm.zhidVO = {};
                                this.editForm.dadVO = {};
                                this.editForm.zhongdVO = {};
                                this.editForm.qtxfdwVO = {};
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
                    if(result.xzqh!=null && result.xzqh!=""){
                        if(result.xzqh.substr(2,4)!="0000"){
                            xzqhArray.push(result.xzqh.substr(0,2) + "0000");
                            if(result.xzqh.substr(4,2)!="00"){
                                xzqhArray.push(result.xzqh.substr(0,4) + "00");
                            }
                        }
                        xzqhArray.push(this.editForm.xzqh); 
                    }
                    this.editForm.xzqh = xzqhArray;

                    //上级消防队站
                    var sjdzArray = [];
                    var temp = result.sjdzid;
                    if(temp!=null && temp!=""){
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
            if (this.editForm.dzmc=="" || this.editForm.dzmc==null) {
                this.$message.warning({
                    message: '请输入队站名称',
                    showClose: true
                });
                return false;
            }else if(this.editForm.dzlx=="" || this.editForm.dzlx==null){
                this.$message.warning({
                    message: '请选择队站类型',
                    showClose: true
                });
                return false;
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
                    if(this.editForm.xzqh.length>0){
                        this.editForm.xzqh = this.editForm.xzqh[this.editForm.xzqh.length-1];
                    }else{
                        this.editForm.xzqh = null;
                    }
                    if(this.editForm.sjdzid.length>0){
                        this.editForm.sjdzid = this.editForm.sjdzid[this.editForm.sjdzid.length-1];
                    }else{
                        this.editForm.sjdzid = null;
                    }
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
        //队站类型变化
        dzlxChange: function(){
            var type = this.editForm.dzlx;
            if(type == null || type ==""){
                this.isZongDui = false;
                this.isZhiDui = false;
                this.isDaDui = false;
                this.isZhongDui = false;
                this.isQiTaXiaoFangDuiWu = false;
            }else{
                if(type == "0200"){
                    this.isZongDui = true;
                    this.isZhiDui = false;
                    this.isDaDui = false;
                    this.isZhongDui = false;
                    this.isQiTaXiaoFangDuiWu = false;
                }else if(type == "0300"){
                    this.isZongDui = false;
                    this.isZhiDui = true;
                    this.isDaDui = false;
                    this.isZhongDui = false;
                    this.isQiTaXiaoFangDuiWu = false;
                }else if(type == "0500"){
                    this.isZongDui = false;
                    this.isZhiDui = false;
                    this.isDaDui = true;
                    this.isZhongDui = false;
                    this.isQiTaXiaoFangDuiWu = false;
                }else if(type == "0900"){
                    this.isZongDui = false;
                    this.isZhiDui = false;
                    this.isDaDui = false;
                    this.isZhongDui = true;
                    this.isQiTaXiaoFangDuiWu = false;
                }else{
                    this.isZongDui = false;
                    this.isZhiDui = false;
                    this.isDaDui = false;
                    this.isZhongDui = false;
                    this.isQiTaXiaoFangDuiWu = true;
                }
            } 
        }
    },
    
})