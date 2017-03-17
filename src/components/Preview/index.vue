<template>
    <el-row>
        <el-col :span="24">
            <video id='videoplayer'>
                <source :src='this.src[this.current]' type='video/mp4'/>
            </video>
        </el-col>
        <el-col :span="15">
            <el-progress :percentage="this.current/ this.src.length * 100" :show-text="false" :stroke-width="30">
            </el-progress>
        </el-col>
        <el-col :span="8">
            <el-button-group>
                <el-button type="primary" icon="arrow-left" @click="onPrev">上一页</el-button>
                <el-button type="primary" @click="onPlay">播放</el-button>
                <el-button type="primary" @click="onPause">暂停</el-button>
                <el-button type="primary" @click="onNext">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
        </el-col>
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
	    props: ['src', 'start']
    }
</script>

<style scoped>
</style>
