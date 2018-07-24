//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            drugDetailVisible: false,
            activeName: "first",
            //搜索表单
            searchForm: {
                yjmc: "",
                ssdz: "",
                yjlx: [],
                cbl: [0, 1000]
            },
            tableData: [],
            tableData_detail: {},
            allYjlxDataTree: [],//药剂类型级联选择器数据
            allSsdzData: [],//所属队站下拉框数据
            //表高度变量
            tableheight: 450,
            //显示加载中样
            loading: false,
            loading_detail: false,
            labelPosition: 'right',
            //多选值
            multipleSelection: [],
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 10,
            //总记录数
            total: 0,
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
    created: function () {
        //设置菜单选中
        // $("#activeIndex").val(getQueryString("index"));
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("消防药剂管理", "-1");
        this.getAllSszdData();//消防队站下拉框数据（到总队级）
        this.getAllYjlxDataTree(); //药剂类型级联选择器数据
        this.searchClick('click');
    },
    methods: {
        handleNodeClick(data) {
            // console.log(data);
        },
        //药剂类型级联选择器数据
        getAllYjlxDataTree: function () {
            axios.post('/api/codelist/getYjlxTree/YJLX').then(function (res) {
                this.allYjlxDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //所属队站下拉框数据
        getAllSszdData: function () {
            axios.get('/dpapi/util/doSearchContingents').then(function (res) {
                this.allSsdzData = res.data.result;
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
            this.loading = true;
            var _self = this;
            var cbl_min = this.searchForm.cbl[0];
            var cbl_max = this.searchForm.cbl[1];
            if (this.searchForm.cbl[0] == '0' && this.searchForm.cbl[1] == '1000') {
                cbl_min = '';
                cbl_max = '';
            }
            var params = {
                yjmc: this.searchForm.yjmc,
                ssdz: this.searchForm.ssdz,
                yjlx: this.searchForm.yjlx[this.searchForm.yjlx.length - 1],
                zcbl_min: cbl_min,
                zcbl_max: cbl_max,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            axios.post('/dpapi/firedrug/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        drugDatail: function (val) {
            this.drugDetailVisible = true;
            this.loading_detail = true;
            this.tableData_detail = val;
            this.tableData_detail.scsj = dateFormat(this.tableData_detail.scsj);
            this.loading_detail = false;

        },
        closeDialog: function (val) {
            this.drugDetailVisible = false;
        },
        //清空
        clearClick: function () {
            this.searchForm.yjmc = "";
            this.searchForm.ssdz = "";
            this.searchForm.yjlx = [];
            this.searchForm.cbl = [0, 1000];
            this.searchClick('reset');
        },
        addClick: function (){
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("basicinfo/firedrug_add", params);
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
        }
    },

})