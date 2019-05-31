<template>
  <div>
    <Form :label-width="180">
    <Row :gutter="30">
      <Col :span="24">
        <Card dis-hover>
          <p slot="title">基本信息</p>
          <FormItem label="平台名称：">
            {{info.companyName}}
          </FormItem>
          <FormItem label="前台网址：">
            <a :href="'http://www.responsinator.com/?url='+encodeURIComponent(info.website)" target="_blank">{{info.website}}</a>
          </FormItem>
          <FormItem label="签约主体：">
            {{info.name}}
          </FormItem>
          <FormItem label="公司地址：">
            {{info.address}}
          </FormItem>
          <FormItem label="法人姓名：">
            {{info.legalName}}
          </FormItem>
          <FormItem label="联系电话：">
            {{info.mobile}}
          </FormItem>
          <FormItem label="信用代码：">
            {{info.creditCode}}
          </FormItem>
          <FormItem label="上传文件：">
            <div style="display:flex">
              <div style="margin-right:10px;">
                <div>信用代码证</div>
                <div><a :href="imgUrl+info.creditCodeFile" target="_blank"><img v-if="info.creditCodeFile" :src="imgUrl+info.creditCodeFile+'!/fw/200'" style="width:100px" /></a></div>
              </div>
              <div>
                <div>委托书</div>
                <div><a :href="imgUrl+info.powerAttorneyFile" target="_blank"><img v-if="info.powerAttorneyFile" :src="imgUrl+info.powerAttorneyFile+'!/fw/200'" style="width:100px" /></a></div>
              </div>
            </div>
          </FormItem>
        </Card>
      </Col>
      <Col :span="24">
        <Card dis-hover style="margin-top:10px">
          <p slot="title">接口参数</p>
          <FormItem label="APPID：">
            {{info.id}}
          </FormItem>
          <FormItem label="APPSECRET：">
            {{info.secret}}
          </FormItem>
          <FormItem label="订单回调：">
            {{info.notifyUrl}}
          </FormItem>
        </Card>
      </Col>
      <Col :span="24">
        <Card dis-hover style="margin-top:10px">
          <p slot="title">参数配置</p>
          <FormItem label="最低消费额：">
            <Input type="number" v-model="info.minAmount" number v-if="editModel" style="width:100px" />
            <span v-else>{{info.minAmount}}</span> 元
          </FormItem>
          <FormItem label="消费浮动额度：">
            <Input type="number" v-model="info.diffAmount" number v-if="editModel" style="width:100px" />
            <span v-else>{{info.diffAmount}}</span> 元
          </FormItem>
          <FormItem label="授权有效期：">
            <Input type="number" v-model="info.oauthTime" number v-if="editModel" style="width:100px" />
            <span v-else>{{info.oauthTime}}</span> 小时
          </FormItem>
          <FormItem>
            <Button type="primary" @click="save" number v-if="editModel">保存</Button>
            <Button type="primary" @click="editModel=true" v-else>编辑</Button>
          </FormItem>
        </Card>
      </Col>
    </Row>
    </Form>
  </div>
</template>

<script>
  import $P2PService from '../../service/p2p'
  export default {
    data(){
      return {
        imgUrl:process.env.VUE_APP_IMG_URL,
        editModel:false,
        info:{}
      }
    },
    created(){
      $P2PService.list({ps:1}).then(res=>{
        if (res.code===1){
          let data=res.data.records[0]
          this.info=data
        }
      })
    },
    methods:{
      save(){
        var data={id:this.info.id.toString()}
        if (this.info.minAmount) data.minAmount=this.info.minAmount
        if (this.info.diffAmount) data.diffAmount=this.info.diffAmount
        if (this.info.oauthTime) data.oauthTime=this.info.oauthTime
        $P2PService.update(data).then(res=>{
          if (res.code===1){
            this.$Message.success('更新成功')
            this.editModel=false
          }else{
            this.$Message.error(res.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
