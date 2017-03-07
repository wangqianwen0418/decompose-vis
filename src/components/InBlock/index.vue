<template>
    <div class="inBlock">
        <div>
        <ul id='mark_list'>
            <div class='block'>{{block.name}}<hr/></div>
            <draggable :list="block.marks">
             <markv v-for='mark in block.marks' :mark='mark' :block= 'block'>
                </markv>
                <li>
                    <el-dropdown >
                        <span class="el-dropdown-link">
                            add another mark<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <span v-for='markTemp in marksTemp' @click='addMark(markTemp)'>
                            <el-dropdown-item >
                                    {{markTemp.name}}
                            </el-dropdown-item>
                             </span>
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

<style src="./style.css">

</style>
