<template>
    <div>
        <tm-header text="New Ticket"></tm-header>
        <div v-if="!trac.isLogin" class="newticket__logintip weui-cells__title">
            <router-link to="/login">
                <i class="weui-icon-warn"></i>
                <span>You haven't login yet and will submit as anonymous. Click to login.</span>
            </router-link>
        </div>
        <div class="weui-cells__title">Attributes</div>
        <div class="weui-cells">
            <template v-for="field in getNontextareaFields()">
                <tm-ticket-attribute :field="field" :trac="trac" :ticket="ticket" :protect="false"></tm-ticket-attribute>
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
        <div class="view__error" v-if="error">{{error}}</div>
        <div class="view__button-area">
            <a class="weui-btn weui-btn_primary" @click="submitChange">Save</a>
        </div>
    </div>
</template>

<script>

    import Ticket from "./ticket";
    import TmHeader from "./tm-header";
    import TmTicketAttribute from "./tm-ticket-attribute";

    export default {
        components: {TmHeader, TmTicketAttribute},
        name: "tm-newticket",
        props: ['ticketId', 'jayson', 'trac'],
        data: function () {
            return {
                ticket: new Ticket(),
                error: null
            };
        },
        methods: {
            getTextareaFields() {
                return this.trac.fields.filter(function (i) {
                    return i.type === 'textarea';
                });
            },
            getNontextareaFields() {
                return this.trac.fields.filter(function (i) {
                    return i.type !== 'textarea';
                });
            },
            submitChange() {
                var loading = weui.loading('Saving...');
                this.jayson.request('ticket.create', [this.ticket.attributes['summary'], this.ticket.attributes['description'],
                    this.ticket.attributes], (err, response) =>
                {
                    loading.hide();

                    if (err) this.error = err;
                    else if (response.error) this.error = response.error;
                    else {
                        this.error = null;
                        weui.toast('Saved!', 2000);
                        var t = response.result;
                        setTimeout(()=>this.$router.push({name: 'ticket', params: {ticketId: t}}), 500);
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .newticket__logintip {
        margin: 0;
        padding: .77em 15px;
        background-color: #eee;
        border-bottom: solid 1px #d9d9d9;
    }

    .newticket__logintip i {
        font-size: 14px;
    }

    .newticket__logintip a {
        color: inherit;
    }

    .view__button-area {
        margin: 0 auto;
        padding: 15px 0;
        width: 60%;
    }
</style>