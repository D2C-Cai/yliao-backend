<template>
  <div>
    <Row :gutter="15" class="search-bar">
      <Col :xxl="5" :xl="6" :lg="7" :md="8">
        <div class="title">关键词</div>
        <Input v-model="searchParams[keywordType]" clearable>
          <Select v-model="keywordType" @on-change="changeKeywordType" style="width:80px" slot="prepend">
            <Option value="name">按标题</Option>
            <Option value="sn">按货号</Option>
          </Select>
        </Input>
      </Col>
      <Col :xxl="3" :xl="3" :lg="5" :md="6">
        <div class="title">选择分类</div>
        <ProductCategoryCascadar v-model="searchParams.categoryId" :category-id="searchParams.categoryId" :clearable="true" />
      </Col>
      <Col :xxl="3" :xl="3" :lg="5" :md="6">
        <div class="title">选择品牌</div>
        <BrandSelect v-model="searchParams.brandId" :brand-id="searchParams.brandId" :clearable="true" />
      </Col>
      <Col :xxl="3" :xl="4" :lg="5" :md="6">
        <div class="title">选择供应商</div>
        <SupplierSelect v-model="searchParams.supplierId" :supplier-id="searchParams.supplierId" :clearable="true" />
      </Col>
      <Col :xxl="3" :xl="4" :lg="5" :md="6">
        <div class="title">选择价位段</div>
        <Select v-model="priceSelect" v-if="priceSelect!='config'" @on-change="selectPriceRange" clearable>
          <Option value="100-1000">100-1000</Option>
          <Option value="1000-2000">1000-2000</Option>
          <Option value="2000-4000">2000-4000</Option>
          <Option value="4000-7000">4000-7000</Option>
          <Option value="7000-99999">7000以上</Option>
          <Option value="config">自定义</Option>
        </Select>
        <div style="display:flex;justify-content: space-between;align-items: center" v-if="priceSelect=='config'">
          <Input type="number" v-model="searchParams.priceL" style="width:40%" /> - <Input type="number" v-model="searchParams.priceR" style="width:40%" />
          <Icon type="md-close" @click="priceSelect=null" size="20" />
        </div>
      </Col>
      <Col span="2" class="search-buttons">
        <Button type="primary" @click="onSearch">搜索</Button>
        <Button type="default" @click="onClear">重置</Button>
      </Col>
    </Row>

    <div style="margin-top:20px">
      <CheckboxGroup v-model="checkIds" @on-change="checkAllGroupChange">
        <div class="list-buttons-bar">
          <div>
            <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
            <ButtonGroup>
              <Button type="primary" icon="ios-paper-plane" :loading="buttonLoading" :disabled="checkIds.length==0" @click="bindPlatform()">批量发布</Button>
              <Button type="error" ghost icon="ios-paper-plane-outline" :loading="buttonLoading" :disabled="checkIds.length==0" @click="cancelBind()">取消发布</Button>
            </ButtonGroup>
          </div>
          <Page :current="products.current" :total="products.total" :page-size="products.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
        </div>
        <table class="table padding-10 hover hide-checkbox-label">
          <tr class="header">
            <td width="1%" class="center">
              <Checkbox :indeterminate="indeterminate" :value="checkAll"  @click.prevent.native="handleCheckAll"></Checkbox>
            </td>
            <td width="40%">商品信息</td>
            <td width="15%" class="center">价格</td>
            <td width="8%" class="center">库存</td>
            <td width="8%" class="center">结算比例</td>
            <td width="8%" class="center">状态</td>
            <td width="10%" class="center">操作</td>
          </tr>
          <tbody>
          <tr v-for="(product,i) in products.list" :key="i">
            <td class="center"><Checkbox :label="product.id.toString()"></Checkbox></td>
            <td>
              <div style="float:left;padding-right:10px;" @click="viewProduct(product.id)"><img :src="imgUrl+product.firstPic+'!/both/200x200'" style="width:105px" /></div>
              <div>
                <p>创建时间：{{product.createDate}}</p>
                <p @dblclick="viewProduct(product.id)" class="title">{{product.name}}</p>
                <p>商品货号：{{product.sn}}</p>
                <p>商品ID ：{{product.id}}</p>
              </div>
            </td>
            <td>
              <p>销售价：￥ <strong style="font-size:14px;">{{product.price | formatCurrency}}</strong></p>
              <p>市场价：<s>￥ {{product.marketPrice | formatCurrency}}</s></p>
            </td>
            <td class="center">{{product.stock}}</td>
            <td class="center">{{product.ratio*10}} 折</td>
            <td class="center">
              <div style="position:relative">
                <div style="position:absolute;left:0;right:0;bottom:0;top:0;z-index:1"></div>
                <i-switch size="large" :value="product.status==1?true:false">
                  <span slot="open">上架</span>
                  <span slot="close">下架</span>
                </i-switch>
              </div>
              <Tooltip v-if="product.status!=1" content="下架商品不在商城中出现" placement="bottom">
                <Icon type="md-help-circle" color="#2d8cf0" />
              </Tooltip>
            </td>
            <td class="center">
              <Button type="primary" :disabled="product.status!=1" :loading="buttonLoading" v-if="!product.publish" icon="ios-paper-plane" @click="bindPlatform(product.id.toString())">发布到商城</Button>
              <Button type="error" v-else icon="ios-paper-plane-outline" :loading="buttonLoading" ghost @click="cancelBind(product.id.toString())">取消发布</Button>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="list-buttons-bar">
          <div>
            <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
            <ButtonGroup>
              <Button type="primary" icon="ios-paper-plane" :loading="buttonLoading" :disabled="checkIds.length==0" @click="bindPlatform()">批量发布</Button>
              <Button type="error" ghost icon="ios-paper-plane-outline" :loading="buttonLoading" :disabled="checkIds.length==0" @click="cancelBind()">取消发布</Button>
            </ButtonGroup>
          </div>
          <Page :current="products.current" :total="products.total" :page-size="products.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
        </div>
      </CheckboxGroup>

    </div>
    <ProductDetailModal :product-id="viewProductId"></ProductDetailModal>

  </div>
