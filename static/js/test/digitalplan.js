//axios默认设置cookie
axios.defaults.withCredentials = true;	
new Vue({
    el: '#app',
    data: function() {
      return {
      //搜索表单
      searchForm: {
        DWMC:"",
        DWDJ:"",
        DWXZ:"",
        XZQY:""
      },
      //表数据
      tableData: [],//Grid中数据
      /*
      tableData: [
        {
            DWMC:"辽宁省人民法院",
            XZQY: "辽宁省",
            DWDZ:"霞飞路29号",
            XFGXJGNAME: "沈阳市消防局",
            CJSJ:"2012-02-23",
            DWDJ: "省部级",
            DWXZ:"司法",
            ID:"1"
        },
           {
            DWMC:"辽宁省政府",
            DWDJ: "省部级",
            DWXZ:"行政",
            XZQY: "辽宁省",
            DWDZ:"霞飞路30号",
            ZDMJ: 50000,
            XFGXJGID: "沈阳市消防局",
            ID:"2"
        },
        {
            DWMC:"辽宁省就业局",
            DWDJ: "省部级",
            DWXZ:"民事",
            XZQY: "辽宁省",
            DWDZ:"霞飞路31号",
            ZDMJ: 20000,
            XFGXJGID: "沈阳市消防局",
            ID:"3"
        },
        {
            DWMC:"沈阳市城市规划管理局",
            DWDJ: "市厅级",
            DWXZ:"城市管理",
            XZQY: "辽宁省",
            DWDZ:"霞飞路32号",
            ZDMJ: 10000,
            XFGXJGID: "沈阳市消防和平分队",
            ID:"4"
        },
        {
            DWMC:"沈阳市公安局",
            DWDJ: "市厅级",
            DWXZ:"司法",
            XZQY: "辽宁省",
            DWDZ:"霞飞路33号",
            ZDMJ: 12000,
            XFGXJGID: "沈阳市消防沈河分队",
            ID:"5"
        },
        {
            DWMC:"沈阳市地铁二号线",
            DWDJ: "市厅级",
            DWXZ:"民事",
            XZQY: "辽宁省",
            DWDZ:"霞飞路34号",
            ZDMJ: 1000,
            XFGXJGID: "沈阳市消防浑南分队",
            ID:"6"
        },
        {
            DWMC:"青岛市塑性加工园",
            DWDJ: "市厅级",
            DWXZ:"城市管理",
            XZQY: "山东省",
            DWDZ:"文明路39号",
            ZDMJ: 2000,
            XFGXJGID: "青岛市市消防大东分队",
            ID:"7"
        },
        {
            DWMC:"泰安市城建局",
            DWDJ: "市厅级",
            DWXZ:"城市管理",
            XZQY: "山东省",
            DWDZ:"法防路36号",
            ZDMJ: 2000,
            XFGXJGID: "泰安市消防塔湾分队",
            ID:"8"
        },
        {
            DWMC:"河北省国土资源厅",
            DWDJ: "省部级",
            DWXZ:"城市管理",
            XZQY: "河北省",
            DWDZ:"格调路46号",
            ZDMJ: 3000,
            XFGXJGID: "河北省消防总队",
            ID:"9"
        },
        {
            DWMC:"秦皇岛市林业局",
            DWDJ: "市厅级",
            DWXZ:"城市管理",
            XZQY: "河北省",
            DWDZ:"发文路64号",
            ZDMJ: 4000,
            XFGXJGID: "秦皇岛市消防大队",
            ID:"10"
        }
     ],*/

       //表高度变量
       tableheight :450,
       //显示加载中样
       loading: false,
       labelPosition: 'right',
        //多选值
        multipleSelection: [],
        //当前页
        currentPage: 1,
        //分页大小
        pageSize: 10,
        //总记录数
        total:0, 
        //序号
        indexData:0,
        //删除的弹出框
        deleteVisible: false,
        //新建页面是否显示
        addFormVisible:false,
        addLoading:false,
        addFormRules:{
            
        },
        //新建数据
        addForm:{
            DWMC:"",
            DWDJ: "",
            DWXZ:"",
            XZQY: "",
            DWDZ:"",
            ZDMJ: "",
            XFGXJGID: ""
        },
        //选中的值显示
        sels: [], 
        //选中的序号
        selectIndex: -1, 
        //编辑界面是否显示
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
            
        },
        //编辑界面数据
        editForm: {
            DWMC:"",
            DWDJ: "",
            DWXZ:"",
            XZQY: "",
            DWDZ:"",
            ZDMJ: "",
            XFGXJGID: ""
        },
       
       }
    },
    mounted:function(){

        this.total = this.tableData.length;
    } ,
    methods:{
    handleNodeClick(data) {
        console.log(data);
    },
    //表格查询事件
    searchClick: function() {
    var _self = this;
    /*var tableObject ={};
    var searchData=[];
    var resultData=[];
    for(var i = 0;i<_self.tableData.length;i++){
        if((!(_self.searchForm.DWMC==""&&_self.searchForm.DWDJ==""&&_self.searchForm.DWXZ==""&&_self.searchForm.XZQY==""))&&(_self.searchForm.DWMC!=""?(_self.tableData[i].DWMC == _self.searchForm.DWMC):true)&&(_self.searchForm.DWDJ!=""?(_self.tableData[i].DWDJ == _self.searchForm.DWDJ):true)
        &&(_self.searchForm.DWXZ!=""?(_self.tableData[i].DWXZ == _self.searchForm.DWXZ):true)&&(_self.searchForm.XZQY!=""?(_self.tableData[i].XZQY == _self.searchForm.XZQY):true))
        {	
            var row=_self.tableData[i];
            resultData.push(row);
            
        }
        
    }
    _self.tableData.splice(0,_self.tableData.length);
    if(resultData.length>=1){
        _self.tableData=resultData;
    }
    else{
        _self.tableData.splice(0,_self.tableData.length);
        _self.tableData = searchData;
        }
    _self.total = _self.tableData.length;
    _self.loadingData(); //重新加载数据*/
    var params = {
        DWMC: this.searchForm.DWMC,
        DWDJ: this.searchForm.DWDJ,
        DWXZ: this.searchForm.DWXZ,
        XZQY: this.searchForm.XZQY,
        pageSize: this.pageSize,
        pageNum: this.currentPage
    }
    axios.post('/key-unit/findByVO', params).then(function(res){
        this.tableData = res.data.result;
        this.total = res.data.result.length;
    }.bind(this),function(error){
        console.log(error)
    })
    },
    //表格勾选事件
    selectionChange: function(val) {
     this.multipleSelection = val;
    //this.sels = sels
    console.info(val);
    },
    //详情跳转
    informClick(val){
        window.location.href="inform.html?ID="+val.ID;
    },
    //表格重新加载数据
    loadingData: function() {
    var _self = this;
    _self.loading = true;
    setTimeout(function() {
        console.info("加载数据成功");
        _self.loading = false;
    }, 300);
    },

    //新建事件
    addClick: function() {
    var _self = this;
    _self.addFormVisible = true;
    
    },
     //新建提交点击事件
     addSubmit: function(val) {
        var _self=this;
        var params = {
            DWMC: val.DWMC,
            DWDJ: val.DWDJ,
            DWXZ: val.DWXZ,
            XZQY: val.XZQY,
            DWDZ: val.DWDZ,
            ZDMJ: val.ZDMJ,
            XFGXJGID: val.XFGXJGID,
        }
        axios.post('/key-unit/insertByVO', params).then(function(res){
            var addData = res.data.result;
            _self.tableData.unshift(addData);
            _self.total = _self.tableData.length;
        }.bind(this),function(error){
            console.log(error)
        })
        this.addFormVisible = false;
        _self.loadingData();//重新加载数据
        
    },
     //表格编辑事件
     editClick: function() {
        var _self = this;
        var multipleSelection = this.multipleSelection;
        if (multipleSelection.length < 1) {
            _self.$message({
            message: "请至少选中一条记录",
            type: "error"
            });
            return;
        }
        else if(multipleSelection.length>1){
            _self.$message({
                message:"只能选一条记录进行编辑",
                type:"error"
            });
            return;
        }
        var ID = multipleSelection[0].ID;   
        for(var k=0;k< _self.tableData.length;k++)
        {
            if(_self.tableData[k].ID == ids[d]){
                _self.selectIndex = k;
            }
        }
        this.editForm = Object.assign({}, _self.tableData[_self.selectIndex]);
        this.editFormVisible = true;
        },
        //保存点击事件
        editSubmit: function(val) {
        var _self = this;
        var params = {
            DWMC: val.DWMC,
            DWDJ: val.DWDJ,
            DWXZ: val.DWXZ,
            XZQY: val.XZQY,
            DWDZ: val.DWDZ,
            ZDMJ: val.ZDMJ,
            XFGXJGID: val.XFGXJGID,
        };
        axios.post('/key-unit/updateByVO', params).then(function(res){
            this.tableData[this.selectIndex].DWMC = val.DWMC;
            this.tableData[this.selectIndex].DWDJ = val.DWDJ;
            this.tableData[this.selectIndex].DWXZ = val.DWXZ;
            this.tableData[this.selectIndex].XZQY = val.XZQY;
            this.tableData[this.selectIndex].DWDZ = val.DWDZ;
            this.tableData[this.selectIndex].ZDMJ = val.ZDMJ;
            this.tableData[this.selectIndex].XFGXJGID = val.XFGXJGID;
        }.bind(this),function(error){
            console.log(error)
        })
        this.editFormVisible = false;
        _self.loadingData();
        },
    //删除所选，批量删除
    removeSelection: function() {
        var _self = this;
        var multipleSelection = this.multipleSelection;
        if (multipleSelection.length < 1) {
            _self.$message({
            message: "请至少选中一条记录",
            type: "error"
            });
            return;
        }
        //var ids = "";
        var ids = [];
        var deletename=[];
        for (var i = 0; i < multipleSelection.length; i++) {
            var row = multipleSelection[i];
            //ids += row.realname + ",";
            //删除POST请求时传入ids里的permissionid作为删除唯一标识
            ids.push(row.ID);
            deletename.push(row.DWMC);
        }
        this.$confirm("确认删除" + deletename + "吗?", "提示", {
            type: "warning"
        })
            .then(function() {
    
                var params = {
                    ids: ids
                }
                axios.post('/key-unit/deleteByIds', params).then(function(res){
                    for(var d =0;d< ids.length;d++){
                        for(var k=0;k< _self.tableData.length;k++) {
                            if(_self.tableData[k].ID == ids[d]){
                                _self.tableData.splice(k,1);
                            }
                        }
                    }
                    _self.$message({
                        message: "删除成功",
                        type: "success"
                    });
                    _self.total = _self.tableData.length;
                    _self.loadingData(); //重新加载数据
                }.bind(this),function(error){
                    console.log(error)
                })
        
            })
            .catch(function(e) {
                if (e != "cancel") console.log("出现错误：" + e);
            });
    },
    //分页大小修改事件
    pageSizeChange: function(val) {
        this.pageSize = val;
        var _self = this;
        _self.loadingData(); //重新加载数据
    },
    //当前页修改事件
    currentPageChange: function(val) {
        this.currentPage = val;
        var _self = this;
        _self.loadingData(); //重新加载数据
    },
    closeDialog:function(val){
        this.addFormVisible = false;
        val.DWMC = "";
        val.DWDJ = "";
        val.DWXZ = "";
        val.XZQY ="";
        val.DWDZ = "";
        val.ZDMJ ="";
        val.XFGXJGID ="";
    }
},
    
})