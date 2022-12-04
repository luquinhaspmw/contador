
// ELEMENTOS DO CONTADOR

const buttonPlay = document.getElementById("play");
const buttonPause = document.getElementById("pause");
const buttonStop = document.getElementById("stop");
const hourText = document.getElementById("hour");
const minuteText = document.getElementById("minute");
const secondsText = document.getElementById("seconds");

/////////////////////////

// ELEMENTOS DO MODAL
const modal = document.getElementById("modal");
const closeButton = document.getElementById("closeModal");

const inputAtividade = document.getElementById("atividade-nome");
const buttonSave = document.getElementById("saveButton");
/////////////////////////

// ELEMENTOS DA TABELA
const tbody = document.getElementById("tbody");


/////////////////////////


// CRIANDO LISTA COM OS BUTTONS
const buttons = [buttonPlay,buttonPause,buttonStop,closeButton,buttonSave];

class StopWatch{

    // Definindo variáveis internas
    constructor(hourText,minuteText,secondsText,buttonPlay,buttonPause,buttonStop,inputAtividade){
        this.hourText = hourText;
        this.minuteText = minuteText;
        this.secondsText = secondsText;
        this.buttonPlay = buttonPlay;
        this.buttonPause = buttonPause;
        this.buttonStop = buttonStop;
        this.hour = 0;
        this.minute = 0;
        this.seconds = 0;
        this.interval = null;

        this.inputAtividade = inputAtividade;
        this.arr = [];
    }

    // Criando método para ativar modal
    activeModal(){
        modal.classList.toggle("on");
    }
    // Criando método para salvar atividades
    registerActivity(){
        if(this.inputAtividade.value != ""){
            if(typeof(Storage) != "undefined"){
                if(localStorage.atividades){
                    this.arr = JSON.parse(localStorage.getItem("atividades"));
                }

                // criando objeto
                let nameAtividade = this.inputAtividade.value;
                let date = this.getDate();
                let time = this.getTime();
                let atividade = {
                    name:nameAtividade,
                    time:time,
                    date:date
                }

                // fazendo push para o array de objetos
                this.arr.push(atividade);
                this.inputAtividade.value = "";

                // passando array de obejeto para stringify e salvando no localStorage
                localStorage.atividades = JSON.stringify(this.arr);
                this.stop(true);
                this.closeModal();
                this.refreshAtividades();
            }else{
                alert("Seu navegador não suporta Web Storage");
            }
        }else{
            alert("Por favor insira o nome da sua atividade")
        }
    }
    // Criando método para fechar modal
    closeModal(){
        modal.classList.remove("on");
        this.stop(true)
    }
    // Criando método para obter data atual
    getDate(){
        let date = new Date();
        let month = date.getUTCMonth() + 1;
        let day = date.getUTCDate();
        let year = date.getUTCFullYear();

        let newdate = `${day}/${month}/${year}`;

        return newdate;
    }
    // Criando método para obter o tempo contado
    getTime(){
        let time = `${this.hourText.innerText}:${this.minuteText.innerText}:${this.secondsText.innerText}`;
        return time;
    }
    // Criando método para checar escolha do usuário
    choiseFunc(func){
        switch(func){
            case "play":
                this.play();
                break
            case "pause":
                this.pause();
                break
            case "stop":
                this.stop(false);
                break
        }
    }
    // Criando método para iniciar o StopWatch
    play(){
        if(this.interval){
            return
        }
        this.interval =
        setInterval(()=>{
            this.seconds++
            if(this.seconds == 60){
                this.seconds = 0;
                this.minute++
                if(this.minute == 60){
                    this.minute = 0;
                    this.hour++
                }
            }
            this.refreshScreen()
        }, 1000);
    }

     // Criando método para pausar o StopWatch
    pause(){
        clearInterval(this.interval);
        this.interval = null;
    }

     // Criando método para encerrar o StopWatch
    stop(passed){
        this.pause();
        if(passed === false){
            this.activeModal();
        }else if(passed === true){
            this.seconds = 0;
            this.minute = 0;
            this.hour = 0;
        }else{
            alert("Error")
        }
        this.refreshScreen();
    }

     // Criando método para atualizar o StopWatch
    refreshScreen(){
        this.choiseDozens(this.seconds,this.secondsText);
        this.choiseDozens(this.minute,this.minuteText);
        this.choiseDozens(this.hour,this.hourText);
    }
    refreshAtividades(){
        if(localStorage.atividades){

            // pegando atividades salvas e passando JSON para array convencional
            this.arr = JSON.parse(localStorage.getItem("atividades"));

            tbody.innerHTML = "";

            // inserindo atividades salvas no localStorage dentro do html
            this.arr.forEach((atividade)=>{
                tbody.innerHTML += `
                <tr>
                    <td class="left-align">${atividade.name}</td>
                    <td class="right-align">${atividade.time}</td>
                    <td class="right-align">${atividade.date}</td>
                </tr> 
                `
            })
        }
    }
     // Criando método para melhorar o visual da contagem
    choiseDozens(counter,counterText){
        
        if(counter < 10){
            counterText.innerText = `0${counter}`;
        }else{
            counterText.innerText = `${counter}`;
        }
    }
}

// criando um new StopWatch
const clock = new StopWatch(hourText,minuteText,secondsText,buttonPlay,buttonPause,buttonStop,inputAtividade);
clock.refreshAtividades();
// LOOP PRA ADICIONAR FUNÇÃO NOS BUTTONS
buttons.forEach((btn)=>{
    const func = btn.getAttribute("id");

    if(btn.getAttribute("id") == "closeModal"){
        btn.addEventListener("click",()=>{
            clock.closeModal();
        })
    }

    if(btn.getAttribute("id") == "saveButton"){
        btn.addEventListener("click",()=>{
            clock.registerActivity();
        })
    }

    btn.addEventListener("click",()=>{
        clock.choiseFunc(func);
    })
})