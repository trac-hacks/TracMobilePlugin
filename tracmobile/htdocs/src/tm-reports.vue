<template>
    <div>
        <tm-header text="Available Reports"></tm-header>
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
                    <router-link v-for="report in reports"
                                 :to="{name: 'report', params: {reportId: report.id, report: report}}">
                        <div class="weui-media-box weui-media-box_text">
                            <h4 class="weui-media-box__title">{{report.id}}. {{report.title}}</h4>
                            <p class="weui-media-box__desc">{{report.description}}</p>
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
        name: "tm-reports",
        props: ['trac', 'jayson'],
        data: function() {
            return {
                reports: [],
                busy: true,
                error: null,
            };
        },
        created: function () {
            this.load();
        },
        methods: {
            load: function() {
                this.jayson.request('tracmobile.getReports', null, (err, response) => {
                    this.busy = false;
                    if (err)  this.error = err;
                    else if (response.error) this.error = response.error;
                    else this.reports = response.result;
                });
            }
        }
    }
</script>

<style scoped>
    a { color: inherit; }
</style>