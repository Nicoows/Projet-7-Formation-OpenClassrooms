<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-md">
        <a class="navbar-brand" href="http://localhost:8080/Profile#/Post">Accueil</a>
        <a class="navbar-brand" href="http://localhost:8080/Profile#/Profile">Profil</a>
        <a class="navbar-brand" href="#" @click="disconnect()">Se déconnecter</a>
    </div>
    </nav>
    <h3 class="titre-post">Groupomania</h3>
    <form>
        <div class="form-group write-post w-50">
        <label for="exampleFormControlTextarea1">Ecrivez ici :</label>
        <textarea v-model="message" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        <input type="file" id="image" name="avatar" accept="image/png, image/jpeg">
        <div class="box-btn">
            <button type="button" class="btn btn-primary w-25 btn-write" @click="sendPost()">Valider</button>
        </div>
        </div>
    </form>
    <div>
        <div class="container">
        <div class="well mt-2 box-post" v-for="item in posts" :key="item">
            <div class="d-flex" id="box{{item.postId}}">
                <a class="w-25 lien-img" href="http://localhost:8080/Profile#/Profile">
                    <img class="w-75 rounded-circle" :src=item.avatar>
                </a>
                <div class="bloc-post w-100">
                    <div class="d-flex justify-content-between">
                        <h4 class="media-heading">{{item.name}}</h4>
                        <p class="date-post">{{item.datePost}}</p>
                    </div> 
                    <p> {{item.message}} </p>
                    <img class="w-75" :src=item.image>
                    <ul class="list-inline d-flex">
                        <li class="m-2 btn-like" id="spanLike" @click="dislike(item.postId)">{{numberLike[item.postId]}} j'aime</li>
                        <li class="m-2 btn-com" @click="getAllComment(item.postId)">{{numberCom[item.postId]}} Commentaires</li>
                    </ul>
                    <div>
                        <div v-if="mode == 'com'">
                        <div v-for="com in coms[item.postId]" :key="com" class="d-flex box-com m-2">
                            <img class="img-com rounded-circle" :src=com.avatar>
                            <div class="sousbox-com">
                                <h6>{{com.name}}</h6>
                                <p>{{com.comment}}</p>
                            </div>
                            <div v-if="this.userId === com.comUserId" @click="deleteCom(com.commentId)">
                                <i class="fas fa-times icone-suppCom"></i>
                            </div>
                        </div>
                        </div>
                        <input v-model="comment[item.postId]" class="form-control" type="text" placeholder="Ecrivez un commentaire">
                        <button type="button" class="btn btn-primary w-25 btn-write" @click="sendComment(item.postId)">Valider</button>
                    </div>
                </div>
            </div>
            <button type="button" id="btnSupp" class="btn btn-danger btn-supp" v-if="this.userId === item.user_Id" @click="deletePost(item.postId)">Supprimer</button>
        </div>
        </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios'
//import axios from 'axios'
    export default {
        name: 'Post',
        data: () => {
            return{
                mode: 'pasCom',
                message: '',
                comment: [],
                likes: 0,
                userId: '',
                posts: [],
                coms: [],
                numberCom: [],
                numberLike: []
            }
        },
        methods: {
            getUserId: function(){
                axios
                .get('http://localhost:3000/api/get/userId', {

                })
                .then((data)=>{
                    this.userId = data.data[0].userId;
                    console.log(this.userId);
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
                //window.location.reload();
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
            dislike: function(postId){
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
        }
        }
</script>

<style>
.blueColor{
    color: blue;
}
.cache{
    display: none;
}
.write-post{
    margin-left: auto;
    margin-right: auto;
}
.btn-write{
    margin: 10px;
    align-items: center;
}
.titre-post{
    text-align: center;
}
.bloc-post{
    margin-left: 5px;
}
.box-btn{
    text-align: center;
}
.box-post{
    background-color: honeydew;
    border-radius: 20px;
}
.lien-img{
    text-align: center;
    margin-top: 5px;
}
.date-post{
    margin-right: 5px;
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
.btn-supp{
    width: 15%;
}
</style>
