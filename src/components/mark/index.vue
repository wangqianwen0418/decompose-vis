<template>
    <li>
        <span class='mark'>{{mark.name}}</span>
        <i class="el-icon-close" @click='removeMark' />
        <ol id='channel_list'>
            <draggable :list="channels">
                <channel v-for='channel in channels' :channel='channel' :mark='mark' />
                <li>
                    <!--<i class="el-icon-plus"> add another channel</i>-->
                    <el-dropdown>
                        <span class="el-dropdown-link">
                                add another channel<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <span v-for='channelTemp in channelsTemp' @click='addChannel(channelTemp)'>
                                <el-dropdown-item >
                                {{channelTemp.name}}
                                </el-dropdown-item>
                                  </span>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
            </draggable>
        </ol>
    </li>
</template>

<script src='./script.js'>
</script>

<style scoped>
</style>
