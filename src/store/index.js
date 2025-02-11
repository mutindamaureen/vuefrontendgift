import { createStore } from 'vuex'

export default createStore({
  state: {
    cart:{
        items:[]
    },
    isAuthenticated: false,
    token: '',
    isLoading: false 
  },
  getters: {
    getToken(state) {
        return state.token;
      }
  },
  mutations: {
    initializeStore(state){
        if (localStorage.getItem('cart')){
            state.cart = JSON.parse(localStorage.getItem('cart'))
        }else{
            localStorage.setItem('cart', JSON.stringify(state.cart))
        }

        if (localStorage.getItem('token')){
            state.token = localStorage.getItem('token')
            state.isAuthenticated = true
        }else{
            state.token = ''
            state.isAuthenticated = false
        }
    },
    addToCart(state, item) {

        const exists = state.cart.items.find(i => i.product.id === item.product.id)

        if (exists){
            exists.quantity += item.quantity
        }else{
            state.cart.items.push(item)
        }
        localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    removeFromCart(state, item) {
        const index = state.cart.items.findIndex(i => i.product.id === item.product.id);
        if (index !== -1) {
            state.cart.items.splice(index, 1); // Remove item from cart
        }
        localStorage.setItem('cart', JSON.stringify(state.cart));
        // state.cart.items = state.cart.items.filter(i => i.product.id !== item.product.id); // Remove item from cart
        // localStorage.setItem('cart', JSON.stringify(state.cart));
    },

    setIsLoading(state, status){
        state.isLoading = status
    },
    setToken(state, token){
        state.token = token
        state.isAuthenticated = true
    },
    removeToken(state){
        state.token = ''
        state.isAuthenticated = false
    },
    clearCart(state) {
        state.cart = {items: []}

        localStorage.setItem('cart', JSON.stringify(state.cart))
    }
  },
  actions: {
    login({ commit }, token) {
        commit('setToken', token);
      },
    logout({ commit }) {
      // Clear the cart from the Vuex store
      commit('clearCart');
      localStorage.removeItem('authToken');
    },
  },
  modules: {
  }
})
