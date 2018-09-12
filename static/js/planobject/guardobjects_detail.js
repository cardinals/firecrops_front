//axios默认设置cookie
axios.defaults.withCredentials = true;
new Vue({
    el: '#app',
    data: function () {
        return {
            activeName: "first",
            pkid: "",
            //表数据
            tableData: [],//基本数据
            yuData: [],//预案数据
            //表高度变量
            tableheight: 474,
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
            //基本数据保存
            rowdata: {},
            //预案数据保存
            yudata: {},
            //序号
            indexData: 0,
            //发送至邮箱是否显示
            emailDialogVisible: false,
            email: "",
            //信息分享是否显示
            shareDialogVisible: false,
            //信息打印是否显示
            printDialogVisible: false,
            //删除的弹出框
            deleteVisible: false,
            //新建页面是否显示
            addFormVisible: false,
            addLoading: false,
            addFormRules: {

            },
            //新建数据
            addForm: {
                HDZT:"", 
                ZCBDW:"", 
                XFGX:"",   
                LXDH:"",   
                ZYNR:"",    
                GMDX:"",    
                RCAP:"",    
                CXSJ:"",    
                HDCSWZ:"",    
                ZDBW:"",   
                CJRMC:"",   
                CJSJ:"",  
                LSYHQK:"", 
                LSYDQK:"",   
                LSDJPJQK:"",    
                XFSS:"",   
                XFSY:"",   
                SSTD:"",    
                XFTD:"",   
                ZBQK:"",   
                GIS_X:"",    
                GIS_Y:"",   
                GIS_H:"", 
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
                HDZT:"", 
                ZCBDW:"", 
                XFGX:"",   
                LXDH:"",   
                ZYNR:"",    
                GMDX:"",    
                RCAP:"",    
                CXSJ:"",    
                HDCSWZ:"",    
                ZDBW:"",   
                CJRMC:"",   
                CJSJ:"",  
                LSYHQK:"", 
                LSYDQK:"",   
                LSDJPJQK:"",    
                XFSS:"",   
                XFSY:"",   
                SSTD:"",    
                XFTD:"",   
                ZBQK:"",   
                GIS_X:"",    
                GIS_Y:"",   
                GIS_H:"", 
                XFGXJGID: ""
            },

        }
    },

    mounted: function () {
        /**菜单选中 by li.xue 20180628*/
        $("#activeIndex").val(getQueryString("index"));

        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if(type == "GJSS"){
            loadBreadcrumb("高级搜索", "消防保卫警卫对象详情");
        }else if(type == "DT"){
            loadBreadcrumb("地图", "消防保卫警卫对象详情");
        }else{
            loadBreadcrumb("消防保卫警卫对象", "消防保卫警卫对象详情");
        }

        this.loading = true;
        this.uuid = getQueryString("ID");
        //显示图片
        doFindPhoto("YADX","02");
        axios.get('/dpapi/bwjwplan/doFindDetailById/' + this.uuid).then(function (res) {
            this.rowdata = res.data.result;
            this.loading = false;
        }.bind(this), function (error) {
            console.log(error)
        })
    },

    methods: {
        handleNodeClick(data) {
            console.log(data);
        },
        //标签页
        handleClick: function (e) {
            console.log(e);
        },
        //二维预案下载
        DownLoadTwoFile: function () {
            var fileUrl = "../example/二维预案.xlsx";
            document.getElementById("ew").href = fileUrl;
            $("#we").click();//在执行a标签里面span的click
        },
        //三维预案下载
        DownLoadThreeFile: function () {
            var fileUrl = "../example/三维预案.xlsx";
            document.getElementById("sw").href = fileUrl;
            $("#ws").click();//在执行a标签里面span的click
        },
        //文档预案下载
        DownLoadFile: function () {
            var fileUrl = "../example/文档预案.xlsx";
            document.getElementById("pf").href = fileUrl;
            $("#fp").click();//在执行a标签里面span的click
        },
        begindateChange(val) {
            this.searchForm.begintime = val;
        },
        enddateChange(val) {
            this.searchForm.endtime = val;
        },
        //发送至邮箱
        openEmail: function () {
            this.emailDialogVisible = true;
        },
        closeEmailDialog: function () {
            this.emailDialogVisible = false;
            this.email = "";
        },
        //信息分享
        openShare: function () {
            this.shareDialogVisible = true;
        },
        closeShareDialog: function () {
            this.shareDialogVisible = false;
        },
        //信息打印
        openPrinter: function () {
            // 1.设置要打印的区域 div的className
            var newstr = document.getElementsByClassName('main-box')[0].innerHTML;
            // 2. 复制给body，并执行window.print打印功能
            document.body.innerHTML = newstr
            window.print()
            // 重新加载页面，以刷新数据
            window.location.reload();

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
    },

})