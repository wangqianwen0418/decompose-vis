<template>
    <div class="inBlock">
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
</template>

<script src="./script.js"></script>

<style scoped>
    .inBlock {
        border-radius: 8px;
        min-height: 38vh;
        width: 20vw;
        /*margin: 10px 10px;*/
        /*border:2px solid var(--color-3);*/
        border-radius: 6px;
        background-color:var(--color-0);
        color: var(--color-3);
        font-family: 'Pangolin', cursive;
    }
    #mark_list{
        margin: 0px;
        list-style-type: none;
        padding:0px;
    }
    #mark_list li{
        border:3px solid var(--color-2);
        margin:3px;
        border-radius:6px;
    }
    #mark_list li:before{
        content:' ◦ ';
        color:var(--color-3);
        padding-left:6px;
    }
    #channel_list{
        font-size:15px;
        list-style-type: none;
        padding:0px;
    }
    #channel_list li:before{
        content:'•  ';
        color:var(--color-3);
        padding-left: 6px;
    }
    #channel_list li{
        background-color: var(--color-2);
        margin:2px;
        border-radius:3px;
    }

    .el-icon-close{
        float:right;
        font-size:10px;
    }
    #channel_list li.channel{
        margin-left:12px;
        font-size: 15px;
    }
    #mark_list li.mark{
        margin-left:3px;
        font-size: 18px;
    }
    .block{
        margin-left:10px;
        margin-bottom: 0px;
        font-size: 20px;
    }
</style>
