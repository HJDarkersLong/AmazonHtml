import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard', component: _import('dashboard/index')
    }]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/goods',
    name: '商品管理',
    meta: { title: '商品管理', icon: 'tree' },
    children: [
      {
        path: 'goods',
        name: '商品',
        component: _import('goods/goods'),
        meta: { title: '商品', icon: 'goods' },
        menu: 'article'
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/Article',
    name: '公告管理',
    meta: { title: '公告管理', icon: 'tree' },
    children: [
      {
        path: 'article',
        name: '公告',
        component: _import('article/article'),
        meta: { title: '公告', icon: 'example' },
        menu: 'article'
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/sort',
    name: '分类管理',
    meta: { title: '分类管理', icon: 'tree' },
    children: [
      {
        path: 'sort',
        name: '分类',
        component: _import('categorytree/categorytree'),
        meta: { title: '分类', icon: 'example' },
        menu: 'sort'
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/transport',
    name: '物流',
    meta: { title: '物流管理', icon: 'tree' },
    children: [
      {
        path: 'transport',
        name: '物流管理',
        component: _import('transport/transport'),
        meta: { title: '物流管理', icon: 'example' },
        menu: '物流管理'
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/',
    name: '',
    meta: { title: '用户权限', icon: 'table' },
    children: [
      {
        path: '', name: '用户列表', component: _import('user/user'), meta: { title: '用户列表', icon: 'user' }, menu: 'user'
      },
      {
        path: 'role',
        name: '权限管理',
        component: _import('user/role'),
        meta: { title: '权限管理', icon: 'password' },
        menu: 'role'
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
