<template>
    <div>
        <tm-header text="Timeline"></tm-header>
        <tm-slideout @confirm="filterConfirm" @cancel="filterCancel">
            <div slot="tm-slideout-menu">
                <div class="weui-cells__title">Event Type Filter:</div>
                <div class="weui-cells">
                    <div class="weui-cell weui-cell_switch" v-for="(item, index) in filter" :key="index">
                        <div class="weui-cell__bd"><label class="weui-label">{{index}}</label></div>
                        <div class="weui-cell__ft"><input class="weui-switch" type="checkbox" v-model="filter[index]" /></div>
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
                    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                        <div class="weui-panel" v-for="dayEvents in events">
                            <div class="weui-panel__hd">{{dayEvents[0].dateStr}}</div>
                            <div class="weui-panel__bd">
                                <div class="weui-media-box weui-media-box_appmsg" v-for="event in dayEvents">
                                    <router-link class="weui-cell_access" :to="event.url">
                                        <h4 class="weui-media-box__title"> <div v-html="event.title"></div> </h4>
                                        <p class="weui-media-box__desc"> <span v-html="event.description"></span> </p>
                                        <ul class="weui-media-box__info">
                                            <li class="weui-media-box__info__meta">{{event.timeStr}}</li>
                                            <li class="weui-media-box__info__meta">{{event.author}}</li>
                                        </ul>
                                    </router-link>
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
                </div>
            </div>
        </tm-slideout>
    </div>
</template>
<script>
    import TmHeader from "./tm-header";
    import TmSlideout from './tm-slideout';

    export default {
        components: {TmHeader, TmSlideout},
        name: "tm-timeline",
        props: ['trac', 'jayson'],
        data: function () {
            return {
                filter: {
                    ticket: true,
                    wiki: true,
                    changeset: true,
                    milestone: true,
                },
                events: [],
                busy: false,
                error: null,
                currentDate: Date.now(),
            };
        },
        created: function () {
            this.loadMore();
        },
        computed: {
        },
        methods: {
            groupBy: function(xs, key) {
                return xs.reduce(function(rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            },
            loadMore: function () {
                this.busy = true;
                var filterArray = Object.keys(this.filter).filter(i => this.filter[i] === true);
                var date = this.currentDate;
                var daysPerRequest = 2;
                this.jayson.request('tracmobile.getTimelineEvents', [date*1000-1000*1000*60*60*24*daysPerRequest, date*1000, filterArray], (err, response) => {
                    this.busy = false;
                    if (err)  this.error = err;
                    else if (response.error) this.error = response.error;
                    else {
                        if (response.result === []) {
                            this.events.push({
                                'title': 'No events in last 7 days.',
                                'dateStr': date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
                            })
                        } else {
                            response.result.forEach(i => {
                                this.processDate(i);
                            });
                            var dict = this.groupBy(response.result, 'dateStr');
                            Object.keys(dict).sort().reverse().forEach(i => this.events.push(dict[i]));
                        }

                        this.currentDate -= 1000*60*60*24*daysPerRequest;
                    }
                });
            },
            processDate: function (event) {
                var d = new Date(event.date);
                event.dateStr = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
                event.timeStr = d.getHours() + ':' + d.getMinutes();
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