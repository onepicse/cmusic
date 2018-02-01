<template>
	<div class="player">
		<div class="player-context">
			<div class="player-head">
				<Back class="player-head-back"></Back>
				<h3>{{song.name}}</h3>
				<p>{{singer}}</p>
			</div>
			<div class="player-body">
				<div class="song-cover" :class="{rotateCircle: isPlay}">
					<div :style="{backgroundImage: 'url(' + song.picUrl + ')'}" class="circle"></div>
				</div>
				<div class="audio">
					<audio :src="song.playSrc" autoplay></audio>
					<div class="other-bar"></div>
					<div class="progress-bar">{{ audioCurrentTime }} - {{ audioDuration }}</div>
					<div class="tool-bar">
						<button @click="changePlayMode" class="tool-bar-btn">
							<Icon :iconName="playMode"></Icon>
						</button>
						<div class="audio-btns">
							<button @click="prev" class="audio-btn prev-btn">
								<Icon :iconName="'prev'"></Icon>
							</button>
							<button v-if="isPlay" @click="audioStop" class="audio-btn stop-btn">
								<Icon :iconName="'stop'"></Icon>
							</button>
							<button v-else @click="audioPlay" class="audio-btn play-btn">
								<Icon :iconName="'play'"></Icon>
							</button>
							<button @click="next" class="audio-btn next-btn">
								<Icon :iconName="'next'"></Icon>
							</button>
						</div>
						<button class="tool-bar-btn">
							<Icon :iconName="'recently'"></Icon>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div :style="{backgroundImage: 'url(' + song.picUrl + ')'}" class="blur"></div>
	</div>
</template>

<script>
import Back from './Back.vue'
import Icon from './Icon.vue'
const API_MUSICINFO = 'https://api.imjad.cn/cloudmusic/?type=detail&id=';
const API_MUSICPLAY = 'https://api.imjad.cn/cloudmusic/?type=song&id=';
const API_MUSICLYRIC = 'https://api.imjad.cn/cloudmusic/?type=lyric&id=';
let timmer = null;
export default {
  name: 'Player',
  data () {
    return {
      audio: null,
      song: {
        id: null,
        name: null,
        picUrl: null,
        singer: [],
        playSrc: null,
        duration: 0,
        currentTime: 0,
        ended: true
      },
      playModeIndex: 0,
      playModes: ['random', 'circulation-list', 'circulation-one'],
      isPlay: false,
      isLoadedInfo: false,
      isReady: false,
      isShowLyric: false
    }
  },
  components: {
    Back, Icon
  },
  computed: {
    singer: function () {
      let singner = '';
      this.song.singer.forEach(function (item) {
        singner += item.name + '/';
      })
      return singner.substring(0, singner.length - 1);
    },
    playMode: function () {
      return this.playModes[this.playModeIndex];
    },
    audioDuration: function () {
      return [parseInt(this.song.duration / 60 % 60), parseInt(this.song.duration % 60)].join(':').replace(/\b(\d)\b/g, '0$1');
    },
    audioCurrentTime: function () {
      return [parseInt(this.song.currentTime / 60 % 60), parseInt(this.song.currentTime % 60)].join(':').replace(/\b(\d)\b/g, '0$1');
    }
  },
  watch: {
    'song.id': function (val, oldVal) {
      this.getSongInfo();
    },
    isPlay: function (val) {
      if (val) {
        // 播放
        this.setAudioCurrentTime();
        this.audio.play();
      } else {
        // 暂停
        clearInterval(timmer);
        this.audio.pause();
      }
    },
    'song.ended': function (val) {
      if (val) {
        // 已结束
        clearInterval(timmer);
        this.isPlay = false;
      } else {
        // 未结束
        this.setAudioCurrentTime();
        this.isPlay = true;
      }
    }
  },
  methods: {
    getSongInfo () {
      // 获取歌曲信息
      this.$http.get(API_MUSICINFO + this.song.id).then(res => {
        let data = res.body;
        if (data.code === 200) {
          this.song.name = data.songs[0].al.name;
          this.song.picUrl = data.songs[0].al.picUrl;
          this.song.singer = data.songs[0].ar;
          this.isLoadedInfo = true;
          this.getPlayResource();
        }
      })
    },
    getPlayResource () {
      // 获取歌曲播放资源
      this.$http.get(API_MUSICPLAY + this.song.id).then(res => {
        let data = res.body;
        if (data.code === 200) {
          this.song.playSrc = data.data[0].url;
          // 监听audio是否可以播放
          if (this.audio !== null || this.audio !== undefined) {
            console.log(this.audio.audioPlay)
            this.audio.load(this.audio.audioPlay);
            let that = this;
            this.audio.addEventListener('canplaythrough', function () {
              that.setAudioDuration();
              that.audioPlay();
              that.song.ended = false;
            });
            this.audio.addEventListener('ended', function () {
              that.song.ended = true;
            });
          }
        }
      })
    },
    setAudioCurrentTime () {
      let that = this;
      timmer = setInterval(function () {
        that.song.currentTime = that.audio.currentTime;
      }, 1000);
      timmer;
    },
    setAudioDuration () {
      this.song.duration = this.audio.duration;
    },
    changePlayMode () {
      // 改变播放模式
      if (this.playModeIndex < this.playModes.length - 1) {
        this.playModeIndex += 1;
      } else {
        this.playModeIndex = 0;
      }
    },
    next () {
      // 先暂停
      this.isPlay = false;
      this.song.id = '29567100';
    },
    prev () {
      // 先暂停
      this.isPlay = false;
      this.song.id = '189593';
    },
    audioPlay () {
      this.isPlay = true;
    },
    audioStop () {
      this.isPlay = false;
    }
  },
  beforeCreat () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    this.audio = document.querySelector('audio');
    this.audio.audioPlay = false;
    // 获取歌曲信息
    this.song.id = this.$route.params.mid;
  },
  beforeUpdate () {
  },
  updated () {
  },
  beforDestroy () {
  },
  destroyed () {
  }
}
</script>

