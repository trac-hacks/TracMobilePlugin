import Vue from 'vue';
import VueRouter from 'vue-router';
import VueInfiniteScroll from 'vue-infinite-scroll';
import VueCookie from 'vue-cookie';
import Jayson from '../jayson'

import TmIndex from './tm-index';
import TmReports from './tm-reports';
import TmReport from './tm-report';
import TmTicket from './tm-ticket';
import TmQuery from './tm-query';
import TmWiki from './tm-wiki';
import TmWikis from './tm-wikis';
import TmTimeline from './tm-timeline';
import TmNewTicket from './tm-newticket';
import TmSearch from './tm-search';
import TmLogin from './tm-login';
import TmMy from './tm-my';

Vue.use(VueRouter);
Vue.use(VueInfiniteScroll);
Vue.use(VueCookie);

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
    }, {
        path: '/timeline',
        name: 'timeline',
        component: TmTimeline,
        props: true
    }, {
        path: '/newticket',
        name: 'newticket',
        component: TmNewTicket,
        props: true
    }, {
        path: '/search',
        name: 'search',
        component: TmSearch,
        props: true
    }, {
        path: '/login',
        name: 'login',
        component: TmLogin,
        props: true
    }, {
        path: '/my',
        name: 'my',
        component: TmMy,
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
    created: function () {
        var sessionUrl = this.$cookie.get('tracmobile-session');
        var user = this.$cookie.get('tracmobile-user');
        if (sessionUrl && user) {
            this.jayson = new Jayson.client.http(sessionUrl);
            this.trac.user = user;
            this.trac.isLogin = true;
        }
    },
    watch: {
        '$route' (to, from) {
            const toDepth = to.path.split('/').length
            const fromDepth = from.path.split('/').length
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
    }
});

app.$on('login', function(newJayson, user) {
    console.log('user login: ' + user);
    this.trac.isLogin = true;
    this.trac.user = user;
    this.$cookie.set('tracmobile-session', newJayson.options.href, '1h');
    this.$cookie.set('tracmobile-user', user, '1h');
    this.jayson = newJayson;
});

app.$mount("#app");
