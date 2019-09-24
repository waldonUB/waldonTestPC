routerComponents.TempCustomerList = {
  template: `
  <div class="list-wrapper">
    <section v-show="!isEdit">
      <content-header>
        <template #headerLeft>客户列表</template>
        <template #headerRight>
          <yx-btn type="success" @click.native="gotoEdit">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-11"></use>
            </svg>
            <span>客户录入</span>
          </yx-btn>
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
            <yx-btn type="success" @click.native="getTsClientList">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon-4"></use>
              </svg>
              <span>搜索</span>
            </yx-btn>
          </div>
          <yx-table :table-th-list="tableThList" :tableData="tableList">
            <tr v-for="item of tableList"
                :key="item.id">
              <td>{{item.contacts}}</td>
              <td>{{item.mobile}}</td>
              <td>{{item.qq}}</td>
              <td>{{item.sourceName}}</td>
              <td>{{item.sid === 0 ? '无' : ''}}</td>
              <td>{{item.visitsTimeName === '' ? '无' : ''}}</td>
              <td>
                <yx-btn type="text" @click.native="getStatusList">
                  <span>详细</span>
                </yx-btn>
              </td>
              <td>
                <yx-btn :ref="'tagSelectBtn' + item.id" round @click.native="setTag(item)">
                  <span>{{translateTagName(item.labelId)}}</span>
                </yx-btn>
              </td>
              <td>
                <yx-btn type="text" class="btn-text-rt" @click.native="getRecordList">
                  <span>回访记录</span>
                </yx-btn>
                <yx-btn @click.native="editRow(item)" type="text" class="btn-text-rt">
                  <span>编辑</span>
                </yx-btn>
                <yx-btn v-if="condition.status === 1" @click.native="setTsClientStatus(item.id, 2)" type="text">
                  <span>淘汰</span>
                </yx-btn>
                <yx-btn v-else @click.native="setTsClientStatus(item.id, 1)" type="text">
                  <span>跟进</span>
                </yx-btn>
              </td>
            </tr>
          </yx-table>
          <yx-pagination :pageParams="condition" @change="getChange"></yx-pagination>
        </section>
      </content-panel>
    </section>
    <section v-show="isEdit" class="edit-wrapper">
      <temp-customer-edit ref="customerEdit" :is-edit.sync="isEdit" @editSuccess="getTsClientList"></temp-customer-edit>
    </section>
    <tag-select ref="tagSelectTb" :tagData="currentRow" :isShow.sync="isTagSelectShow" @success="getTsClientList"></tag-select>
    <yx-dialog title="关联情况" ref="statusDialog" :isShow.sync="statusShow">
      <yx-table :table-th-list="statusThList" :tableData="statusList">
        <tr v-for="item of statusList"
          :key="item.id">
          <td>{{item.org}}</td>
          <td>{{item.thirdCompId}}</td>
        </tr>
      </yx-table>
    </yx-dialog>
    <yx-dialog title="回访记录（最多10条）" ref="recordDialog" :isShow.sync="recordShow">
    <yx-table :table-th-list="recordThList" :tableData="recordList">
        <tr v-for="item of recordList"
          :key="item.id">
          <td>{{item.createTime}}</td>
          <td>{{item.intention}}</td>
          <td>{{item.backTime}}</td>
          <td>{{item.mark}}</td>
        </tr>
      </yx-table>
    </yx-dialog>
  </div>`,
  components: {TempCustomerEdit: routerComponents.TempCustomerEdit},
  data () {
    return {
      // 搜索条件区域
      condition: {
        sid: -1, // 业务人员id
        contacts: '', // 联系人名称
        mobile: '', // 联系人手机
        qq: '', // 联系人QQ
        status: 1, // 库状态
        labelId: 0, // 标签id
        limit: 20, // 当前条数
        pageNow: 0, // 当前页
        total: 0
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
      statusShow: false, // 关联情况对话框
      recordShow: false, // 回访记录
      statusThList: [
        {
          prop: 'org',
          label: '所属公司',
          width: '180'
        },
        {
          prop: 'thirdCompId',
          label: '第三方公司ID',
          width: '150'
        },
      ],
      statusList: [],
      recordThList: [
        {
          prop: 'createTime',
          label: '记录创建时间',
          width: '180'
        },
        {
          prop: 'intention',
          label: '意向度',
          width: '150'
        },
        {
          prop: 'backTime',
          label: '下次回访时间',
          width: '180'
        },
        {
          prop: 'mark',
          label: '备注情况',
          width: '180'
        },
      ],
      recordList: [],
      isTagSelectShow: false,
      currentRow: {}
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
        this.condition.total = res.data.total
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
      const label = this.tagList.find(item => item.id && item.id === labelId)
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
    },
    /**
     * 分页改变
     */
    getChange (page) {
      this.condition.limit = page
      this.getTsClientList()
    },
    getStatusList () {
      this.statusShow = true
    },
    /**
     * 获取回访记录列表
     */
    getRecordList () {
      this.recordShow = true
    },
    /**
     * 设置标签
     */
    setTag (row) {
      const TOP_SPACE = 10 // 往上的间距
      const point = {
        offsetLeft: 0,
        offsetTop: 0
      }
      const tagSelectTb = this.$refs.tagSelectTb.$el
      const tagSelectBtn = this.$refs['tagSelectBtn' + row.id][0].$el
      this.getOffset(tagSelectBtn, point)
      tagSelectTb.style.top = (point.offsetTop + tagSelectBtn.offsetHeight + TOP_SPACE)
      tagSelectTb.style.left = point.offsetLeft
      tagSelectTb.addEventListener('mouseup', function (e) {
        e.stopPropagation()
      })
      tagSelectBtn.addEventListener('mouseup', function (e) {
        e.stopPropagation()
      })
      this.isTagSelectShow = true // 等调整完位置再显示，减少重排
      this.currentRow = {
        cid: row.id,
        labelId: row.labelId
      }
    },
    /**
     * 获取页面元素位置
     */
    getOffset (el, point) {
      point.offsetLeft += el.offsetLeft
      point.offsetTop += el.offsetTop
      if (el.offsetParent) {
        el = el.offsetParent
        this.getOffset(el, point)
      }
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
  },
  mounted () {
    const vm = this
    document.body.addEventListener('mouseup', function () {
      vm.isTagSelectShow = false
    })
  }
}
