<template>
  <div id="userAllData_body">
        <Breadcrumb class="Breadcrumb">
            <BreadcrumbItem>整体数据</BreadcrumbItem>
        </Breadcrumb>
      <div id="userAllData_head">
        <div class="userAllData_head_time" v-if="cityType === 1">
            <span>时间:</span>
            <DatePicker v-model="time" :clearable='clearable' @on-change='timeChange' type="date" :options='options' placeholder="选择日期" style="width: 216px;"></DatePicker>
            <span>*查询数据的截止日期</span>
        </div>
        <div class="userAllData_head_time2" v-else>
            <span>时间:</span>
            <!-- <button @click="handleClick" myId='1'>今日</button> -->
            <button @click="handleClick" myId='2'>昨日</button>
            <button class="active" @click="handleClick" myId='3'>近7日</button>
            <button @click="handleClick" myId='4'>近30天</button>
            <button @click="handleClick" myId='5'>指定时间段</button>    
        </div>
        <div class="timeSelectShow" v-show="timeSelectShow">
            <DatePicker type="daterange" v-model="timeLine" :options='options' placeholder="选择日期" style="width: 216px; vertical-align: top;"></DatePicker>
            <div class="search"><button @click="searchByTimeLine">查询</button></div>
        </div>
        <div v-if="cityType === 1">
            <city-select></city-select>
        </div>
        <div v-else>
        </div>
      </div>

      <div class="userAllData_table">
        <Spin fix size="large" v-if="spinShow"  class="spin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load" style="color: #ccc;"></Icon>
            <div style="color: #ccc; text-indent: 5px;">  loading...</div>
        </Spin>
        <div class="help">
            <Poptip trigger="hover" style="float: right;"  placement="left" title="数据项说明" content="提示内容" :transfer='transfer'>
                <span>?</span>
                <div class="content" slot="content">
                    <p><b>累计用户:</b>累计到查询日期的注册用户数</p>
                    <p><b>押金用户(累计):</b>累计用户中当前押金大于0的用户</p>
                    <p><b>日活跃用户:</b>所选日期当日有过一次有效订单的用户数</p>
                    <p><b>日活跃用户率:</b>日活跃用户/累计用户</p>
                    <p><b>月活跃用户:</b>包括所选日期在内的近30天中，有过3次以上有效订单的用户数</p>
                    <p><b>月活跃用户率:</b>月活跃用户/累计用户</p>
                    <p><b>仅注册用户(累计):</b>累计用户中仅注册，没有成功缴纳过押金的用户</p>
                    <p><b>已退押金用户(累计):</b>累计用户中，缴纳过押金，且查询时押金为0的用户</p>
                </div>
            </Poptip>
        </div>
         <div class="spieceTablePar" >
            <Table  class="spieceTable"  border size='small' :no-data-text='noDataTextSpace' :columns="cityType === 1?columns_orderData:columns_orderData2" :data="[]"></Table>           
         </div>
         <div class="relTab">
            <Table  border size='small' :no-data-text='noDataText' :columns="cityType === 1?columns_orderData:columns_orderData2" :data="orderData"></Table>
         </div>
        <Page :total="totalListNum" show-sizer show-elevator  :styles='page' placement="top" :current='currentPage' v-show="pageShow"  @on-change="handleCurrentPage" @on-page-size-change="handlePageSize" show-sizer :page-size="pageSize" :page-size-opts='pageSizeOpts'></Page>
      </div>

      <div class="userAllData_chart" v-show="noDataBox">
            <Spin fix size="large" v-if="spinShow2"  class="spin">
                <Icon type="load-c" size=18 class="demo-spin-icon-load" style="color: #ccc;"></Icon>
                <div style="color: #ccc; text-indent: 5px;">  loading...</div>
            </Spin>
            <div id="userAllDataChart" style="min-width:400px; height: 400px;"></div>
      </div>
  </div>
</template>
<style lang='scss' scoped type="text/css">
 div.spieceTablePar{
        position: absolute;left: 10px;top: 33px;z-index: 99;width:calc(100% - 20px);height:58px;}
