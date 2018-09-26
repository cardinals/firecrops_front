//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            //菜单编码
            activeIndex: '',
            //搜索表单
            searchForm: {
                jzmc: "",
                jzsyxz: [],
                jzwz: "",
                jzjg: []
            },
            tableData: [],//列表信息
            shiroData: [],//当前用户信息
            JZSYXZ_data: [],//建筑使用性质下拉框
            JZJG_data: [],//建筑结构下拉框

            //表高度变量
            tableheight: 443,
            //显示加载中样
            loading: false,
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
            selectIndex: -1,
            //级联下拉框
            ssdzProps: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid'
            },
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },

        }
    },
    created: function () {
        loadBreadcrumb("九小建筑管理", "-1");
        this.shiroData = shiroGlobal;
        this.JZSYXZ();//建筑使用性质级联选择
        this.JZJG();//九小单位类型下拉框
    },
    mounted: function () {
        this.searchClick('click');//条件查询
    },

    methods: {
        //建筑使用性质级联选择
        JZSYXZ: function () {
            axios.get('/api/codelist/getDzlxTree/JZSYXZ').then(function (res) {
                this.JZSYXZ_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //九小单位类型下拉框
        JZJG: function () {
            axios.get('/api/codelist/getCodetype/JZJG').then(function (res) {
                this.JZJG_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //表格查询事件
        searchClick: function (type) {
            //按钮事件的选择
            if (type == 'page') {
                this.tableData = [];
            } else if (type == 'delete') {
                //nothing
            } else {
                this.currentPage = 1;
            }
            this.loading = true;//表格重新加载
            var params = {
                jzmc: this.searchForm.jzmc,
                jzsyxz: this.searchForm.jzsyxz[this.searchForm.jzsyxz.length - 1],
                jzwz: this.searchForm.jzwz,
                jzjg: this.searchForm.jzjg[this.searchForm.jzjg.length - 1],
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            }
            axios.post('/dpapi/jxcsjzxx/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.jzmc = "";
            this.searchForm.jzwz = "";
            this.searchForm.jzsyxz = [];
            this.searchForm.jzjg = [];
            // this.searchClick('reset');
        },
        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        //详情跳转
        planDetails: function (val) {
            var params = {
                ID: val.jzid
            }
            loadDivParam("jxcsplan/jxcsjzxx_detail", params);
        },
        //新增跳转
        addClick: function () {
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("jxcsplan/jxcsjzxx_edit", params);
        },
        //编辑跳转
        handleEdit: function (row) {
            // if (row.yazt == '01' || row.yazt == '04') {
            var params = {
                ID: row.jzid,
                type: "BJ"
            }
            loadDivParam("jxcsplan/jxcsjzxx_edit", params);
            // } else {
            //     this.$message({
            //         message: "仅编辑中和已驳回状态预案可编辑",
            //         showClose: true,
            //     });
            // }
        },
        //删除
        deleteClick: function () {
            this.$confirm('此操作将永久删除选中信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for (var i in this.multipleSelection) {
                    this.multipleSelection[i].xgrid = this.shiroData.userid;
                    this.multipleSelection[i].xgrmc = this.shiroData.realName;
                    this.multipleSelection[i].deleteFlag = "Y";
                }
                axios.post('/dpapi/jxcsjzxx/doDeleteByList', this.multipleSelection).then(function (res) {
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

        // //预案预览
        // openPlan: function () {
        //     window.open("http://10.119.119.232/upload/123456/2018-03-21/70932ac7-da58-4419-91b6-ebe0b3f53838/%E7%89%A9%E7%BE%8E%E7%94%9F%E6%B4%BB%E5%B9%BF%E5%9C%BA%E5%8F%8A%E5%9C%B0%E9%93%81%E5%8D%8E%E8%8B%91%E7%AB%99%E4%B8%89%E7%BB%B4%E7%81%AD%E7%81%AB%E9%A2%84%E6%A1%88.html");
        // },
        // //预案下载
        // downloadPlan: function () {
        //     window.open("http://10.119.119.232/upload/123456/2018-03-21/70932ac7-da58-4419-91b6-ebe0b3f53838/web%E7%89%88%E4%B8%89%E7%BB%B4%E9%A2%84%E6%A1%88.ZIP");
        // },

    },

})