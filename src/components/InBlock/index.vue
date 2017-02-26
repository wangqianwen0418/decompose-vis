<template>
    <div class="inBlock">
        <div>
        <ul id='mark_list'>
            <div class='block'>{{block.name}}<hr/></div>
            <draggable :list="block.marks">
             <li v-for='mark in block.marks'>
                 <span class='mark'>{{mark.name}}</span>
                    <i class="el-icon-close" />

                    <ol id='channel_list'>
                        <draggable :list="mark.channels">
                               <channel v-for='channel in mark.channels' :channel='channel'/>
                            <li><i class="el-icon-plus"> add another channel</i></li>
                        </draggable>
                    </ol>
                </li>
                <li><i class="el-icon-plus">  add another mark</li>
            </draggable>
        </ul>
        </div>
    </div>
</template>

<script src="./script.js"></script>

<style scoped src="./style.css">

</style>
