//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            awa: "",
            //搜索表单
            searchForm: {
                symc: '',
                sydz: '',
                sylx: '',
                gxdz: '',
                sygs: '',
                kyzt:'',
                xhs_szxs:'',
                xhs_gwxs:'',
                xhs_jkxs:'',
                xfsh_cskgd:'',
                xfsc_gwxs:'',
                xfsc_tcwz:'',
                trsyqsd_tcwz:'',
                trsy_ywksq:'',
                trsy_sz:'',
                uuid:''
            },
            tableData: [],
            SYLX_data: [],
            GXZD_data:[],
            XZ_data:[],
            KYZT_data:[],
            xhs_szxs_data:[],
            gwxs_data:[],
            xhs_jkxs_data:[],
            xfmt_sz_data:[],
            trsy_trsylx_data:[],
            trsy_ywksq_data:[],
            rowdata: '',
            isXhsSelectShow:false,
            isXfshSelectShow:false,
            isXfscSelectShow:false,
            isTrsyqsdSelectShow:false,
           
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
            rowdata: {

            },
            //序号
            indexData: 0,
            //删除的弹出框
            deleteVisible: false,
            
            
            //选中的值显示
            sels: [],
            //选中的序号
            selectIndex: -1,
            //详情页显示flag
            detailVisible:false,
            //当前登陆用户
            shiroData: [],
        }
    },
    created: function () {
        //设置菜单选中
        //$("#activeIndex").val(getQueryString("index"));
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("消防水源管理", "-1");
        /**当前登陆用户信息 by li.xue 20180808 */
        this.shiroData = shiroGlobal;
        this.searchClick('page');
        this.searchSYLX_data();
        this.searchGXZD_data();
        this.searchKYZT_data();
        this.searchXZ_data();
        this.searchXhsSZXS_data();
        this.searchGWXS_data();
        this.searchXhsJKXS_data();
        this.searchXfmtSZ_data();
        this.searchTrsyYWKSQ_data();
        this.searchGXZD_data();
    },
    methods: {
        //表格查询事件
        searchClick: function(type) {
            //按钮事件的选择
            if(type == 'page'){
                this.tableData=[];     
            }else{
                this.currentPage = 1;
            }
            this.loading=true;
            /*水源类型多选，array拼接成字符串
             this.searchForm.sylx = '';
             if (this.selected_SYLX.length > 0) {
                 for (var i = 0; i < this.selected_SYLX.length; i++) {
                     this.searchForm.sylx += '\'' + this.selected_SYLX[i] + '\',';
                 }
             }*/
             //add by yushch 20180604
             this.searchForm.uuid = this.GetQueryString("uuid");
             var isSydj = this.GetQueryString("sydj");
             //end add
            var params = {
                uuid: this.searchForm.uuid,
                symc: this.searchForm.symc,
                sydz: this.searchForm.sydz,
                sylx: this.searchForm.sylx,
                dzbm: this.searchForm.gxdz.substr(0,2),
                sygs: this.searchForm.sygs,
                kyzt: this.searchForm.kyzt,
                xhs_szxs: this.searchForm.xhs_szxs,
                xhs_gwxs: this.searchForm.xhs_gwxs,
                xhs_jkxs: this.searchForm.xhs_jkxs,
                xfsh_cskgd: this.searchForm.xfsh_cskgd,
                xfsc_gwxs: this.searchForm.xfsc_gwxs,
                xfsc_tcwz: this.searchForm.xfsc_tcwz,
                trsyqsd_tcwz: this.searchForm.trsyqsd_tcwz,
                trsy_ywksq: this.searchForm.trsy_ywksq,
                trsy_sz: this.searchForm.trsy_sz,
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            }
            axios.post('/dpapi/xfsy/findlistPage', params).then(function (res) {
                // this.tableData = res.data.result;
                // this.total = this.tableData.length;
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loadingData();
                if(isSydj == 1){
                    var val = this.tableData[0];
                    this.informClick(val)
                }
                this.loading=false;

            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.symc = "";
            this.searchForm.sydz = "";
            this.searchForm.sylx = "";
            this.searchForm.gxdz = "";
            this.searchForm.sygs = "";
            this.searchForm.kyzt = "";
            this.clearOthers();
        },
        //清空关联表查询条件
        clearOthers: function(){
            this.searchForm.xhs_szxs = "";
            this.searchForm.xhs_gwxs = "";
            this.searchForm.xhs_jkxs = "";
            this.searchForm.xfsh_cskgd = "";
            this.searchForm.xfsc_gwxs = "";
            this.searchForm.xfsc_tcwz = "";
            this.searchForm.trsyqsd_tcwz = "";
            this.searchForm.trsy_ywksq = "";
            this.searchForm.trsy_sz = "";
            this.searchClick('reset');
        },
        //水源类型下拉框
        searchSYLX_data: function () {
            axios.get('/api/codelist/getCodetype/SYLX').then(function (res) {
                this.SYLX_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //队站
        searchGXZD_data:function () {
            axios.get('/dpapi/util/doSearchContingents').then(function (res) {
                this.GXZD_data = res.data.result;

            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //水源归属
        searchXZ_data:function () {
            axios.get('/api/codelist/getCodetype/SYGS').then(function (res) {
                this.XZ_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //可用状态
        searchKYZT_data:function () {
            axios.get('/api/codelist/getCodetype/SYKYZT').then(function (res) {
                this.KYZT_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //消火栓设置形式
        searchXhsSZXS_data:function () {
            axios.get('/api/codelist/getCodetype/XHSSZXS').then(function (res) {
                this.xhs_szxs_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //管网形式
        searchGWXS_data:function () {
            axios.get('/api/codelist/getCodetype/GWXS').then(function (res) {
                this.gwxs_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //接口形式
        searchXhsJKXS_data:function () {
            axios.get('/api/codelist/getCodetype/XHSJKXS').then(function (res) {
                this.xhs_jkxs_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //水质
        searchXfmtSZ_data:function () {
            axios.get('/api/codelist/getCodetype/SYSZ').then(function (res) {
                this.xfmt_sz_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        
        //枯水期
        searchTrsyYWKSQ_data:function () {
            axios.get('/api/codelist/getCodetype/SYYWKSQ').then(function (res) {
                this.trsy_ywksq_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        selectsylx:function(){
        //console.log(this.searchForm.sylx);
           switch(this.searchForm.sylx){
               case '01':
                    this.clearOthers();
                    this.isXfshSelectShow = false;
                    this.isXfscSelectShow = false;
                    this.isTrsyqsdSelectShow = false;
                    this.isXhsSelectShow = true;
                    break;
                case '02':
                    this.clearOthers();
                    this.isXfscSelectShow = false;
                    this.isTrsyqsdSelectShow = false;
                    this.isXhsSelectShow = false;
                    this.isXfshSelectShow = true;
                    break;
                case '03':
                    this.clearOthers();
                    this.isTrsyqsdSelectShow = false;
                    this.isXhsSelectShow = false;
                    this.isXfshSelectShow = false;
                    this.isXfscSelectShow = true;
                    break;
                case '04':
                    this.clearOthers();
                    this.isXhsSelectShow = false;
                    this.isXfshSelectShow = false;
                    this.isXfscSelectShow = false;
                    this.isTrsyqsdSelectShow = true;
                    break;
               
                default :
                    this.clearOthers();
                    this.isXhsSelectShow = false;
                    this.isXfshSelectShow = false;
                    this.isXfscSelectShow = false;
                    this.isTrsyqsdSelectShow = false;
                   
           }
        },
        //点击进入详情页
        informClick(val) {
            //window.location.href = "firewater_detail.html?id=" + val.uuid + "&sylx=" + val.sylx;
            this.detailVisible = true;
            var shortURL = top.location.href.substr(0, top.location.href.indexOf("?")) + "?id=" + val.uuid + "&sylx=" + val.sylx;
            history.pushState(null, null, shortURL)
            //异步加载详情页
            $(function () {
                $.ajax({
                    url: '../../../templates/basicinfo/firewater_detail.html',
                    cache: true,
                    async: true,
                    success: function (html) {
                        $("#detailDialog").html(html);
                    }
                });
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
        
        closeDialog: function (val) {
            this.detailVisible = false;
            
        },
        //根据参数部分和参数名来获取参数值 
        GetQueryString(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
         //删除复选框
        selectionChange: function(val) {
            this.multipleSelection = val;
        },
        //编辑
        editClick: function(val){
            var params = {
                ID: val.uuid,
                sylx: val.sylx,
                type: "BJ"
            }
            loadDivParam("basicinfo/firewater_edit", params);
        },
        //删除
        removeSelection: function(){
            this.$confirm('确认删除选中信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for(var i=0;i<this.multipleSelection.length;i++){
                    this.multipleSelection[i].xgrid = this.shiroData.userid;
                    this.multipleSelection[i].xgrmc = this.shiroData.realName;
                }
                axios.post('/dpapi/xfsy/doDeleteBatch', this.multipleSelection).then(function (res) {
                    this.$message({
                        message: "成功删除" + this.multipleSelection.length + "条队站信息",
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
        //新增
        addClick: function(){
            var params = {
                ID: 0,
                type: "XZ"
            }
            loadDivParam("basicinfo/firewater_edit", params);
        },
    },

})