<style lang="less">
	.player{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		.player-context {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 99;
			background-color: rgba(0, 0, 0, .35);
		}
		.blur{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 98;
			filter: blur(20px);
			background-position: center;
			background-repeat: no-repeat;
		}
		.player-head{
			position: relative;
			width: 100%;
			height: 1.173333rem;
			padding: 0.186667rem 0.266667rem;
			box-sizing: border-box;
			border-bottom: 0.013333rem rgba(255, 255, 255, .24) solid;
			.player-head-back{
				position: absolute;
				left: 0.266667rem;
				top: 0.186667rem;
			}
			h3{
				margin-bottom: 0.106667rem;
				text-align: center;
				font-size: 0.4rem;
				line-height: 1;
				color: #fff;
				font-weight: normal;
			}
			p{
				font-size: 0.32rem;
				color: #fff;
				text-align: center;
			}
		}
		.player-body{
			.song-cover{
				position: relative;
				width: 8.0rem;
				height: 8.0rem;
				margin: 2.133333rem auto 0 auto;
				border-radius: 50%;
				background-color: rgba(255, 255, 255, 0.42);
				background-image: url('https://raw.githubusercontent.com/onepicse/vue/master/audio/src/components/audio/singlecover.png');
				background-repeat: no-repeat;
				background-size: 8.0rem;
				&.rotateCircle{
					animation: rotateCircle 15s linear infinite;
				}
				@keyframes rotateCircle{
					from {
						transform: rotate(0);
					}
					to {
						transform: rotate(360deg);
					}
				}
				@-webkit-keyframes rotateCircle{
					from {
						transform: rotate(0);
					}
					to {
						transform: rotate(360deg);
					}
				}
				img{
					display: block;
					height: 5.2rem;
					margin-left: -35%;
				}
				.circle{
					position: absolute;
					left: 50%;
					top: 50%;
					width: 5.2rem;
					height: 5.2rem;
					margin-left: -2.6rem;
					margin-top: -2.6rem;
					border-radius: 50%;
					overflow: hidden;
					background-position: center;
					background-size: auto 5.2rem;
				}
			}
		}
		.audio{
			width: 100%;
			height: 2.8rem;
			.other-bar{
				width: 100%;
				height: 0.72rem;
				margin-top: 2.0rem;
			}
			.progress-bar{
				width: 100%;
				height: 1.546667rem;
			}
			.tool-bar{
				display: flex;
				width: 100%;
				height: 1.253333rem;
				padding: 0 0.266667rem;
				box-sizing: border-box;
				.tool-bar-btn{
					flex-basis: 0.96rem;
					height: 100%;
					border: none;
					outline: none;
					background-color: transparent;
					font-size: 0.6rem;
				}
				.audio-btns{
					display: flex;
					flex-basis: 7.546667rem;
					padding: 0 0.6rem;
					box-sizing: border-box;
					.audio-btn{
						flex: 1;
						border: none;
						outline: none;
						background-color: transparent;
						font-size: 0.826667rem;
					}
				}
			}
		}
	}
</style>
