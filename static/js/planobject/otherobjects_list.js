//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            //菜单编号
            activeIndex: '',
            //面包屑
            firstName: '其他对象',
            //搜索表单
            searchForm: {
                dxmc: '',
                dxdz: '',
                xfgx: '',
                //高级搜索-预案对象-保卫警卫 点击后跳转到查询页面，通过UUID直接查询其对象
                uuid: ''
            },
            tableData: [],
            xfgxData: [],
            props: {
                value: 'codeValue',
                label: 'codeName',
                children: 'children'
            },
            defaultKeys: [],
            //树结构配置
            treeDefaultProps: {
                children: 'children',
                label: 'formationinfo'
            },
            //管辖队站Props
            ssdzProps: {
                children: 'children',
                label: 'dzjc',
                value: 'dzid'
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
            //序号
            indexData: 0,
            //删除的弹出框
            deleteVisible: false,
            //新建页面是否显示
            addFormVisible: false,
            addLoading: false,
            addFormRules: {
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
        /**
        var index = getQueryString("index");
        $("#activeIndex").val(index);
        this.activeIndex = index;
         */

        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("其他对象", "-1");
        this.shiroData = shiroGlobal;
        //消防管辖下拉框
        this.getxfgxData();
        this.searchClick('click');
    },

    methods: {
        //消防管辖下拉框
        getxfgxData: function () {
            var organization = this.shiroData.organizationVO;
            var param = {
                dzid: organization.uuid,
                dzjc: organization.jgjc,
                dzbm: organization.jgid
            }
            axios.post('/dpapi/xfdz/findSjdzByUser', param).then(function (res) {
                this.xfgxData = res.data.result;
                this.searchClick();
            }.bind(this), function (error) {
                console.log(error);
            })
            // axios.get('/dpapi/util/doSearchContingents').then(function (res) {
            //     this.xfgxData = res.data.result;
            // }.bind(this), function (error) {
            //     console.log(error);
            // })
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
            //高级搜索-预案对象-保卫警卫 点击后跳转到查询页面，通过UUID直接查询其对象
            this.searchForm.uuid = getQueryString("id");
            var params = {
                //add by yushch
                uuid: this.searchForm.uuid,
                //end add
                dxmc: this.searchForm.dxmc,
                dxdz: this.searchForm.dxdz,
                xfgx: this.searchForm.xfgx[this.searchForm.xfgx.length - 1],
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                orgUuid: this.shiroData.organizationVO.uuid,
                orgJgid: this.shiroData.organizationVO.jgid
            };
            axios.post('/dpapi/otherobjects/page', params).then(function (res) {
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.rowdata = this.tableData;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.dxmc = "";
            this.searchForm.dxdz = "";
            this.searchForm.xfgx = "";
            this.searchClick('reset');
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
            var params = {
                ID: val.uuid
            }
            loadDivParam("planobject/otherobjects_detail", params);
            //window.location.href = "otherobjects_detail.html?ID=" + val.uuid + "&index=" + this.activeIndex;
        }
    }
})