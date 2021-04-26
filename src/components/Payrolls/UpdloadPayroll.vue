<template>
  <div class="load-payroll">
      <button class="ui button primary" @click="showCloseForm()">Nueva Nomina</button>
      <form class="ui form upload-payroll__form" :class="{open: showForm}" @submit.prevent="handleSubmit()">
          <div class="field">
              <label for="file" class="ui icon button">
                  <i class="file icon" />
                  Seleccionar nomina
                  <span v-if="file">{{file.name}}</span>
              </label>
              <input type="file" id="file" style="display: none" @change="upLoadFile">
          </div>
          <div class="field">
              <div class="ui calendar">
                  <div class="ui input left icon">
                      <input type="date" @change="changeDate" :value="date">
                  </div>
              </div>
          </div>
          <p v-if="error">{{error}}</p>
          <button class="ui button positive" :class="{loading}">Subir Nomina</button>
      </form>
  </div>
</template>

<script>
import {ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import {storage, auth, db} from '../../utils/firebase';


export default {
    name: "UploadPayroll",
    props: {
        getPayrolls: Function
    },
    setup(props){
        let showForm= ref(false);
        let file= ref(null);
        let date= ref(null);
        let loading= ref(false);
        let error= ref(null);

        const showCloseForm= ()=> {
            showForm.value= !showForm.value;
        }

        const upLoadFile= (evt)=> {
            error.value= null;

            const fileTemp= evt.target.files[0];
            if(fileTemp.type === "application/pdf"){
                file.value= fileTemp;
            }
            else{
                file.value= null;
                error.value= "Fichero no valido"
            }
        }

        const changeDate= (evt)=> {
            date.value= evt.target.value;
        }

        const handleSubmit= async()=> {
            loading.value= true;

            if(!file.value){
                error.value= "Selecciona un archivo";
                return
            }
            if(!date.value){
                error.value= "Selecciona una fecha";
                return
            }
            if(file.value && date.value){
                try {
                    const nameFile= uuidv4();
                    await storage.ref(auth.currentUser.uid).child(`${nameFile}.pdf`).put(file.value);

                    const payrollURL= await storage.ref(`${auth.currentUser.uid}/${nameFile}.pdf`).getDownloadURL();
                    await db.collection(auth.currentUser.uid).add({
                        payrollURL: payrollURL,
                        date: new Date(date.value),
                        dateString: date.value,
                    });
                    props.getPayrolls();
                } catch (error) {
                    console.log(error);
                }

            }
            showForm.value= false;
            file.value= null;
            date.value= null;
            loading.value= false;
            error.value= false;
            document.getElementById("file").value= "";
        }

        return {
            showForm, file, date, loading, error, 
            showCloseForm, upLoadFile, changeDate, handleSubmit
        }
    }
}
</script>

<style lang="scss" scoped>
    .upload-payroll {
        &__form {
            margin-top: 30px;
            display: flex;
            align-items: center;
            flex-direction: column;
            height: 0;
            overflow: hidden;
            transition: height 0.9s ease;

            &.open {
                height: 200px;
            }
        }
    }
</style>