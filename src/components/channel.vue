<template>
    <li :style="styleObject" @click="selectChannel(channel)" v-if='!channel.removed'>
        <span class='channel'>{{channel.name}}</span>
        <i class="el-icon-close" @click="removeChannel(channel)" />
        </li>
</template>

<script>
    import { mapActions } from 'vuex';
    import { REMOVE_CHANNEL, SELECT_CHANNEL } from '../store';

    export default {
        props: ['channel'],
        computed: {
            styleObject() {
                if (this.channel.selected) {
                    return {
                        border: '4px solid var(--color-blue-highlight)',
                    };
                }
                return null;
            },
        },
        methods: {
            ...mapActions({
                removeChannel: REMOVE_CHANNEL,
                selectChannel: SELECT_CHANNEL,
            }),
        },
    };

</script>

<!--<style scoped>
    .el-icon-close{
        float:right;
        font-size:10px;
    }
     li:before{
        content:'•  ';
        color:var(--color-white);
        padding-left: 6px;
    }
     li:last-child:before{
        content:' ';
    }
     li{
        background-color: var(--color-blue-light);
        color:var(--color-white);
        margin:0.5vh 0.5vw ;
    }
     li:last-child{
        text-align: center;
    }
</style>-->
