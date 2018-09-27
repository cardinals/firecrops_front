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
                wjm: "",
                zddwmc: ""
            },
            tableData: [],
            //当前登陆用户
            shiroData: [],
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
            total: 0,
            //序号
            indexData: 0,
            //选中的值显示
            sels: [],
            //选中的序号
            selectIndex: -1
        }
    },
    created: function () {
        loadBreadcrumb("二维标绘", "-1");
        this.shiroData = shiroGlobal;
        this.searchClick('click');
    },
    methods: {
        //表格查询事件
        searchClick: function (type) {
            this.loading = true;
            //按钮事件的选择
            if (type == 'page') {
                this.tableData = [];
            } else {
                this.currentPage = 1;
            }
            var params = {
                wjm: this.searchForm.wjm,
                zddwmc: this.searchForm.zddwmc,
                jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/ewbh/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        clearClick: function () {
            this.searchForm.wjm = "";
            this.searchForm.zddwmc = "";
            this.searchClick('reset');
        },
        //新增
        addClick: function () {
            var params = {
                ID: 0,
                type: "XZ"
            }
            window.open("../../templates/all.html?url=/ewbh/ewbh&ID=0&type=XZ");
            // loadDivParam("ewbh/ewbh_list", params);
        },
        //编辑
        editClick: function (val) {
            var params = {
                ID: val.uuid,
                type: "BJ"
            }
            loadDivParam("ewbh/ewbh_list", params);
        },
        //删除
        deleteClick: function () {
            this.$confirm('确认删除选中信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for (var i = 0; i < this.multipleSelection.length; i++) {
                    this.multipleSelection[i].xgrid = this.shiroData.userid;
                    this.multipleSelection[i].xgrmc = this.shiroData.realName;
                }
                axios.post('/dpapi/importantunits/doDeleteBatch', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + this.multipleSelection.length + "条重点单位信息",
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
        //删除复选框
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
    }
})