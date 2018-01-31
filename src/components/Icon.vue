<template>
	<i :class="'iconfont icon-' + iconName"></i>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    iconName: String
  }
}
</script>

<style lang="less">
	.iconfont{
		font-size: 1.5em;
		line-height: 1;
		color: #fff;
	}
</style>
