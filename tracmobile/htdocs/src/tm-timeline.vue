<template>
    <div>
        <tm-header text="Timeline"></tm-header>
        <tm-slideout @confirm="filterConfirm" @cancel="filterCancel">
            <div slot="tm-slideout-menu">
                <div class="weui-cells__title">Event Type Filter:</div>
                <div class="weui-cells">
                    <div class="weui-cell weui-cell_switch">
                        <div class="weui-cell__bd"><label class="weui-label">Ticket</label></div>
                        <div class="weui-cell__ft"><input class="weui-switch" type="checkbox" v-model="filterTicket.ticket" /></div>
                    </div>
                    <div class="weui-cell weui-cell_switch">
                        <div class="weui-cell__bd"><label class="weui-label">Wiki</label></div>
                        <div class="weui-cell__ft"><input class="weui-switch" type="checkbox" v-model="filterTicket.wiki" /></div>
                    </div>
                </div>
            </div>
            <div id="query-panel">
                <div class="query-filter">
                    <div class="weui-flex">
                        <div class="weui-flex__item">
                            <div v-for="(item, key) in filter" v-if="item"
                                 class="float-left query-box query-box-bordered" @click="removeFilter" :for="key">
                                {{key}}
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
                        
                    </div>
                </div>
            </div>
        </tm-slideout>
    </div>
</template>
<script>
    import TmHeader from "./tm-header";
    import TmSlideout from './tm-slideout';
    import querystring from "querystring";

    export default {
        components: {TmHeader, TmSlideout},
        name: "tm-timeline",
        props: ['trac', 'jayson'],
        data: function () {
            return {
                filter: {
                    ticket: true,
                    wiki: true,
                },
                busy: false,
                error: null,
            };
        },
        created: function () {
            this.load();
        },
        methods: {
            load: function () {
                this.ticketIds = [];
                this.busy = true;
                var queryObj = {order: this.order, desc: this.desc, max: 0};
                Object.assign(queryObj, this.filterTicket.attributes);
                var queryStr = querystring.stringify(queryObj);
                this.jayson.request('ticket.query', [queryStr], (err, response) => {
                    this.busy = false;
                    if (err)  this.error = err;
                    else if (response.error) this.error = response.error;
                    else this.ticketIds = response.result;
                });
            },
            filterConfirm: function () {
                this.load();
            },
            filterCancel: function () {
                this.load();
            },
            removeFilter: function (event) {
                this.filter[event.target.getAttribute('for')] = false;
                this.load();
            }
        }
    }</script>
<style scoped>

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