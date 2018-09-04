var vm = new Vue({
    el: "#app",
    data: {
        syncState: {
            fwjdsl: '29',
            gzjdsl: '2',
            jrxtsl: '4',
            sjjksl: '31'
        },
        provincesData: {
            beijing: '0',
            tianjin: '0',
            hebei: '0',
            shanxi: '0',
            neimenggu: '0',
            liaoning: '0',
            jilin: '0',
            heilongjiang: '0',
            shanghai: '0',
            jiangsu: '0',
            zhejiang: '0',
            anhui: '0',
            fujian: '0',
            jiangxi: '0',
            shandong: '0',
            henan: '0',
            hubei: '0',
            hunan: '0',
            guangdong: '0',
            guangxi: '0',
            hainan: '0',
            chongqing: '0',
            sichuan: '0',
            guizhou: '0',
            yunnan: '0',
            xizang: '0',
            shaanxi: '0',
            gansu: '0',
            qinghai: '0',
            ningxia: '0',
            xinjiang: '0'
        },
        b1data:[
            {value:400, name:'氧化剂和有机过氧化物'},
            {value:310, name:'自燃物品和遇温易燃物品'},
            {value:204, name:'易燃固体'},
            {value:175, name:'易燃液体'},
            {value:120, name:'爆炸'},
            {value:90, name:'可燃气体'}
        ],
        b2data:[
            {value:270, name:'隧道'},
            {value:240, name:'人员密集场所'},
            {value:204, name:'堆垛仓库'},
            {value:175, name:'古建筑'},
            {value:120, name:'地下建筑'},
            {value:100, name:'高层建筑'}
        ],
        b3data:[
            {value:270, name:'飞行器'},
            {value:240, name:'城市轨道交通工具'},
            {value:204, name:'船舶'},
            {value:175, name:'机动车'},
            {value:120, name:'列车'}
        ],
        b4data:[
            {value:180, name:'雪灾'},
            {value:240, name:'海啸'},
            {value:204, name:'台风'},
            {value:270, name:'地震'},
            {value:120, name:'洪涝'},
            {value:100, name:'地质灾害'}
        ],
        b5data:[
            {value:140, name:'城市给水管网爆裂'},
            {value:200, name:'公共卫生事件'},
            {value:130, name:'重大环境污染'},
            {value:230, name:'群体性治安事件'},
            {value:100, name:'恐怖袭击'}
        ],
        YALXdata:['卡片预案', '二维预案', '三维预案'],
        t2data:[
            '化危品火灾爆炸',
            '建筑堆场类',
            '交通运输类',
            '危险化学品泄漏事故',
            '交通事故',
            '建筑物垮塌事故',
            '自然灾害事故',
            '公共突发事件',
            '群众遇险事件',
            '群众求助救援'
        ]
    },
    methods: {  
        b1PieChart:function () {
            var b1PieChart = echarts.init(document.getElementById('b1'));
            var b1option = {
                backgroundColor:'rgba(255, 255, 255, 0.1)',
                title: {
                    text: '化危品火灾爆炸',
                    left: 'center',
                    top: 2,
                    textStyle: {
                        color: '#ccc'
                    }
                },
            
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
            
                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                        colorLightness: [0, 1]
                    }
                },
                series : [
                    {
                        name:'化危品火灾爆炸',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data: this.b1data
                        .sort(function (a, b) { return a.value - b.value; }),
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#c23531',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
            
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
                
            };
            b1PieChart.setOption(b1option);
        },
        b2PieChart:function () {
            var b2PieChart = echarts.init(document.getElementById('b2'));
            var b2option = {
                backgroundColor:'rgba(255, 255, 255, 0.1)',
                title: {
                    text: '建筑堆场类',
                    left: 'center',
                    top: 2,
                    textStyle: {
                        color: '#ccc'
                    }
                },
            
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
            
                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                        colorLightness: [0, 1]
                    }
                },
                series : [
                    {
                        name:'建筑堆场类',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data: this.b2data
                        .sort(function (a, b) { return a.value - b.value; }),
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#c23531',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
            
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
                
            };
            b2PieChart.setOption(b2option);
        },
        b3PieChart:function () {
            var b3PieChart = echarts.init(document.getElementById('b3'));
            var b3option = {
                backgroundColor:'rgba(255, 255, 255, 0.1)',
                title: {
                    text: '交通运输类',
                    left: 'center',
                    top: 2,
                    textStyle: {
                        color: '#ccc'
                    }
                },
            
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
            
                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                        colorLightness: [0, 1]
                    }
                },
                series : [
                    {
                        name:'交通运输类',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data: this.b3data
                        .sort(function (a, b) { return a.value - b.value; }),
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#c23531',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
            
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
                
            };
            b3PieChart.setOption(b3option);
        },
        b4PieChart:function () {
            var b4PieChart = echarts.init(document.getElementById('b4'));
            var b4option = {
                backgroundColor:'rgba(255, 255, 255, 0.1)',
                title: {
                    text: '自然灾害事故',
                    left: 'center',
                    top: 2,
                    textStyle: {
                        color: '#ccc'
                    }
                },
            
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
            
                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                        colorLightness: [0, 1]
                    }
                },
                series : [
                    {
                        name:'自然灾害事故',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data: this.b4data
                        .sort(function (a, b) { return a.value - b.value; }),
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#c23531',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
            
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
                
            };
            b4PieChart.setOption(b4option);
        },
        b5PieChart:function () {
            var b5PieChart = echarts.init(document.getElementById('b5'));
            var b5option = {
                backgroundColor:'rgba(255, 255, 255, 0.1)',
                title: {
                    text: '公共突发事件',
                    left: 'center',
                    top: 2,
                    textStyle: {
                        color: '#ccc'
                    }
                },
            
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
            
                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                        colorLightness: [0, 1]
                    }
                },
                series : [
                    {
                        name:'公共突发事件',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data: this.b5data
                        .sort(function (a, b) { return a.value - b.value; }),
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#c23531',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
            
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
                
            };
            b5PieChart.setOption(b5option);
        },
        t2BarChart: function () {
            var t2BarChart = echarts.init(document.getElementById('t2'));
            t2BarChartOption = {
                backgroundColor:'rgba(255, 255, 255, 0.1)',
                title: {
                    text: '按预案类型统计灭火预案情况',
                    left: 'center',
                    top: 2,
                    textStyle: {
                        color: '#ccc'
                    }   
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                color: ['#eecd0f', '#0fee6c', '#0f82ee'],
                legend: {
                    x: 'center',
                    y: '15%',
                    itemWidth: 18,
                    data: this.YALXdata,
                    textStyle: {
                        color: 'white'
                    }
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '25%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.t2data,
                        axisLine: {
                            lineStyle: {
                                color: 'white'
                            }
                        },
                        axisLabel : {//坐标轴刻度标签的相关设置。
                            interval:0,
                            rotate:"45"
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: 'white'
                            }
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '卡片预案',
                        type: 'bar',
                        barWidth: '40%',
                        stack: '预案',
                        data: [1335,335,555,134,753,877,333,234,653,127]
                    },
                    {
                        name: '二维预案',
                        type: 'bar',
                        barWidth: '40%',
                        stack: '预案',
                        data: [756,1321,856,746,987,365,468,952,234,1212]
                    },
                    {
                        name: '三维预案',
                        type: 'bar',
                        barWidth: '40%',
                        stack: '预案',
                        data: [893,746,233,134,763,961,257,886,121,376]
                    }
                ]
            };
        
            t2BarChart.setOption(t2BarChartOption);
        },
        t1FunnelChart: function () {
            var t1FunnelChart = echarts.init(document.getElementById('t1'));   
            t1FunnelChartOption = {
                backgroundColor:'rgba(255, 255, 255, 0.1)',
                title: {
                    text: '按预案类型统计灭火预案情况',
                    left: 'center',
                    textStyle: {
                        color: '#ccc'
                    }  
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}%"
                },
                
                legend: {
                    x: 'center',
                    y: '15%',
                    show:false,
                    itemWidth: 18,
                    data: this.t2data,
                    textStyle: {
                        color: 'white'
                    }
                },
                calculable: true,
                series: [
                    {
                        name:'按预案类型统计灭火预案情况',
                        type:'funnel',
                        left: '10%',
                        top: 60,
                        //x2: 80,
                        bottom: 60,
                        width: '80%',
                        // height: {totalHeight} - y - y2,
                        min: 0,
                        max: 100,
                        minSize: '0%',
                        maxSize: '100%',
                        sort: 'descending',
                        gap: 2,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            },
                            emphasis: {
                                textStyle: {
                                    fontSize: 20
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 10,
                                lineStyle: {
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        },
                        data: [
                            {value: 60, name: '化危品火灾爆炸'},
                            {value: 40, name: '建筑堆场类'},
                            {value: 20, name: '交通运输类'},
                            {value: 80, name: '危险化学品泄漏事故'},
                            {value: 100, name: '交通事故'},
                            {value: 60, name: '建筑物垮塌事故'},
                            {value: 40, name: '自然灾害事故'},
                            {value: 20, name: '公共突发事件'},
                            {value: 80, name: '群众遇险事件'},
                            {value: 100, name: '群众求助救援'}
                        ]
                    }
                ]
            };
        
            t1FunnelChart.setOption(t1FunnelChartOption);
        }
    },
    mounted: function () {
        // this.b1PieChart();
        // this.b2PieChart();
        // this.b3PieChart();
        // this.b4PieChart();
        // this.b5PieChart();
        // this.t2BarChart();
        // this.t1FunnelChart();
    }

})
window.setTimeout(() => {
    $("#cbody").show();
}, 1000);
