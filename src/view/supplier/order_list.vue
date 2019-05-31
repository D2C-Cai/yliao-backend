<template>
  <div>
    <Row :gutter="15" class="search-bar">
      <Col :xxl="3" :xl="4" :lg="5" :md="6">
        <div class="title">订单编号</div>
        <Input v-model="searchParams.orderSn" clearable />
      </Col>
      <Col :xxl="5" :xl="6" :lg="7" :md="8">
        <div class="title">商品</div>
        <Input v-model="searchParams[searchType]" clearable>
          <Select v-model="searchType" @on-change="changeSearchType" style="width:100px" slot="prepend">
            <Option value="productName">根据名称</Option>
            <Option value="skuSn">根据货号</Option>
          </Select>
        </Input>
      </Col>
      <Col :xxl="5" :xl="6" :lg="7" :md="8">
        <div class="title">下单时间范围</div>
        <DatePicker :value="dateRange" format="yyyy-MM-dd HH:mm" confirm type="datetimerange" placement="bottom-end" placeholder="选择时间" style="width:100%" @on-change="selectDateRange"></DatePicker>
      </Col>
      <Col span="2" class="search-buttons">
        <Button type="primary" @click="onSearch">搜索</Button>
        <Button type="default" @click="onClear">重置</Button>
      </Col>
    </Row>
    <div style="margin-top:20px">
      <Tabs v-model="searchParams.status" @on-click="clickTab">
        <TabPane label="全部" name="ALL"></TabPane>
        <TabPane label="签约中" name="WAIT_SIGN"></TabPane>
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
            <Button type="primary" icon="ios-paper-plane" :disabled="checkIds.length==0"  @click="deliverModal()">批量发货</Button>
            <Tooltip content="导出当前筛选条件下的订单" placement="right">
            <Button type="error" icon="md-cloud-download" :disabled="orderItems.list.length==0" @click="exportOrderItem" style="margin-left:10px;">订单导出</Button>
            </Tooltip>
            <Button type="success" icon="md-cloud-upload" @click="importModalShow=true" style="margin-left:10px;">发货导入</Button>
          </div>
          <Page :current="orderItems.current" :total="orderItems.total" :page-size="orderItems.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
        </div>
        <template v-if="orderItems.list.length>0">
          <table class="table order-table hover-shadow hide-checkbox-label padding-10" v-for="item in orderItems.list" :key="item.id.toString()">
          <tr>
            <td width="40%">
              <Checkbox :label="item.id.toString()" :disabled="item.status!='WAIT_DELIVER'"> </Checkbox>
              订单信息</td>
            <td width="30%">商品信息</td>
            <td>物流信息</td>
            <td class="center" width="100">操作</td>
          </tr>
          <tr>
            <td style="line-height:26px">
              <div>订单状态：{{item.statusName}} &nbsp; &nbsp; &nbsp;<!-- 实际付款：<strong>{{item.payAmount | formatCurrency}}</strong> 元(含运费{{item.freightAmount}}元) --></div>
              <div>订单编号：<Tooltip content="点击复制" placement="top" v-clipboard:copy="item.order.sn" v-clipboard:success="copySuccess" style="cursor:pointer"><strong>{{item.order.sn}}</strong></Tooltip> &nbsp;&nbsp;&nbsp; 创建时间：{{item.order.createDate}}</div>
              <div>收货信息：<Tooltip content="点击复制" placement="top" v-clipboard:copy="item.order.province+item.order.city+item.order.district+item.order.address+','+item.order.name+','+item.order.mobile" v-clipboard:success="copySuccess" style="cursor:pointer"><span>{{item.order.province}}{{item.order.city}}{{item.order.district}}{{item.order.address}} / {{item.order.name}} / {{item.order.mobile}}</span></Tooltip></div>
            </td>
            <td>
              <div style="float:left;margin-right:10px" @click="viewProduct(item.productId)"><img :src="imgUrl+item.productPic+'!/both/150x150'" style="width:80px;padding:1px;" /></div>
              <div>
                <p style="height:40px;overflow:hidden;" @click="viewProduct(item.productId)">{{item.productName}}</p>
                <p>货号：<Tooltip content="点击复制" placement="top" v-clipboard:copy="item.skuSn" v-clipboard:success="copySuccess" style="cursor:pointer">{{item.skuSn}}</Tooltip></p>
                <p>规格：{{item.standard | formatStandard}} &nbsp;&nbsp;&nbsp; 数量：{{item.quantity}}</p>
              </div>
            </td>
            <td>
              <template v-if="item.logisticsCom&&item.logisticsNum">
                <p>快递公司：{{item.logisticsCom}}</p>
                <p>快递单号：{{item.logisticsNum}}
                  <Poptip title="快递查询" placement="right">
                    <a>查询</a>
                    <div slot="content" style="width:375px;overflow:hidden;"><iframe frameborder="0" style="margin-top:-88px;width:395px;height:500px" :src="'https://m.kuaidi100.com/result.jsp?com='+item.logisticsCom+'&nu='+item.logisticsNum"> </iframe></div>
                  </Poptip></p>
              </template>
            </td>
            <td class="center"><Button type="primary" icon="ios-share-alt" :disabled="item.status!='WAIT_DELIVER'" @click="deliverModal(item)">发货</Button></td>
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
            <Button type="primary" icon="ios-paper-plane" :disabled="checkIds.length==0">批量发货</Button>
            <Tooltip content="导出当前筛选条件下的订单" placement="right">
              <Button type="error" icon="md-cloud-download" :disabled="orderItems.list.length==0" @click="exportOrderItem" style="margin-left:10px;">订单导出</Button>
            </Tooltip>
            <Button type="success" icon="md-cloud-upload" @click="importModalShow=true" style="margin-left:10px;">发货导入</Button>
          </div>
          <Page :current="orderItems.current" :total="orderItems.total" :page-size="orderItems.size" @on-change="onChangePage" @on-page-size-change="onChangeSize" show-sizer show-elevator style="text-align:right" />
        </div>
      </CheckboxGroup>
    </div>
    <ProductDetailModal :product-id="viewProductId"></ProductDetailModal>
    <Modal v-model="deliverModalShow" :loading="saveLoading" width="400" :title="deliverFormData.ids.length>1?'批量发货':'发货'" @on-ok="saveDeliver">
      <Alert show-icon banner v-if="deliverFormData.ids.length>1">{{deliverFormData.ids.length}}个订单明细使用同一个快递单号</Alert>

      <div style="margin-top:15px;">
        <Form :model="deliverFormData" ref="formValidate" :rules="formValidate" :label-width="80" style="padding-right:10%;">
          <FormItem label="快递公司" prop="logisticsCom">
            <Select v-model="deliverFormData.logisticsCom" clearable>
              <Option v-for="item in logisticCompany" :value="item" :key="item">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem label="快递单号" prop="logisticsNum">
            <Input v-model="deliverFormData.logisticsNum" clearable />
          </FormItem>
        </Form>
      </div>
    </Modal>
    <Modal v-model="importModalShow" title="导入发货订单" footer-hide>
      <div style="text-align:center;padding:30px 0">
        <Upload action="/back/order_item/import/deliver" :show-upload-list="false" :headers="{ accessToken: token }"
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :on-progress="uploadProgress"
                :on-error="uploadError"
                :on-success="uploadSuccess">
          <Button type="primary" :loading="uploadLoading" icon="md-cloud-upload">选择EXCEL文件</Button>
          <div style="margin:20px 15% 0 15%;text-align:left;line-height:30px" slot="tip">
            <p>1.<a href="https://s.yliao.com/doc/import_deliver.xlsx">下载数据模板</a>,请将数据粘贴到模板上</p>
            <p>2.不要更改表头文字，<span style="color:red">将所有列都转成文本格式</span></p>
            <p>3.如果导入的数据较多，系统会在后台静默执行</p>
          </div>
        </Upload>
      </div>
    </Modal>
  </div>
