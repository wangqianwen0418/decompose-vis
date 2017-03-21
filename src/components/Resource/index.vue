<template>
    <div class="resource bg-purple-light">
		<fig-source :src="require('assets/textflow-hi.png')"></fig-source>
		<!--<text-source></text-source>-->
        <el-row>
            <el-col :span='12'>
                <unit-tree/>
            </el-col>
            <el-col :span='12'>
                <in-block/>
            </el-col>
        </el-row>
    </div>
</template>

<script src="./script.js"></script>

<style scoped>
	/*.resource {
		border-radius: 6px;
		height:84.4vh;
        background-color: var(--color-2);
        margin: 0vh 0 0 0.4vw;
		margin: 10px 10px;
	}*/

    /*version 2*/
    .resource {

	}
</style>
