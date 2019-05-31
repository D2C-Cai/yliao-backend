<template>
  <div>
    <Row :gutter="15" class="search-bar">
      <Col :xxl="3" :xl="4" :lg="5" :md="6">
        <div class="title">订单编号</div>
        <Input v-model="searchParams.sn" clearable />
      </Col>
      <Col :xxl="5" :xl="6" :lg="7" :md="8">
        <div class="title">收货人信息</div>
        <Input v-model="searchParams[reciveType]" clearable>
          <Select v-model="reciveType" @on-change="changeReciveType" style="width:100px" slot="prepend">
            <Option value="name">收货人姓名</Option>
            <Option value="mobile">收货人手机</Option>
          </Select>
        </Input>
      </Col>
      <Col :xxl="3" :xl="4" :lg="5" :md="6">
        <div class="title">选择会员</div>
        <MemberSelect v-model="searchParams.memberId" :member-id="searchParams.memberId" :clearable="true" />
      </Col>
      <Col :xxl="3" :xl="4" :lg="5" :md="6">
        <div class="title">选择平台</div>
        <PlatformSelect v-model="searchParams.p2pId" :p2p-id="searchParams.p2pId" :clearable="true" />
      </Col>
      <Col span="2" class="search-buttons">
        <Button type="primary" @click="onSearch">搜索</Button>
        <Button type="default" @click="onClear">重置</Button>
      </Col>
    </Row>

    <div style="margin-top:20px">
      <Tabs v-model="searchParams.status" @on-click="clickTab">
        <TabPane label="全部" name="ALL"></TabPane>
        <TabPane label="待用户签约" name="WAIT_MEM_SIGN"></TabPane>
        <TabPane label="待平台审核" name="WAIT_P2P_SIGN"></TabPane>
        <TabPane label="待客服审核" name="WAIT_CUS_SIGN"></TabPane>
        <TabPane label="待发货" name="WAIT_DELIVER"></TabPane>
        <TabPane label="待收货" name="DELIVERED"></TabPane>
        <TabPane label="交易成功" name="SUCCESS"></TabPane>
        <TabPane label="关闭" name="CLOSE"></TabPane>
      </Tabs>
      <CheckboxGroup v-model="checkIds" @on-change="checkAllGroupChange">
        <div class="list-buttons-bar no-margin">
          <div>
            <Checkbox :indeterminate="indeterminate" :value="checkAll"  @click.prevent.native="handleCheckAll" style="margin-right:8px;">全选</Checkbox>
            <Button icon="md-checkmark-circle-outline" type="success" :loading="buttonLoading" :disabled="checkIds.length==0" @click="checkOrder()">批量审核</Button>
          </div>
          <Page :current="orders.current" :total="orders.total" :page-size="orders.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
        </div>
        <template v-if="orders.list.length>0">
          <table class="table order-table hover-shadow hide-checkbox-label" v-for="(order,i) in orders.list" :key="order.id.toString()">
            <tr class="padding-10 selected">
              <td colspan="3" style="position:relative;">
                <Checkbox :label="order.id.toString()" :disabled="order.status!='WAIT_CUS_SIGN'" style="position:absolute;left:-2px;top:-4px;width:40px;height:40px;zoom:1.2"> </Checkbox>
                <p>订单编号：<strong>{{order.sn}}</strong> &nbsp;&nbsp;&nbsp; 创建时间：{{order.createDate}} </p>
                <p> 所属平台：<PlatformCard :p2p-id="order.p2pId"></PlatformCard> &nbsp;&nbsp;&nbsp; 用户信息：<MemberCard :member-id="order.memberId"></MemberCard></p>
                <p>收货信息：{{order.province}}{{order.city}}{{order.district}}{{order.address}} &nbsp;&nbsp; {{order.name}} &nbsp;&nbsp; {{order.mobile}}</p>
                <Button type="info" size="small" v-if="!order.contractId" ghost style="position:absolute;right:10px;top:10px;" @click="viewContract(order.sn)">查看合同</Button>
              </td>
              <td colspan="2" style="text-align:right">
                <p><strong>{{order.payAmount | formatCurrency}}</strong> 元</p>
                <p style="font-size:12px;">其中运费{{order.freightAmount}}元</p></td>
              <td colspan="2" class="center">
                <div v-if="order.status=='WAIT_CUS_SIGN'">
                  <Button icon="md-checkbox-outline" type="success" @click="checkOrder(order)">审核</Button> &nbsp;
                </div>
              </td>
              <td class="center">{{order.statusName}}</td>
            </tr>
            <tr class="table-thin">
              <td width="30.35%">商品信息</td>
              <td width="12.10%" class="center">规格</td>
              <td class="center">数量</td>
              <td class="center">单价</td>
              <td class="center">小计</td>
              <td width="15%" class="center">物流信息</td>
              <td class="center">操作</td>
              <td width="7.6%" class="center">状态</td>
            </tr>
            <tr class="table-thin" v-for="(item,ii) in order.orderItemList" :key="i+'-'+ii">
              <td>
                <div style="float:left;margin-right:10px" @click="viewProduct(item.productId)"><img :src="imgUrl+item.productPic+'!/both/100x100'" style="width:50px;padding:1px;" /></div>
                <div>
                  <p style="height:35px;overflow:hidden;" @click="viewProduct(item.productId)">{{item.productName}}</p>
                  <p>货号：{{item.skuSn}}</p>
                </div>
              </td>
              <td class="center">规格：{{item.standard | formatStandard}}</td>
              <td class="center">{{item.quantity}}</td>
              <td class="center">{{item.realPrice}}</td>
              <td class="center">{{item.payAmount}}<br />含邮费 {{item.freightAmount}}</td>
              <td style="padding-left:1%;">
                <template v-if="item.logisticsCom&&item.logisticsNum">
                  <p>快递公司：{{item.logisticsCom}}</p>
                  <p>快递单号：{{item.logisticsNum}}
                    <Poptip title="快递查询" placement="right">
                      <a>查询</a>
                      <div slot="content" style="width:375px;overflow:hidden;"><iframe frameborder="0" style="margin-top:-88px;width:395px;height:500px" :src="'https://m.kuaidi100.com/result.jsp?com='+item.logisticsCom+'&nu='+item.logisticsNum"> </iframe></div>
                    </Poptip></p>
                </template>
              </td>
              <td class="center"></td>
              <td class="center">{{item.statusName}}</td>
            </tr>
          </table>
        </template>
        <template v-else>
          <div class="no-data" style="padding:50px 0;line-height:40px;text-align:center;">
            <p><Icon type="ios-infinite" size="80" /></p>
            <p>该条件下暂无数据</p></div>
        </template>
        <div class="list-buttons-bar no-margin">
          <div>
            <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
            <Button icon="md-checkmark-circle-outline" type="success" :loading="buttonLoading" :disabled="checkIds.length==0" @click="checkOrder()">批量审核</Button>
          </div>
          <Page :current="orders.current" :total="orders.total" :page-size="orders.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
        </div>
      </CheckboxGroup>
    </div>
    <ProductDetailModal :product-id="viewProductId"></ProductDetailModal>
  </div>
