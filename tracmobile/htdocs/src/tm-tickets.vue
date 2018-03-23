<template>
    <div>
        <div class="weui-panel">
            <div class="weui-panel__bd">
                <div class="weui-panel" v-infinite-scroll="loadMore" infinite-scroll-disabled="noMore" infinite-scroll-distance="10">
                    <div class="weui-panel__bd">
                        <tm-ticket-list-item :ticket="ticket" v-for="ticket in tickets" :key="ticket.id"></tm-ticket-list-item>
                    </div>
                </div>
            </div>
        </div>
        <div class="weui-loadmore" v-if="busy">
            <i class="weui-loading"></i>
            <span class="weui-loadmore__tips">Loading</span>
        </div>
        <div v-else-if="error">
            ERROR: {{error}}
        </div>
        <div class="weui-footer" style="margin-top: 10px;">
            <p class="weui-footer__text">Total {{ticketIds.length}} objects</p>
        </div>
    </div>
</template>

<script>
    import TmTicketListItem from "./tm-tickets-item";
    import Ticket from "./ticket";

    export default {
        components: {TmTicketListItem},
        name: "tm-tickets",
        props: ['ticketIds', 'jayson', 'trac'],
        data: function() {
            return {
                tickets: [],
                busy: false,
                error: null,
            };
        },
        computed: {
            noMore: function () {
                return this.tickets.length == this.ticketIds.length;
            },
        },
        methods: {
            loadMore: function () {
                this.busy = true;

                this.jayson.request('tracmobile.getTickets',
                    [this.ticketIds.slice(this.tickets.length, this.tickets.length + 10)], (err, response) =>
                    {
                        this.busy = false;
                        if (err)  this.error = err;
                        else if (response.error) this.error = response.error;
                        else {
                            response.result.forEach(i =>
                            {
                                var ticket = new Ticket(i);
                                this.tickets.push(ticket);
                            });
                        }
                    }
                );
            },
        }
    }
</script>

<style scoped>

</style>