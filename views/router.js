const loadView = view => async () => {
  try {
    const [c] = await importComponent([`/views/layouts/${view}?v=${ver ?? ''}`]);
    return c;
  } catch (e) {
    console.error(`Failed to load view: ${view}`, e);
    return { template: `<div style="color:red;">Error loading layout: ${view}</div>` };
  }
};

const loadPage = page => async () => {
  try {
    const [c] = await importComponent([`/views/pages/${page}?v=${ver ?? ''}`]);
    return c;
  } catch (e) {
    console.error(`Failed to load page: ${page}`, e);
    return { template: `<div style="color:red;">Error loading page: ${page}</div>` };
  }
};

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Dealer-Login', component: loadView('layout_login.js'), meta: { requiresAuth: false } },
  { path: '/dashboard', name: 'Dealer-Dashboard', component: loadView('layout_dealer.js'), meta: { requiresAuth: true } },
  {
    path: '/purchase-master',
    component: loadView('layout_dealer.js'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dealer-Purchase-Master', component: loadPage('purchase-master/list.js') },
      { path: 'add', name: 'Dealer-Add-PM-Lead', component: loadPage('purchase-master/add.js') },
      { path: 'edit/:id', name: 'Dealer-Edit-PM-Lead', component: loadPage('purchase-master/edit.js'), props: true },
      { path: 'status/:id/:statustype', name: 'Dealer-PM-Lead-Status', component: loadPage('purchase-master/status.js'), props: true }
    ]
  },

  { path: '/:catchAll(.*)', name: 'NotFound', component: loadView('page_404.js'), meta: { requiresAuth: true } }
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