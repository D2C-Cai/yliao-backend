<template>
  <div>
    <Row :gutter="15" class="search-bar">
      <Col :xxl="7" :xl="8" :lg="9" :md="10">
        <div class="title">搜索</div>
        <Input v-model="searchParams[keywordType]" clearable>
          <Select v-model="keywordType" @on-change="changeKeywordType" style="width:80px" slot="prepend">
            <Option value="account">按手机</Option>
            <Option value="nickname">按名称</Option>
            <Option value="id">按 I D</Option>
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
        </div>
        <Page :current="members.current" :total="members.total" :page-size="members.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator />
      </div>
      <table class="table padding-10 hover hide-checkbox-label">
        <tr class="header">
          <td width="15%" class="center">ID</td>
          <td class="center">昵称</td>
          <td class="center">账号</td>
          <td width="25%" class="center">登录信息</td>
          <td width="100" class="center">操作</td>
        </tr>
        <tbody>
        <tr v-for="(member,i) in members.list" :key="i">
          <td class="center">
            {{member.id.toString()}}
          </td>
          <td class="center">
            <p><strong>{{member.nickname}}</strong></p>
            <p v-if="member.evidenceNo"><Tag color="blue">已认证</Tag></p>
          </td>
          <td class="center">
            {{member.account}}
          </td>
          <td>
            <p>登录时间:{{member.loginDate}}</p>
            <p>登录地址:{{member.loginIp}} <a :href="'https://www.ipip.net/ip/'+member.loginIp+'.html'" v-if="member.loginIp" target="_blank">查询</a></p>
          </td>
          <td class="center">
            <ButtonGroup vertical>
              <Button type="primary" ghost icon="md-build" @click="memberModal(member)">编辑信息</Button>
              <Button type="primary" ghost icon="md-code-working" @click="platformRelationModal(member)">关联平台</Button>
            </ButtonGroup>
          </td>
        </tr>
        </tbody>
      </table>
      <Page :current="members.current" :total="members.total" :page-size="members.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="margin-top:10px;text-align:right" />
    </div>
    <Modal v-model="memberModalShow" :mask-closable="false" width="450" :loading="saveLoading" :title="formData.id?'编辑供应商信息':'新增供应商'" @on-ok="saveMember">
      <Form ref="formValidate" :model="formData" :rules="formValidate" :label-width="90">
        <FormItem label="会员名称" prop="nickname">
          <Input v-model="formData.nickname" placeholder="填写会员名称" style="width:90%" />
        </FormItem>
        <FormItem label="会员账号" prop="account">
          <Input v-model="formData.account" placeholder="输入手机号" style="width:90%" />
        </FormItem>
        <FormItem label="会员密码" :prop="formData.id?'password':''">
          <Input v-model="formData.password" :placeholder="formData.id?'若不更改密码请保持为空':'新增账号必须填写密码'" style="width:90%" />
        </FormItem>
        <FormItem label="会员状态" :prop="formData.id?'password':''">
          <i-switch v-model="formData.status" :true-value="1" :false-value="0"></i-switch>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="platformRelationModalShow" :title="'查看关联平台 - '+platformRelation.member.nickname" footer-hide>
      <table class="table">
        <tr class="header">
          <td class="center">平台ID</td>
          <td class="center">授权金额</td>
          <td class="center">过期时间</td>
        </tr>
        <tr v-for="item in platformRelation.list">
          <td class="center">{{item.p2pId}}</td>
          <td class="center">{{item.oauthAmount}}</td>
          <td class="center">{{item.deadline}}</td>
        </tr>
      </table>
    </Modal>
  </div>
</template>

<script>
  import $MemberService from '../../service/member'
  import $AccountService from '../../service/account'
  export default {
    data(){
      return {
        uploadLoading:false,
        saveLoading:true,
        keywordType:'name',
        memberModalShow:false,
        platformRelationModalShow:false,
        platformRelation:{member:{},list:[]},
        formData:{
        },
        formValidate:{
          nickname:[
            { required: true, message: '请填写会员名称', trigger: 'blur' }
          ],
          account:[
            { required: true, message: '请填写手机号', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        searchParams:{
          id:this.$route.query.id,
          nickname:this.$route.query.nickname,
          account:this.$route.query.account,
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
      this.getList()
    },
    methods:{
      saveMember(){
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            var formData={...this.formData}
            let service=(formData.id)?$MemberService.update(formData):$MemberService.insert(formData)
            service.then(res=>{
              if(res.code===1){
                this.memberModalShow=false
                this.$Message.success(((this.formData.id)?'更新':'新增')+'成功！');
                this.getList(this.searchParams.p,this.searchParams.size)
              }else{
                setTimeout(() => {
                  this.saveLoading = false;
                  this.$nextTick(() => {
                    this.saveLoading = true;
                  });
                }, 500);
                this.$Message.error(res.msg);
              }
            })
          } else {
            setTimeout(() => {
              this.saveLoading = false;
              this.$nextTick(() => {
                this.saveLoading = true;
              });
            }, 500);
          }
        })
      },
      memberModal(item=null){
        this.$refs['formValidate'].resetFields()
        this.memberModalShow=true
        if(item){
          var obj = {...item}
          this.formData=obj
        }else{
          this.formData={}
        }
      },
      platformRelationModal(member){
        $AccountService.select({ memberId: member.id.toString()}).then(res=>{
          if (res.code===1){
            this.platformRelationModalShow=true
            this.platformRelation.member=member
            this.platformRelation.list=res.data.records
          }
        })
      },
      getList(p=1,size=20){
        this.searchParams.size=size
        this.searchParams.p=p
        $MemberService.select(this.searchParams).then(res=>{
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
        this.getList()
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onChangePage(p){
        this.getList(p, this.searchParams.size)
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onChangeSize(size){
        this.getList( this.searchParams.p,size)
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onClear(){
        this.priceSelect=null
        this.searchParams={}
      },
      changeKeywordType(value){
        var searchParams=this.searchParams
        if (value=='id'){
          delete searchParams.nickname
          delete searchParams.account
        }
        if (value=='nickname'){
          delete searchParams.id
          delete searchParams.account
        }
        if (value=='account'){
          delete searchParams.id
          delete searchParams.nickname
        }
        this.searchParams=searchParams
      }
    }

  }
</script>

<style scoped>

</style>
