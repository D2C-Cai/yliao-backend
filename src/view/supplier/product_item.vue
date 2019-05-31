<template>
  <div>
    <Alert type="warning" banner show-icon>编辑商品会暂时在前台下架商品，需要通过运营进行重新上架</Alert>
    <Form ref="formValidate" :model="formData" :rules="formValidate">
      <Tabs value="name1">
        <TabPane label="基本属性" name="name1">
          <Row :gutter="15" style="margin-top:20px;">
            <Col span="2" class="form-label">选择分类</Col>
            <Col span="4">
              <FormItem prop="categoryId">
                <ProductCategoryCascadar v-model="formData.categoryId" :category-id="formData.categoryId" :clearable="false" />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="15">
            <Col span="2" class="form-label">商品标题</Col>
            <Col span="8">
              <FormItem prop="name">
                <Input v-model="formData.name" placeholder="请输入商品标题"></Input>
              </FormItem>
            </Col>
            <Col span="2" class="form-label">商品货号</Col>
            <Col span="4">
              <FormItem prop="sn">
                <Input v-model="formData.sn" placeholder="商品货号"></Input>
              </FormItem>
            </Col>
          </Row>
          <Divider />
          <Row :gutter="15">
            <Col span="2" class="form-label">规格列表</Col>
            <Col span="22">
              <Row>
                <Col>
                  <Select v-model="standardGroupModel" placeholder="选择预设规格组" @on-change	="onChangeStandardGroup" style="width:150px;margin-right:15px;" clearable>
                    <Option v-for="(item,i) in preStandardGroup" :value="i" :key="item.label">{{ item.label }}</Option>
                  </Select>
                  <Poptip placement="right">
                    <Button type="info">增加规格组</Button>
                    <div style="padding:10px 0;text-align:center" slot="content">
                      <Input v-model="newGroupName" placeholder="输入规格组名称" style="width:120px;margin-right:10px;"/> <Button type="primary" @click="addNewStandardGroup">OK</Button>
                    </div>
                  </Poptip>
                  <Button style="margin-left:10px;" type="text" @click="setStandardGroup=!setStandardGroup">
                    {{setStandardGroup?'隐藏':'显示'}}规格组设置
                    <Icon :type="!setStandardGroup?'md-arrow-dropdown':'md-arrow-dropup'"></Icon>
                  </Button>
                </Col>
              </Row>
              <Row v-if="standards.length>0 && setStandardGroup" style="margin-top:15px;padding-top:10px;border-top:1px solid #EDEDED;">
                <Col span="10">
                  <table class="table">
                    <tr>
                      <th width="80">组名</th>
                      <th>规格值</th>
                      <th width="50">删除</th>
                    </tr>
                    <tr v-for="(item,i) in standards">
                      <td class="center"><Input v-model="item.name" @on-change="changeSkuList" /></td>
                      <td>
                        <div style="display:flex;flex-wrap: wrap;align-items: center">
                          <template v-if="item.values.length>0">
                            <template v-for="(itemValue,ii) in item.values">
                              <Input v-model="item.values[ii]" @on-change="changeSkuList" style="width:90px;margin:2px 4px 2px 0;">
                                <Icon type="md-close" @click="deleteStandardValue(i,ii)" slot="suffix" class="cursor-pointer" />
                              </Input>
                            </template>
                          </template>
                          <Tooltip content="新增规格值" placement="right">
                            <Icon type="md-add-circle" size="20" @click="addStandardValue(i)" color="#2db7f5" class="cursor-pointer" />
                          </Tooltip>
                        </div>
                      </td>
                      <td class="center"><Icon type="md-close-circle" size="20" color="#F43333" @click="deleteStandardGroup(i)" class="cursor-pointer" /></td>
                    </tr>
                  </table>
                </Col>
              </Row>
              <FormItem prop="skuList">
                <Row v-if="formData.skuList.length>0" style="margin-top:15px;padding-top:10px;border-top:1px solid #EDEDED;">
                  <Col span="16">
                    <table class="table">
                      <tr>
                        <th width="15%">货号 <Tooltip content="自动填充货号" placement="top"><Icon type="md-refresh" class="cursor-pointer" color="#2db7f5" @click="autoFillSN" /></Tooltip></th>
                        <th width="13%">规格</th>
                        <th width="7%">市场价 <Tooltip content="同步市场价" placement="top"><Icon type="md-refresh" class="cursor-pointer" color="#2db7f5" @click="syncProperty('marketPrice')" /></Tooltip></th>
                        <th width="7%">销售价 <Tooltip content="同步销售价" placement="top"><Icon type="md-refresh" class="cursor-pointer" color="#2db7f5" @click="syncProperty('sellPrice')" /></Tooltip></th>
                        <th width="7%">供货价 <Tooltip content="同步供货价" placement="top"><Icon type="md-refresh" class="cursor-pointer" color="#2db7f5" @click="syncProperty('costPrice')" /></Tooltip></th>
                        <th width="7%">库存 <Tooltip content="同步库存" placement="right"><Icon type="md-refresh" class="cursor-pointer" color="#2db7f5" @click="syncProperty('stock')" /></Tooltip></th>
                        <th width="5%">状态</th>
                        <th width="5%">删除</th>
                      </tr>
                      <tr v-for="(sku,i) in formData.skuList">
                        <td class="center"><Input v-model="sku.sn" clearable /></td>
                        <td class="center">{{sku.standard | formatStandard}}</td>
                        <td class="center"><Input type="number" :disabled="formData.id!=undefined" v-model="sku.marketPrice" /></td>
                        <td class="center"><Input type="number" :disabled="formData.id!=undefined" v-model="sku.sellPrice" /></td>
                        <td class="center"><Input type="number" :disabled="formData.id!=undefined" v-model="sku.costPrice" /></td>
                        <td class="center"><Input type="number" v-model="sku.stock" /></td>
                        <td class="center"><i-switch disabled v-model="sku.status" :true-value="1" :false-value="0"></i-switch></td>
                        <td class="center"><Icon type="md-close-circle" size="20" color="#F43333" class="cursor-pointer" @click="deleteSkuItem(i)" /></td>
                      </tr>
                    </table>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Divider />

          <Row :gutter="15">
            <Col span="2" class="form-label">选择品牌</Col>
            <Col span="4">
              <FormItem prop="brandId">
                <BrandSelect v-model="formData.brandId" :brand-id="formData.brandId.toString()" />
              </FormItem>
            </Col>
            <Col span="2" class="form-label">运费</Col>
            <Col span="4" prop="freight">
              <FormItem>
                <Select v-model="formData.freight">
                  <Option v-for="(option, index) in freightList" :value="option.formula" :key="index">{{option.formula}} | {{option.name}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>

          <Row :gutter="15">
            <Col span="2" class="form-label">商品图片</Col>
            <Col span="12">
              <FormItem prop="pic">
                <upload-image-upyun :img-list="formData.pic" @on-success="uploadImageSuccess" @on-remove="uploadImageRemove"></upload-image-upyun>
              </FormItem>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="内容详情" name="name2">
          <div style="padding-bottom:20px;">
            <vue-ueditor-wrap v-model="formDetail.content" :config="editorConfig" :destroy="false" @ready="editorReady"></vue-ueditor-wrap>
          </div>
        </TabPane>
      </Tabs>
      <FormItem style="text-align:center">
        <Button type="primary" size="large" :loading="buttonLoading" @click="handleSubmit" style="width:80px;margin-right:20px;">确定</Button>
        <Button type="default" size="large" @click="handleDraft" style="margin-right:5px;">保存到草稿箱</Button>
        <Tooltip content="只限本地保存，提交成功后删除" placement="right">
          <Icon type="md-help-circle" size="18" color="#2d8cf0" />
        </Tooltip>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import $ProductService from '../../service/product'
  import $ProductDetailService from '../../service/productDetail'
  import $FreightService from '../../service/freight'
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import ProductCategoryCascadar from '../../components/ProductCategoryCascadar'
  import BrandSelect from '../../components/BrandSelect'
  import UploadImageUpyun from '../../components/UploadImageUpyun'
  import {upyunSignature,discountCaculate} from './../../utils'
  export default {
    data () {
      const skuValidate=(rule, value, callback)=>{
        if (value.length==0){
          callback(new Error('请至少填写一个sku'))
        }else{
          let snArray=value.filter(item=>item.sn===null||item.sn==='')
          let markerPriceArray=value.filter(item=>item.marketPrice==null||item.marketPrice==='')
          let costPriceArray=value.filter(item=>item.costPrice===null||item.costPrice==='')
          let sellPriceArray=value.filter(item=>item.sellPrice===null||item.sellPrice==='')
          let stockArray=value.filter(item=>item.stock===null||item.stock==='')
          let ratioArray=value.filter(item=>item.ratio===null||item.ratio==='')
          if(snArray.length>0||markerPriceArray.length>0||costPriceArray.length>0||sellPriceArray.length>0||stockArray.length>0||ratioArray.length>0){
            callback(new Error('请完整填写所有SKU属性'))
          }else{
            callback()
          }
        }
      }
      const picValidate=(rule, value, callback)=>{
        if (value.length==0){
          callback(new Error('请上传图片'))
        }else{
          callback()
        }
      }
      return {
        buttonLoading:false,
        productId:this.$route.params.id,
        formData: {
          name: '',
          categoryId:'',
          pic: [],
          sn:'',
          standard:null,
          skuList:[
            {id:null,sn:null,standard:[{name:'规格',value:'默认1'}],marketPrice:null,sellPrice:null,costPrice:null,stock:null,status:1,radio:null}
          ],
          supplierId:this.LocalStorage.getItem('USER_INFO').supplierId,
          brandId:0,
          freight:null
        },
        formDetail:{
          id:null,
          productId:null,
          content:''
        },
        formValidate:{
          categoryId:[
            { required: true, message: '请选择分类', trigger: 'change' }
          ],
          name:[
            { required: true, message: '请填写商品标题', trigger: 'blur' }
          ],
          sn:[
            { required: true, message: '请填写商品货号', trigger: 'blur' }
          ],
          brandId:[
            { required: true, message: '请选择品牌', trigger: 'change' }
          ],
          supplierId:[
            { required: true, message: '请选择供应商', trigger: 'change' }
          ],
          freight:[
            { required: true, message: '请选择运费模板', trigger: 'change' }
          ],
          skuList:[
            {validator:skuValidate}
          ],
          pic:[
            {validator:picValidate}
          ]
        },
        freightList:[],
        newGroupName:'规格',
        standards:[
          {name:'规格',values:['默认1']}
        ],
        setStandardGroup:this.$route.params.id?false:true,
        standardGroupModel:0,
        preStandardGroup:[
          {label:'默认',value:['规格']},
          {label:'服装类',value:['颜色','尺码']},
          {label:'配饰类',value:['颜色','尺寸']},
          {label:'电器类',value:['型号','系列']},
          {label:'食品类',value:['包装','重量']},
          {label:'酒水类',value:['品种']}
        ],
        editorConfig: {
          // 你的UEditor资源存放的路径,相对于打包后的index.html
          UEDITOR_HOME_URL: '/editor/',
          // 编辑器不自动被内容撑高
          upyunSignature:upyunSignature(),
          imageUrlPrefix:process.env.VUE_APP_IMG_URL,
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 600,
          // 关闭自动保存
          enableAutoSave: false
        },
      }
    },
    components:{
      UploadImageUpyun,
      [ProductCategoryCascadar.name]:ProductCategoryCascadar,
      [VueUeditorWrap.name]:VueUeditorWrap,
      [BrandSelect.name]:BrandSelect
    },
    computed: {
      ...mapState({
        referer: state => state.referer
      })
    },
    created(){
      if (this.productId){
        this.getProduct()
        this.getContent()
      }else{
        let draft=this.LocalStorage.getItem('DRAFT_PRODUCT')
        if (draft){
          this.$Notice.success({
            name:'draft-notice',
            title: '是否载入草稿？',
            duration:0,
            render: h => {
              return h('span', [
                h('Button',{'style':{'marginRight':'10px'},'attrs':{'type':'primary'},
                  on: {
                    'click': () => this.loadDraft()
                  }
                },'载入'),
                h('Button',{
                  on: {
                    click:  () => this.cleanDraft()
                  }
                },'清空'),
              ])
            }
          });
        }

      }
      this.getFreight()
    },
    methods:{
      handleSubmit(){
        this.buttonLoading=true
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            var formData={...this.formData}
            formData.pic=formData.pic.join(',')
            formData.price = Math.min(...(formData.skuList.map(item => item.sellPrice)))
            formData.marketPrice = Math.min(...(formData.skuList.map(item => item.marketPrice)))
            formData.skuList = formData.skuList.map(item => ({
              ...item,
              standard: JSON.stringify(item.standard),
              ratio:discountCaculate(item.costPrice,item.sellPrice),
              brandId: formData.brandId,
              supplierId: formData.supplierId,
              freight: formData.freight,
              productId: formData.id ? formData.id.toString() : undefined
            }))
            formData.ratio=formData.skuList[0].ratio
            // 库存是所有skulist 里面 stock的和
            formData.stock = formData.skuList.map(item => item.stock).reduce((total, num) => total + num)
            formData.status=0//供应商不管编辑还是新增都默认下架,管理不用管
            if (formData.id){
              this.updateProduct(formData)
            }else{
              this.insertProduct(formData)
            }
          }else{
            this.buttonLoading=false
            return false
          }
        })
      },
      handleDraft(){
        var formData={...this.formData}
        if (formData.id) delete formData.id
        if (formData.skuList) formData.skuList.map(item=>{
          delete item.id
        })
        this.LocalStorage.setItem('DRAFT_PRODUCT',{info:formData,standards:this.standards,content:this.formDetail.content})
        this.$Message.success('成功保存到草稿箱')
      },
      insertProduct(data){
        $ProductService.insert(data).then(res=>{
          if (res.code===1){
            let formDetail={
              productId:res.data.id.toString(),
              content:this.formDetail.content
            }
            this.insertProductDetail(formDetail)
            this.$Modal.confirm({
              title:'系统提示',
              content:'商品添加成功！是否继续添加？',
              okText:'继续添加',
              cancelText:'返回列表',
              onCancel:()=>{
                this.$router.push('/supplier/product/list')
              }
            })
            this.LocalStorage.removeItem('DRAFT_PRODUCT')
          }else{
            this.LocalStorage.setItem('DRAFT_PRODUCT',{info:data,standards:this.standards,content:this.formDetail.content})
            this.$Message.error(res.msg);
          }
        })
      },
      updateProduct(data){
        $ProductService.update(data).then(res=>{
          if (res.code===1){
            if (this.formDetail.id){
              this.updateProductDetail(this.formDetail)
            }else{
              let formDetail={
                productId:res.data.id.toString(),
                content:this.formDetail.content
              }
              this.insertProductDetail(formDetail)
            }
            this.$Message.success('商品更新成功')
            setTimeout(()=>{
              if (this.referer.fullPath){
                this.$router.push(this.referer.fullPath)
              }else{
                this.$router.go(-1)
              }
            },800)

          }else{
            this.$Message.error(res.msg);
          }
        })
      },
      insertProductDetail(data){
        $ProductDetailService.insert(data).then(res=>{
          setTimeout(()=>{
            this.buttonLoading=false
          },1000)
          if (res.code!=1){
            this.$Message.error(res.msg);
          }
        })
      },
      updateProductDetail(data){
        $ProductDetailService.update(data).then(res=>{
          setTimeout(()=>{
            this.buttonLoading=false
          },1000)
          if (res.code!=1){
            this.$Message.error(res.msg);
          }
        })
      },
      loadDraft(){
        let data=this.LocalStorage.getItem('DRAFT_PRODUCT')
        data.info.pic=typeof(data.info.pic)=='string'?data.info.pic.split(','):data.info.pic
        this.formData=data.info
        this.standards=data.standards
        this.formDetail.content=data.content
        this.$Notice.destroy()
      },
      cleanDraft(){
        this.LocalStorage.removeItem('DRAFT_PRODUCT')
        this.$Notice.destroy()
      },
      autoFillSN(){
        if (this.formData.skuList[0].sn!=''&&this.formData.skuList[0].sn!=null){
          this.$Modal.confirm({
            title:'系统警告',
            content:'当前SKU货号不为空，确定要将所有SKU货号重置吗？重置后货号将统一设置为商品货号+序号。',
            onOk: () => {
              this.formData.skuList.map((item,i)=>{
                item.sn=this.formData.sn.toString()+(this.formData.skuList.length>1?'-'+(i+1):'')
              })
            }
          })
        }else{
          this.formData.skuList.map((item,i)=>{
            item.sn=this.formData.sn.toString()+(this.formData.skuList.length>1?'-'+(i+1):'')
          })
        }

      },
      syncProperty(type){
        this.formData.skuList.map((item)=>{
          item[type]=this.formData.skuList[0][type]
        })
      },
      getProduct(){
        $ProductService.id(this.productId).then(res=>{
          if (res.code===1){
            res.data.skuList.forEach(e => {
              e.id = e.id.toString()
              e.standard = JSON.parse(e.standard)
            })
            this.dealStandard(res.data.skuList)
            this.changeSkuList()
            res.data.pic=res.data.pic.split(',')
            res.data.categoryId=res.data.categoryId.toString()
            res.data.brandId=res.data.brandId.toString()
            res.data.supplierId=res.data.supplierId.toString()
            this.formData={...res.data}
            console.log(this.formData)
          }else{
            this.$Message.error('对不起，无法找到商品')
          }
        })
      },
      getContent(){
        $ProductDetailService.select({productId:this.productId}).then(res=>{
          if (res.code===1 && res.data.records.length==1){
            this.formDetail={
              id:res.data.records[0].id,
              productId:res.data.records[0].productId,
              content:res.data.records[0].content
            }
          }
        })
      },
      getFreight(){
        $FreightService.select({ps:1000}).then(res=>{
          if (res.code===1){
            this.freightList=res.data.records
          }
        })
      },
      addNewStandardGroup(){
        if (this.standards.length<3){
          this.standards.push({name:this.newGroupName,values:[]})
          this.setStandardGroup=true
        }else{
          this.$Message.error('最多只能添加三组规格')
        }
      },
      deleteStandardGroup(i){
        if (this.standards.length==1){
          this.$Message.error('至少要保留一个规格组')
          return false
        }
        this.$Modal.confirm(
          {
            title: '警告',
            content: '确定要删除整个规格组吗？',
            onOk: () => {
              this.standards.splice(i,1)
              this.changeSkuList()
            },
            onCancel: () => {

            }
          }
        )
      },
      //删除规格值
      deleteStandardValue(i,ii){
        let standard=[...this.standards]
        if(standard.length==1 && standard[i].values.length==1){
          this.$Message.error('至少要保留一个规格')
          return false
        }
        let name=standard[i].name
        let value=standard[i].values[ii]
        let result=this.formData.skuList.find(item=>item.standard.find(element=>element.name==name&&element.value==value))
        if (result && result.id){
          this.$Message.error('有关联SKU，无法直接删除')
          return false
        }
        standard[i].values.splice(ii,1)
        if (standard[i].values.length==0){
          standard.splice(i,1)
        }
        this.standards=standard
        this.changeSkuList()
      },
      //增加规格值
      addStandardValue(i){
        var standard=this.standards
        standard[i].values.push('默认'+(standard[i].values.length+1))
        this.standard=standard
        this.changeSkuList()
      },
      deleteSkuItem(i){
        if (this.formData.skuList.length==1){
          this.$Message.error('至少要保留一个SKU')
          return false
        }
        if (this.formData.skuList[i].id){
          this.$Modal.confirm({
            title:'系统警告',
            content:'确定要删除该SKU吗？该操作在提交表单后生效。',
            onOk:()=>{
              this.formData.skuList.splice(i,1)
              this.dealStandard(this.formData.skuList)
            }
          })
        }else{
          this.formData.skuList.splice(i,1)
          this.dealStandard(this.formData.skuList)
        }
      },
      //选择规格组
      onChangeStandardGroup(i){
        if (i>=0){
          let have=this.standards.find(item=>item.values.length>0)
          if (have){
            this.$Modal.confirm(
              {
                title: '警告',
                content: '你已经操作了部分规格值，切换规格组将丢失部分已经设置好的项目！确定要切换吗？',
                onOk: () => {
                  this.changeStandardGroup(i)
                },
                onCancel: () => {

                }
              }
            )
          }else{
            this.changeStandardGroup(i)
          }
        }
      },
      //规格组变化
      changeStandardGroup(i){
        var standard=[]
        this.preStandardGroup[i].value.forEach((item,ii)=>{
          standard.push({
            name:item,
            values:this.standards[ii]?this.standards[ii].values:[]
          })
        })
        this.standards=standard
      },
      changeSkuList(){
        const standardList = this.dealwith(this.standards)
          .reduce((a, b) =>
            a.reduce((r, v) =>
              r.concat(b.map(w => {
                  if (Array.isArray(v)) return Array.of(v[0], v[1], w)
                  return [v, w]
                }
              )), []))
        console.log(standardList)
        this.formData.skuList = standardList.map((item, index) => {
          return  this.formData.skuList[index] ? { ...this.formData.skuList[index], standard: Array.isArray(item) ? [...item] : [ item ] } :{
            standard: Array.isArray(item) ? [...item] : [ item ],
            sellPrice: null,
            marketPrice: null,
            stock: null,
            status:1
          }
        })
        //console.log(this.formData.skuList)
      },
      dealwith (params) {
        const specObj = {}
        params.forEach((element, index) => {
          specObj[`sp${index}`] = element.values.map(item => ({ name: element.name, value: item }))
        })
        return Object.values(specObj)
      },
      // getId 的时候将skulist里面规格进行分类统计，与表单显示的进行统一
      dealStandard (skuList) {
        const standardList = skuList.map(item => item.standard)
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
        console.log(tempss)
        this.standards = tempss
      },
      // 主图处理
      uploadImageSuccess (url) {
        this.formData.pic.push(url)
      },
      uploadImageRemove (index) {
        this.formData.pic.splice(index, 1)
      },
      editorReady(editorInstance){

      }
    },
    beforeRouteLeave(to,form,next){
      this.$Notice.destroy()
      next()
    }
  }
</script>

<style scoped>

</style>
