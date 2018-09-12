//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            engineListVisible: false,
            //搜索表单
            searchForm: {
                zbmc: "",
                ssdz: [],
                zbbm: "",
                zblx: [],
                // kysl: [0, 1000]
            },
            tableData: [],
            allTypesDataTree: [],//装备类型级联选择数据
            allSsdzData: [],//消防队站下拉框数据（到总队级）
            shiroData: [],
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
            //序号
            indexData: 0,
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
            ssdzProps: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid'
            },
            //装备车辆弹出页-----------------------------------------------------------
            tableData_engine: [],
            tableheight_engine: 250,
            loading_engine: false,
            currentPage_engine: 1,
            pageSize_engine: 10,
            total_engine: 10,
        }
    },
    created: function () {
        loadBreadcrumb("装备器材管理", "-1");
        this.shiroData = shiroGlobal;
        this.getAllSszdData();//消防队站下拉框数据（到总队级）
        this.getAllTypesDataTree();//装备类型级联选择数据
        this.searchClick('click');
    },
    methods: {
        //表格查询事件
        searchClick: function (type) {
            //按钮事件的选择
            if (type == 'page') {
                this.tableData = [];
            } else {
                this.currentPage = 1;
            }
            this.loading = true;
            var zblx = '';
            if (this.searchForm.zblx.length > 0) {
                zblx = this.searchForm.zblx[this.searchForm.zblx.length - 1];
            }
            //所属队站
            var ssdz = "";
            if(this.searchForm.ssdz.length>0){
                ssdz = this.searchForm.ssdz[this.searchForm.ssdz.length-1];
            }else{
                if(this.shiroData.organizationVO.jgid.substr(2,6)!='000000'){
                    ssdz = this.shiroData.organizationVO.uuid;
                }
            }
            var params = {
                zbmc: this.searchForm.zbmc,
                zbbm: this.searchForm.zbbm,
                ssdz: ssdz,
                zblx: zblx,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/equipmentsource/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.zbmc = "";
            this.searchForm.zbbm = "";
            this.searchForm.ssdz = [];
            this.searchForm.zblx = [];
            this.searchClick('reset');
        },
        //装备类型级联选择数据
        getAllTypesDataTree: function () {
            var params = {
                codetype: "ZBQCLX",
                list: [1, 2, 4, 6, 8]
            };
            axios.post('/api/codelist/getCodelisttree2', params).then(function (res) {
                this.allTypesDataTree = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //所属队站下拉框数据
        getAllSszdData: function () {
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUser', param).then(function (res) {
                this.allSsdzData = res.data.result;
                this.searchForm.ssdz.push(this.allSsdzData[0].dzid);
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        //跳转至详情页
        detailClick: function (val) {
            window.location.href = "equipment_detail.html?ID=" + val.id;
        },
        engineDatail: function (val) {
            this.engineListVisible = true;
            this.loading_engine = true;
            var params = {
                zbid: val.uuid
            };
            axios.post('/dpapi/equipengine/list', params).then(function (res) {
                this.tableData_engine = res.data.result;
                this.total_engine = res.data.result.length;
                this.loading_engine = false;
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
        //表格重新加载数据
        loadingData_engine: function () {
            var _self = this;
            _self.loading_engine = true;
            setTimeout(function () {
                console.info("加载数据成功");
                _self.loading_engine = false;
            }, 300);
        },
        //当前页修改事件(装备车辆)
        currentPageChange_engine: function (val) {
            this.currentPage_engine = val;
            var _self = this;
            _self.loadingData_engine(); //重新加载数据
        },
        closeDialog: function () {
            this.engineListVisible = fasle;
        },
        //新增
        addClick: function () {
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("basicinfo/equipment_add", params);
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
                axios.post('/dpapi/equipmentsource/doDeleteEquipment', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条装备器材信息",
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
        //修改
        handleEdit: function (val) {
            var params = {
                ID: val.uuid,
                type: "BJ"
            }
            loadDivParam("basicinfo/equipment_add", params);
        },

    },

})