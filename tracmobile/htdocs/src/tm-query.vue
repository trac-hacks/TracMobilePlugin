<template>
    <div>
        <tm-header text="Custom Query"></tm-header>
        <tm-slideout @confirm="filterConfirm" @cancel="filterCancel">
            <div slot="tm-slideout-menu">
                <div class="weui-cells__title">Sort</div>
                <div class="weui-cells">
                    <div class="weui-cell weui-cell_select weui-cell_select-after">
                        <div class="weui-cell__hd"><label class="weui-label">Sort By</label></div>
                        <div class="weui-cell__bd">
                            <select class="weui-select" v-model="order" >
                                <option value="id">ID</option>
                                <option v-for="op in trac.fields" :value="op.name">{{op.label}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="weui-cell weui-cell_switch">
                        <div class="weui-cell__bd"><label class="weui-label">Reverse</label></div>
                        <div class="weui-cell__ft"><input class="weui-switch" type="checkbox" v-model="desc" /></div>
                    </div>
                </div>
                <div class="weui-cells__title">Filter</div>
                <div class="weui-cells">
                    <template v-for="field in getNontextareaFields()">
                        <tm-ticket-attribute :field="field" :trac="trac" :ticket="filterTicketTemp"
                                             :protect="false"></tm-ticket-attribute>
                    </template>
                </div>
            </div>
            <div id="query-panel">
                <div class="query-filter">
                    <div class="weui-flex">
                        <div class="weui-flex__item">
                            <div v-if="Object.keys(filterTicket.attributes).length == 0" class="query-filter-something">
                                <span>Ready to filter...</span>
                            </div>
                            <div v-for="(item, key) in filterTicket.attributes"
                                 class="float-left query-box query-box-bordered" @click="removeFilter" :for="key">
                                {{key}} = {{item}}
                            </div>
                        </div>
                        <div class="query-box query-box-bordered tm-slideout-button">
                            <i class="weui-icon-search"></i>Filter
                        </div>
                    </div>
                </div>
                <div>
                    <div class="weui-loadmore" v-if="busy">
                        <i class="weui-loading"></i>
                        <span class="weui-loadmore__tips">Loading</span>
                    </div>
                    <div v-else-if="error">
                        ERROR: {{error}}
                    </div>
                    <div v-else>
                        <tm-tickets :trac="trac" :jayson="jayson" :ticket-ids="ticketIds"></tm-tickets>
                    </div>
                </div>
            </div>
        </tm-slideout>
    </div>
</template>

<script>
    import TmHeader from "./tm-header";
    import TmSlideout from './tm-slideout';
    import Ticket from "./ticket";
    import TmTicketAttribute from "./tm-ticket-attribute";
    import TmTickets from "./tm-tickets";
    import querystring from "querystring";

    export default {
        components: {
            TmTickets,
            TmHeader, TmSlideout, TmTicketAttribute},
        name: "tm-query",
        props: ['trac', 'jayson'],
        data: function () {
            return {
                filterTicket: new Ticket(),
                filterTicketTemp: new Ticket(),
                order: 'id',
                desc: true,
                ticketIds: [],
                busy: false,
                error: null,
            };
        },
        created: function () {
            var obj = this.$route.query;
            delete obj.order;
            delete obj.desc;
            delete obj.max;
            this.filterTicket.attributes = this.filterTicketTemp.attributes = obj;
            this.load();
        },
        methods: {
            getNontextareaFields() {
                return this.trac.fields.filter(function (i) {
                    return i.type !== 'textarea';
                });
            },
            getFieldLabel: function (field) {
                return this.trac.fields.find(i => i.name == field).label;
            },
            getQueryStr: function () {
                var queryObj = {order: this.order, desc: this.desc, max: 0};
                Object.assign(queryObj, this.filterTicket.attributes);
                var queryStr = querystring.stringify(queryObj);
                return queryStr;
            },
            load: function () {
                this.ticketIds = [];
                this.busy = true;
                var queryStr = this.getQueryStr();
                this.$router.replace("?" + queryStr);
                this.jayson.request('ticket.query', [queryStr], (err, response) => {
                    this.busy = false;
                    if (err)  this.error = err;
                    else if (response.error) this.error = response.error;
                    else this.ticketIds = response.result;
                });
            },
            filterConfirm: function () {
                this.filterTicket.attributes = {};
                Object.assign(this.filterTicket.attributes, this.filterTicketTemp.attributes);
                this.load();
            },
            filterCancel: function () {
                this.filterTicketTemp.attributes = {};
                Object.assign(this.filterTicketTemp.attributes, this.filterTicket.attributes);
            },
            removeFilter: function (event) {
                this.$delete(this.filterTicket.attributes, event.target.getAttribute('for'));
                this.$delete(this.filterTicketTemp.attributes, event.target.getAttribute('for'));
                this.load();
            }
        }
    }
</script>

<style scoped>
    .query-filter-something {
        color: darkgray;
        margin: auto 8px;
        font-size: 14px;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
    }

    .query-box {
        margin: 4px;
        padding: 0 8px;
        background-color: #ebebeb;
        height: 2.3em;
        line-height: 2.3em;
        text-align: center;
        color: #333;
        border-radius: 4px;
        font-size: 14px;
    }

    .query-box-bordered {
        border: solid 1px #d9d9d9;
    }

    .float-left {
        float: left;
    }

    .weui-cells {
        background-color: transparent;
    }

</style>