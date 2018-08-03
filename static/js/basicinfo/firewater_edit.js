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
            //天然水源类型
            trsylxData: [],
            //天然水源有无枯水期
            ywksqData: [],
            //水质
            szData: [],
            //水源归属
            sygsData: [],
            //有无取水点
            ywqsdData: [{
                codeValue: '1',
                codeName: '有'
            }, {
                codeValue: '0',
                codeName: '无'
            }],
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
                gxdz:"",
                xzqh: "",
                sygs: "",
                lon: "",
                lat: "",
                gisX: "",
                gisY: "",
                gisH: "",
                ssdw:"",
                gsdw:"",
                gsdwlxfs:"",
                bz: "",
                //创建人、修改人
                cjrid: "",
                cjrmc: "",
                xgrid: "",
                xgrmc: "",
                //消火栓VO
                xhs_szxs:"",
                xhs_gwylfw:"",
                xhs_gwxs:"",
                xhs_gwzj:"",
                xhs_gwyllx:"",
                xhs_jkxs:"",
                xhs_jkkj:"",
                xhs_zdll:"",
                //消防水鹤VO
                xfsh_gwzj: "",
                xfsh_gwyl: "",
                xfsh_cskgd: "",
                xfsh_zdll: "",
                //消防水池VO
                xfsc_sybgc: "",
                xfsc_csl: "",
                xfsc_jsll: "",
                xfsc_qszdll: "",
                xfsc_gwxs: "",
                xfsc_tcwz: "",
                xfsc_tsqscls: "",
                xfsc_bssj: "",
                //天然水源取水点VO
                trsyqsd_trsylx: "",
                trsyqsd_ywksq: "",
                trsyqsd_ksqsj: "",
                trsyqsd_sz:"",
                trsyqsd_szms:"",
                trsyqsd_ywqsd:"",
                trsyqsd_sybgc: "",
                trsyqsd_ycwz: "",
                trsyqsd_tsqscls: "",
                trsyqsd_qsxs: "",
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
    },
    methods: {
        handleNodeClick(data) {
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
        //可用状态下拉框
        getKyztData: function(){
            axios.get('/api/codelist/getCodetype/SYKYZT').then(function(res){
                this.kyztData = res.data.result;
            }.bind(this),function(error){
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
        getSzxsData:function () {
            axios.get('/api/codelist/getCodetype/XHSSZXS').then(function (res) {
                this.szxsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //管网形式
        getGwxsData:function () {
            axios.get('/api/codelist/getCodetype/GWXS').then(function (res) {
                this.gwxsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //管网压力类型
        getGwyllxData:function (){
            axios.get('/api/codelist/getCodetype/GWYLLX').then(function (res) {
                this.gwyllxData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //接口形式
        getJkxsData:function () {
            axios.get('/api/codelist/getCodetype/XHSJKXS').then(function (res) {
                this.jkxsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //水质
        getSzData:function () {
            axios.get('/api/codelist/getCodetype/SYSZ').then(function (res) {
                this.szData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //枯水期
        getTrsyYWKSQ_data:function () {
            axios.get('/api/codelist/getCodetype/SYYWKSQ').then(function (res) {
                this.ywksqData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //天然水源类型trsylxData
        getTrsylxData:function () {
            axios.get('/api/codelist/getCodetype/TRSYLX').then(function (res) {
                this.trsylxData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //水源归属
        getSygsData:function(){
            axios.get('/api/codelist/getCodetype/SYGS').then(function (res) {
                this.sygsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //表格查询事件
        searchClick: function () {
            this.loading = true;
            if (this.status == 0) {  //新增
                this.loading = false;
            } else {//修改
                var sylxParam = getQueryString("sylx");
                var params = {
                    uuid : this.status,
                    sylx : sylxParam
                };
                axios.post('/dpapi/xfsy/findSyAndSxByVo',params).then(function (res) {
                    var result = res.data.result;
                    this.editForm = res.data.result;
                    if(sylxParam!=null && sylxParam!=""){
                        switch(sylxParam){
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
                    var temp = this.editForm.gxdz;
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
                    this.editForm.gxdz = sjdzArray;
                    this.loading = false;
                }.bind(this), function (error) {
                    console.log(error);
                })
            }
        },
        //保存前校验
        validateSave: function(){
            if (this.editForm.symc == "" || this.editForm.symc == null) {
                this.$message.warning({
                    message: '请输入水源名称',
                    showClose: true
                });
                return false;
            }else if(this.editForm.sylx == "" || this.editForm.sylx == null){
                this.$message.warning({
                    message: '请选择水源类型',
                    showClose: true
                });
                return false;
            }
            return true;
        },
        /*
        //数值型校验
        validateNum: function(val, message, type){
            //type=num:非负数，figure：数值，int：整数
            var regPos = /^\d+(\.\d+)?$/;  
            if(type == "num"){
            }else if(type == "int"){
                regPos = /^\d+$/;
            }else if(type == "figure"){
                regPos = /^(-)\d+(\.\d+)?$/;  
            }
            
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
        //非负数校验
        validateInt: function(val){
            //var regPos = /^\d+$/; //非负整数
            var regPos = /^\d+(\.\d+)?$/;
            if(val!="" && val!=null){
                if(!regPos.test(val)){
                    this.$message.warning({
                        message: "请输入非负数",
                        showClose: true
                    });
                }              
            }
        },
        */
        //保存
        save: function (formName) {
            if(this.validateSave()){
                if (this.status == 0) {//新增
                    this.editForm.cjrid = this.shiroData.userid;
                    this.editForm.cjrmc = this.shiroData.realName;
                    this.editForm.gxdz = this.editForm.gxdz[this.editForm.gxdz.length-1];
                    this.editForm.xzqh = this.editForm.xzqh[this.editForm.xzqh.length-1];
                    axios.post('/dpapi/xfsy/insertByXfsyVO', this.editForm).then(function (res) {
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
                    this.editForm.xgrid = this.shiroData.userid;
                    this.editForm.xgrmc = this.shiroData.realName;
                    this.editForm.gxdz = this.editForm.gxdz[this.editForm.gxdz.length-1];
                    this.editForm.xzqh = this.editForm.xzqh[this.editForm.xzqh.length-1];
                    axios.post('/dpapi/xfsy/updateByXfsyVO', this.editForm).then(function (res) {
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
            }
        },
        cancel: function () {
            loadDiv("basicinfo/firewater_list");
        },
        //水源类型变化
        sylxChange: function(){
            var type = this.editForm.sylx;
            if(type == "01"){
                this.isXHS = true;
                this.isXFSH = false;
                this.isXFSC = false;
                this.isTRSYQSD = false;
                //设置形式下拉框
                if(this.szxsData.length == 0)
                    this.getSzxsData();
                //管网形式下拉框
                if(this.gwxsData.length == 0)
                    this.getGwxsData();
                //管网压力类型下拉框
                if(this.gwyllxData.length == 0)
                    this.getGwyllxData();
                //接口形式下拉框
                if(this.jkxsData.length == 0)
                    this.getJkxsData();
            }else if(type == "02"){
                this.isXHS = false;
                this.isXFSH = true;
                this.isXFSC = false;
                this.isTRSYQSD = false;
            }else if(type == "03"){
                this.isXHS = false;
                this.isXFSH = false;
                this.isXFSC = true;
                this.isTRSYQSD = false;
                //管网形式下拉框
                if(this.gwxsData.length == 0)
                    this.getGwxsData();
            }else if(type == "04"){
                this.isXHS = false;
                this.isXFSH = false;
                this.isXFSC = false;
                this.isTRSYQSD = true;
                if(this.trsylxData.length == 0)
                    this.getTrsylxData();
                if(this.ywksqData.length == 0)
                    this.getTrsyYWKSQ_data();
                if(this.szData.length == 0)
                    this.getSzData();
            }else{
                this.isXHS = false;
                this.isXFSH = false;
                this.isXFSC = false;
                this.isTRSYQSD = false;
            }
        },
    },
    
})