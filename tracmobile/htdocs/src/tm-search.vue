<template>
    <div>
        <tm-header text="Search"></tm-header>
        <tm-slideout @confirm="filterConfirm" @cancel="filterCancel">
            <div slot="tm-slideout-menu">
                <div class="weui-cells__title">Filter</div>
                <div class="weui-cells">
                    <div class="weui-cell weui-cell_switch" v-for="(item, index) in filter" :key="index">
                        <div class="weui-cell__bd"><label class="weui-label">{{index}}</label></div>
                        <div class="weui-cell__ft"><input class="weui-switch" type="checkbox" v-model="filter[index]" /></div>
                    </div>
                </div>
            </div>
            <div id="query-panel">
                <div class="weui-search-bar" id="search_bar">
                    <form class="weui-search-bar__form">
                        <div class="weui-search-bar__box">
                            <i class="weui-icon-search"></i>
                            <input type="search" class="weui-search-bar__input" id="search_input" placeholder=""
                                   @change="load" v-model="search" />
                            <a href="javascript:" class="weui-icon-clear" id="search_clear"></a>
                        </div>
                        <label for="search_input" class="weui-search-bar__label" id="search_text">
                            <i class="weui-icon-search"></i>
                            <span>{{search? search: 'Search..'}}</span>
                        </label>
                    </form>
                    <a href="javascript:" class="weui-search-bar__cancel-btn" id="search_cancel">Clear</a>
                </div>
                <div class="query-filter">
                    <div class="weui-flex">
                        <div class="weui-flex__item">
                            <div v-if="Object.keys(filter).length == 0" class="query-filter-something">
                                <span>Ready to filter...</span>
                            </div>
                            <div v-for="(item, key) in filter"
                                 class="float-left query-box query-box-bordered" @click="removeFilter" :for="key" v-if="item">
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
                        <div class="weui-panel">
                            <div class="weui-panel__bd">
                                <div class="weui-media-box weui-media-box_appmsg" v-for="item in results">
                                    <router-link class="weui-cell_access" :to="item.href">
                                        <h4 class="weui-media-box__title" v-html="item.title"></h4>
                                        <ul class="weui-media-box__info">
                                            <li class="weui-media-box__info__meta">{{item.date}}</li>
                                            <li class="weui-media-box__info__meta">{{item.author}}</li>
                                        </ul>
                                    </router-link>
                                </div>
                            </div>
                        </div>
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
        name: "tm-search",
        props: ['trac', 'jayson'],
        data: function () {
            return {
                filter: {},
                results: [],
                search: '',
                busy: false,
                error: null,
            };
        },
        created: function () {
            this.search = this.$route.query.q;
            this.busy = true;
            this.jayson.request('search.getSearchFilters', [], (err, response) => {
                this.busy = false;
                if (err)  this.error = err;
                else if (response.error) this.error = response.error;
                else {
                    response.result.forEach((i) => {
                        this.filter[i[0]] = true;
                    });

                    if (this.search) this.load();
                }
            });
        },
        mounted: function () {
            weui.searchBar('#search_bar');
        },
        watch: {
            search: function () {
                this.$router.push({query: {q: this.search}});
            }
        },
        methods: {
            filterConfirm: function () {
                this.load();
            },
            filterCancel: function () {
                //this.load();
            },
            removeFilter: function (event) {
                this.filter[event.target.getAttribute('for')] = false;
                this.load();
            },
            load: function () {
                this.busy = true;

                var filterArray = Object.keys(this.filter).filter(i => this.filter[i] === true);
                this.jayson.request('search.performSearch', [this.search, filterArray], (err, response) =>
                    {
                        this.busy = false;
                        if (err)  this.error = err;
                        else if (response.error) this.error = response.error;
                        else {
                            this.results = response.result.map(i => {
                                return {
                                    href: this.getUrl(i[0]),
                                    title: i[1],
                                    date: this.parseTime(i[2]),
                                    author: i[3]
                                };
                            });
                        }
                    }
                );
            },
            parseTime: function (obj) {
                if (obj && obj.__jsonclass__ && obj.__jsonclass__[1])
                    return obj.__jsonclass__[1].replace('T', ' ');
                else
                    return null;
            },
            getUrl: function (url) {
                return url.replace(this.trac.abs_href + "/", "");
            }
        }
    }
</script>

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