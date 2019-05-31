<template>
  <div>
    <Row :gutter="15" class="search-bar">
      <Col :xxl="5" :xl="6" :lg="7" :md="8">
        <div class="title">账号</div>
        <Input v-model="searchParams.name" clearable></Input>
      </Col>
      <Col span="2" class="search-buttons">
        <Button type="primary" @click="onSearch">搜索</Button>
        <Button type="default" @click="onClear">重置</Button>
      </Col>
    </Row>

    <div style="margin-top:20px">
      <div class="list-buttons-bar no-margin">
        <div><Button type="primary" icon="md-person-add" @click="userModal()">新增用户</Button></div>
        <Page :current="users.current" :total="users.total" :page-size="users.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
      </div>
      <table class="table padding-10 hover hide-checkbox-label">
        <tr class="header">
          <td width="35%">账号</td>
          <td class="center">登录时间</td>
          <td width="8%" class="center">状态</td>
          <td class="center">操作</td>
        </tr>
        <tbody>
        <tr class="center" v-for="(user,i) in users.list" :key="i">
          <td>
            {{user.username}}
            <template v-if="user.p2pId">
              <Tag color="primary">{{user.p2p.name}}</Tag>
            </template>
            <template v-if="user.supplier">
              <Tag color="success">{{user.supplier.name}}</Tag>
            </template>
          </td>
          <td class="center"><template v-if="user.loginDate&&user.loginIp">{{user.loginDate}} （{{user.loginIp}}）</template><template v-else>还未登录过</template></td>
          <td class="center"><i-switch v-model="user.status" :true-value="1" :false-value="0" @on-change="changeStatus(user)"></i-switch></td>
          <td class="center">
            <ButtonGroup v-if="user.supplier">
              <Button type="success" ghost style="width:100px;" @click="bindModal(user,'supplier')">换绑供应商</Button>
              <Button type="error" ghost style="width:100px;" @click="cancelBind(user,'supplier')">取消绑定&nbsp;&nbsp;</Button>
            </ButtonGroup>
            <ButtonGroup v-if="user.p2p">
              <Button type="primary" ghost style="width:100px;" @click="bindModal(user,'p2p')">换绑P2P平台</Button>
              <Button type="error" ghost style="width:100px;" @click="cancelBind(user,'p2p')">取消绑定&nbsp;&nbsp;</Button>
            </ButtonGroup>
            <ButtonGroup v-if="!user.p2p&&!user.supplier">
              <Button style="width:100px;" @click="bindModal(user,'p2p')">绑定P2P平台</Button>
              <Button style="width:100px;" @click="bindModal(user,'supplier')">绑定供应商</Button>
            </ButtonGroup>
            <ButtonGroup style="margin-left:15px;">
              <Button type="primary" icon="md-build" @click="userModal(user)">编辑</Button>
              <Button type="error" ghost icon="md-trash" @click="deleteUser(user,i)">删除</Button>
            </ButtonGroup>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="list-buttons-bar">
        <div></div>
        <Page :current="users.current" :total="users.total" :page-size="users.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
      </div>
    </div>

    <Modal v-model="bindModalShow" :loading="saveLoading" :title="bindModalType=='p2p'?'绑定P2P平台':'绑定供应商'" @on-ok="saveBind">
      <div v-if="bindModalShow">
        <div v-if="bindModalType=='p2p'">
          <div style="padding-bottom:5px;">请选择P2P平台</div>
          <PlatformSelect v-model="bindFormData.p2pId" :p2p-id="bindFormData.p2pId" :clearable="true" />
        </div>
        <div v-else>
          <div style="padding-bottom:5px;">请选择供应商</div>
          <SupplierSelect v-model="bindFormData.supplierId" :p2p-id="bindFormData.supplierId" :clearable="true" />
        </div>
      </div>
    </Modal>

    <Modal v-model="userModalShow" :loading="saveLoading" :title="userModalAction=='add'?'新增账户':'编辑账户'" @on-ok="saveUser">
      <div style="padding-right:5%" v-if="userModalShow">
        <Form ref="formValidate" :rules="formValidate" :model="userFormData" :label-width="100">
          <FormItem label="用户名称" prop="username">
            <Input v-model="userFormData.username" clearable />
          </FormItem>
          <FormItem label="登录密码" :prop="userModalAction=='add'?'password':''">
            <Input type="password" v-model="userFormData.password" :placeholder="userModalAction=='add'?'新增账号必须设置密码':'若不修改密码请勿填写'" clearable />
          </FormItem>
          <FormItem :label="(!userFormData.supplierId&&!userFormData.p2pId)?'绑定对象':(userFormData.supplierId?'绑定供应商':'绑定P2P平台')">
            <PlatformSelect :style="(!userFormData.supplierId&&!userFormData.p2pId)?'width:45%':''" v-if="!userFormData.supplierId" v-model="userFormData.p2pId" :p2p-id="userFormData.p2pId" :clearable="true" placeholder="请选择P2P平台" />
            <span style="margin:0 10px" v-if="!userFormData.supplierId&&!userFormData.p2pId">或</span>
            <SupplierSelect :style="(!userFormData.supplierId&&!userFormData.p2pId)?'width:45%':''" v-if="!userFormData.p2pId" v-model="userFormData.supplierId" :p2p-id="userFormData.supplierId" :clearable="true" placeholder="请选择供应商" />
          </FormItem>
          <FormItem label="是否启用">
            <i-switch v-model="userFormData.status" :true-value="1" :false-value="0"></i-switch>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
  import md5 from 'md5'
  import $UserService from '../../service/user'
  import $SupplierService from '../../service/supplier'
  import $P2PService from '../../service/p2p'
  import PlatformSelect from '../../components/PlatfromSelect'
  import SupplierSelect from '../../components/SupplierSelect'

  export default {
    data(){
      return {
        saveLoading:true,
        bindModalShow:false,
        bindModalType:'p2p',
        bindFormData:{
          userId:null,
          p2pId:null,
          supplierId:null
        },
        userModalShow:false,
        userModalAction:'add',
        userFormData:{
          id:null,
          username:null,
          password:null,
          p2pId:null,
          supplierId:null,
          status:1
        },
        searchParams:{
          name:this.$route.query.name,
          p:this.$route.query.p,
          size:this.$route.query.size
        },
        users:{
          list:[],
          current:1,
          p:1,
          size:20,
          total:0
        },
        formValidate: {
          username: [
            {required: true, message: '请填写账户名称', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写登录密码', trigger: 'blur'}
          ]
        }
      }
    },

    components:{
      [PlatformSelect.name]:PlatformSelect,
      [SupplierSelect.name]:SupplierSelect
    },
    created(){
      this.getUserList(this.users.p,this.users.size)
    },
    methods:{
      userModal(user){
        if (user) {
          this.userModalAction='edit'
          user.id=user.id.toString()
          if (user.p2pId) user.p2pId=user.p2pId.toString()
          if (user.supplierId) user.supplierId=user.supplierId.toString()
          this.userFormData={...user}
        }else{
          this.userFormData={status:1}
          this.userModalAction='add'
        }
        this.userModalShow=true
      },
      saveUser(){
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            this.saveUserAction()
          }else {
            setTimeout(() => {
              this.saveLoading = false;
              this.$nextTick(() => {
                this.saveLoading = true;
              });
            }, 500);
          }
        })
      },
      saveUserAction(){
        var userData={...this.userFormData}
        if (userData.password) {
          userData.password=md5(userData.password)
        }else{
          delete userData.password
        }
        var service=(userData.id)?$UserService.update(userData):$UserService.insert(userData)
        service.then(res=>{
          if (res.code===1){
            this.$Message.success(userData.id?'账户更新成功！':'账户新增成功')
            this.userModalShow=false
            this.getUserList(this.searchParams.p,this.searchParams.size)
          }else{
            this.$Message.success(res.msg)
            setTimeout(() => {
              this.saveLoading = false;
              this.$nextTick(() => {
                this.saveLoading = true;
              });
            }, 500);
          }
        })
      },
      deleteUser(user,i){
        this.$Modal.confirm({
          title: '系统提示',
          content: '确定要删除该账户吗？请谨慎操作',
          onOk: () => {
            $UserService.delete({ids:user.id.toString()}).then(res=>{
              if (res.code===1) {
                this.users.list.splice(i,1)
              }else{
                this.$Message.error(res.msg)
              }
            })
          }
        })
      },
      changeStatus(user){
        $UserService.update(user)
      },
      bindModal(user,type){
        this.saveLoading=true
        this.bindModalType=type
        this.bindFormData={id:user.id.toString()}
        if (type=='p2p') this.bindFormData.p2pId=user.p2p?user.p2p.id.toString():null
        if (type=='supplier') this.bindFormData.supplierId=user.supplier?user.supplier.id.toString():null
        this.bindModalShow=true
      },
      saveBind(){
        if (!this.bindFormData.p2pId && !this.bindFormData.supplierId){
          this.saveLoading=false
          this.$Message.error('请选择一个平台或供应商')
          setTimeout(()=>{
            this.saveLoading=true
          },500)
          return false
        }
        this.saveLoading=true
        $UserService.update(this.bindFormData).then(res=>{
          if (res.code===1){
            this.$Message.success('绑定成功！')
            setTimeout(()=>{
              this.bindModalShow=false
              this.getUserList(this.searchParams.p,this.searchParams.size)
            },600)
          }else{
            this.$Message.success(res.msg)
          }
        })
      },
      cancelBind(user,type){
        var data={id:user.id.toString()}
        type=='p2p'?data.p2pId=0:data.supplierId=0
        this.$Modal.confirm({
          title:'系统提示',
          content:'确定要取消绑定吗？取消后，该账号相应的权限也将失效。',
          onOk:()=>{
            $UserService.update(data).then(res=>{
              if (res.code===1){
                this.$Message.success('成功取消绑定！')
                if (type=='p2p'){
                  delete user.p2p
                  user.p2pId=0
                }else{
                  delete user.supplier
                  user.supplierId=0
                }
                this.bindFormData={}//修复删除对象后不更新的bug，原理未知
              }else{
                this.$Message.success(res.msg)
              }
            })
          }
        })

      },

      getUserList(p,size){
        if(!p) p=1
        this.searchParams.size=size
        this.searchParams.p=p
        let userRequest=$UserService.select(this.searchParams)
        let supplierRequest=$SupplierService.select({size:1000})
        let p2pRequest=$P2PService.select({size:1000})
        Promise.all([userRequest,supplierRequest,p2pRequest]).then(res=>{
          console.log(res)
          var [user,supplier,p2p]=[...res]
          user.data.records.map(item=>{
            item.p2p=p2p.data.records.find(ele=>item.p2pId && ele.id.toString()===item.p2pId.toString())
            item.supplier=supplier.data.records.find(ele=>item.supplierId && ele.id.toString()===item.supplierId.toString())
          })
          this.users={
            list:user.data.records,
            current:user.data.current,
            size:user.data.size,
            total:user.data.total
          }
          console.log(this.users)
        })
      },
      onSearch(){
        this.getUserList()
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onChangePage(p){
        this.getUserList(p, this.searchParams.size)
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onChangeSize(size){
        this.getUserList( this.searchParams.p,size)
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onClear(){
        this.searchParams={}
      },
    }
  }
</script>

<style scoped>

</style>
