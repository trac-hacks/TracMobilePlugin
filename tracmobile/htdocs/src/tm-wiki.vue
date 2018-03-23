<template>
    <div>
        <tm-header :text="wikiId" v-if="!local"></tm-header>`
        <div class="weui-loadmore" v-if="busy">
            <i class="weui-loading"></i>
            <span class="weui-loadmore__tips">Loading</span>
        </div>
        <div v-else-if="error">
            ERROR: {{error}}
        </div>
        <div v-else>
            <div class="weui-article wiki-wrapper">
                <div v-html="page"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import TmHeader from "./tm-header";

    export default {
        components: {TmHeader},
        name: "tm-wiki",
        props: {'trac': Object, 'jayson': Object, 'wikiId': String, 'local': {type: Boolean, default: () => false}},
        data: function() {
            return {
                page: null,
                busy: true,
                error: null,
                ready: false,
            };
        },
        created: function () {
            this.load();
        },
        watch: {
            wikiId: function(val) {
                this.load();
            }
        },
        methods: {
            load: function() {
                this.busy = true;
                this.jayson.request('wiki.getPageHTML', [this.wikiId], (err, response) => {
                    this.busy = false;
                    if (err)  this.error = err;
                    else if (response.error) this.error = response.error;
                    else {
                        this.page = this.showPage(response.result);
                    }
                });
            },
            showPage: function (page) {
                var div = $('<div>');
                div.html(page);
                var abs_href = this.trac.abs_href;
                div.find('a').each(function () {
                    var href = $(this).attr('href');
                    if (href) {
                        if (href.startsWith(abs_href)) href = href.replace(abs_href, '');
                        if (href.startsWith('/wiki/') || href.startsWith('/ticket/' || href.startsWith('/report/'))) {
                            $(this).attr('href', '#' + href);
                        }
                    }
                });
                return div.html();
            }
        }
    }
</script>

<style scoped>
    .wiki-wrapper {
        padding: 25px;
    }

</style>