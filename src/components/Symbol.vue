<template>
    <div class='button' @click='click' @mouseover='mouseover'>
        <svg class='svgIcon' width='64' height='64'>
        </svg>
    </div>
</template>

<script>
import symbol from '../canvas/symbol.js';
import * as d3 from 'd3';

export default {
    data() {
        return {
            sym: null,
            svg: null,
        };
    },
    mounted() {
        const dom = this.$el.getElementsByTagName('svg')[0];
        this.svg = d3.select(dom);
        this.svg.attr('width', 64).attr('height', 64);
        this.update();
    },
    watch: {
        type() {
            this.update();
        },
        category() {
            this.update();
        }
    },
    methods: {
        update() {
            if (this.category === 'size') {
                if (this.type === 'vertical') {
                    this.sym = symbol.symbolSizeVertical(this.svg);
                } else if (this.type === 'horizontal') {
                    this.sym = symbol.symbolSizeHorizontal(this.svg);
                }
            } else if (this.category === 'category') {
                if (this.type === 'discrete') {
                    this.sym = symbol.symbolColorDiscrete(this.svg);
                } else if (this.type === 'gradient') {
                    this.sym = symbol.symbolColorGradient(this.svg);
                }
            }
        },
        click() {
        },
        mouseover() {
        },
    },
    props: ['type', 'category'],
};
</script>

<style scoped>
    .button {
        float: left;
        width: 76px;
    }
    .button :hover {
        background: 'blue';
    }
    svg {
        margin: 10px 6px 10px 6px;
    }
</style>
