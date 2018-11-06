//加载面包屑
window.onload=function(){
    loadBreadcrumb("其他对象预案", "-1");
}
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
                yalxdm: "",
                sfkqy: "",
                jgid: [],
                cjsj: new Array()
            },
            tableData: [],
            yalxdmData: [],
            jgidData: [],
            sfkqyData: [{
                codeValue: '1',
                codeName: '是'
            }, {
                codeValue: '0',
                codeName: '否'
            }],
            defaultKeys: [],
            //树结构配置
            props: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },
            jgidprops: {
                value: 'dzid',
                label: 'dzjc',
                children: 'children'
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
            detailYMD:"",
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
            defaultProps:{
                value:'codeValue',
                label:'codeName'
            },
            //当前用户
            shiroData: [],
        }
    },
    created:function(){
        /**菜单选中 by li.xue 20180628*/
        //$("#activeIndex").val(getQueryString("index"));
        
        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("其他对象预案", "-1");
        this.shiroData = shiroGlobal;
        this.getYalxdmData();
        this.getJgidData();
        this.searchClick('click');
    },

    methods: {       
        //预案类型
        getYalxdmData: function(){
            var params= {
                codetype : "YALX",
                list : [1,2]
            };
            axios.post('/api/codelist/getCodelisttree2',params).then(function(res){
                this.yalxdmData = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        //制作机构
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
        //表格查询事件
        searchClick: function (type) {
            if(type == 'page'){
                this.tableData = [];
            }else{
                this.currentPage = 1;
            }
            this.loading=true;
            //制作机构
            var jgid = "";
            if(this.searchForm.jgid.length>1){
                jgid = this.searchForm.jgid[this.searchForm.jgid.length-1];
            }else{
                if(this.shiroData.organizationVO.jgid.substr(2,6)!='000000'){
                    jgid = this.shiroData.organizationVO.uuid;
                }
            }
            var params={
                yamc: this.searchForm.yamc.replace(/%/g,"\\%"),
                dxmc: this.searchForm.dxmc.replace(/%/g,"\\%"),
                yalx: this.searchForm.yalxdm[this.searchForm.yalxdm.length-1],
                sfkqy: this.searchForm.sfkqy,
                jgid: jgid,
                jdh: this.shiroData.organizationVO.jgid.substr(0,2)+'000000',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/otherobjectsplan/findByVO',params).then(function(res){
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.rowdata = this.tableData;
                this.loading=false;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        //清空查询条件
        clearClick: function (type) {
            this.searchForm.yamc="";
            this.searchForm.dxmc="";
            this.searchForm.yalxdm=[];
            this.searchForm.sfkqy="";
            this.searchForm.jgid=[];
            this.searchForm.jgid.push(this.jgidData[0].dzid);
            this.searchClick('reset');
        },
        //时间格式
        cjsjChange(val) {
            this.searchForm.cjsj.splice(0,this.searchForm.cjsj.length);
            this.searchForm.cjsj.push(val.substring(0,val.indexOf("至")));
            this.searchForm.cjsj.push(val.substring(val.indexOf("至")+1));
        },

        //表格勾选事件
        selectionChange: function (val) {
            for (var i = 0; i < val.length; i++) {
                var row = val[i];
            }
            this.multipleSelection = val;
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
        //打开预案详情页
        planDetails: function (val) {
            var _self = this;
            _self.planDetailVisible = true;
            var shortURL = top.location.href.substr(0, top.location.href.indexOf("?")) + "?uuid=" + val.uuid;
            history.pushState(null, null, shortURL)
            //异步加载详情页
            $(function () {
                $.ajax({
                    url: '../../../templates/digitalplan/otherobjectsplan_detail.html',
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
            this.planDetailVisible = false;        
        }
    }
})