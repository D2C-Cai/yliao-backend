<template>
  <div>
    <div class="list-buttons-bar no-margin">
      <div>
        <Button type="primary" icon="md-add-circle" @click="freightModal()">新增运费模板</Button>
      </div>
      <Page :current="freights.current" :total="freights.total" :page-size="freights.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator />
    </div>
    <table class="table padding-10 hover hide-checkbox-label">
      <tr class="header">
        <td width="15%" class="center">名称</td>
        <td class="center">规则</td>
        <td width="25%" class="center">创建时间</td>
        <td width="100" class="center">操作</td>
      </tr>
      <tbody>
      <tr v-for="(freight,i) in freights.list" :key="i">
        <td >
          {{freight.name}}
        </td>
        <td>
          <span style="display:inline-block;width:50px;">{{freight.formula}}</span> <span style="color:#999;font-size:12px;border-left:1px solid #CCC;padding-left:20px;">{{freight.formula | freightInfo}}</span>
        </td>
        <td class="center">
          {{freight.createDate}}
        </td>
        <td class="center">
          <Button type="primary" icon="md-build" @click="freightModal(freight)">编辑信息</Button>
        </td>
      </tr>
      </tbody>
    </table>
    <Page :current="freights.current" :total="freights.total" :page-size="freights.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="margin-top:10px;text-align:right" />
    <Modal v-model="freightModalShow" :mask-closable="false" width="450" :loading="saveLoading" :title="formData.id?'编辑运费模板':'新增运费模板'" @on-ok="saveFreight">
      <Form ref="formValidate" :model="formData" :rules="formValidate" :label-width="90">
        <FormItem label="模板名称" prop="name">
          <Input v-model="formData.name" placeholder="请填写模板名称" style="width:90%" />
        </FormItem>
        <FormItem label="运费规则" prop="formula" required>
          首件运费 <Input v-model="formData.ruleFirst" style="width:50px" /> 元,每增加1件收 <Input v-model="formData.ruleSecond" style="width:50px" /> 元
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import $FreightService from '../../service/freight'
  export default {
    data(){
      const ruleValidate = (rule, value, callback) => {
        var array=value.split(':')
        if (array[0] === '' || array[1]==='') {
          callback(new Error('请输入运费规则'));
        } else {
          callback();
        }
      };
      return {
        uploadLoading:false,
        saveLoading:true,
        keywordType:'name',
        freightModalShow:false,
        formData:{
          name:null,
          ruleFirst:10,
          ruleSecond:10
        },
        formValidate:{
          name:[
            { required: true, message: '请填写运费模板名称', trigger: 'blur' }
          ],
          formula:[
            {validator: ruleValidate, trigger: 'blur'}
          ],
        },
        searchParams:{
          id:this.$route.query.memberId,
          name:this.$route.query.memberAccount,
          p:this.$route.query.p,
          size:this.$route.query.size
        },
        freights:{
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
      saveFreight(){
        this.formData.formula=this.formData.ruleFirst+':'+this.formData.ruleSecond
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            var formData={...this.formData}
            let service=(formData.id)?$FreightService.update(formData):$FreightService.insert(formData)
            service.then(res=>{
              if(res.code===1){
                this.freightModalShow=false
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
      freightModal(item=null){
        this.$refs['formValidate'].resetFields()
        this.freightModalShow=true
        if(item){
          var obj = {...item}
          var [ruleFirst,ruleSecond]=obj.formula.split(':')
          this.formData=obj
          this.formData.ruleFirst=ruleFirst
          this.formData.ruleSecond=ruleSecond
        }else{
          this.formData={
            name:null,
            ruleFirst:10,
            ruleSecond:10
          }
        }
      },
      getList(p=1,size=20){
        this.searchParams.size=size
        this.searchParams.p=p
        $FreightService.select(this.searchParams).then(res=>{
          if (res.code===1){
            this.freights={
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
