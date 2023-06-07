class Category{ // Creation d'une classe 
    constructor(title,name,url) {
        this.title= title
        this.name = name
        this.url= url
        this.page_size = 4
        this.index_start_film= 0
        this.films = []
        this.ok = false
        this.next = null
        this.index_end_film = 0
        this.contener = null
        
        
    }
    async load() {
        var {data, next,previous, error} = await handleRequest("GET", this.url)

        if(!error){
            this.ok= true
            this.films= data 
            this.next = next
            
            if(data.length< this.page_size){
                this.index_end_film=data.length-1
            }else
                this.index_end_film=this.page_size-1
        }else
        console.log(error)

    }

    


    async display_info(url,id_pop_up){
        
        if(!this.ok){
            console.log("CError loading category ")
            return
        }

        var {data, error} = await handleRequest("GET", url)
        if (error){
            console.log(error)
            return
        }

// Creation variable glob qui prendre en compte ce qui est en bas
// utiiliser sa commme base d'information pour tout les films
// FAIRE UNE FONCT 43-47 EN PARAMETRE L'URL, =>METTREE AJOUR SI BESOIN , IL VA CHERCHE LES INFO AVEC LE GET ET LE MET DANS FILM.BY_URL
//FILM.URL {URL : THIS.FILM}
        var infos = ["image_url","title","genres","date_published","rated","imdb_scrore","diretors","actors","duration","coutries","worldwide_gross_income","description"]
        var div_pop_text=document.getElementById(id_pop_up)
        for(let info of infos){
            if (!data[info]){
                continue
            }
            if (info == "image_url"){
                var img_film =document.createElement("img")
                img_film.src= data[info]
                div_pop_text.appendChild(img_film)
                continue
            }


            var div_pop_director=document.createElement("div")
            

            div_pop_director.innerText= info.replaceAll("_"," ") + ": "+ data[info]
            div_pop_director.style.textTransform= "capitalize"
            div_pop_text.appendChild(div_pop_director)

            var espace = document.createElement("br")

            div_pop_text.appendChild(espace)
        }
    }
// On px utiliser la meme pop up pour affichier le contenue des film et de best story
//faire ue fonction qui prendrait en  parametre un film (les info du film) pour afficher le contenue
// Proposition : faire une id de film pour pouvoir mieux gerer la creation de pop up
//passer l url des film des 

// Piste  : regarder si ils sont pas charger charger avant 
// CREER UN THIS.FILM_BY_URL
//


    display_best_movie(){
        if(!this.ok){
            console.log("CError loading category ")
            return
        }

        var div_title_best_movie = document.getElementById("best_movie_title")
        var img_best_movie = document.getElementById("best_movie_img")
        div_title_best_movie.innerText = this.films[0].title
        img_best_movie.src = this.films[0].image_url
        this.display_info(this.films[0].url,"pop_up_contener")
        this.films.shift()
        this.load_next()

    }


    display(){ 
        
        if(!this.ok){
            console.log("CError loading category ")
            return
        }

        var div = document.getElementById("div_categorie")
        var category = document.createElement("div")

        category.innerText= this.title // utiliser ca pour avoir l'url correct 
        category.className = "film" // On lui a donner une classe 
        div.appendChild(category)


        var div_des_carres= document.createElement("div")
        div_des_carres.className = "div_des_carres"
        div_des_carres.id = "div_des_carres_"+ this.name
        
        category.appendChild(div_des_carres)
        this.contener = div_des_carres


        var div_arrow_left= document.createElement("div")
        div_arrow_left.style.visibility = "hidden"
        div_arrow_left.className = "arrow_left"
        div_arrow_left.onclick = this.arrow_left.bind(this)//
        div_des_carres.appendChild(div_arrow_left)


        for (let j = 0; j < this.page_size; j++){

            var carre =document.createElement("img")
            carre.className = "carre"
            carre.id = this.name + "_carre_" + j// concatener string et entien se renseigner 
            carre.src= this.films[this.index_start_film +j].image_url // recup les image

            carre.addEventListener("click", ()=>{
                // creation modale dans hhtml+ css
                document.getElementById("pop-id").remove()
                pop_up()

                this.display_info(this.films[this.index_start_film +j].url,"pop-id")

                document.getElementById("pop-id").style.display = "contents"

            })
            
            div_des_carres.appendChild(carre)


        }
        
        // creation des fleches auto (la doite )
        var div_arrow_right= document.createElement("div")
        if (this.is_end())
            div_arrow_right.style.visibility = "hidden"
        div_arrow_right.className = "arrow_right"
        div_arrow_right.onclick = this.arrow_right.bind(this)//
        div_des_carres.appendChild(div_arrow_right)
    }

    async arrow_right(){
        if(!this.ok){
            console.log("CError loading category ")
            return
        }

        if(!this.is_end() && this.index_end_film == this.films.length -2)
            await this.load_next()
        this.index_start_film ++
        this.index_end_film ++
        var div_des_carres=document.getElementById("div_des_carres_"+ this.name)
        
        for(let k = 0; k < this.page_size + 2 ; k++){ // +2 pour les fleches 
            if (k == 0 && !this.is_start())
                div_des_carres.children[k].style.visibility = "visible"

            else if (k == this.page_size+1 && this.is_end())
                div_des_carres.children[k].style.visibility = "hidden"

            else  
                div_des_carres.children[k].src = this.films[this.index_start_film +k].image_url   

        }
        
    }

    async arrow_left(){
        if(!this.ok){
            console.log("CError loading category ")
            return
        }

        this.index_start_film --
        this.index_end_film --
        var div_des_carres=document.getElementById("div_des_carres_"+ this.name)
        
        for(let k = 0; k < this.page_size + 2 ; k++){ // +2 pour les fleches 
            if (k == 0 && this.is_start())
                div_des_carres.children[k].style.visibility = "hidden"

            else if (k == this.page_size+1 && !this.is_end())
                div_des_carres.children[k].style.visibility = "visible"

            else  
                div_des_carres.children[k].src = this.films[this.index_start_film +k].image_url   

        }
        
    }

    is_start(){

        return this.index_start_film == 0
    }
    
    is_end(){
        return this.index_end_film == 6
    }

    async load_next() {
        if(!this.ok){
            console.log("CError loading category ")
            return
        }
        var {data, next,previous, error} = await handleRequest("GET", this.next)

        if(!error){
            this.films= this.films.concat(data)
            this.next = next            
           
        }else
        console.log(error)

    }
    
}
function pop_up(){
    var pop_up = document.createElement("div")
    pop_up.id="pop-id"
    pop_up.style.display = "none"
    var botton = document.createElement("button")
    botton.innerText= "Quit"
    botton.addEventListener("click", ()=>{pop_up.style.display = "none"})
    pop_up.appendChild(botton)
    console.log(document.html)
    document.body.appendChild(pop_up)


}

