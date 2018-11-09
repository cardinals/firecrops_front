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
                dwmc: "",
                jxdwlx: "",
                dwdz: "",
                xfgx: []
            },
            tableData: [],//列表信息
            shiroData: [],//当前用户信息
            XFGX_dataTree: [],//消防管辖级联选择
            JXDWLX_data: [],//九小单位类型下拉框

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

        }
    },
    created: function () {
        loadBreadcrumb("九小场所管理", "-1");
        this.shiroData = shiroGlobal;
        this.XFGX();//消防管辖级联选择
        this.JXDWLX();//九小单位类型下拉框
    },
    mounted: function () {
        this.searchClick('click');//条件查询
    },

    methods: {
        //消防管辖级联选择
        XFGX: function () {
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUserAll', param).then(function (res) {
                this.XFGX_dataTree = res.data.result;
                if(this.XFGX_dataTree[0].children == null || this.XFGX_dataTree[0].children.length == 0){
                    this.searchForm.xfgx.push(this.XFGX_dataTree[0].dzid);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //九小单位类型下拉框
        JXDWLX: function () {
            axios.get('/api/codelist/getCodetype/JXDWLX').then(function (res) {
                this.JXDWLX_data = res.data.result;
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
            } else {
                this.currentPage = 1;
            }
            this.loading = true;//表格重新加载
            //add by yushch 中队显示总队所有数据bug解决
            var xfgx = "";
            if(this.searchForm.xfgx.length>1){
                xfgx = this.searchForm.xfgx[this.searchForm.xfgx.length - 1];
            }else{
                if(this.shiroData.organizationVO.jgid.substr(2,6)!='000000'){
                    xfgx = this.shiroData.organizationVO.uuid;
                }
            }
            
            //end 20180929
            var params = {
                dwmc: this.searchForm.dwmc.replace(/%/g,"\\%"),
                dwdz: this.searchForm.dwdz.replace(/%/g,"\\%"),
              //  xfgx: this.searchForm.xfgx[this.searchForm.xfgx.length - 1],
                jxdwlx: this.searchForm.jxdwlx,
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                xfgx:xfgx
            }
            axios.post('/dpapi/jxcsjbxx/page', params).then(function (res) {
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
            this.searchForm.dwmc = "";
            this.searchForm.dwdz = "";
            this.searchForm.xfgx = [];
            this.searchForm.jxdwlx = "";
            this.searchClick('reset');
        },
        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        //详情跳转
        planDetails: function (val) {
            var params = {
                ID: val.uuid
            }
            loadDivParam("jxcsplan/jxcsplan_detail", params);
        },
        //新增跳转
        addClick: function () {
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("jxcsplan/jxcsplan_add", params);
        },
        //编辑跳转
        handleEdit: function (row) {
            if (row.sjzt == '01' || row.sjzt == '04') {
                var params = {
                    ID: row.uuid,
                    type: "BJ"
                }
                loadDivParam("jxcsplan/jxcsplan_add", params);
            } else {
                this.$message({
                    message: "仅编辑中和已驳回状态预案可编辑",
                    showClose: true,
                 });
            }
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
                axios.post('/dpapi/jxcsjbxx/doDeleteByVOList', this.multipleSelection).then(function (res) {
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