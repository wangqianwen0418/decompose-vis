<template>
    <div>
        <el-row>
            <el-col :span="24">
                <video id='videoplayer' :style='videoStyleObject'>
                    <source :src='this.src[this.current]'/>
                </video>
                <img id='imageplayer' :style='imageStyleObject' :src='this.src[this.current]'>
                </img>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="15">
                <el-progress :percentage="this.current/ this.src.length * 100" :show-text="false" :stroke-width="30">
                </el-progress>
            </el-col>
            <el-col :span="1">
                <div class="grid-content bg-purple"></div>
            </el-col>
            <el-col :span="8">
                <el-button-group>
                    <el-button type="primary" :plain="true" icon="arrow-left" @click="onPrev">Prev</el-button>
                    <el-button type="primary" :plain="true" @click="onPlay">Play</el-button>
                    <el-button type="primary" :plain="true" @click="onPause">Pause</el-button>
                    <el-button type="primary" :plain="true" @click="onNext">Next<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                current: 0,
                log: [],
            }
        },
        computed: {
            videoStyleObject() {
                return {
                    display: this.isvideo ? 'block' : 'none'
                }
            },
            imageStyleObject() {
                return {
                    display: !this.isvideo ? 'block' : 'none'
                }
            },
        },
        methods: {
            onPrev() {
                this.current -= 1;
                if (this.current < 0) {
                    this.current = 0;
                } else {
                    const video = this.$el.getElementsByTagName('video')[0];
                    video.load();
                    video.play();
                    this.log.push([(new Date()).getTime() - this.start, 'prev']);
                    this.$emit('log', this.log);
                }
            },
            onNext() {
                this.current += 1;
                if (this.current >= this.src.length) {
                    this.current = this.src.length - 1;
                } else {
                    const video = this.$el.getElementsByTagName('video')[0];
                    video.load();
                    video.play();
                    this.log.push([(new Date()).getTime() - this.start, 'next']);
                    this.$emit('log', this.log);
                }
            },
            onPlay() {
                const video = this.$el.getElementsByTagName('video')[0];
                video.play();
                this.log.push([(new Date()).getTime() - this.start, 'play']);
                this.$emit('log', this.log);
            },
            onPause() {
                const video = this.$el.getElementsByTagName('video')[0];
                video.pause();
                this.log.push([(new Date()).getTime() - this.start, 'pause']);
                this.$emit('log', this.log);
            }
        },
	    props: ['src', 'start', 'isvideo']
    }
</script>

<style scoped>
    video {
        min-width: 80%;
        min-height: 80%;
    }
</style>
