import Vue from 'vue'
import Router from 'vue-router'
// import Layout from '@/components/integration/admin'

Vue.use(Router)

export const commonRouter = [{
	path: '/404',
	meta: {slug:'first'},
	component: () => import('@/components/errorPage/404'),
},{
	path: '/login',
    meta: {slug:'first'},
    component: () => import('@/components/mould/Login')
}]

export default new Router({
  routes: [
		{
		    path: '/',//登录后首页
		    redirect: `/admin/${process.env.INDEX_CHILD_ID}`,
		}, {
      path: '/login',//登录页面
      meta: {slug: 'first'},
      component: () => import('@/components/mould/Login'),
    },{
      path: '/404',//404
      meta: {slug:'first'},
      component:() => import('@/components/errorPage/404'),
    },{
      path: '/500',//500
      meta: {slug:'first'},
      component:() => import('@/components/errorPage/500'),
    }
	]
})

