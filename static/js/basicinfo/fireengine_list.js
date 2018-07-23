//axios默认设置cookie
axios.defaults.withCredentials = true;	
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            //搜索表单
            searchForm: {
                ssdz: "",
                cllx: [],
                cphm: "",
                clzt: "",
                clbm: "",
                gpsbh: ""
            },
            tableData: [],
            allTeamsData: [],
            allTypesData: [],
            allStatesData: [],
            //级联选择器匹配结果集字段
            props: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },
            rowdata: '',
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
            //删除的弹出框
            deleteVisible: false,
            //新建页面是否显示
            addFormVisible: false,
            addLoading: false,
            addFormRules: {
                permissionname: [{ required: true, message: "请输入权限名称", trigger: "blur" }]
            },
            //详情页显示flag
            detailVisible:false,
            //选中的值显示
            sels: [],
            //选中的序号
            selectIndex: -1,
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },

        }
    },
    created:function(){
        //设置菜单选中
        // $("#activeIndex").val(getQueryString("index"));
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("消防车辆管理", "-1");
        this.searchClick('click');
        this.getAllTypesData();
        this.getAllStatesData();
        this.getAllTeamsData();
    },
    methods: {
        //预案删除
        deleteClick: function () {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {
                    xgrid: this.role_data.userid,
                    xgrmc: this.role_data.realName
                }
                axios.post('/dpapi/digitalplanlist/doDeleteDigitalplan', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条信息",
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
        //车辆新增跳转
        addClick: function () {
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("basicinfo/fireengine_add", params);
            //window.location.href = "digitalplan_add.html?ID=" + 0 + "&index=" + this.activeIndex + "&type=XZ";
        },
        //车辆编辑跳转
        handleEdit: function (row) {
            var params = {
                ID: row.uuid,
                type: "BJ"
            }
            loadDivParam("basicinfo/fireengine_add", params);
                //window.location.href = "digitalplan_add.html?ID=" + row.uuid + "&index=" + this.activeIndex + "&type=BJ";
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
            var _self = this;
            //add by zjc 20180613
            this.searchForm.uuid = this.GetQueryString("uuid");
            var isCldj = this.GetQueryString("cldj");
            //end add
            var params={
                uuid: this.searchForm.uuid,
                ssdz :this.searchForm.ssdz,
                cllx :this.searchForm.cllx[this.searchForm.cllx.length-1],
                cphm :this.searchForm.cphm,
                clzt :this.searchForm.clzt,
                clbm :this.searchForm.clbm,
                gpsbh :this.searchForm.gpsbh,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            axios.post('/dpapi/fireengine/page',params).then(function(res){
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loadingData();
                if(isCldj == 1){
                    var val = this.tableData[0];
                    this.informClick(val)
                }
                this.rowdata = this.tableData;
                this.loading=false;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.ssdz="";
            this.searchForm.cllx=[];
            this.searchForm.cphm="";
            this.searchForm.clzt="";
            this.searchForm.clbm="";
            this.searchForm.gpsbh="";
            this.searchClick('reset');
        },
        
        //获取所有车辆类型
        getAllTypesData: function (){
            axios.post('/api/codelist/getYjlxTree/CLLX').then(function (res) {
                this.allTypesData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //获取所有车辆状态
        getAllStatesData: function (){
            var params= {
                codetype : "CLZT",
                list : [2,4]
            };
            axios.post('/api/codelist/getCodelisttree',params).then(function(res){
                this.allStatesData=res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        //获取所有队站信息
        getAllTeamsData: function () {
            axios.get('/dpapi/util/doSearchContingents').then(function (res) {
                this.allTeamsData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //表格勾选事件
        selectionChange: function (val) {
            for (var i = 0; i < val.length; i++) {
                var row = val[i];
            }
            this.multipleSelection = val;
            //this.sels = sels
            console.info(val);
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
        
        //点击进入详情页
        informClick(val) {
            //window.location.href = "fireengine_detail.html?id=" + val.uuid;
            this.detailVisible = true;
            var shortURL = top.location.href.substr(0, top.location.href.indexOf("?")) + "?id=" + val.uuid;
            history.pushState(null, null, shortURL)
            //异步加载详情页
            $(function () {
                $.ajax({
                    url: '../../../templates/basicinfo/fireengine_detail.html',
                    cache: true,
                    async: true,
                    success: function (html) {
                        $("#detailDialog").html(html);
                    }
                });
            })
        },
        //关闭详情页
        closeDialog: function (val) {
            this.addFormVisible = false;
            // val.permissionname = "";
            // val.permissioninfo = "";
            // val.create_name = "";
            // val.create_time = "";
            // val.alter_name = "";
            // val.alter_time = "";
        },
         //根据参数部分和参数名来获取参数值 
         GetQueryString(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
    }
})