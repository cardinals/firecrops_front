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
            //搜索表单
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
                //创建人、修改人
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: ""
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
            loadBreadcrumb("消防队站管理", "消防队站管理新增");
        } else if (type == "BJ") {
            loadBreadcrumb("消防队站管理", "消防队站管理编辑");
        }
        this.shiroData = shiroGlobal;
        this.status = getQueryString("ID");
        //队站类型下拉框
        this.getDzlxData();
        //上级队站下拉框
        this.getSjdzData();
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
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                axios.get('/dpapi/xfdz/' + this.status).then(function (res) {
                    this.editForm = res.data.result;
                    var result = res.data.result;
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
        //保存
        save: function (formName) {
            if (this.editForm.dzmc == "" || this.editForm == null) {
                this.$message.warning({
                    message: '请输入队站名称',
                    showClose: true
                });
            } else {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
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
                });
            }
        },
        cancel: function () {
            loadDiv("basicinfo/firestation_list");
        }
    },
    
})