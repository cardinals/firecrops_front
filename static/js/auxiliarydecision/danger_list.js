//axios默认设置cookie
axios.defaults.withCredentials = true;	
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            //菜单编号
            activeIndex: '',
            //搜索表单
            searchForm: {
                NAME: "",
                ENGLISH_NAME:"",
                option_LXDM:"",
                CAS: "",
                DANGER_ID:"",
                EXPRESSION:""
            },
            tableData: [],
            LXDM_data:[],
            role_data:[],
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
            rowdata: {

            },
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
        /**菜单选中 by li.xue 20180628*/
        /**
        var index = getQueryString("index");
        $("#activeIndex").val(index);
        this.activeIndex = index;
         */
        
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("化学危险品", "-1");
        
        this.getLXDMData();
        this.searchClick('click');
        this.roleData();
    },
    methods: {
        handleNodeClick(data) {
        },
        //当前登录用户信息
        roleData: function () {
            axios.post('/api/shiro').then(function (res) {
                this.role_data = res.data;
            }.bind(this), function (error) {
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
            var _self = this;
            _self.loading = true;//表格重新加载
            var params={
                name:this.searchForm.NAME.replace(/%/g,"\\%"),
                englishName: this.searchForm.ENGLISH_NAME.replace(/%/g,"\\%"),
                type: this.searchForm.option_LXDM,
                cas: this.searchForm.CAS.replace(/%/g,"\\%"),
                dangerId: this.searchForm.DANGER_ID.replace(/%/g,"\\%"),
                expression:this.searchForm.EXPRESSION.toUpperCase().replace(/%/g,"\\%"),
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            axios.post('/dpapi/danger/page',params).then(function(res){
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                // this.tableData = res.data.result;
                // this.total = res.data.result.length;
                _self.loading = false;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        
        clearClick: function () {
            this.searchForm.NAME="";
            this.searchForm.ENGLISH_NAME="";
            this.searchForm.CAS="";
            this.searchForm.option_LXDM="";
            this.searchForm.DANGER_ID="";
            this.searchForm.EXPRESSION="";
            this.searchClick('reset');
        },
        getLXDMData: function (){
            var LXDM = [];
            axios.get('/api/codelist/getCodetype/HXWXPLX').then(function(res){
                LXDM = res.data.result;
                for(var i = 0; i<LXDM.length;i++){
                    LXDM[i].codeValue=parseInt(LXDM[i].codeValue);
                    this.LXDM_data.push(LXDM[i]);
                }
                //定义一个比较器
                function compare(propertyName) {
                    return function(object1, object2) {
                    var value1 = object1[propertyName];
                    var value2 = object2[propertyName];
                    if (value2 < value1) {
                        return 1;
                    } else if (value2 > value1) {
                        return -1;
                    } else {
                        return 0;
                    }
                    }
                }
                this.LXDM_data.sort(compare("codeValue"));
            }.bind(this),function(error){
                console.log(error);
            })
        },
        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        detailClick(val) {
            var params = {
                ID: val.uuid
            }
            loadDivParam("auxiliarydecision/danger_detail", params);
            //window.location.href = "danger_detail.html?ID=" + val.uuid + "&index=" + this.activeIndex;
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
        //新增
        addClick: function(){
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("auxiliarydecision/danger_add", params);
            //window.location.href = "danger_add.html?ID=" + 0 + "&index=" + this.activeIndex + "&type=XZ";
        },
        //删除
        deleteClick: function () {
            this.$confirm('确认删除选中信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for(var i=0;i<this.multipleSelection.length;i++){
                    this.multipleSelection[i].xgrid = this.role_data.userid;
                    this.multipleSelection[i].xgrmc = this.role_data.realName;
                }
                axios.post('/dpapi/danger/doDeleteDanger', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条化危品信息",
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
        handleEdit:function(val){
            var params = {
                ID: val.uuid,
                type: "BJ"
            }
            loadDivParam("auxiliarydecision/danger_add", params);
            //window.location.href = "danger_add.html?ID=" + val.uuid + "&index=" + this.activeIndex + "&type=BJ";
        }
    },

})