<template>
    <div class="page">
        <div class="page__hd">
            <h1 class="page__title index__title">Trac</h1>
            <p class="page__desc index__subtitle">Welcome,  {{trac.user}}</p>
        </div>
        <div class="page__bd">
            <div class="weui-panel">
                <div class="weui-panel__hd">
                    Dashboard
                </div>
                <div class="weui-panel__bd">
                    <div class="weui-media-box weui-media-box_small-appmsg">
                        <div class="weui-cells">
                            <router-link class="weui-cell weui-cell_access" :to="'/query?status!=closed&owner=' + trac.user">
                                <div class="weui-cell__bd weui-cell_primary">
                                    <p>My active tickets</p>
                                </div>
                                <span class="weui-cell__ft"></span>
                            </router-link>
                            <router-link class="weui-cell weui-cell_access" :to="'/query?owner=' + trac.user">
                                <div class="weui-cell__bd weui-cell_primary">
                                    <p>My tickets</p>
                                </div>
                                <span class="weui-cell__ft"></span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="weui-panel">
                <div class="weui-panel__hd">
                    Account
                </div>
                <div class="weui-panel__bd">
                    <div class="weui-media-box weui-media-box_small-appmsg">
                        <div class="weui-cell weui-cell_access" @click="logout">
                            <div class="weui-cell__bd weui-cell_primary">
                                <p>Logout</p>
                            </div>
                            <span class="weui-cell__ft"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tm-my",
        props: ['trac', 'jayson'],
        created: function () {
            if (!this.trac.isLogin) {
                this.$router.push('/login');
            }
        },
        methods: {
            logout: function () {
                this.$router.app.$emit('logout');
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>
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