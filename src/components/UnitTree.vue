<template>
    <ul>
            <li>
    <draggable :list="blocks">
        <button v-for="(block, index) in blocks" :item="block" :index="index+1">
            {{block.name}}
        </button>
            </li>
        </ul>
    </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            blocks: 'blocks',
        }),
    },
    components: {
        draggable,
    },
};
</script>

<style>
ul {
    list-style-type: none;
}

</style>
