<template>
    <div id="pretend">
        <div class="pretend fiexedAssets">
            <Row class="citySelect">
                <city-select prop="cityShow"></city-select>
            </Row>
            <div class="nodata2" v-show="isNoData2">
                    <i class="iconfont icon-zanwushuju"></i>
                </div>
            <div style="    text-align: center;padding: 10px 0;" v-show="citySelectNum.length>0?false:true">请至少选择一个城市</div>    
            <Row v-show="citySelectNum.length>0?true:false" class="cityBindTable" style="position:relative;">
                <Spin fix size="large" v-if="spinShow"  class="spin">
                    <Icon type="load-c" size=18 class="demo-spin-icon-load" style="color: #ccc;"></Icon>
                    <div style="color: #ccc; text-indent: 5px;">  loading...</div>
                </Spin>
                <ul v-show="allCount2">
                    <li class="total" v-show="allCount">
                        <h3>合计</h3>
                        <div class="total">
                            <table>
                                <thead>
                                    <tr>
                                        <th>假设实收率</th>
                                        <th>盈亏状态</th>
                                        <th>盈亏率</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr :key="item.actualYield" v-for="item of items">
                                        <td>{{item.actualYield}}</td>
                                        <td>{{item.profitLossStatus}}</td>
                                        <td>
                                            <div class="progress">
                                                <div class="progress-outer">
                                                    <span class="progress-text">{{item.profitAndLossLv}}</span>  
                                                    <div class="progress-inner">
                                                        <div :class="{'progress-bg':diff(item.profitAndLossLv),'sign':sign }" :percent="item.profitAndLossLv">
                                                        </div>
                                                    </div>
                                                </div> 
                                            </div> 
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </li>
                    <li class="cityBind" v-bind:key="index" v-for="(item,index) of allCityTables">
                        <h3>{{item[0].cityName}}</h3>
                        <div class="total">
                            <table>
                                <thead>
                                    <tr>
                                        <th>假设实收率</th>
                                        <th>盈亏状态</th>
                                        <th>盈亏率</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-show="item[0].actualYield.length!==0"  :key="list.id" v-for="list of item">
                                        <td>{{list.actualYield}}</td>
                                        <td>{{list.profitLossStatus}}</td>
                                        <td>
                                            <div class="progress">
                                                <div class="progress-outer">
                                                    <span class="progress-text">{{list.profitAndLossLv}}</span>  
                                                    <div class="progress-inner">
                                                        <div  :class="{'progress-bg':diff(list.profitAndLossLv),'sign':sign}" :percent="list.profitAndLossLv">
                                                        </div>
                                                    </div>
                                                </div> 
                                            </div> 
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-show="item[0].actualYield.length===0" class="nodata" >
                                暂无数据
                                </div>
                        </div>
                    </li>
                </ul>
            </Row>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import citySelect from './citySelect.vue'
    export default {
        components: {
            "city-select": citySelect
        },
        data(){
            return {
                citySelectNum:[],
                allCount2:false,
                spinShow:true,
                isNoData:false,
                isNoData2:false,
                allCount:false,
                cityLists:this.cityList,
                allCityTables:[],
                items:[],
                common:false,
                sign:true,
                isWin:true,
                totalMoneyTbale: false
            }
        },
        computed:{
            ...mapGetters(['dataMonth','cityList','analysisType'])
        },
        updated(){
              setTimeout(()=>{
                  this.changeWidth()
              },500)
        },
        methods:{
            diff(percent){
                    var res = percent.replace(',','')
                    var res2 = res.replace('%','')
                    return  res2>0
            },
            changeWidth(){ 
               var that = this;
                var $proress = $('.sign');
               var res =  Array.prototype.slice.call($proress)
               res.forEach(function(item,index){
                   var $percent = $(item).attr('percent')
                     $(item).css({
                        backgroundColor:'#8db4e2',
                    })
                    $(item).animate({width:$percent},500)
                    // $(item).css({
                    //     width:$percent,
                    // })
    
                   if($percent.fixed(2)!=='100%'){
                       $(item).parent().prev().css({
                           color:'#000'
                       })
                   }else{
                       $(item).parent().prev().css({
                           color:'#fff'
                       }) 
                   }
               })
            },
             changePage() {
                   // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                   var that =  this
                   this.spinShow = true
                    this.allCount = false
                    this.allCount2 = false
                    this.allCityTables = []
                    this.items = []
                   setTimeout(function() {
                       that.axios('/beefly/monthDataDetail/api/v1/monthDataDetail', {
                           params: {
                               dataMonth: that.dataMonth,
                               accessToken: that.$store.state.token,
                               type: 5,
                               cityCode:that.$store.state.cityList.length===0?'':that.$store.state.cityList.join(',')
                           }
                           }).then((response) => {
                               that.spinShow = false
                               var data = response.data.data
                               if(data.length===0){
                                   that.isNoData = false
                               }
                               var message  = data.message
                               if(message==='用户登录超时'){
                                   that.$store.push({path:'/login'})
                               }
                                 if(that.$store.state.cityList.length<1){
                                      that.allCount = true
                                      that.allCount2 = true
                                      that.items = data[0]
                                      data.splice(0,1)
                                      that.allCityTables = data
                                 }
                                 if(that.$store.state.cityList.length==1){
                                     that.allCount = false
                                        that.allCount2 = true
                                     var arr = data
                                     that.allCityTables = arr
                                 }
                                  if(that.$store.state.cityList.length>1){
                                     that.allCount = true
                                    that.allCount2 = true
                                      that.items = data[0]
                                      data.splice(0,1)
                                     var arr = data
                                      that.allCityTables = arr
                                 }

                           }).catch((error) => {
                               console.log(error)
                               that.spinShow = false
                           })
                       }, 200)
               }
        },
        watch: {
                    'dataMonth':{
                    handler:function(val){
                    this.isNoData2 = false
                    this.isNoData = false
                    this.spinShow = true
                    this.allCount2 = false
                    },
                    deep:true
                },
             'analysisType': {
                    handler: function(n,o) {
                        if(n==1){
                           this.changePage()
                       }else{
                           this.allCityTables = []
                            this.isNoData = false
                            this.isNoData2 = false
                            this.spinShow = true
                            this.allCount2 = false
                       }
                    },
                    deep: true
                },
            '$store.state.cityList': {
                handler: function(n){
                    this.citySelectNum = n
                    if(this.citySelectNum.length==0){
                        return;
                    }
                    this.changePage()
                },
                deep: true
            }
        },
        mounted(){
             var height = $(window).height()
              //$('div.fiexedAssets').eq(4).height(height/2)
           setTimeout(()=>{
                $('span.city').remove()
           },200)
        }
    }
