<template>
    <li :style="styleObject" @click="selectChannel(channel)">
        <span class='channel'>{{channel.name}}</span>
        <i class="el-icon-close" @click="removeChannel" />
        </li>
</template>

<script>
    import { mapActions } from 'vuex';
    import { SELECT_CHANNEL } from '../store';

    export default {
        props: ['channel', 'mark'],
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
            removeChannel() {
                const index = this.mark.channels.indexOf(this.channel);
                if (index > -1) {
                    this.mark.channels.splice(index, 1);
                }
            },
            // selectChannel() {
            //     this.channel.selected = true;
            // },
            ...mapActions({
                selectChannel: SELECT_CHANNEL,
            }),
        },
    };

</script>

