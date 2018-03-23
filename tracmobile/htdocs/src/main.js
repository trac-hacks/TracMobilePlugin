import Vue from 'vue';
import VueRouter from 'vue-router';
import VueInfiniteScroll from 'vue-infinite-scroll';
import Jayson from '../jayson'

import TmIndex from './tm-index';
import TmReports from './tm-reports';
import TmReport from './tm-report';
import TmTicket from './tm-ticket';
import TmQuery from './tm-query';
import TmWiki from './tm-wiki';
import TmWikis from './tm-wikis';

Vue.use(VueRouter);
Vue.use(VueInfiniteScroll);

const routes = [
    {
        path: '/',
        name: 'index',
        component: TmIndex,
        props: true
    }, {
        path: '/report/:reportId',
        name: 'report',
        component: TmReport,
        props: true
    }, {
        path: '/report',
        component: TmReports,
        props: true
    }, {
        path: '/ticket/:ticketId',
        name: 'ticket',
        component: TmTicket,
        props: true
    }, {
        path: '/query',
        name: 'query',
        component: TmQuery,
        props: true
    }, {
        path: '/wikis',
        component: TmWikis,
        props: true
    }, {
        path: '/wiki/:wikiId',
        name: 'wiki',
        component: TmWiki,
        props: true
    }
];

const router = new VueRouter({
    routes: routes
});

const data = {
    trac: window.tracdata,
    jayson: new Jayson.client.http(window.tracdata.abs_href + "/rpc"),
    transitionName: 'slide',
};

router.beforeEach((to, from, next) => {
    Object.assign(to.params, data);
    next();
});

const app = new Vue({
    router: router,
    data: data,
    watch: {
        '$route' (to, from) {
            const toDepth = to.path.split('/').length
            const fromDepth = from.path.split('/').length
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
    }
});

app.$mount("#app");
