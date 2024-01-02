import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'index',
    path: '/',
    component: () => import('pages/InstallerIntro.vue'),
    props: true,
    // component: () => import('layouts/MainLayout.vue'),
    // children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    // name: 'path',
    path: '/path',
    component: () => import('pages/PathSelect.vue'),
    // meta: {title: appTitle}
    props: true,
  },
  {
    // name: 'path',
    path: '/install/',
    component: () => import('pages/InstallPage.vue'),
    // meta: {title: appTitle}
    props: true,
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
