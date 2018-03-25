<template>
    <div style="padding-top: 5px;">
        <div class="weui-panel" v-for="(history, time) in historyGroups">
            <div class="weui-panel__hd">{{history[0].author}} @ {{history[0].time}}</div>
            <div class="weui-panel__bd">
                <div class="weui-media-box weui-media-box_text">
                    <p class="weui-media-box__desc">{{getComment(history)}}</p>
                    <ul class="weui-media-box__info" v-for="item in getHistoryChanges(history)">
                        <li class="weui-media-box__info__meta">{{getFieldLabel(item.field)}}:</li>
                        <li class="weui-media-box__info__meta">{{item.oldvalue? item.oldvalue: '(empty)'}}</li>
                        <li class="weui-media-box__info__meta">{{'>'}}</li>
                        <li class="weui-media-box__info__meta">{{item.newvalue? item.newvalue: '(empty)'}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tm-ticket-history",
        props: ['ticket', 'trac'],
        computed: {
            historyGroups: function () {
                if (this.ticket.history !== null) {
                    return this.groupBy(this.ticket.history, 'time');
                }
                else return [];
            }
        },
        methods: {
            groupBy: function(xs, key) {
                return xs.reduce(function(rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            },
            getComment: function (history) {
                return history.find(i => i.field === 'comment').newvalue;
            },
            getHistoryChanges: function (history) {
                return history.filter(i => i.field !== 'comment');
            },
            getFieldLabel: function (field) {
                return this.trac.fields.find(i => i.name == field).label;
            }
        }
    }
</script>

<style scoped>
    .weui-media-box__info {
        margin-top: 5px;
    }

    .weui-media-box__desc {
        color: black;
    }

    .weui-media-box__info {
        color: #666;
    }
</style>