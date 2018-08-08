//axios默认设置cookie
axios.defaults.withCredentials = true;
new Vue({
    el: '#detailDisplay',
    data: function () {
        return {
            visible: false,
            //搜索表单
            searchForm: {
                dwmc: ""
            },
            tableData: [],
            //表高度变量
            tableheight: 250,
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
            //序号
            indexData: 0,
            //选中的值显示
            sels: [],
            //选中的序号
            selectIndex: -1,
        }
    },
    created: function () {
        this.searchClick();
    },
    methods: {
        //表格查询事件
        searchClick: function () {
            this.loading = true;
            var _self = this;
            var params = {
                dwmc: this.searchForm.dwmc
            };
            axios.post('/dpapi/keyunits/findByVO', params).then(function (res) {
                this.tableData = res.data.result;
                this.total = res.data.result.length;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
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
        //分页大小修改事件
        pageSizeChange: function (val) {
            // console.log("每页 " + val + " 条");
            this.pageSize = val;
            var _self = this;
            _self.loadingData(); //重新加载数据
        },
        //当前页修改事件
        currentPageChange: function (val) {
            this.currentPage = val;
            // console.log("当前页: " + val);
            var _self = this;
            _self.loadingData(); //重新加载数据
        },
        selectRow: function (val) {
            
        }
    },

})