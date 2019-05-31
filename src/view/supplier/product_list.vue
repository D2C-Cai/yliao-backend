<template>
  <div>
    <Row :gutter="15" class="search-bar">
      <Col :xxl="4" :xl="5" :lg="6" :md="7">
        <div class="title">关键词</div>
        <Input v-model="searchForm.name" clearable />
      </Col>
      <Col :xxl="3" :xl="4" :lg="5" :md="6">
        <div class="title">货号</div>
        <Input v-model="searchForm.sn" clearable />
      </Col>
      <Col :xxl="3" :xl="4" :lg="5" :md="6">
        <div class="title">选择分类</div>
        <ProductCategoryCascadar v-model="searchForm.categoryId" :category-id="searchForm.categoryId" :clearable="true" />
      </Col>
      <Col :xxl="3" :xl="4" :lg="5" :md="6">
        <div class="title">选择品牌</div>
        <BrandSelect v-model="searchForm.brandId" :brand-id="searchForm.brandId" :clearable="true" />
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
          </div>
          <Page :current="products.current" :total="products.total" :page-size="products.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
        </div>
        <table class="table padding-10 hover hide-checkbox-label">
          <tr class="header">
            <td width="2%"></td>
            <td width="40%">商品信息</td>
            <td width="15%" class="center">价格</td>
            <td width="8%" class="center">库存</td>
            <td width="8%" class="center">销量</td>
            <td width="8%" class="center">状态</td>
            <td width="8%" class="center">操作</td>
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
            <td class="center">{{product.sales}}</td>
            <td class="center" style="position:relative">
              <div style="position:absolute;top:0;right:0;bottom:0;left:0;z-index:2"></div>
              <i-switch v-model="product.status" :true-value="1" :false-value="0" size="large">
              <span slot="open">上架</span>
              <span slot="close">下架</span>
            </i-switch></td>
            <td class="center">
              <ButtonGroup vertical>
                <Button icon="md-build" type="primary" ghost @click="$router.push('/supplier/product/edit/'+product.id)">编辑商品</Button>
                <Button icon="ios-paper-plane" type="primary" ghost @click="skuModal(product)">编辑SKU</Button>
              </ButtonGroup>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="list-buttons-bar">
          <div>
          </div>
          <Page :current="products.current" :total="products.total" :page-size="products.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
        </div>
      </CheckboxGroup>
    </div>
    <ProductDetailModal :product-id="viewProductId"></ProductDetailModal>
    <Modal v-model="skuModalShow" width="780" footer-hide title="编辑sku">
      <table class="table padding-10">
        <tr class="header">
          <td class="center" width="15%">货号</td>
          <td class="center" width="13%">规格</td>
          <td class="center" width="7%">市场价</td>
          <td class="center" width="7%">销售价</td>
          <td class="center" width="7%">供货价</td>
          <td class="center" width="7%">库存</td>
          <td class="center" width="5%">状态</td>
          <td class="center" width="5%">操作</td>
        </tr>
        <tr v-for="(sku,i) in skuModalData">
          <td class="center"><Input v-model="sku.sn" /></td>
          <td class="center">{{sku.standard | formatStandard}}</td>
          <td class="center"><Input type="number" disabled v-model="sku.marketPrice" /></td>
          <td class="center"><Input type="number" disabled v-model="sku.sellPrice" /></td>
          <td class="center"><Input type="number" disabled v-model="sku.costPrice" /></td>
          <td class="center"><Input type="number" v-model="sku.stock" /></td>
          <td class="center"><i-switch disabled v-model="sku.status" :true-value="1" :false-value="0"></i-switch></td>
          <td class="center">
            <Button type="primary" @click="saveSkuItem(sku)">保存</Button>
          </td>
        </tr>
      </table>
    </Modal>
  </div>
</template>

<script>
  import $ProductService from '../../service/product'
  import $ProductSkuService from '../../service/productSku'
  import ProductCategoryCascadar from '../../components/ProductCategoryCascadar'
  import SupplierSelect from '../../components/SupplierSelect'
  import BrandSelect from '../../components/BrandSelect'
  import ProductDetailModal from '../../components/ProductDetailModal'
  export default {
    data(){
      return {
        imgUrl:process.env.VUE_APP_IMG_URL,
        supplierId:this.LocalStorage.getItem('USER_INFO').supplierId,
        viewProductId:null,
        saveLoading:true,
        skuModalShow:false,
        skuModalData:[],
        searchForm:{
          name:this.$route.query.name,
          sn:this.$route.query.sn,
          categoryId:this.$route.query.categoryId,
          brandId:this.$route.query.brandId
        },
        searchParams:{
          name:this.$route.query.name,
          sn:this.$route.query.sn,
          categoryId:this.$route.query.categoryId,
          brandId:this.$route.query.brandId,
          p:this.$route.query.p,
          size:this.$route.query.size
        },
        indeterminate: false,
        checkAll: false,
        editProductSkuModal:false,
        editProductSku: [],
        checkIds:[],
        bindIds:[],
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
      editSKU(id=null){
        if (!id) return
        $ProductSkuService.select({ productId: id }).then(res => {
          this.editProductSku = res.data.records
          this.editProductSkuModal = true
        })
      },
      updateStock(params){
        $ProductSkuService.updateStock(params)
      },

      //浏览商品
      viewProduct(id){
        this.viewProductId=id
      },

      skuModal(product){
        $ProductSkuService.select({productId:product.id.toString()}).then(res=>{
          if (res.code===1){
            this.skuModalShow=true
            this.skuModalData=res.data.records
          }
        })
      },
      saveSkuItem(sku){
        $ProductSkuService.update(sku).then(res=>{
          if (res.code===1){
            this.$Message.success('保存成功')
          }
        })
      },
      getProductList(p,size){
        this.indeterminate = false
        this.checkAll = false
        this.checkIds = []
        if(!p) p=1
        this.searchParams.size=size
        this.searchParams.p=p
        let data={...this.searchParams,supplierId:this.supplierId}
        $ProductService.select(data).then(res=>{
          if (res.code===1){

            this.products={
              list:res.data.records,
              current:res.data.current,
              size:res.data.size,
              total:res.data.total
            }
          }
        })
      },
      onSearch(){
        this.searchParams={...this.searchForm}
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
        this.searchForm={}
        this.searchParams={}
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
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.name=='SupplierProductEdit'){
        from.meta.keepAlive = true
      }else{
        from.meta.keepAlive = false
      }
      next();
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
</style>
