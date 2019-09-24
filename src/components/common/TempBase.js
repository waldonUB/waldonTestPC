/**
 * 页面和通用组件的基础组成部分
 */
// 内容头部组件
Vue.component('ContentHeader', {
  template: `
  <div class="content-header">
    <div class="header-left">
      <slot name="headerLeft"></slot>
    </div>
    <div class="header-right">
      <slot name="headerRight"></slot>
    </div>
  </div>`
})
// 内容body
Vue.component('ContentPanel', {
  template: `
  <div class="panel-wrapper">
    <slot></slot>
  </div>`
})

// 表格内选择标签组件
Vue.component('TagSelect', {
  template: `
  <div v-show="isShow" class="tag-select-box">
    <div class="tooltip-body">
      <div class="tip-title">
        <span>标签：</span>
      </div>
      <div class="tip-input">
        <yx-select
          :selectedLabel="tagLabel"
          select-width="280px"
          select-height="40px"
          ref="selectTb">
          <li v-for="item of tagList"
            :key="item.code"
            @mousedown="changeTagSelect(item)">
            {{item.label}}
          </li>
        </yx-select>
      </div>
    </div>
    <div class="tooltip-footer">
      <div class="btn-button-group">
        <yx-btn type="success" class="btn-text-rt" @click.native="setTsClientLabel">确认</yx-btn>
        <yx-btn @click.native="cancel">取消</yx-btn>
      </div>
    </div>
  </div>`,
  props: {
    isShow: Boolean,
    tagData: {
      required: true,
      default: ''
    }
  },
  data () {
    return {
      tagList: [],
      tagLabel: '',
      labelId: ''
    }
  },
  watch: {
    isShow (newVal) {
      if (!newVal) {
        this.cancel()
      }
    },
    'tagData.labelId' (newVal) {
      const currentLabel = this.tagList.find(item => item.code === newVal)
      if (currentLabel) {
        this.tagLabel = currentLabel.label
      }
      
    }
  },
  methods: {
    /**
     * 获取标签列表
     */
    async getTagList () {
      let params = {
        sid: -1
      }
      const res = await this.$yxPost('/client/tsClientLabel_h.jsp?cmd=getTsClientLabelList', params)
      if (res.data && res.data.success) {
        this.tagList = res.data.data.map(item => {
          return {
            code: item.id,
            label: item.name
          }
        })
      }
    },
    cancel () {
      this.$emit('update:isShow', false)
      this.tagLabel = ''
      this.labelId = ''
      this.$refs.selectTb.closeOptions()
    },
    changeTagSelect (item) {
      this.tagLabel = item.label
      this.labelId = item.code
      this.$refs.selectTb.closeOptions()
    },
    /**
     * 更新客户列表标签
     */
    async setTsClientLabel () {
      let params = {
        cid: this.tagData.cid,
        labelId: this.labelId
      }
      const res = await this.$yxPost('/client/tsClient_h.jsp?cmd=setTsClientLabel', params)
      if (res.data && res.data.success) {
        this.$emit('success', res.data)
        this.cancel()
      }
    }
  },
  mounted () {
    this.getTagList()
  }
})