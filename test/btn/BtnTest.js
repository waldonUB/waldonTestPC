Vue.component('YxBtn', {
  template:
      `<button class="yx-btn" :style="{minWidth: width}" :class="classType">
        <slot></slot>
      </button>`,
  props: {
    size: {
      type: String,
      default: 'small'
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
    disabled: Boolean,
    width: String
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
    }
  }
})
