//axios默认设置cookie
axios.defaults.withCredentials = true;
var vue = new Vue({
    el: '#app',
    data: function () {
        return {
            //计算结果
            jsjg:"",
            //新增顺序号
            addIndex:0,
            //编辑顺序号
            editIndex:0,
            //是否启用下拉框
            sfqyData: [
                {
                    codeName:"是",
                    codeValue:"1"
                },
                {
                    codeName:"否",
                    codeValue:"0"
                }
            ],
            //tab页位置
            activeName:'first',
            tableheight: 443,//表高度变量
            //角色下拉框
            allRoles: [],
            //查询表单
            searchForm: {
                GSMC: '',
                selected_GSLB:'',
                SFQY:''
            },
            //表数据
            tableData: [],
            //公式类别数据
            GSLB_data:[],
            //参数类型数据
            CSLX_data:[],
            //后台返回全部资源列表
            defaultKeys: ['17'],
            //Dialog Title
            dialogTitle: "权限编辑",
            //删除成功后台返回数据
            delStatus: "success",
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
            //序号
            indexData: 0,
            //计算dialog是否显示
            calculateVisible: false,
            //计算数据
            calculateForm: {
                gsmc:'',
                gssm:'',
                jsgs:'',
                domains: [{
                    csmc: '',
                    jldwdm:'',
                    mrz:''
                }],
                jsjg:""
            },
            //计算数据
            calculateMrzData: [],
            //火场计算校验
            calculateFormRules:{

            },
            //删除的弹出框
            deleteVisible: false,
            //新建页面是否显示
            addFormVisible: false,
            addFormRules: {
                gsmc: [{ required: true, message: "请输入公式名称", trigger: "blur" }],
                gssm: [{ required: true, message: "请输入公式说明", trigger: "blur" }],
                jsgs: [{ required: true, message: "请输入计算公式(参数应为中文且为两个以上)", trigger: "blur" }],
                jsgsdw: [{ required: true, message: "请输入计算公式单位", trigger: "blur" }],
                csmc: [{ required: true, message: "请输入计算公式单位", trigger: "blur" }]

            },
            //新建数据
            addFormulaForm: {
                gsmc: "",
                gssm: "",
                jsgs: "",
                jsgsdw: "",
                gslb:""
            },

            addParamForm: {
                domains: [{
                    csmc: '',
                    jldwdm:'',
                    mrz:'',
                    sxh:0
                }],

                rules: {
                    csmc: [{ required: true, message: "参数不能为空", trigger: "blur" }]
                },

            },
            //选中的序号
            selectIndex: -1,
            //修改界面是否显示
            editFormVisible: false,
            editFormRules: {
                gsmc: [{ required: true, message: "请输入公式名称", trigger: "blur" }],
                gssm: [{ required: true, message: "请输入公式说明", trigger: "blur" }],
                jsgs: [{ required: true, message: "请输入计算公式(参数应为中文且为两个以上)", trigger: "blur" }],
                jsgsdw: [{ required: true, message: "请输入计算公式单位", trigger: "blur" }]
            },
            
            //修改界面数据
            editFormulaForm: {
                gsmc: "",
                gssm: "",
                jsgs: "",
                jsgsdw: "",
                gslb:""
            },
            editParamForm: {

                domains: [{
                    uuid:'',
                    csmc: '',
                    jldwdm:'',
                    mrz:''
                }]
            },
            //树状选中状态
            defaultCheckKeys: [],

            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'resourceinfo'
            },

            //角色对应资源
            resourceList: [],

            //新修改页面的复选树
            checkprops: {
                label: 'name',
                children: 'zones'
            },
            count: 1,
            //当前登陆用户
            shiroData: [],
        }
    },
    created: function () {
        /**菜单选中 by li.xue 20180628*/
        //$("#activeIndex").val(getQueryString("index"));

        /**面包屑 by li.xue 20180628*/
        loadBreadcrumb("火场计算", "-1");
        /**当前登陆用户 by li.xue 20180808 */
        this.shiroData = shiroGlobal;
        this.GSLB();
        this.CSLX();
        this.searchClick('click');
    },
    methods: {
        //公式类别下拉框
        GSLB: function () {
            axios.get('/api/codelist/getCodetype/GSLB').then(function (res) {
                this.GSLB_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //参数类型下拉框
        CSLX: function () {
            axios.get('/api/codelist/getCodetype/CSLX').then(function (res) {
                this.CSLX_data = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //查询，初始化
        searchClick: function(type) {
            //按钮事件的选择
            if(type == 'page'){
                this.tableData = [];
            }else{
                this.currentPage = 1;
            }
            var _self = this;
            _self.loading = true;//表格重新加载
            var params = {
                gsmc:this.searchForm.GSMC.replace(/%/g,"\\%"),
                gslb:this.searchForm.selected_GSLB,
                sfqy:this.searchForm.SFQY,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            };

            axios.post('/dpapi/firecalculationlist/findByVO', params).then(function (res) {
                var tableTemp = new Array((this.currentPage-1)*this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                for(var i = (this.currentPage-1)*this.pageSize; i<this.tableData.length; i++){
                    this.tableData[i].sfqy=(this.tableData[i].sfqy == "1"?true:false);
                }
                _self.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //日期控件变化时格式化
        dateChange(val) {
            this.searchForm.createTime.splice(0,this.searchForm.createTime.length);
            this.searchForm.createTime.push(val.substring(0,val.indexOf("至")));
            this.searchForm.createTime.push(val.substring(val.indexOf("至")+1));
        },
        
        //新增页面增加参数表单
        addDomain() {
            this.addIndex++;
            this.addParamForm.domains.push({
                csmc: '',
                jldwdm: '',
                mrz: '',
                sxh:this.addIndex,
                key: Date.now()
            });
        },
        //修改页面增加参数表单
        editDomain() {
            this.editIndex++;
            this.editParamForm.domains.push({
                csmc: '',
                jldwdm: '',
                mrz: '',
                sxh:this.editIndex,
                key: Date.now()
            });
        },
        //新增页面删除参数
        removeAddDomain(item) {
            var index = this.addParamForm.domains.indexOf(item)
            if (index !== -1) {
                this.addParamForm.domains.splice(index, 1)
            }
        },
        //修改页面删除参数
        removeEditDomain(item) {
            var index = this.editParamForm.domains.indexOf(item)
            if (index !== -1) {
                this.editParamForm.domains.splice(index, 1)
            }
        },
        //预案详情
        calculateDetails: function (val) {
            var _self = this;
            _self.calculateVisible = true;
            var uuid = val.uuid;
            var calculateData =[];
            
            axios.get('/dpapi/firecalculationlist/doFindById/' + uuid).then(function (res) {
                this.calculateForm.gsmc = val.gsmc;
                this.calculateForm.gssm = val.gssm;
                this.calculateForm.jsgs = val.jsgs;
                this.calculateForm.jsgsdw = val.jsgsdw;
                this.calculateForm.domains = res.data.result;
                calculateData = res.data.result;
                for(var i = 0;i<calculateData.length;i++){
                    this.calculateMrzData.push(calculateData[i].mrz);
                }
            }.bind(this), function (error) {
                console.log(error)
            })

        },

        resetDialog:function(val){
            for(var i = 0; i<this.calculateForm.domains.length; i++){
                if(this.calculateMrzData[i] == '' || this.calculateMrzData[i] == null)
                {
                    this.calculateForm.domains[i].mrz = '';
                }
                else if(this.calculateMrzData[i] != ''){
                    this.calculateForm.domains[i].mrz = this.calculateMrzData[i];
                }
            }
            this.jsjg = "";
        },
        closeCalculate:function(val){
            this.calculateVisible = false;
            this.calculateForm.domains = null;
            this.calculateMrzData.splice(0,this.calculateMrzData.length);
            this.calculateForm.jsjg = "";
            this.calculateForm.gsmc = "";
            this.calculateForm.gssm = "";
            this.jsjg = "";
        },
        //清空
        clearClick: function () {
            this.searchForm.GSMC="";
            this.searchForm.selected_GSLB="";
            this.searchForm.SFQY="";
            this.searchClick('reset');
        },

        handleNodeClick(data) {
        },

        //表格勾选事件
        selectionChange: function (val) {
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

        //火场计算
        calculate: function (val) {

            this.$refs["calculateForm"].validate((valid) => {
                if (valid) {
                    var params = {
                        gsmc: this.calculateForm.gsmc,
                        gssm: this.calculateForm.gssm,
                        jsgs: this.calculateForm.jsgs,
                        firecalculationparams: this.calculateForm.domains
                    }
                    axios.post('/dpapi/firecalculationlist/doCalculate', params).then(function (res) {
                        this.jsjg = res.data;
                        //alert(res.data);
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                } else {
                    console.log('error save!!');
                    return false;
                }
            });
        },

        //计算公式格式说明
        myFunction: function(){
            var p=document.getElementById('jsgsCard');
            p.style.display='block';
        },
        closeCard: function(){
            var p=document.getElementById('jsgsCard');
            p.style.display='none';
        },
        //新建：提交
        addSubmit: function (val1, val2) {

            this.$refs["addFormulaForm"].validate((valid) => {
                if (valid) {
                    if (this.dialogTitle == "火场计算新增") {
                        axios.get('/dpapi/firecalculationlist/getNum/' + this.addFormulaForm.gsmc).then(function (res) {

                            if (res.data.result > 0) {
                                this.$message({
                                    message: "公式名称已存在",
                                    showClose: true
                                });
                            } else {
                                var params = {

                                    gsmc: this.addFormulaForm.gsmc,
                                    gslb: this.addFormulaForm.gslb,
                                    gssm: this.addFormulaForm.gssm,
                                    jsgs: this.addFormulaForm.jsgs,
                                    jsgsdw: this.addFormulaForm.jsgsdw,
                                    sfqy: "1",
                                    firecalculationparams: this.addParamForm.domains,
                                    cjrid: this.shiroData.userid,
                                    cjrmc: this.shiroData.realName,
                                    jdh: this.shiroData.organizationVO.jgid.substr(0, 2) + '000000',
                                    datasource: this.shiroData.organizationVO.jgid
                                    
                                }

                                axios.post('/dpapi/firecalculationlist/insertByVO', params).then(function (res) {
                                   

                                    if (res.data.msg == "计算公式中参数与参数信息中参数个数不符!请重新输入。") {

                                        this.$message({
                                            message: res.data.msg,
                                            showClose: true
                                        });
                                    }
                                    else {
                                        this.addIndex = 0;
                                        this.searchClick('click');
                                        this.addFormVisible = false;
                                    }

                                }.bind(this), function (error) {
                                    console.log(error)
                                })

                                this.total = this.tableData.length;
                                this.loadingData();//重新加载数据
                            }
                        }.bind(this), function (error) {
                            console.log(error)
                        })


                    } else if (this.dialogTitle == "权限编辑") {
                        var params = {
                            uuid: this.addFormulaForm.uuid,
                            gsmc: this.addFormulaForm.gsmc,
                            gslb: this.addFormulaForm.gslb,
                            gssm: this.addFormulaForm.gssm,
                            jsgs: this.addFormulaForm.jsgs,
                            jsgsdw: this.addFormulaForm.jsgsdw,
                            sfqy: this.addFormulaForm.sfqy,
                            firecalculationparams: this.addParamForm.domains,
                            xgrid: this.shiroData.userid,
                            xgrmc: this.shiroData.realName,
                        };

                        axios.post('/dpapi/firecalculationlist/updateByVO', params).then(function (res) {
                            if (res.data.msg == "计算公式中参数与参数信息中参数个数不符!请重新输入。") {
                                this.$message({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
                            else {
                                this.addFormVisible = false;
                                this.editIndex = 0;
                                this.searchClick('click');
                            }
                        }.bind(this), function (error) {
                            console.log(error)
                        })
                        //存在疑问暂不影响系统功能
                        this.total = this.tableData.length;
                        this.loadingData();//重新加载数据

                    }

                } else {
                    console.log('error save!!');
                    return false;
                }

            });

        },

        //删除：批量删除
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
            var ids = [];
            for (var i = 0; i < multipleSelection.length; i++) {
                var row = multipleSelection[i];
                ids.push(row.uuid);
            }
            this.$confirm("确认删除吗？", "提示", { type: "warning" })
                .then(function () {
                    var params = {
                        ids: ids
                    }
                    axios.post('/dpapi/firecalculationlist/deleteByIds', params).then(function (res) {
                        for (var d = 0; d < ids.length; d++) {
                            for (var k = 0; k < _self.tableData.length; k++) {
                                if (_self.tableData[k].uuid == ids[d]) {
                                    _self.tableData.splice(k, 1);
                                }
                            }
                        }
                        _self.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        _self.total = _self.tableData.length;
                        _self.loadingData(); //重新加载数据
                    }.bind(this), function (error) {
                        console.log(error)
                    })

                })
                .catch(function (e) {
                    if (e != "cancel") console.log("出现错误：" + e);
                });
        },

        //新建：弹出Dialog
        addClick: function () {

            this.dialogTitle = "火场计算新增";
            // //清空edit表单
            // if (this.$refs["addFormulaForm"] !== undefined) {
            //     this.$refs["addFormulaForm"].resetFields();
            // }
            // this.addFormVisible = true;

            this.addFormulaForm.gsmc = "";
            this.addFormulaForm.gslb = "";
            this.addFormulaForm.gssm = "";
            this.addFormulaForm.jsgs = "";
            this.addFormulaForm.jsgsdw = "";
            this.addParamForm.domains = [{csmc: '',jldwdm:'',mrz:'',sxh:0}];
            this.activeName = 'first';
            this.addFormVisible = true;

        },

        //修改：弹出Dialog
        editClick: function (val, index) {

            // 编辑页的弹出框
            this.editIndex = index;
            this.dialogTitle = "权限编辑";
            var params = {
                permissionid: val.permissionid
            };


            axios.post('/api/permission/findByVO', params).then(function (res) {
                this.editForm = res.data.result.list[0];
                //保存当前用户名permissionname
                this.permissionnameOld = this.editForm.permissionname;
            }.bind(this), function (error) {
                console.log(error)
            })

            //原有的js方法内容
            var uuid = val.uuid;
            var editData = {
                uuid:"",
                gsmc: "",
                gssm: "",
                jsgs: "",
                jsgsdw: "",
                gslb:"",
                sfqy:""
            };
            axios.get('/dpapi/firecalculationlist/doFindById/' + uuid).then(function (res) {
                this.addParamForm.domains = res.data.result;
                this.editIndex = this.addParamForm.domains.length-1;
                editData.uuid = val.uuid;
                editData.gsmc = val.gsmc;
                editData.gssm = val.gssm;
                editData.jsgs = val.jsgs;
                editData.jsgsdw = val.jsgsdw;
                editData.gslb = val.gslb;
                editData.sfqy = (val.sfqy?"1":"0");
                this.addFormulaForm = editData;
            }.bind(this), function (error) {
                console.log(error)
            })

            this.addFormVisible = true;

            // this.editFormVisible = true;

        },


        submitIfUse:function($event,val){
            var _self = this;
            var params = {
                uuid: val.uuid,
                sfqy: ($event?"1":"0")
            };
            axios.post('/dpapi/firecalculationlist/updateBySfqy', params).then(function (res) {
                this.searchClick('click');
            }.bind(this), function (error) {
                console.log(error)
            })
            _self.total = _self.tableData.length;
            _self.loadingData();//重新加载数据
        },
        closeDialog: function (val1,val2) {
            this.addFormVisible = false;
            this.addFormulaForm.gsmc = "";
            this.addFormulaForm.gslb = "";
            this.addFormulaForm.gssm = "";
            this.addFormulaForm.jsgs = "";
            this.addFormulaForm.jsgsdw = "";
            this.addParamForm.domains = [{csmc: '',jldwdm:'',mrz:'',sxh:0}];
            this.activeName = 'first';
            // 取消
            this.$refs["addParamForm"].resetFields();
            this.$refs["addFormulaForm"].resetFields();
            var p=document.getElementById('jsgsCard');
            p.style.display='none';
        },
        //关闭修改Dialog
        closeEditDialog: function (val1,val2) {
            this.editFormVisible = false;
            this.activeName = 'first';
        },     
    },

})