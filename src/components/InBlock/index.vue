<template>
    <div class="inBlock bg-purple">
        {{block.name}}
        <ul id='mark list'>
            <draggable :list="block.marks">
                <li v-for='(mark, index) in block.marks'>
                    {{mark.name}}
                    <ul id='channel list'>
                        <draggable :list="mark.channels">
                            <div v-for="(channel, index) in mark.channels"
                            v-if='!channel.removed'
                            :block='block' :mark='mark' :item="channel"
                            class='bg-purple'>
                                {{channel.name}}
                            </div>
                        </draggable>
                    </ul>
                </li>
            </draggable>
        </ul>
    </div>
</template>

<script src="./script.js"></script>

<style scoped>
    .inBlock {
        border-radius: 8px;
        height: 30vh;
        width: 30vw;
        margin: 10px 10px;
    }
</style>
