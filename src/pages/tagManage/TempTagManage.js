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
          <btn-success v-tooltip @click.native="addTsClientLabel">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-11"></use>
            </svg>
            <span>添加标签</span>
          </btn-success>
        </div>
        <yx-table :table-th-list="tableThList">
          <tr v-for="item of tableList"
              :key="item.id">
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
            <td>
              <btn-normal v-tooltip class="btn-normal-rt">重命名</btn-normal>
              <btn-normal @click.native="delTsClientLabel(item.id)">删除</btn-normal>
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
        pageNow: 1,
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
    async addTsClientLabel () {
      let params = {
        sid: -1,
        name: '未联系'
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
    this.getTsClientLabelList()
  }
}
