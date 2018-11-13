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
                    jdh: "",
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
                    jdh: "",
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
                    jdh: "",
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
                    fzdzlxfs3: "",
                    jdh: "",
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
                    jdh: "",
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
            editFormRules: {
                dzmc: [
                    { required: true, message: '请输入队站名称', trigger: 'blur' },
                ],
                dzjc: [
                    { required: true, message: '请输入队站简称', trigger: 'blur' },
                ],
                dzlx: [
                    { validator: (rule,value,callback)=>{
                        if(value.length == 0){
                            callback(new Error("请选择队站类型"));
                        }else{
                            callback();
                        }
               
                    }, trigger: 'change' }
                ],
                sjdzid: [
                    { validator: (rule,value,callback)=>{
                        if(value.length == 0){
                            callback(new Error("请选择上级队站"));
                        }else{
                            callback();
                        }
               
                    }, trigger: 'change' }
                ],
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
                axios.get('/dpapi/xfdz/doFindDzlxByOrgId/' + this.shiroData.organizationVO.uuid).then(function (res1) {
                    var dzlx = res1.data.result;
                    if(dzlx == '0100'){
                        this.dzlxData = res.data.result.slice(1);
                    }else{
                        switch(dzlx){
                            case '0100':
                                this.dzlxData.push(res.data.result[0]); 
                            case '0200':
                                this.dzlxData.push(res.data.result[1]); 
                            case '0300':
                                this.dzlxData.push(res.data.result[2]);
                            case '0500':
                                this.dzlxData.push(res.data.result[3]);
                            default:
                                this.dzlxData.push(res.data.result[4]);
                        }
                    }
                }.bind(this), function (error) {
                    console.log(error);
                })
                // this.dzlxData = res.data.result;
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
            axios.post('/dpapi/xfdz/findSjdzByUserAll', params).then(function(res){
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
                    message: '请输入队站名称!',
                    showClose: true
                });
                return false;
            }else if(this.editForm.dzjc=="" || this.editForm.dzjc==null){
                this.$message.warning({
                    message: '请选择队站简称!',
                    showClose: true
                });
                return false;
            }else if(this.editForm.dzlx=="" || this.editForm.dzlx==null){
                this.$message.warning({
                    message: '请选择队站类型!',
                    showClose: true
                });
                return false;
            }else if(this.editForm.sjdzid=="" || this.editForm.sjdzid==null){
                this.$message.warning({
                    message: '请选择上级队站!',
                    showClose: true
                });
                return false;
            }
            return true;
        },
        
        //保存
        save: function (formName) {
            // this.$refs[formName].validate((valid) => {
            //     if (valid) {
            //       alert('submit!');
            //     } else {
            //       console.log('error submit!!');
            //       return false;
            //     }
            // });
            if(this.validateSave()){
                var datasource = this.shiroData.organizationVO.jgid;
                var jdh = this.shiroData.organizationVO.jgid.substr(0,2) + "000000";
                var params = {
                    dzmc: this.editForm.dzmc,
                    dzjc: this.editForm.dzjc,
                    dzbm: this.editForm.dzbm,
                    dzlx: this.editForm.dzlx[this.editForm.dzlx.length-1],
                    sjdzid: this.editForm.sjdzid[this.editForm.sjdzid.length-1],
                    dzdz: this.editForm.dzdz,
                    xzqh: this.editForm.xzqh[this.editForm.xzqh.length-1],
                    lon: this.editForm.lon,
                    lat: this.editForm.lat,
                    gisX: this.editForm.gisX,
                    gisY: this.editForm.gisY,
                    gxsys: this.editForm.gxsys,
                    gxzddws: this.editForm.gxzddws,
                    xqfw: this.editForm.xqfw,
                    xqmj: this.editForm.xqmj,
                    lxr: this.editForm.lxr,
                    lxdh: this.editForm.lxdh,
                    czhm: this.editForm.czhm,
                    zqcls: this.editForm.zqcls,
                    zbqcs: this.editForm.zbqcs,
                    mhjzl: this.editForm.mhjzl,
                    bz: this.editForm.bz,
                    cjrid: "",
                    cjrmc: "",
                    xgrid: "",
                    xgrmc: "",
                    zongdVO: this.editForm.zongdVO,
                    zhidVO: this.editForm.zhidVO,
                    dadVO: this.editForm.dadVO,
                    zhongdVO: this.editForm.zhongdVO,
                    qtxfdwVO: this.editForm.qtxfdwVO,
                    jdh: jdh,
                    datasource: datasource
                };
                //从表JDH
                if(params.dzlx!=null && params.dzlx!=""){
                    switch(params.dzlx.substr(0,2)){
                        case "02":
                            params.zongdVO.jdh = jdh;
                            params.zongdVO.datasource = datasource;
                            break;
                        case "03":
                            params.zhidVO.jdh = jdh;
                            params.zhidVO.datasource = datasource;
                            break;
                        case "05":
                            params.DadVO.jdh = jdh;
                            params.DadVO.datasource = datasource;
                            break;
                        case "09":
                            params.zhongdVO.jdh = jdh;
                            params.zhongdVO.datasource = datasource;
                            break;
                        case "0A":
                            params.qtxfdwVO.jdh = jdh;
                            params.qtxfdwVO.datasource = datasource;
                            break;
                    }
                }
                if (this.status == 0) {//新增
                    axios.get('/dpapi/xfdz/doCheckName/' + this.editForm.dzmc).then(function (res) {
                        if (res.data.result > 0) {
                            this.$message.warning({
                                message: '中文名已存在，请重新命名',
                                showClose: true
                            });
                        } else {
                            params.cjrid = this.shiroData.userid;
                            params.cjrmc = this.shiroData.realName;
                            
                            axios.post('/dpapi/xfdz/insertByXfdzVO', params).then(function (res) {
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
                    params.xgrid = this.shiroData.userid;
                    params.xgrmc = this.shiroData.realName;
                    params.dzid = this.editForm.dzid;
                    
                    axios.post('/dpapi/xfdz/updateByXfdzVO', params).then(function (res) {
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