<template>
    <div name="app" class="app">
        <el-row>
            <el-col :span="24">
                <video id='videoplayer' 
                    autoplay='autoplay'
                    :style='videoStyleObject' :src='slides[currentSlide].list[currentPage]'>
                    </video>
                <img id='imageplayer' :style='imageStyleObject' :src='slides[currentSlide].list[currentPage]'>
                </img>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-progress :percentage="(currentPage+1)/slides[currentSlide].list.length * 100" :show-text="false" :stroke-width="30">
                </el-progress>
            </el-col>
            <el-col :span="8">
                <el-button-group>
                    <el-button type="primary" :plain="true"
                        :disabled="currentPage===0 || forbidden"
                        icon="arrow-left" @click="onPrev">
                        Prev
                    </el-button>
                    <el-button type="primary" :disabled="!isVideo || forbidden" :plain="true" @click="onPlay">Play</el-button>
                    <el-button type="primary" :disabled="!isVideo || forbidden" :plain="true" @click="onPause">Pause</el-button>
                    <el-button type="primary" :plain="true" @click="onNext"
                        :disabled="currentPage===slides[currentSlide].list.length-1 || forbidden">
                        Next
                        <i class="el-icon-arrow-right el-icon--right"></i>
                    </el-button>
                    <el-button type="primary"
                        :disabled="!(currentPage===slides[currentSlide].list.length-1)||currentSlide===0||forbidden"
                        :plain="true" @click="onContinue">Continue
                    </el-button>
                    <el-button type="text" :disabled="true">Slide: {{currentSlide}}/{{slides.length-1}}</el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <el-button-group id='quiz_or_survey'>
            <el-button type="primary" :plain="true"  size="large" @click="onQuiz">
                Quiz
                <i class="el-icon-edit"></i>
            </el-button>
            <el-button type="primary" :plain="true"  size="large" @click="onSurvey">
                Survey
                <i class="el-icon-search"></i>
            </el-button>
        </el-button-group>
        <div id='userid'>
            <h1>Your userid is {{userid}}, don't forget it.<h1>
        </div>

    </div>
</template>


