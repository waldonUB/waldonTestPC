<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" session="false" %>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>入职测试项目</title>
  <link rel="stylesheet" href="./src/css/res/normalize.css">
  <link rel="stylesheet/less" type="text/css" href="./src/css/common/base.less">
  <link rel="stylesheet/less" type="text/css" href="./src/css/pages/layout/layout.less">
  <link rel="stylesheet/less" type="text/css" href="./src/css/components/commonTemp.less">
  <link rel="stylesheet/less" type="text/css" href="./src/css/pages/router/customerList.less">
  <link rel="stylesheet/less" type="text/css" href="./src/css/pages/router/tagManage.less">
  <script src="./src/js/less.js"></script>
  <script src="./src/js/vue.js"></script>
  <script src="./src/js/vue-router.js"></script>
  <script src="./src/router/index.js"></script>
  <script src="./src/components/common/TempCommon.js"></script>
  <script src="./src/components/common/TempBase.js"></script>
  <script src="./src/pages/customer/TempCustomerEdit.js"></script>
  <script src="./src/pages/customer/TempCustomerList.js"></script>
  <script src="./src/pages/tagManage/TempTagManage.js"></script>
  <script src="./src/css/res/iconfont/iconfont.js"></script>
</head>
<body>
<div id="app">
  <div class="yx-wrapper">
    <div class="yx-header"></div>
    <div class="content-box">
      <div class="yx-menu">
        <ul>
          <li @click="linkToView(item.code)"
              v-for="item of menuList"
              :key="item.code"
              :class="{isActive: $route.path.includes(item.code)}">
            {{item.label}}
          </li>
        </ul>
      </div>
      <div id="contentMain" class="content-main">
        <router-view></router-view>
        <yx-tooltip ref="tooltip"></yx-tooltip>
      </div>
    </div>
  </div>
</div>
<script src="./src/js/axios.js"></script>
<script src="./src/directives/tooltip/tooltip.js"></script>
<script>
  (function () {

    Vue.prototype.$bus=new Vue();

    // 后端请求配置
    axios.defaults.baseURL = 'http://st.ppp.top/ajax' // 目前只有开发环境，先不配置
    const yxPost = function (url, params) {
      return axios({
        method: 'post',
        url: url,
        params: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      })
    }
    Vue.prototype.$yxPost = yxPost

    // 路由配置
    const routes = [
      { path: '', redirect: '/customerList' },
      { path: '/customerList', component: routerComponents.TempCustomerList },
      { path: '/tagManage', component: routerComponents.TempTagManage },
    ]
    const router = new VueRouter({ routes })
    
    new Vue({
      router,
      data: {
        menuList: [{
          code: 'customerList',
          label: '客户列表'
        }, {
          code: 'tagManage',
          label: '标签管理'
        }]
      },
      methods: {
        linkToView (code) {
          if (!this.$route.path.includes(code)) {
            this.$router.push({path: code})
          }
        }
      }
    }).$mount('#app')
  }())
</script>
</body>
</html>