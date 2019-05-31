<template>
  <Poptip placement="right-start" @on-popper-show="getMember()">
    <a>{{memberId.toString()}}</a>
    <div class="member-card" slot="content" v-if="memberInfo">
      <div class="header">
        <div>
          <p><strong>{{memberInfo.nickname}}</strong></p>
          <p><Icon type="ios-call" /> {{memberInfo.account}}</p>
        </div>
        <div><Avatar shape="square" icon="ios-person" size="large" /></div>
      </div>
      <div class="item">
        <p>于{{memberInfo.createDate}}创建</p>
        <p>上一次登录IP为{{memberInfo.loginIp}}</p>
      </div>
      <div class="other">
        <Button type="info" ghost @click="$router.push('/order/list?memberId='+memberId)">查看订单</Button>
      </div>
    </div>
  </Poptip>
</template>

<script>
  import $MemberService from './../service/member'
  export default {
    name: "MemberCard",
    data(){
      return {
        memberInfo:{}
      }
    },
    props:['memberId'],
    methods:{
      getMember(){
        $MemberService.id(this.memberId).then(res=>{
          if (res.code===1){
            this.memberInfo=res.data
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
