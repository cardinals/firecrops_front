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
                hdzt: "",
                zcbdw: "",
                xfgx: [],
                cxsj: "",
                //高级搜索-预案对象-保卫警卫 点击后跳转到查询页面，通过UUID直接查询其对象
                uuid:""
            },
            tableData: [],
            xfgxData:[],
            allSsdzData:[],
            XFGX_data: [],
           
            props: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },
            selected_XFGX: [],

            XZQY_data: [],
            selected_XZQY: [],

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
            total: 0,
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
            //新建数据
            addForm: {
                HDZT: "",
                ZCBDW: "",
                XFGX: "",
                CXSJ:"",
                XFGXJGID: ""
            },
            //选中的值显示
            sels: [],
            //选中的序号
            selectIndex: -1,
            //编辑界面是否显示
            editFormVisible: false,
            editLoading: false,
            editFormRules: {
                permissionname: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
            },
            //编辑界面数据
            editForm: {
                HDZT: "",
                ZCBDW: "",
                XFGX: "",
                CXSJ:"",
                XFGXJGID: ""
            },
            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'codeName',
                value: 'codeValue'
            },
            //管辖队站Props
            ssdzProps: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid'
            },
            //当前用户
            shiroData: [],
        }
    },
    created: function () {
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("消防保卫警卫对象", "-1");
        this.shiroData = shiroGlobal;
        this.getAllSszdData();
        this.searchXFGX_data();
        //this.searchXZQY_data();
        this.searchClick('click');
        // this.xfgxdata();
    },
    methods: {
        handleNodeClick(data) {
            console.log(data);
        },
        handleChange(value) {
            console.log(value);
        },
         //所属队站下拉框数据
         getAllSszdData: function () {
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUserAll', param).then(function (res) {
                this.allSsdzData = res.data.result;
                this.searchForm.xfgx.push(this.allSsdzData[0].dzid);
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
            if (this.searchForm.begintime != "" && this.searchForm.endtime != "" && this.searchForm.begintime > this.searchForm.endtime) {
                _self.$message({
                    message: "时间选择错误！",
                    type: "error"
                });
                return;
            }
            this.loading = true;
            //高级搜索-预案对象-保卫警卫 点击后跳转到查询页面，通过UUID直接查询其对象
            this.searchForm.uuid = getQueryString("id");
            
            //消防管辖
            var xfgx = "";
            if(this.searchForm.xfgx.length>1){
                xfgx = this.searchForm.xfgx[this.searchForm.xfgx.length-1];
            }else{
                if(this.shiroData.organizationVO.jgid.substr(2,6)!='000000'){
                    xfgx = this.shiroData.organizationVO.uuid;
                }
            }
            var params = {
                //add by yushch
                uuid : this.searchForm.uuid,
                //end add
                hdzt: this.searchForm.hdzt,
                cxsj: this.searchForm.cxsj,
                zcbdw: this.searchForm.zcbdw,
                xfgx: xfgx,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/bwjwplan/findBwjwList', params).then(function (res) {
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        clearClick: function () {
            this.searchForm.hdzt="";
            this.searchForm.zcbdw="";
            this.searchForm.cxsj="";
            this.searchForm.xfgx= [];
            this.searchForm.xfgx.push(this.allSsdzData[0].dzid);
            this.searchClick('reset');
        },
        searchXFGX_data: function () {
            axios.get('/api/codelist/getCodetype/CA01').then(function (res) {
                this.XFGX_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        // searchxfgxdata: function () {
        //     axios.get('/api/codelist/getCodetype/CA01').then(function (res) {
        //         this.xfgxdata = res.data.result;
        //     }.bind(this), function (error) {
        //         console.log(error);
        //     })
        // },
        searchXZQY_data: function () {
            axios.get('/api/codelist/getCodetype/CA01').then(function (res) {
                this.XZQY_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        
        lrsjChange(val) {
            this.searchForm.lrsj.splice(0,this.searchForm.lrsj.length);
            this.searchForm.lrsj.push(val.substring(0,val.indexOf("至")));
            this.searchForm.lrsj.push(val.substring(val.indexOf("至")+1));
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
        //点击进入详情页
        informClick(val) {
            var params = {
                ID: val.uuid
            }
            loadDivParam("planobject/guardobjects_detail", params);
            //window.location.href = "guardobjects_detail.html?ID=" + val.uuid + "&index=" + this.activeIndex;
        },
        //表格重新加载数据
        loadingData: function () {
            var _self = this;
            _self.loading = true;
            setTimeout(function () {
                console.info("加载数据成功");
                _self.loading = true;
            }, 300);
        },
        //新建事件
        addClick: function () {
            var _self = this;
            _self.addFormVisible = true;
        },
        //删除所选，批量删除
        removeSelection: function () {
            var _self = this;
            var multipleSelection = this.multipleSelection;
            if (multipleSelection.length < 1) {
                _self.$message({
                    message: "请至少选中一条记录",
                    type: "error"
                });
                return;
            }
            //var ids = "";
            var ids = [];
            for (var i = 0; i < multipleSelection.length; i++) {
                var row = multipleSelection[i];
                //ids += row.realname + ",";
                ids.push(row.permissionname);
            }
            this.$confirm("确认删除" + ids + "吗?", "提示", {
                type: "warning"
            })
                .then(function () {
                    for (var d = 0; d < ids.length; d++) {
                        for (var k = 0; k < _self.tableData.length; k++) {
                            if (_self.tableData[k].permissionname == ids[d]) {
                                _self.tableData.splice(k, 1);
                            }
                        }
                    }
                    _self.$message({
                        message: ids + "删除成功",
                        type: "success"
                    });
                    _self.total = _self.tableData.length;
                    _self.loadingData(); //重新加载数据
                })
                .catch(function (e) {
                    if (e != "cancel") console.log("出现错误：" + e);
                });
        },
        //表格编辑事件
        editClick: function () {
            var _self = this;
            var multipleSelection = this.multipleSelection;
            if (multipleSelection.length < 1) {
                _self.$message({
                    message: "请至少选中一条记录",
                    type: "error"
                });
                return;
            }
            else if (multipleSelection.length > 1) {
                _self.$message({
                    message: "只能选一条记录进行编辑",
                    type: "error"
                });
                return;
            }
            //var ids = "";
            var ids = [];
            for (var i = 0; i < multipleSelection.length; i++) {
                var row = multipleSelection[i];
                //ids += row.realname + ",";
                ids.push(row.permissionname);
            }
            for (var d = 0; d < ids.length; d++) {
                for (var k = 0; k < _self.tableData.length; k++) {
                    if (_self.tableData[k].permissionname == ids[d]) {
                        _self.selectIndex = k;
                    }
                }
            }
            this.editForm = Object.assign({}, _self.tableData[_self.selectIndex]);
            //this.editForm.sex=(row.sex == "男"?1:0);
            this.editFormVisible = true;
        },
        //保存点击事件
        editSubmit: function (val) {
            var _self = this;
            this.tableData[this.selectIndex].permissionname = val.permissionname;
            this.tableData[this.selectIndex].permissioninfo = val.permissioninfo;
            this.tableData[this.selectIndex].create_name = val.create_name;
            this.tableData[this.selectIndex].create_time = val.create_time;
            this.tableData[this.selectIndex].alter_name = val.alter_name;
            this.tableData[this.selectIndex].alter_time = val.alter_time;
            this.editFormVisible = false;
            _self.loadingData();//重新加载数据
            console.info(this.editForm);
        },
        //新建提交点击事件
        addSubmit: function (val) {
            var _self = this;
            this.tableData.unshift({
                permissionname: val.permissionname,
                permissioninfo: val.permissioninfo,
                create_name: val.create_name,
                create_time: val.create_time,
                alter_name: val.alter_name,
                alter_time: val.alter_time
            });
            this.addFormVisible = false;
            _self.total = _self.tableData.length;
            _self.loadingData();//重新加载数据
            val.permissionname = "";
            val.permissioninfo = "";
            val.create_name = "";
            val.create_time = "";
            val.alter_name = "";
            val.alter_time = "";
            console.info(this.addForm);

        },
        closeDialog: function (val) {
            this.addFormVisible = false;
            val.permissionname = "";
            val.permissioninfo = "";
            val.create_name = "";
            val.create_time = "";
            val.alter_name = "";
            val.alter_time = "";
        }
    },

})