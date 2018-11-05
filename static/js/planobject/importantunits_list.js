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
                dwmc: "",
                dwxz: "",
                jzfl: "",
                fhdj: "",
                mhdzid: [],
                xfdwlxmc: ""
            },
            tableData: [],
            //单位性质下拉框
            dwxzData: [],
            jzflData: [],
            fhdjData: [],
            mhdzidData: [],
            xfdwlxmcData: [
            {
                codeValue: '1',
                codeName: '有'
            }, {
                codeValue: '2',
                codeName: '无'
            }],

            XFGX_data: [],
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
            rowdata: {

            },
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
                DWMC: "",
                DWDJ: "",
                DWXZ: "",
                XZQY: "",
                DWDZ: "",
                ZDMJ: "",
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
                DWMC: "",
                DWDJ: "",
                DWXZ: "",
                XZQY: "",
                DWDZ: "",
                ZDMJ: "",
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
            //当前登陆用户
            shiroData: [],
        }
    },
    created: function () {      
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("重点单位", "-1");
        /**当前登陆用户 by li.xue 20180808 */
        this.shiroData = shiroGlobal;
        this.searchClick('click');
        this.getdwxzData();
        this.getfhdjData();
        this.getmhdziddata();
        this.getjzflData(); 
    },
    methods: {
        handleNodeClick(data) {
            console.log(data);
        },
        handleChange(value) {
            console.log(value);
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
            this.loading = true;
            //地图跳转到重点
            this.searchForm.uuid = getQueryString("uuid");
            var isZddwdj = getQueryString("zddwdj");

            //灭火队站ID
            var mhdzid = "";
            if(this.searchForm.mhdzid.length>1){
                mhdzid = this.searchForm.mhdzid[this.searchForm.mhdzid.length-1];
            }else{
                if(this.shiroData.organizationVO.jgid.substr(2,6)!='000000'){
                    mhdzid = this.shiroData.organizationVO.uuid;
                }
            }
            var params = {
                uuid:this.searchForm.uuid,
                dwmc: this.searchForm.dwmc.replace(/%/g,"\\%"),
                dwxz: this.searchForm.dwxz,
                jzfl: this.searchForm.jzfl,
                fhdj: this.searchForm.fhdj,
                mhdzid: mhdzid,
                xfdwlxmc: this.searchForm.xfdwlxmc,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/importantunits/page', params).then(function(res){
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                if(isZddwdj == 1){
                    var val = this.tableData.list[0];
                    this.informClick(val)
                }
                this.loading = false;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        clearClick: function () {
            this.searchForm.dwmc="";
            this.searchForm.dwxz="";
            this.searchForm.jzfl="";
            this.searchForm.fhdj="";
            this.searchForm.mhdzid=[];
            this.searchForm.mhdzid.push(this.mhdzidData[0].dzid);
            this.searchForm.xfdwlxmc="";
            this.searchClick('reset');
        },
        //新增
        addClick: function(){
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("planobject/importantunits_edit", params);
        },
        //编辑
        editClick: function(val){
            var params = {
                ID: val.uuid,
                type: "BJ"
            }
            loadDivParam("planobject/importantunits_edit", params);
        },
        //删除
        deleteClick: function(){
            this.$confirm('确认删除选中信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for(var i=0;i<this.multipleSelection.length;i++){
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
        selectionChange: function(val) {
            this.multipleSelection = val;
        },
        getdwxzData: function () {
            axios.get('/api/codelist/getCodeTypeOrderByNum/DWXZ').then(function (res) {
                this.dwxzData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        compare: function (property) {
            return function (a, b) {
                var value1 = parseInt(a[property]);
                var value2 = parseInt(b[property]);
                return value1 - value2;
            }
        },
        getfhdjData: function () {
            axios.get('/api/codelist/getCodetype/FHDJ').then(function (res) {
                this.fhdjData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        getmhdziddata:function () {
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUserAll', param).then(function (res) {
                this.mhdzidData = res.data.result;
                this.searchForm.mhdzid.push(this.mhdzidData[0].dzid);
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        getjzflData: function () {
            axios.get('/api/codelist/getCodetype/JZFL').then(function (res) {
                this.jzflData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        
        //点击进入详情页
        informClick(val) {
            var params = {
                ID: val.uuid
            }
            loadDivParam("planobject/importantunits_detail", params);
            // window.location.href = "importantunits_detail.html?ID=" + val.uuid + "&index=" + this.activeIndex;
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
    }
})