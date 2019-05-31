<template>
  <div>
    <Row>
      <i-col span="3">
        <div class="link">
          <a href="#1">一、提交资料&开通账号</a>
          <a href="#2">二、部署商城</a>
          <a href="#3">三、 配置商城（系统参数）</a>
          <a href="#4">四、 配置商城（挑选商品）</a>
          <a href="#5">五、 用户注册 & 授予额度</a>
          <a href="#6">六、 用户购物 & 用户签约</a>
          <a href="#7">七、 扣减债权</a>
          <a href="#8">八、 审核订单</a>
          <a href="#9">九、 客服审核</a>
          <a href="#10">十、 订单发货</a>
          <a href="#11">十一、订单售后</a>
          <a href="#12">十二、首页设置</a>
        </div>
      </i-col>
      <i-col span="20">
        <h1 id="1">一、提交资料&开通账号</h1>
        <div class="content">
          <ol>
            <li>
              <p>提交<a href="/export/AcountApplication.rar" target="_blank" download title="点我下载">《账号开通申请表》</a>及其资料 (<a href="/export/AcountApplication.rar" target="_blank" download title="点我下载">点击下载</a>)，发送电子资料到我司运营邮箱 <a href="mailto:zhugengji@d2cmall.com" title="点我发送邮件">zhugengji@d2cmall.com</a> 。</p>
            </li>
            <li>
              <p>授权委托书需双方盖章，原件寄到我司</p>
              <div class="address-card">
                <p>收件人：胡总</p>
                <p>电话：13905817657</p>
                <p>地址：浙江省杭州市西湖区莲花峰路12号D2C全球好设计</p>
              </div>
            </li>
            <li><p>我司运营接收资料、确认无误后，准备测试/线上环境，发送测试/线上环境资料到贵司《账号开通申请表》中所留邮箱</p></li>
          </ol>
        </div>

        <h1 id="2">二、部署商城</h1>
        <div class="content">
          <ol>
            <li>
              <article>
                <header><h5>无开发能力</h5></header>
                <p>由有料网部署</p>
              </article>
            </li>
            <li>
              <article>
                <header><h5>有开发能力</h5></header>
                <div style="margin-left:20px;">
                  <ol>
                    <li>双方部署测试环境，建立双方技术对接小组</li>
                    <li>贵司根据接口文档（<a href="https://github.com/d2c-git/yliao" target="_blank">https://github.com/d2c-git/yliao</a>），部署授权跳转页面，开发授权登录、扣减债权等功能</li>
                    <li>联调、上线</li>
                  </ol>
                </div>
              </article>
            </li>
          </ol>
        </div>

        <h1 id="3">三、 配置商城（系统参数）</h1>
        <div class="content">
          <p class="content-header">说明：<router-link :to="{name:'ChangeInfo'}">「信息维护」</router-link>可以查看基本信息、接口参数、参数配置，可以配置系统参数（建议按系统默认值）。</p>
          <ul>
            <li><p>最低消费额：单笔订单金额满足最低消费额，才能成功提交订单；</p></li>
            <li><p>消费浮动金额：单笔订单金额超出授权额度在消费浮动金额内，仍可以成功提交订单</p></li>
            <li><p>授权有效期：超出授权有效期后，授权额度归零</p></li>
          </ul>
          <img src="../assets/p2p/3.jpg" width="100%"/>
        </div>

        <h1 id="4">四、 配置商城（挑选商品）</h1>
        <div class="content">
          <p class="content-header">说明：<router-link :to="{ name: 'MyProduct' }">「商品管理」</router-link>是全部商品列表，可以选择某个商品是否在自己商城中展示</p>
          <ol>
            <li>根据商品标题、品类、品牌、折扣、价格范围等条件筛选商品</li>
            <li>点击“发布到商城”，商品将在商城展示；反之，点击“取消发布”，商品将不在商城展示</li>
            <li>支持批量发布/取消发布</li>
          </ol>
          <img src="../assets/p2p/4.jpg" width="100%"/>
        </div>

        <h1 id="5">五、 用户注册 & 授予额度</h1>
        <div class="content">
          <p class="content-header">
            说明：<router-link :to="{name:'MyMember'}">「我的会员」</router-link>是商城用户列表，会展示用户的姓名、手机号、授权额度（包括授权到期时间）、账号状态等。可以通过授权页面自动注册，授予额度，也可以通过excel导入注册，授予额度。
          </p>
          <label>（一）无开发能力</label>
          <ol>
            <li>和债权人确定债转销意向，明确债转销金额，告知债转销事项（包括商城网址、债权转让协议、授权有限期等）</li>
            <li>审核授权金额，并记录授权时间、授权金额</li>
            <li>下载导入会员模板，填写好授权账号（手机号）、真实姓名、身份证号、授权金额，批量导入会员。（已注册账号将直接授予额度；未注册账号将自动注册，并授予额度）</li>
            <li>通过短信或其他方式，告知用户授权结果</li>
            <li>用户主动访问商城网址，登录商城</li>
          </ol>
          <label>（二）有开发能力</label>
          <p>无需上述操作，开发部署好商城，用户通过P2P平台授权页面，自动注册，跳转到商城</p>
          <img src="../assets/p2p/5.jpg" width="100%"/>
        </div>

        <h1 id="6">六、 用户购物 & 用户签约</h1>
        <div class="content">
          <p class="content-header">说明：这是用户自主操作，无需介入</p>
          <ol>
            <li>用户选购商品，满足最小下单金额，提交订单</li>
            <li>用户查看合同内容，验证手机短信，自动签约。超出授权有效期，用户仍未签约，订单将自动关闭。</li>
          </ol>
        </div>

        <h1 id="7">七、 扣减债权</h1>
        <div class="content">
          <p class="content-header">说明：用户签约后，扣减用户债权，以免重复兑付</p>
          <label>（一）无开发能力</label>
          <ol>
            <li>导出「待平台评审」订单</li>
            <li>人工扣减债权金额</li>
          </ol>
          <label>（二）无开发能力</label>
          <p style="margin-left:30px;">需P2P平台开发扣减债权功能。商城通过API接口推送订单至P2P平台，P2P平台根据订单金额自动扣减债权</p>
        </div>

        <h1 id="8">八、 审核订单</h1>
        <div class="content">
          <p class="content-header">说明：<router-link :to="{name:'MyOrder'}">「订单管理」</router-link>是用户在商城创建的所有订单列表，会展示订单信息、商品信息等，可以点击“审核签约”，将静默签约合同。至此用户和代理公司分别签约，合同签约成功。</p>
          <ol>
            <li>筛选出「待平台审核」的订单，排查异常订单</li>
            <li>确认无误后，点击“审核签约”，合同签约成功，订单进入「待客服审核」状态</li>
          </ol>
          <img src="../assets/p2p/8.jpg" width="100%"/>
        </div>

        <h1 id="9">九、 客服审核</h1>
        <div class="content">
          说明：「客服审核」是有料网审核库存、支付等，无需介入。
        </div>

        <h1 id="10">十、 订单发货</h1>
        <div class="content">
          说明：「订单发货」是供应商进行发货操作，无需介入。
        </div>

        <h1 id="11">十一、订单售后</h1>
        <div class="content" id="eleven">
          由有料网承担。
        </div>

        <h1 id="12">十二、首页设置</h1>
        <div class="content" id="twelve">
          <p>说明：「首页设置」提供了配置商城barnner的功能，目前可以配置图片、链接。点击图片，调整到链接。</p>
          <img src="../assets/p2p/main.jpg" width="100%"/>
        </div>
      </i-col>
    </Row>


  </div>
</template>

<style lang="less" scoped>
@address-background : #EDEDED;

.address {
  &-card {
    border: 1px solid @address-background;
    padding: 10px;
    margin: 10px;
  }
}

.content {
  font-size: 13px;
  line-height: 2em;
  margin: 10px 20px;
  &-header {
    font-weight: bold;
  }
  > ol {
    margin-left: 30px;
  }
  > ul {
    margin-left: 30px;
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
