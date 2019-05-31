<template>
  <Modal v-model="show" width="407" height="550" title="商品详情" footer-hide @on-visible-change="close" >
    <div style="width:375px;height:555px;overflow:hidden">
      <div style="width:400px;height:555px;overflow:auto;">
        <Carousel autoplay style="width:375px;height:375px;">
          <CarouselItem v-for="(pic,i) in product.pic" :key="i">
            <img :src="imgUrl+pic+'!/both/375x375'" style="width:100%">
          </CarouselItem>
        </Carousel>
        <div class="info">
          <p class="title">{{product.name}}</p>
          <div style="display:flex;justify-content: space-between">
            <p class="price">￥ <strong>{{product.price | formatCurrency}}</strong></p>
            <p class="other">{{product.freight | freightInfo}}</p>
          </div>
        </div>
        <div class="standard">
          <div class="group" v-for="standard in standards" :key="standard.name">
            <div class="name">{{standard.name}}</div>
            <div class="values"><span v-for="item in standard.values" :key="item">{{item}}</span></div>
          </div>
        </div>
        <div class="content">
          <div class="content-title"> ---- 商品详情 ---- </div>
          <div class="content-html" v-html="content"></div>
        </div>
      </div>
    </div>


  </Modal>
</template>

<script>
  import $ProductService from './../service/product'
  import $ProductDetailService from './../service/productDetail'
  export default {
    name: "ProductDetailModal",
    data(){
      return {
        isLoading:false,
        imgUrl:process.env.VUE_APP_IMG_URL,
        show:false,
        standards:[],
        product:{},
        content:null
      }
    },
    props:['productId'],
    watch: {
      productId(newValue) {
        if (newValue){
          this.getProduct(newValue)
        }
      }
    },
    methods:{
      getProduct(id){
        $ProductService.id(id).then(res=>{
          if (res.code===1){
            this.show=true
            res.data.pic=res.data.pic.split(',')
            this.product=res.data
            this.dealStandard(res.data.skuList)
          }
        })
        $ProductDetailService.select({productId:id.toString()}).then(res=>{
          if (res.code===1){
            this.content=res.data.records.length>0?res.data.records[0].content:''
          }else{
            this.content=''
          }
        })
      },
      dealStandard (skuList) {
        const standardList = skuList.map(item => JSON.parse(item.standard))
        console.log(standardList)
        // 抽取第一个数组的name
        const temp = standardList[0].map(item => item.name)
        const tempss = temp.map(item => ({ name: item, values: [] }))
        standardList.forEach(element => {
          element.forEach(item => {
            tempss.forEach(x => {
              if (x.name === item.name) {
                x.values.push(item.value)
                x.values = [...new Set(x.values)]
              }
            })
          })
        })
        this.standards = tempss
      },
      close(){
      }
    }
  }
</script>

<style lang="less">
.info {
  margin-top:10px;
  .title {
    font-weight:bold;
    font-size:14px;
    overflow:hidden;
    margin-bottom:5px;
  }
  .price {
    color:#ff1493;
    margin-bottom:5px;
    strong {
      font-size:16px;
    }
  }
  .other {
    font-size:12px;
    color:#999;
    margin-top:4px;
  }
}
  .standard {
    border-top:1px solid #EDEDED;
    border-bottom:1px solid #EDEDED;
    padding:15px 0;
    margin:10px 0;
    .group {
      display:flex;
      .name {
        width:50px;
        color:#999;
        line-height:40px;
      }
      .values {
        span {
          display:inline-block;
          border:1px solid #dee5f2;
          text-align:center;
          padding:0 10px;
          line-height:36px;
          min-width:50px;
          font-size:14px;
          margin:3px 6px 3px 0;
        }
      }
    }
  }
  .content {
    .content-title {
      text-align:center;
      padding:10px;
    }
    .content-html {
      img {
        max-width:100%;
      }
    }
  }
</style>
