/**
 * 控制路由页面中tooltip的位置和隐藏显示
 */
Vue.directive('tooltip', {
  bind (el, binding, vNode) {
    const TOP_SPACE = 10 // 往上的间距
    const TOOLTIP_WIDTH = 320 // 当前tooltip的宽度
    el.addEventListener('click', function () {
      const contentMainWidth = document.body.clientWidth
      if (!tooltip.style.display || tooltip.style.display === 'none') {
        const tooltip = document.getElementById('tooltip')
        if ((contentMainWidth - this.getBoundingClientRect().left) > TOOLTIP_WIDTH) { // 默认为向右显示，宽度不够时向左显示
          tooltip.style.left = this.getBoundingClientRect().left
        } else {
          tooltip.style.left = this.getBoundingClientRect().left + el.offsetWidth - TOOLTIP_WIDTH
        }
        tooltip.style.top = this.getBoundingClientRect().top + el.offsetHeight + TOP_SPACE
        tooltip.style.display = 'block' // 等调整完位置再显示，减少重排
      } else {
        tooltip.style.display = 'none'
      }
    })
  }
})