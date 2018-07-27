//axios默认设置cookie
axios.defaults.withCredentials = true;	
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            //搜索表单
            searchForm: {
                dzmc: "",
                dzdz: "",
                dzlx: ""
            },
            tableData: [],
            dzlxData:[],
            props: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },
            //资源列表是否显示
            detailVisible: false,
            //表高度变量
            tableheight: 443,
            //显示加载中样式
            loading: false,
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 10,
            //总记录数
            total: 0,
            //序号
            indexData: 0,
            //选中的值显示
            sels: [],
            //选中的序号
            selectIndex: -1,
            //删除复选框
            multipleSelection: [],
            //登录用户
            shiroData: [],
        }
    },
    created:function(){
        //设置菜单选中
        // $("#activeIndex").val(getQueryString("index"));
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("消防队站管理", "-1");
        this.getDzlxData();
        this.searchClick('click');
    },

    methods: {       
        //队站类型下拉框加载
        getDzlxData: function(){
            axios.get('/api/codelist/getDzlxTree/DZLX').then(function(res){
                this.dzlxData = res.data.result;
               /** 
                //队站类型只显示 ：总队、支队、大队、中队、其他消防队伍
                var lx_show_list = ["02","03","05","09","0A"];
                for(var i in lxdata){
                    var start_dzlx = lxdata[i].codeValue.substring(0,2);
                    if(lx_show_list.toString().indexOf(start_dzlx) > -1)
                        this.dzlxData.push(lxdata[i]);
                }*/
            }.bind(this),function(error){
                console.log(error);
            })
        },
        
        //表格查询事件
        searchClick: function(type) {
            //按钮事件的选择
            if(type == 'page'){
                this.tableData = [];
            }else{
                this.currentPage = 1;
            }
            this.loading=true;
            //跳转到队站
            this.searchForm.dzid = this.GetQueryString("dzid");//获取队站ID
            var isDzdj = this.GetQueryString("dzdj");//获取队站点击
            var _self = this;
            var params={
                dzid:this.searchForm.dzid,
                dzmc:this.searchForm.dzmc,
                dzdz:this.searchForm.dzdz,
                dzlx :this.searchForm.dzlx[this.searchForm.dzlx.length-1],
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            axios.post('/dpapi/xfdz/page',params).then(function(res){
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.rowdata = this.tableData;
                if(isDzdj == 1){
                    var val = this.tableData[0];
                    this.details(val)
                    }
                this.loading=false;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.dzmc = "",
            this.searchForm.dzdz = "",
            this.searchForm.dzlx = [],
            this.searchClick('reset');
        },
        
        //如果队站类型为其他消防队伍，管辖水源数、管辖重点单位数为”-“
        dataFormat2: function(row, column){
            var rowData = row[column.property];
            var dzlx = row.dzlx;
            if(dzlx == null){
                return null;
            }
            dzlx = dzlx.substr(0,2);
            if(dzlx =="0A"){
                return '——';
            }else{
                return rowData;
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
        //打开详情页
        details: function (val) {
            if(val.dzbm != '01000000'){
                this.detailVisible = true;
                var shortURL = top.location.href.substr(0, top.location.href.indexOf("?")) + "?id=" + val.dzid +"&dzlx=" +val.dzlx;
                history.pushState(null, null, shortURL)
                //异步加载详情页
                $(function () {
                    $.ajax({
                        url: '../../../templates/basicinfo/firestation_detail.html',
                        cache: true,
                        async: true,
                        success: function (html) {
                            $("#detailDialog").html(html);
                        }
                    });
                })
            }
        },
        //关闭详情页
        closeDialog: function (val) {
            this.detailVisible = false;        
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
            loadDivParam("basicinfo/firestation_edit", params);
        },
        editClick: function(val){
            var params = {
                ID: val.dzid,
                dzlx: val.dzlx,
                type: "BJ"
            }
            loadDivParam("basicinfo/firestation_edit", params);
        },
        //删除
        deleteClick: function(){
            this.$confirm('确认删除选中信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post('/api/shiro').then(function (res) {
                    this.shiroData = res.data;
                    for(var i=0;i<this.multipleSelection.length;i++){
                        this.multipleSelection[i].xgrid = this.shiroData.userid;
                        this.multipleSelection[i].xgrmc = this.shiroData.realName;
                    }
                    axios.post('/dpapi/xfdz/doDeleteBatch', this.multipleSelection).then(function (res) {
                        this.$message({
                            message: "成功删除" + this.multipleSelection.length + "条队站信息",
                            showClose: true,
                            onClose: this.searchClick('delete')
                        });
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                }.bind(this), function (error) {
                    console.log(error);
                }); 
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //删除复选框
        selectionChange: function(val) {
            this.multipleSelection = val;
        },

    }
})