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
      <Col :xxl="3" :xl="4" :lg="5" :md="6">
        <div class="title">选择供应商</div>
        <SupplierSelect v-model="searchForm.supplierId" :supplier-id="searchForm.supplierId" :clearable="true" />
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
            <Checkbox :indeterminate="indeterminate" :value="checkAll"  @click.prevent.native="handleCheckAll">全选</Checkbox>
            <ButtonGroup>
              <Button type="primary" icon="ios-paper-plane" :disabled="checkIds.length==0" @click="bindPlatform()">批量绑定平台</Button>
              <Button type="primary" icon="md-trending-up" :disabled="checkIds.length==0" @click="changeProductsStatus(1)">批量上架</Button>
              <Button type="primary" icon="md-trending-down" :disabled="checkIds.length==0" @click="changeProductsStatus(0)">批量下架</Button>
            </ButtonGroup>
            <Button type="warning" icon="md-trash" :disabled="checkIds.length==0" style="margin-left:15px;" @click="deleteProduct()">批量删除</Button>
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
          <td class="center"><i-switch v-model="product.status" :true-value="1" :false-value="0" size="large" @on-change="changeProductStatus(product.id)">
            <span slot="open">上架</span>
            <span slot="close">下架</span>
          </i-switch></td>
          <td class="center">
            <ButtonGroup vertical>
              <Button icon="md-build" type="primary" @click="$router.push('/product/edit/'+product.id)">编辑商品</Button>
              <Button icon="ios-paper-plane" @click="bindPlatform(product.id.toString())">绑定平台</Button>
            </ButtonGroup>
            <Button icon="md-trash" type="text" @click="deleteProduct(product.id.toString())">删除商品</Button>
          </td>
        </tr>
        </tbody>
      </table>
        <div class="list-buttons-bar">
          <div>
            <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
            <ButtonGroup>
              <Button type="primary" icon="ios-paper-plane" :disabled="checkIds.length==0" @click="bindPlatform()">批量绑定平台</Button>
              <Button type="primary" icon="md-trending-up" :disabled="checkIds.length==0" @click="changeProductsStatus(1)">批量上架</Button>
              <Button type="primary" icon="md-trending-down" :disabled="checkIds.length==0" @click="changeProductsStatus(0)">批量下架</Button>
            </ButtonGroup>
            <Button type="warning" icon="md-trash" :disabled="checkIds.length==0" style="margin-left:15px;" @click="deleteProduct()">批量删除</Button>
          </div>
          <Page :current="products.current" :total="products.total" :page-size="products.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
        </div>
      </CheckboxGroup>
    </div>
    <ProductDetailModal :product-id="viewProductId"></ProductDetailModal>
    <Modal v-model="bindPlatformModal" title="绑定平台" @on-ok="saveBindPlatform" :loading="saveLoading">
      <div style="padding:15px;">
        <div style="padding-bottom:15px;border-bottom:1px dotted #EDEDED">总共选择了 {{bindIds.length}} 款商品，请选择要绑定的平台</div>
        <div style="margin-top:15px;">
          <CheckboxGroup v-model="platformIds">
            <Checkbox v-for="item in platFormList" :key="item.id.toString()" :label="item.id.toString()">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import $ProductService from '../../service/product'
  import $P2PService from '../../service/p2p'
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
        saveLoading:true,
        searchForm:{
          name:this.$route.query.name,
          sn:this.$route.query.sn,
          categoryId:this.$route.query.categoryId,
          brandId:this.$route.query.brandId,
          supplierId:this.$route.query.supplierId,
        },
        searchParams:{
          name:this.$route.query.name,
          sn:this.$route.query.sn,
          categoryId:this.$route.query.categoryId,
          brandId:this.$route.query.brandId,
          supplierId:this.$route.query.supplierId,
          p:this.$route.query.p,
          size:this.$route.query.size
        },
        indeterminate: false,
        checkAll: false,
        checkIds:[],
        bindIds:[],
        platFormList:[],
        bindPlatformModal:false,
        platformIds:[],
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
      //弹出绑定窗口
      bindPlatform(id=null) {
        if (id) {
          this.bindIds = [id]
        } else if (this.checkIds.length > 0) {
          this.bindIds=this.checkIds
        }
        this.saveLoading=true
        $P2PService.select({ps:1000}).then(res=>{
          if (res.code===1){
            this.bindPlatformModal=true
            this.platFormList=res.data.records
          }
        })
      },
      //保存商品绑定平台
      saveBindPlatform(){
        if (this.platformIds.length==0){
          this.$Message.warning('请至少选择一个平台')
          this.saveLoading=false
          setTimeout(()=>{
            this.saveLoading=true
          },500)
          return false
        }
        var request=[]
        this.bindIds.forEach(productId=>{
          this.platformIds.forEach(p2pId=>{
            request.push($P2PProductService.insert({productId:productId,p2pId:p2pId}))
          })
        })
        Promise.all(request).then(res=>{
          var resultArray=res.filter(item=>item.code!=1)
          if (resultArray.length>0){
            var str=''
            resultArray.map(item=>{
              str+=`${item.msg}<br />`
            })
            this.$Notice.warning({
              duration:0,
              title: `共有 ${resultArray.length} 个商品绑定失败`,
              desc: str
            })
          }
          if (res.length>resultArray.length) {
            this.bindPlatformModal = false
            this.$Message.success('商品绑定成功')
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //批量处理上下架
      changeProductsStatus(status=1) {
        var name=status==1?'上架':'下架'
        this.$Modal.confirm(
          {
            title: '警告',
            content: '确定'+name+'所选择的商品吗？',
            loading: true,
            onOk: () => {
              this.changeProductsStatusAction(status)
            },
            onCancel: () => {

            }
          }
        )
      },
      //批量处理上下架方法
      changeProductsStatusAction(status){
        var name=status==1?'上架':'下架'
        var request=[]
        this.checkIds.forEach(productId=>{
          request.push($ProductService.status(productId,status))
        })
        console.log(request)
        Promise.all(request).then(res=>{
          var resultArray=res.filter(item=>item.code!=1)
          if (resultArray.length>0){
            var str=''
            resultArray.map(item=>{
              str+=`${item.msg}<br />`
            })
            this.$Notice.warning({
              duration:0,
              title: `共有 ${resultArray.length} 个商品${name}失败`,
              desc: str
            })
          }
          if (res.length>resultArray.length) {
            this.$Modal.remove();
            this.$Message.success('商品'+name+'成功')
            this.getProductList(this.searchParams.p,this.searchParams.size)
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //处理单个商品上下架
      changeProductStatus(id){
        let product=this.products.list.find(item=>item.id===id)
        let status=product.status
        $ProductService.status(id.toString(),status).then(res=>{
          this.$Message.success('商品设置成功')
        })
      },
      //批量删除
      deleteProduct(id=null) {
        this.$Modal.confirm(
          {
            title: '警告',
            content: '确定要删除所选择的商品吗？',
            loading: true,
            onOk: () => {
              this.deleteProductAction(id)
            },
            onCancel: () => {

            }
          }
        )
      },
      deleteProductAction(id){
        this.buttonLoading=true
        var ids=[]
        if (id) {
          ids = [id]
        } else if (this.checkIds.length > 0) {
          ids=this.checkIds
        }
        var request=[]
        ids.forEach(id=>{
          request.push($ProductService.delete({ids:ids}))
        })
        Promise.all(request).then(res=>{
          var resultArray=res.filter(item=>item.code!=1)
          if (resultArray.length>0){
            this.$Notice.warning({
              duration:0,
              title: '部分商品未删除成功',
              desc: `共有 ${resultArray.length} 个商品未删除成功，请检查`
            })
          }
          this.buttonLoading=false
          if (res.length>resultArray.length) {
            this.$Modal.remove();
            this.$Message.success('成功删除商品')
            this.getProductList(this.searchParams.p, this.searchParams.size)
          }
        }).catch((error) => {
          console.log(error)
        })

      },
      //浏览商品
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
      if (to.name=='ProductEdit'){
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
