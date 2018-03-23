<template>
    <div>
        <div class="page" v-show="selectedAction == null">
            <div class="page__bd">
                <div class="weui-cells__title">#{{ticket.id}} {{ticket.attributes['summary']}}</div>
                <div class="weui-cells">
                    <div class="weui-cell">
                        <div class="weui-cell__hd"><label class="weui-label">Status</label></div>
                        <div class="weui-cell__bd">{{ticket.attributes['status']}}</div>
                    </div>
                    <div class="weui-cell">
                        <div class="weui-cell__hd"><label class="weui-label">Owner</label></div>
                        <div class="weui-cell__bd">{{ticket.attributes['owner']}}</div>
                    </div>
                    <div class="weui-cell">
                        <div class="weui-cell__hd"><label class="weui-label">Modified</label></div>
                        <div class="weui-cell__bd">{{ticket.attributes['changetime']}}</div>
                    </div>
                </div>
                <div class="weui-cells__title">Comment</div>
                <div class="weui-cells">
                    <div class="weui-cell">
                        <div class="weui-cell__bd"><textarea class="weui-textarea" rows="3" v-model="message"></textarea></div>
                    </div>
                </div>
                <div class="tasks-view__button-area">
                    <div v-for="(action, index) in ticket.actions" :key="action.name">
                        <a class="weui-btn" @click="selectedAction = action" :class="{'weui-btn_default': index != 0, 'weui-btn_primary': index == 0}">
                            {{action.displayName}}
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="weui-msg" v-show="selectedAction != null">
            <div class="weui-msg__icon-area"><i class="weui-icon-info weui-icon_msg"></i></div>
            <div class="weui-msg__text-area">
                <h2 class="weui-msg__title">{{selectedAction? selectedAction.displayName: ''}}</h2>
                <p class="weui-msg__desc">Confirm Action？</p>
            </div>
            <div class="weui-cells" v-if="selectedAction && selectedAction.options">
                <div class="weui-cell" v-for="option in selectedAction.options" v-key="option.optionName">
                    <div class="weui-cell__hd"><label class="weui-label" style="text-align: left;">{{option.displayName}}</label></div>
                    <div class="weui-cell__bd">
                        <select class="weui-select" v-model="option.value" v-if="option.availableOptions && option.availableOptions.length > 0">
                            <option v-for="op in option.availableOptions">{{op}}</option>
                        </select>
                        <input class="weui-input" type="text" v-model="option.value" v-else />
                    </div>
                </div>
            </div>
            <div class="weui-msg__opr-area">
                <p class="weui-btn-area"><a class="weui-btn weui-btn_primary" @click="submitChange">Confirm</a><a class="weui-btn weui-btn_default" @click="selectedAction = null">Cancel</a></p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tm-ticket-actions",
        props: ['trac', 'ticket', 'jayson'],
        data: function () {
            return {
                message: '',
                selectedAction: null,
            };
        },
        methods: {
            submitChange: function () {
                var loading = weui.loading('Saving...');
                var action = {
                    '_ts': this.ticket.attributes['_ts'],
                    'action': this.selectedAction.name,
                };
                this.selectedAction.options.forEach(option => {
                    action[option.optionName] = option.value;
                });
                this.jayson.request('ticket.update', [this.ticket.id, this.message, action], (err, response) =>
                {
                    loading.hide();

                    if (err)  weui.toast(err, 2000);
                    else if (response.error) weui.toast(response.error, 2000);
                    else {
                        weui.toast('Saved!', 2000);
                        setTimeout(()=>window.location.reload(), 500);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .view__hide {
        display: none;
    }
    .tasks-view__title {
        margin: 30px 0 10px 0;
        font-weight: 400;
        font-size: 34px;
        color: #3cc51f;
        text-align: center;
    }
    .tasks-view__button-area {
        margin: 0 auto;
        padding: 15px 0;
        width: 60%;
    }
    .tasks-view__button-area a {
        margin-bottom: 5px;
    }
</style>