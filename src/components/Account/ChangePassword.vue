<template>
  <form class="ui form change-password" @submit.prevent="onChangePassword">
      <div class="three fields">
          <div class="field">
                <input 
                    type="password" 
                    placeholder="Contraseña actual" 
                    v-model="formData.oldPassword"
                    :class="{error: formError.oldPassword}"
                >
          </div>
          <div class="field">
                <input 
                    type="password" 
                    placeholder="Nueva contraseña" 
                    v-model="formData.newPassword"
                    :class="{error: formError.newPassword}"
                >
          </div>
          <div class="field">
                <input 
                    type="password" 
                    placeholder="Repite contraseña" 
                    v-model="formData.repeatPassword" 
                    :class="{error: formError.repeatPassword}"
                >
          </div>
      </div>
      <p v-if="messageError">{{messageError}}</p>
      <button class="ui button primary" type="submit" :class="{loading}">Actualizar</button>
  </form>
</template>

<script>
import * as Yup from 'yup';
import {ref} from 'vue';
import {auth} from '../../utils/firebase';
import {reAuthenticate} from '../../utils/firebaseFunctions';


export default {
    name: "ChangePassword",
    setup(){
        let formData= {};
        let formError= ref({});
        let messageError= ref("");
        let loading= ref(false);


        const schemeForm= Yup.object().shape({
            oldPassword: Yup.string().required(true),
            newPassword: Yup.string().required(true),
            repeatPassword: Yup.string().required(true).oneOf([Yup.ref("newPassword")], true),
        })

        const onChangePassword= async()=> {
            loading.value= true;
            formError.value= {};
            messageError.value= "";

            try {
                await schemeForm.validate(formData, {abortEarly: false});
                try {
                    const {oldPassword, newPassword} = formData;
                    await reAuthenticate(oldPassword);
                    await auth.currentUser.updatePassword(newPassword);
                    auth.signOut();
                } catch (error) {
                    console.log(error);
                    messageError.value= error.message;
                }
            } catch (err) {
                err.inner.forEach((error)=> {
                    formError.value[error.path]= error.message
                });
            }
            console.log(formData);
            console.log(formError.repeatPassword);
            loading.value= false;
        } 


        return{
            formData, formError, messageError, onChangePassword, loading
        }
    }
}
</script>

<style lang="scss" scoped>
    .ui.form.change-password {
        text-align: center;

        input.error {
            border-color: #faa;
            background-color: #ffeded;
        }

        .ui.button {
            margin: 20px 0 0 0;
        }
    }
</style>