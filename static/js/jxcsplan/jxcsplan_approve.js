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
                xfgx: [],
                shzt: "未审核",
            },
            tableData: [],//列表信息
            shiroData: [],//当前用户信息
            XFGX_dataTree: [],//消防管辖级联选择
            JXDWLX_data: [],//九小单位类型下拉框
            SHZT_data: [],//审核状态下拉框
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
            radio: "",
            //未通过flag
            isReject: false,
            //审批表单
            approveForm: {
                shzt: -1,
                reserve1: ""
            },
            approveFormVisible: false,
        }
    },
    created: function () {
        loadBreadcrumb("九小场所审核", "-1");
        this.shiroData = shiroGlobal;
        this.XFGX();//消防管辖级联选择
        this.JXDWLX();//九小单位类型下拉框
        this.SHZT();//审核状态下拉框
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
            };
            axios.post('/dpapi/xfdz/findSjdzByUser', param).then(function (res) {
                this.XFGX_dataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            });
        },
        //九小单位类型下拉框
        JXDWLX: function () {
            axios.get('/api/codelist/getCodetype/JXDWLX').then(function (res) {
                this.JXDWLX_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //审核状态下拉框
        SHZT: function () {
            axios.get('/api/codelist/getCodetype/YASHZT').then(function (res) {
                this.SHZT_data = res.data.result;
                this.searchForm.shzt = (this.SHZT_data[0].codeValue);
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
            var shztbm = "";
            if (this.searchForm.shzt == "未审核") {
                shztbm = "01";
            } else {
                shztbm = this.searchForm.shzt;
            }
            //add by yushch 中队显示总队所有数据bug解决
            var xfgx = "";
            if (this.shiroData.organizationVO.jgid.substr(2, 6) != '000000') {
                xfgx = this.shiroData.organizationVO.uuid;
            }
            //end 20180929
            var params = {
                dwmc: this.searchForm.dwmc,
                dwdz: this.searchForm.dwdz,
                xfgx: this.searchForm.xfgx[this.searchForm.xfgx.length - 1],
                jxdwlx: this.searchForm.jxdwlx,
                shzt: shztbm,
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid,
                jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                // xfgx:xfgx
            }
            axios.post('/dpapi/jxcsjbxx/listForApprove', params).then(function (res) {
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
            // if (row.yazt == '01' || row.yazt == '04') {
            var params = {
                ID: row.uuid,
                type: "BJ"
            }
            loadDivParam("jxcsplan/jxcsplan_add", params);
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
        //获取选中的行号（从0开始）
        showRow(row) {
            this.data_index = this.tableData.indexOf(row);
            //赋值给radio
            this.radio = this.data_index - (this.currentPage - 1) * this.pageSize;
            //console.info(this.radio);
        },
        closeDialog: function (val) {
            this.planDetailVisible = false;
            val.shzt = '';
            this.approveFormVisible = false;
        },
        //审批所选
        approve: function () {
            if (this.radio.length < 1) {
                this.$message({
                    message: "请至少选中一条记录",
                    type: "warning",
                    showClose: true
                });
                return;
            }
            // if (this.tableData[this.data_index].shzt == '03') {
            //     this.$message({
            //         message: "该记录已审核通过！",
            //         type: "warning",
            //         showClose: true
            //     });
            //     return;
            // }
            //获取预案uuid
            var row = this.tableData[this.data_index];
            this.uuid = row.uuid;
            //获取当前登录用户realname和userid
            axios.get('/api/shiro').then(function (res) {
                this.shrmc = res.data.realName;
                this.shrid = res.data.userid;
            }.bind(this), function (error) {
                console.log(error)
            });
            this.approveForm = Object.assign({}, row);
            //如果是未通过审核意见显示*代表必填
            if (this.approveForm.shzt == '02')
                this.isReject = true;
            this.approveFormVisible = true;
        },
        //保存点击事件
        approveSubmit: function (val) {
            if (this.isReject == false) {
                this.$message({
                    message: "请选择审核状态",
                    type: "error",
                    showClose: true
                });
            } else if (this.isReject == true && val.reserve1 == null) {
                this.$message({
                    message: "请填写审核意见",
                    type: "error",
                    showClose: true
                });
            } else if (validateBytes(val.reserve1, 36)) {
                this.$message({
                    message: "字段超长，请重新输入",
                    type: "error",
                    showClose: true
                });
            } else {
                //审核状态改变才调用后台approveByVO方法
                if (val.shzt == this.tableData[this.data_index].shzt && val.reserve1 == this.tableData[this.data_index].reserve1) {
                    this.$message({
                        message: "审核状态及审核意见未改变",
                        type: "error",
                        showClose: true
                    });
                } else {
                    var params = {
                        shzt: val.shzt,
                        reserve1: val.reserve1,//审核意见
                        shrid: this.shrid,
                        shrmc: this.shrmc,
                        uuid: this.uuid
                    };
                    axios.post('/dpapi/jxcsjbxx/approveByVO', params).then(function (res) {
                        this.tableData[this.data_index].shztmc = res.data.result.shztmc;
                        this.tableData[this.data_index].shzt = res.data.result.shzt;
                        this.tableData[this.data_index].reserve1 = res.data.result.reserve1;
                        this.$alert('审核成功！', '提示', {
                            type: 'success',
                            confirmButtonText: '确定'
                        });
                        this.data_index = 0;
                        this.radio = 0;
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                    this.approveFormVisible = false;
                    this.loadingData();
                }
            }
        },
        //审核状态为未通过时审核意见显示*代表必填
        radioChange: function () {
            if (this.approveForm.shzt == '02')
                this.isReject = true;
            else
                this.isReject = false;
        },
        //表格重新加载数据
        loadingData: function () {
            var _self = this;
            _self.loading = true;
            this.searchClick();
            setTimeout(function () {
                console.info("加载数据成功");
                _self.loading = false;
            }, 300);
        }
    }
})