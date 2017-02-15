<template>
    <div class='unitTree'>
        <!--<draggable :list="blocks">
                <button v-for="block in blocks" @click='selectBlock(block)'>
                    {{block.name}}
                </button>
        </draggable>-->
        <svg id='bTree'></svg>
    </div>
</template>

<script src='./script.js'></script>

<style>
    button {
        background-color: var(--color-0);
        color: var(--color-3);
        margin: 2px;
        border: none;
        border-radius: 3px;
        text-align: center;
        /*text-decoration: none;*/
        display: inline-block;
        font-size: 16px;
    }

    button:focus {
        outline: none;
        border: 3px solid var(--color-3);
        border-radius: 5px;
    }

    .unitTree {
        margin: 4px;
    }
</style>