#userAllData_body {
  background: #ececec;
  .Breadcrumb {
    width: 100%;
    height: 30px;
    font-size: 16px;
    line-height: 30px;
  }
  .Breadcrumb2 {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #797979;
    padding-left: 10px;
    font-size: 18px;
    font-weight: bolder;
    span {
      color: #fff;
    }
  }
  #userAllData_head {
    -moz-box-shadow: 3px 4px 6px rgba(51, 51, 51, 0.43);
    -webkit-box-shadow: 3px 4px 6px rgba(51, 51, 51, 0.43);
    box-shadow: 3px 4px 6px rgba(51, 51, 51, 0.43);
    font-size: 14px;
    background: #fff;
    padding: 12px 10px 0 10px;
    overflow: hidden;
    position: relative;
    div.userAllData_head_time {
      margin-bottom: 10px;
      font-size: 13px;
      span:nth-of-type(1) {
        margin-right: 12px;
      }
      button {
        width: 80px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        display: inline-block;
        background: #fff;
        border: 1px solid #dddee1;
        border-radius: 4px;
        text-align: center;
        color: #565c6b;
        outline: none;
        margin-right: 10px;
      }
      button:nth-last-of-type(1) {
        width: 80px;
      }
      button.active {
        border: 1px solid orange;
        color: orange;
      }
      span:nth-of-type(2) {
        color: #ccc;
        margin-left: 10px;
        font-size: 13px;
      }
    }
    div.userAllData_head_time2 {
      margin-bottom: 10px;
      font-size: 13px;
      span:nth-of-type(1) {
        margin-right: 12px;
      }
      button {
        width: 80px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        display: inline-block;
        background: #fff;
        border: 1px solid #dddee1;
        border-radius: 4px;
        text-align: center;
        color: #565c6b;
        outline: none;
        margin-right: 10px;
      }
      button:nth-last-of-type(1) {
        width: 80px;
      }
      button.active {
        border: 1px solid orange;
        color: orange;
      }
      span:nth-of-type(2) {
        color: #ccc;
        margin-left: 10px;
        font-size: 13px;
      }
    }
    div.timeSelectShow {
      display: inline;
      position: absolute;
      // left: 523px;
      // top: 9px;
      left: 423px;
      top: 11px;
      div.search {
        display: inline-block;
        button {
          width: 80px;
          height: 32px;
          line-height: 32px;
          cursor: pointer;
          margin-left: 3px;
          display: inline-block;
          border-radius: 4px;
          text-align: center;
          outline: none;
          margin-right: 10px;
          color: #fff;
          background: #444;
          font-weight: bolder;
          border: 1px solid #444;
        }
        button:hover {
          background: #666;
          border: 1px solid #666;
        }
      }
    }
  }
  .userAllData_table {
    padding: 10px;
    margin-top: 20px;
    background: #fff;
    position: relative;
    overflow: hidden;
    padding-top: 3px;
    .spin {
      position: absolute;
      display: inline-block;
      // background-color: rgba(253, 248, 248,0.0);
      background-color: rgba(255, 255, 255, 0.8);
    }
    .help {
      width: 100%;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      span {
        display: inline-block;
        width: 18px;
        height: 18px;
        background: orange;
        line-height: 18px;
        color: #fff;
        font-weight: bolder;
        border-radius: 50%;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
        margin-bottom: 10px;
      }
      .content {
        p {
          width: 100%;
          color: #444;
          font-size: 12px;
          b {
            width: 120px;
            color: #444;
            font-size: 12px;
            display: inline-block;
            text-align: right;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .userAllData_chart {
    position: relative;
    margin-top: 20px;
    padding: 10px;
    background: #fff;
    .spin {
      position: absolute;
      display: inline-block;
      // background-color: rgba(253, 248, 248,0.0);
      background-color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
<script>
import citySelect from "../../../components/citySelect.vue";
import { siblings } from "../../../util/util.js";
import {mapGetters,mapActions} from 'vuex'
// var Highcharts = require("highcharts");
// // 在 Highcharts 加载之后加载功能模块
// require("highcharts/modules/exporting")(Highcharts);
// require('highcharts-no-data-to-display')(Highcharts)
export default {
  components: {
    "city-select": citySelect
  },
  data() {
    var that = this;
    return {
      citySelectNum: [],
      cityType: "",
      timeSelectShow: false,
      time: Date.now() - 86400000,
      timeLine: ["", ""],
      page: {
        float: "right",
        "margin-top": "20px"
      },
      totalListNum: 100,
      pageSizeOpts: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      pageShow: false,
      columns_orderData: [
        {
          renderHeader: h => {
            // title: that.cityType === undefined?'地区':'日期2',
            // key: that.cityType === '1'?'cityName':'orderTime',
            return h("span", that.cityType === 1 ? "地区" : "日期");
          },
          render: (h, params) => {
            if (that.cityType === 1) {
              return h(
                "a",
                {
                  style: {
                    color: "#2d8cf0",
                    cursor: "pointer"
                  },
                  attrs: {
                    target: "_blank",
                    href:
                      "#/index/userAllData/detail/" +
                      params.row.cityCode +
                      "&" +
                      params.row.cityName
                  }
                },
                params.row.cityName
              );
            } else {
              return h("p", {}, params.row.createDate);
            }
          }
        },
        {
          title: "累计用户",
          key: "totalUser"
          // sortable: true
        },
        {
          title: "押金用户(累计)",
          key: "depositUser"
        },
        {
          title: "日活跃用户数",
          key: "dayActiveNum"
          // sortable: true
        },
        {
          title: "日活跃用户率",
          key: "dayActiveRate"
        },
        {
          title: "月活跃用户数",
          key: "monthActiveNum"
          // sortable: true
        },
        {
          title: "月活跃用户率",
          key: "monthActiveRate"
        },
        {
          title: "仅注册用户(累计)",
          key: "registerUser"
        },
        {
          title: "已退押金用户(累计)",
          key: "unDepositUser"
        }
      ],
      columns_orderData2: [
        {
          renderHeader: h => {
            // title: that.cityType === undefined?'地区':'日期2',
            // key: that.cityType === '1'?'cityName':'orderTime',
            return h("span", that.cityType === 1 ? "地区" : "日期");
          },
          render: (h, params) => {
            if (that.cityType === 1) {
              return h(
                "a",
                {
                  style: {
                    color: "#2d8cf0",
                    cursor: "pointer"
                  },
                  attrs: {
                    target: "_blank",
                    href:
                      "#/index/userAllData/detail/" +
                      params.row.cityCode +
                      "&" +
                      params.row.cityName
                  }
                },
                params.row.cityName
              );
            } else {
              return h("p", {}, params.row.createDate);
            }
          }
        },
        {
          title: "累计用户",
          key: "totalUser"
          // sortable: true
        },
        {
          title: "押金用户(累计)",
          key: "depositUser"
        },
        {
          title: "活跃用户数",
          key: "dayActiveNum"
        },
        {
          title: "仅注册用户(累计)",
          key: "registerUser"
        },
        {
          title: "已退押金用户(累计)",
          key: "unDepositUser"
        }
      ],
      orderData: [],
      noDataBox: false,
      spinShow: false,
      spinShow2: false,
      noDataText: "",
      noDataTextSpace: "",
      chartDataX: [],
      chartDepositUser: [],
      chartUnDepositUser: [],
      chartRegisterUser: [],
      chartDepositUserRate: [],
      loadFlag: false,
      options: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now() - 86400000;
          // return date&&date.valueOf() > now.getDay() - 1
        }
      },
      clearable: false,
      transfer: true,
      timer: null
    };
  },
  mounted() {
    document.title = "用户数据 - 整体数据";
    this.$store.dispatch("menuActiveName", "/index/userAllData");
    var type = Number(window.localStorage.getItem("cityType"));
    this.cityType = type;
    var that = this;
    setTimeout(function() {
      that.loadData($(".userAllData_head_time2 button.active").attr("myId"));
    }, 200);
  },
  computed: {
    ...mapGetters(['scrollTop']),
    city: {
      get() {
        return (this.city = window.localStorage.getItem("city"));
      },
      set() {
        // 当只有一个城市时，用来显示的城市名
        return;
      }
    }
  },
  methods: {
     ...mapActions(['setScrollTop']),
    handleSort(column, key, order) {
      console.log(column, key, order);
    },
    searchByTimeLine() {
      if (this.timeLine[0] === "" || this.timeLine[0] === null) {
        this.$Message.warning("请选择时间段");
      } else {
        this.loadData("5");
      }
    },
    timeChange(newTime) {
      this.time = newTime;
      if (this.time.length === "") {
        return;
      } else {
        if (this.citySelectNum.length == 0) {
          return;
        }
        this.loadData($(".userAllData_head_time2 button.active").attr("myId"));
      }
    },
    loadData(type) {
      this.spinShow = true;
      this.spinShow2 = true;
      this.noDataText = "";
      // 调取数据前，清空chart数据
      this.chartDepositUser = [];
      this.chartUnDepositUser = [];
      this.chartRegisterUser = [];
      this.chartDepositUserRate = [];
      this.chartDataX = [];
      // 节流防止用户快速点击数据串行
      this.loadFlag = false;
      this.timer = setTimeout(() => {
        this.axios
          .get("/beefly/wholeUser/api/v1/wholeDataPage", {
            params: {
              type: this.cityType === 1 ? "" : type,
              accessToken: this.$store.state.token,
              cityCode: this.$store.state.cityList.toString(),
              pageNo: this.currentPage,
              pageSize: this.pageSize,
              time:
                this.cityType === 1
                  ? moment(this.time).format("YYYY-MM-DD")
                  : "",
              beginDate:
                this.timeLine[0] === "" || this.timeLine[0] === null
                  ? ""
                  : moment(this.timeLine[0]).format("YYYY-MM-DD"),
              endDate:
                this.timeLine[0] === "" || this.timeLine[0] === null
                  ? ""
                  : moment(this.timeLine[1]).format("YYYY-MM-DD")
            }
          })
          .then(res => {
            this.checkLogin(res);
            var data = res.data.data;
            // 判断message字段是1 or 0 , 1:多个城市，0:一个城市
            // if (Number(res.data.message) === 0) {
            //     this.cityType = 0
            // } else {
            //     this.cityType = 1
            // }

            this.spinShow = false;
            // 先展示下面的图表加载状 态
            this.noDataBox = true;
            if (res.data.resultCode != 1) {
              this.noDataText = "暂无数据";
              this.currentPage = 1;
              this.pageShow = false;
              this.orderData = [];
              this.loadChartData(
                $(".userAllData_head_time2 button.active").attr("myId")
              );
            } else {
              this.orderData = data;

              this.loadChartData(
                $(".userAllData_head_time2 button.active").attr("myId")
              );
              // 处理分页数据
              if (res.data.totalPage < 2 && this.pageSize === 10) {
                this.pageShow = false;
              } else {
                this.pageShow = true;
              }
              this.totalListNum = res.data.totalItems;
            }
          })
          .catch(err => {
            this.spinShow = false;
            this.noDataText = "暂无数据";
            console.log(err);
          });
      }, 200);
    },
    loadChartData(type) {
      this.axios
        .get("/beefly/wholeUser/api/v1/chartData", {
          params: {
            accessToken: this.$store.state.token,
            cityCode: this.$store.state.cityList.toString(),
            time:
              this.cityType === 1 ? moment(this.time).format("YYYY-MM-DD") : "",
            type: this.cityType === 1 ? "" : type,
            beginDate:
              this.timeLine[0] === "" || this.timeLine[0] === null
                ? ""
                : moment(this.timeLine[0]).format("YYYY-MM-DD"),
            endDate:
              this.timeLine[0] === "" || this.timeLine[0] === null
                ? ""
                : moment(this.timeLine[1]).format("YYYY-MM-DD")
          }
        })
        .then(res => {
          this.checkLogin(res);
          // console.log(res.data.data)
          this.spinShow2 = false;
          var chartData = res.data.data;
          if (res.data.resultCode === 0) {
            $("#userAllDataChart").html("");
            this.noDataBox = false;
            this.loadFlag = true;
          } else {
            this.noDataBox = true;

            chartData.map(item => {
              this.chartDepositUser.push(
                Number(this.delcommafy(item.depositUser))
              );
              this.chartUnDepositUser.push(
                Number(this.delcommafy(item.unDepositUser))
              );
              this.chartRegisterUser.push(
                Number(this.delcommafy(item.registerUser))
              );
              this.chartDepositUserRate.push(Number(item.depositUserRate));
              this.chartDataX.push(
                this.cityType === 1 ? item.cityName : item.createDate
              );
            });
            this.initChart();
            this.chartDepositUser = this.chartDepositUser.unique();
            this.chartUnDepositUser = this.chartUnDepositUser.unique();
            this.chartRegisterUsert = this.chartRegisterUser.unique();
            this.chartDepositUserRate = this.chartDepositUserRate.unique();
            this.chartDataX = this.chartDataX.unique();

            this.loadFlag = true;
          }
        })
        .catch(err => {
          this.spinShow = false;
          this.noDataText = "暂无数据";
          console.log(err);
        });
    },
    handleCurrentPage(currentPage) {
      $('div.spieceTable').parent().hide() 
      $('div.spieceTable').parent().css({
          position:'relative',
          top:'initial' ,
          zIndex:99
      })
      this.currentPage = currentPage;
      console.log("this.currentPag", this.currentPage);
      if (this.loadFlag === true) {
        this.loadData($(".userAllData_head_time2 button.active").attr("myId"));
      }
    },
    handlePageSize(pageSize) {
      $('div.spieceTable').parent().hide() 
      $('div.spieceTable').parent().css({
          position:'relative',
          top:'initial' ,
          zIndex:99
      })
      this.currentPage = 1;
      this.pageSize = pageSize;
      if (this.loadFlag === true) {
        this.loadData($(".userAllData_head_time2 button.active").attr("myId"));
      }
    },
    handleClick(e) {
      clearTimeout(this.timer);
      this.currentPage = 1;
      this.pageSize = 10;
      var elems = siblings(e.target);
      for (var i = 0; i < elems.length; i++) {
        elems[i].setAttribute("class", "");
      }
      e.target.setAttribute("class", "active");
      if (e.target.innerHTML === "指定时间段") {
        this.timeSelectShow = true;
      } else {
        this.timeSelectShow = false;
        this.timeLine = ["", ""];
        // if (this.loadFlag === true) {
        //     this.loadData(e.target.getAttribute('myId'))
        // } else {
        //     return
        // }
        this.loadData(e.target.getAttribute("myId"));
      }
    },
    delcommafy(num) {
      if (Number(num) < 1000) {
        return num;
      } else {
        num = num.replace(/,/gi, "");
        return num;
      }
    },
    initChart() {
      var options = {
        title: {
          text: this.cityType === 1 ? "分地区 累计用户及累计押金用户占比" : "累计用户及累计押金用户占比"
        },
        subtitle: {
          text: this.cityType === 1 ? "" : "",
          align: "right",
          verticalAlign: "top",
          style: {
            color: "#ccc",
            fontSize: "12px"
          }
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        lang: {
          noData: "暂无数据，请选择一个指标或其他城市"
        },
        noData: {
          position: {
            align: "center",
            marginLeft: "10px"
          },
          attr: {
            "stroke-width": 1,
            stroke: "#cccccc"
          },
          style: {
            fontWeight: "bolder",
            fontSize: "22px",
            color: "#444",
            border: "none",
            zIndex: 200,
            backgroundColor: "#444"
          }
        },
        xAxis: {
          categories: this.chartDataX
        },
        yAxis: [
          {
            labels: {
              // formatter:function(){
              //     return Highcharts.numberFormat(this.value, 2, ".",",") + '元'
              // },
              style: {
                color: Highcharts.getOptions().colors[1]
              }
            },
            title: {
              text: "用户数",
              style: {
                color: Highcharts.getOptions().colors[1]
              }
            }
          },
          {
            opposite: true,
            tickPositions: [0, 20, 40, 60, 80, 100],
            title: {
              text: "累计押金用户占比",
              style: {
                color: "#9999ff"
              }
            },
            labels: {
              // formatter:function(){
              //     if (Number(this.value) <= 100) {
              //         return this.value + '%'
              //     } else {
              //         return 100 + '%'
              //     }
              // },
              format: "{value}%",
              style: {
                color: "#9999ff"
              }
            }
          }
        ],
        legend: {
          align: "center",
          x: 0,
          verticalAlign: "bottom",
          y: 0,
          floating: false,
          backgroundColor:
            (Highcharts.theme && Highcharts.theme.background2) || "white",
          shadow: false
        },
        tooltip: {
          shared: true,
          useHTML: true,
          headerFormat: "<p'>{point.key}</p>",
          pointFormatter: function() {
            if (this.series.name != "累计押金用户占比") {
              return (
                "<span>" +
                this.series.name +
                ":  </span>" +
                [
                  new String(this.y).length < 3
                    ? this.y
                    : Highcharts.numberFormat(this.y, 0, "", ",")
                ] +
                "<br>"
              );
            } else {
              return (
                "<span>" +
                this.series.name +
                ":  </span>" +
                Highcharts.numberFormat(this.y, 1) +
                "%"
              );
            }
          }
        },
        colors: [
          "#4472c4",
          "#ed7d31",
          "#9999ff",
          "#ffc000",
          "#5b9bd5",
          "#70ad48",
          "#264478",
          "#9e480e",
          "#636363",
          "#997300"
        ],
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: false,
              color:
                (Highcharts.theme && Highcharts.theme.dataLabelsColor) ||
                "white",
              style: {
                textShadow: "0 0 3px black"
              }
            }
          }
        },
        series: [
          {
            name: "累计押金用户",
            type: "column",
            data: this.chartDepositUser,
            yAxis: 0,
            maxPointWidth: 100
          },
          {
            name: "已退押金用户",
            type: "column",
            data: this.chartUnDepositUser,
            yAxis: 0,
            maxPointWidth: 100
          },
          {
            name: "仅注册用户",
            type: "column",
            data: this.chartRegisterUser,
            yAxis: 0,
            maxPointWidth: 100
          },
          {
            name: "累计押金用户占比",
            type: "line",
            data: this.chartDepositUserRate,
            tooltip: {
              valueSuffix: ""
            },
            yAxis: 1
          }
        ]
      };

      new Highcharts.chart("userAllDataChart", options);
    },
    cityChange() {
      this.citySelectNum = this.$store.state.cityList;
      clearTimeout(this.timer);
      // if (this.loadFlag === true) {
      //     this.currentPage = 1
      //     this.loadData($('.userAllData_head_time2 button.active').attr('myId'))
      // }
      this.currentPage = 1;
       if(this.citySelectNum.length==0){
                this.orderData = []
                this.noDataText = '请至少选择一个城市'
                this.pageShow = false
                this.noDataBox = false
                return;
       }
      this.loadData($(".userAllData_head_time2 button.active").attr("myId"));
    },
    checkLogin(res) {
      if (res.data.message === "用户登录超时") {
        this.$router.push("/login");
      }
    }
  },
  watch: {
     'scrollTop':{
            handler:function(n,o){
               var partop = $('div.ivu-col.ivu-col-span-19').offset().top
               //relTab spieceTable
               var _relTop = $('div.relTab').offset().top
               var top =  $('div.spieceTable').offset().top
               var _selfHeight =  $('div.spieceTable').height()
              //  console.log('假头部距离 窗口顶部的距离：' +  (top - partop))
                var pageToTop =  $('.ivu-page').offset().top // tab的高度
                // console.log('pageToTop:' + pageToTop)
               if(-(_relTop-partop) > _selfHeight){
                  //  console.log('此时假头部改出现了')
                   if(Math.abs(-(top-partop) - _selfHeight)<10){
                        this.recode = n
                       
                    }
                     var disY = -(_relTop-partop) - _selfHeight;
                    // console.log('disY:'+ disY)
                        // console.log('recode:' + this.recode)
                        $('div.spieceTable').parent().show() 
                    $('div.spieceTable').parent().css({
                        position:'absolute',
                        top:Math.abs(-(_relTop-partop)) + _selfHeight - 10  ,
                        zIndex:99
                    }) 
               }else{
                    $('div.spieceTable').parent().css({
                        position:'absolute',
                        top:33  ,
                        zIndex:99
                    }) 
               }
              if(pageToTop - 30 <_selfHeight){
                  $('div.spieceTable').parent().hide() 
                    $('div.spieceTable').parent().css({
                        position:'relative',
                        top:33 ,
                        zIndex:99
                    }) 
              }
            },
            deep:true
        },
    "$store.state.cityList": "cityChange"
  }
};
</script>