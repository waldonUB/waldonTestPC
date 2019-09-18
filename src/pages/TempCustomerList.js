const TempCustomerList = {
  template: `
  <div>
    <content-header>
      <template #headerLeft>客户列表</template>
      <template #headerRight>
        <btn-success>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-11"></use>
          </svg>
          <span>客户录入</span>
        </btn-success>
      </template>
    </content-header>
    <content-panel>
      <section class="panel-body">
        <ul class="base-tabs">
          <li class="tab-pane" v-for="(item, index) of customerTypeList"
              :key="item.code" :class="{isActive: item.code === currentType}"
              @click="changeCusType(item.code, index)">
            {{item.label}}
          </li>
          <li class="tab-pane tabs-slider" :style="{left: baseLeftPoint}"></li>
        </ul>
        <ul class="tag-tabs">
          <li class="tab-pane" v-for="(item, index) of tagList"
              :key="item.code" :class="{isActive: item.code === currentTag}"
              @click="changeTagType(item.code, index)">
            {{item.label}}
          </li>
          <li class="tab-pane tabs-slider" :style="{width: tagWidth, left: tagLeftPoint}"></li>
        </ul>
        <div class="select-box">
          <yx-select :current.sync="condition.sName"
                     :options="sList"
                     select-width="120px">
          </yx-select>
          <input type="text" class="small-input" placeholder="联系人">
          <input type="text" class="middle-input" placeholder="联系手机">
          <input type="text" class="middle-input" placeholder="联系QQ">
          <btn-success>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-4"></use>
            </svg>
            <span>搜索</span>
          </btn-success>
        </div>
        <yx-table :table-th-list="tableThList">
          <tr v-for="item of tableList"
              :key="item.id">
            <td>{{item.contacts}}</td>
            <td>{{item.mobile}}</td>
            <td>{{item.qq}}</td>
            <td>{{item.sourceName}}</td>
            <td>{{item.sid}}</td>
            <td>{{item.visitsTimeName}}</td>
            <td>
              <btn-normal>详细</btn-normal>
            </td>
            <td>{{item.labelId}}</td>
            <td>
              <btn-normal class="btn-normal-rt">回访记录</btn-normal>
              <btn-normal class="btn-normal-rt">编辑</btn-normal>
              <btn-normal>淘汰</btn-normal>
            </td>
          </tr>
        </yx-table>
        <yx-pagination :pageParams="pageParams"></yx-pagination>
      </section>
    </content-panel>
  </div>`,
  components: {ContentHeader, BtnSuccess, BtnNormal, ContentPanel, YxTable, YxPagination, YxSelect},
  data () {
    return {
      // 搜索条件区域
      condition: {
        sName: '' // 业务人员
      },
      // 分页信息
      pageParams: {
        total: 1, // 条数
        pageNow: 1,
        limit: 10
      },
      currentType: 'followBase',
      currentTag: 'all',
      customerTypeList: [{
        code: 'followBase',
        label: '跟进库'
      }, {
        code: 'getOutBase',
        label: '淘汰库'
      }],
      tagList: [{
        code: 'all',
        label: '全部'
      }, {
        code: 'contacted',
        label: '已联系'
      }, {
        code: 'noContact',
        label: '未联系'
      }],
      baseLeftPoint: 0, // 库：初始化下标为0
      tagLeftPoint: 0, // 标签：初始化下标为0
      tagWidth: '28px',
      tableThList: [ // 表头数据
        {
          prop: 'contacts',
          label: '联系人',
          width: '120'
        },
        {
          prop: 'mobile',
          label: '联系手机',
          width: '150'
        },
        {
          prop: 'qq',
          label: '联系QQ',
          width: '150'
        },
        {
          prop: 'sourceName',
          label: '客户来源',
          width: '150'
        },
        {
          prop: 'sid',
          label: '业务员',
          width: '120'
        },
        {
          prop: 'visitsTimeName',
          label: '下次回访时间',
          width: '300'
        },
        {
          prop: 'status',
          label: '关联情况',
          width: '150'
        },
        {
          prop: 'labelId',
          label: '标签',
          width: '200'
        },
        {
          prop: 'operate',
          label: '操作',
          width: '300'
        }
      ],
      tableList: [], // 表格数据
      sList: [ // 本地试用版暂无添加业务员权限，用着假数据先
        {
          code: '01',
          label: '全部业务员'
        },
        {
          code: '02',
          label: '小叮当'
        }
      ]
    }
  },
  methods: {
    /**
     * 改变库的类型：1.跟进库 2.淘汰库
     * */
    changeCusType (code, index) {
      this.currentType = code
      this.baseLeftPoint = (index * 120) + 'px'
    },
    /**
     * 改变标签的类型：1.全部 2.已联系 3.未联系
     * */
    changeTagType (code, index) {
      this.currentTag = code
      if (index === 0) {
        this.tagLeftPoint = 0
      } else {
        this.tagLeftPoint = 57 + ((index - 1) * 71) + 'px'
      }
      if (code !== 'all') {
        this.tagWidth = '42px'
      } else {
        this.tagWidth = '28px'
      }
    },
    /**
     * 获取客户列表
     * */
    async getTsClientList () {
      let params = {
        sid: -1
      }
      const res = await this.$yxPost('/client/tsClient_h.jsp?cmd=getTsClientList', params)
      if (res.data && res.data.success) {
        this.tableList = res.data.data
        this.pageParams.total = res.data.total
      } else {
      }
    }
  },
  created () {
    this.condition.sName = this.sList[0].label
    // this.getTsClientList()
  }
}
