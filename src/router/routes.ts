import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/BorderLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('src/pages/WelcomePage.vue'),
        meta: {
          title: '',
          titleImg: true,
          socials: true,
          back: '',
          next: '/select/',
        },
      },
      {
        path: '/select/',
        component: () => import('src/pages/InstallationType.vue'),
        meta: {
          title: 'Installation Type',
          socials: false,
          back: '/',
          next: '',
        },
      },
      // Install Type + Configuration
      {
        path: '/singleplayer/',
        component: () => import('src/pages/SingleplayerInstall.vue'),
        meta: {
          title: 'Single Player Installation',
          socials: false,
          back: '/select/',
          next: '/install/',
        },
      },
      {
        path: '/multiplayer/',
        component: () => import('src/pages/MultiplayerInstall.vue'),
        meta: {
          title: 'Multi-Player Installation',
          socials: false,
          back: '/select/',
          next: '/install/',
        },
      },
      {
        path: '/server/',
        component: () => import('src/pages/ServerInstall.vue'),

        meta: {
          title: 'Server Installation',
          socials: false,
          back: '/select/',
          next: '/install/',
        },
      },
      // Install & Post-Install
      {
        path: '/install/',
        component: () => import('pages/InstallPage.vue'),
        meta: {
          title: 'Download & Install',
          socials: false,
          back: '/select/',
          next: '/complete/',
        },
      },
      {
        path: '/complete/',
        component: () => import('pages/InstallComplete.vue'),
        meta: {
          titleImg: true,
          socials: true,
          closeBtn: true,
          back: '',
          next: '',
        },
      },
    ],
  },

  // {
  //   name: 'Installation Type',
  //   path: '/installSelect/',
  //   component: () => import('layouts/BorderLayout.vue'),
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('pages/InstallationType.vue'),
  //     },
  //   ],
  //   meta: {
  //     title: 'Installation Type',
  //     titleImg: false,
  //     socials: false,
  //     back: '/',
  //     next: '/installSelect/',
  //   },
  // },
  // {
  //   // name: 'path',
  //   path: '/installSelect/',
  //   component: () => InstallSelect,
  //   // meta: {title: appTitle}
  //   props: true,
  // },
  // {
  //   // name: 'path',
  //   path: '/singleplayer/',
  //   component: () => import('pages/SingleplayerInstall.vue'),
  //   // meta: {title: appTitle}
  //   props: true,
  // },
  // {
  //   // name: 'path',
  //   path: '/multiplayer/',
  //   component: () => import('pages/MultiplayerInstall.vue'),
  //   // meta: {title: appTitle}
  //   props: true,
  // },
  // {
  //   // name: 'path',
  //   path: '/hosting/',
  //   component: () => import('pages/HostingInstall.vue'),
  //   // meta: {title: appTitle}
  //   props: true,
  // },
  // {
  //   // name: 'path',
  //   path: '/path/',
  //   component: () => import('pages/PathSelect.vue'),
  //   // meta: {title: appTitle}
  //   props: true,
  // },
  // {
  //   path: '/install/',
  //   component: () => import('pages/InstallPage.vue'),
  //   props: true,
  // },
  // {
  //   path: '/complete/',
  //   component: () => import('pages/InstallComplete.vue'),
  //   props: true,
  // },

  // // Always leave this as last one,
  // // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue'),
  // },
];

export default routes;