</script>
<style lang="scss" type="text/css" scoped>
div.nodata2{text-align:center;}
div.nodata2 i{font-size:400px;color:#dedcdc;}
    .citySelect{
        padding:16px 16px 0 16px;
        background:#f3f3f5;
        ul{
            min-width:1200px;margin:0 auto;
            li{border-radius:3px;width:60px;height:35px;line-height:35px;text-align:center;margin-right:16px;margin-bottom:16px;float:left;list-style-type: none;border:1px solid #19be6b;}
            li.active{background:#19be6b;color:#fff;}
        }
    }
    .cityBindTable{
        min-width:1200px;
        margin:16px auto 0;
        position: relative;
        height:100%;
         .demo-spin-icon-load{
        color:rgb(204, 204, 204);
        animation: ani-demo-spin 1s linear infinite;
        .spin {
            position: absolute;
            display: inline-block;
            // background-color: rgba(253, 248, 248,0.0); 
            background-color: rgba(255, 255, 255, 0.8); 
        }
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
        ul{
            width:100%;margin:0 auto;
            background:#fbfbfb;
            li{ float:left;
                margin:0 16px 16px 16px;
               width:calc((100% - 85px - 32px)/3);
                box-sizing: border-box;
                h3{margin-bottom:10px;margin-top:10px;font-weight:bold;}
                div{
                    table{border-collapse: collapse;width:100%;
                        tr{
                            th{background-color:#f8f8f9;border:1px solid #e9eaec;text-align: center;line-height:30px;}
                            td{border:1px solid #e9eaec;text-align: center;line-height: 35px;}
                        }
                    }
                    .progress{width:100%;height:100%;
                        .progress-outer{
                            position:relative;
                            .progress-text{
                                position: absolute;
                                right:5px;
                                bottom:0;
                                top:50%;
                                margin-top:-15px;
                                color:#000;
                                z-index:3;
                            }
                            .progress-inner{
                                width:100%;
                                background:#f3f3f3;
                                color:#000;
                                .progress-bg{
                                    height: 30px;
                                    width:100%;
                                    position: relative;
                                }
                                .progress-bg.active{
                                    height: 30px;
                                    width:100%;
                                    background:#b91010;
                                    position: relative;
                                }
                            }
                        }
                    }
                   
                }
            }
        }
    }
    div.total{height:213px;}
    div.fiexedAssets {
    padding: 0 16px 16px 16px;
    box-sizing: border-box;
    position:relative;
   
}
    div.nodata{text-align:center;border:1px solid #e9eaec;height:182px;line-height: 182px;}
div.nodata i{font-size:100px}

</style>
