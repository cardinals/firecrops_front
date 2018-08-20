//axios默认设置cookie
axios.defaults.withCredentials = true;	
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            //菜单编码
            activeIndex: '',
            //搜索表单
            searchForm: {
                jzmc: "",
                option_JZLX:"",
                jzwz:""
            },
            tableData: [],
            JZFL_data:[],
            shiroData: [],//当前用户信息
            //表高度变量
            tableheight: 443,
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
            total: 10,
            //行数据保存
            rowdata: {},
            //序号
            indexData: 0,
            //选中的值显示
            sels: [],
            //选中的序号
            selectIndex: -1,


        }
    },
    created:function(){
        /**菜单选中 by li.xue 20180628*/
        /**
        var index = getQueryString("index");
        $("#activeIndex").val(index);
        this.activeIndex = index;
         */
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("单位建筑信息", "-1");
        this.shiroData = shiroGlobal;
        this.getJZFLData();
        this.searchClick('click');
    },
    methods: {
        handleNodeClick(data) {
        },
        //表格查询事件
        searchClick: function (type) {
            if(type == 'page'){
                this.tableData = [];
            }else{
                this.currentPage = 1;
            }
            var _self = this;
            _self.loading = true;//表格重新加载
            this.searchForm.jzid = this.GetQueryString("jzid");//获取队站ID
            var params={
                jzid:this.searchForm.jzid,
                jzmc:this.searchForm.jzmc,
                jzlx:this.searchForm.option_JZLX,
                jzwz:this.searchForm.jzwz,
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/building/page',params).then(function(res){
               var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                _self.loading = false;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        clearClick: function () {
            this.searchForm.jzmc="";
            this.searchForm.option_JZLX="";
            this.searchForm.jzwz="";
            this.searchClick('reset');
        },
        getJZFLData: function (){
            axios.get('/api/codelist/getCodetype/JZLX').then(function(res){
                this.JZFL_data=res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },
      
        detailClick(val) {
            var params = {
                id: val.jzid,
                jzlx: val.jzlx
            }
            loadDivParam("buildingzoning/buildingzoning_detail", params);
            //window.location.href = "building_zoning_detail.html?id=" + val.jzid +"&jzlx=" +val.jzlx + "&index=" + this.activeIndex;
        },
        //根据参数部分和参数名来获取参数值 
        GetQueryString(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
        //新增
        addClick: function(){
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("buildingzoning/buildingzoning_edit", params);
        },
        editClick: function(val){
            var params = {
                ID: val.jzid,
                jzlx: val.jzlx,
                type: "BJ"
            }
            loadDivParam("buildingzoning/buildingzoning_edit", params);
        },
        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        //删除
        deleteClick: function(){
            this.$confirm('确认删除选中信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for(var i=0;i<this.multipleSelection.length;i++){
                    this.multipleSelection[i].xgrid = this.shiroData.userid;
                    this.multipleSelection[i].xgrmc = this.shiroData.realName;
                }
                axios.post('/dpapi/building/doDeleteBuildingzoning', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条建筑信息",
                        showClose: true,
                        onClose: this.searchClick('delete')
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
        //表格重新加载数据
        loadingData: function () {
            var _self = this;
            _self.loading = true;
            setTimeout(function () {
                console.info("加载数据成功");
                _self.loading = false;
            }, 300);
        }
    },

})