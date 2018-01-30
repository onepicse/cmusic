<template>
	<div class="player">
		<div class="player-head"></div>
		<div class="palyer-content"></div>
	</div>
</template>

<script>
const API_MUSICINFO = 'https://api.imjad.cn/cloudmusic/?type=detail&id='
const API_MUSICPLAY = 'https://api.imjad.cn/cloudmusic/?type=song&id='
const API_MUSICLYRIC = 'https://api.imjad.cn/cloudmusic/?type=lyric&id='
export default {
  name: 'Player',
  data () {
    return {
      song: {
        id: null,
        name: null,
        singer: [],
        palySrc: null,
        picUrl: null
      },
      isPlay: false,
      isShowLyric: false,
      isReady: false
    }
  },
  components: {
  },
  computed: {
  },
  watch: {
  },
  beforeCreat () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    // 获取歌曲信息
    this.song.id = this.$route.params.mid;
    this.$http.jsonp(API_MUSICINFO + this.song.id)
    // 获取播放信息
    // 获取歌词信息
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
