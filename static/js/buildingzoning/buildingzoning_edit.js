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
                //单位建筑新增
                jzmc: "",
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
                jzlx:"",
                //建筑类VO
                jzlVO: {
                    jzid: "",
                    jzqk: "",
                    jzsyxz:"",
                    jzjg:"",
                    gnms:"",
                    zdmj:"",
                    jzmj:"",
                    dsgd:"",
                    dxgd:"",
                    dscs:"",
                },
                //装置类VO
                zzlVO:{
                    jzid: "",
                    jzjg: "",
                    zdmj: "",
                    zzgd: "",
                    jsfzr: "",
                    jsfzrdh: "",
                    zzzc: "",
                    ylxx: "",
                    cwxx: "",
                    gylc:""
                },
                //储罐类VO
                cglVO:{
                    jzid: "",
                    zrj: "",
                    cgsl: "",
                    cgjg: "",
                    ccjzms: "",
                    jsfzr: "",
                    jsfzrdh: "",
                    plqkd: "",
                    plqkx: "",
                    plqkn:"",
                    plqkb:""
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
        this.status = getQueryString("ID");
        /**面包屑 by zjc 20180801*/
        var type = getQueryString("type");
        if (type == "XZ") {
            loadBreadcrumb("单位建筑信息", "单位建筑信息新增");
        } else if (type == "BJ") {
            loadBreadcrumb("单位建筑信息", "单位建筑信息编辑");
        }
        this.searchClick('click');
        this.shiroData = shiroGlobal;
        
        //建筑类型下拉框
        this.getJzlxData();
    },
    methods: {
        // handleNodeClick(data) {
        // },
        //建筑类型下拉框
        getJzlxData: function(){
            axios.get('/api/codelist/getCodetype/JZLX').then(function(res){
                this.jzlxData = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },    
        
        //初始化查询事件
        searchClick: function (type) { 
            this.loading = true;
            debugger
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                // var jzlx = getQueryString("jzlx");
                var params = {
                    jzid : this.status,
                    jzlx: getQueryString("jzlx")
                    // jzlx : dzlxParam
                };
                axios.post('/dpapi/building/findFqDetailByVo', params).then(function (res) {
                    debugger;

                    // var result = res.data.result;
                    this.editForm = res.data.result;
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //保存前校验
        validateSave: function(){   
            if (this.editForm.jzmc == "" || this.editForm.jzmc == null) {
                this.$message.warning({
                    message: '请输入建筑名称',
                    showClose: true
                });
                return false;
            }else if(this.editForm.jzlx == "" || this.editForm.jzlx == null){
                this.$message.warning({
                    message: '请选择建筑类型',
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
                        // if (res.data.result > 0) {
                        //     this.$message.warning({
                        //         message: '中文名已存在，请重新命名',
                        //         showClose: true
                        //     });
                        // } else {
                            this.editForm.cjrid = this.shiroData.userid;
                            this.editForm.cjrmc = this.shiroData.realName;
                            this.editForm.jzlx = this.editForm.jzlx;
                            // this.editForm.jzlx = this.editForm.jzlx[this.editForm.jzlx.length-1];//建筑类型
                            // this.editForm.xzqh = this.editForm.xzqh[this.editForm.xzqh.length-1];                            
                            // this.editForm.sjdzid = this.editForm.sjdzid[this.editForm.sjdzid.length-1];   
                      debugger;
                            axios.post('/dpapi/building/insertByVO', this.editForm).then(function (res) {
                                if (res.data.result != null) {
                                    this.$alert('成功保存单位建筑信息', '提示', {
                                        type: 'success',
                                        confirmButtonText: '确定',
                                        callback: action => {
                                            loadDiv("buildingzoning/buildingzoning_list");
                                        }
                                    });
                                } else {
                                    this.$alert('保存失败', '提示', {
                                        type: 'error',
                                        confirmButtonText: '确定',
                                        callback: action => {
                                            loadDiv("buildingzoning/buildingzoning_list");
                                        }
                                    });
                                }
                            }.bind(this), function (error) {
                                console.log(error);
                            })
                        // }
                } else {//修改
                    this.editForm.xgrid = this.shiroData.userid;
                    this.editForm.xgrmc = this.shiroData.realName;
                    this.editForm.jzlx = this.editForm.jzlx;
                    // this.editForm.xzqh = this.editForm.xzqh[this.editForm.xzqh.length-1];
                    // this.editForm.sjdzid = this.editForm.sjdzid[this.editForm.sjdzid.length-1];
                  debugger;
                    axios.post('/dpapi/building/doUpdateBuildingzoning', this.editForm).then(function (res) {
                        if (res.data.result != null) {
                            this.$alert('成功修改单位建筑信息', '提示', {
                                type: 'success',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("buildingzoning/buildingzoning_list");
                                }
                            });
                        } else {
                            this.$alert('修改失败', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                                callback: action => {
                                    loadDiv("buildingzoning/buildingzoning_list");
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
            loadDiv("buildingzoning/buildingzoning_list");
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
                this.isZzl = false;
                this.isCgl = true;
            }else{
                this.isJzl = false;
                this.isZzl = false;
                this.isCgl = false;
            }
        }
    },
    
})