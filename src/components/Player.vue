<template>
	<div class="player">
		<div class="player-context">
			<div class="player-head">
				<Back class="player-head-back"></Back>
				<h3>{{song.name}}</h3>
				<p>{{singer}}</p>
			</div>
			<div class="player-body">
				<div class="song-cover">
					<div :style="{backgroundImage: 'url(' + song.picUrl + ')'}" class="circle"></div>
				</div>
				<div class="audio">
					<audio :src="song.playSrc" autoplay></audio>
					<div class="progress-bar"></div>
					<div class="tool-bar"></div>
				</div>
			</div>
		</div>
		<div :style="{backgroundImage: 'url(' + song.picUrl + ')'}" class="blur"></div>
	</div>
</template>

<script>
import Back from './Back.vue'
const API_MUSICINFO = 'https://api.imjad.cn/cloudmusic/?type=detail&id=';
const API_MUSICPLAY = 'https://api.imjad.cn/cloudmusic/?type=song&id=';
const API_MUSICLYRIC = 'https://api.imjad.cn/cloudmusic/?type=lyric&id=';
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
        playSrc: null
      },
      linearStar: '#fff',
      linearEnd: '#000',
      isPlay: false,
      isLoadedInfo: false,
      isReady: false,
      isShowLyric: false
    }
  },
  components: {
    Back
  },
  computed: {
    singer: function () {
      let singner = '';
      this.song.singer.forEach(function (item) {
        singner += item.name + '/';
      })
      return singner.substring(0, singner.length - 1);
    }
  },
  watch: {
    'song.id': function (val, oldVal) {
      console.log(val, oldVal)
    },
    isPlay: function (val) {
      if (val) {
        this.audio.play();
      } else {
        this.audio.stop();
      }
    }
  },
  methods: {
    getSongInfo () {
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
      this.$http.get(API_MUSICPLAY + this.song.id).then(res => {
        let data = res.body;
        if (data.code === 200) {
          this.song.playSrc = data.data[0].url;
          // 监听audio是否可以播放
          if (this.audio !== null) {
            this.audio.load()
            if (this.audio.readyState > 1) {
              this.isPlay = true;
            }
          }
        }
      })
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
    // 获取歌曲信息
    this.song.id = this.$route.params.mid;
    this.getSongInfo();
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
			filter: blur(5px);
			background-position: center;
		}
		.player-head{
			position: relative;
			width: 100%;
			height: 1.173333rem;
			padding: 0.186667rem 0.266667rem;
			box-sizing: border-box;
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
				background-image: url('https://raw.githubusercontent.com/onepicse/vue/master/audio/src/components/audio/singlecover.png');
				background-repeat: no-repeat;
				background-size: 8.0rem;
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
			.progress-bar{
				width: 100%;
				height: 1.546667rem;
			}
			.tool-bar{
				width: 100%;
				height: 1.253333rem;
			}
		}
	}
</style>
