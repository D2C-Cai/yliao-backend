<template>
  <Poptip placement="right-start" @on-popper-show="getPlatform()">
    <a>{{p2pId.toString()}}</a>
    <div class="member-card" slot="content" v-if="platformInfo">
      <div class="header">
        <div>
          <p><strong>{{platformInfo.name}}</strong></p>
          <p>{{platformInfo.address}}</p>
        </div>
      </div>
      <div class="item">
        <p>法人：{{platformInfo.legalName}} 手机号：{{platformInfo.mobile}}</p>
      </div>
      <div class="item">
        <p>总销量 {{platformInfo.salesAmount}} 元，单次最低消费{{platformInfo.minAmount}}元</p>
      </div>
      <div class="other">
        <Button type="info" ghost @click="$router.push('/order/list?p2pId='+p2pId)">查看订单</Button>
      </div>
    </div>
  </Poptip>
</template>

<script>
  import $PlatformService from './../service/p2p'
  export default {
    name: "PlatformCard",
    data(){
      return {
        platformInfo:{}
      }
    },
    props:['p2pId'],
    methods:{
      getPlatform(){
        $PlatformService.id(this.p2pId).then(res=>{
          if (res.code===1){
            this.platformInfo=res.data
            //this.$set(this.memberInfo,i,res.data)
          }
        })
      }
    }
  }

</script>

<style lang="less" scoped>
  .member-card {
    width:260px;
    padding:10px;
    .header {
      display:flex;
      justify-content: space-between;
      color:#999;
      line-height:200%;
      strong {
        font-size:16px;
        color:#333
      }
    }
    .item {
      padding-top:10px
    }
    .other {
      text-align:center;
      margin-top:15px;
    }
  }
</style>
