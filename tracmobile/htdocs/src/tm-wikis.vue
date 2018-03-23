<template>
    <div>
        <tm-header text="All Pages"></tm-header>
        <div class="weui-loadmore" v-if="busy">
            <i class="weui-loading"></i>
            <span class="weui-loadmore__tips">Loading</span>
        </div>
        <div v-else-if="error">
            ERROR: {{error}}
        </div>
        <div v-else>
            <div class="weui-panel">
                <div class="weui-panel__bd">
                    <router-link v-for="page in pages"
                                 :to="{name: 'wiki', params: {wikiId: page}}">
                        <div class="weui-media-box weui-media-box_text">
                            <h4 class="weui-media-box__title">{{page}}</h4>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TmHeader from "./tm-header";

    export default {
        components: {TmHeader},
        name: "tm-wikis",
        props: ['trac', 'jayson'],
        data: function() {
            return {
                pages: [],
                busy: true,
                error: null,
            };
        },
        created: function () {
            this.load();
        },
        methods: {
            load: function() {
                this.jayson.request('wiki.getAllPages', null, (err, response) => {
                    this.busy = false;
                    if (err)  this.error = err;
                    else if (response.error) this.error = response.error;
                    else this.pages = response.result;
                });
            }
        }
    }
</script>

<style scoped>
    a { color: inherit; }
</style>