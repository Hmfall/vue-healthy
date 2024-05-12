import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Catalog from '@/pages/CatalogPage.vue';
import Home from '@/pages/HomePage.vue';
import Stats from '@/pages/StatsPage.vue';

const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: Home,
  },
  {
    name: 'Stats',
    path: '/stats',
    component: Stats,
  },
  {
    name: 'Catalog',
    path: '/catalog',
    component: Catalog,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
