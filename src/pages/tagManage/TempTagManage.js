routerComponents.TempTagManage = {
  template: `
  <div class="list-wrapper">
    <content-header>
      <template #headerLeft>
        <span>标签管理</span>
      </template>
    </content-header>
    <content-panel>
      <section class="panel-body">
        <div class="btn-group">
          <yx-btn type="success" v-tooltip>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-11"></use>
            </svg>
            <span>添加标签</span>
          </yx-btn>
        </div>
        <yx-table :table-th-list="tableThList" :tableData="tableList">
          <tr v-for="item of tableList"
              :key="item.id">
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
            <td>
              <yx-btn v-tooltip type="text" class="btn-text-rt" @click.native="getTagRowInfo(item)">
                <span>重命名</span>
              </yx-btn>
              <yx-btn @click.native="delTsClientLabel(item.id)" type="text">
                <span>删除</span>
              </yx-btn>
            </td>
          </tr>
        </yx-table>
        <yx-pagination :pageParams="pageParams"></yx-pagination>
      </section>
    </content-panel>
    <yx-alert type="error" :is-show.sync="isShow">{{showMsg}}</yx-alert>
  </div>`,
  data () {
    return {
      // 分页信息
      pageParams: {
        total: 1, // 条数
        pageNow: 0,
        limit: 10
      },
      tableThList: [
        {
          prop: 'id',
          label: 'ID',
          width: '150'
        },
        {
          prop: 'name',
          label: '标签名称',
          width: '800'
        },
        {
          prop: 'operate',
          label: '操作',
          width: '150'
        }
      ],
      tableList: [],
      isShow: false,
      showMsg: ''
    }
  },
  methods: {
    /**
     * 获取标签列表
     * */
    async getTsClientLabelList () {
      let params = {
        sid: -1
      }
      const res = await this.$yxPost('/client/tsClientLabel_h.jsp?cmd=getTsClientLabelList', params)
      if (res.data && res.data.success) {
        this.tableList = res.data.data
        this.pageParams.total = res.data.total
      }
    },
    /**
     * 添加标签
     * */
    async addTsClientLabel (tagName) {
      let params = {
        sid: -1,
        name: tagName
      }
      const res = await this.$yxPost('/client/tsClientLabel_h.jsp?cmd=addTsClientLabel', params)
      if (res.data && res.data.success) {
        this.getTsClientLabelList()
      } else {
        this.isShow = true
        this.showMsg = res.data.msg
      }
    },
    /**
     * 获取当前行标签信息
     */
    getTagRowInfo (row) {
      this.$bus.$emit('getTagRowInfo', row)
    },
    /**
     * 修改标签
     * eoLinker的setTsClientLabel接口提供的参数有问题，需要传id和name就行
     */
    async setTsClientLabel (id, name) {
      let params = {
        id,
        name
      }
      const res = await this.$yxPost('/client/tsClientLabel_h.jsp?cmd=setTsClientLabel', params)
      if (res.data && res.data.success) {
        this.getTsClientLabelList()
      } else {
        this.isShow = true
        this.showMsg = res.data.msg
      }
    },
    /**
     * 删除标签
     * */
    async delTsClientLabel (id) {
      let params = {
        id
      }
      const res = await this.$yxPost('/client/tsClientLabel_h.jsp?cmd=delTsClientLabel', params)
      if (res.data && res.data.success) {
        this.getTsClientLabelList()
      } else {
        this.isShow = true
        this.showMsg = res.data.msg
      }
    }
  },
  created () {
    const vm = this
    vm.getTsClientLabelList()
    vm.$bus.$on('setTipData', function (tipData) {
      if (tipData.id) {
        vm.setTsClientLabel(tipData.id, tipData.name)
      } else {
        vm.addTsClientLabel(tipData.name)
      }
    })
  }
}
