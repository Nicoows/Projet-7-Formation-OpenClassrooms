<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-md">
        <a class="navbar-brand" href="http://localhost:8080/Profile#/Post">Accueil</a>
        <a class="navbar-brand" href="http://localhost:8080/Profile#/Profile">Profil</a>
        <a class="navbar-brand" href="#" @click="disconnect()">Se déconnecter</a>
    </div>
    </nav>
    <div class="boxdiv">
        <img src="../assets/Logo-Groupomania/logo-left-font-monochrome-black.png" class="logo">
    </div>
    <form>
        <div class="form-group write-post w-50">
        <textarea v-model="message" class="form-control" id="exampleFormControlTextarea1" placeholder="Ecrivez ici ..." rows="3"></textarea>
        <input type="file" id="image" name="avatar" accept="image/png, image/jpeg" class="btn-img">
        <div class="box-btn">
            <button type="button" class="btn btn-primary w-25 btn-write" @click="sendPost()">Valider</button>
        </div>
        </div>
    </form>
    <div>
        <div class="container">
        <div class="well mt-2 box-post" v-for="item in posts" :key="item">
            <div class="">
                <div class="box-img-nom">
                <a class="w-25 lien-img" href="http://localhost:8080/Profile#/Profile">
                    <img class="w-75 rounded-circle" :src=item.avatar>
                </a>
                <div class="justify-content-between">
                        <p class="media-heading nom-post"><strong>{{item.name}}</strong></p>
                        <p class="date-post">{{item.datePost}}</p>
                </div>
                </div>
                <div class="bloc-post w-100">
                    <p class="message-post"> {{item.message}} </p>
                    <img class="w-75" :src=item.image>
                    <ul class="list-inline d-flex">
                        <li class="m-2 btn-like" id="spanLike" @click="like(item.postId)">{{numberLike[item.postId]}}  <i class="fas fa-thumbs-up"></i></li>
                        <li class="m-2 btn-com" @click="getAllComment(item.postId)">{{numberCom[item.postId]}} Commentaires</li>
                    </ul>
                    <div>
                        <div v-if="mode === 'com'">
                        <div v-for="com in coms[item.postId]" :key="com" class="d-flex box-com m-2" :id="item.postId">
                            <img class="img-com rounded-circle" :src=com.avatar>
                            <div class="sousbox-com">
                                <h6>{{com.name}}</h6>
                                <p>{{com.comment}}</p>
                            </div>
                            <div v-if="this.userId === com.comUserId || this.admin === 'admin'" @click="deleteCom(com.commentId)">
                                <i class="fas fa-times icone-suppCom"></i>
                            </div>
                        </div>
                        </div>
                        <input v-model="comment[item.postId]" class="form-control" type="text" placeholder="Ecrivez un commentaire ...">
                        <button type="button" class="btn btn-primary w-25 btn-write" @click="sendComment(item.postId)">Valider</button>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-row-reverse">
                <button type="button" id="btnSupp" class="btn btn-danger btn-supp" v-if="this.userId === item.user_Id || this.admin === 'admin'" @click="deletePost(item.postId)"><i class="far fa-trash-alt"></i> Supprimer</button>
            </div>
        </div>
        </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'Post',
        data: () => {
            return{
                mode: 'pasCom',
                message: '',
                comment: [],
                likes: 0,
                userId: '',
                admin: '',
                posts: [],
                coms: [],
                numberCom: [],
                numberLike: []
            }
        },
        methods: {
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
            sendPost: function(){
                //var imageUrl = document.getElementById("image").files[0];
                const formData = new FormData();
                formData.append("message", this.message);
                formData.append("avatar", document.getElementById("image").files[0]);
                axios
                .post('http://localhost:3000/api/post', formData)
                .then(()=>{console.log('Post envoyé');
                window.location.reload();
                })
                .catch(()=> {console.log('post non envoyé');})
            },
            getAllPost: function(){
                axios
                .get('http://localhost:3000/api/get', {

                })
                .then((data)=>{this.posts = data.data;
                console.log(data);
                })
                .catch(()=>{console.log("Get pas réussi")});
            },
            deletePost: function(postId){
                axios
                .delete('http://localhost:3000/api/delete/'+ postId)
                .then(()=>{console.log("Post supprimé");
                window.location.reload();
                })
                .catch(()=>{console.log("Echec de la suppression");})
            },
            sendComment: function(postId){
                axios
                .post('http://localhost:3000/api/comment/' + postId, {
                    comment: this.comment[postId]
                })
                .then(()=>{console.log("Commentaires envoyé");
                window.location.reload();
                })
                .catch(()=>{console.log("Echec de l'envoi");})
            },
            getAllComment: function(postId){
                if(this.mode != 'com'){
                        axios
                        .get('http://localhost:3000/api/get/comment/'+ postId, {
                        
                        }) 
                        .then((data)=>{ this.coms[postId] = data.data;
                            console.log(this.coms);
                            this.mode = 'com';
                        })
                        .catch(()=>{console.log("get com échoué");})
                } else {
                    this.mode = 'pasCom';
                    window.location.reload()
                }
            },
            getNumberCom: function(postId){
                axios
                .get('http://localhost:3000/api/get/number/com/'+ postId, {

                })
                .then((data)=>{
                    for(let i=0; i<data.data.length; i++){
                        this.numberCom[data.data[i].postId] = data.data[i].comNum;
                    }
                     
                console.log(data.data);
                })
                .catch(()=>{console.log("get com échoué");})
            },
            deleteCom: function(commentId){
                axios
                .delete('http://localhost:3000/api/delete/com/'+ commentId, {
                    
                })
                .then(()=>{console.log('Commentaire supprimé');
                window.location.reload()
                })
                .catch(()=>{console.log('Echec de la suppresion');})
            },
            like: function(postId){
                axios
                .put('http://localhost:3000/api/dislike/'+ postId, {

                })
                .then(()=>{console.log("dislike envoyé");
                window.location.reload();
                let span = document.getElementById("spanLike");
                span.classList.remove('blueColor');
                })
                .catch(()=>{console.log("Echec de l'envoi");})
            },
            getNumberLike: function(postId){
                axios
                .get('http://localhost:3000/api/get/number/like/'+ postId, {

                })
                .then((data)=>{
                    for(let i=0; i<data.data.length; i++){
                        this.numberLike[data.data[i].postId] = data.data[i].likeNum;
                    }
                     
                console.log(data.data);
                })
                .catch(()=>{console.log("get com échoué");})
            },
        },
        mounted(){
            this.getAllPost(),
            this.getNumberCom(),
            this.getUserId(),
            this.getNumberLike()
            //this.getAllComment()
        }
        }
