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
                ZZJG: [],
                SHZT: "未审核",
                shsj: ""
            },
            //审批表单
            approveForm: {
                shzt: -1,
                reserve1:""
            },
            //审批人姓名
            shrmc: "",
            //审批人id
            shrid: "",
            //预案id
            uuid: "",

            tableData: [],
            YALX_dataTree: [],//预案类型级联选择
            YALX_data: [],//预案类型table转码
            ZZJG_dataTree: [],//制作机构级联选择
            ZZJG_data: [],//制作机构table转码
            YAJB_data: [],//预案级别下拉框
            SHZT_data: [],//审核状态下拉框
            jgidprops: {
                value: 'dzid',
                label: 'dzjc',
                children: 'children'
            },
            //资源列表是否显示
            planDetailVisible: false,
            approveFormVisible: false,
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
            radio: "",
            data_index: "",
            //未通过flag
            isReject:false,
            //登录用户
            shiroData: [],
        }
    },
    created: function () {
        /**当前登陆用户 by li.xue 20180807*/
        this.shiroData = shiroGlobal;
        this.YALX_tree();//预案类型级联选择
        this.ZZJG_tree();//制作机构级联选择
        this.YAJB();//预案级别下拉框
        this.SHZT();//审核状态下拉框
    },
    mounted: function () {
        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if (type == "DPYL") {
            loadBreadcrumb("统计分析", "预案审核");
        } else {
            loadBreadcrumb("预案审核", "-1");
        }

        this.searchClick('click');//条件查询
    },

    methods: {
        //预案类型级联选择
        YALX_tree: function () {
            var params = {
                codetype: "YALX",
                list: [1, 2, 4, 6, 8]
            };
            axios.post('/api/codelist/getCodelisttree2', params).then(function (res) {
                this.YALX_dataTree = res.data.result;
            }.bind(this), function (error) {
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
        //审核状态下拉框
        SHZT: function () {
            axios.get('/api/codelist/getCodetype/YASHZT').then(function (res) {
                this.SHZT_data = res.data.result;
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
            axios.post('/dpapi/xfdz/findSjdzByUserAll', param).then(function (res) {
                this.ZZJG_dataTree = res.data.result;
                this.searchForm.ZZJG.push(this.ZZJG_dataTree[0].dzid);
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //表格查询事件
        searchClick: function (type) {
            //按钮事件的选择
            if(type == 'page'){
                this.tableData = [];
            }else{
                this.currentPage = 1;
            }
            this.loading = true;//表格重新加载
            var shztbm = "";
            if (this.searchForm.SHZT == "未审核") {
                shztbm = "01";
            } else {
                shztbm = this.searchForm.SHZT;
            }
            //制作机构
            var jgid = "";
            if(this.searchForm.ZZJG.length>1){
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
                jgid: jgid,
                shzt: shztbm,
                begintime: this.searchForm.shsj[0],
                endtime: this.searchForm.shsj[1],
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            }
            axios.post('/dpapi/digitalplanlist/listForApprove', params).then(function (res) {
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
            this.searchForm.ZZJG.push(this.ZZJG_dataTree[0].dzid);
            this.searchForm.SHZT = "未审核";
            //    this.searchForm.shsj.splice(0,this.searchForm.shsj.length);
            this.searchForm.shsj = "";
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
                type: "YASH"
            }
            loadDivParam("digitalplan/digitalplan_detail", params);
            //window.location.href = "digitalplan_detail.html?ID=" + val.uuid + "&index=" + this.activeIndex + "&type=YASH";
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
        closeDialog: function (val) {
            this.planDetailVisible = false;
            val.shzt = '';
            this.approveFormVisible = false;
        },
        //add by yushch 
        timeChange(val) {
            this.searchForm.shsj.splice(0, this.searchForm.shsj.length);
            this.searchForm.shsj.push(val.substring(0, val.indexOf("至")));
            this.searchForm.shsj.push(val.substring(val.indexOf("至") + 1));
        },
        //获取选中的行号（从0开始）
        showRow(row) {
            this.data_index = this.tableData.indexOf(row);
            //赋值给radio
            this.radio = this.data_index - (this.currentPage - 1) * this.pageSize;
            //console.info(this.radio);
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
            if(this.approveForm.shzt == '02')
                this.isReject = true;
            this.approveFormVisible = true;
        },
        //保存点击事件
        approveSubmit: function (val) {
            if(this.isReject==true && val.reserve1 == null)
                this.$message({
                    message: "请填写审核意见",
                    type: "error",
                    showClose: true
                });
            else{
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
                    axios.post('/dpapi/digitalplanlist/approveByVO', params).then(function (res) {
                        this.tableData[this.data_index].shztmc = res.data.result.shztmc;
                        this.tableData[this.data_index].shzt = res.data.result.shzt;
                        this.tableData[this.data_index].yashztButtonType = res.data.result.yashztButtonType;
                        this.tableData[this.data_index].reserve1 = res.data.result.reserve1;
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                    this.approveFormVisible = false;
                    this.loadingData();
                }

            }
  
        },
        //审核状态为未通过时审核意见显示*代表必填
        radioChange:function(){
            if(this.approveForm.shzt == '02')
                this.isReject = true;
            else
                this.isReject = false;
        },
    },

})