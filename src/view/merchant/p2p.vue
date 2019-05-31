<template>
  <div>
    <Row :gutter="15" class="search-bar">
      <Col :xxl="7" :xl="8" :lg="9" :md="10">
        <div class="title">搜索</div>
        <Input v-model="searchParams[keywordType]" clearable>
          <Select v-model="keywordType" @on-change="changeKeywordType" style="width:80px" slot="prepend">
            <Option value="name">按名称</Option>
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
          <Button type="primary" icon="md-add-circle" @click="p2pModal()">新增平台</Button>
        </div>
        <Page :current="p2ps.current" :total="p2ps.total" :page-size="p2ps.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator />
      </div>
      <table class="table padding-10 hover hide-checkbox-label">
        <tr class="header">
          <td width="15%" class="center">平台信息</td>
          <td width="25%" class="center">签约信息</td>
          <td class="center">平台参数</td>
          <td class="center">API参数</td>
          <td class="center">当日销售额</td>
          <td width="230" class="center">操作</td>
        </tr>
        <tbody>
        <tr v-for="(p2p,i) in p2ps.list" :key="i">
          <td>
            <p><strong>{{p2p.name}}</strong></p>
            <p>{{p2p.id.toString()}}</p>
            <p v-if="p2p.website"><a :href="'http://www.responsinator.com/?url='+encodeURIComponent(p2p.website)" target="_blank">{{p2p.website}}</a></p>
          </td>
          <td >
            <p>名称：{{p2p.companyName}}</p>
            <p>法人：{{p2p.legalName}} &nbsp;&nbsp;&nbsp;&nbsp; 手机：{{p2p.mobile}}</p>
            <p>地址：{{p2p.address}}</p>
          </td>
          <td>
            <p>最低消费额：{{p2p.minAmount}} 元</p>
            <p>消费浮动额：{{p2p.diffAmount}} 元</p>
            <p>授权有效期：{{p2p.oauthTime}} 小时</p>
          </td>
          <td>
            <p>接口密钥：{{p2p.secret}}</p>
            <p>回调地址：{{p2p.noticeUrl}}</p>
          </td>
          <td class="center">{{p2p.salesAmount}}</td>
          <td class="center">
            <ButtonGroup style="margin:5px;">
              <Button type="primary" icon="md-build" @click="p2pModal(p2p)">编辑信息</Button>
              <Button type="primary" icon="md-cloud-upload" @click="importMemberModal(p2p)">导入会员</Button>
            </ButtonGroup>
            <ButtonGroup style="margin:5px;">
              <Button type="primary" ghost icon="md-hand" :disabled="p2p.customerId!=null&&p2p.legalCustomerId!=null" @click="fadadaCert(p2p,i)">平台认证</Button>
              <Button type="primary" ghost icon="md-ribbon" :disabled="p2p.signId!=null" @click="fadadaSign(p2p,i)">获取签章</Button>
            </ButtonGroup>
          </td>
        </tr>

        </tbody>
      </table>
      <Page :current="p2ps.current" :total="p2ps.total" :page-size="p2ps.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="margin-top:10px;text-align:right" />
    </div>
    <Modal v-model="importModal" :title="'导入会员 - 平台：'+importForm.companyName" footer-hide>
      <div v-if="importForm" style="text-align:center;padding:30px 0">
        <Upload action="/p2p/import/member" :show-upload-list="false" :data="{p2pId:importForm.id.toString()}" :headers="{ accessToken: token }"
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :on-progress="uploadProgress"
                :on-error="uploadError"
                :on-success="uploadSuccess">
          <Button type="primary" :loading="uploadLoading" icon="md-cloud-upload">选择EXCEL文件</Button>
          <div style="margin:20px 15% 0 15%;text-align:left;line-height:30px" slot="tip">
            <p>1.<a href="https://s.yliao.com/doc/import_oauth.xls">下载数据模板</a>,请将数据粘贴到模板上</p>
            <p>2.不要更改第一行文字，<span style="color:red">将所有列都转成文本格式</span></p>
            <p>3.如果导入的行数较多，系统会在后台静默执行</p>
          </div>
        </Upload>
      </div>
    </Modal>
    <Modal v-model="p2pModalShow" :mask-closable="false" :loading="saveLoading" :title="formData.id?'编辑平台信息':'新增平台'" @on-ok="saveP2P">
      <Form ref="formValidate" :model="formData" :rules="formValidate" :label-width="90">
      <Collapse v-model="collapse" accordion>
        <Panel name="1">
          <strong>平台信息</strong>
          <div style="margin-top:15px;" slot="content">
            <FormItem label="平台名称" prop="name">
              <Input v-model="formData.name" placeholder="P2P平台名称" style="width:90%" />
            </FormItem>
            <FormItem label="商城网址">
              <Input v-model="formData.website" placeholder="分配给P2P平台的商城网址，https://demo.yliao.com" style="width:90%" />
            </FormItem>
            <FormItem label="签约主体" prop="companyName">
              <Input v-model="formData.companyName" placeholder="用于电子合同签约的公司主体名称" style="width:90%" />
            </FormItem>
            <FormItem label="公司地址">
              <Input v-model="formData.address" placeholder="签约公司地址" style="width:90%" />
            </FormItem>
            <FormItem label="信用代码">
              <Input v-model="formData.creditCode" style="width:250px;margin-bottom:5px;" />
              <upload-image-upyun :img-list="formData.creditCodeFile" size="normal" :maxLength="1" @on-success="uploadPicSuccess('credit')" @on-remove="uploadPicRemove('credit')"></upload-image-upyun>
            </FormItem>
            <FormItem label="委托书">
              <upload-image-upyun :img-list="formData.powerAttorneyFile" size="normal" :maxLength="1" @on-success="uploadPicSuccess('power')" @on-remove="uploadPicRemove('power')"></upload-image-upyun>
            </FormItem>
            <FormItem label="法人名称">
              <Input v-model="formData.legalName" style="width:150px" />
            </FormItem>
            <FormItem label="法人身份证">
              <Input v-model="formData.identity" style="width:200px" />
            </FormItem>
            <FormItem label="联系电话">
              <Input v-model="formData.mobile" style="width:150px" />
            </FormItem>
          </div>
        </Panel>
        <Panel name="2">
          <strong>参数配置</strong>
          <div style="margin-top:15px;" slot="content">
            <FormItem label="最低消费额" prop="minAmount">
              <Input type="number" v-model="formData.minAmount" number style="width:100px" /> 元
            </FormItem>
            <FormItem label="允许浮动额" prop="diffAmount">
              <Input type="number" v-model="formData.diffAmount" number style="width:100px" /> 元
            </FormItem>
            <FormItem label="授权有效期" prop="oauthTime">
              <Input type="number" v-model="formData.oauthTime" number style="width:100px" /> 小时
            </FormItem>
          </div>
        </Panel>
        <Panel name="3">
          <strong>接口配置</strong>
          <div style="margin-top:15px;" slot="content">
            <FormItem label="接口密钥">
              <Input v-model="formData.secret" icon="md-sync" @on-click="randomSecret" style="width:90%" />
            </FormItem>
            <FormItem label="回调接口">
              <Input v-model="formData.notifyUrl" style="width:90%" />
            </FormItem>
          </div>
        </Panel>
      </Collapse>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import $cookies from 'vue-cookies'
  import {randomString} from "../../utils"
  import $P2PService from '../../service/p2p'
  import UploadImageUpyun from '../../components/UploadImageUpyun'
  export default {
    data(){
      return {
        uploadLoading:false,
        token:$cookies.get('AUTH_TOKEN'),
        saveLoading:true,
        keywordType:'name',
        importModal:false,
        p2pModalShow:false,
        collapse:'1',
        formData:{
          secret:randomString(),
          creditCodeFile:[],
          powerAttorneyFile:[],
          oauthTime:'48'
        },
        importForm:{
          id:0
        },
        formValidate:{
          name:[
            { required: true, message: '请填写平台名称', trigger: 'blur' }
          ],
          companyName:[
            {required:true, message: '请填写签约主体名称', trigger: 'blur'}
          ],
          minAmount:[
            {required:true,type:'number', message: '请设置最低消费金额', trigger: 'blur'}
          ],
          diffAmount:[
            {required:true,type:'number', message: '请设置消费浮动金额', trigger: 'blur'}
          ],
          oauthTime:[
            {required:true,type:'number', message: '请设置授权过期时间', trigger: 'blur'}
          ]
        },
        searchParams:{
          id:this.$route.query.memberId,
          name:this.$route.query.memberAccount,
          p:this.$route.query.p,
          size:this.$route.query.size
        },
        p2ps:{
          list:[],
          current:1,
          p:1,
          size:20,
          total:0
        },
      }
    },
    components:{
      UploadImageUpyun
    },
    created(){
      this.getList()
    },
    methods:{
      saveP2P(){
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            var formData={...this.formData}
            formData.creditCodeFile=formData.creditCodeFile.join(',')
            formData.powerAttorneyFile=formData.powerAttorneyFile.join(',')
            let service=(formData.id)?$P2PService.update(formData):$P2PService.insert(formData)
            service.then(res=>{
              if(res.code===1){
                this.p2pModalShow=false
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
      p2pModal(item=null){
        this.$refs['formValidate'].resetFields()
        this.collapse='1'
        this.p2pModalShow=true
        if(item){
          var obj = {...item}
          delete obj.salesAmount
          delete obj.banner
          obj.creditCodeFile=[item.creditCodeFile]
          obj.powerAttorneyFile=[item.powerAttorneyFile]
          this.formData=obj
        }else{
          this.formData={
            secret:randomString(),
            creditCodeFile:[],
            powerAttorneyFile:[],
            oauthTime:'48'
          }
        }
      },
      importMemberModal(item){
        this.importModal=true
        this.importForm={...item}
      },
      uploadProgress(){
        this.uploadLoading=true
      },
      uploadSuccess(res){
        if (res.code===1){
          this.$Message.success('会员数据导入成功')
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
      fadadaCert(item,i){
        $P2PService.fadadaCert(item.id.toString()).then(res=>{
          if (res.code===1){
            this.$Message.success('电子合同平台认证成功')
            item=res.data
            this.$set(this.p2ps.list,i,item)
          }else{
            this.$Message.error(res.msg)
          }
        })
      },
      fadadaSign(item,i){
        $P2PService.fadadaSign(item.id.toString()).then(res=>{
          if (res.code===1){
            this.$Message.success('电子签章获取成功')
            item=res.data
            this.$set(this.p2ps.list,i,item)
          }else{
            this.$Message.error(res.msg)
          }
        })
      },
      randomSecret(){
        if(this.formData.id){
          this.$Modal.confirm({
            title:'系统警告',
            content:'重置密钥会导致合作方已对接接口失效，确定要重置密钥吗？重置后请及时告知调整。',
            onOk:()=>{
              this.formData.secret=randomString()
            }
          })
        }else{
          this.formData.secret=randomString()
        }

      },
      getList(p=1,size=20){
        this.searchParams.size=size
        this.searchParams.p=p
        $P2PService.select(this.searchParams).then(res=>{
          if (res.code===1){
            this.p2ps={
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
          delete searchParams.name
        }
        if (value=='name'){
          delete searchParams.id
        }
        this.searchParams=searchParams
      }
    }

  }
</script>

<style scoped>

</style>
