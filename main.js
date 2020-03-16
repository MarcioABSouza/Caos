let result = document.querySelector('#result')
let logo = document.querySelector('#logo')
let cidade = document.querySelector('#cidade')
let observacao = document.querySelector('#observacao')
let insere = document.querySelector('#insere')
let btnAPI = document.querySelector('#btnAPI')

const KEY = '';

let clear = document.querySelector('#clear')
let controlers = document.querySelector('#controlers')

window.addEventListener('load', listar)
clear.addEventListener('click', limpar)
insere.addEventListener('click', inserir)
btnAPI.addEventListener('click', api)

//Coordenadas de Rio Grande;

let longitude = '-32.054347';
let latitude = '-52.127881';
// Api Key Dark Sky
const apiKey = 'a45eab351aad4add41b431ac4c7bebbe';
const apiUrl = `https://api.darksky.net/forecast/${apiKey}/${longitude},${latitude}?units=ca`;

let data = [];


//Incluir uma nova cidade ou atualizar já existente!
 function inserir(editar){

    editaControl=false;
    if(cidade.value === '' || observacao.value === ''){ 
        alert(`Campos vazios!`)
        limpaCampos()
        return
    } 
    
    let datas = [];   

    if(localStorage.getItem('data')){
        datas = JSON.parse(localStorage.getItem('data'))  
        datas.push({
            'cidade': cidade.value,
            'observacao': observacao.value
        })
        limpaCampos()
        localStorage.setItem('data', JSON.stringify(datas))
        console.log(JSON.stringify(datas))
        }
    else{
        datas.push({
            'cidade': cidade.value,
            'observacao': observacao.value
        })
        limpaCampos()
        localStorage.setItem('data', JSON.stringify(datas))
    }
    insere.innerHTML = 'Whats Up'
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

        api(element.cidade,index)



        result.insertAdjacentHTML('beforeend', `
        <div id="card">
        
            <div id="inner-card-up"> 
                <h4 id="cidade_card">${element.cidade} </h4>
                <span style="font-size: 25px"><i class="fa fa-cloud"></i></span>
                <h3 id="temperatura${index}"></h3>
            </div>

            <div id="inner-card-down">
            
            <div id="inner-card-down">
            <p id="observacoes_card">${element.observacao}</p>
            </div>    

            <div id="inner-card-down">
                <span Onclick=excluir(${index}) style="font-size: 18px"><i class="fa fa-times-circle"></i></span>
                <span id="btnEditar${index}" Onclick=editar(${index}) style="font-size: 18px"><i  id="iconEditar${index}"class="fa fa-edit"></i></span>
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
        if(cidade.value === '' || observacao.value === ''){ 
            alert(`Campos vazios!`)
            limpaCampos()
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
 function api(city, index){

    fetch(`http://api.weatherstack.com/current?access_key=${KEY}&query=${city}`)
    .then((res)=>{
       return res.json()
       
    }).then((json) =>{
        dados = json;
        console.log(`
        Cidade - ${dados.location.name}
        Estado - ${dados.location.region}
        Pais - ${dados.location.country}
        Temperatura ${dados.current.temperature}
        Comentário ${dados.current.weather_descriptions}
        `)
        document.querySelector(`#temperatura${index}`).innerHTML = dados.current.temperature;
    })
    
}