<template>
    <div class="tracmobile-header-wrapper">
        <div class="tracmobile-header">
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
        position: absolute;
        z-index: 500;
        top: 0;
        width: 100%;
        background-color: #f7f7fa;
        color: black;
        text-align: center;
        border-bottom: 1px solid #c0bfc4;
        min-height: 48px;
        font-weight: 400;
    }

    .tracmobile-header p {
        margin: auto;
    }

    .tracmobile-header-wrapper {
        height: 48px;
    }
</style>