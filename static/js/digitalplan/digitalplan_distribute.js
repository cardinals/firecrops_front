//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            //菜单编号
            activeIndex: '',
            //搜索表单
            searchForm: {
                YAMC: "",
                YALX: "",
                YAJB: "",
                DXMC: "",
                ZZJG: "",
                YAZT: "已审批"
            },
            //分发选中
            ffzd: [],
            //创建人姓名
            cjrmc:"",
            //创建人id
            cjrid:"",
            //预案id
            uuid:"",

            //机构复选框
            jgList: [],
            //机构选中
            jgSelect: [],
            //机构选中字符串
            jgSelectString: '',

            tableData: [],
            YALX_dataTree: [],//预案类型级联选择
            YALX_data: [],//预案类型table转码
            ZZJG_dataTree: [],//制作机构级联选择
            ZZJG_data: [],//制作机构table转码
            YAJB_data: [],//预案级别下拉框
            YAZT_data: [],//审核状态下拉框
            jgidprops: {
                value: 'uuid',
                label: 'jgjc',
                children: 'children'
            },
            //资源列表是否显示
            planDetailVisible: false,
            distributeFormVisible: false,
            Visible:false,
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
            //预案详情页
            detailData: [],
            //详情页日期
            detailYMD: "",
            //序号
            indexData: 0,
            //删除的弹出框
            deleteVisible: false,
           
            
            //选中的值显示
            sels: [],
            //选中的序号
            selectIndex: -1,
            defaultProps: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },
            radio:"",
            data_index:"",
            //登录用户
            shiroData: [],
        }
    },
    created: function () {
        this.YALX_tree();//预案类型级联选择
        this.ZZJG_tree();//制作机构级联选择
        this.YAJB();//预案级别下拉框
        this.YAZT();//审核状态下拉框
    },
    mounted:function(){
        /**菜单选中 by li.xue 20180628*/
        /**
        var index = getQueryString("index");
        $("#activeIndex").val(index);
        this.activeIndex = index;
         */

        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("预案分发", "-1");
        /**当前登陆用户 by li.xue 20180807*/
        this.shiroData = shiroGlobal;

        this.searchClick('click');//条件查询
    },

    methods: {
        //预案类型级联选择
        YALX_tree: function () {
            var params= {
                codetype : "YALX",
                list : [1,2,4,6,8]
            };
            axios.post('/api/codelist/getCodelisttree2',params).then(function(res){
                this.YALX_dataTree=res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        
        //预案级别下拉框
        YAJB: function () {
            axios.get('/api/codelist/getCodetype/YAJB').then(function (res) {
                this.YAJB_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //预案状态下拉框
        YAZT: function () {
            axios.get('/api/codelist/getCodetype/YAZT').then(function (res) {
                this.YAZT_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //制作机构
        ZZJG_tree: function () {
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUser', param).then(function (res) {
                this.ZZJG_dataTree = res.data.result;
                this.searchForm.ZZJG.push(this.ZZJG_dataTree[0].dzid);
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
            this.loading = true;//表格重新加载
            var yaztbm = "";
            if(this.searchForm.YAZT == "已审批"){
                yaztbm = "05";
            }else{
                yaztbm = this.searchForm.YAZT;
            }
            //制作机构
            var jgid = "";
            if(this.searchForm.ZZJG.length>0){
                jgid = this.searchForm.ZZJG[this.searchForm.ZZJG.length-1];
            }else{
                if(this.shiroData.organizationVO.jgid.substr(2,6)!='000000'){
                    jgid = this.shiroData.organizationVO.uuid;
                }
            }
            var params = {
                yamc: this.searchForm.YAMC,
                yalx: this.searchForm.YALX[this.searchForm.YALX.length-1], 
                yajb: this.searchForm.YAJB,
                dxmc: this.searchForm.DXMC,
                jgid: jgid,
                yazt: yaztbm,
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            }
            axios.post('/dpapi/digitalplanlist/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.YAMC = "";
            this.searchForm.YALX = [];
            this.searchForm.YAJB = "";
            this.searchForm.ZZJG = [];
            this.searchForm.DXMC = "";
            // this.searchForm.shsj.splice(0,this.searchForm.shsj.length);
            this.searchClick('reset');
        },
        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
        },
        
        //预案详情
        planDetails(val) {
            var params = {
                ID: val.uuid,
                type: "YAFF"
            }
            loadDivParam("digitalplan/digitalplan_detail", params);
            //window.location.href = "digitalplan_detail.html?ID=" + val.uuid + "&index=" + this.activeIndex + "&type=YAFF";
        },
        /** 
        planDetails: function (val) {
            var _self = this;
            _self.planDetailVisible = true;
            var shortURL = top.location.href.substr(0, top.location.href.indexOf("?")) + "?pkid=" + val.uuid;
            history.pushState(null, null, shortURL)
            //异步加载详情页
            $(function () {
                $.ajax({
                    url: '../../../templates/digitalplan/digitalplan_detail.html',
                    cache: true,
                    async: true,
                    success: function (html) {
                        $("#detailDialog").html(html);
                    }
                });
            })
        },
        */
        //表格重新加载数据
        loadingData: function () {
            var _self = this;
            _self.loading = true;
            setTimeout(function () {
                console.info("加载数据成功");
                _self.loading = false;
            }, 300);
        },

        //当前页修改事件
        currentPageChange: function (val) {
            //单选框清空
            this.radio = "";
            //数据序号清空
            this.data_index = "";
            this.currentPage = val;
            this.searchClick('page');
        },
        closeDialog: function (ffzd) {
            this.planDetailVisible = false;
            ffzd = [];
            this.jgSelectString = "";
            this.distributeFormVisible = false;
        },
        //获取选中的行号（从0开始）
        showRow(row){
            this.data_index = this.tableData.indexOf(row);
            //赋值给radio
            this.radio = this.data_index - (this.currentPage - 1)*this.pageSize;
            //console.info(this.radio);
        },
        //分发所选
        distribute: function () {
            if (this.radio.length < 1) {
                this.$message({
                    message: "请至少选中一条记录",
                    type: "warning",
                    showClose: true
                });
                return;
            }

            //获取预案uuid
            var row = this.tableData[this.data_index];
            this.uuid = row.uuid;
            //获取当前登录用户realname和userid
            /*
            axios.get('/api/shiro').then(function (res) {
                this.cjrmc = res.data.realName;
                this.cjrid = res.data.userid;
            }.bind(this), function (error) {
                console.log(error)
            });
            */
            //组织机构选中状态置空
            this.ffzd = [];
            //获取组织机构列表
            axios.get('/api/organization/getZongdui').then(function (res) {
                this.jgList = res.data.result;
                //获取当前预案所在总队名称
                if(row.jgbm!=null && row.jgbm!=""){
                    var jgidZD = row.jgbm.substring(0,2) + '000000';
                    var params = {
                        jgid: jgidZD
                    }
                    axios.post('/api/organization/list', params).then(function(res){
                        this.jgSelectString = res.data.result[0].jgjc;
                        this.ffzd.push(this.jgSelectString);
                    }.bind(this),function(error){
                        console.log(error)
                    })
                }
                //获取已经分发的总队名称
                axios.get('/dpapi/distribute/doFindFfzd/' + this.uuid).then(function(res){
                    var ffzdList = res.data.result;
                    for(var i=0;i<ffzdList.length;i++){
                        this.ffzd.push(ffzdList[i]);
                    }
                }.bind(this),function(error){
                    console.log(error)
                })
            }.bind(this), function (error) {
                console.log(error)
            });
            this.distributeFormVisible = true;
        },
        //保存点击事件
        distributeSubmit: function(ffzd) {
            //审核状态改变才调用后台approveByVO方法
            var index = ffzd.indexOf(this.jgSelectString);
            if(index>-1){
                ffzd.splice(index,1);
            }
            var params = {
                ffzd: ffzd,
                // cjrid: this.cjrid,
                // cjrmc: this.cjrmc,
                yaid: this.uuid
            };
            axios.post('/dpapi/distribute/distribute', params).then(function (res) {
                this.distributeFormVisible = false;
                this.$message({
                    message: "分发成功!",
                    type: "success",
                    showClose: true
                });
            }.bind(this), function (error) {
                console.log(error)
            })
            this.Visible = false;
            this.loadingData();
            }
        },
})