async function handleRequest(method, url){ // on recuperer les donne de l'api
var myHeaders = new Headers();

// Recuperation des elements json
var myInit = { method: method,
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

var response = await fetch(url,myInit)

    if  (!response.ok){
        
        var text = ""
        response.text().then((rep)=> {text=rep})
        var error = "Error on" + method+ url+response.status+text

        return {data:null, next: null,previous:null, error}
    }

    var _,result = await response.json()
    
    if (result.results){

        return { data: result.results,next: result.next,previous:result.previous, error: null}

    }else 
        return {data: result, error:null,}

   // objet

}


async function main(){
    pop_up()
    var  best = new Category("Films mieux notés", "best", "http://127.0.0.1:8000/api/v1/titles/?page=1&sort_by=-imdb_score")
    await best.load()
    best.display_best_movie()
    best.display()


    var action = new Category("Romance","romance","http://127.0.0.1:8000/api/v1/titles/?page=1&genre=romance")
    await action.load()
    action.display()
    
    var comedy = new Category("Comedy","comedy","http://127.0.0.1:8000/api/v1/titles/?page=1&genre=comedy")
    await comedy.load()
    comedy.display()

    var drama = new Category("Drama","drama","http://127.0.0.1:8000/api/v1/titles/?page=1&genre=drama")
    await drama.load()
    drama.display()

    }

main()



// Creation des balise



