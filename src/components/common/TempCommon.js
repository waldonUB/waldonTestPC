/**
 * 通用的工具类组件
 */

// 合并的按钮组件
Vue.component('YxBtn', {
  template:
      `<button class="yx-btn" :class="[classType, btnSize, isRound]">
        <slot></slot>
      </button>`,
  props: {
    size: {
      type: String
    },
    type: {
      type: String,
      validator (value) {
        return ['primary', 'success', 'warning', 'danger', 'info', 'text'].includes(value)
      }
    },
    plain: Boolean,
    round: Boolean,
    circle: Boolean,
    disabled: Boolean
  },
  computed: {
    classType () {
      switch (this.type) {
        case 'success':
          return 'yx-btn-success'
        case 'text':
          return 'yx-btn-text'
        default:
          return 'yx-btn-default'
      }
    },
    btnSize () {
      switch (this.size) {
        case 'mini':
          return 'btn-mini'
        case 'small':
          return 'btn-small'
        case 'medium':
          return 'btn-medium'
        case 'large':
          return 'btn-large'
      }
    },
    isRound () {
      if (this.round) {
        return 'yx-btn-round'
      }

    }
  }
})

// 弹窗组件
Vue.component('YxAlert', {
  template: `
  <div v-show="isShow" class="alert-error">
    <svg class="icon" aria-hidden="true">
      <use :xlink:href="iconType"></use>
    </svg>
    <slot></slot>
  </div>`,
  props: {
    type: {
      type: String,
      default: 'info'
    },
    timeout: {
      type: Number,
      default: 3000
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconType () {
      switch (this.type) {
        case 'success':
          return '#icon-success'
        case 'error':
          return '#icon-error'
        case 'info':
          return '#icon-info'
        case 'warn':
          return '#icon-warn'
      }
    }
  },
  watch: {
    isShow (newVal) {
      const vm = this
      if (newVal) {
        setTimeout(function () {
          vm.$emit('update:isShow', false)
        }, this.timeout)
      }
    }
  }
})

// 下拉框组件
Vue.component('YxSelect', {
  template: `
  <div ref="yxSelect"
    class="select-input"
    :style="{width: selectWidth,
    height: selectHeight,
    lineHeight: selectHeight}">
    <input readonly type="text">
    <svg @click="showOptions" class="icon-select" aria-hidden="true">
      <use xlink:href="#icon-icon-8"></use>
    </svg>
    <div class="show-label"
      @click="showOptions">
        {{selectedLabel || '请选择'}}
    </div>
    <ul class="select-options"
      v-show="isShowOptions"
      ref="yxSelectOptions">
      <slot></slot>
    </ul>
  </div>`,
  props: {
    selectedLabel: {
      default: ''
    },
    selectWidth: {
      default: ''
    },
    selectHeight: {
      default: '34px'
    },
    top: Boolean
  },
  data () {
    return {
      isShowOptions: false // 是否显示下拉选项
    }
  },
  computed: {
  },
  methods: {
    showOptions () {
      this.isShowOptions = !this.isShowOptions
      const SPACE = 10
      this.$nextTick(() => {
        const point = {
          offsetLeft: 0,
          offsetTop: 0
        }
        const yxSelect = this.$refs.yxSelect
        const bodyHeight = document.body.offsetHeight
        const optionsHeight = this.$refs.yxSelectOptions.offsetHeight
        const yxSelectHeight = yxSelect.offsetHeight
        this.getOffset(yxSelect, point)
        if ((bodyHeight - (point.offsetTop + yxSelectHeight + SPACE)) > optionsHeight) { // 距离底部高度有剩就向下展开
          this.$refs.yxSelectOptions.style.top = (yxSelectHeight + SPACE) + 'px'
        } else {
          this.$refs.yxSelectOptions.style.top = -(optionsHeight + SPACE) + 'px'
        }
        // if (this.top) { // 后续改成自动选择上下的，递归获取元素距离屏幕左上距离
        //   const optionsHeight = this.$refs.yxSelectOptions.offsetHeight
        //   this.$refs.yxSelectOptions.style.top = -(optionsHeight + 10) + 'px'
        // }
      })
    },
    closeOptions () {
      this.isShowOptions = false
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
  mounted () {
    const vm = this
    document.body.addEventListener('mouseup', function () {
      vm.isShowOptions = false
    })
  }
})

// 分页组件
Vue.component('YxPagination', {
  template: `
  <div class="pagination-wrapper">
    <div class="left-part">
      <span>共有{{pageParams.total}}条记录，每页显示</span>
      <yx-select 
        :selectedLabel="selectedLabel"
        select-width="70px"
        ref="pageSelect">
        <li v-for="item of pageSize"
          :key="item"
          @mousedown="changePageSelect(item)">
          {{item}}
        </li>
      </yx-select>
    </div>
    <div class="right-part">
      <yx-btn class="icon-only">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-13"></use>
        </svg>
      </yx-btn>
      <span class="page-info">{{pageParams.pageNow + 1}} / {{pages || 1}}</span>
      <yx-btn class="icon-only">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-14"></use>
        </svg>
      </yx-btn>
      <input type="text" class="small-input" v-model="pageIndex">
      <yx-btn @click.native="gotoIndex">
        <span>跳转</span>
      </yx-btn>
    </div>
  </div>`,
  props: {
    pageParams: {
      type: Object,
      required: true,
      default: () => {
        return {
          total: 1, // 条数
          pageNow: 1,
          limit: 10
        }
      }
    }
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: [10, 20, 50],
      selectedLabel: ''
    }
  },
  computed: {
    /**
     * 计算总页数，当总条数或者limit改变时重新计算
     * */
    pages () {
      if (this.pageParams.total % this.pageParams.limit === 0) {
        return this.pageParams.total / this.pageParams.limit
      } else {
        return Math.floor((this.pageParams.total / this.pageParams.limit)) + 1
      }
    }
  },
  methods: {
    gotoIndex () {
      this.pageParams.pageNow = this.pageIndex
      this.$emit('gotoIndex', this.pageIndex)
    },
    changePageSelect (item) {
      this.selectedLabel = item
      this.$emit('change', item)
      this.$refs.pageSelect.closeOptions()
    }
  },
  created () {
    this.selectedLabel = 20
  }
})
// 表格组件
Vue.component('YxTable', {
  template: `
  <div class="table-wrapper">
    <table>
      <colgroup>
        <col v-for="item of tableThList"
             :name="item.prop"
             :key="item.prop"
             :style="{width: item.width + 'px'}">
      </colgroup>
      <thead>
      <tr>
        <th v-for="item of tableThList"
            :key="item.prop">
          {{item.label}}
        </th>
      </tr>
      </thead>
      <tbody>
        <slot v-if="tableData.length > 0"></slot>
        <tr v-else class="table-empty">
          <td :colspan="tableThList.length">
            <span>暂无数据</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
  props: {
    tableThList: { // 表头数据
      type: Array,
      required: true,
      default: () => []
    },
    tableData: { // 表体数据
      type: Array,
      default: () => []
    }
  }
})

// tooltip组件
Vue.component('YxTooltip', {
  template: `
  <div id="tooltip" ref="tooltip" class="tooltip-box">
    <div class="tooltip-body">
      <div class="tip-title">
        <span>标签名称：</span>
      </div>
      <div class="tip-input">
        <input v-model="tipData.name" type="text" class="middle-input" placeholder="请输入标签名称">
      </div>
    </div>
    <div class="tooltip-footer">
      <div class="btn-button-group">
        <yx-btn type="success" class="btn-text-rt" @click.native="setTipData">确认</yx-btn>
        <yx-btn @click.native="cancel">取消</yx-btn>
      </div>
    </div>
  </div>`,
  data () {
    return {
      isShow: false,
      tipData: {
        id: '',
        name: ''
      }
    }
  },
  methods: {
    setTipData () {
      this.$bus.$emit('setTipData', this.tipData)
      this.hideToolTip()
    },
    /**
     * 如果不是在当前提示框内就隐藏
     */
    hideToolTip () {
      const tooltip = this.$refs.tooltip
      tooltip.style.display = 'none'
      this.tipData = {
        id: '',
        name: ''
      }
    },
    cancel () {
      this.hideToolTip()
    }
  },
  mounted () {
    const vm = this
    vm.$bus.$on('getTagRowInfo', function (row) {
      vm.tipData = {...row}
    })
    document.body.addEventListener('mouseup', vm.hideToolTip)
    const tooltip = this.$refs.tooltip
    tooltip.addEventListener('mouseup', function (e) {
      e.stopPropagation()
    })
  }
})

// dialog组件
Vue.component('YxDialog', {
  template: `
  <div ref="yxDialog" class="yx-dialog" v-if="isShow">
    <div class="content">
      <div class="yx-dialog-header">
        <span>{{title}}</span>
        <div class="icon-rt" @click="hideDialog">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-error1"></use>
          </svg>
        </div>
      </div>
      <div class="yx-dialog-body">
        <slot></slot>
      </div>
    </div>
  </div>`,
  props: {
    isShow: Boolean,
    title: {
      default: ''
    }
  },
  methods: {
    hideDialog () {
      this.$emit('update:isShow', false)
    }
  }
})
