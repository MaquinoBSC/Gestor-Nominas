<template>
  <template v-if="user">
    <router-view/>
  </template>
  <Auth  v-if="!user && user !== undefined" />
</template>
<script>
  import {onMounted, computed} from 'vue';
  import {useStore} from 'vuex';
  import {auth} from './utils/firebase';
  import Auth from './views/Auth';

  export default{
    name: "App",
    components:{
      Auth
    },
    setup(){
      const store= useStore();
      const user= computed(()=> store.state.user);


      onMounted(()=> {
        auth.onAuthStateChanged((user)=>{
          store.commit("setUser", user);
        });
      });


      return {
        user,
      }
    }
  }

</script>
<style lang="scss" scoped>
  .auth {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background:  rgb(4,78,157);
    background: linear-gradient(
      0deg,
      rgba(4,78,157, 1) 0%,
      rgba(0,174,255,1) 100%
    );
  }
</style>

