import ErrorNotFound from 'pages/ErrorNotFound.vue'
import MainLayout from 'layouts/MainLayout.vue'
import UsersPage from 'pages/UsersPage.vue'
import AuthPage from 'pages/AuthPage.vue'
import ChatPage from 'pages/ChatPage.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    name: 'MainLayout',
    children: [
      {
        path: '',
        component: UsersPage,
        name: 'UsersPage'
      },
      {
        path: '/auth',
        component: AuthPage,
        name: 'AuthPage'
      },
      {
        path: '/chat/:otherUserId',
        component: ChatPage,
        name: 'ChatPage'
      },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
    name: 'ErrorNotFound'
  }
]

export default routes
