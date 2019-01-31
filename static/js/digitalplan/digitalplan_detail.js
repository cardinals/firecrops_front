new Vue({
    el: "#app",
    data: function () {
        return {
            activeName: "first",
            pkid: "",//页面获取的预案id
            //选择分享模板界面
            shareVisible: false,
            //选择导出word界面（详情、简版）
            SelectExportVisible: false,
            //选择导出word界面（详情-各字段项）
            downVisible: false,
            showPicVisible: false,
            initialIndex: 0,
            picTitle: '',
            basicDetailData: {},//基础信息Data
            disasterSetData: {},//灾情设定Data
            unitDetailData: {},//重点单位Data
            jzl_zdbwData: [],//建筑类重点部位数据
            zzl_zdbwData: [],//装置类重点部位数据
            cgl_zdbwData: [],//储罐类重点部位数据
            jzfqData: [],//建筑分区原始数据
            jzl_jzfqData: [],//建筑群-建筑类数据
            zzl_jzfqData: [],//建筑群-装置类数据
            cgl_jzfqData: [],//建筑类建筑分区数据
            loading: false,
            picList: [],
            //预案预览按钮是否可用：
            FJYL: false,
            //预案列表是否显示：
            YAFJ: false,
            yafjxzList: [],
            hisDetailData: [],
            hisPlanData: [],
            //历史预案列表是否显示：
            LSYAFJ: false,
            //历史预案附件列表
            hisPlanList: [],
            fmChecked: true,
            dwjbqkChecked: true,
            dwjzxxChecked: true,
            zdbwChecked: true,
            zqsdChecked: true,
            tpChecked: true
        }
    },
    created: function () {
        //设置菜单选中
        // $("#activeIndex").val(getQueryString("index"));

        /**面包屑 by li.xue 20180628*/
        var type = getQueryString("type");
        if (type == "GJSS") {
            loadBreadcrumb("高级搜索", "预案详情");
        } else if (type == "YASH") {
            loadBreadcrumb("预案审核", "预案详情");
        } else if (type == "YAFF") {
            loadBreadcrumb("预案分发", "预案详情");
        } else if (type == "ZDDW") {
            loadBreadcrumb("重点单位详情", "预案详情");
        } else {
            loadBreadcrumb("重点单位预案", "重点单位预案详情");
        }

        this.loading = true;
        this.pkid = getQueryString("ID");
        this.planDetails(this.pkid);
        this.disasterSet(this.pkid);
        this.fjDetail();
        this.picDetail();
    },

    methods: {
        //预案详情基本信息
        planDetails: function (val) {
            this.loading = true;
            axios.get('/dpapi/digitalplanlist/' + val).then(function (res) {
                this.basicDetailData = res.data.result;
                //制作时间格式化
                if (this.basicDetailData.zzsj == null || this.basicDetailData.zzsj == "") {
                    this.basicDetailData.zzsj = '';
                } else {
                    this.basicDetailData.zzsj = dateFormat(this.basicDetailData.zzsj);
                }
                //审核时间格式化
                if (this.basicDetailData.shsj == null || this.basicDetailData.shsj == "") {
                    this.basicDetailData.shsj = '';
                } else {
                    this.basicDetailData.shsj = dateFormat(this.basicDetailData.shsj);
                }
                //大中队预案附件不可预览
                if(this.basicDetailData.yajb == '03'){
                    this.FJYL = true;
                } else{
                    this.FJYL = false;
                }
                doFindPhoto("YAJB", this.basicDetailData.yajb);
                this.unitDetail(this.basicDetailData.dxid);
                this.hisDetail(this.pkid);
                this.getHisPlanListByYaId(this.pkid,this.basicDetailData.jdh);
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //灾情设定信息
        disasterSet: function (val) {
            axios.get('/dpapi/disasterset/doFindByPlanId/' + val).then(function (res) {
                this.disasterSetData = res.data.result;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //重点单位信息
        unitDetail: function (val) {
            axios.get('/dpapi/importantunits/' + val).then(function (res) {
                this.unitDetailData = res.data.result;
                //根据重点单位id获取建筑类重点部位详情集合
                this.getJzlListByZddwId();
                //根据重点单位id获取装置类重点部位详情集合
                this.getZzlListByZddwId();
                //根据重点单位id获取储罐类重点部位详情集合
                this.getCglListByZddwId();
                //根据重点单位id获取包含的分区详情
                this.getJzfqDetailByVo();
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //附件查询
        fjDetail: function () {
            var params = {
                yaid: this.pkid,
                kzm: 'zip'
            }
            axios.post('/dpapi/yafjxz/doFindByPlanId', params).then(function (res) {
                this.yafjxzList = res.data.result;
                if (this.yafjxzList.length !== 0) {
                    this.YAFJ = true;
                } else{
                    this.YAFJ = false;
                }
                // this.fjDetailData = res.data.result.length;
                // if (res.data.result.length > 0) {

                // this.fileList = [{
                //     name: res.data.result[0].wjm,
                //     url: "http://localhost:80/upload/" + res.data.result[0].xzlj
                // }]
                // }

            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //图片查询
        picDetail: function () {
            var params = {
                yaid: this.pkid,
                kzm: 'pic'
            }
            //图片查询
            axios.post('/dpapi/yafjxz/doFindByPlanId', params).then(function (res) {
                var picData = res.data.result;
                if (picData.length > 0) {
                    for (var i in picData) {
                        this.picList.push({
                            uuid: picData[i].uuid,
                            name: picData[i].wjm,
                            url: baseUrl + "/upload/" + picData[i].yllj
                        });
                    }
                }
                // this.hisDetail(this.pkid);
            }.bind(this), function (error) {
                console.log(error)
            })
            // this.picList = [
            //     {
            //         name: "实景照片-万达中心",
            //         url: baseUrl + "/upload/pic/sjtp.png"
            //     },
            //     {
            //         name: "总平面图-万达中心",
            //         url: baseUrl + "/upload/pic/zpmt.png"
            //     },
            //     {
            //         name: "内部平面图-B1层平面图",
            //         url: baseUrl + "/upload/pic/nbpmtB1.png"
            //     },
            //     {
            //         name: "作战部署图-灾情4-车辆部署图",
            //         url: baseUrl + "/upload/pic/4clbst.png"
            //     },
            //     {
            //         name: "作战部署图-灾情4-33层力量部署图",
            //         url: baseUrl + "/upload/pic/1clbst.png"
            //     }
            // ]
        },
        successClose: function () {
            this.initialIndex = 0;
        },
        //图片轮播
        showPic: function (val) {
            this.initialIndex = val;
            this.showPicVisible = true;
            // this.initialIndex = val;
        },
        picTitleChange: function (index, index1) {
            this.picTitle = this.picList[index].name;
        },
        //根据重点单位id获取建筑类重点部位详情
        getJzlListByZddwId: function () {
            axios.get('/dpapi/importantparts/doFindJzlListByZddwId/' + this.basicDetailData.dxid).then(function (res) {
                this.jzl_zdbwData = res.data.result;
                if (this.jzl_zdbwData.length !== 0) {
                    this.ZDBW = true;
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位id获取装置类重点部位详情
        getZzlListByZddwId: function () {
            axios.get('/dpapi/importantparts/doFindZzlListByZddwId/' + this.basicDetailData.dxid).then(function (res) {
                this.zzl_zdbwData = res.data.result;
                if (this.zzl_zdbwData.length !== 0) {
                    this.ZDBW = true;
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //根据重点单位id获取装置类重点部位详情
        getCglListByZddwId: function () {
            axios.get('/dpapi/importantparts/doFindCglListByZddwId/' + this.basicDetailData.dxid).then(function (res) {
                this.cgl_zdbwData = res.data.result;
                if (this.cgl_zdbwData.length !== 0) {
                    this.ZDBW = true;
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //模板压缩包导出
        downloadModule: function () {
            location.href = baseUrl + "/dpapi/planShare/exportData/" + this.pkid;
        },
        //根据重点单位id获取建筑分区信息
        getJzfqDetailByVo: function () {
            axios.get('/dpapi/importantunits/doFindJzxxDetailByZddwId/' + this.basicDetailData.dxid).then(function (res) {
                this.jzfqData = res.data.result;
                if (this.jzfqData.length > 0) {
                    for (var i = 0; i < this.jzfqData.length; i++) {  //循环LIST
                        var jzlx = this.jzfqData[i].jzlx;//获取LIST里面的对象
                        switch (jzlx) {
                            case "30":
                                this.zzl_jzfqData.push(this.jzfqData[i]);
                                break;
                            case "40":
                                this.cgl_jzfqData.push(this.jzfqData[i]);
                                break;
                            default:
                                this.jzl_jzfqData.push(this.jzfqData[i]);
                                break;
                        };
                    }
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },

        //选择信息分享模板界面
        openShareVisible: function () {
            this.shareVisible = true;
        },
        openDownVisible: function () {
            this.downVisible = true;
        },
        //信息导出
        openSelectExportVisible: function () {
            this.SelectExportVisible = true;
        },
        closeShareDialog: function () {
            this.shareVisible = false;
        },
        closeDownDialog: function () {
            this.downVisible = false;
        },
        closeSelectExportDialog: function () {
            this.SelectExportVisible = false;
        },
        //信息分享
        openDown: function (val) {
            if (val == 'detail') {
                this.openDownVisible();
            }
            if (val == 'summary') {

                //edit by huang-rui in 9.15

                // if (this.pkid == 'dlwddzd') {
                //     window.open(baseUrl + "/dpapi/yafjxz/downTempYa?yawjmc=大连万达_简版.docx");
                // }
                // if (this.pkid == 'dljy') {
                //     window.open(baseUrl + "/dpapi/yafjxz/downTempYa?yawjmc=大连锦源_简版.docx");
                // }
                var title = 'fm-dwjbqk-dwjzxx-zdbw';
                window.open(baseUrl + "/dpapi/planShare/downWord/" + this.pkid + "/" + title);
                //edit end

            }
            if (val == 'history') {
                this.hisdownload();
            }
        },
        //信息分享
        openShare: function (val) {
            window.open(baseUrl + "/dpapi/planShare/page/" + this.pkid + "/" + val + "/web");
        },
        downShare: function () {

            var title = 'fm-';
            //单位基本情况
            if (this.dwjbqkChecked) {
                title += 'dwjbqk' + '-'
            }//单位建筑信息和消防设施
            if (this.dwjzxxChecked) {
                title += 'dwjzxx' + '-'
            }//重点部位
            if (this.zdbwChecked) {
                title += 'zdbw' + '-'
            }//灾情设定
            if (this.zqsdChecked) {
                title += 'zqsd' + '-'
            }//附件
            if (this.tpChecked) {
                title += 'tp'
            }
            window.open(baseUrl + "/dpapi/planShare/downWord/" + this.pkid + "/" + title);
        },
        //预案预览
        openPlan: function (val) {
            var yllj = val.yllj;
            window.open(baseUrl + "/upload/" + yllj);
        },
        //预案下载
        downloadPlan: function (val) {
            var xzlj = val.xzlj;
            window.open(baseUrl + "/upload/" + xzlj);
        },
        //add by huang-rui in 9.15
        //历史预案查询
        hisDetail: function (val) {
            var params = {
                yaid: val
            };
            axios.post('/dpapi/yaxxzl/list/', params).then(function (res) {
                this.hisDetailData = res.data.result;
                if (this.basicDetailData.jdh !== null && this.basicDetailData.jdh !== '') {
                    // console.log(this.basicDetailData.jdh)
                    // //辽宁
                    // if (this.basicDetailData.jdh.substr(0, 2) == '21') {
                    //     var head = 'http://10.119.119.232:11010';
                    // //江苏
                    // } else if (this.basicDetailData.jdh.substr(0, 2) == '32') {
                    //     var head = 'http://10.119.119.205:11010';
                    // }
                    for(var i in ipList){
                        if(this.basicDetailData.jdh.substr(0, 2) == ipList[i].jdh){
                            var head = ipList[i].ip
                        }
                    }
                }
                var body = '/attachment/filemanage/configFile!showFile.action';
                if (this.hisDetailData.length > 0) {
                    for (var i in this.hisDetailData) {
                        //fjlxdm:
                        //01    文档
                        //02    图片
                        //03    视频
                        //04    音频
                        //05    其他
                        if (this.hisDetailData[i].fjlxdm == '02') {
                            this.picList.push({
                                uuid: this.hisDetailData[i].id,
                                name: this.hisDetailData[i].zlmc,
                                url: head + body + this.hisDetailData[i].xgxx,
                                type: 'history'
                            });
                        // } else if (this.hisDetailData[i].fjlxdm == '01') {
                        //     this.hisPlanData.push(this.hisDetailData[i]);
                        // }
                        } else {
                            this.hisPlanData.push(this.hisDetailData[i]);
                        }
                    }
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //历史预案下载
        hisdownload: function () {
            var isAccess = false;
            var isHavePlan = false;
            for(var i in ipList){
                if (this.basicDetailData.jdh.substr(0, 2) == ipList[i].jdh) {
                    if (this.hisPlanData.length > 0) {  
                        // //辽宁
                        // if (this.basicDetailData.jdh.substr(0, 2) == '21') {
                        //     var head = 'http://10.119.119.232:11010';
                        // //江苏
                        // } else if (this.basicDetailData.jdh.substr(0, 2) == '32') {
                        //     var head = 'http://10.119.119.205:11010';
                        // }
                        var head = ipList[i].ip
                        var body = '/attachment/filemanage/configFile!showFile.action';
                        for(var i in this.hisPlanData){
                            var url = head + body + this.hisPlanData[i].xgxx;
                            window.open(url);
                        }
                        isHavePlan = true;
                    } 
                    isAccess = true;
                }
            }
            if(isAccess == true && isHavePlan == false) {
                this.$message({
                    message: "该预案无历史附件",
                    showClose: true
                });
            } 
            if(isAccess == false) {
                this.$message({
                    message: "该总队历史预案未接入本平台",
                    showClose: true
                });
            }
        },
        toUnitDetail: function () {
            var params = {
                ID: this.basicDetailData.dxid
            }
            loadDivParam("planobject/importantunits_detail", params);
        },
        //add end 
        //根据预案id获取所有预案的历史预案附件列表
        getHisPlanListByYaId: function (pkid,jdh) {
            var params = {
                uuid: pkid,
                jdh: jdh
            }
            axios.post('/dpapi/digitalplanlist/doFindHisPlanListByVo', params).then(function (res) {
                this.hisPlanList = res.data.result;
                if (this.hisPlanList.length !== 0) {
                    this.LSYAFJ = true;
                }
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //下载表格中所选的历史预案
        downloadHisPlan: function (val){
            var isAccess = false;
            for(var i in ipList){
                if (val.yajdh.substr(0, 2) == ipList[i].jdh) {
                    var head = ipList[i].ip
                    var body = '/attachment/filemanage/configFile!showFile.action';
                    var url = head + body + val.xgxx;
                    window.open(url);
                }
            }
            if(isAccess == true && isHavePlan == false) {
                this.$message({
                    message: "该预案无历史附件",
                    showClose: true
                });
            } 
            isAccess = false;
        }
    }
})
