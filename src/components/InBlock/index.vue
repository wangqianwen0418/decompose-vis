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
                            <li>
                                <!--<i class="el-icon-plus"> add another channel</i>-->
                                <el-dropdown >
                                <span class="el-dropdown-link">
                                    add another channel<i class="el-icon-caret-bottom el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for='channelTemp in channelsTemp'>
                                    <span @click='addChannel(channelTemp)'>{{channelTemp.name}}
                                    </span>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                                </el-dropdown>
                            </li>
                        </draggable>
                    </ol>
                </li>
                <li>
                    <el-dropdown >
                        <span class="el-dropdown-link">
                            add another mark<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for='markTemp in marksTemp' @click='addMark(MarkTemp)'>{{markTemp.name}}</el-dropdown-item>
                            <!--<el-dropdown-item command="d">size</el-dropdown-item>-->
                            <!--<el-dropdown-item command="e">shape</el-dropdown-item>-->
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
            </draggable>
        </ul>
        </div>
    </div>
</template>

<script src="./script.js"></script>

<style scoped src="./style.css">

</style>
