new Vue({
    el: "#app",
    data: function () {
        return {
            activeName: "first",

            jzid: "",//页面获取的建筑id
            // shareVisible: false,
            // showPicVisible: false,
            initialIndex: 0,
            // picTitle:'',
            detailData: [],//建筑信息Data
            loading: false,
            picList: [],
            fjDetailData: ''
        }
    },
    created: function () {
        loadBreadcrumb("建筑信息管理", "建筑信息详情");
        this.jzid = getQueryString("ID");
        this.getDetails(this.jzid);
        // this.picDetail();
    },

    methods: {
        //根据参数部分和参数名来获取参数值 
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        //建筑基本信息查询
        getDetails: function (val) {
            this.loading = true;
            axios.get('/dpapi/jxcsjzxx/' + val).then(function (res) {
                this.detailData = res.data.result;
                // doFindPhoto("JXDWLX", this.detailData.jxdwlx);
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //附件查询
        fjDetail: function (val) {
            axios.get('/dpapi/yafjxz/doFindByPlanId/' + val).then(function (res) {
                this.fjDetailData = res.data.result.length;
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
            this.picList = [
                {
                    name: "实景照片-万达中心",
                    url: baseUrl + "/upload/pic/sjtp.png"
                },
                {
                    name: "总平面图-万达中心",
                    url: baseUrl + "/upload/pic/zpmt.png"
                },
                {
                    name: "内部平面图-B1层平面图",
                    url: baseUrl + "/upload/pic/nbpmtB1.png"
                },
                {
                    name: "作战部署图-灾情4-车辆部署图",
                    url: baseUrl + "/upload/pic/4clbst.png"
                },
                {
                    name: "作战部署图-灾情4-33层力量部署图",
                    url: baseUrl + "/upload/pic/1clbst.png"
                }
            ]
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
        //根据重点单位id获取建筑分区信息
        getJzfqDetailByVo: function () {
            axios.get('/dpapi/importantunits/doFindJzxxDetailByZddwId/' + this.detailData.dxid).then(function (res) {
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
        openSelectDownVisible: function () {
            this.SelectDownVisible = true;
        },
        closeShareDialog: function () {
            this.shareVisible = false;
        },
        closeDownDialog: function () {
            this.downVisible = false;
        },
        //信息分享
        openDown: function (val) {
            if (val == 'detail') {
                this.openDownVisible();
            }
            if (val == 'summary') {
                if (this.jzid == 'dlwddzd') {
                    window.open(baseUrl + "/dpapi/yafjxz/downTempYa?yawjmc=大连万达_简版.docx");
                }
                if (this.jzid == 'dljy') {
                    window.open(baseUrl + "/dpapi/yafjxz/downTempYa?yawjmc=大连锦源_简版.docx");
                }
            }
        },
        closeSelectDownDialog: function () {
            this.SelectDownVisible = false;
        },
        //信息分享
        openShare: function (val) {
            window.open(baseUrl + "/planShare/page/" + this.jzid + "/" + val + "/web");
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
            window.open(baseUrl + "/planShare/downWord/" + this.jzid + "/" + title);
        },
        //预案预览
        openPlan: function () {
            if (this.fjDetailData > 0) {
                axios.get('/dpapi/yafjxz/doFindByPlanId/' + this.jzid).then(function (res) {
                    var yllj = res.data.result[0].yllj;
                    if (yllj == null || yllj == '') {
                        this.$message({
                            message: "无可预览文件",
                            showClose: true
                        });
                    } else {
                        window.open(baseUrl + "/upload/" + yllj);
                    }
                }.bind(this), function (error) {
                    console.log(error)
                })
            } else {
                this.$message({
                    message: "该预案无附件",
                    showClose: true
                });
            }
        },
        //预案下载
        downloadPlan: function () {
            if (this.fjDetailData > 0) {
                axios.get('/dpapi/yafjxz/doFindByPlanId/' + this.jzid).then(function (res) {
                    var xzlj = res.data.result[0].xzlj;
                    window.open(baseUrl + "/upload/" + xzlj);
                }.bind(this), function (error) {
                    console.log(error)
                })
            } else {
                if (this.jzid == 'dlwddzd' || this.jzid == 'dljy') {
                    this.openSelectDownVisible();
                } else {
                    this.openDownVisible();
                }
            }
        }

    }
})
