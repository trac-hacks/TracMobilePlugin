import Vue from 'vue';
import VueRouter from 'vue-router';
import VueInfiniteScroll from 'vue-infinite-scroll';
import Jayson from '../jayson'

import TmIndex from './tm-index';
import TmReports from './tm-reports';
import TmReport from './tm-report';

Vue.use(VueRouter);
Vue.use(VueInfiniteScroll);

const routes = [
    {
        path: '/',
        name: 'index',
        component: TmIndex,
        props: true
    },
    {
        path: '/report/:reportId',
        name: 'report',
        component: TmReport,
        props: true
    },
    {
        path: '/report',
        component: TmReports,
        props: true
    }
];

const router = new VueRouter({
    routes: routes
});

const data = {
    trac: window.tracdata,
    jayson: new Jayson.client.http(window.tracdata.abs_href + "/rpc")
};

router.beforeEach((to, from, next) => {
    Object.assign(to.params, data);
    next();
});

const app = new Vue({
    router: router,
    data: data
});

app.$mount("#app");
