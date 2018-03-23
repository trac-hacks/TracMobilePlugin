<template>
    <div class="weui-media-box weui-media-box_appmsg">
        <router-link class="weui-cell_access" :to="{name: 'ticket', params: {ticketId: ticket.id}}">
            <h4 class="weui-media-box__title">#{{ticket.id}} {{ticket.attributes['summary']}} </h4>
            <p class="weui-media-box__desc">{{ticket.attributes['description']}}</p>
            <ul class="weui-media-box__info">
                <li class="weui-media-box__info__meta">{{ticket.attributes['status']}}</li>
                <li class="weui-media-box__info__meta">{{ticket.attributes['type']}}</li>
                <li class="weui-media-box__info__meta">{{ticket.attributes['owner']}}</li>
                <li class="weui-media-box__info__meta">{{ticket.attributes['component']}}</li>
            </ul>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "tm-ticket-list-item",
        props: ['ticket']
    }
</script>

<style scoped>

</style>