<template>
    <div class="tracmobile-header-wrapper">
        <div class="tracmobile-header">
            <a href="javascript:history.go(-1)"><i class="weui-icon-back"></i></a>
            <p>{{text}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tm-header",
        props: ['text']
    }
</script>

<style scoped>
    .tracmobile-header {
        display: flex;
        position: fixed;
        z-index: 600;
        top: 0;
        width: 100%;
        background-color: #f7f7fa;
        color: black;
        text-align: center;
        border-bottom: 1px solid #ccc;
        box-shadow: 0.1em 0.15em 1em #eee;
        min-height: 48px;
        font-weight: 400;
    }

    .tracmobile-header p {
        margin: auto;
    }

    .tracmobile-header-wrapper {
        height: 49px;
    }

    .tracmobile-header a {
        margin: auto 5px;
        color: inherit;
    }
</style>