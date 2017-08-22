import $ from 'jquery';
import echarts from "echarts";

class P2Chart2{
	constructor(dom) {
		this.myChart = echarts.init(dom);

		this.option = {
			grid:{
				left:'3%',
				right:'0%',
				top:'20%',
				bottom:'10%',
			},
			legend:{
				right:20,
				top:20,
				data:[],
				itemWidth:37,
				itemHeight:14,
				textStyle:{
					color:'#ccd7e3',
					fontSize:20
				}
			},
			xAxis:{
				type:'category',
				axisLine: {
		    		lineStyle: {
		    			color: '#00dcff'
		    		}
		    	},
		    	axisTick: {
		    		lineStyle: {
		    			color: '#ffe600',
		    			width: 3
		    		},
		    		length: 3,
		    		alignWithLabel: true,
		    		boundaryGap: true
		    	},
		    	axisLabel: {
		    		textStyle: {
		    			color: '#8ef3ff',
		    			fontSize: 20,
		    			fontFamily: 'DIN MEDIUM'
		    		}
		    	},
		    	data:[]
			},
			yAxis:{
				name:'千吨/日  ',
				nameTextStyle:{
					color:'#ccd7e3',
					fontSize:20
				},
				nameGap:20,
				axisLine: {
		    		lineStyle: {
		    			color: '#00dcff'
		    		}
		    	},
		    	axisTick: {
		    		lineStyle: {
		    			color: '#ffe600',
		    			width: 3
		    		},
		    		length: 3
		    	},
		    	axisLabel: {
		    		textStyle: {
		    			color: '#8ef3ff',
		    			fontSize: 20,
		    			fontFamily: 'DIN MEDIUM'
		    		}
		    	},
		    	splitLine: {
		    		show: true,
		    		lineStyle: {
		    			color: 'rgba(80, 167, 189, 0.3)'
		    		}
		    	}
			},
			series:[]
		}
	}

	setConfig(value) {
		this._config = value;
	}

	setDataProvider(value) {
		this._dataProvider = value;
		this.creationContent();
	}

	creationContent() {
		let xAxisJson = {};
		for (let i = 0; i < this._dataProvider.length; i++) {
			let lJson = {
				name:this._dataProvider[i].seriesName,
				icon:'image://imgs/p2/icon'+(i+1)+'.png'
			}
			this.option.legend.data.push(lJson);

			let json = {};

			if (i === 0) {
				json = {
					type:'bar',
					name:this._dataProvider[i].seriesName,
					data:[],
					barMaxWidth:60,
					itemStyle:{
						normal:{
							color:'#0a9fff'
						},
						emphasis:{
							color:'#00eaff'
						}
					},
					legendHoverLink:false,
					label:{
						normal:{
							show:true,
							position:'top',
							textStyle:{
								color:'#fff',
								fontFamily:'DIN MEDIUM',
								fontSize:24
							}
						}
					}
				}
			}else if (i === 1) {
				json = {
					type:'line',
					name:this._dataProvider[i].seriesName,
					data:[],
					legendHoverLink:false,
					symbol:'image://imgs/p2/linenode.png',
					symbolSize:35,
					lineStyle:{
						normal:{
							color:'#ff6600'
						}
					}
				}
			}
			for (let j = 0; j < this._dataProvider[i].dataList.length; j++) {
				json.data.push(this._dataProvider[i].dataList[j].value)
				xAxisJson[this._dataProvider[i].dataList[j].name] = 1;
			}
			this.option.series.push(json);
		}
		for (let key in xAxisJson) {
			this.option.xAxis.data.push(key);
		}
		this.myChart.setOption(this.option);
	}
}
module.exports = P2Chart2;