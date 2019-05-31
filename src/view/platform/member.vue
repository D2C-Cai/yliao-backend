<template>
  <div>
    <Row :gutter="15" class="search-bar">
      <Col :xxl="7" :xl="8" :lg="9" :md="10">
        <div class="title">搜索会员</div>
        <Input v-model="searchParams[keywordType]" clearable>
          <Select v-model="keywordType" @on-change="changeKeywordType" style="width:80px" slot="prepend">
            <Option value="memberAccount">按手机</Option>
            <Option value="memberName">按名称</Option>
            <Option value="memberId">按 I D</Option>
          </Select>
        </Input>
      </Col>
      <Col span="2" class="search-buttons">
        <Button type="primary" @click="onSearch">搜索</Button>
        <Button type="default" @click="onClear">重置</Button>
      </Col>
    </Row>
    <div style="margin-top:20px">
      <div class="list-buttons-bar no-margin">
        <div>
            <Button type="primary" icon="md-cloud-upload" @click="importModalShow=true">导入会员数据</Button>
        </div>
        <Page :current="members.current" :total="members.total" :page-size="members.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator />
      </div>
      <table class="table padding-10 hover hide-checkbox-label">
        <tr class="header">
          <td width="15%" class="center">ID</td>
          <td class="center">账号</td>
          <td class="center">姓名</td>
          <td class="center">余额</td>
          <td class="center">注册时间</td>
          <td class="center">状态</td>
          <td class="center">操作</td>
        </tr>
        <tbody>
        <tr v-for="(member,i) in members.list" :key="i">
          <td class="center">{{member.id.toString()}}</td>
          <td class="center">{{member.account}}</td>
          <td class="center">{{member.nickname}}</td>
          <td class="center">￥ <span style="font-weight:bold;font-size:18px;">{{member.accountInfo.oauthAmount | formatCurrency}}</span><br /><span style="font-size:12px;">过期时间：{{member.accountInfo.deadline}}</span></td>
          <td class="center">{{member.createDate}}</td>
          <td class="center">{{member.status==1?'正常':'异常'}}</td>
          <td class="center"><Button type="info" @click="$router.push('/platform/order?memberId='+member.id.toString())">查看订单</Button></td>
        </tr>
        </tbody>
      </table>
      <Page :current="members.current" :total="members.total" :page-size="members.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="margin-top:10px;text-align:right" />
    </div>
    <Modal v-model="importModalShow" title="导入会员" footer-hide>
      <div style="text-align:center;padding:30px 0">
        <Upload action="/back/p2p/import/member" :show-upload-list="false" :data="{ appId: userInfo.p2pId.toString() }" :headers="{ accessToken: token }"
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :on-progress="uploadProgress"
                :on-error="uploadError"
                :on-success="uploadSuccess">
          <Button type="primary" :loading="uploadLoading" icon="md-cloud-upload">选择EXCEL文件</Button>
          <div style="margin:20px 15% 0 15%;text-align:left;line-height:30px" slot="tip">
            <p>1.<a href="https://s.yliao.com/doc/import_oauth.xls">下载数据模板</a>,请将数据粘贴到模板上</p>
            <p>2.不要更改表头文字，<span style="color:red">将所有列都转成文本格式</span></p>
            <p>3.如果导入的数据较多，系统会在后台静默执行</p>
          </div>
        </Upload>
      </div>
    </Modal>
  </div>
</template>

<script>
  import $MemberService from '../../service/member'
  import $cookies from 'vue-cookies'

  export default {
    data(){
      return {
        uploadLoading:false,
        importModalShow:false,
        keywordType:'memberAccount',
        userInfo:this.LocalStorage.getItem('USER_INFO'),
        token:$cookies.get('AUTH_TOKEN'),
        searchParams:{
          memberId:this.$route.query.memberId,
          memberAccount:this.$route.query.memberAccount,
          memberNname:this.$route.query.memberNname,
          p:this.$route.query.p,
          size:this.$route.query.size
        },
        members:{
          list:[],
          current:1,
          p:1,
          size:20,
          total:0
        },
      }
    },
    created(){
      this.getMemberList(this.searchParams.p,this.members.size)
    },
    methods:{
      uploadProgress(){
        this.uploadLoading=true
      },
      uploadSuccess(res){
        if (res.code===1){
          this.$Message.success('会员数据导入成功')
          this.getMemberList()
        }else{
          this.$Message.error(res.msg)
        }
        setTimeout(()=>{
          this.uploadLoading=false
        },600)

      },
      uploadError(error){
        console.log(error)
      },
      getMemberList(p=1,size=20){
        this.searchParams.size=size
        this.searchParams.p=p
        $MemberService.list(this.searchParams).then(res=>{
          if (res.code===1){
            this.members={
              list:res.data.records,
              current:res.data.current,
              size:res.data.size,
              total:res.data.total
            }
          }
        })
      },
      onSearch(){
        this.getMemberList()
        this.$router.replace({path:'/platform/member',query:this.searchParams})
      },
      onChangePage(p){
        this.getMemberList(p, this.searchParams.size)
        this.$router.replace({path:'/platform/member',query:this.searchParams})
      },
      onChangeSize(size){
        this.getMemberList( this.searchParams.p,size)
        this.$router.replace({path:'/platform/member',query:this.searchParams})
      },
      onClear(){
        this.priceSelect=null
        this.searchParams={}
      },
      changeKeywordType(value){
        var searchParams=this.searchParams
        if (value=='memberId'){
          delete searchParams.memberAccount
          delete searchParams.memberName
        }
        if (value=='memberAccount'){
          delete searchParams.memberId
          delete searchParams.memberName
        }
        if (value=='memberName'){
          delete searchParams.memberAccount
          delete searchParams.memberId
        }
        this.searchParams=searchParams
      }
    }
  }
</script>

<style scoped>

</style>
