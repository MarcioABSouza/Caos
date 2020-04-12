let result = document.querySelector('#result')
let logo = document.querySelector('#logo')
let cidade = document.querySelector('#cidade')
let insere = document.querySelector('#insere')
let btnAPI = document.querySelector('#btnAPI')
let tempo = document.querySelector('#tempo')
let mensagemPrincipal = 'Como está o tempo?';

let KEY = '48d5c83ce5c68b72bcd7900e669b8806';

let clear = document.querySelector('#clear')
let controlers = document.querySelector('#controlers')

window.addEventListener('load', listar)
//clear.addEventListener('click', limpar)
insere.addEventListener('click', inserir)

cidade.addEventListener('keyup', (e)=>{
    if(e.keyCode ==13){
        inserir()
    }
})

let data = [];


//Incluir uma nova cidade 
 function inserir(){
    if(editaControl){
        alertSnackbar('Termine de editar o registro atual!')
        return 
    }

    editaControl=false;

    if(cidade.value === '' || cidade.value.length < 2){ 
        alertSnackbar('A cidade deve ter ao menos 3 letras!')
       return
    } 
    
    let datas = [];   

    if(localStorage.getItem('data')){
        datas = JSON.parse(localStorage.getItem('data'))  
        
        let cidadeJaExiste = datas.filter((elem)=>{
          return cidade.value == elem.cidade
        })

        if(cidadeJaExiste.length > 0){
            alertSnackbar(` ${cidade.value} já está cadastrada!`)
            limpaCampos()
            return}


        datas.unshift({
            'cidade': cidade.value,
            'listar' : true
        })
        limpaCampos()
        localStorage.setItem('data', JSON.stringify(datas))
        console.log(JSON.stringify(datas))
        }
    else{
        datas.unshift({
            'cidade': cidade.value,
            'listar' : true
        })
        limpaCampos()
        localStorage.setItem('data', JSON.stringify(datas))
    }
    listar()
    
}

//Listar 
function listar(){

    result.innerHTML = '';
    limpaCampos()
    if(!localStorage.getItem('data')){
        result.innerHTML =``;
    }else{
        datas = JSON.parse(localStorage.getItem('data'))
        
        //ITERAÇÂO 
        datas.forEach((element, index)=>{

        

        if(KEY && element.listar){    
        api(element.cidade,index).then((resp)=>{
            element.fuso = resp;
            
            if(!element.fuso){
                alertSnackbar(`Não há dados para '${element.cidade}' ! `)
                element.listar = false;
                localStorage.setItem('data', JSON.stringify(datas))
            }

        })
        }
        
       

        result.insertAdjacentHTML('beforeend', `
        <div id="card${index}" class="${KEY && element.listar?"card":"card-show"}">
        
            <div id="inner-card-up"> 
            <img id="icon${index}" src="">
                <h3 id="cidade_card${index}">${element.cidade}</h3>
                <h4 id="temperatura${index}"></h4>
            </div>
            
             

            <div id="inner-card-down">
                ${KEY?`<h4 id="hora${index}"></h4>`: ''}
                <div>
                <span Onclick=excluir(${index})><i class="fa fa-times-circle"></i></span>
                <span id="btnEditar${index}" Onclick=editar(${index})><i  id="iconEditar${index}"class="fa fa-edit"></i></span>
               </div>
            </div>
        
        </div>`)

        })

         setInterval(atualizaHora, 1000)
    }
}

let editaControl = false;

//Editar cidade
function editar(e){

    datas = JSON.parse(localStorage.getItem('data'))


    if(!editaControl){ 
    
    editaControl=true;

    cidade.value = datas[e].cidade;

    document.querySelector(`#iconEditar${e}`).className ='fa fa-check-circle greenCheck';
    }else{
        if(cidade.value === '' || cidade.value.length < 3){ 
            alertSnackbar('Insira ao menos 3 letras!')
            limpaCampos()
            cidade.focus()
            document.querySelector(`#iconEditar${e}`).className ='fa fa-edit';
            editaControl = false;
            return
        } 


        let cidadeJaExiste = datas.filter((elem)=>{
            return cidade.value == elem.cidade
          })
  
          if(cidadeJaExiste.length > 0){
              alertSnackbar(` ${cidade.value} já está cadastrada!`)
              document.querySelector(`#iconEditar${e}`).className ='fa fa-edit';
              editaControl = false;
              limpaCampos()
              return
        }



        editaControl=false;
        datas[e].cidade = cidade.value;
        datas[e].listar = true;
        document.querySelector(`#iconEditar${e}`).className ='fa fa-edit';
        localStorage.setItem('data', JSON.stringify(datas))
        limpaCampos()
        listar()
    }

}

function excluir(e){

    editaControl= false;
    
    datas = JSON.parse(localStorage.getItem('data'))
    datas.splice(e, 1)
    localStorage.setItem('data', JSON.stringify(datas))
    listar()
}

function limpar(){
    localStorage.clear()
    listar()
}

function limpaCampos(){
    cidade.value = "";
}



function atualizaHora(){
    if(datas.length < 1){return}
    datas.forEach((elem, index)=>{
        if(elem.fuso){ 
            let novaHora = new Date((Math.floor(new Date().getTime()/1000)+(elem.fuso))*1000).toUTCString()
            document.querySelector(`#hora${index}`).innerHTML = `${novaHora.slice(17,25)}`;
        }
        
    })
}


function alertSnackbar(mensagem){
        
    var x = document.getElementById("alertSnackbar"); 
    x.innerHTML = mensagem;  
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      
}




//Chamando API 
 let dados,hora;

 async function api (city, index){
    let fuso;

    await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=48d5c83ce5c68b72bcd7900e669b8806&lang=pt_br&units=metric`)
    .then((res)=>{
       return res.json()
    }).then((json) =>{
        dados = json;

   
            hora = new Date((Math.floor(new Date().getTime()/1000)+(dados.city.timezone))*1000).toUTCString()
            
            document.querySelector(`#hora${index}`).innerHTML = ` ${hora.slice(17,25)}`;

        

        console.log(`
        Cidade: ${dados.city.name}
        País: ${dados.city.country}
        População: ${dados.city.population}
        Time Zone: ${dados.city.timezone}
        Temperatura atual: ${dados.list[0].main.temp}
        Descrição atual: ${dados.list[0].weather[0].description}
        Hora: ${hora}
        `)

        document.querySelector(`#temperatura${index}`).innerHTML = `${dados.list[0].main.temp}°C`;
        document.querySelector(`#cidade_card${index}`).innerHTML += `, ${dados.city.country}`;

       
        document.querySelector(`#card${index}`).className = "card-show";
        document.querySelector(`#icon${index}`).src = `http://openweathermap.org/img/wn/${dados.list[0].weather[0].icon}.png`;  

        fuso = dados.city.timezone;


    }).catch((err)=>{
        console.log(err)
        document.querySelector(`#card${index}`).className = "card-show";
    })
     return fuso;
       
}


