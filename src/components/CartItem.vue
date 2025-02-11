<template>
    <tr>
        <td><router-link to="item.product.get_absolute_url">{{item.product.name}}</router-link></td>
        <td>{{item.product.price}}</td>
        <td>
            {{item.quantity}}
            <a @click="decrementQuantity(item)">-</a>
            <a @click="incrementQuantity(item)">+</a>
        </td>
        <td>${{getItemTotal(item).toFixed(2)}}</td>
        <td><button class="delete" @click="removeFromCart(item)"></button></td>
    </tr>
</template>

<script>
export default {
    name: 'CartItem',
    props:{
        initialItem:{
            type: Object,
            required: true
        }
    },
    data() {
        return {
            item: this.initialItem
        }
    },
    methods: {
        getItemTotal(item){
            // const price = item.product.price || 0;
            // const quantity = item.quantity || 0; // Default to 0 if undefined
            // return price * quantity;
            return item.quantity * item.product.price
        },
        decrementQuantity(item){

            if (item.quantity > 0){
                item.quantity -= 1
            }else{
                this.removeFromCart(item)
            }
            this.updateCart()

        },
        incrementQuantity(item) {

            item.quantity += 1

            this.updateCart()
        },
        updateCart(){
            // this.$store.commit('addToCart', this.item); 
            localStorage.setItem('cart', JSON.stringify(this.$store.state.cart));
        },

        removeFromCart(item){
            this.$store.commit('removeFromCart', item);
            // localStorage.setItem('cart', JSON.stringify(this.$store.state.cart));  

            // this.$emit('removeFromCart', item)

        }
    },
}
</script>