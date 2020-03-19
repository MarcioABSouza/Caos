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

//Listar cidades em localStorage
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
        <div id="card">
        
            <div id="inner-card-up"> 
                <h3 id="cidade_card${index}">${element.cidade}</h3>
                <h4 id="temperatura${index}"></h4>
            </div>
            
            <div id="inner-card-down">
            <p id="detalhes${index}"></p>
            </div>   
            
            <div id="inner-card-medium">
            <p id="observacoes_card">${element.observacao}</p>
            </div>  

            <div id="inner-card-down">
                <h4 id="hora${index}"></h4>
                <div>
                <span Onclick=excluir(${index}) style="font-size: 18px"><i class="fa fa-times-circle"></i></span>
                <span id="btnEditar${index}" Onclick=editar(${index}) style="font-size: 18px"><i  id="iconEditar${index}"class="fa fa-edit"></i></span>
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


//TESTES DE API
 let dados;
 let hora;
 function api(city, index){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}&lang=pt_br&units=metric`)
    .then((res)=>{
       return res.json()
    }).then((json) =>{
        dados = json;
        hora = new Date((Math.floor(new Date().getTime()/1000)+(dados.timezone))*1000).toUTCString()
        console.log(`
        País: ${dados.sys.country}
        Temperatura: ${ dados.main.temp}
        Sensação: ${dados.main.feels_like}
        Humidade: ${dados.main.humidity}
        Descrição: ${dados.weather[0].description} 
        Time Zone: ${dados.timezone}
        Hora: ${dados.dt}
        Hora no local: ${hora.slice(17,25)}
        `)
        document.querySelector(`#temperatura${index}`).innerHTML = `${dados.main.temp}°C`;
        document.querySelector(`#cidade_card${index}`).innerHTML += `, ${dados.sys.country}`;
        document.querySelector(`#detalhes${index}`).innerHTML = `${dados.weather[0].description.toUpperCase()}.`
        document.querySelector(`#hora${index}`).innerHTML = ` ${hora.slice(17,25)}`;
    })
    
       
}

//<span style="font-size: 25px"><i id="icone${index} class=""></i></span>


