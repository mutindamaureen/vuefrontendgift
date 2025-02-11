<template>
    <div class="page-product">
        <div class="columns is-multiline">
            <div class="column is-9">
                <figure class="image mb-6">
                    <img v-bind:src="product.image">
                </figure>
                <h1 class="title">{{product.name}}</h1>
                <p>{{product.description}}</p>
            </div>
            <div class="column is-3">
                <h2 class="subtitle">Information</h2>
                <p><strong>${{product.price}}</strong></p>
                <div class="field has-addons mt=6">
                    <div class="control">
                        <input type="number" class="input" min="1" v-model="quantity">
                    </div>
                    <div class="control">
                        <a class="button is-dark" @click="addToCart">Add to cart</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>

import axios from 'axios'
import {toast} from 'bulma-toast'

export default {
    name: 'Product',
    data() {
        return {
            product:{},
            quantity: 1   
        }
    },
    mounted() {
        this.getProduct()
    },
    methods: {
        getProduct(){

            const category_slug = this.$route.params.category_slug
            const product_slug = this.$route.params.product_slug

            console.log('Category Slug:', category_slug); // Debugging line
            console.log('Product Slug:', product_slug); 

            axios
                .get(`https://patient-radiance-production.up.railway.app/api/v1/products/${category_slug}/${product_slug}/`)
                .then(response =>{
                    this.product = response.data

                    document.title = this.product.name + '| gift-shop'
                })
                .catch(error =>{
                    console.log(error)
                })
        },
        addToCart(){
            console.log('addToCart')
            if (isNaN(this.quantity) || this.quantity < 1){
                this.quantity = 1
            }
            const item = {
                product: this.product,
                quantity: this.quantity
            }
            this.$store.commit('addToCart', item)

            toast({
                message: 'Product added to cart',
                type: 'is-success',
                dismissible: true,
                pauseOnHover: true,
                duration: 1500,
                position: 'top-right',
            })
        }

    },
}
</script>