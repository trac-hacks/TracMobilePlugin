<template>
    <div>
        <tm-header :text="reportInfo? reportInfo.title: '...'"></tm-header>
        <div class="weui-loadmore" v-if="busy">
            <i class="weui-loading"></i>
            <span class="weui-loadmore__tips">Loading</span>
        </div>
        <div v-else-if="error">
            ERROR: {{error}}
        </div>
        <div v-else>
            <tm-tickets :ticketIds="tickets" :jayson="jayson" :trac="trac"></tm-tickets>
        </div>
    </div>
</template>

<script>
    import TmHeader from "./tm-header";
    import TmTickets from "./tm-tickets";

    export default {
        components: {
            TmTickets,
            TmHeader},
        name: "tm-report",
        props: ['trac', 'jayson', 'reportId', 'report'],
        data: function() {
            return {
                tickets: [],
                busy: true,
                error: null,
                reportInfo: this.report,
            };
        },
        created: function () {
            this.load();
        },
        methods: {
            load: function() {
                this.jayson.request('tracmobile.getReport', [this.reportId], (err, response) => {
                    this.busy = false;
                    if (err)  this.error = err;
                    else if (response.error) this.error = response.error;
                    else {
                        this.tickets = response.result.tickets;
                        this.reportInfo = response.result.report;
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>