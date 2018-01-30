<template>
	<i @click.stop="back" class="iconfont icon-back back"></i>
</template>

<script>
export default {
  name: 'bakc',
  data () {
    return {
    }
  },
  methods: {
    back () {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="less">
	.back{
		display: inline-block;
		vertical-align: middle;
		width: 0.8rem;
		height: 0.8rem;
		font-size: 0.8rem;
		line-height: 1;
		color: #fff;
	}
</style>
