import { createRouter, createWebHistory } from 'vue-router'
import login from "../components/user/Login.vue"
import admin from "../components/admin/Admin.vue"
import adminMenu from "../components/admin/AdminMenu.vue"
import main from "../components/Main.vue"
import recommendsongs from "../views/RecommendSongs.vue"
import recommendusers from "../views/RecommendUsers.vue"
import discover from "../views/Discover.vue"
import hotmusic from "../views/HotMusic.vue"
import searchMusic from "../views/SearchMusic.vue"
import loveSong from "../views/love-song.vue"
import userRecord from "../views/user-record.vue"
import store from "../store/index.js"


const routes = [
  //登陆
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  //后台管理
  {
    path: '/admin',
    name: 'admin',
    component: admin,
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  //后台管理
  {
    path: '/adminMenu',
    name: 'adminMenu',
    component: adminMenu,
  },
  //主界面
  {
    path: '/',
    name: 'main',
    component: main,
    //重定向
    redirect: "/discover",
    meta: {
      //进入该界面要求先登陆
      requireLogin: true,
    },
    //子路由
    children: [
      //推荐歌曲页面
      {
        path: "recommendsongs",
        name: "recommendsongs",
        component: recommendsongs,
				meta: {
					requireLogin: true,
				},
      },
      //相似用户页面
      {
        path: "recommendusers",
        name: "recommendusers",
        component: recommendusers,
				meta: {
					requireLogin: true,
				},
      },
      //歌曲库界面
      {
        path: "discover",
        name: "discover",
        component: discover,
				meta: {
					requireLogin: true,
				},
      },
      //热门歌曲界面
      {
        path: "hotmusic",
        name: "hotmusic",
        component: hotmusic,
				meta: {
					requireLogin: true,
				},
      },
      //搜索界面
      {
        path: "searchMusic",
        name: "searchMusic",
        component: searchMusic,
      },
      //收藏界面
      {
        path: "loveSong",
        name: "loveSong",
        component: loveSong,
      },
      //用户记录界面
      {
        path: "userRecord",
        name: "userRecord",
        component: userRecord,
      },
    ]
  },
]

const router = createRouter({
  //提供要使用的历史实现。为了简单起见，这里我们使用哈希历史记录
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(),
  routes,
})

//登陆验证
//每一条路由跳转之前都要进行验证
//监听路由改变前
router.beforeEach((to, from, next) => {
  //to即将进入的目标路由对象，from当前导航正要离开的路由
  //next  :  下一步执行的函数钩子
  //判断是否需要登录
  if(to.meta.requireLogin) {
    //如果由token说明已经登陆，则跳转到首页
    console.log("路由跳转验证")
    console.log(store.state)  //打印存储起来的状态
    //如果用户已经登陆 或者 即将进入登录路由，则直接放行
    if(store.state.user || to.path === '/login'){
      next()
    }else{
      //如果没有登陆，则所有页面都需要跳转到登陆界面
      //登录后重定向到要进入的目标路由对象
      next(`/login?redirect=${to.path}`)
    }
  }else{
    next()
  }
})

export default router
