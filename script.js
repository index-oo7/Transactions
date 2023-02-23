class Transakcija{
    constructor(ime, pozivni, odliv, priliv, datum){
        this.id;
        this.ime = ime;
        this.pozivni = pozivni;
        this.odliv = odliv;
        this.priliv = priliv;
        this.datum = new Date(datum);
        this.iznos = this.priliv - this.odliv;
    }
    // GENERISANJE ID-A
    generisanjeId(){
        if(nizTransakcija.length == 0){
            return 1;
        }else{
            return nizTransakcija[nizTransakcija.length-1].id + 1;
        }
    }

    ispisPriliv(){
        return `<br><i>ID:</i> ${this.id}
        <br><i>Ime:</i> ${this.ime}
        <br><i>Pozivni broj:</i> ${this.pozivni}
        <br><i>Priliv:</i> ${this.priliv}
        <br><i>Datum:</i> ${this.datum}<br>`;
    }
    ispisOdliv(){
        return `<br><i>ID:</i> ${this.id}
        <br><i>Ime:</i> ${this.ime}
        <br><i>Pozivni broj:</i> ${this.pozivni}
        <br><i>Odliv:</i> ${this.odliv}
        <br><i>Datum:</i> ${this.datum}<br>`;
    }
}

// GLOBALNE PROMENLJIVE
let nizTransakcija = [];
let nizTransakcijaOdliv = [];
let nizTransakcijaPriliv = [];
let stanje = 0;
let displayTransactions = document.querySelector("#displayTransactions");
let displayRecent = document.querySelector("#displayRecent");
let displaySearch = document.querySelector("#displaySearch");
let displayBalance = document.querySelector("#displayBalance");
const nedelja = 7 * 24 * 60 * 60 * 1000; //MILISEKUNDE U NEDELJI


// UNOS TRANSAKCIJE
function DodajTransakciju(){
    
    
    let pozivni = document.querySelector("#pozivni").value;
    let priliv = document.querySelector("#priliv").value;
    let odliv = document.querySelector("#odliv").value;
    let datum = document.querySelector("#datum").value;
    let ime = document.querySelector("#ime").value;
    let sadasnjiDatum = new Date();

    // DODAVANJE INSTANCE I U NIZOVE ODLIV/PRILIV I ISPIS DETALJA TRANSAKCIJE
    if(ime == ""){
        // EROR - NIJE UNETO IME
        alert("Niste uneli ime");
    }else if(pozivni == ""){
        // EROR - NIJE UNESEN POZIVNI BROJ
        alert("Niste uneli pozivni broj");
    }else if(priliv == "" && odliv == ""){
        // EROR - NIJE UNESEN PRILIV/ODLIV
        alert("Niste uneli ni priliv ni odliv!");
    }else if(priliv != "" && odliv != ""){
        // EROR - OBA PUNA
        alert("Ne mozete uneti i priliv i odliv!");
    }else if(priliv == "0" || odliv == "0"){
        // EROR - TRANSAKCIJA NE MOZE BITI 0
        alert("Transakcija ne moze biti 0!");
    }else if(datum == ""){
        // EROR - NIJE UNESEN DATUM
        alert("Niste uneli datum!");
    }else if(Date.parse(datum) > Date.parse(sadasnjiDatum)){
        //EROR - DATUM IZ BUDUCNOSTI
        alert("Uneli ste datum iz buducnosti!");
    }else{
        // KREIRANJE INSTANCE KLASE TRANSAKCIJA I DODAVANJE INSTANCE U NIZ TRANSAKCIJA
        let transakcija = new Transakcija(ime, pozivni, odliv, priliv, datum);
        transakcija.id = transakcija.generisanjeId();
        nizTransakcija.push(transakcija); 

        if(odliv == ""){

            // PRILIV
            displayTransactions.innerHTML += transakcija.ispisPriliv();
            nizTransakcijaPriliv.push(transakcija);

            // UPIS U NEDAVNE PRILIV
            if(Date.parse(sadasnjiDatum) - Date.parse(transakcija.datum) <= nedelja){
                displayRecent.innerHTML += transakcija.ispisPriliv();
            }

        }else if(priliv == ""){

            // ODLIV
            displayTransactions.innerHTML += transakcija.ispisOdliv();
            nizTransakcijaOdliv.push(transakcija);

            // UPIS U NEDAVNE ODLIV
            if(Date.parse(sadasnjiDatum) - Date.parse(transakcija.datum) <= nedelja){
                displayRecent.innerHTML += transakcija.ispisOdliv();
            }
        } 
        
        // PROMENA STANJA RACUNA ; PRIKAZ STANJA RACUNA I BROJA ODLIVA I PRILIVA UKOLIKO JE OBAVLJENA MINIMUM 1 TRANSAKCIJA
        if(nizTransakcijaOdliv.length > 0 || nizTransakcijaPriliv.length > 0){
            stanje += transakcija.iznos;
            displayBalance.innerHTML = `
            <i>Stanje racuna:</i> ${stanje} <br> 
            <i>Broj priliva:</i> ${nizTransakcijaPriliv.length} <br> 
            <i>Broj odliva:</i> ${nizTransakcijaOdliv.length} `;
        }else{
            displayBalance.innerHTML = "";
        }
    }    
}

function Sortiraj(){
    let sortiranje = document.querySelector("#sortiranje").value;
    // RESTART PRIKAZA TRANSAKCIJA DA BI MOGAO DA BUDE PRIKAZAN SORTIRAN
    displayTransactions.innerHTML = "";

    nizTransakcija.sort((a, b) => {

        if (sortiranje === "rastuce") {
            return a.datum.getTime() - b.datum.getTime();
        } else if(sortiranje === "opadajuce") {
            return b.datum.getTime() - a.datum.getTime();
        } else{
            alert("Niste izabrali opciju za sortiranje!");
        }
    });


    //PROLAZ KROZ SVAKU TRANSAKCIJU
    nizTransakcija.forEach((transakcija) => {
        // PROVERA KOJI METODA ZA ISPIS SE ISPISUJE
        if (transakcija.iznos < 0) {
            displayTransactions.innerHTML += transakcija.ispisOdliv();
        } else if (transakcija.iznos > 0) {
            displayTransactions.innerHTML += transakcija.ispisPriliv();
        }
    })
}

function Pretrazi(){
    // PRETRAGA PO POZIVNOM BROJU
    displaySearch.innerHTML = "";
    let x = false;

    let pretraga = document.querySelector("#pretraga").value;
    if(pretraga == ""){
        alert("Niste uneli termin pretrage!");
    }else{
        nizTransakcija.forEach((transakcija) => {
            // PROVERA KOJI METODA ZA ISPIS SE ISPISUJE
            if(transakcija.pozivni.includes(pretraga)){
                x = true;//INDIKATOR DA MINIMUM JEDAN PRETRAZENI TERMIN POSTOJI
                if (transakcija.iznos < 0) {
                    displaySearch.innerHTML += transakcija.ispisOdliv();
                    console.log(transakcija.iznos);
                } else if (transakcija.iznos > 0) {
                    displaySearch.innerHTML += transakcija.ispisPriliv();
                    console.log(transakcija.iznos);
                }
            }
        })

        //PROVERA DA LI POSTOJI MINIMUM JEDAN PRETRAZENI TERMIN
        if(x == false){
            displaySearch.innerHTML = "Nema rezultata za takvu pretragu!";
        }
    }
}