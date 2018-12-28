<template>
	<footer class="footer" v-if="this.$store.getters.getShowFooter">
		<div class="box">
			<router-link class="item flex-1" tag="div" v-stat="{key:'CretMai', click:'CretMai'}" :to="indexHref">
				<a class="react">
					<img v-if="this.$route.meta.type !== 'my'" src="../../assets/image/Home_Icon_Home_Selected@2x.png" alt="">
					<img v-else src="../../assets/image/Home_Icon_Home_Default@2x.png" alt="">
					<p>首页</p>
				</a>
			</router-link>
			<router-link class="item flex-1" tag="div" v-stat="{key:'CretMy', click:'CretMy'}" to="/my">
				<a class="react">
					<img v-if="this.$route.meta.type === 'my'" src="../../assets/image/Home_Icon_Me_Selected@2x.png" alt="">
					<img v-else src="../../assets/image/Home_Icon_Me_Default@2x.png" alt="">
					<p>我的</p>
				</a>
			</router-link>
		</div>
	</footer>
</template>

<style lang="less">

</style>

<script>
export default {
    data() {
        return {
            indexHref:`/prodIntrod/${getLocalStorage('channelVal')}`
        };
    }
};
</script>
