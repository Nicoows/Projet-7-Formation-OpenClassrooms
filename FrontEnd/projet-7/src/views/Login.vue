<template>
  <!--<img src="../assets/Logo-Groupomania/logo-left-font-monochrome-black.png" class="logo">-->
  <div class="card text-center">
    <div class="card-body">
    <h1 class="card-title" v-if="mode == 'login'">Connexion</h1>
    <h1 class="card-title" v-else>Inscription</h1>
    <p class="card-subtitle" v-if="mode == 'login'">Tu n'as pas encore de compte ? <a href="#"><span class="card-action" @click="switchToCreateAccount()">Créer un compte</span></a></p>
    <p class="card-subtitle" v-else>Tu as déjà un compte ? <a href="#"><span class="card-action" @click="switchToLogin()">Se connecter</span></a></p>
    <div class="form-row spandown">
      <input v-model="email" class="form-row__input" type="text" placeholder="Adresse email" @change="regexEmail()"/>
      <span id="erreur-email"></span>
    </div>
    <div class="form-row spandown" v-if="mode == 'create'">
      <input v-model="prenom" class="form-row__input" type="text" placeholder="Prénom" @change="regexPrenom()"/>
      <span id="erreur-prenom"></span>
      <input v-model="nom" class="form-row__input" type="text" placeholder="Nom" @change="regexNom()"/>
      <span id="erreur-nom"></span>
    </div>
    <div class="form-row spandown">
      <input v-model="password" class="form-row__input" type="password" placeholder="Mot de passe" @change="regexPassword()" v-if="mode =='create'"/>
      <span id="erreur-mdp" v-if="mode == 'create'"></span>
      <input v-model="password" class="form-row__input" type="password" placeholder="Mot de passe" v-if="mode == 'login'"/>
    </div>
    <div class="form-row">
      <button class="btn btn-primary" :class="{'disabled' : !validatedFields}" @click="sendToLogin()" v-if="mode == 'login'">
        <span>Connexion</span>
      </button>
      <span id="erreur-connexion" v-if="mode == 'login'"></span>
      <button class="btn btn-primary" :class="{'disabled' : !validatedFields}" @click="createAccount()" v-else>
        <span>S'inscrire</span>
      </button>
      <span id="message-erreur" v-if="mode == 'create'"></span>
    </div>
    </div> 
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data: function () {
    return {
      mode: 'login',
      email: '',
      prenom: '',
      nom: '',
      password: ''
    }
  },
  computed: {
    validatedFields: function () {
      if (this.mode == 'create') {
        if (this.email != "" && this.prenom != "" && this.nom != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = 'create';
    },
    switchToLogin: function () {
      this.mode = 'login';
    },
    regexNom: function(){
      let nomRegExp = new RegExp ("^([a-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$", 'iu');

      let testNom = nomRegExp.test(this.nom);

      let span = document.getElementById("erreur-nom");

      if(!testNom) {
          span.innerHTML = "Nom non valide";
          span.classList.remove("text-success");
          span.classList.add("text-danger");
      } else {
        span.innerHTML = "";
      }
    },
    regexPrenom: function(){
      let prenomRegExp = new RegExp ("^([a-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$", 'iu');

      let testPrenom = prenomRegExp.test(this.prenom);

      let span = document.getElementById("erreur-prenom");

      if(!testPrenom) {
          span.innerHTML = "Prénom non valide";
          span.classList.remove("text-success");
          span.classList.add("text-danger");
      } else {
        span.innerHTML = "";
      }
    },
    regexEmail: function(){
      let emailRegExp = new RegExp ('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');

      let testEmail = emailRegExp.test(this.email);

      let span = document.getElementById("erreur-email");

      if(!testEmail) {
          span.innerHTML = "Email non valide";
          span.classList.remove("text-success");
          span.classList.add("text-danger");
      } else {
        span.innerHTML = "";
      }
    },
    regexPassword: function(){
      let passwordRegExp = new RegExp ('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$');

      let testPassword = passwordRegExp.test(this.password);

      let span = document.getElementById("erreur-mdp");

      if(!testPassword) {
          span.innerHTML = "Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule, 1 chiffre";
          span.classList.remove("text-success");
          span.classList.add("text-danger");
      } else {
        span.innerHTML = "";
      }
    },
    createAccount: function () {
      axios
      .post('http://localhost:3000/api/auth/signup', {
        name: this.prenom + ' ' + this.nom,
        email: this.email,
        password: this.password,

      }).then(()=>{
        this.sendToLogin()
      })
      .catch(()=>{
          let span = document.getElementById('message-erreur');
          span.innerHTML = "Adresse email déjà utilisée";
          span.classList.add("text-danger");
          console.log('Adresse email déjà utilisée');
      });
    },
    updateData(data) {
      // Stock les infos de connexion
      this.email = data.email;
      this.password = data.password;
    },
    sendToLogin: function(){
      axios
      .post('http://localhost:3000/api/auth/login',  this.$data)
      .then((data)=>{
        sessionStorage.setItem("token", data.data.token);
        axios.defaults.headers.common["Authorization"] =
            "Bearer " + data.data.token;
        console.log('Data envoyées');
        this.$router.push("Profile");
      })
      .catch(()=>{console.log('Data pas envoyées')
      let span = document.getElementById("erreur-connexion");
      span.innerHTML = "Les informations que vous venez de rentrer sont incorrect";
      span.classList.add("text-danger");
      sessionStorage.removeItem("token");
      });
    }
  },
  mounted(){
    if(localStorage.getItem('reload')){
      localStorage.removeItem('reload');
    } else {
      localStorage.setItem('reload', 1);
      window.location.reload();
    }
  }
}

</script>


<style>
  body{
    background-color: gray;
  }
  .card{
    width: 25rem;
    margin-left: auto;
    margin-right: auto;
  }
  .btn{
    width: 100%;
  }
  .form-row {
    display: flex;
    margin: 16px 0px;
    gap:16px;
    flex-wrap: wrap;
  }
  .form-row__input {
    padding:8px;
    border: none;
    border-radius: 8px;
    background:#f2f2f2;
    font-weight: 500;
    font-size: 16px;
    flex:1;
    min-width: 100px;
    color: black;
  }
  .form-row__input::placeholder {
    color:#aaaaaa;
  }
  .spandown{
    flex-direction: column;
  }
</style>
