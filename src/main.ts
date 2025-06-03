import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import chater from './components/chater.vue'
import FragmentedText from './components/FragementedText.vue'

const app=createApp(App)
app.component('chater',chater)
app.component('FragmentedText',FragmentedText)
app.mount('#app')
