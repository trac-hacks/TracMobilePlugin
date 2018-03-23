<template>
    <div class="weui-cell" v-if="field.type == 'text' || field.type === 'time'">
        <div class="weui-cell__hd"><label class="weui-label">{{field.label}}</label></div>
        <div class="weui-cell__bd"><input class="weui-input" type="text" v-model="ticket.attributes[field.name]" :disabled="field.readonly" /></div>
    </div>
    <div class="weui-cell" v-else-if="protect && ['resolution', 'status'].indexOf(field.name) >= 0">
        <div class="weui-cell__hd"><label class="weui-label">{{field.label}}</label></div>
        <div class="weui-cell__bd"><input class="weui-input" type="text" v-model="ticket.attributes[field.name]" disabled="disabled" /></div>
    </div>
    <div class="weui-cell weui-cell_select weui-cell_select-after" v-else-if="field.type === 'select'|| field.type === 'radio'">
        <div class="weui-cell__hd"><label class="weui-label">{{field.label}}</label></div>
        <div class="weui-cell__bd">
            <select class="weui-select" v-model="ticket.attributes[field.name]" >
                <option v-for="op in field.options">{{op}}</option>
            </select>
        </div>
    </div>
    <div class="weui-cell" v-else>
        <div class="weui-cell__hd"><label class="weui-label">{{field.label}}</label></div>
        <div class="weui-cell__bd"><input class="weui-input" type="text" v-model="ticket.attributes[field.name]" disabled="disabled" /></div>
    </div>
</template>

<script>
    export default {
        name: "tm-ticket-attribute",
        props: {'trac': Object, 'field': Object, 'ticket': Object, 'protect': { type: Boolean, default: ()=>true }}
    }
</script>

<style scoped>

</style>