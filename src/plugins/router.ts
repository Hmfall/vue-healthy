import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    name: 'Stats',
    path: '/stats',
    component: () => import('@/pages/StatsPage/StatsPage.vue'),
  },
  {
    name: 'Catalog',
    path: '/catalog',
    component: () => import('@/pages/CatalogPage.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
