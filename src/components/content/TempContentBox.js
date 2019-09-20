const TempContentBox = {
  template: `
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
    <div class="content-main">
      <router-view></router-view>
    </div>
  </div>`,
  data () {
    return {
      menuList: [{
        code: 'customerList',
        label: '客户列表'
      }, {
        code: 'tagManage',
        label: '标签管理'
      }]
    }
  },
  methods: {
    linkToView (code) {
      this.$router.push({path: code})
    }
  }
}
