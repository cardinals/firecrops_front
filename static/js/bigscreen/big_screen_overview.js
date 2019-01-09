//axios默认设置cookie
axios.defaults.withCredentials = true;
var vm = new Vue({
    el: "#app",
    data: {
        city: '',
        color: {
            a: '#ff6364',//red
            b: '#fdc107',//yellow
            c: '#29bb9d',//green
            d: '#556ca6'//blue
        },
        //barData右侧下方
			barData: {
				name: ['化危品火灾爆炸', '建筑堆场类', '交通运输类', '危化品泄露事故', '交通事故',
					'建筑物坍塌事故', '自然灾害事故', '公共突发事件', '群众遇险事件', '群众求助救援'],
				value: [935, 535, 814, 232, 851, 332, 235, 156, 72, 74],
			},
        //测试数据
        tatalDate0: {
            //szhya: '1451523',
            szhya: '2658',
            //zddw: '2727468',
            zddw: '1680',
            //jzxx: '2727468',
            jzxx: '1302',
            //xfdz: '2727468',
            xfdz: '1425',
        },
        totalDate: {
            szhya: '',
            zddw: '',
            jzxx: '',
            xfdz: '',
        },
        //测试数据
        pieData0: [
            { value: 1335, name: '一级' },
            { value: 1310, name: '二级' },
            { value: 1234, name: '三级' },
            { value: 434, name: '其他' }
        ],
        pieData: [],
        //测试数据
        barData0: [
            { name: '化危品火灾爆炸', value: 935 },
            { name: '建筑堆场类', value: 535 },
            { name: '交通运输类', value: 814 },
            { name: '危化品泄露事故', value: 232 },
            { name: '交通事故', value: 851 },
            { name: '建筑物坍塌事故', value: 332 },
            { name: '自然灾害事故', value: 235 },
            { name: '公共突发事件', value: 156 },
            { name: '群众遇险事件', value: 72 },
            { name: '群众求助救援', value: 74 }
        ],
        // barData: [],
        //测试数据
        top10bak: [
            { name: '北京', value: '2999' },
            { name: '河北', value: '1142' },
            { name: '天津', value: '1218' },
            { name: '辽宁', value: '1021' },
            { name: '湖北', value: '1455' },
            { name: '河南', value: '1919' },
            { name: '新疆', value: '1299' },
            { name: '西藏', value: '1999' },
            { name: '山西', value: '2751' },
            { name: '海南', value: '1313' }
        ],
        top10: [],
        top11: [],
        top101: [],
        top102: [],
        //测试数据
        scrollData_DSH0: [
            { value: '1', name: '辽宁省人民法院' },
            { value: '2', name: '辽宁省政府' },
            { value: '5', name: '沈阳市公安局' },
            { value: '7', name: '青岛市塑性加工园' },
            { value: '9', name: '河北省国土资源厅' },
            { value: '10', name: '秦皇岛市林业局' }
        ],
        scrollData_DSH: [],
        //测试数据
        scrollData_DGX0: [
            { name: '北京总队', value: '34' },
            { name: '天津总队', value: '21' },
            { name: '河北总队', value: '42' },
            { name: '山西总队', value: '52' },
            { name: '内蒙古总队', value: '14' },
            { name: '辽宁总队', value: '54' },
            { name: '吉林总队', value: '55' },
            { name: '黑龙江总队', value: '45' },
            { name: '上海总队', value: '76' },
            { name: '江苏总队', value: '21' },
            { name: '浙江总队', value: '41' },
            { name: '安徽总队', value: '97' },
            { name: '福建总队', value: '111' },
            { name: '江西总队', value: '21' },
            { name: '山东总队', value: '66' },
            { name: '河南总队', value: '15' },
            { name: '湖北总队', value: '64' },
            { name: '湖南总队', value: '84' },
            { name: '广东总队', value: '71' },
            { name: '广西总队', value: '148' },
            { name: '海南总队', value: '159' },
            { name: '重庆总队', value: '25' },
            { name: '四川总队', value: '66' },
            { name: '贵州总队', value: '12' },
            { name: '云南总队', value: '53' },
            { name: '西藏总队', value: '9' },
            { name: '陕西总队', value: '12' },
            { name: '甘肃总队', value: '59' },
            { name: '青海总队', value: '34' },
            { name: '宁夏总队', value: '62' },
            { name: '新疆总队', value: '173' }
        ],
        scrollData_DGX: [],
        //测试数据
        mapData0: [
            { name: '西藏', value: 605 },
            { name: '青海', value: 41670 },
            { name: '宁夏', value: 2102 },
            { name: '海南', value: 2522 },
            { name: '甘肃', value: 5020 },
            { name: '贵州', value: 5701 },
            { name: '新疆', value: 6610 },
            { name: '云南', value: 8893 },
            { name: '重庆', value: 10011 },
            { name: '吉林', value: 10568 },
            { name: '山西', value: 11237 },
            { name: '天津', value: 11307 },
            { name: '江西', value: 11702 },
            { name: '广西', value: 11720 },
            { name: '陕西', value: 12513 },
            { name: '黑龙江', value: 12582 },
            { name: '内蒙古', value: 14359 },
            { name: '安徽', value: 15300 },
            { name: '北京', value: 36251 },
            { name: '福建', value: 17560 },
            { name: '上海', value: 49195 },
            { name: '湖北', value: 19632 },
            { name: '湖南', value: 19669 },
            { name: '四川', value: 21026 },
            { name: '辽宁', value: 22226 },
            { name: '河北', value: 34515 },
            { name: '河南', value: 26933 },
            { name: '浙江', value: 32318 },
            { name: '山东', value: 45361 },
            { name: '江苏', value: 49110 },
            { name: '广东', value: 53210 }
        ],
        mapData: [],
        tagscloudData: [
            { uuid: '1', zddwmc: '辽宁省人民法院' },
            { uuid: '2', zddwmc: '辽宁省政府' },
            { uuid: '3', zddwmc: '辽宁省就业局' },
            { uuid: '4', zddwmc: '沈阳市城市规划管理局' },
            { uuid: '5', zddwmc: '沈阳市公安局' },
            { uuid: '6', zddwmc: '沈阳市地铁二号线' },
            { uuid: '7', zddwmc: '青岛市塑性加工园' },
            { uuid: '8', zddwmc: '泰安市城建局' },
            { uuid: '9', zddwmc: '河北省国土资源厅' },
            { uuid: '10', zddwmc: '秦皇岛市林业局' }
        ],
        isDSH: true,
        isDGX: false
    },
    mounted: function () {
        this.total();
        this.scrollDsh();
        this.scrollDgx();
        this.echarts51();
        this.echarts52();
        this.echarts5();
        this.echarts11();
        this.echarts111();
        this.echarts112()
        this.echarts1();
        this.barChart();
        // this.mapecharts();
        this.echarts2();
        // this.echarts3();
        /**yushch
        setInterval(
            this.autoAdd
        , 1200)
         */
    },
    methods: {
        // 标题数字
        total: function () {
            var params = {
                btype: 'total'
            }
            axios.post('/dpapi/dp/getListByType', params).then(function (res) {
               
                for (let i = 0; i < res.data.result.length; i++) {
                    const element = res.data.result[i];
                    if (element.bname == 'szhya') {
                        this.totalDate.szhya = element.bvalue;
                    } else if (element.bname == 'zddw') {
                        this.totalDate.zddw = element.bvalue;
                    } else if (element.bname == 'jzxx') {
                        this.totalDate.jzxx = element.bvalue;
                    } else if (element.bname == 'xfdz') {
                        this.totalDate.xfdz = element.bvalue;
                    }
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        // 右侧下方侧柱状图
		barChart: function () {
			var myChart = echarts.init(document.getElementById('bar'));
			option = {
				title: {
					text: '',
					x: 'center'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					top: '20',
					bottom: '5',
					left: '15',
					right: '40',
					containLabel: true
				},
				xAxis: [
					{
                        type: 'category',
                        
                        data: this.barData.name,
						axisLabel: {
                            fontSize:9,
							interval: 0,
							/*
							formatter:function(value)  
							{  
							   return value.split("").join("\n");  
							},
							*/
                            rotate: "-40",
                            color:"#fff"
                
                        },
                       
					}
				],
				yAxis: [
					{
						type: 'value',
						splitLine: {
                            show: true,
                            lineStyle:{
                                color: ['#42c9f6'],
                                width: 1,
                                type: 'solid'
                            }
                        },
                        axisLabel: {
                            color:"#fff",
						},
					}
				],
				series: [
					{
						name: '预案数量',
						type: 'bar',
						barWidth: '100%',
						stack: '预案',
						barWidth: '5',
						data: this.barData.value,
						smooth: true,
						itemStyle: {
							normal: {
                                barBorderRadius:[3, 3, 0, 0],
								color: function (params) {
									var colorList = ['#42c9f6','#eca426','#42c9f6','#eca426','#42c9f6','#eca426','#42c9f6','#eca426','#42c9f6','#eca426'];
									return colorList[params.dataIndex];
                                },
                                textStyle:{
                                    fontSize:"1px",
                                }
							}
						}
					}
                ],
                // color: ['#C1232B','#B5C334','#FCCE10','#E87C25','#27727B']
			};
			// myChart.on('click', function (param) {
			// 	var index = param.dataIndex + 1;
			// 	vm.pieData = eval("vm.pieData" + index);
			// 	vm.pieTitle = eval("vm.pieTitle" + index);
			// 	var pieChart = echarts.getInstanceByDom(document.getElementById("pie"));
			// 	if (pieChart != null && pieChart != "" && pieChart != undefined) {
			// 		pieChart.dispose();
			// 	}
			// 	vm.pieChart();
			// });
			// 此外param参数包含的内容有：
			// param.seriesIndex：系列序号（series中当前图形是第几个图形第几个，从0开始计数）
			// param.dataIndex：数值序列（X轴上当前点是第几个点，从0开始计数）
			// param.seriesName：legend名称
			// param.name：X轴值
			// param.data：Y轴值
			// param.value：Y轴值
            // param.type：点击事件均为click
			myChart.setOption(option);
		},
        // 中央下部31总队柱状图
        echarts1: function () {
            var myBarChart = echarts.init(document.getElementById('barmax'));
            BarmaxOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                // color: ['#0f82ee'],
                grid: {
                    top: '40',
                    bottom: '10',
                    left: '2%',
                    right: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['南京', '镇江', '苏州', '扬州', '宿迁', '盐城', '无锡', '淮安','常州', '连云港', '泰州', '南通', '徐州'],
                        axisLine: {
                            lineStyle: {
                                color: '#42c9f6',
                            }
                        },
                       
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                color: '#fff',//坐标值得具体的颜色
                            },
                            /*
                            formatter:function(value)  
                            {  
                               return value.split("").join("\n");  
                            },
                            */
                            // rotate: "45"
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                           
                                color: '#42c9f6'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff',//坐标值得具体的颜色
                            },
                            
                        },
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color: ['#364a6a'],
                                width: 1,
                                type: 'dashed'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '单位',
                        type: 'bar',
                        barWidth: '100%',
                        stack: '预案',
                        barWidth: '10',
                        
                        itemStyle: {
                            barBorderRadius: 20,
                            normal: {

                                barBorderRadius:[3, 3, 0, 0],
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        { offset: 0, color: '#83bff6' },
                                        { offset: 0.5, color: '#188df0' },
                                        { offset: 1, color: '#0f82ee' }
                                    ]
                                )


                            },
                            emphasis: {
                               
                                barBorderRadius: 30,
                                
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        { offset: 0, color: '#188df0' },
                                        { offset: 0.7, color: '#188df0' },
                                        { offset: 1, color: '#83bff6' }
                                    ]
                                )
                            }
                        },
                        data: [949, 920, 813, 800, 792, 723, 705, 650, 612, 590, 512, 325, 212]
                    }
                ]
            };
            myBarChart.setOption(BarmaxOption);
        },
        
        echarts2: function () {
            var myMapChart = echarts2.init(document.getElementById('map'));
            myMapChart.setOption({
                // dataRange: {
                //     min : 0,
                //     max : 1000,
                //     calculable : true,
                //     // 整体颜色的修改
                //     color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
                //     textStyle:{
                //         color:'#fff'
                //     }
                // },
                series : [
                    {
                        name: '江苏',
                        type: 'map',
                        label: {
                            normal: {
                            show: true
                            },
                            emphasis: {
                            show: true
                            }
                        },
                        roam: true,
                        //开启各城市背景
                        hoverable: false,
                        
                        mapType: '江苏',
                        itemStyle:{
                            normal:{
                                borderColor:'#19dbec',
                                borderWidth:1,
                                shadowColor: 'rgba(0,54,255, 1)',
                                shadowBlur: 10,
                                areaStyle:{
                                    color: 'rgba(0,0,0,0)'
                                },
                                label: {
                                show: true,
                                fontSize:10,
                                textStyle:{
                                    color:'#fff',
                                    fontSize:9
                                }
                                },
                                
                            },
                            
                        },
                        data:[
                        
                        ],
                        
                        markLine : {
                            smooth:true,
                            symbol: ['none', 'circle'],  
                            symbolSize : 1,
                            itemStyle : {
                                normal: {
                                    color:'#fff',
                                    borderWidth:1,
                                    borderColor:'rgba(30,144,255,0.5)'
                                }
                            },
                            data : [
                                
                            ],
                        },
                        geoCoord: {
                            '南京': [118.8062,31.9208],
                            '南通': [121.1023,32.1625],
                            '常州': [119.4543,31.5582],
                            '徐州': [117.5208,34.3268],
                            '泰州': [120.0586,32.5525],
                            '盐城': [120.2234,33.5577],
                            '苏州': [120.6519,31.3989],
                            '连云港': [119.1248,34.552],
                            '镇江': [119.4763,31.9702],
                            '扬州': [119.4000,32.4000],
                            '无锡': [120.2900,31.5900],
                            '宿迁': [118.3000,33.9600],
                            '淮安': [119.1500,33.5000]
                        },
                        markPoint : {
                            symbol:'emptyCircle',
                            symbolSize : function (v){
                                // 设置圆圈的半径大小
                                return 10 + v/150
                            },
                            effect : {
                                show: true,
                                shadowBlur : 0
                            },
                            itemStyle:{
                                normal:{
                                    label:{show:false}
                                },
                                emphasis: {
                                    label:{position:'top'}
                                }
                            },
                            data : [
                                {name:'南京',value:949},
                                {name:'南通',value:900},
                                {name:'常州',value:800},
                                {name:'徐州',value:700},
                                {name:'泰州',value:600},
                                {name:'盐城',value:500},
                                {name:'苏州',value:400},
                                {name:'连云港',value:300},
                                {name:'镇江',value:200},
                                {name:'扬州',value:200},
                                {name:'无锡',value:605},
                                {name:'宿迁',value:505},
                                {name:'淮安',value:450}						]
                        }
                    },
                    {
                        name: '北京 Top101',
                        type: 'map',
                        mapType: '江苏',
                        data:[],
                        markLine : {
                            smooth:true,
                            effect : {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle : {
                                normal: {
                                    label:{show:false},
                                    borderWidth:1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data : [
                                //显示地图上的数据走向
//								[{name:'南京'}, {name:'南京',value:95}],
//								[{name:'南通'}, {name:'南京',value:90}],
//								[{name:'常州'}, {name:'南京',value:80}],
//								[{name:'盐城'}, {name:'南京',value:50}],
//								[{name:'扬州'}, {name:'南京',value:20}],
//								[{name:'连云港'}, {name:'南京',value:50}],
//								[{name:'镇江'}, {name:'南京',value:40}],
//								[{name:'苏州'}, {name:'南京',value:40}],
//								[{name:'无锡'}, {name:'南京',value:65}],
//								[{name:'宿迁'}, {name:'南京',value:55}],
//								[{name:'淮安'}, {name:'南京',value:45}],
//								[{name:'徐州'}, {name:'南京',value:70}]
                            ]
                        },
                        markPoint : {
                            symbol:'emptyCircle',
                            symbolSize : function (v){
                                return 0.1
                            },
                            effect : {
                                show: false,
                                shadowBlur : 0
                            },
                            
                            itemStyle:{
                                
                                normal:{
                                    label:{show:true,
                                          position:'top',
                                          textStyle: {
                                                    fontSize: 14,
                                                    
                                                }
                                          }
                                },
                                emphasis: {
                                    label:{show:true}
                                }
                            },
                            data : [
                                // 显示地图上的数字
                                // {name:'南京',value:949},
                                // {name:'南通',value:900},
                                // {name:'常州',value:800},
                                // {name:'徐州',value:700},
                                // {name:'泰州',value:600},
                                // {name:'盐城',value:500},
                                // {name:'苏州',value:400},
                                // {name:'连云港',value:300},
                                // {name:'镇江',value:200},
                                // {name:'扬州',value:200},
                                // {name:'无锡',value:605},
                                // {name:'宿迁',value:505},
                                // {name:'淮安',value:450}
                            ]
                        }
                    }
                ]
        });
                // myMapChart.setOption(MapOption);
                myMapChart.on('click', function () {
                    vm.loadChart();
                });

        },
        // 重点单位类型环形图
        echarts3: function () {
            var myPieChart = echarts.init(document.getElementById('pie'));
            PieOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "防火等级：{b} <br/>{a}: {c} ({d}%)"
                },
                color: ['#ff6364', '#fdc107', '#29bb9d', '#556ca6'],
                legend: {
                    orient: 'vertical',
                    x: '70%',
                    y: 'center',
                    itemGap: 16,
                    itemWidth: 18,
                    data: ['一级', '二级', '三级', '其他'],
                    textStyle: {
                        color: 'white'
                    },
                    align: 'left'
                },
                series: [
                    {
                        name: '重点单位数量',
                        type: 'pie',
                        center: ['35%', '50%'],
                        radius: ['50%', '80%'],
                        label: {
                            normal: {
                                show: true,
                                position: 'inner', //标签的位置
                                textStyle: {
                                    fontWeight: 300,
                                    fontSize: 11    //文字的字体大小
                                },
                                formatter: '{d}%'
                            }
                        },
                        data: this.pieData
                    }
                ]
            };
            var params = {
                btype: 'fhdj'
            }
            axios.post('/dpapi/dp/getListByType', params).then(function (res) {
                for (let i = 0; i < res.data.result.length; i++) {
                    const element = res.data.result[i];
                    const item = {
                        name: element.bname,
                        value: parseFloat(element.bvalue),
                    }
                    this.pieData.push(item);
                }
                myPieChart.setOption(PieOption);
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        // 预案类型柱状图
        echarts4: function () {
            var myBarChart = echarts.init(document.getElementById('bar'));
            
            var category = [];
            var data = [];
            BarOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                color: ['#42c9f6'],
                grid: {
                    left: '30px',
                    right: '18px',
                    top: '10px',
                    bottom: '0px',
                    containLabel: true
                },
                grid: {
                    left: '20px',
                    right: '60px',
                    top: '5px',
                    bottom: '-10px',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: category,
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: 'white'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,
                            rotate: "40",
                            fontSize: 3
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: 'white'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true
                        },
                        splitLine: {
                            show: true
                        }
                    }
                ],
                series: [
                    {
                        name: '数字化预案数量',
                        type: 'bar',
                        barWidth: '40%',
                        // stack: '预案',
                        data: data,
                        barWidth: 6,
                        barGap: 10,
                        smooth: true,
                        itemStyle: {
                            emphasis: {
                                barBorderRadius: 10
                            },
                            normal: {
                                 barBorderRadius: 10,
                                // 绿+蓝
                                color: function (params) {
                                    var colorList = ['#42c9f6'];
                                    return colorList[params.dataIndex];
                                }
                            }
                        }
                    }
                ]
            };

            var params = {
                btype: 'yalx'
            }
            axios.post('/dpapi/dp/getListByType', params).then(function (res) {
                for (let i = 0; i < res.data.result.length; i++) {
                    const element = res.data.result[i];
                    const item = {
                        name: element.bname,
                        value: element.bvalue,
                    }
                    this.barData.push(item);
                }
                for (var i = 0; i < this.barData.length; i++) {
                    category.push(this.barData[i].name);    //挨个取出类别并填入类别数组
                    data.push(this.barData[i].value);
                }
                myBarChart.setOption(BarOption);
                // myBarChart.on('click', function (params) {
                //     //跳出父框架（iframe）
                //     // window.parent.frames.location.href="../../templates/report/report3.html?type=DPYL"+"&index=92";
                //     window.parent.frames.location.href = "../../templates/all.html?url=/report/report3&type=DPYL";
                // });
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        barjump: function () {
            //跳出父框架（iframe）
            window.parent.frames.location.href = "../../templates/all.html?url=/report/report3&type=DPYL";
            //window.parent.frames.location.href="../../templates/report/report3.html?type=DPYL"+"&index=82";
        },
                 // top102排名柱状图
                 echarts112: function () {
                    var myBarChart = echarts.init(document.getElementById('top10Barzb'));
                    var categoryzb = [];
                    var data = [];
                    TopOption = {
                        // title: {
                        //     text: '预案总数排行(top10)',
                        //     left: 'center',
                        //     top: 2,
                        //     textStyle: {
                        //         color: '#ccc'
                        //     }
                        // },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: {
                            left: '20px',
                            right: '60px',
                            top: '5px',
                            bottom: '-10px',
                            containLabel: true
                        },
                        xAxis: {
                            show: false,
                            type: 'value',
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: 'white'
                                }
                            },
                            splitLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            }
                        },
                        yAxis: {
                            type: 'category',
                            // data: category,
                            data:  ['13       徐州', '12       南通', '11       泰州', ' 10    连云港','9       常州', '8       淮安', '7       无锡', '6       盐城', '5       宿迁', '4       扬州', '3       苏州', '2       镇江','1       南京'],
                            splitLine: {
                                show: false
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: '#e6e6e6'
                                }
                            },
                            axisLabel: {
                                inside: false
                            },
                            axisTick: {
                                show: false
                            },
                            z: 10,
                            nameTextStyle: {
                                fontSize: 15
                            }
                        },
                        series: [
                            {
                                name: '预案数量',
                                type: 'bar',
                                // data: data,
                                data: [ 262, 325, 512, 610, 632, 656, 715, 723, 792, 800, 813, 920,1149],
                                barWidth: 6,
                                barGap: 10,
                                smooth: true,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right',
                                        offset: [5, 0],
                                        textStyle: {
                                            color: function (params) {
                                                var colorList = ['#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#29bb9d', '#fdc107', '#ff6364'];
                                                return colorList[params.dataIndex];
                                            },
                                            fontSize: 13
                                        }
                                    }
                                },
                                itemStyle: {
                                    emphasis: {
                                        barBorderRadius: 7
                                    },
                                    normal: {
                                        barBorderRadius: 7,
                                        // 蓝色渐变
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 1, 0,
                                            [
                                                { offset: 0, color: '#3977E6' },
                                                { offset: 1, color: '#37BBF8' }
                                            ]
                                        ),
                                        // 彩虹颜色
                                        // color: function (params) {
                                        //     var colorList = ['#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#29bb9d', '#fdc107', '#ff6364'];
                                        //     return colorList[params.dataIndex];
                                        // }
                                    }
                                }
                            }
                        ]
                    };
                    var params = {
                        btype: 'top10'
                    }
                    axios.post('/dpapi/dp/getListByType', params).then(function (res) {
                        for (let i = 0; i < res.data.result.length; i++) {
                            const element = res.data.result[i];
                            const item = {
                                name: element.bname,
                                value: element.bvalue,
                            }
                            this.top102.push(item);
                        }
                        this.top102.sort(this.up);
                        for (var i = 0; i < this.top102.length; i++) {
                            categoryzb.push( i+1+"     "+this.top102[i].name);    //挨个取出类别并填入类别数组
                            data.push(this.top102[i].value);
                        }
                        myBarChart.setOption(TopOption);
                        myBarChart.on('click', function (params) {
                            //跳出父框架（iframe）
                            window.parent.frames.location.href = "../../templates/all.html?url=/report/report1&type=DPYL";
                            //window.parent.frames.location.href="../../templates/report/report1.html?type=DPYL"+"&index=81";
                        });
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                },
                 // top101排名柱状图
                 echarts111: function () {
                    var myBarChart = echarts.init(document.getElementById('top10Barza'));
                    var categoryza = [];
                    var data = [];
                    TopOption = {
                        // title: {
                        //     text: '预案总数排行(top10)',
                        //     left: 'center',
                        //     top: 2,
                        //     textStyle: {
                        //         color: '#ccc'
                        //     }
                        // },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: {
                            left: '20px',
                            right: '60px',
                            top: '5px',
                            bottom: '-10px',
                            containLabel: true
                        },
                        xAxis: {
                            show: false,
                            type: 'value',
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: 'white'
                                }
                            },
                            splitLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            }
                        },
                        yAxis: {
                            type: 'category',
                            // data: category,
                            data:  ['13       徐州', '12       南通', '11       泰州', ' 10    连云港','9       常州', '8       淮安', '7       无锡', '6       盐城', '5       宿迁', '4       扬州', '3       苏州', '2       镇江','1       南京'],
                            splitLine: {
                                show: false
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: '#e6e6e6'
                                }
                            },
                            axisLabel: {
                                inside: false
                            },
                            axisTick: {
                                show: false
                            },
                            z: 10,
                            nameTextStyle: {
                                fontSize: 15
                            }
                        },
                        series: [
                            {
                                name: '预案数量',
                                type: 'bar',
                                // data: data,
                                data: [ 212, 325, 512, 530, 612, 650, 705, 733, 792, 800, 813, 920,949],
                                barWidth: 6,
                                barGap: 10,
                                smooth: true,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right',
                                        offset: [5, 0],
                                        textStyle: {
                                            color: function (params) {
                                                var colorList = ['#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#29bb9d', '#fdc107', '#ff6364'];
                                                return colorList[params.dataIndex];
                                            },
                                            fontSize: 13
                                        }
                                    }
                                },
                                itemStyle: {
                                    emphasis: {
                                        barBorderRadius: 7
                                    },
                                    normal: {
                                        barBorderRadius: 7,
                                        // 蓝色渐变
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 1, 0,
                                            [
                                                { offset: 0, color: '#3977E6' },
                                                { offset: 1, color: '#37BBF8' }
                                            ]
                                        ),
                                        // 彩虹颜色
                                        // color: function (params) {
                                        //     var colorList = ['#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#29bb9d', '#fdc107', '#ff6364'];
                                        //     return colorList[params.dataIndex];
                                        // }
                                    }
                                }
                            }
                        ]
                    };
                    var params = {
                        btype: 'top10'
                    }
                    axios.post('/dpapi/dp/getListByType', params).then(function (res) {
                        for (let i = 0; i < res.data.result.length; i++) {
                            const element = res.data.result[i];
                            const item = {
                                name: element.bname,
                                value: element.bvalue,
                            }
                            this.top101.push(item);
                        }
                        this.top101.sort(this.up);
                        for (var i = 0; i < this.top101.length; i++) {
                            categoryza.push( i+1+"     "+this.top101[i].name);    //挨个取出类别并填入类别数组
                            data.push(this.top101[i].value);
                        }
                        myBarChart.setOption(TopOption);
                        myBarChart.on('click', function (params) {
                            //跳出父框架（iframe）
                            window.parent.frames.location.href = "../../templates/all.html?url=/report/report1&type=DPYL";
                            //window.parent.frames.location.href="../../templates/report/report1.html?type=DPYL"+"&index=81";
                        });
                    }.bind(this), function (error) {
                        console.log(error);
                    })
                },
         // top10排名柱状图
         echarts11: function () {
            var myBarChart = echarts.init(document.getElementById('top10Barz'));
            var category = [];
            var data = [];
            TopOption = {
                // title: {
                //     text: '预案总数排行(top10)',
                //     left: 'center',
                //     top: 2,
                //     textStyle: {
                //         color: '#ccc'
                //     }
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '20px',
                    right: '60px',
                    top: '5px',
                    bottom: '-10px',
                    containLabel: true
                },
                xAxis: {
                    show: false,
                    type: 'value',
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: 'white'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    // data: category,
                    data:  ['13       徐州', '12       南通', '11       泰州', ' 10    连云港','9       常州', '8       淮安', '7       无锡', '6       盐城', '5       宿迁', '4       扬州', '3       苏州', '2       镇江','1       南京'],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#e6e6e6'
                        }
                    },
                    axisLabel: {
                        inside: false
                    },
                    axisTick: {
                        show: false
                    },
                    z: 10,
                    nameTextStyle: {
                        fontSize: 15
                    }
                },
                series: [
                    {
                        name: '预案数量',
                        type: 'bar',
                        // data: data,
                        data: [ 212, 325, 512, 590, 612, 650, 705, 723, 792, 800, 813, 920,949],
                        barWidth: 6,
                        barGap: 10,
                        smooth: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                offset: [5, 0],
                                textStyle: {
                                    color: function (params) {
                                        var colorList = ['#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#29bb9d', '#fdc107', '#ff6364'];
                                        return colorList[params.dataIndex];
                                    },
                                    fontSize: 13
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                barBorderRadius: 7
                            },
                            normal: {
                                barBorderRadius: 7,
                                // 蓝色渐变
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 1, 0,
                                    [
                                        { offset: 0, color: '#3977E6' },
                                        { offset: 1, color: '#37BBF8' }
                                    ]
                                ),
                                // 彩虹颜色
                                // color: function (params) {
                                //     var colorList = ['#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#29bb9d', '#fdc107', '#ff6364'];
                                //     return colorList[params.dataIndex];
                                // }
                            }
                        }
                    }
                ]
            };
            var params = {
                btype: 'top10'
            }
            axios.post('/dpapi/dp/getListByType', params).then(function (res) {
                for (let i = 0; i < res.data.result.length; i++) {
                    const element = res.data.result[i];
                    const item = {
                        name: element.bname,
                        value: element.bvalue,
                    }
                    this.top10.push(item);
                }
                this.top10.sort(this.up);
                for (var i = 0; i < this.top10.length; i++) {
                    category.push( i+1+"     "+this.top10[i].name);    //挨个取出类别并填入类别数组
                    data.push(this.top10[i].value);
                }
                myBarChart.setOption(TopOption);
                myBarChart.on('click', function (params) {
                    //跳出父框架（iframe）
                    window.parent.frames.location.href = "../../templates/all.html?url=/report/report1&type=DPYL";
                    //window.parent.frames.location.href="../../templates/report/report1.html?type=DPYL"+"&index=81";
                });
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        // top10排名柱状图
        echarts52: function () {
            var myBarChartbbb = echarts.init(document.getElementById('top10Barb'));
            var categoryzb = [];
            var data = [];
            TopOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '20px',
                    right: '60px',
                    top: '5px',
                    bottom: '-10px',
                    containLabel: true
                },
                xAxis: {
                    show: false,
                    type: 'value',
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: 'white'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    data:  ['13       徐州             212                   56%', '12       南通             325                   57%', '11       泰州             512                   72%', ' 10    连云港             590                   69%','9       常州             612                   39%', '8       淮安             650                   72%', '7       无锡             705                   79%', '6       盐城             723                   36%', '5       宿迁             792                   56%', '4       扬州             800                   35%', '3       苏州             813                   21%', '2       镇江             920                   39%','1       南京             942                   49%'],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#e6e6e6'
                        }
                    },
                    axisLabel: {
                        inside: false
                    },
                    axisTick: {
                        show: false
                    },
                    z: 10,
                    nameTextStyle: {
                        fontSize: 15
                    }
                },
                series: [
                    {
                        name: '预案数量',
                        type: 'bar',
                        data: [ ],
                        barWidth: 1,
                        barGap: 10,
                        smooth: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                offset: [5, 0],
                                textStyle: {
                                    // color: function (params) {
                                    //     var colorList = ['#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#29bb9d', '#fdc107', '#ff6364'];
                                    //     return colorList[params.dataIndex];
                                    // },
                                    fontSize: 13
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                barBorderRadius: 7
                            },
                            normal: {
                                barBorderRadius: 7,
                                // color: function (params) {
                                //     var colorList = ['#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#29bb9d', '#fdc107', '#ff6364'];
                                //     return colorList[params.dataIndex];
                                // }
                            }
                        }
                    }
                ]
            };
            // var params = {
            //     btype: 'top10'
            // }
            // axios.post('/dpapi/dp/getListByType', params).then(function (res) {
            //     for (let i = 0; i < res.data.result.length; i++) {
            //         const elementz = res.data.result[i];
            //         const item = {
            //             name: elementz.bname,
            //             value: elementz.bvalue,
            //         }
            //         this.top11.push(item);
            //     }
            //     this.top11.sort(this.up);
            //     for (var i = 0; i < this.top11.length; i++) {
            //         categoryz.push(this.top11[i].name);    //挨个取出类别并填入类别数组
            //         data.push(this.top11[i].value);
            //     }
            //     myBarChart.setOption(TopOption);
            // }.bind(this), function (error) {
            //     console.log(error);
            // })
            myBarChartbbb.setOption(TopOption);
        },
                // top10排名柱状图
                echarts51: function () {
                    var myBarChartaaa = echarts.init(document.getElementById('top10Bara'));
                    var categoryza = [];
                    var data = [];
                    TopOption = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: {
                            left: '20px',
                            right: '60px',
                            top: '5px',
                            bottom: '-10px',
                            containLabel: true
                        },
                        xAxis: {
                            show: false,
                            type: 'value',
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: 'white'
                                }
                            },
                            splitLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            }
                        },
                        yAxis: {
                            type: 'category',
                            data:  ['13       徐州             212                   56%', '12       南通             325                   57%', '11       泰州             512                   72%', ' 10    连云港             590                   69%','9       常州             612                   39%', '8       淮安             650                   72%', '7       无锡             705                   79%', '6       盐城             723                   36%', '5       宿迁             792                   56%', '4       扬州             800                   35%', '3       苏州             813                   21%', '2       镇江             920                   39%','1       南京             942                   49%'],
                            splitLine: {
                                show: false
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: '#e6e6e6'
                                }
                            },
                            axisLabel: {
                                inside: false
                            },
                            axisTick: {
                                show: false
                            },
                            z: 10,
                            nameTextStyle: {
                                fontSize: 15
                            }
                        },
                        series: [
                            {
                                name: '预案数量',
                                type: 'bar',
                                data: [ ],
                                barWidth: 1,
                                barGap: 10,
                                smooth: true,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right',
                                        offset: [5, 0],
                                        textStyle: {
                                            fontSize: 13
                                        }
                                    }
                                },
                                itemStyle: {
                                    emphasis: {
                                        barBorderRadius: 7
                                    },
                                    normal: {
                                        barBorderRadius: 7,
                                    }
                                }
                            }
                        ]
                    };
                    // var params = {
                    //     btype: 'top10'
                    // }
                    // axios.post('/dpapi/dp/getListByType', params).then(function (res) {
                    //     for (let i = 0; i < res.data.result.length; i++) {
                    //         const elementz = res.data.result[i];
                    //         const item = {
                    //             name: elementz.bname,
                    //             value: elementz.bvalue,
                    //         }
                    //         this.top11.push(item);
                    //     }
                    //     this.top11.sort(this.up);
                    //     for (var i = 0; i < this.top11.length; i++) {
                    //         categoryz.push(this.top11[i].name);    //挨个取出类别并填入类别数组
                    //         data.push(this.top11[i].value);
                    //     }
                    //     myBarChart.setOption(TopOption);
                    // }.bind(this), function (error) {
                    //     console.log(error);
                    // })
                    myBarChartaaa.setOption(TopOption);
                },
        // top10排名柱状图
        echarts5: function () {
            var myBarChart = echarts.init(document.getElementById('top10Bar'));
            var categoryz = [];
            var data = [];
            TopOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '20px',
                    right: '60px',
                    top: '5px',
                    bottom: '-10px',
                    containLabel: true
                },
                xAxis: {
                    show: false,
                    type: 'value',
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: 'white'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    data:  ['13       徐州             212                   56%', '12       南通             325                   57%', '11       泰州             512                   72%', ' 10    连云港             590                   69%','9       常州             612                   39%', '8       淮安             650                   72%', '7       无锡             705                   79%', '6       盐城             723                   36%', '5       宿迁             792                   56%', '4       扬州             800                   35%', '3       苏州             813                   21%', '2       镇江             920                   39%','1       南京             942                   49%'],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#e6e6e6'
                        }
                    },
                    axisLabel: {
                        inside: false
                    },
                    axisTick: {
                        show: false
                    },
                    z: 10,
                    nameTextStyle: {
                        fontSize: 15
                    }
                },
                series: [
                    {
                        name: '预案数量',
                        type: 'bar',
                        data: [ ],
                        barWidth: 1,
                        barGap: 10,
                        smooth: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                offset: [5, 0],
                                textStyle: {
                                    // color: function (params) {
                                    //     var colorList = ['#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#29bb9d', '#fdc107', '#ff6364'];
                                    //     return colorList[params.dataIndex];
                                    // },
                                    fontSize: 13
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                barBorderRadius: 7
                            },
                            normal: {
                                barBorderRadius: 7,
                                // color: function (params) {
                                //     var colorList = ['#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#e6e6e6', '#29bb9d', '#fdc107', '#ff6364'];
                                //     return colorList[params.dataIndex];
                                // }
                            }
                        }
                    }
                ]
            };
            // var params = {
            //     btype: 'top10'
            // }
            // axios.post('/dpapi/dp/getListByType', params).then(function (res) {
            //     for (let i = 0; i < res.data.result.length; i++) {
            //         const elementz = res.data.result[i];
            //         const item = {
            //             name: elementz.bname,
            //             value: elementz.bvalue,
            //         }
            //         this.top11.push(item);
            //     }
            //     this.top11.sort(this.up);
            //     for (var i = 0; i < this.top11.length; i++) {
            //         categoryz.push(this.top11[i].name);    //挨个取出类别并填入类别数组
            //         data.push(this.top11[i].value);
            //     }
            //     myBarChart.setOption(TopOption);
            // }.bind(this), function (error) {
            //     console.log(error);
            // })
            myBarChart.setOption(TopOption);
        },

        //待审核
        scrollDsh: function () {
            
            var params = {
                btype: 'dsh'
            }
            axios.post('/dpapi/dp/getListByType', params).then(function (res) {
              
                for (let i = 0; i < res.data.result.length; i++) {
                    const element = res.data.result[i];
                    const item = {
                        name: element.bname,
                        value: element.bvalue,
                    }
                    this.scrollData_DSH.push(item);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //待更新
        scrollDgx: function () {
            var params = {
                btype: 'dgx'
            }
            axios.post('/dpapi/dp/getListByType', params).then(function (res) {
                for (let i = 0; i < res.data.result.length; i++) {
                    const element = res.data.result[i];
                    const item = {
                        name: element.bname,
                        value: element.bvalue,
                    }
                    this.scrollData_DGX.push(item);
                }
            }.bind(this), function (error) {
                console.log(error);
            })
        },

        top10jump: function () {
            //跳出父框架（iframe）
            window.parent.frames.location.href = "../../templates/all.html?url=/report/report1&type=DPYL";
            // window.parent.frames.location.href="../../templates/report/report1.html?type=DPYL"+"&index=81";
        },
        // top10 json串排序
        up: function (x, y) {
            return x.value - y.value
        },
        loadChart: function () {
            window.open("../../templates/bigscreen/big_screen_map_pro.html?city=" + "江苏总队");
        },
        autoAdd: function () {
            this.szhya++
            this.zddw++
            this.jzxx++
            this.xfdz++
        },
        getOrder: function (Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.round(Rand * Range);
            return num;
        },
        // 左下列表跳转预案审核
        jump: function () {
            //跳出父框架（iframe）
            window.parent.frames.location.href = "../../templates/all.html?url=/digitalplan/digitalplan_approve&type=DPYL";
            //window.parent.frames.location.href="../../templates/digitalplan/digitalplan_approve.html?type=DPYL"+"&index=34";
        },
        //跳到地图
        jumpmap: function () {
            //跳出父框架（iframe）
            window.parent.frames.location.href = "../../templates/bigscreen/big_screen_map_pro.html";
            //window.parent.frames.location.href="../../templates/digitalplan/digitalplan_approve.html?type=DPYL"+"&index=34";
        },
        changeTab: function (index) {
            var tabs = document.getElementById('tab-head').getElementsByTagName('h5');
            for (var i = 0, len = tabs.length; i < len; i++) {
                if (i === index) {
                    tabs[i].className = 'selected';
                } else {
                    tabs[i].className = '';
                }
            }
            if (index == 0) {
                this.isDSH = true;
                this.isDGX = false;
            } else if (index == 1) {
                this.isDSH = false;
                this.isDGX = true;
            }
        }
    }
})

