import Vue from 'vue';
import VueRouter from 'vue-router';
import vueStore from './vuex/store.js';
import routes from './routes.js';
import App from './App.vue';
import './assets/js/interceptors'
import directives from './assets/js/directives'
import * as filters from './assets/js/filters'
import { LoadingPlugin, ToastPlugin, ConfirmPlugin, AlertPlugin,DatetimePlugin } from 'vux'
import VueScroller from 'vue-scroller'

Vue.use(directives)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(DatetimePlugin)
Vue.use(VueRouter);
Vue.use(VueScroller);

//注册全局过滤器
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

//事件通信
window.Bus = new Vue()

global.router = new VueRouter({
    routes,
    linkActiveClass: 'active',
})

router.beforeEach((to, from, next) => {
    let type = to.meta.type;
    let title = to.meta.title;

    //设置title
    document.title = title

    //尾部
    vueStore.commit('showFooter', false);

    if (type == 'home' || type == 'my' ) {
        vueStore.commit('showFooter', true);
    }

    //埋点来源页面和当前页面
    if(to.meta.page) setLocalStorage('statNowPage',to.meta.page);
    if(from.meta.page) setLocalStorage('statSourcePage',from.meta.page);

    //静默登录
    if(getQueryString("mobile") && (to.redirectedFrom === "/" || to.path.indexOf("/login")  !== -1)) {
        next({
            path: `/prodIntrod/${getLocalStorage('channelVal')}`
        })
        return
    }
    next()
})

const app = new Vue({
    router: router,
    render: h => h(App)
}).$mount("#app")
