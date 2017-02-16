<template>
    <div class="inBlock">
        <div>
        <ul id='mark_list'>
            <span class='block'>{{block.name}}</span>
            <draggable :list="block.marks">
                <li v-for='(mark, index) in block.marks'>
                    <span class='mark'>{{mark.name}}</span>
                    <i class="el-icon-close" />
                    <ol id='channel_list'>
                        <draggable :list="mark.channels">
                            <li v-for="(channel, index) in mark.channels"
                            v-if='!channel.removed'
                            class='bg-purple'>
                                <span class='channel'>{{channel.name}}</span>
                                <i class="el-icon-close" @click="removeItem(channel)"/>
                            </li>
                        </draggable>
                    </ol>
                </li>
            </draggable>
        </ul>
        </div>
    </div>
</template>

<script src="./script.js"></script>

<style scoped src="./style.css">

</style>