</template>

<script>
  import PlatformSelect from '../../components/PlatfromSelect'
  import MemberSelect from '../../components/MemberSelect'
  import MemberCard from '../../components/MemberCard'
  import PlatformCard from '../../components/PlatformCard'
  import $OrderService from '../../service/order'
  import ProductDetailModal from '../../components/ProductDetailModal'

  export default {
    data(){
      return {
        imgUrl:process.env.VUE_APP_IMG_URL,
        viewProductId:null,
        buttonLoading:false,
        reciveType:'name',
        searchParams:{
          status:this.$route.query.status ||'ALL',
          sn:this.$route.query.sn,
          reciver:this.$route.query.reciver,
          contact:this.$route.query.contact,
          memberId:this.$route.query.memberId,
          p2pId:this.$route.query.p2pId,
          p:this.$route.query.p,
          size:this.$route.query.size
        },
        indeterminate: false,
        checkAll: false,
        checkIds:[],
        orders:{
          list:[],
          current:1,
          p:1,
          size:20,
          total:0
        },
      }
    },
    watch:{
      "$route.query.p2pId":"getRoute",
      "$route.query.memberId":"getRoute"
    },
    components:{
      [PlatformCard.name]:PlatformCard,
      [MemberCard.name]:MemberCard,
      [MemberSelect.name]:MemberSelect,
      [PlatformSelect.name]:PlatformSelect,
      [ProductDetailModal.name]:ProductDetailModal
    },

    created(){
      this.getOrderList(this.searchParams.p,this.orders.size)
    },
    methods:{
      viewProduct(id){
        this.viewProductId=id
      },
      getRoute(){
        this.searchParams.p2pId=this.$route.query.p2pId
        this.searchParams.memberId=this.$route.query.memberId
        console.log(this.searchParams)
        this.getOrderList()
      },
      viewContract(sn){
        $OrderService.contract(sn).then(res=>{
          if (res.code===1){
            window.open(res.data)
          }
        })
      },
      checkOrder(order){
        this.$Modal.confirm({
          title:'系统提示',
          content:order?'确定审核通过该订单吗？':'确定要批量审核通过选择的订单吗？',
          loading: true,
          onOk:()=>{
            this.checkOrderAction(order)
          }
        })
      },
      checkOrderAction(order){
        var ids=[]
        if (order){
          ids=[order.id.toString()]
        }else if (this.checkIds.length > 0) {
          ids=this.checkIds
        }
        var request=[]
        ids.forEach(id=>{
          request.push($OrderService.filling(id))
        })
        Promise.all(request).then(res=>{
          console.log(res)
          var resultArray=res.filter(item=>item.code!=1)
          if (resultArray.length>0){
            var str=''
            resultArray.map(item=>{
              str+=`${item.msg}<br />`
            })
            this.$Notice.warning({
              duration:0,
              title: `共有 ${resultArray.length} 个订单审核失败`,
              desc: str
            })
          }
          if (res.length>resultArray.length) {
            this.$Message.success('订单审核成功')
            this.getOrderList(this.searchParams.p,this.searchParams.size)
            this.$Modal.remove()
          }
        }).catch(error=>{
          console.log(error)
        })

      },
      clickTab(name){
        this.searchParams.status=name
        this.getOrderList()
        this.$router.replace({path:this.$route.path,query:this.searchParams})

      },
      getOrderList(p,size){
        if(!p) p=1
        if(!size) size=this.orders.size
        this.searchParams.size=size
        this.searchParams.p=p
        var params={...this.searchParams}
        if (params.status=='ALL') params.status=''
        $OrderService.list(params).then(res=>{
          if (res.code===1){
            this.orders={
              list:res.data.records,
              current:res.data.current,
              size:res.data.size,
              total:res.data.total
            }
          }
        })
      },

      onSearch(){
        this.getOrderList()
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onClear(){
        this.searchParams={status:'ALL'}
      },
      handleCheckAll () {
        if (this.indeterminate) {
          this.checkAll = false;
        } else {
          this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;

        if (this.checkAll) {
          var filterList=this.orders.list.filter(item=>item.status==='WAIT_CUS_SIGN')
          this.checkIds = filterList.map(item=>item.id.toString())
        } else {
          this.checkIds = [];
        }
      },
      checkAllGroupChange (data) {
        let list=this.orders.list.map(item=>item.status==='WAIT_CUS_SIGN')
        if (data.length === list.length) {
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
      onChangePage(p){
        this.getOrderList(p, this.searchParams.size)
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onChangeSize(size){
        this.getOrderList( this.searchParams.p,size)
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      changeReciveType(value){
        var searchParams=this.searchParams
        if (value=='reciver') delete searchParams.contact
        if (value=='contact') delete searchParams.reciver
        this.searchParams=searchParams
      }
    }
  }
</script>

<style scoped>

</style>
