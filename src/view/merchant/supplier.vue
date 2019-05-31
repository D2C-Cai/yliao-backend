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
          <Button type="primary" icon="md-add-circle" @click="supplierModal()">新增供应商</Button>
        </div>
        <Page :current="suppliers.current" :total="suppliers.total" :page-size="suppliers.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator />
      </div>
      <table class="table padding-10 hover hide-checkbox-label">
        <tr class="header">
          <td width="15%" class="center">ID</td>
          <td class="center">供应商名称</td>
          <td class="center">联系方式</td>
          <td width="25%" class="center">创建时间</td>
          <td width="100" class="center">操作</td>
        </tr>
        <tbody>
        <tr v-for="(supplier,i) in suppliers.list" :key="i">
          <td class="center">
            {{supplier.id.toString()}}
          </td>
          <td class="center">
            {{supplier.name}}
          </td>
          <td class="center">
            {{supplier.mobile}}
          </td>
          <td class="center">
            {{supplier.createDate}}
          </td>
          <td class="center">
            <Button type="primary" icon="md-build" @click="supplierModal(supplier)">编辑信息</Button>
          </td>
        </tr>
        </tbody>
      </table>
      <Page :current="suppliers.current" :total="suppliers.total" :page-size="suppliers.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="margin-top:10px;text-align:right" />
    </div>
    <Modal v-model="supplierModalShow" :mask-closable="false" width="450" :loading="saveLoading" :title="formData.id?'编辑供应商信息':'新增供应商'" @on-ok="saveSupplier">
      <Form ref="formValidate" :model="formData" :rules="formValidate" :label-width="90">
          <FormItem label="供应商名称" prop="name">
            <Input v-model="formData.name" placeholder="供应商名称" style="width:90%" />
          </FormItem>
          <FormItem label="联系方式">
            <Input v-model="formData.mobile" style="width:90%" />
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import $SupplierService from '../../service/supplier'
  export default {
    data(){
      return {
        uploadLoading:false,
        saveLoading:true,
        keywordType:'name',
        supplierModalShow:false,
        formData:{
        },
        formValidate:{
          name:[
            { required: true, message: '请填写供应商名称', trigger: 'blur' }
          ]
        },
        searchParams:{
          id:this.$route.query.memberId,
          name:this.$route.query.memberAccount,
          p:this.$route.query.p,
          size:this.$route.query.size
        },
        suppliers:{
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
      saveSupplier(){
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            var formData={...this.formData}
            let service=(formData.id)?$SupplierService.update(formData):$SupplierService.insert(formData)
            service.then(res=>{
              if(res.code===1){
                this.supplierModalShow=false
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
      supplierModal(item=null){
        this.$refs['formValidate'].resetFields()
        this.supplierModalShow=true
        if(item){
          var obj = {...item}
          this.formData=obj
        }else{
          this.formData={}
        }
      },
      getList(p=1,size=20){
        this.searchParams.size=size
        this.searchParams.p=p
        $SupplierService.select(this.searchParams).then(res=>{
          if (res.code===1){
            this.suppliers={
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
