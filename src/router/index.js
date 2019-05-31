import Vue from 'vue';
import Router from 'vue-router';
import store from './../store'
import iView from 'iview';
import $cookies from 'vue-cookies'
import routes from './routes'

Vue.use(Router)
Vue.use(iView)

routes.forEach(route => {
    route.path = route.path || '/' + (route.name || '');
});

const router = new Router({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    store.commit('updateReferer', {referer: from})
    /*
    store.commit('updateToRouter', { toRouter: to })
    store.commit('updateLoadingStatus', {isLoading: true})
    if (to.name === 'index' || to.name === 'goods' || to.name === 'cart' || to.name === 'user') {
      store.commit('updateTabbarStatus', { isShowTabbar: true })
    } else {
      store.commit('updateTabbarStatus', { isShowTabbar: false })
    }
    //更新tabbar的选择状态
    if (tabbarItem.indexOf(to.name)!=-1){
      active=tabbarItem.findIndex((value) => {
        return value ==to.name
      })
      //store.dispatch('updateTabbarItemActive')
      store.commit('updateTabbarItemActive',active)
    }*/
    let token = $cookies.get('AUTH_TOKEN')

    if (to.matched.some(record => record.meta.auth)) {
        if (!token) {
            next({
                path: '/login?referer=' + to.fullPath
            })
        } else {
            next()
        }
    } else {
        next()
    }
})
router.afterEach((to) => {
    iView.LoadingBar.finish()
    //console.log(to)
    // NProgress.done();
})
export {
    router
};
