//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            //搜索表单
            searchForm: {
                ssdz: [],
                cllx: [],
                cphm: "",
                clzt: "",
                clbm: "",
                gpsbh: "",
                clmc: ""
            },
            tableData: [],
            shiroData: [],//当前用户信息
            allTeamsData: [],
            allTypesData: [],
            allStatesData: [],
            //级联选择器匹配结果集字段
            props: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },
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
            detailVisible: false,
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
            ssdzProps: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid'
            },
        }
    },
    created: function () {
        //设置菜单选中
        // $("#activeIndex").val(getQueryString("index"));
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("消防车辆管理", "-1");
        /**当前用户信息 by li.xue 20180808 */
        this.shiroData = shiroGlobal;
        this.searchClick('click');
        this.getAllTypesData();
        this.getAllStatesData();
        this.getAllTeamsData();
    },
    methods: {
        handleNodeClick(data) {
        },
        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
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
                axios.post('/dpapi/fireengine/doDeleteFireengine', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + res.data.result + "条车辆信息",
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
        searchClick: function (type) {
            //按钮事件的选择
            if (type == 'page') {
                this.tableData = [];
            } else {
                this.currentPage = 1;
            }
            this.loading = true;
            var _self = this;
            //add by zjc 20180613
            this.searchForm.uuid = this.GetQueryString("uuid");
            var isCldj = this.GetQueryString("cldj");
            //end add
            //所属队站
            var ssdz = "";
            if(this.searchForm.ssdz.length>1){
                ssdz = this.searchForm.ssdz[this.searchForm.ssdz.length-1];
            }else{
                if(this.shiroData.organizationVO.jgid.substr(2,6)!='000000'){
                    ssdz = this.shiroData.organizationVO.uuid;
                }
            }
            var params = {
                uuid: this.searchForm.uuid,
                ssdz: ssdz,
                cllx: this.searchForm.cllx[this.searchForm.cllx.length-1],
                cphm: this.searchForm.cphm,
                clzt: this.searchForm.clzt,
                clbm: this.searchForm.clbm,
                gpsbh: this.searchForm.gpsbh,
                clmc: this.searchForm.clmc,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2) + '000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/fireengine/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loadingData();
                if (isCldj == 1) {
                    var val = this.tableData[0];
                    this.informClick(val)
                }
                this.rowdata = this.tableData;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.ssdz = [];
            this.searchForm.ssdz.push(this.allTeamsData[0].dzid);
            this.searchForm.cllx = [];
            this.searchForm.cphm = "";
            this.searchForm.clzt = "";
            this.searchForm.clbm = "";
            this.searchForm.gpsbh = "";
            this.searchForm.clmc = "";
            this.searchClick('reset');
        },

        //获取所有车辆类型
        getAllTypesData: function () {
            axios.post('/api/codelist/getYjlxTree/CLLX').then(function (res) {
                this.allTypesData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //获取所有车辆状态
        getAllStatesData: function () {
            var params = {
                codetype: "CLZT",
                list: [2, 4]
            };
            axios.post('/api/codelist/getCodelisttree', params).then(function (res) {
                this.allStatesData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //获取所有队站信息
        getAllTeamsData: function () {
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUserAll', param).then(function (res) {
                this.allTeamsData = res.data.result;
                this.searchForm.ssdz.push(this.allTeamsData[0].dzid);
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
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
    }
})