<script>
    const log = [];
    const hello = {
        list: [require('assets/slides/hello/1.png'),],
        type: 'image',
    };
    let isSurvey = false, url = null;
    const ratingUrl = 'https://goo.gl/forms/hsI4Yz2RA6haojXf2';
    const case1 = {
        list: [
            require('assets/slides/animated/1.mp4'),
            require('assets/slides/animated/3.mp4'),
            require('assets/slides/animated/4.mp4'),
            require('assets/slides/animated/5.mp4'),
            require('assets/slides/animated/6.mp4'),
            require('assets/slides/animated/7.mp4'),
            require('assets/slides/animated/8.mp4'),
            require('assets/slides/animated/9.mp4'),
            require('assets/slides/animated/10.mp4'),
            require('assets/slides/animated/11.mp4'),
            require('assets/slides/animated/12.mp4'),
            require('assets/slides/animated/13.mp4'),
            require('assets/slides/animated/15.mp4'),
            require('assets/slides/animated/16.mp4'),
            require('assets/slides/animated/17.mp4'),
            require('assets/slides/animated/18.mp4'),
            require('assets/slides/animated/19.mp4'),
            require('assets/slides/animated/20.mp4'),
            require('assets/slides/animated/21.mp4'),
            require('assets/slides/animated/22.mp4'),
            require('assets/slides/animated/23.mp4'),
            require('assets/slides/animated/24.mp4'),
            require('assets/slides/animated/26.mp4'),
            require('assets/slides/animated/27.mp4'),
            require('assets/slides/animated/28.mp4'),
            require('assets/slides/animated/29.mp4'),
            require('assets/slides/animated/30.mp4'),
            require('assets/slides/animated/31.mp4'),
            require('assets/slides/animated/32.mp4'),
            require('assets/slides/animated/33.mp4'),
            require('assets/slides/animated/34.mp4'),
            require('assets/slides/animated/35.mp4'),
        ],
        name: 'animation',
        type: 'video',
        url: 'https://goo.gl/forms/QcEydAxzZaOO1wyd2',
    };
    
    const case2 = {
        list: [
            require('assets/slides/non-animated/01.png'),
            require('assets/slides/non-animated/02.png'),
            require('assets/slides/non-animated/03.png'),
            require('assets/slides/non-animated/04.png'),
            require('assets/slides/non-animated/05.png'),
            require('assets/slides/non-animated/06.png'),
            require('assets/slides/non-animated/07.png'),
            require('assets/slides/non-animated/08.png'),
            require('assets/slides/non-animated/09.png'),
            require('assets/slides/non-animated/10.png'),
            require('assets/slides/non-animated/11.png'),
            require('assets/slides/non-animated/12.png'),
            require('assets/slides/non-animated/13.png'),
            require('assets/slides/non-animated/14.png'),
            require('assets/slides/non-animated/15.png'),
            require('assets/slides/non-animated/16.png'),
            require('assets/slides/non-animated/17.png'),
            require('assets/slides/non-animated/18.png'),
            require('assets/slides/non-animated/19.png'),
            require('assets/slides/non-animated/20.png'),
            require('assets/slides/non-animated/21.png'),
            require('assets/slides/non-animated/22.png'),
            require('assets/slides/non-animated/23.png'),
            require('assets/slides/non-animated/end.png'),
        ],
        name: 'short animation',
        type: 'image',
        url: 'https://goo.gl/forms/f575dVCyeKCBMFj52',
    };
    
    const case3 = {
        list: [
            require('assets/slides/qiaomu/1.png'),
            require('assets/slides/qiaomu/2.png'),
            require('assets/slides/qiaomu/3.png'),
            require('assets/slides/qiaomu/4.png'),
            require('assets/slides/qiaomu/end.png'),
        ],
        name: 'annotation',
        type: 'image',
        url: 'https://goo.gl/forms/U3CfBzib9GuhArZt2',
    };
    
    const case4 = {
        list: [
            require('assets/slides/xuke/1.png'),
            require('assets/slides/xuke/2.png'),
            require('assets/slides/xuke/3.png'),
            require('assets/slides/xuke/4.png'),
            require('assets/slides/xuke/5.png'),
            require('assets/slides/xuke/6.png'),
            require('assets/slides/xuke/7.png'),
            require('assets/slides/xuke/8.png'),
            require('assets/slides/xuke/end.png'),
        ],
        name: 'text',
        type: 'image',
        url: 'https://goo.gl/forms/Y2pYfYXtcv4vZ4B52',
    };
    let start = new Date();
    
    export default {
        data() {
            return {
                slides: [hello, case3, case4, case2, case1,],
                currentSlide: 0,
                currentPage: 0,
                userid: 0,
                forbidden: false,
            };
        },
        computed: {
            videoStyleObject() {
                return {
                    display: this.isVideo ? 'block' : 'none'
                }
            },
            imageStyleObject() {
                return {
                    display: this.isVideo ? 'none' : 'block'
                }
            },
            isVideo() {
                return this.slides[this.currentSlide].type === 'video';
            }
        },
        methods: {
            onPrev() {
                log.push([(new Date()).getTime() - start, 'prev', this.slides[this.currentSlide].name, this.currentPage]);
                this.currentPage -= 1;
                const video = this.$el.getElementsByTagName('video')[0];
                video.load();
            },
            onNext() {
                log.push([(new Date()).getTime() - start, 'next', this.slides[this.currentSlide].name, this.currentPage]);
                this.currentPage += 1;
                const video = this.$el.getElementsByTagName('video')[0];
                video.load();
            },
            onPlay() {
                log.push([(new Date()).getTime() - start, 'play', this.slides[this.currentSlide].name, this.currentPage]);
                const video = this.$el.getElementsByTagName('video')[0];
                video.play();
            },
            onPause() {
                log.push([(new Date()).getTime() - start, 'pause', this.slides[this.currentSlide].name, this.currentPage]);
                const video = this.$el.getElementsByTagName('video')[0];
                video.pause();
            },
            onContinue() {
                if (this.currentSlide === 0) {
                    start = new Date();
                    this.currentSlide = this.currentSlide + 1;
                    this.currentPage = 0;
                } else if (this.currentSlide === this.slides.length - 1) {
                    this.$http.get("http://patpat.net:9999/id", {}).then((name) => {
                        name = parseInt(name.body);
                        this.$http.post('http://patpat.net:9999/save', {
                            name,
                            data: log,
                        }).then((res) => {
                            console.info(res);
                        }, (err) => {
                            console.info(err);
                        });
                        console.info(log);
                        const type = isSurvey ? 'survey' : 'quiz';
                        this.$alert(`Please remember your userid ${name}, click the button to `, `${isSurvey ? 'SURVEY' : 'QUIZ'}`, {
                        confirmButtonText: `go to the ${type}`,
                            callback: action => {
                                window.open(url);
                                this.userid = name;
                                document.getElementById("userid").style.display = 'block';
                                this.forbidden = true;
                            }
                        });
                    });
                } else {
                    this.currentSlide = this.currentSlide + 1;
                    this.currentPage = 0;
                }
            },
            onQuiz() {
                start = new Date();
                const i = Math.floor(Math.random() * (4 - 1e-7)) + 1;
                this.slides = [this.slides[0], this.slides[i]];
                this.currentSlide = this.currentSlide + 1;
                this.currentPage = 0;
                url = this.slides[this.currentSlide].url;
                document.getElementById('quiz_or_survey').style.display = 'none';
                log.push('quiz');
            },
            onSurvey() {
                start = new Date();
                url = ratingUrl;
                isSurvey = true;
                for (let i = 0; i < 10; ++i) {
                    const a = Math.floor(Math.random() * (4 - 1e-7)) + 1;
                    const b = Math.floor(Math.random() * (4 - 1e-7)) + 1;
                    const t = this.slides[a];
                    this.slides[a] = this.slides[b];
                    this.slides[b] = t;
                }
                this.currentSlide = this.currentSlide + 1;
                this.currentPage = 0;
                document.getElementById('quiz_or_survey').style.display = 'none';
                log.push('survey');
            },
        },
    };
</script>

<style scope>
    video,
    img {
        min-width: 80%;
        min-height: 80%;
        max-width: 80%;
        max-height: 80%;
    }
    #quiz_or_survey {
        position: absolute;
        left: 35%;
        top: 60%;
    }
    #userid {
        position: absolute;
        left: 35%;
        top: 60%;
        display: none;
    }
</style>