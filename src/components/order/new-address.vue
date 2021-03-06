<template>
	<form class="new-address-form" @input="setCustomerAddress">
		<app-input
			placeholder="Alias"
			class="mx-2 my-1 name-field field"
			v-model="newAddress.name"
		>
			<span v-if="$v.newAddress.name.$invalid">El alias es requerido</span>
		</app-input>
		<app-select
			item-text="name"
			item-value="id"
			:placeholder="countryLabels.department"
			class="mx-2 my-1 department-field field"
			:items="departments"
			v-model="newAddress.department"
			@input="selectDepartment"
		>
			<span v-if="$v.newAddress.department.$invalid">El {{countryLabels.department}} es requerido</span>
		</app-select>
		<app-select
			item-text="name"
			item-value="id"
			:placeholder="countryLabels.province"
			class="mx-2 my-1 province-field field"
			:items="provinces"
			:disabled="!newAddress.department"
			@input="selectProvince"
			v-model="newAddress.province"
		>
			<span v-if="$v.newAddress.province.$invalid">La {{countryLabels.province}} es requerida</span>
		</app-select>
		<app-select
			item-text="name"
			item-value="id"
			:placeholder="countryLabels.district"
			class="mx-2 my-1 district-field field"
			:items="districts"
			:disabled="!newAddress.department"
			v-model="newAddress.district"
		>
			<span v-if="$v.newAddress.district.$invalid">El {{countryLabels.district}} es requerido</span>
		</app-select>
		<app-input
			placeholder="Dirección"
			class="mx-2 my-1 address-field field"
			v-model="newAddress.addressLine1"
		>
			<span v-if="$v.newAddress.addressLine1.$invalid">La dirección es requerida</span>
		</app-input>
		<app-input
			placeholder="Nro"
			class="mx-2 my-1 number-field field"
			v-model="newAddress.number"
		>
			<span v-if="$v.newAddress.number.$invalid">El número es requerido</span>
		</app-input>
		<app-input
			placeholder="Referencia"
			type="email"
			class="mx-2 my-1 reference-field field"
			v-model="newAddress.reference"
		>
			<span v-if="$v.newAddress.reference.$invalid">La referencia es requerida</span>
		</app-input>
	</form>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import appInput from '@/components/shared/inputs/app-input';
import appSelect from '@/components/shared/inputs/app-select';

function created() {
	this.$store.dispatch('LOAD_DEPARTMENTS', this);
}

function selectDepartment(id) {
	this.newAddress.province = null;
	this.newAddress.district = null;
	this.$store.commit('SET_PROVINCES', []);
	this.$store.commit('SET_DISTRICTS', []);
	this.calculateShippingCost(id);
	this.$store.dispatch('LOAD_PROVINCES', { context: this, provinceId: id });
	this.setCustomerAddress();
}

function selectProvince(id) {
	this.newAddress.districts = null;
	this.$store.commit('SET_DISTRICTS', []);
	this.$store.dispatch('LOAD_DISTRICTS', { context: this, cityId: id });
	this.setCustomerAddress();
}

async function calculateShippingCost(provinceId) {
	const url = '/weight/price';
	const body = this.buildBody(provinceId);
	try {
		const { data: amount } = await this.$httpProducts.post(url, body);
		this.$store.dispatch('setShippingCost', amount);
	} catch (error) {
		if (error.data.message === 'PRICE_NOT_CONFIGURATION') {
			this.$store.dispatch('setNoShippingCost');
			this.showNotification('No es posible hacer envios a ese destino.', 'error');
		}
	}
}

function buildBody(provinceId) {
	const details = this.getProductToBuy.map((p) => {
		const newP = {};
		newP.weight = p.weigth || 0;
		newP.quantity = p.quantity;
		return newP;
	});
	return {
		details,
		provinceId,
	};
}

function setCustomerAddress() {
	if (this.$v.$invalid) {
		this.$store.commit('SET_CUSTOMER_ADDRESS', null);
	} else {
		const newAddress = {
			addressLine1: this.newAddress.addressLine1,
			cityId: this.newAddress.province,
			name: this.newAddress.name,
			number: this.newAddress.number,
			parishId: this.newAddress.district,
			provinceId: this.newAddress.department,
			reference: this.newAddress.reference,
		};
		this.$store.commit('SET_CUSTOMER_ADDRESS', newAddress);
	}
}

function validations() {
	return {
		newAddress: {
			addressLine1: { required },
			department: { required },
			district: { required },
			name: { required },
			number: { required },
			province: { required },
			reference: { required },
		},
	};
}


function data() {
	return {
		newAddress: {
			addressLine1: '',
			department: null,
			district: null,
			name: '',
			number: '',
			province: null,
			reference: '',
		},
	};
}

export default {
	name: 'new-address',
	components: {
		appInput,
		appSelect,
	},
	computed: {
		...mapGetters([
			'departments',
			'districts',
			'getProductToBuy',
			'provinces',
		]),
	},
	created,
	data,
	methods: {
		buildBody,
		calculateShippingCost,
		selectDepartment,
		selectProvince,
		setCustomerAddress,
	},
	validations,
};
</script>
<style lang="scss" scoped>
	.new-address-form {
		align-items: center;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 20px;
	}

	.field {
		height: 68px;
	}

	.name-field,
	.department-field {
		flex: 1 1 48%;
	}
	
	.district-field,
	.province-field {
		flex: 1 1 40%;
	}

	.address-field {
		flex: 1 1 75%;
	}

	.number-field {
		flex: 1 1 20%;
	}

	.reference-field {
		flex: 60%;
	}
</style>
