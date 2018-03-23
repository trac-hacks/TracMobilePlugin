<template>
    <div>
        <div class="weui-loadmore" v-if="busy">
            <i class="weui-loading"></i>
            <span class="weui-loadmore__tips">Loading</span>
        </div>
        <div v-else-if="error">
            ERROR: {{error}}
        </div>
        <div v-else>
            <div class="page" v-if="ticket !== null">
                <tm-header :text="'#' + ticket.id + ' ' + ticket.attributes['summary']"></tm-header>
                <div class="page__bd">
                    <div class="weui-tab" id="view__tab">
                        <div class="weui-navbar">
                            <div class="weui-navbar__item" id="view__info-tab-button"
                                 @click="currentView='info'" :class='{"weui-bar__item_on": currentView==="info"}'>Info</div>
                            <div class="weui-navbar__item" id="view__relation-tab-button"
                                 @click="currentView='history'" :class='{"weui-bar__item_on": currentView==="history"}'>History</div>
                            <div class="weui-navbar__item" id="view__process-tab-button"
                                 @click="currentView='action'" :class='{"weui-bar__item_on": currentView==="action"}'>Actions</div>
                        </div>
                        <div class="weui-tab__panel">
                            <div id="view__info-tab" v-if='currentView === "info"'>
                                <div class="weui-cells__title">Attributes</div>
                                <div class="weui-cells">
                                    <template v-for="field in getNontextareaFields()">
                                        <tm-ticket-attribute :field="field" :trac="trac" :ticket="ticket"></tm-ticket-attribute>
                                    </template>
                                </div>
                                <template v-for="field in getTextareaFields()">
                                    <div class="weui-cells__title">{{field.label}}</div>
                                    <div class="weui-cells">
                                        <div class="weui-cell">
                                            <div class="weui-cell__bd">
                                                <textarea class="weui-textarea" rows="3" v-model="ticket.attributes[field.name]"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <div class="weui-cells__title">Attachments</div>
                                <div class="weui-cells">
                                    <div class="weui-cell">
                                        <div class="weui-cell__bd">
                                            <div class="weui-uploader">
                                                <div class="weui-uploader__bd">
                                                    <ul class="weui-uploader__files" id="view__attachments">
                                                        <li class="weui-uploader__file" style="background-color: #f8f8f8;" v-for="attach in ticket.attachments" :key="attach.name">
                                                            <a :href="trac.abs_href + 'raw-attachment/ticket/' + ticket.id + '/' + attach.name">
                                                                {{cutDownFileName(attach.name)}}
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <div class="weui-uploader__input-box"><input class="weui-uploader__input" id="view__attachments-input" type="file" multiple="multiple" @change="uploadFile" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="weui-cells__title">Comment</div>
                                <div class="weui-cells">
                                    <div class="weui-cell">
                                        <div class="weui-cell__bd">
                                            <textarea class="weui-textarea" rows="3" v-model="comment"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="view__button-area">
                                    <a class="weui-btn weui-btn_primary" @click="submitChange">Save</a></div>
                            </div>
                            <div id="view__history-tab" v-if='currentView === "history"'>
                                <tm-ticket-history :ticket="ticket" :trac="trac"></tm-ticket-history>
                            </div>
                            <div id="view__actions-tab" v-if='currentView === "action"'>
                                <tm-ticket-actions :ticket="ticket" :trac="trac" :jayson="jayson"></tm-ticket-actions>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Ticket from "./ticket";
    import TmTicketAttribute from "./tm-ticket-attribute";
    import TmHeader from "./tm-header";
    import TmTicketHistory from "./tm-ticket-history";
    import TmTicketActions from "./tm-ticket-actions";

    export default {
        components: {
            TmTicketActions,
            TmTicketHistory,
            TmHeader,
            TmTicketAttribute},
        name: "tm-ticket",
        props: ['ticketId', 'jayson', 'trac'],
        data: function() {
            return {
                busy: false,
                error: null,
                ticket: null,
                currentView: 'info',
                comment: ''
            };
        },
        computed: {
        },
        created: function () {
            this.load();
        },
        methods: {
            load: function () {
                this.busy = true;

                this.jayson.request('ticket.get', [this.ticketId], (err, response) =>
                    {
                        this.busy = false;
                        if (err)  this.error = err;
                        else if (response.error) this.error = response.error;
                        else {
                            this.ticket = new Ticket(response.result);
                            this.ticket.getAttachments(this.jayson);
                            this.ticket.getActions(this.jayson);
                            this.ticket.getHistory(this.jayson);
                        }
                    }
                );
            },
            cutDownFileName: function (filename) {
                if (filename.length < 12) return filename;

                if (!filename.includes('.')) return filename.substr(0, 10) + '...';

                return filename.substr(0, 8) + '..' + filename.split('.').pop();
            },
            uploadFile(event) {
                alert('TODO: upload file');
            },
            submitChange(event) {
                var loading = weui.loading('Saving...');
                this.jayson.request('ticket.update', [this.ticket.id, this.comment, this.ticket.attributes], (err, response) =>
                {
                    loading.hide();

                    if (err)  weui.toast(err, 2000);
                    else if (response.error) weui.toast(response.error, 2000);
                    else {
                        weui.toast('Saved!', 2000);
                        setTimeout(()=>window.location.reload(), 500);
                    }
                });
            },
            getTextareaFields() {
                return this.trac.fields.filter(function (i) {
                    return i.type === 'textarea';
                });
            },
            getNontextareaFields() {
                return this.trac.fields.filter(function (i) {
                    return i.type !== 'textarea';
                });
            }
        }
    }
</script>

<style scoped>
    .view__hide {
        display: none;
    }
    .weui-input[disabled] {
        color: #888;
    }
    li.weui-uploader__file {
        text-align: center;
    }
    .view__button-area {
        margin: 0 auto;
        padding: 15px 0;
        width: 60%;
    }
    .weui-uploader__file a {
        margin: 2px;
        color: black;
        word-wrap:break-word;
    }
    #view__relation-tab .weui-panel {
        margin-top: 10px;
    }

</style>