//axios默认设置cookie
axios.defaults.withCredentials = true;
var vm = new Vue({
  el: '#app',
  data() {
    return {
      //表数据
      tableData: [],//Grid中数据
      defaultProps: {
        children: 'children',
        label: 'resourceinfo'
      },
      editForm: {
        resourcename: "",
        resourceinfo: "",
        parentid: "",
        type: "",
        seqno: "",
        icon: "",
        permissions: []
      },
      //资源类型
      typeData: [
        {codeValue:'1',codeName:'菜单'},
        {codeValue:'2',codeName:'操作'}
      ],
      //全部资源列表
      allPermissionList: [],
      editFormRules: {
        resourcename: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
          { pattern: /^[0-9A-Za-z\\\/-_]{2,50}$/, message: '资源名称应为2-50位字母、数字、/\\', trigger: 'blur' },
        ],
        resourceinfo: [
          { required: true, message: '请输入资源描述', trigger: 'blur' },
        ],
        type: [
          { validator: (rule,value,callback)=>{
            if(value == "" || value == null){
              callback(new Error("请选择资源类型"));
            }else{
              callback();
            }
          }, trigger: 'change' }
        ],
      },
      //编辑点击Flag
      editFlag: true,
      //编辑按钮显示与隐藏
      editVisible: false,
      addVisible:false,
      addForm: {
        resourcename: "",
        resourceinfo: "",
        parentid: "",
        icon: "",
        type: "",
        permissions: [],
      },
      addFormRules: {
        resourcename: [
            { required: true, message: '请输入资源名称', trigger: 'blur' },
            { pattern: /^[0-9A-Za-z\\\/-_]{2,50}$/, message: '资源名称应为2-50位字母、数字、/\\', trigger: 'blur' },
        ],
        resourceinfo: [
            { required: true, message: '请输入资源描述', trigger: 'blur' },
        ],
        type: [
          { validator: (rule,value,callback)=>{
            if(value == "" || value == null){
              callback(new Error("请选择资源类型"));
            }else{
              callback();
            }
          }, trigger: 'change' }
        ],
      },
    };
  },
  mounted: function () {
    axios.get(baseUrl + '/api/resource/getAll').then(function (res) {
      this.tableData = res.data.result;
      this.total = this.tableData.length;
    }.bind(this), function (error) {
      console.log(error)
    }),
    this.getAllPermissions();
  },
  created: function () {
    /**面包屑 by li.xue 20180628*/
    loadBreadcrumb("资源管理", "-1");
  },
  methods: {
    //左侧树点击事件
    handleNodeClick(data, node) {
      this.findResourceById(data.resourceid);
      //编辑按钮的显示
      this.editVisible = true;
    },
    //编辑点击事件  by li.xue 2018/11/27
    editClick: function(){
      this.editFlag = false;
    },
    //更新
    update: function () {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          var permission = new Array();
          for (var i in this.editForm.permissions) {
            var params = {
              permissionid: this.editForm.permissions[i]
            }
            permission.push(params);
          }
          var params = {
            resourceid: this.editForm.resourceid,
            resourcename: this.editForm.resourcename,
            resourceinfo: this.editForm.resourceinfo,
            parentid: this.editForm.parentid,
            seqno: this.editForm.seqno,
            icon: this.editForm.icon,
            type: this.editForm.type,
            permissions: permission
          }
          axios.post('/api/resource/updateByVO', params).then(function (res) {
            this.editForm.resourceinfo = res.data.result.resourceinfo;
            this.changeTreeLable(this.tableData, this.editForm.resourceid);
            this.$message({
              showClose: true,
              message: '更新成功',
              type: 'success'
            });
            //取消保存按钮的隐藏
            this.editFlag = true;
          }.bind(this), function (error) {
            this.$message({
              showClose: true,
              message: '更新失败',
              type: 'error'
            });
            console.log(error)
          })
        } else {
          console.log('error save!!');
          return false;
        }
      });
    },
    //新增
    append(store, data) {
      this.addVisible = true;
      this.addForm.parentid = data.resourceid;
    },
    //新增父级资源
    appendParent: function () {
      this.addVisible = true;
      this.addForm.parentid = '-1';
    },
    //删除
    remove(store, data) {
      this.$confirm('此操作将删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var id = data.resourceid;
        axios.get('/api/resource/deleteOneById/' + id).then(function (res) {
          store.remove(data);
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
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
    //获取权限列表
    getAllPermissions: function () {
      axios.get('/api/permission/getAll').then(function (res) {
        this.allPermissionList = res.data.result;
      }.bind(this), function (error) {
        console.log(error);
      })
    },
    //资源详情
    findResourceById: function (resourceid) {
      axios.get('/api/resource/' + resourceid).then(function (res) {
        this.editForm = res.data.result;
        //获取资源权限
        this.permissionDetails(resourceid);
      }.bind(this), function (error) {
        console.log(error);
      })
    },
    //根据资源ID查询其权限
    permissionDetails: function (id) {
      this.editForm.permissions = [];
      axios.get('/api/permission/getPermission/' + id).then(function (res) {
        for (var i = 0; i < res.data.result.length; i++) {
          this.editForm.permissions.push(res.data.result[i].permissionid);
        }
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    //取消
    cancel: function () {
      this.findResourceById(this.editForm.resourceid);
      //取消保存按钮的隐藏
      this.editFlag = true;
    },
    //左侧树显示的label
    renderContent(createElement, { node, data, store }) {
      if (data.type == '1') {
        if(hasPermission('system/resource:add') && hasPermission('system/resource:delete')){
          return createElement(
            'span',
            {},
            [
              createElement('span', {}, [createElement('span', node.label)]),
              createElement('span', {}, [
                createElement('el-button', {
                  style: { 'font-size': ' 14px', 'float': 'right', 'margin-right': '10px' },
                  attrs: { 'type': 'text' },
                  on: { click: function () { vm.remove(store, data); } },
                  domProps: { innerHTML: '-' }
                }),
                createElement('el-button', {
                  style: { 'font-size': ' 14px', 'float': 'right', 'margin-right': '20px' },
                  attrs: { 'type': 'text' },
                  on: { click: function () { vm.append(store, data); } },
                  domProps: { innerHTML: '+' }
                })
              ])
            ]
          );
        }else{
          if(hasPermission('system/resource:add')){
            return createElement(
              'span',
              {},
              [
                createElement('span', {}, [createElement('span', node.label)]),
                createElement('span', {}, [
                  createElement('el-button', {
                    style: { 'font-size': ' 14px', 'float': 'right', 'margin-right': '10px' },
                    attrs: { 'type': 'text' },
                    on: { click: function () { vm.append(store, data); } },
                    domProps: { innerHTML: '+' }
                  })
                ])
              ]
            );
          }else if(hasPermission('system/resource:delete')){
            return createElement(
              'span',
              {},
              [
                createElement('span', {}, [createElement('span', node.label)]),
                createElement('span', {}, [
                  createElement('el-button', {
                    style: { 'font-size': ' 14px', 'float': 'right', 'margin-right': '10px' },
                    attrs: { 'type': 'text' },
                    on: { click: function () { vm.append(store, data); } },
                    domProps: { innerHTML: '-' }
                  })
                ])
              ]
            );
          }else{
            return createElement(
              'span',
              {},
              [
                createElement('span', {}, [createElement('span', node.label)])
              ]
            );
          }
        }
      } else {
        if(hasPermission('system/resource:delete')){
          return createElement(
            'span',
            {},
            [
              createElement('span', {}, [createElement('span', node.label)]),
              createElement('span', {}, [
                createElement('el-button', {
                  style: {
                    'font-size': ' 14px', 'float': 'right',
                    'margin-right': '10px'
                  }, attrs: { 'type': 'text' }, on: {
                    click: function () {
                      vm.remove(store, data);
                    }
                  }, domProps: { innerHTML: '-' }
                })
              ])
            ]
          );
        }else{
          return createElement(
            'span',
            {},
            [
              createElement('span', {}, [createElement('span', node.label)])
            ]
          );
        }
      }
    },
    //新增事件
    checkAdd: function (val) {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
            
        } else {
          console.log('error save!!');
          return false;
        }
      });
      if (val.resourcename == "" || val.resourceinfo == "") {
        this.$message({
          showClose: true,
          message: '请完整输入必填项',
          type: 'error'
        });
      }
      else {
        
      }
    },
    addSubmit: function (val) {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          var params = {
            resourcename: this.addForm.resourcename,
          }
          axios.post('/api/resource/list', params).then(function (res) {
            var addData = res.data.result;
            if (addData.length != 0) {
              this.$message({
                showClose: true,
                message: '资源名称已存在',
                type: 'error'
              });
            } else {
              var permission = new Array();
              for (var i in this.addForm.permissions) {
                var param = {
                  permissionid: this.addForm.permissions[i]
                }
                permission.push(param);
              }
              var params = {
                resourcename: this.addForm.resourcename,
                resourceinfo: this.addForm.resourceinfo,
                parentid: val.parentid,
                icon: this.addForm.icon,
                type: this.addForm.type,
                permissions: permission
              }
              axios.post('/api/resource/insertByVO', params).then(function (res) {
                this.$message({
                  showClose: true,
                  message: '新增成功',
                  type: 'success'
                });
                location.reload();
              }.bind(this), function (error) {
                console.log(error)
              })
            }
          }.bind(this), function (error) {
            console.log(error)
          })
        } else {
          console.log('error save!!');
          return false;
        }
      });
    },
    closeDialog: function (val) {
      this.addVisible = false;
      this.$refs["addForm"].resetFields();
    },

    changeTreeLable: function (parentNode, searchKey) {
      for (var i in parentNode) {
        if (parentNode[i].resourceid == searchKey) {
          parentNode[i].resourceinfo = this.editForm.resourceinfo;
        }
        else if (parentNode[i].children != null) {
          var children = parentNode[i].children;
          this.changeTreeLable(children, searchKey);
        }
      }
    },
  },

})