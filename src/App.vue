<template>
    <div id="wrapper">
        <nav class="navbar is-dark">
            <div class="navbar-brand">
                <router-link to="/" class="navbar-item"><strong>Gift Shop</strong></router-link>

                <a class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu" @click="showMobileMenu = !showMobileMenu">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div class="navbar-menu" id="navbar-menu" v-bind:class="{'is-active': showMobileMenu}">
                <div class="navbar-end">
                    <router-link to="/" class="navbar-item"><strong>Home</strong></router-link>

                    <div class="navbar-item">
                        <form methods="get" action="/search">
                            <div class="field has-addons">
                                <div class="control">
                                    <input type="text" class="input" placeholder="search here..." name="query" 
                                    @keyup.enter="performSearch"/>
                                </div>
                                <div class="control">
                                    <button class="button is-success">
                                        <span class="icon">
                                            <i class="fas fa-search"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="navbar-item">
                        <div class="buttons">
                            <template v-if ="$store.state.isAuthenticated">
                                <router-link to="/my-account" class="button is-light">My account</router-link>
                            </template>

                            <template v-else>
                                <router-link to="/log-in" class="button is-light">Login</router-link>
                            </template>
                            <router-link to="/cart" class="button is-success">
                                <span class="icon"><i class="fas fa-shopping-cart"></i></span>
                                <span>Cart({{cartTotalLength}})</span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>


        </nav>

        
        <section class="section">
            <router-view/>
        </section>
        <footer class="footer">
            <p class="has-text-centered">copyright 2025 &copy;</p>
        </footer>

    </div>

</template>

<script>
import axios from 'axios';

export default{
    data(){
        return{
            showMobileMenu: false,
            cart:{
                items:[]
            },
            isAdmin: false,
            adminUrl: 'https://patient-radiance-production.up.railway.app/admin/'
        }
    },
    beforeCreate() {
        try {
            this.$store.commit('initializeStore');
        } catch (error) {
            console.error('Error initializing store:', error);
        }

        const token = this.$store.state.token

        if (token){
            axios.defaults.headers.common['Authorization'] = "Token" + token
        }else{
            axios.defaults.headers.common['Authorization'] = "" 

        }
    },
    mounted() {
        this.cart = this.$store.state.cart  
    },
    computed: {
        cartTotalLength(){
            let totalLength = 0

            for (let i=0; i<this.cart.items.length; i++){
                totalLength += this.cart.items[i].quantity || 0
            }
            return totalLength
        }
    },
    created() {
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    },
    methods: {
        logout() {
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('token');
            this.$router.push('/login');
        }
    }

}

</script>

<style lang="scss">
@import '../node_modules/bulma';
</style>
