<template>
<div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-md">
        <a class="navbar-brand" href="http://localhost:8080/Profile#/Post">Accueil</a>
        <a class="navbar-brand" href="#" @click="disconnect()">Se déconnecter</a>
    </div>
    </nav>
    <div class="profil"> 
        <h1>Votre profil</h1>
    </div>
    <div class="card mb-3" style="width: 80%;">
    <div class="row g-0 box-info-profil d-flex">
        <img :src="user.avatar" class="img-fluid rounded-circle img-profil" alt="">
        <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" v-if="mode == 'modify'">
        <div class="col-md-8">
        <div class="card-body">
            <h5 class="card-title" v-if="mode == 'profil'">{{this.name}}</h5>
            <span v-if="mode == 'modify'">Nom et prénom:</span>
            <input v-model="name" class="form-row__input" type="text" v-if="mode == 'modify'" @change="regexNom()"/>
            <span id="erreur-nom"></span>
            <p class="card-text" v-if="mode == 'profil'">{{this.description}}</p>
            <div>
                <p v-if="mode == 'modify'">Description:</p>
                <textarea v-model="description" class="form-control" id="description" rows="3" v-if="mode == 'modify'"></textarea>
                <span id="erreur-desc"></span>
            </div>
            <span v-if="mode == 'modify'">Email:</span>
            <input v-model="email" class="form-row__input mt-2" type="text" v-if="mode == 'modify'" @change="regexEmail()"/>
            <span id="erreur-email"></span>
            <div>
                <span v-if="mode == 'modify'">Mot de passe:</span>
                <input v-model="password" class="form-row__input mt-2" type="password" placeholder="Mot de passe actuel" v-if="mode == 'modify'" @change="regexPassword()"/>
                <span id="erreur-mdr"></span>
                <input v-model="newPassword" class="form-row__input mt-2" type="password" placeholder="Nouveau Mot de passe" v-if="mode == 'modify'" @change="regexPassword()"/>
                <span id="erreur-mdr"></span>
            </div>
            <div class="box-btn-valid">
            <button type="button" class="btn btn-primary w-25 btn-valider" id="btn-valid-regex" v-if="mode == 'modify'" @click="modifyUser(), switchToProfil()">valider</button>
            </div>
        </div>
        </div>
    </div>
    <div class="box-btn">
        <button type="button" class="btn btn-outline-dark btn-modif" @click="switchToModify()" v-if="mode =='profil'">Modifier son profil</button>
        <button type="button" class="btn btn-outline-danger btn-delete" @click="deleteUser()" v-else>Supprimer son compte</button>
    </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'Profile',
        data(){
            return{
                mode: 'profil',
                user: '',
                description: '',
                name: '',
                email: '',
                newPassword: '',
                avatarUrl: '',
                admin: ''
            }
        },
        
        methods: {
            switchToModify: function(){
                this.mode = 'modify';
            },
            switchToProfil: function(){
                this.mode = 'profil';
            },
            regexNom: function(){
                let nomRegExp = new RegExp ("^([a-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$", 'iu');

                let testNom = nomRegExp.test(this.name);

                let span = document.getElementById("erreur-nom");
                let btn = document.getElementById("btn-valid-regex");

                if(!testNom) {
                    span.innerHTML = "Nom non valide";
                    span.classList.remove("text-success");
                    span.classList.add("text-danger");
                    btn.classList.add("disabled");
                } else {
                    span.innerHTML = "";
                    btn.classList.remove("disabled");
                }
            },
            regexEmail: function(){
                let emailRegExp = new RegExp ('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');

                let testEmail = emailRegExp.test(this.email);

                let span = document.getElementById("erreur-email");
                let btn = document.getElementById("btn-valid-regex");

                if(!testEmail) {
                    span.innerHTML = "Email non valide";
                    span.classList.remove("text-success");
                    span.classList.add("text-danger");
                    btn.classList.add("disabled");
                } else {
                    span.innerHTML = "";
                    btn.classList.remove("disabled");
                }
            },
            regexDesc: function(){
                let descRegExp = new RegExp ('^[a-zA-Z0-9.-_]$', 'g');

                let testDesc = descRegExp.test(this.desc);

                let span = document.getElementById("erreur-desc");
                let btn = document.getElementById("btn-valid-regex");

                if(!testDesc) {
                    span.innerHTML = "Email non valide";
                    span.classList.remove("text-success");
                    span.classList.add("text-danger");
                    btn.classList.add("disabled");
                } else {
                    span.innerHTML = "";
                    btn.classList.remove("disabled");
                }
            },
            regexPassword: function(){
                let passwordRegExp = new RegExp ('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$');

                let testPassword = passwordRegExp.test(this.password);

                let span = document.getElementById("erreur-mdp");
                let btn = document.getElementById("btn-valid-regex");

                if(!testPassword) {
                    span.innerHTML = "Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule, 1 chiffre";
                    span.classList.remove("text-success");
                    span.classList.add("text-danger");
                    btn.classList.add("disabled");
                } else {
                    span.innerHTML = "";
                    btn.classList.remove("disabled");
                }
            },
            sendAvatar: function(){
                axios
                .get('http://localhost:3000/api/profile/profile', {
                
                }).then((data)=>{this.user = data.data[0];
                this.name = this.user.name;
                this.email = this.user.email;
                this.description = this.user.description;
                })
                .catch(()=>{this.$router.push("/")});
            },
            disconnect: function(){
                sessionStorage.removeItem("token");
                this.$router.push("/");
            },
            deleteUser: function(){
                axios
                .delete('http://localhost:3000/api/profile/delete', {

                }).then(() =>{
                sessionStorage.removeItem("token");
                this.$router.push("/");
                })
                .catch((error) => {console.log(error)});
            },
            modifyUser: function(){
                console.log(document.getElementById("avatar").files[0]);
                const formData = new FormData();
                formData.append("description", this.description);
                formData.append("name", this.name);
                formData.append("email", this.email);
                formData.append("password", this.password);
                formData.append("newPassword", this.newPassword);
                formData.append("avatar", document.getElementById("avatar").files[0]);
                console.log(formData.values());
                axios
                .put('http://localhost:3000/api/profile/modify', formData)
                .then(() => {console.log('description envoyé');})
                .catch(() => {console.log('description non evnoyé');});
            },
            getUserId: function(){
                axios
                .get('http://localhost:3000/api/auth/get/userId', {

                })
                .then((data)=>{
                    this.userId = data.data[0].userId;
                    this.admin = data.data[0].admin;
                    console.log(this.userId, this.admin);
                    })
                .catch(()=>{console.log("userId pas récupéré")});
            },
        },
        mounted(){
            this.sendAvatar(),
            this.getUserId()
        }
    }
</script>

<style>
.profil{
    text-align: center;
    padding: 10px;
}
#avatar{
    padding: 10px;
}
.btn-delete, .btn-modif{
    width: 40%;
    margin: 10px;
}
.box-btn{
    display: flex;
    justify-content: space-around;
}
.btn-valider{
    margin-right: auto;
    margin-left: auto;
}
.img-profil{
    width: 25%;
    margin: 10px;
}
@media screen and (max-width: 426px)
{
    .img-profil{
        width: 25%;
    }
    .box-info-profil{
        display: flex;
    }
    .btn-modif{
        width: 60%;
    }
    .btn-valider{
        width: 40%!important;
    }
    .box-btn-valid{
        text-align: center;
    }
    .btn-delete{
        width: 70%!important;
    }
}
</style>

