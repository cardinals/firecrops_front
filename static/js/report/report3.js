var vue = new Vue({
	el: "#app",
	data: function () {
		return {
			//页面获取的uuid
			uuid: "",
			//搜索表单
			searchForm: {
				dateStart: "",
				dateEnd: "",
			},
			//barData
			barData: {
				name: ['化危品火灾爆炸', '建筑堆场类', '交通运输类', '危化品泄露事故', '交通事故',
					'建筑物坍塌事故', '自然灾害事故', '公共突发事件', '群众遇险事件', '群众求助救援'],
				value: [935, 535, 814, 232, 851, 332, 235, 156, 72, 74],
			},
			//pieTitle
			pieTitle: '',
			pieTitle0: '各类型预案数量比例图',
			pieTitle1: '化危品火灾爆炸',
			pieTitle2: '建筑堆场类',
			pieTitle3: '交通运输类',
			pieTitle4: '危化品泄露事故',
			pieTitle5: '交通事故',
			pieTitle6: '建筑物坍塌事故',
			pieTitle7: '自然灾害事故',
			pieTitle8: '公共突发事件',
			pieTitle9: '群众遇险事件',
			pieTitle10: '群众求助救援',
			//pieData
			pieData: [],
			pieData0: [
				{ value: 400, name: '化危品火灾爆炸' },
				{ value: 310, name: '建筑堆场类' },
				{ value: 204, name: '交通运输类' },
				{ value: 175, name: '危化品泄露事故' },
				{ value: 120, name: '交通事故' },
				{ value: 400, name: '建筑物坍塌事故' },
				{ value: 310, name: '自然灾害事故' },
				{ value: 204, name: '公共突发事件' },
				{ value: 175, name: '群众遇险事件' },
				{ value: 90, name: '群众求助救援' }
			],
			pieData1: [
				{ value: 400, name: '爆炸' },
				{ value: 215, name: '可燃气体' },
				{ value: 124, name: '易燃液体' },
				{ value: 524, name: '易燃固体、自燃物品和遇湿易燃物品' },
				{ value: 221, name: '氧化剂和有机过氧化物' }
			],
			pieData2: [
				{ value: 400, name: '高层建筑' },
				{ value: 310, name: '人员密集场所' },
				{ value: 204, name: '地下建筑、隧道' },
				{ value: 175, name: '古建筑' },
				{ value: 124, name: '堆垛仓库' }
			],
			pieData3: [
				{ value: 400, name: '机动车' },
				{ value: 310, name: '列车' },
				{ value: 204, name: '船舶' },
				{ value: 175, name: '飞行器' },
				{ value: 120, name: '城市轨道交通工具' }
			],
			pieData4: [
				{ value: 90, name: '危险化学品泄漏事故' }
			],
			pieData5: [
				{ value: 400, name: '交通事故' }
			],
			pieData6: [
				{ value: 204, name: '建筑物垮塌事故' }
			],
			pieData7: [
				{ value: 270, name: '洪涝' },
				{ value: 120, name: '地震' },
				{ value: 123, name: '台风' },
				{ value: 51, name: '海啸' },
				{ value: 14, name: '雪灾' },
				{ value: 152, name: '地质灾害' }
			],
			pieData8: [
				{ value: 120, name: '恐怖袭击' },
				{ value: 204, name: '群体性治安事件' },
				{ value: 90, name: '重大环境污染' },
				{ value: 175, name: '公共卫生事件' },
				{ value: 120, name: '城市给水管网爆裂' }
			],
			pieData9: [
				{ value: 400, name: '群众遇险事件' }
			],
			pieData10: [
				{ value: 400, name: '群众求助救援' }
			],
			//tabledata
			tabledata: [
				{ name: '化危品火灾爆炸', childrenName: '爆炸', count: '2999', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '化危品火灾爆炸', childrenName: '可燃气体', count: '1142', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '化危品火灾爆炸', childrenName: '易燃液体', count: '1218', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '化危品火灾爆炸', childrenName: '易燃固体、自燃物品和遇湿易燃物品', count: '1021', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '化危品火灾爆炸', childrenName: '氧化剂和有机过氧化物', count: '1455', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '建筑堆场类', childrenName: '高层建筑', count: '2751', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '建筑堆场类', childrenName: '人员密集场所', count: '2751', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '建筑堆场类', childrenName: '地下建筑、隧道', count: '2751', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '建筑堆场类', childrenName: '古建筑', count: '2751', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '建筑堆场类', childrenName: '堆垛仓库', count: '2751', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '交通运输类', childrenName: '机动车', count: '1313', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '交通运输类', childrenName: '列车', count: '2999', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '交通运输类', childrenName: '船舶', count: '1142', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '交通运输类', childrenName: '飞行器', count: '1218', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '交通运输类', childrenName: '城市轨道交通工具', count: '1218', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '危化品泄露事故', childrenName: '危险化学品泄漏事故', count: '1021', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '交通事故', childrenName: '交通事故', count: '1455', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '建筑物坍塌事故', childrenName: '建筑物垮塌事故', count: '2751', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '自然灾害事故', childrenName: '洪涝', count: '2999', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '自然灾害事故', childrenName: '地震', count: '1142', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '自然灾害事故', childrenName: '台风', count: '1218', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '自然灾害事故', childrenName: '海啸', count: '1021', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '自然灾害事故', childrenName: '雪灾', count: '1455', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '自然灾害事故', childrenName: '地质灾害', count: '1455', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '公共突发事件', childrenName: '恐怖袭击', count: '1919', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '公共突发事件', childrenName: '群体性治安事件', count: '1299', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '公共突发事件', childrenName: '重大环境污染', count: '1299', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '公共突发事件', childrenName: '公共卫生事件', count: '1299', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '公共突发事件', childrenName: '城市给水管网爆裂', count: '1999', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '群众遇险事件', childrenName: '群众遇险事件', count: '2751', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' },
				{ name: '群众求助救援', childrenName: '群众求助救援', count: '1313', buju: '99', zongdui: '400', zhidui: '500', dazhongdui: '2000' }
			],
			//表高度变量
			tableheight: 482,//多选值
			multipleSelection: [],
			//当前页
			currentPage: 1,
			//分页大小
			pageSize: 10,
			//总记录数
			total: 31,
			//行数据保存
			rowdata: {

			},
			//序号
			indexData: 0,
			//显示加载中样
			loading: false,
			labelPosition: 'right',
		}
	},
	mounted: function () {
		this.barChart();
		this.pieData=this.pieData0;
		this.pieTitle=this.pieTitle0;
		this.pieChart();
	},
	created: function () {
		/**菜单选中 by li.xue 20180628*/
		//$("#activeIndex").val(getQueryString("index"));
		/**面包屑 by li.xue 20180628*/
		var type = getQueryString("type");
		if (type == "DPYL") {
			loadBreadcrumb("统计分析", "各类型预案数量统计页面");
		} else {
			loadBreadcrumb("各类型预案数量统计页面", '-1');
		}
	},
	methods: {
		// 左侧柱状图
		barChart: function () {
			var myChart = echarts.init(document.getElementById('bar'));
			option = {
				title: {
					text: '各类型预案数量柱状图',
					x: 'center'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					top: '30',
					bottom: '10',
					left: '15',
					right: '40',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: this.barData.name,
						axisLabel: {
							interval: 0,
							/*
							formatter:function(value)  
							{  
							   return value.split("").join("\n");  
							},
							*/
							rotate: "45"
						},
					}
				],
				yAxis: [
					{
						type: 'value',
						splitLine: {
							show: false
						},
					}
				],
				series: [
					{
						name: '预案数量',
						type: 'bar',
						barWidth: '100%',
						stack: '预案',
						barWidth: '16',
						data: this.barData.value,
						smooth: true,
						itemStyle: {
							normal: {
								// 绿+蓝
								color: function (params) {
									var colorList = ['#29bb9d', '#556ca6', '#29bb9d', '#556ca6', '#29bb9d', '#556ca6', '#29bb9d', '#556ca6', '#29bb9d', '#556ca6'];
									return colorList[params.dataIndex];
								}
							}
						}
					}
				]
			};
			myChart.on('click', function (param) {
				var index = param.dataIndex + 1;
				vm.pieData = eval("vm.pieData" + index);
				vm.pieTitle = eval("vm.pieTitle" + index);
				var pieChart = echarts.getInstanceByDom(document.getElementById("pie"));
				if (pieChart != null && pieChart != "" && pieChart != undefined) {
					pieChart.dispose();
				}
				vm.pieChart();
			});
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
		// 右侧玫瑰图
		pieChart: function () {
			var myChart = echarts.init(document.getElementById('pie'));
			var option = {
				title: {
					text: this.pieTitle,
					left: 'center',
					top: 2,
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					x: '68%',
					y: 'center',
					// padding: [
					// 	0,  // 上
					// 	40, // 右
					// 	0,  // 下
					// 	0, // 左
					// ],
					itemGap: 16,
					itemWidth: 18,
					data: this.pieData.name,
					align: 'left',
					itemGap: 8,
				},
				series: [
					{
						name: this.pieTitle,
						type: 'pie',
						radius: '55%',
						center: ['35%', '50%'],
						data: this.pieData
							.sort(function (a, b) { return a.value - b.value; }),
						roseType: 'radius',
						label: {
							show: true,
							// position: 'inside',
							formatter: '{d}%',
						},
						labelLine: {
							show: true,
							length: 5
						},
						animationType: 'scale',
						animationEasing: 'elasticOut',
						animationDelay: function (idx) {
							return Math.random() * 200;
						}
					}
				]
			};
			myChart.setOption(option);
		},
		refresh: function () {
			this.pieData=this.pieData0;
			this.pieTitle=this.pieTitle0;
			var pieChart = echarts.getInstanceByDom(document.getElementById("pie"));
			pieChart.dispose();
			this.pieChart();
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
		//当前页修改事件
		currentPageChange: function (val) {
			this.currentPage = val;
			var _self = this;
			_self.loadingData(); //重新加载数据
		},
		//根据参数部分和参数名来获取参数值 
		GetQueryString: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]); return null;
		},
	}
})
