const TempCustomerList = {
  template: `
  <div class="list-wrapper">
    <section v-show="!isEdit">
      <content-header>
        <template #headerLeft>客户列表</template>
        <template #headerRight>
          <btn-success @click.native="gotoEdit">
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
                :key="item.code" :class="{isActive: item.code === condition.status}"
                @click="changeCusType(item.code, index)">
              {{item.label}}
            </li>
            <li class="tab-pane tabs-slider" :style="{left: baseLeftPoint}"></li>
          </ul>
          <ul class="tag-tabs">
            <li class="tab-pane" v-for="(item, index) of tagList"
                :key="item.id" :class="{isActive: item.id === condition.labelId}"
                @click="changeTagType(item.id, index)">
              {{item.name}}
            </li>
            <li class="tab-pane tabs-slider" :style="{width: tagWidth, left: tagLeftPoint}"></li>
          </ul>
          <div class="select-box">
            <yx-select
              :selectedLabel="selectedLabel"
              select-width="120px"
              ref="sSelect">
              <li v-for="item of sList"
                :key="item.code"
                @mousedown="changeTagSelect(item)">
                {{item.label}}
              </li>
            </yx-select>
            <input v-model="condition.contacts" type="text" class="small-input" placeholder="联系人">
            <input v-model="condition.mobile" type="text" class="middle-input" placeholder="联系手机">
            <input v-model="condition.qq" type="text" class="middle-input" placeholder="联系QQ">
            <btn-success @click.native="getTsClientList">
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
              <td>{{item.sid === 0 ? '无' : ''}}</td>
              <td>{{item.visitsTimeName === '' ? '无' : ''}}</td>
              <td>
                <btn-normal>详细</btn-normal>
              </td>
              <td>
                <btn-table>
                  {{translateTagName(item.labelId)}}
                </btn-table>
              </td>
              <td>
                <btn-normal class="btn-normal-rt">回访记录</btn-normal>
                <btn-normal @click.native="editRow(item)" class="btn-normal-rt">编辑</btn-normal>
                <btn-normal v-if="condition.status === 1" @click.native="setTsClientStatus(item.id, 2)">淘汰</btn-normal>
                <btn-normal v-else @click.native="setTsClientStatus(item.id, 1)">跟进</btn-normal>
              </td>
            </tr>
          </yx-table>
          <yx-pagination :pageParams="pageParams"></yx-pagination>
        </section>
      </content-panel>
    </section>
    <section v-show="isEdit" class="edit-wrapper">
      <temp-customer-edit ref="customerEdit" :is-edit.sync="isEdit" @editSuccess="getTsClientList"></temp-customer-edit>
    </section>
  </div>`,
  components: {ContentHeader, BtnSuccess, BtnNormal, BtnTable, ContentPanel, YxTable, YxPagination, YxSelect, TempCustomerEdit},
  data () {
    return {
      // 搜索条件区域
      condition: {
        sid: -1, // 业务人员id
        contacts: '', // 联系人名称
        mobile: '', // 联系人手机
        qq: '', // 联系人QQ
        status: 1, // 库状态
        labelId: 0 // 标签id
      },
      // 分页信息
      pageParams: {
        total: 1, // 条数
        pageNow: 1,
        limit: 10
      },
      isEdit: false, // 是否编辑状态
      customerTypeList: [ // 库状态 1跟进库 2淘汰库
        {
          code: 1,
          label: '跟进库'
        },
        {
          code: 2,
          label: '淘汰库'
        }
      ],
      tagList: [],
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
      sList: [
        {
          code: -1,
          label: '全部业务员'
        },
        {
          code: 0,
          label: '无'
        }
      ],
      selectedLabel: '', // 已选择的业务员
    }
  },
  methods: {
    /**
     * 改变库的类型：1.跟进库 2.淘汰库
     * */
    changeCusType (code, index) {
      this.condition.status = code
      this.baseLeftPoint = (index * 120) + 'px'
      this.getTsClientList()
    },
    /**
     * 改变标签的类型
     * */
    changeTagType (id, index) {
      this.condition.labelId = id
      if (index === 0) {
        this.tagLeftPoint = 0
      } else {
        this.tagLeftPoint = 57 + ((index - 1) * 71) + 'px'
      }
      if (id !== 0) {
        this.tagWidth = '42px'
      } else {
        this.tagWidth = '28px'
      }
      this.getTsClientList()
    },
    /**
     * 获取客户列表
     * */
    async getTsClientList () {
      const res = await this.$yxPost('/client/tsClient_h.jsp?cmd=getTsClientList', this.condition)
      if (res.data && res.data.success) {
        this.tableList = res.data.data
        this.pageParams.total = res.data.total
      }
    },
    /**
     * 获取标签列表
     */
    async getTsClientLabelList () {
      let params = {
        sid: -1
      }
      const res = await this.$yxPost('/client/tsClientLabel_h.jsp?cmd=getTsClientLabelList', params)
      if (res.data && res.data.success) {
        const defaultTag = {
          id: 0,
          name: '全部'
        }
        this.tagList = res.data.data
        this.tagList.unshift(defaultTag)
      }
    },
    /**
     * 客户录入
     * */
    gotoEdit () {
      this.isEdit = true
    },
    /**
     * 更改客户库状态
     */
    async setTsClientStatus (cid, status) {
      let params = {
        cid,
        status
      }
      const res = await this.$yxPost('/client/tsClient_h.jsp?cmd=setTsClientStatus', params)
      if (res.data && res.data.success) {
        this.getTsClientList()
      }
    },
    /**
     * 改变标签
     */
    changeTagSelect (item) {
      this.selectedLabel = item.label
      this.condition.sid = item.code
      this.$refs.sSelect.closeOptions()
    },
    /**
     * 翻译标签名称
     */
    translateTagName (labelId) {
      const label = this.tagList.find(item => item.id === labelId)
      if (label) {
        return label.name
      } else {
        return '点击添加'
      }
    },
    /**
     * 编辑
     */
    editRow (row) {
      this.gotoEdit()
      this.$refs.customerEdit.getTsClient(row.id)
    }
  },
  created () {
    this.condition.sid = -1 // 全部业务员
    const selectedItem = this.sList.find(item => item.code === this.condition.sid)
    if (selectedItem) {
      this.selectedLabel = selectedItem.label
    }
    this.getTsClientList()
    this.getTsClientLabelList()
  }
}
