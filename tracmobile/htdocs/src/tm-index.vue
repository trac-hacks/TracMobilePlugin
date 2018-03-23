<template>
    <div class="page">
        <div class="page__hd">
            <h1 class="page__title index__title" id="a">TRAC</h1>
            <p class="page__desc index__subtitle">{{trac.project.name}}</p>
        </div>
        <div class="page__bd page__bd_spacing">
            <div class="weui-grids">
                <router-link class="weui-grid" to="/wikis">
                    <div class="weui-grid__icon"><img src="/chrome/tracmobile/images/contract.png" /></div>
                    <p class="weui-grid__label">Wiki</p>
                </router-link>
                <router-link class="weui-grid" to="/query">
                    <div class="weui-grid__icon"><img src="/chrome/tracmobile/images/project.png" /></div>
                    <p class="weui-grid__label">Tickets</p>
                </router-link>
                <router-link class="weui-grid" to="/timeline">
                    <div class="weui-grid__icon"><img src="/chrome/tracmobile/images/activities.png" /></div>
                    <p class="weui-grid__label">Timeline</p>
                </router-link>
                <router-link class="weui-grid" to="/roadmap">
                    <div class="weui-grid__icon"><img src="/chrome/tracmobile/images/files.png" /></div>
                    <p class="weui-grid__label">Roadmap</p>
                </router-link>
                <router-link class="weui-grid" to="/source">
                    <div class="weui-grid__icon"><img src="/chrome/tracmobile/images/employee.png" /></div>
                    <p class="weui-grid__label">Source</p>
                </router-link>
                <router-link class="weui-grid" to="/newticket">
                    <div class="weui-grid__icon"><img src="/chrome/tracmobile/images/schedule.png" /></div>
                    <p class="weui-grid__label">New Ticket</p>
                </router-link>
            </div>
        </div>
        <div class="page__bd">
            <tm-wiki :trac="trac" :jayson="jayson" wiki-id="WikiStart" :local="true"></tm-wiki>
        </div>
    </div>
</template>

<script>
    import TmWiki from "./tm-wiki";

    export default {
        components: {TmWiki},
        name: "tm-index",
        props: ['trac', 'jayson'],

    }
</script>

<style scoped>
    .weui-grid {
        background-color: white;
    }
    .index__title {
        margin: 30px 0 10px 0;
        font-weight: 400;
        font-size: 34px;
        color: #3cc51f;
        text-align: center;
    }
    .index__subtitle {
        margin: 0 0 30px 0;
        color: #888;
        text-align: center;
    }
</style>