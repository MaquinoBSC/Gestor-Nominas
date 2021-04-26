<template>
  <div class="register">
      <h1>Crear Cuenta</h1>
      
      <form class="ui form" @submit.prevent="onRegister()">
        <div class="field">
          <input 
            :class="{error: formError.email}"
            type="text" 
            placeholder="Correo electronico" 
            v-model="formData.email"
          >
        </div>
        <div class="field">
          <input 
            :class="{error: formError.password}"
            type="password" 
            placeholder="Contraseña" 
            v-model="formData.password"
          >
        </div>
        <div class="field">
          <input 
            :class="{error: formError.repeatPassword}"
            type="password" 
            placeholder="Repetir contraseña" 
            v-model="formData.repeatPassword"
          >
        </div>
        <button type="submit" class="ui button positive fluid" :class="{loading}">Registrar</button>
      </form>
      <p @click="changeForm()">Iniciar Sesion</p>
  </div>
</template>

<script>
    import {ref} from 'vue';
    import * as Yup from 'yup';
    import {auth} from '../../utils/firebase.js';


    export default {
      name: "Login",
      props: {
        changeForm: Function,
      },
      setup(){
        let formData= {}
        let formError= ref({});
        let loading= ref(false);

        const schemeForm= Yup.object().shape({
          email: Yup.string().email(true).required(true),
          password: Yup.string().required(true),
          repeatPassword: Yup.string().required(true).oneOf([Yup.ref("password")], true)
        })

        const onRegister= async()=> {
          loading.value= true;
          formError.value= {};
          try {
            await schemeForm.validate(formData, {abortEarly: false})
            try {
              const {email, password}= formData;
              await auth.createUserWithEmailAndPassword(email, password);

            } catch (error) {
              console.log(error);
            }
          } catch (error) {
            console.log(error);
            error.inner.forEach((err)=> {
              formError.value[err.path]= err.message;
            })
          }
          loading.value= false;
        }

        return {
          formData, onRegister, formError, loading
        }
      }
    }
</script>

<style lang="scss" scoped>
  .register{
    background-color: #fff;
    padding: 30px;
    box-shadow: 0px 0px 38px -5px rgba(0,0,0,0.45);
    width: 400px;
    border-radius: 15px;

    h1 {
      text-align: center;
      margin-bottom: 30px;
    }

    form {
      button {
        width: 100%;
      }

      input.error {
        border-color: #faa;
        background-color: #ffeded;
      }
    }

    p {
      text-align: center;
      margin-top: 30px;

      &:hover {
        cursor: pointer;
        opacity: 0.6;
      }
    }
  }
</style>