</template>

<script>
  import $cookies from 'vue-cookies'
  import $OrderItemService from '../../service/orderItem'
  import ProductDetailModal from '../../components/ProductDetailModal'

  export default {
    data(){
      return {
        imgUrl:process.env.VUE_APP_IMG_URL,
        token:$cookies.get('AUTH_TOKEN'),
        importModalShow:false,
        deliverModalShow:false,
        deliverFormData:{
          ids:[],
          logisticsCom:null,
          logisticsNum:null
        },
        saveLoading:true,
        uploadLoading:false,
        buttonLoading:false,
        viewProductId:null,
        searchType:'productName',
        indeterminate: false,
        checkAll: false,
        checkIds:[],
        dateRange:[this.$route.query.createDateL,this.$route.query.createDateR],
        searchParams:{
          status:this.$route.query.status || 'ALL',
          skuSn:this.$route.query.skuSn,
          orderSn:this.$route.query.orderSn,
          productName:this.$route.query.productName,
          createDateL:this.$route.query.createDateL,
          createDateR:this.$route.query.createDateR,
          p:this.$route.query.p,
          size:this.$route.query.size
        },
        logisticCompany:['顺丰速运','德邦物流','申通快递','圆通快递','中通快递','韵达快递','天天快递'],
        formValidate: {
          logisticsCom: [
            {type:'string',required: true, message: '请选择快递公司', trigger: 'change'}
          ],
          logisticsNum:[
            {type:'string',required: true, message: '请填写快递单号', trigger: 'blur'}
          ],
        },
        orderItems:{
          list:[],
          size:20,
          p:1
        }
      }
    },
    components:{
      [ProductDetailModal.name]:ProductDetailModal
    },
    created(){
      this.getOrderItemList()
    },
    methods:{
      getOrderItemList(p=1,size=20){
        this.searchParams.size=size
        this.searchParams.p=p
        var params={...this.searchParams}
        if (params.status=='ALL') delete params.status
        $OrderItemService.list(params).then(res=>{
          if (res.code===1){
            this.orderItems={
              list:res.data.records,
              current:res.data.current,
              size:res.data.size,
              total:res.data.total
            }
          }
        })
      },
      deliverModal(data){
        if (data){
          this.deliverFormData.ids=[data.id.toString()]
          this.deliverFormData.logisticsCom=data.logisticsCom
          this.deliverFormData.logisticsNum=data.logisticsNum
        }else if (this.checkIds.length > 0) {
          this.deliverFormData.ids=this.checkIds
        }
        this.deliverModalShow=true
      },
      saveDeliver(){
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            this.saveDeliverAction()
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
      saveDeliverAction(){
        var request=[]
        this.deliverFormData.ids.forEach(id=>{
          var params={orderItemId:id,logisticsCom:this.deliverFormData.logisticsCom,logisticsNum:this.deliverFormData.logisticsNum}
          request.push($OrderItemService.deliver(params))
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
              title: `共有 ${resultArray.length} 个订单发货失败`,
              desc: str
            })
          }
          if (res.length>resultArray.length) {
            this.deliverModalShow=false
            this.$Message.success('发货成功')
            this.getOrderItemList(this.searchParams.p,this.searchParams.size)
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      exportOrderItem(){
        var params={...this.searchParams}
        if (params.status=='ALL') delete params.status
        params.p=1
        params.size= 4000
        $OrderItemService.excel(params).then(res=>{
          if (res.code===1){
            window.location.href=res.data
          }
        })
      },
      viewProduct(id){
        this.viewProductId=id
      },
      selectDateRange(value){
        this.searchParams.createDateL=value[0]+':00'
        this.searchParams.createDateR=value[1]+':00'

      },
      clickTab(name){
        this.searchParams.status=name
        this.getOrderItemList()
        this.$router.replace({path:'/supplier/order/list',query:this.searchParams})
      },
      copySuccess(){
       this.$Message.success('复制成功')
      },
      handleCheckAll () {
        if (this.indeterminate) {
          this.checkAll = false;
        } else {
          this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;

        if (this.checkAll) {
          var filterList=this.orderItems.list.filter(item=>item.status==='WAIT_DELIVER')
          this.checkIds = filterList.map(item=>item.id.toString())
        } else {
          this.checkIds = [];
        }
      },
      checkAllGroupChange (data) {
        let list=this.orderItems.list.map(item=>item.status==='WAIT_DELIVER')
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
      uploadProgress(){
        this.uploadLoading=true
      },
      uploadSuccess(res){
        if (res.code===1){
          this.$Message.success('数据导入成功')
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
      onSearch(){
        this.getOrderItemList()
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onClear(){
        this.dateRange=[]
        this.searchParams={}
      },
      onChangePage(p){
        this.getOrderItemList(p, this.searchParams.size)
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      onChangeSize(size){
        this.getOrderItemList( this.searchParams.p,size)
        this.$router.replace({path:this.$route.path,query:this.searchParams})
      },
      changeSearchType(value){
        var searchParams=this.searchParams
        if (value=='productName') delete searchParams.productSn
        if (value=='productSn') delete searchParams.productName
        this.searchParams=searchParams
      }
    }

  }
</script>

<style scoped>

</style>
