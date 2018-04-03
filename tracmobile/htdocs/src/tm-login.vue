<template>
    <div class="page">
        <div class="page__hd">
            <h1 class="page__title index__title">Trac</h1>
            <p class="page__desc index__subtitle">login to {{trac.abs_href}}</p>
        </div>
        <div class="page__bd">
            <div class="weui-cells">
                <div class="weui-cell">
                    <div class="weui-cell__hd">
                        <label class="weui-label">Username</label>
                    </div>
                    <div class="weui-cell__bd">
                        <input class="weui-input" v-model="username" type="text" />
                    </div>
                </div>
                <div class="weui-cell">
                    <div class="weui-cell__hd">
                        <label class="weui-label">Password</label>
                    </div>
                    <div class="weui-cell__bd">
                        <input class="weui-input" v-model="password" type="password" />
                    </div>
                </div>
            </div>
            <div class="weui-btn-area">
                <div v-if="error">{{error}}</div>
                <input class="weui-btn weui-btn_primary" type="button" value="Login" @click="login" />
            </div>
        </div>
    </div>
</template>

<script>
    import Jayson from '../jayson';

    export default {
        name: "tm-login",
        props: ['trac', 'jayson'],
        data: function () {
            return {
                username: "",
                password: "",
                error: null,
            };
        },
        methods: {
            login: function () {
                var loading = weui.loading('login...');
                var absHref = this.trac.abs_href;
                var url = absHref.replace(/^https?:\/\//, a => a + this.username + ':' + this.password + '@') + '/login/rpc';
                var newJayson = new Jayson.client.http(url);
                newJayson.request('system.getAPIVersion', [], (err, response) =>
                {
                    loading.hide();

                    if (err)  weui.toast(err, 2000);
                    else if (response.error) weui.toast(response.error, 2000);
                    else {
                        this.$router.app.$emit('login', newJayson, this.username);
                        weui.toast('Logined successfully!', 2000);
                        setTimeout(()=>this.$router.push('/my'), 500);
                    }
                });
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