<template>
    <div>
        <slideout menu="#tm-slideout-menu" panel="#tm-slideout-panel" side="right"
                  :toggleSelectors="['.tm-slideout-button', '.tm-slideout-button-ok', '.tm-slideout-button-cancel']">
            <div id="tm-slideout-menu">
                <div style="padding-top: 48px; padding-bottom: 77px;">
                    <slot name="tm-slideout-menu"></slot>
                    <div class="tm-slideout-buttons">
                        <div class="view__button-area weui-flex">
                            <a class="weui-btn weui-btn_primary weui-flex__item tm-slideout-button-ok" @click="filterConfirm">Confirm</a>
                            <a class="weui-btn weui-btn_default weui-flex__item tm-slideout-button-cancel" @click="filterCancel">Cancel</a>
                        </div>
                    </div>
                </div>
            </div>
            <div id="tm-slideout-panel">
                <slot></slot>
            </div>
        </slideout>
    </div>
</template>

<script>
    import Slideout from 'vue-slideout';

    export default {
        components: {Slideout},
        name: "tm-slideout",
        data: function () {
            return {
            };
        },
        created: function () {
        },
        computed: {
        },
        methods: {
            filterConfirm: function () {
                this.$emit('confirm');
            },
            filterCancel: function () {
                this.$emit('cancel');
            }
        }
    }
</script>

<style scoped>

    .slideout-menu {
        position: fixed;
        top: 0;
        bottom: 54px;
        width: 256px;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        background-color: #ebebeb;
        z-index: 0;
        display: none;
    }

    .slideout-menu-left {
        left: 0;
    }

    .slideout-menu-right {
        right: 0;
    }

    .slideout-panel {
        position: relative;
        z-index: 1;
        will-change: transform;
        min-height: 100vh;
        background-color: #f8f8f8;
        box-shadow: 0.1em 0.15em 1em #999;
    }

    .slideout-open,
    .slideout-open body,
    .slideout-open .slideout-panel {
        overflow: hidden;
    }

    .slideout-open .slideout-menu {
        display: block;
    }

    .tm-slideout-buttons {
        position: fixed;
        bottom: 54px;
        width: 256px;
        right: 0;
        border-top: solid 1px #d9d9d9;
        background-color: #ebebeb;
    }

    .view__button-area {
        margin: 0 auto;
        padding: 15px 0;
    }

    .view__button-area a {
        margin: 0 20px;
    }

    .view__button-area a:last-child {
        margin-left: 0;
    }
</style>