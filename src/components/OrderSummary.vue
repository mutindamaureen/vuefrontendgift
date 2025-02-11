<template>
    <div class="box mb-4">
        <h2 class="is-size-3 has-text-centered">Order {{ order.id }}</h2>
        <h4 class="is-size-5">Products</h4>
            <table class="table is-fullwidth">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Order Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="order.items.length === 0">
                        <td colspan="4" class="has-text-centered">No items in this order.</td>
                    </tr>
                    <tr
                    v-for="item in order.items"
                    v-bind:key="item.product.id"
                    >
                        <td>{{ item.product.name }}</td>
                        <td>{{ item.product.price }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>${{ getItemTotal(item).toFixed(2) }}</td>
                        <td>{{ item.product.created_at }}</td>
                    </tr>
                </tbody>
            </table>
    </div>
</template>
<script>
export default {
    name: 'OrderSummary', 
    props:{
        order: Object
    },
    methods: {
        getItemTotal(item){
            return item.quantity * item.product.price
        },
        orderTotalLength(order){
            return this.order.items.reduce((acc, curVal) =>{
                return acc += (curVal.quantity || 0)
            }, 0)
        },
    }
}
</script>