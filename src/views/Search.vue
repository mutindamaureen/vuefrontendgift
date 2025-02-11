<template>
    <div class="page-search">
        <div class="columns is-multiline">
             <div class="column is-12">
                 <h2 class="is-size-2 has-text-centered">Search term: "{{query}}"</h2>
             </div>
             <div v-if="products.length === 0 && !loading">No products found.</div>
             <div class="column is-3" v-for="product in products" :key="product.id">
                 <div class="box">
                     <figure class="image mb-4">
                         <img :src="product.get_thumbnail">
                     </figure>
                     <h3 class="is-size-4">{{product.name}}</h3>
                     <p class="is-size-6 has-text-grey">${{product.price}}</p>
                     <router-link :to="product.get_absolute_url" class="button is-dark mt-4">View Details</router-link>
                 </div>
             </div>
         </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    name: 'Search',
    data() {
        return {
            products: [],
            query: '',
            loading: false
        }
    },
    // created() {
        // let uri = window.location.search.substring(1);
        // let params = new URLSearchParams(uri);

        // if (params.get('query')) {
            // this.query = params.get('query');
            // this.performSearch();
        // }
    // },
    mounted() {
        let uri = window.location.search.substring(1)
        let params = new URLSearchParams(uri)

        if (params.get('query')){
            this.query = params.get('query')

            this.performSearch()
        }
    },
    methods: {
        performSearch(){
            this.loading = true;
            axios
                .post(`http://127.0.0.1:8000/api/v1/products/search`, {'query':this.query})
                .then((response) => {
                    this.products = response.data
                }).catch((err) => {
                    console.log(err)
                });
        }
    },
}
</script>