</script>

<style>
img{
    object-fit: cover;
}
.blueColor{
    color: blue;
}
.cache{
    display: none;
}
.write-post{
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    background-color: #d8d4d4;
    border-radius: 20px;
    padding: 20px;
}
.btn-write{
    margin-top: 10px;
}
.titre-post{
    text-align: center;
}
.box-img-nom{
    display: flex;
}
.bloc-post{
    padding: 15px;
}
.nom-post{
    margin-bottom: 0;
    margin-top: 5px;
}
.message-post{
    margin-left: 5px;
    margin-top: 5px;
}
.box-btn{
    text-align: center;
}
.box-post{
    background-color: #d8d4d4;
    border-radius: 20px;
    padding: 10px;
}
.lien-img{
    text-align: center;
    margin-top: 5px;
}
.date-post{
    margin-right: 5px;
}
.box-com{
    display: none;
}
.com{
    border: 1px solid grey;
    border-radius: 5px;
    padding: 5px;
}
.btn-com, .btn-like{
    cursor: pointer;
}
.img-com{
    width: 15%;
}
.sousbox-com{
    font-size: 0.9em;
    margin-left: 5px;
    flex: 1;
}
.icone-suppCom{
    color: red;
    right: 5px;
    margin-top: auto;
    margin-bottom: auto;
    cursor: pointer;
}
.fa-trash-alt{
    margin-top: auto;
    margin-bottom: auto;
}
.btn-supp{
    width: 20%;
}
@media screen and (max-width: 426px)
{
    .write-post{
        width: 70% !important;
    }
    .btn-img{
        width: 100%;
    }
    .btn-write{
        width: 50% !important;
    }
    .btn-supp{
        width: 40%!important;
    }
}
</style>
