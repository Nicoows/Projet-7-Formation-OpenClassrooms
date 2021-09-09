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
        <div class="box-btn">
            <button type="button" class="btn btn-primary w-25 btn-write" @click="sendPost()">Valider</button>
        </div>
        </div>
    </form>
    <div>
        <div class="container">
        <div class="well mt-2 box-post" v-for="item in posts" :key="item">
            <div class="d-flex" id="box">
                <a class="w-25 lien-img" href="http://localhost:8080/Profile#/Profile">
                    <img class="w-75 rounded-circle" :src=item.avatar>
                </a>
                <div class="bloc-post w-100">
                    <div class="d-flex justify-content-between">
                        <h4 class="media-heading">{{item.name}}</h4>
                        <p class="date-post">{{item.datePost}}</p>
                    </div> 
                    <p> {{item.message}} </p>
                    <ul class="list-inline d-flex">
                        <li class="m-2">j'aime</li>
                        <li class="m-2">{{numberCom.count}}</li>
                        <li class="m-2 btn-com" @click="getAllComment(item.postId)">Commentaires</li>
                    </ul>
                    <div>
                        <div v-for="com in coms" :key="com" class="d-flex box-com m-2 ">
                            <img class="img-com rounded-circle" :src=com.avatar>
                            <div class="sousbox-com">
                                <h6>{{com.name}}</h6>
                                <p>{{com.comment}}</p>
                            </div>
                        </div>
                        <input v-model="comment" class="form-control" type="text" placeholder="Ecrivez un commentaire">
                        <button type="button" class="btn btn-primary w-25 btn-write" @click="sendComment(item.postId)">Valider</button>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-danger btn-supp" @click="deletePost(item.postId)">Supprimer</button>
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
                message: '',
                comment: '',
                posts: [],
                coms: [],
                numberCom: []
            }
        },
        methods: {
            sendPost: function(){
                axios
                .post('http://localhost:3000/api/post', {
                    message: this.message
                })
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
                console.log(this.posts);
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
                    comment: this.comment
                })
                .then(()=>{console.log("Commentaires envoyé");
                //window.location.reload();
                })
                .catch(()=>{console.log("Echec de l'envoi");})
            },
            getAllComment: function(postId){
                axios
                .get('http://localhost:3000/api/get/comment/'+ postId, {
                
            }) 
            .then((data)=>{ this.coms = data.data;
                console.log(this.coms);
            })
            .catch(()=>{console.log("get com échoué");})
            },
            getNumberCom: function(postId){
                axios
                .get('http://localhost:3000/api/get/number/com/'+ postId, {

                })
                .then((data)=>{ this.numberCom = data.data;
                console.log(this.numberCom);
                })
                .catch(()=>{console.log("get com échoué");})
            }
        },
        mounted(){
            this.getAllPost(),
            this.getNumberCom()
        }
        }
</script>

<style>
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
.btn-com{
    cursor: pointer;
}
.img-com{
    width: 15%;
}
.sousbox-com{
    font-size: 0.9em;
    margin-left: 5px;
}
.btn-supp{
    width: 15%;
}
</style>
