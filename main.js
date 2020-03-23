let result = document.querySelector('#result')
let logo = document.querySelector('#logo')
let cidade = document.querySelector('#cidade')
let observacao = document.querySelector('#observacao')
let insere = document.querySelector('#insere')
let btnAPI = document.querySelector('#btnAPI')

let KEY = '48d5c83ce5c68b72bcd7900e669b8806';

let clear = document.querySelector('#clear')
let controlers = document.querySelector('#controlers')

window.addEventListener('load', listar)
clear.addEventListener('click', limpar)
insere.addEventListener('click', inserir)
cidade.addEventListener('keyup', (e)=>{
    if(e.keyCode ==13){
        inserir()
    }
})

let data = [];


//Incluir uma nova cidade 
 function inserir(){

    editaControl=false;
    if(cidade.value === '' || cidade.value.length < 2){ 
        alert(`The city is empty or its name is too short!`)
        limpaCampos()
        cidade.focus()
        return
    } 
    
    let datas = [];   

    if(localStorage.getItem('data')){
        datas = JSON.parse(localStorage.getItem('data'))  
        datas.unshift({
            'cidade': cidade.value,
            'observacao': observacao.value
        })
        limpaCampos()
        localStorage.setItem('data', JSON.stringify(datas))
        console.log(JSON.stringify(datas))
        }
    else{
        datas.unshift({
            'cidade': cidade.value,
            'observacao': observacao.value
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
        
        datas.forEach((element, index)=>{

        if(KEY)
        {    
        api(element.cidade,index)
        }
        

        result.insertAdjacentHTML('beforeend', `
        <div id="card${index}" class="card">
        
            <div id="inner-card-up"> 
                <h3 id="cidade_card${index}">${element.cidade}</h3>
                <img id="icon${index}" src="">
                <h4 id="temperatura${index}"></h4>
            </div>
            
            <div class="inner-card-medium" id="inner-card-medium${index}">
            <p id="detalhes${index}"></p>
            </div>   
            
            <div id="inner-card-medium">
            <p id="observacoes_card">${element.observacao}</p>
            </div>  

            <div id="inner-card-down">
                <h4 id="hora${index}"></h4>
                <div>
                <span Onclick=excluir(${index}) style="font-size: 25px"><i class="fa fa-times-circle"></i></span>
                <span id="btnEditar${index}" Onclick=editar(${index}) style="font-size: 25px"><i  id="iconEditar${index}"class="fa fa-edit"></i></span>
               </div>
            </div>
        
        </div>`)

        })
    }
}

let editaControl = false;

//Editar cidade
function editar(e){

    datas = JSON.parse(localStorage.getItem('data'))

    if(!editaControl){ 
    
    editaControl=true;
    cidade.value = datas[e].cidade;
    observacao.value = datas[e].observacao;
    document.querySelector(`#iconEditar${e}`).className ='fa fa-check-circle';
    }else{
        if(cidade.value === '' || cidade.value.length < 2){ 
            alert(`The city is empty or its name is too short!`)
            limpaCampos()
            cidade.focus()
            return
        } 
        editaControl=false;
        datas[e].cidade = cidade.value;
        datas[e].observacao = observacao.value;
        document.querySelector(`#iconEditar${e}`).className ='fa fa-edit';
        localStorage.setItem('data', JSON.stringify(datas))
        limpaCampos()
        listar()
    }

}

function excluir(e){
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
    observacao.value = "";

}


//Chamando API 
 let dados,hora;

 function api(city, index){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=48d5c83ce5c68b72bcd7900e669b8806&lang=pt_br&units=metric`)
    .then((res)=>{
       return res.json()
    }).then((json) =>{
        dados = json;
        hora = new Date((Math.floor(new Date().getTime()/1000)+(dados.city.timezone))*1000).toUTCString()
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
        document.querySelector(`#detalhes${index}`).innerHTML = `${dados.list[0].weather[0].description.toUpperCase()}.`;
        document.querySelector(`#hora${index}`).innerHTML = ` ${hora.slice(17,25)}`;
        document.querySelector(`#card${index}`).className = "card-show";
        document.querySelector(`#icon${index}`).src = `http://openweathermap.org/img/wn/${dados.list[0].weather[0].icon}.png`;  



    }).catch((err)=>{
        console.log(err)
        document.querySelector(`#card${index}`).className = "card-show";
    })
    
       
}