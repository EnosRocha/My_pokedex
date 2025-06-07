import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../src/LoginPage.vue';
import AdminPokedex from '../src/AdminPokedex.vue';
import UserPokedex from '../src/UserPokedex.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/adminpokedex',
    name: 'AdminPokedex',
    component: AdminPokedex,
  },
  {
    path: '/userpokedex',
    name: 'UserPokedex',
    component: UserPokedex,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
