<template>
    <div class="page-my-account">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">My account</h1>
            </div>
            <div class="column is-12">
                <button @click="logout()" class="button is-danger">Log out</button>
            </div>
            <hr>
           <div class="column is-12">
                <h2 class="subtitle">
                    My Orders
                </h2>
                <OrderSummary
                    v-for="order in orders" :key="order.id" :order="order"/>
            </div> 
        </div>
    </div>

</template>
<script>

import OrderSummary from '@/components/OrderSummary.vue'
import axios from 'axios'

export default{
    name: 'MyAccount',
    components:{
        OrderSummary
    },
    data(){
        return {
            orders: []
        }
    },
    mounted(){
        this.getMyOrders();
    },
    methods: {
        logout(){
            axios.defaults.headers.common['Authorization'] = ""

            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("userid")
            localStorage.removeItem('cart');

            this.$store.commit('removeToken')
            this.$store.commit('clearCart');

            this.$router.push('/')
        },
        getMyOrders(){
            const token = localStorage.getItem("auth_token");
            axios
                .get(`https://patient-radiance-production.up.railway.app/api/v1/orders`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                })
                .then(response =>{
                    this.orders = response.data
                })
                .catch(error =>{
                    console.log(error)
                })
        }

    },
}
</script>