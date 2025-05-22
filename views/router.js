const loadComp = (type, name) => async () => {
  try {
    const [c] = await importComponent([`/views/${type}/${name}?v=${ver ?? ''}`]);
    return c;
  } catch (e) {
    console.error(`Failed to load ${type.slice(0, -1)}: ${name}`, e);
    return { template: `<div style="color:red;">Error loading ${type.slice(0, -1)}: ${name}</div>` };
  }
};

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Dealer-Login', component: loadComp('layouts', 'layout_login.js'), meta: { requiresAuth: false } },
  { path: '/dashboard', name: 'Dealer-Dashboard', component: loadComp('layouts', 'layout_dealer.js'), meta: { requiresAuth: true } },
  {
    path: '/purchase-master',
    component: loadComp('layouts', 'layout_dealer.js'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dealer-Purchase-Master', component: loadComp('pages', 'purchase-master/list.js'), meta: { requiresAuth: true } },
      { path: 'add', name: 'Dealer-Add-PM', component: loadComp('pages', 'purchase-master/add.js'), meta: { requiresAuth: true } },
      {
        path: 'lead/:id',
        component: loadComp('pages', 'purchase-master/lead.js'),
        props: true,
        children: [
          { path: '', name: 'Dealer-View-PM', component: loadComp('pages', 'purchase-master/view.js'), props: true },
          { path: 'edit', name: 'Dealer-Edit-PM', component: loadComp('pages', 'purchase-master/edit.js'), props: true },
          { path: 'status', name: 'Dealer-View-PM-Status', component: loadComp('pages', 'purchase-master/status.js'), props: true }
        ]
      }
    ]
  },
  { path: '/:catchAll(.*)', name: 'NotFound', component: loadComp('pages', 'page_404.js'), meta: { requiresAuth: false } }
];



const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  console.log(`Routing to: ${to.fullPath}`, to);

  if (to.meta.requiresAuth) {
    //this.vuemthod();
  }

  next();
});

export default router;