<template>
    <div class='unitTree'>
        <!--<draggable :list="blocks">
                <button v-for="block in blocks" @click='selectBlock(block)'>
                    {{block.name}}
                </button>
        </draggable>-->
        <div class="tittle">Tree of Visual Units
        <hr/>
        </div>
        <svg id='bTree' :width="width" :height="height"></svg>
    </div>
</template>

<script src='./script.js'></script>

<style scoped>

/*button {
    background-color: var(--color-0);
    color:var(--color-3);
    margin: 2px;
    border:none;
    border-radius: 3px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}

button:focus {
    outline:none;
    border:3px solid var(--color-3);
    border-radius: 5px;
}*/

.unitTree {
    margin: 1vh 0.5vw 1vh 1vw;
    height:40vh;
    box-shadow: 2px 2px 1px var(--color-blue-dark);
    background-color: var(--color-white);
}
#bTree{
    margin: 5px 10px;
    position:absolute;
    top:0px;
    left:1vw;
}
.tittle{
    float:left;
    margin:1vw;
    color:var(--color-blue-dark);
    font-size:20px;
}
hr {
     background: var(--color-blue-dark);
     width: 120%;
     height: 0.3vh;
     border:none;
     margin:0px;
     margin-left: -1vw;
}

</style>
