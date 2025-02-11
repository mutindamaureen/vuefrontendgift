<template>
    <div class="page-my-account">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Checkout</h1>
            </div>
            <div class="column is-12 box">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in cart.items" v-bind:key="item.product.id">
                            <td>{{ item.product.name}}</td>
                            <td>{{ item.product.price}}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ getItemTotal(item).toFixed(2) }} </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2">Total</td>
                            <td>{{ cartTotalLength }}</td>
                            <td>${{ cartTotalPrice.toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="column is-12">
                <h1 class="subtitle">Shipping Details</h1>
                <p class="has-text-grey mb-4">*All fields are required</p>
                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>First name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="first_name">
                            </div>
                        </div>
                        <div class="field">
                            <label>Last name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="last_name">
                            </div>
                        </div>
                        <div class="field">
                            <label>E-mail*</label>
                            <div class="control">
                                <input type="email" class="input" v-model="email">
                            </div>
                        </div>
                    </div>
                    <div class="column is-6">
                        <div class="field">
                            <label>Phone*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="phone">
                            </div>
                        </div>
                        <div class="field">
                            <label>Address*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address">
                            </div>
                        </div>
                        <div class="field">
                            <label>Place*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="place">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p 
                     v-for="error in errors" 
                        v-bind:key="error"
                        >
                        {{error}}</p>
                </div><hr>
                <div id="card-element" class="mb-5"></div>
                <hr>
                <template v-if="cartTotalLength">
                    <button class="button is-dark" @click="submitForm">Pay with stripe</button>
                </template>
            </div>
        </div>
    </div>
    </template>
    
    <script>
    import axios from 'axios'
    
    export default{
        name: 'Checkout',
        data(){
            return{
                cart:{
                    items:[]
                },
                stripe:{},
                card:{},
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                address: '',
                place: '',
                errors: []
            }
        },
        mounted(){
            this.cart = this.$store.state.cart
    
            if(this.cartTotalLength > 0){
                this.stripe = Stripe('pk_test_51Qov3RKVohXcPECSnAfbcDRkVo6lm1vvkg5dHWzCziXRSmWOGA8EVqlQhCyJ4TeAhZTEU6JTGDchGBA3ZmJ9Bo4W00Kn2XJ6aw')
                const elements = this.stripe.elements();
                this.card = elements.create('card', { hidePostalCode: true})
    
                this.card.mount('#card-element')
            }
        },
        methods:{
            getItemTotal(item){
                const price = item.product.price || 0;
                const quantity = item.quantity || 0;
                return (price * quantity);
                // return item.quantity * item.product.price
                
            },
            submitForm(){
                this.errors = []
                const token = localStorage.getItem('auth_token');
                if (!this.isAuthenticated) {
                    this.errors.push('Authentication token is missing or expired. Please log in again.');
                    return;
                }
                // if (!token) {
                    // this.errors.push('Authentication token is missing or expired. Please log in again.');
                    // return; // Stop execution if the token is not available
                // }
    
                if (this.first_name === ''){
                    this.errors.push('The first name is missing')
                }
                if (this.last_name === ''){
                    this.errors.push('The last name is missing')
                }
                if (this.email === ''){
                    this.errors.push('The email is missing')
                }
                if (this.phone === ''){
                    this.errors.push('The phone is missing')
                }
                if (this.address === ''){
                    this.errors.push('The address is missing')
                }
                if (this.place === ''){
                    this.errors.push('The place is missing')
                }
    
                if (!this.errors.length){
                    // this.$store.commit('setIsLoading', true)
    
                    this.stripe.createToken(this.card)
                    .then(result =>{
                        if (result.error){
                            // this.$store.commit('setIsLoading', false)
    
                            this.errors.push('something went wrong >< Try again')
    
                            console.log(result.error.message)
                            
                        }else{
                            this.stripeTokenHandler(result.token, token)
                        }
                    })
                }
            },
            stripeTokenHandler(stripeToken){
                const items = []
    
                for (let i=0; i<this.cart.items.length; i++){
                    const item = this.cart.items[i]
    
                    if (item.product && item.product.id && item.product.price) {
                        const obj = {
                            product: item.product.id,
                            quantity: item.quantity,
                            price: item.product.price * item.quantity
                        }
                        items.push(obj)
                    }else{
                        this.errors.push('Invalid product data detected')
                        return;
                    }
                }
    
                const data = {
                    'first_name':this.first_name,
                    'last_name': this.last_name,
                    'email': this.email,
                    'address': this.address,
                    'place': this.place,
                    'phone': this.phone,
                    'items': items,
                    'stripe_token': stripeToken.id
    
                }
                const token = localStorage.getItem('auth_token');
    
                axios
                    .post('http://127.0.0.1:8000/api/v1/checkout/', data,  {
                            headers: {
                                'Authorization': `Token ${token}`  
                            }
                        })
                    .then(response =>{
                        console.log(response);
                        this.$store.commit('clearCart')
                        this.$router.push('/cart/success')
                    })
                    .catch(error => {
                        this.errors.push('something went wrong. Try again')
                        console.log(error)
                    })
                    // this.$store.commit('setIsLoading', false)
            }
        },
        computed:{
            cartTotalLength(){
                return this.cart.items.reduce((acc, curVal) =>{
                    return acc += curVal.quantity
                }, 0)
            },
            cartTotalPrice(){
                return this.cart.items.reduce((acc, curVal) =>{
                    const price = curVal.product.price || 0; 
                    return acc + (price * (curVal.quantity || 0));
                    // return acc += curVal.product.price * curVal.quantity
                }, 0)
            }
        }
    }
    </script>
    