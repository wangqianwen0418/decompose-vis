<template>
    <div class="inBlock">
        <ul id="mark_list">
            <span class="block">{{block.name}}</span>
            <draggable :list="block.marks">
                <li v-for="markId in block.marks">
                    <span class="mark">{{marks[markId].name}}</span>
                    <i class="el-icon-close" />
                    <ol id="channel_list">
                        <draggable :list="marks[markId].channels">
                            <li v-for="channelId in marks[markId].channels"
                            v-if="!channels[channelId].removed"
                            class="bg-purple">
                                <span class="channel">{{channels[channelId].name}}</span>
                                <i class="el-icon-close" @click="removeChannel(channels[channelId])"/>
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
        border-radius: 6px;
        height: 43vh;
        width: 20vw;
        margin: 4px 0px;
        /*border:2px solid var(--color-3);*/
        /*border-radius: 6px;*/
        background-color:var(--color-0);
        color: var(--color-3);
        box-shadow: 2px 2px 1px var(--color-3);
        /*font-family: "Pangolin", cursive;*/
    }
    #mark_list{
        margin: 0px;
        list-style-type: none;
        padding:0px;
    }
    #mark_list li{
        border:3px solid var(--color-2);
        margin:3px;
        /*border-radius:6px;*/
    }
    #mark_list li:before{
        content:" ◦ ";
        color:var(--color-3);
        padding-left:6px;
    }
    #channel_list{
        font-size:15px;
        list-style-type: none;
        padding:0px;
    }
    #channel_list li:before{
        content:"•  ";
        color:var(--color-3);
        padding-left: 6px;
    }
    #channel_list li{
        background-color: var(--color-2);
        margin:2px;
        /*border-radius:3px;*/
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
