<template>
	<transition name="slider-category" mode="out-in">
		<div class="slider-category">
			<div class="slider-category-content">
				<div class="content-icon-broom">
					<button-image
					:data="broom"
					class="icon-close"
					 />
					<p class="text-broom">Limpiar</p>
				</div>
				<div>
					<button class="button-close-slider" @click="closeSlider">
						X
					</button>
				</div>
			</div>
			<section-category></section-category>
			<filters-category></filters-category>
			<section class="btn-section">
				<app-button
				action="Cerrar"
				background="white"
				color="red"
				class="btn-slider-category"
				type="button"></app-button>
				<app-button
				class="btn-slider-category ml-2"
				:background="globalColors.primary"
				action="Filtrar"
				type="button"></app-button>
			</section>
		</div>
	</transition>
</template>

<script>
import appButton from '@/components/shared/buttons/app-button';
import buttonImage from '@/components/shared/buttons/app-button-image';
import filtersCategory from '@/components/shared/category/filters-category';
import sectionCategory from '@/components/shared/category/section-category';

function closeSlider() {
	this.$emit('close', false);
}

function data() {
	return {
		broom: {
			image: '/static/img/icons/magic-broom.svg',
			name: 'Limpiar',
			height: 21,
		},
	};
}

export default {
	name: 'slider-category',
	data,
	methods: {
		closeSlider,
	},
	components: {
		appButton,
		buttonImage,
		filtersCategory,
		sectionCategory,
	},
};
</script>

<style lang="scss" scoped>
.slider-category {
	background-color: color(disabled);
	bottom: 0;
	height: 100vh;
	left: 0;
	position: fixed;
	right: 0;
	top: 0;
	width: 100%;
	z-index: 99;
}

.slider-category-responsive {
	background-color: color(border);
}

.text-broom {
	font-family: font(demi);
	font-size: size(small);
	margin: 0 0 0 10px;
}

.content-icon-broom {
	display: flex;
}

.button-close-slider {
	border: solid 1px color(dark);
	border-radius: 50%;
	color: color(dark);
	height: 28px;
	width: 28px;
}

.slider-category-content {
	align-items: center;
	border-bottom: 1px solid color(border);
	display: flex;
	justify-content: space-between;
	padding: 18px 20px;
}

.btn-section {
	align-items: center;
	border-top: 1px solid color(border);
	bottom: 0;
	display: flex;
	justify-content: center;
	padding: 24px 20px;
	position: absolute;
	width: 100%;
}

.btn-slider-category {
	font-family: font(bold);
	font-size: 13px;
	height: 39px;
	width: 150px;
}

.ml-2 {
	margin-left: 21px;
}
</style>
