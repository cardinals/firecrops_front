//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            //搜索表单
            searchForm: {
                yamc: "",
                dxmc: "",
                yalx: "",
                sfkqy: "",
                jgid: [],
                cjsj: new Array()
            },
            tableData: [],
            yalxdmData: [],
            yalxdmDataTree: [],
            jgidData: [],
            sfkqyData: [
                {
                    codeName:"是",
                    codeValue:"1"
                },
                {
                    codeName:"否",
                    codeValue:"0"
                }
            ],
            defaultKeys: [],
            props: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },
            jgidprops: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid',
            },
            defaultKeys: [],
            //树结构配置
            treeDefaultProps: {
                children: 'children',
                label: 'formationinfo'
            },
            //资源列表是否显示
            planDetailVisible: false,
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
            //新建页面是否显示
            addFormVisible: false,
            addLoading: false,
            addFormRules: {
            },
            //新建数据
            addForm: {
                YAMC: "",
                DWDJ: "",
                DXMC: "",
                YALX: "",
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
            },
            //编辑界面数据
            planDetail: {
                YAMC: "",
                DWDJ: "",
                DXMC: "",
                YALX: "",
                DWDZ: "",
                ZDMJ: "",
                XFGXJGID: ""
            },
            defaultProps: {
                value: 'codeValue',
                label: 'codeName'
            },
            //当前用户
            shiroData: [],
        }
    },
    created: function () {
        /**菜单选中 by li.xue 20180628*/
        //$("#activeIndex").val(getQueryString("index"));
        
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("消防保卫警卫预案", "-1");
        this.shiroData = shiroGlobal;
        this.YALXTree();
        this.YALX();
        this.getJgidData();
    },

    methods: {
        handleNodeClick(data) {
            console.log(data);
        },
        handleChange(value) {
            console.log(value);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },

        //获取所有机构
        getJgidData: function(){
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUserAll', param).then(function (res) {
                this.jgidData = res.data.result;
                if(this.jgidData[0].children == null || this.jgidData[0].children.length == 0){
                    this.searchForm.jgid.push(this.jgidData[0].dzid);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        //预案类型table转码
        YALX: function () {
            axios.get('/api/codelist/getCodetype/YALX').then(function (res) {
                this.yalxdmData = res.data.result;
                this.searchClick('click');
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //预案类型级联
        YALXTree: function () {
            var params= {
                codetype : "YALX",
                list : [1,2,4,6,8]
            };
            axios.post('/api/codelist/getCodelisttree2',params).then(function(res){
                this.yalxdmDataTree=res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },

        //表格查询事件
        searchClick: function (type) {
            if(type == 'page'){ 
                this.tableData = [];    
            }else{
                this.currentPage = 1;
            }
            var _self = this;
            //制作机构
            var jgid = "";
            if(this.searchForm.jgid.length>1){
                jgid = this.searchForm.jgid[this.searchForm.jgid.length-1];
            }else{
                if(this.shiroData.organizationVO.jgid.substr(2,6)!='000000'){
                    jgid = this.shiroData.organizationVO.uuid;
                }
            }
            var params = {
                yamc: this.searchForm.yamc,
                yalx: this.searchForm.yalx[this.searchForm.yalx.length-1],
                dxmc: this.searchForm.dxmc,
                sfkqy: this.searchForm.sfkqy,
                jgid: jgid,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            }
            axios.post('/dpapi/xfbwjw/findBwjwplanList', params).then(function (res) {
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log("failed")
            })
        },
        clearClick: function () {
            this.searchForm.yamc="";
            this.searchForm.dxmc="";
            this.searchForm.yalx=[];
            this.searchForm.sfkqy="";
            this.searchForm.jgid = [];
            this.searchForm.jgid.push(this.jgidData[0].dzid);
            this.searchForm.cjsj.splice(0,this.searchForm.cjsj.length);
            this.searchClick('reset');
        },
        //时间格式
        cjsjChange(val) {
            this.searchForm.cjsj.splice(0,this.searchForm.cjsj.length);
            this.searchForm.cjsj.push(val.substring(0,val.indexOf("至")));
            this.searchForm.cjsj.push(val.substring(val.indexOf("至")+1));
        },
        
        //时间格式
        bzrqChange(val) {
            this.searchForm.BZRQ.splice(0,this.searchForm.BZRQ.length);
            this.searchForm.BZRQ.push(val.substring(0,val.indexOf("至")));
            this.searchForm.BZRQ.push(val.substring(val.indexOf("至")+1));
        },

        //表格勾选事件
        selectionChange: function (val) {
            this.multipleSelection = val;
            console.info(val);
        },

        //预案详情
        planDetails: function (val) {
            var _self = this;
            _self.planDetailVisible = true;
            var shortURL = top.location.href.substr(0, top.location.href.indexOf("?")) + "?pkid=" + val.uuid;
            history.pushState(null, null, shortURL)
            //异步加载详情页
            $(function () {
                $.ajax({
                    url: '../../../templates/digitalplan/guardobjectsplan_detail.html',
                    cache: true,
                    async: true,
                    success: function (html) {
                        $("#detailDialog").html(html);
                    }
                });
            })
        },
        //预案预览
        openPlan: function () {
            window.open("http://10.119.119.232/upload/123456/2018-03-21/70932ac7-da58-4419-91b6-ebe0b3f53838/%E7%89%A9%E7%BE%8E%E7%94%9F%E6%B4%BB%E5%B9%BF%E5%9C%BA%E5%8F%8A%E5%9C%B0%E9%93%81%E5%8D%8E%E8%8B%91%E7%AB%99%E4%B8%89%E7%BB%B4%E7%81%AD%E7%81%AB%E9%A2%84%E6%A1%88.html");
        },
        //预案下载
        downloadPlan: function () {
            window.open("http://10.119.119.232/upload/123456/2018-03-21/70932ac7-da58-4419-91b6-ebe0b3f53838/web%E7%89%88%E4%B8%89%E7%BB%B4%E9%A2%84%E6%A1%88.ZIP");
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
            this.planDetailVisible = false;
        }
        /**
        * lxy
        */
        ,
        submitUpload() {
            this.upLoadData = { id: 2 };
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {

            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        }

    },

})