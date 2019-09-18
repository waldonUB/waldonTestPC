// 弹窗组件
const YxAlert = {
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
}

// 按钮组件
const BtnDefault = {
  template: `
  <div class="btn-default">
    <slot></slot>
  </div>`
}
const BtnNormal = {
  template: `
  <div class="btn-normal">
    <slot></slot>
  </div>`
}
const BtnSuccess = {
  template: `
  <div class="btn-success">
    <slot></slot>
  </div>`
}

// 内容头部组件
const ContentHeader = {
  template: `
  <div class="content-header">
    <div class="header-left">
      <slot name="headerLeft"></slot>
    </div>
    <div class="header-right">
      <slot name="headerRight"></slot>
    </div>
  </div>`
}

// 内容body
const ContentPanel = {
  template: `
  <div class="panel-wrapper">
    <slot></slot>
  </div>`
}

// 下拉框组件
const YxSelect = {
  template: `
  <div class="select-input" :style="{width: selectWidth}">
    <input readonly type="text"
           class="select-option"
           v-model="current"
           @click="showOptions"
           @blur="closeOptions">
    <svg class="icon-select" aria-hidden="true">
      <use xlink:href="#icon-icon-8"></use>
    </svg>
    <ul class="select-options" v-show="isShowOptions">
      <li v-for="item of options"
          :key="item.code"
          @mousedown="selectOption(item)">
        {{item.label}}
      </li>
    </ul>
  </div>`,
  props: ['current', 'options', 'selectWidth'],
  data () {
    return {
      isShowOptions: false // 是否显示下拉选项
    }
  },
  methods: {
    showOptions () {
      this.isShowOptions = !this.isShowOptions
    },
    closeOptions () {
      this.isShowOptions = false
    },
    selectOption (item) {
      this.showOptions()
      this.$emit('update:current', item.label)
    }
  }
}

// 分页组件
const YxPagination = {
  template: `
  <div class="pagination-wrapper">
    <div class="left-part">
      <span>共有{{pageParams.total}}条记录，每页显示</span>
      <yx-select :current.sync="pageParams.limit"
                 :options="pageSize"
                 select-width="70px">
      </yx-select>
    </div>
    <div class="right-part">
      <btn-default>
        <svg class="icon-only" aria-hidden="true">
          <use xlink:href="#icon-icon-13"></use>
        </svg>
      </btn-default>
      <span class="page-info">{{pageParams.pageNow}} / {{pages}}</span>
      <btn-default>
        <svg class="icon-only" aria-hidden="true">
          <use xlink:href="#icon-icon-14"></use>
        </svg>
      </btn-default>
      <input type="text" class="small-input" v-model="pageIndex">
      <btn-default class="text-only" @click.native="gotoIndex">
        <span>跳转</span>
      </btn-default>
    </div>
  </div>`,
  components: {BtnDefault, YxSelect},
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
      pageSize: [
        {
          code: '01',
          label: '10'
        },
        {
          code: '02',
          label: '20'
        },
        {
          code: '03',
          label: '50'
        }
      ]
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
    }
  }
}

// 表格组件
const YxTable = {
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
        <slot></slot>
      </tbody>
    </table>
  </div>`,
  props: {
    tableThList: { // 表头数据
      type: Array,
      required: true,
      default: () => []
    }
  }
}
