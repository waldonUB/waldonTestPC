const routes = [
  { path: '', redirect: '/customerList' },
  { path: '/customerList', component: TempCustomerList },
  { path: '/tagManage', component: TempTagManage },
]
const router = new VueRouter({
  routes
})