</template>

<script>
  import $ProductService from '../../service/product'
  import $P2PProductService from '../../service/p2pProduct'
  import ProductCategoryCascadar from '../../components/ProductCategoryCascadar'
  import SupplierSelect from '../../components/SupplierSelect'
  import BrandSelect from '../../components/BrandSelect'
  import ProductDetailModal from '../../components/ProductDetailModal'
  export default {
    data(){
      return {
        imgUrl:process.env.VUE_APP_IMG_URL,
        viewProductId:null,
        p2pId:this.LocalStorage.getItem('USER_INFO').p2pId,
        buttonLoading:false,
        searchParams:{
          name:this.$route.query.name,
          sn:this.$route.query.sn,
          categoryId:this.$route.query.categoryId,
          brandId:this.$route.query.brandId,
          supplierId:this.$route.query.supplierId,
          p:this.$route.query.p,
          size:this.$route.query.size,
          priceL:this.$route.query.priceL,
          priceR:this.$route.query.priceR,
        },
        keywordType:'name',
        priceSelect:null,
        priceRange:[20,80],
        indeterminate: false,
        checkAll: false,
        checkIds:[],
        products:{
          list:[],
          current:1,
          p:1,
          size:20,
          total:0
        }
      }

    },
    components:{
      [ProductCategoryCascadar.name]:ProductCategoryCascadar,
      [SupplierSelect.name]:SupplierSelect,
      [BrandSelect.name]:BrandSelect,
      [ProductDetailModal.name]:ProductDetailModal
    },
    created(){
      this.getProductList(this.searchParams.p,this.products.size)
    },
    methods:{
      selectPriceRange(value){
        if(value!=undefined && value.includes('-')){
          let priceArray=value.split('-')
          this.searchParams.priceL=priceArray[0]
          this.searchParams.priceR=priceArray[1]
        }
      },
      bindPlatform(id=null) {
        this.buttonLoading=true
        var ids=[]
        if (id) {
          ids = [id]
        } else if (this.checkIds.length > 0) {
          ids=this.checkIds
        }
        var request=[]
        ids.forEach(id=>{
          request.push($P2PProductService.insert({productId:id,p2pId:this.p2pId.toString()}))
        })
        Promise.all(request).then(res=>{
          var resultArray=res.filter(item=>item.code!=1)
          if (resultArray.length>0){
            this.$Notice.warning({
              duration:0,
              title: '部分商品未处理成功',
              desc: `共有 ${resultArray.length} 个商品未处理成功，请检查`
            })
          }
          this.buttonLoading=false
          if (res.length>resultArray.length) {
            this.$Message.success('成功发布到商城')
            this.getProductList(this.searchParams.p, this.searchParams.size)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      cancelBind(id=null) {
        this.$Modal.confirm(
          {
            title: '警告',
            content: '确定要从商城中撤下选择的商品吗？',
            onOk: () => {
              this.deleteBind(id)
            },
            onCancel: () => {

            }
          }
        )
      },
      deleteBind(id){
        this.buttonLoading=true
        var ids=[]
        if (id) {
          ids = [id]
        } else if (this.checkIds.length > 0) {
          ids =this.checkIds
        }
        let result=this.products.list.filter(item=>ids.includes(item.id.toString()) && item.publish!=undefined)
        var pids=[]
        result.forEach(item=>{
          pids.push(item.publish.id.toString())
        })
        $P2PProductService.delete({ids:pids}).then(res=>{
          this.buttonLoading=false
          if (res.code===1){
            this.$Message.success('成功取消发布')
            this.getProductList(this.searchParams.p, this.searchParams.size)
          }else{
            this.$Message.error(res.msg)
          }
        })
      },
      handleCheckAll () {
        if (this.indeterminate) {
          this.checkAll = false;
        } else {
          this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;

        if (this.checkAll) {
          this.checkIds = this.products.list.map(item=>item.id.toString())
        } else {
          this.checkIds = [];
        }
      },
      checkAllGroupChange (data) {
        if (data.length === this.products.list.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
      },
      viewProduct(id){
        this.viewProductId=id
      },
      getProductList(p,size){
        this.indeterminate = false
        this.checkAll = false
        this.checkIds = []
        if(!p) p=1
        this.searchParams.size=size
        this.searchParams.p=p
        $ProductService.select(this.searchParams).then(res=>{
          if (res.code===1){
            $ProductService.relation({productIds:res.data.records.map(item=>item.id.toString())}).then(result=>{
              this.products={
                list:res.data.records.map(item => ({ ...item, publish: result.data?result.data.find(e => e.productId.toString() === item.id.toString()):false })),
                current:res.data.current,
                size:res.data.size,
                total:res.data.total
              }
            })

          }
        })
      },
      onSearch(){
        this.getProductList()
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onChangePage(p){
        this.getProductList(p, this.searchParams.size)
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onChangeSize(size){
        this.getProductList( this.searchParams.p,size)
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onClear(){
        this.priceSelect=null
        this.searchParams={}
      },
      changeKeywordType(value){
        var searchParams=this.searchParams
        if (value=='name') delete searchParams.sn
        if (value=='sn') delete searchParams.name
        this.searchParams=searchParams
      }
    }
  }
</script>

<style lang="less" scoped>
  .table {
    .title {
      font-weight:bold;
      height:35px;
      margin:5px 0;
    }
  }
  .table-bottom-bar {
    margin-top:10px;display:flex;justify-content: space-between;align-items: center
  }
</style>
