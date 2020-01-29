<template>
	<div class="title">
		<h1>{{title}}</h1>
		<p v-if="description">{{description}}</p>
		<slot name="description"></slot>
	</div>
</template>

<script>
  export default {
    name: "Title",
		props: {
      title: String,
			description: String
		}
  }
</script>

<style scoped>
	.title {
		width: 100%;
		background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0) 60%, #fff), linear-gradient(70deg, #dbedff 32%, #ebfff0);
		min-height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h1 {
		margin: 30px 0;
		font-size: 30px;
		font-weight: 400;
	}
</style>
