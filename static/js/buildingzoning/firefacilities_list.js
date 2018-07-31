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
                jbxx_xfssmc: "",
                jbxx_xfsslx: "",
                jbxx_jzmc: ""
            },
            tableData: [],
            XFSSLX_data: [],

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
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
        }
    },
    created: function () {
        loadBreadcrumb("消防设施信息", "-1");
        this.getXFSSLXData();
        this.searchClick('click');
    },
    methods: {
        //表格查询事件
        searchClick: function (type) {
            if (type == 'page') {
                this.tableData = [];
            } else {
                this.currentPage = 1;
            }
            var _self = this;
            _self.loading = true;//表格重新加载
            var params = {
                jbxx_xfssmc: this.searchForm.jbxx_xfssmc,
                jbxx_xfsslx: this.searchForm.jbxx_xfsslx[this.searchForm.jbxx_xfsslx.length - 1],
                jbxx_jzmc: this.searchForm.jbxx_jzmc,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };
            axios.post('/dpapi/firefacilities/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                _self.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        clearClick: function () {
            this.searchForm.jbxx_xfssmc = "";
            this.searchForm.jbxx_xfsslx = "";
            this.searchForm.jbxx_jzmc = "";
            this.searchClick('reset');
        },
        isZddwFormat: function(row, column){
            var rowData = row[column.property];
            var isZddw = row.jbxx_iszddw;
            if(isZddw == null){
                return null;
            }else if(isZddw =='0'){
                return '否';
            }else{
                return '是';
            }
        },
        zddwFormat: function(row, column){
            var rowData = row[column.property];
            var isZddw = row.jbxx_iszddw;
            if(isZddw == null){
                return null;
            }else if(isZddw =='0'){
                return '--';
            }else{
                return rowData;
            }
        },
        getXFSSLXData: function () {
            axios.get('/api/codelist/getDzlxTree/XFSSLX').then(function (res) {
                this.XFSSLX_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        detailClick(val) {
            // var params = {
            //     id: val.jzid,
            //     jzlx: val.jzlx
            // }
            // loadDivParam("buildingzoning/buildingzoning_detail", params);
            //window.location.href = "building_zoning_detail.html?id=" + val.jzid +"&jzlx=" +val.jzlx + "&index=" + this.activeIndex;
        },
        //新增
        addClick: function () {
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("buildingzoning/buildingzoning_edit", params);
        },
        editClick: function (val) {
            var params = {
                ID: val.jzid,
                dzlx: val.jzlx,
                type: "BJ"
            }
            loadDivParam("buildingzoning/buildingzoning_edit", params);
        },
        //删除
        deleteClick: function () {

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