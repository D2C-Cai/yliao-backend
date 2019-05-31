<template>
  <Row>
    <i-col span="20">
      <article id="1">
        <h1>一、添加品牌</h1>
        <div class="content">
          <p>说明：<router-link :to="{name:'SupplierBrandList'}">「品牌管理」</router-link>是全部品牌列表，可以新增品牌，编辑品牌。</p>
          <ol>
            <li>添加商品前，先添加品牌</li>
            <li>添加品牌前，先查询品牌是否存在</li>
          </ol>
        </div>
        <img src="../assets/supplier/1.jpg" width="100%">
      </article>

      <article id="2">
        <h1>二、添加商品</h1>
        <div class="content">
          <p>说明：<router-link :to="{name:'SupplierProductInsert'}">「添加商品」</router-link>可以发布商品。</p>
          <ol>
            <li>规格默认为一种规格，可以增加到三组规格</li>
            <li>市场价是市场参考价，销售价是商城实际销售价格，成本价是商城和贵司结算价格</li>
            <li>运费可以选择有料网运费模板</li>
            <li>详情页可以上传5M以下整图，不用切图</li>
          </ol>
        </div>
        <img src="../assets/supplier/2.jpg" width="100%">
      </article>

      <article id="3">
        <h1>三、商品管理</h1>
        <div class="content">
          <p>说明：<router-link :to="{name:'SupplierProductList'}">「商品管理」</router-link>可以查看商品列表，可以编辑商品，可以编辑SKU。</p>
          <ol>
            <li>编辑商品可以修改商品基本信息。编辑商品后，商品会默认下架</li>
            <li>编辑SKU可以修改SKU库存。编辑SKU后，商品不会下架。</li>
            <li>上下架商品操作，需要联系运营</li>
          </ol>
        </div>
        <img src="../assets/supplier/3.jpg" width="100%">
      </article>

      <article id="4">
        <h1>四、 订单发货</h1>
        <div class="content">
          <p>说明：<router-link :to="{name:'SupplierOrder'}">「订单管理」</router-link>是全部订单列表，可以下载「待发货」订单，导入物流信息批量发货</p>
          <ol>
            <li>下载「待发货」订单</li>
            <li>按清单发货</li>
            <li>填写发货模板，导入发货信息，批量发货</li>
          </ol>
        </div>
        <img src="../assets/supplier/4.jpg" width="100%">
      </article>

      <article id="5">
        <h1>五、 订单结算</h1>
        <div class="content">
          <ol>
            <li>批量下载订单，订单excel中包含成本价</li>
            <li>根据订单表格，核对、结算</li>
          </ol>
        </div>
      </article>
    </i-col>
    <i-col span="4">
      <div class="link">
        <a href="#1">一、添加品牌</a>
        <a href="#2">二、添加商品</a>
        <a href="#3">三、商品管理</a>
        <a href="#4">四、 订单发货</a>
        <a href="#5">五、 订单结算</a>
      </div>
    </i-col>
  </Row>
</template>

<style lang="less" scoped>
article {
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 2em;
  h1 {
    margin-bottom: 10px;
  }
  .content {
    p {
      font-weight: bold;
    }
    ol {
      margin-left: 30px;
    }
  }
}
.link {
  position: fixed;
  right: 140px;
  top: 100px;
  a {
    display: block;
    color: #515a6e;
    &:hover {
      color: #57a3f3;
    }
    &:active {
      color: #57a3f3;
    }
  }
}
</style>
