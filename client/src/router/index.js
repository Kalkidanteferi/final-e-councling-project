import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '../views/auth/Auth.vue'
import Register from '../views/auth/Register.vue'
import UserRegister from '../views/auth/User-register.vue'
import ExpertRegister from '../views/auth/Expert-register.vue'
import Login from '../views/auth/Login.vue'

import UserHome from '../views/user/MainPage.vue'
import ExpertHome from '../views/expert/MainPage.vue'
import DiscussionForum from "../views/expert/DiscussionForum";
import DiscussionForumDetail from "../views/expert/DiscussionForumDetail";
import Blog from '../views/expert/Blog'
import BlogDetail from '../views/expert/BlogDetail'
import CounsellingService from '../views/expert/CounsellingService'
import ServiceDetail from '../views/expert/ServiceDetail'
import Chat from '../views/expert/Chat'
import Messages from '../views/expert/Messages'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: Auth,
    children: [
      {
        path: 'register',
        component: Register,
        children: [
          {
            path: '/user',
            component: UserRegister
          },
          {
            path: '/expert',
            component: ExpertRegister
          }
        ]
      },
      {
        path: 'login',
        component: Login
      }
    ]
  },
  {
    path: '/userhome',
    name: 'UserHome',
    component: UserHome
  },
  {
    path: '/experthome',
    name: 'ExpertHome',
    component: ExpertHome,
    children: [
      {
        path: 'discussion',
        component: DiscussionForum
      },
      {
        path: 'blog',
        component: Blog
      },
      {
        path: 'counselling',
        component: CounsellingService
      }
    ]
  },
  {
    path: '/discussion/:id',
    name: 'DiscussionForumDetail',
    component: DiscussionForumDetail,
    props: true
  },
  {
    path: '/service',
    name: 'ServiceDetail',
    component: ServiceDetail,
    props: true
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: BlogDetail,
    props: true
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    children: [
      {
        path:'/chat/:id',
        component: Messages,
        props: true
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/test.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
