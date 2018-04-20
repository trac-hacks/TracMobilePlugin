<template>
    <div>
        <tm-header text="Milestones"></tm-header>
        <div class="weui-loadmore" v-if="busy">
            <i class="weui-loading"></i>
            <span class="weui-loadmore__tips">Loading</span>
        </div>
        <div v-else-if="error">
            ERROR: {{error}}
        </div>
        <div v-else>
            <div class="weui-panel" v-for="milestone in milestones">
                <div class="weui-panel__hd">{{milestone.completed? 'Completed': 'Not Completed'}}</div>
                <div class="weui-panel__bd">
                    <router-link :to="{name: 'query', query: {'milestone': milestone.name}}">
                        <div class="weui-media-box weui-media-box_text">
                            <h4 class="weui-media-box__title">{{milestone.name}}</h4>
                            <div class="weui-loadmore" v-if="milestone.busy">
                                <i class="weui-loading"></i>
                                <span class="weui-loadmore__tips">Loading</span>
                            </div>
                            <div v-else>
                                <p class="weui-media-box__desc">{{milestone.description}}</p>
                                <p class="weui-media-box__info" v-if="milestone.due != 0">Due: {{milestone.due}}</p>
                                <p class="weui-media-box__info" v-if="milestone.completed != 0">Completed: {{milestone.due}}</p>
                            </div>
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
        name: "tm-roadmaps",
        props: ['trac', 'jayson'],
        data: function() {
            return {
                milestones: [],
                busy: true,
                error: null,
            };
        },
        created: function () {
            this.load();
        },
        methods: {
            load: function() {
                this.jayson.request('ticket.milestone.getAll', null, (err, response) => {
                    this.busy = false;
                    if (err)  this.error = err;
                    else if (response.error) this.error = response.error;
                    else {
                        this.milestones = response.result.map(i => { return {name: i, busy: true};});
                        this.milestones.forEach(i => {
                            this.jayson.request('ticket.milestone.get', [i.name], (err, response) => {
                                i.busy = false;
                                if (err)  this.error = err;
                                else if (response.error) this.error = response.error;
                                else {
                                    Object.assign(i, response.result);
                                    if (i.due != 0) i.due = this.parseTime(i.due);
                                    if (i.completed != 0) i.due = this.parseTime(i.completed);
                                }
                            });
                        });
                    }
                });
            },
            parseTime: function (obj) {
                if (obj && obj.__jsonclass__ && obj.__jsonclass__[1])
                    return obj.__jsonclass__[1].replace('T', ' ');
                else
                    return null;
            }
        }
    }
</script>

<style scoped>
    a { color: inherit; }
</style>