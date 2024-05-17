import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import CatalogPage from '@/pages/CatalogPage.vue';
import HomePage from '@/pages/HomePage.vue';
import StatsPage from '@/pages/StatsPage.vue';

const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: HomePage,
  },
  {
    name: 'Stats',
    path: '/stats',
    component: StatsPage,
  },
  {
    name: 'Catalog',
    path: '/catalog',
    component: CatalogPage,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
