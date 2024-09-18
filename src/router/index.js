import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/logout', component: () => import('../views/Logout.vue') },
  { path: '/products', meta: { requiresAuth: true }, component: () => import('../views/Products.vue') },
  { path: '/:pathMatch(.*)', component: () => import('../views/NotFound.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!sessionStorage.getItem('authorizationToken')) {
      next({ path: '/login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
