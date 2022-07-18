# Programmazione-Avanzata

## Componenti del Team
- Mori Nicola
- Sospetti Mattia

## Obiettivi

L'obiettivo del progetto è quello di implementare un back-end utilizzando opportune librerie e framework.

In particolare realizzare un sistema che consenta la creazione e valutazione di modelli di ottimizzazione. In particolare un sistema renda possibile la gestione di eventuali revisioni nei modelli e di eseguire delle simulazioni. Obiettivi di realizzazione:

- Dare la possibilità di creare un nuovo modello seguendo l'interfaccia definita nella sezione API di [glpk](https://github.com/jvail/glpk.js)
  - In particolare, è necessario validare la richiesta di creazione del modello da parte dell’utente andando a verificare l’esistenza delle chiavi; devono essere validati anche gli eventuali errori (es. ub. che è minore di lb, oppure tipi non validi, oppure dicrection non valide…
  - Per ogni modello valido deve essere addebitato un numero di token in accordo con quanto segue:
    - 0.05 per ogni variabile (si applica un fattore x2 nel caso di variabili di tipo integer o binarie)
    - 0.01 per ogni vincolo
  - Il modello può essere creato se c’è credito sufficiente ad esaudire la richiesta
- Eseguire il modello (specificando l’eventuale versione; di default si considera l’ultima disponibile); per ogni esecuzione deve essere applicato un costo pari a quello addebitato nella fase di creazione. Ritornare il risultato sotto forma di JSON. Il risultato deve anche considerare il tempo impiegato per l’esecuzione.
- Creare una revisione di un modello esistente (es. cambiando vincoli subjectTo). Per ogni nuova revisione deve essere addebitato il costo del nuovo modello moltiplicato per 0.5
- Restituire l’elenco delle revisioni di un dato modello eventualmente filtrando per:
  - Data modifica
  - Numero di variabili
- Restituire l’elenco dei modelli filtrando (i filtri possono essere concatenati in AND) per:
  - Numero di variabili
  - Numero di vincoli
  - Tipologia di variabili (continuous, integer, binary)
- Cancellare una revisione di un modello (la cancellazione deve essere logica)
- Elencare le revisioni che sono state cancellate
- Ripristinare una revisione che è stata cancellata
- Effettuare una simulazione che consenta di variare (possono essere combinate):
  - Coefficiente di una o più variabile/i nella funzione obiettivo specificando il valore di inizio, fine ed il passo di incremento;
  - Coefficiente di una o più variabile/i nei vincoli specificando il valore di inizio, fine ed il passo di incremento;
  - La richiesta di simulazione è soggetta a preventiva disponibilità di credito. 
  - Es. variabile di vincolo in un range da 3.4 a 3.6 con passo 0.1 significa eseguire tre simulazioni con valore 3.4 3.5 e 3.6; il costo, dunque, è quello del modello per un fattore 3.
  - Le richieste di simulazione devono essere validate (es. range non ammissibili).
  - È necessario ritornare l’elenco di tutti i risultati; in base al criterio di ottimizzazione (si cerca il min o il max) ritornare anche il best result con la relativa configurazione dei coefficienti che sono stati usati.

- Le richieste devono essere validate (es. utente che scelga un evento che non esistente).
 
- Ogni utente autenticato (ovvero con JWT) ha un numero di token (valore iniziale impostato nel seed del database). 

- Nel caso di token terminati ogni richiesta da parte dello stesso utente deve restituire 401 Unauthorized.

- Prevedere una rotta per l’utente con ruolo admin che consenta di effettuare la ricarica per un utente fornendo la mail ed il nuovo “credito” (sempre mediante JWT). I token JWT devono contenere i dati essenziali.

- Il numero residuo di token deve essere memorizzato nel db sopra citato.

- Si deve prevedere degli script di seed per inizializzare il sistema. Nella fase di dimostrazione (demo) è necessario prevedere almeno 2 modelli diversi con almeno due revisioni.

- Si chiede di utilizzare le funzionalità di middleware.

- Si chiede di gestire eventuali errori mediante gli strati middleware sollevando le opportune eccezioni.

- Si chiede di commentare opportunamente il codice. 

### Framework/Librerie

- [Node.js](https://nodejs.org/it/)
- [Express](https://expressjs.com/it/)
- [Sequelize](https://sequelize.org/)
- RDBMS ([Postgres](https://www.postgresql.org/))
- [GLPK](https://github.com/jvail/glpk.js)

## Progettazione

##### 1) /newModel

La prima rotta è quella che ci permette di istanziare un nuovo modello nel database.
Innanzitutto la richiesta deve superare i controlli del middleware che controlla che lo user specificato nel token esista e che abbia credito sufficiente per creare il modello.
Solo a quel punto si potrà effettuare l'inserimento nel database.
La richiesta dovrà contenere i seguenti campi obbligatori:
* name: il nome del modello
* objective: descrizione della funzione obiettivo. Contiene i seguenti elementi:
    * direction: direzione, specifico se il problema è di max o di min
    * name: il nome della funzione obiettivo
    * vars: le variabili nella funzione obiettivo. sono definite attraverso il nome ed il coefficiente
* subjectTo: l'insieme dei vincoli a cui il modello è sottoposto. Ogni vincolo sarà composto dai seguenti campi:
    * nome
    * un insieme di variabili (nome e coefficiente)
    * "bnds", ovvero upper bound e lower bound ed il verso del vincolo

A questi si aggiungono eventuali parametri opzionali:
* bounds: vincoli sulle singole variabili
* binaries: le variabili possono assumere solo valori binari
* generals: le variabili possono assumere solo valori interi.
Nota: se una variabile non è presente né in binaries né in generals sarà assunta continua.

Di seguito un esempio di modello valido:
```
{
    "name": "mipBinGen2",
    "objective": {
        "direction": 2,
        "name": "obj",
        "vars": [
            {
                "name": "x1",
                "coef": 1
            },
            {
                "name": "x2",
                "coef": 1
            }
        ]
    },
    "subjectTo": [
        {
            "name": "c1",
            "vars": [
                {
                    "name": "x1",
                    "coef": -1
                }
            ],
            "bnds": {
                "type": 3,
                "ub": 20,
                "lb": 0
            }
        }
    ],
    "bounds": [
        {
            "name": "x1",
            "type": 4,
            "ub": 40,
            "lb": 0
        }
    ],
    "binaries": [
        "x2"
    ],
    "generals": [
        "x1"
    ]
}
```


##### 2) /solveModel

Tale rotta permette la risoluzione del modello, a patto che l'utente specifichi nella richiesta il nome del modello ed una versione.
Il middleware verifica che esista un modello con quel nome, e con quella versione specificata.
Se non specificata, di default si prende l'ultima versione disponibile.
Ecco un esempio di richiesta:
```
{
    "name": "mipBinGen2",
    "version": 1
}
```

##### 3) /admin

La rotta ```/admin``` invece è una funzionalità esclusiva per l'utente "admin", che si differenzia per l'utente comune per il ruolo diverso, specificato in fase di creazione del token.
In questo caso la richiesta non ha un body a sé associato, e si gestisce tutto a livello di token, che conterrà, come anticipato, il ruolo (che deve essere 2), l'email del ricevente (che sarà verificata dal middleware), ed il credito da aggiungere a quell'utente.

##### 4) /newReview

Questa rotta si occupa di inserire una nuova "revisione" di un modello, ovvero una sua versione differenziata (ad esempio cambiando i vincoli subjectTo).
In questo caso abbiamo deciso di gestire le diverse versioni di uno stesso modello inserendole nel database con un numero di ```version``` diverso, che parte da 1 per il modello, e si incrementa per ogni versione creata.
In questo caso la richiesta conterrà un modello (di cui si controlla la validità come nella rotta ```/newModel```), con la caratteristica che il nome deve già essere presente nel database, per potergli associare una versione coerente.
Qui un esempio di richiesta:
```
{
  "name": "mipBinGen2",
  "objective": {
    "direction": 2,
    "name": "obj",
    "vars": [
      {
        "name": "x1",
        "coef": 2
      },
      {
        "name": "x2",
        "coef": 3
      },
      {
        "name": "x3",
        "coef": 4
      },
      {
        "name": "x4",
        "coef": 5
      }
    ]
  },
  "subjectTo": [
    {
      "name": "c1",
      "vars": [
        {
          "name": "x1",
          "coef": -1
        },
        {
          "name": "x2",
          "coef": 1
        },
        {
          "name": "x3",
          "coef": 1
        },
        {
          "name": "x4",
          "coef": 10
        }
      ],
      "bnds": {
        "type": 3,
        "ub": 20,
        "lb": 0
      }
    },
    {
      "name": "c2",
      "vars": [
        {
          "name": "x1",
          "coef": 1
        },
        {
          "name": "x2",
          "coef": -3
        },
        {
          "name": "x3",
          "coef": 1
        }
      ],
      "bnds": {
        "type": 3,
        "ub": 30,
        "lb": 0
      }
    },
    {
      "name": "c3",
      "vars": [
        {
          "name": "x2",
          "coef": 1
        },
        {
          "name": "x4",
          "coef": -3.5
        }
      ],
      "bnds": {
        "type": 5,
        "ub": 0,
        "lb": 0
      }
    }
  ],
  "bounds": [
    {
      "name": "x1",
      "type": 4,
      "ub": 40,
      "lb": 0
    },
    {
      "name": "x4",
      "type": 4,
      "ub": 3,
      "lb": 2
    }
  ],
  "generals": [
    "x4"
  ]
}
```

##### 5) /filterReviews

Una volta inserite le revisioni di un modello, a questo punto la nostra applicazione mette a disposizione una rotta per filtrare le rotte di un modello.
I campi su cui si può filtrare sono ovviamente il nome del modello su cui cercare le revisioni da filtrare, la data di creazione e numero di variabili.
Come in tutte le altre richieste, ci sarà uno strato di middleware per controllare che i campi siano inseriti e siano corretti.
E quindi se ad esempio volessimo filtrare tutte le revisioni di un modello che si chiama ```mip_with_binaries```, creato il giorno "7/17/2022" e che abbia 3 variabili, bisogna inviare una richiesta di questo tipo:

```
{
  "name": "mip_with_binaries",
  "date": "7/17/2022",
  "numvars":3
}
```

##### 6) /filterModels

Questa rotta filtra i modelli presenti attualmente nel database.
La richiesta è molto versatile, avendo tutti i campi opzionali, ed ovviamente se non si specifica un campo non verrà fatto alcun filtro su quel campo.
Detto ciò, la richiesta viene strutturata come segue:
* numvars: numero di variabili
* numsub: numero di vincoli presenti nel modello
* binaries: valore binario per filtrare la presenza o meno di variabili binarie
* generals: valore binario per filtrare la presenza o meno di variabili intere
* continuous: valore binario per filtrare la presenza o meno di variabili continue

Quindi riportiamo per completezza un esempio di richiesta valida:
```
{
    "numvars":2,
    "binaries":0,
    "generals":1
}
```
##### 7) /deleteReview

Questa rotta ci permette di eliminare una revisione di un modello. Quindi nella richiesta dovremo specificare il nome del modello da cui cercare la revisione, e la versione, per segnalare la revisione che si intende cancellare.
Qui il middleware controlla la coerenza dei valori inseriti nella richiesta.
Nota: la cancellazione è solo logica, pertanto abbiamo deciso di associare ad ogni modello o revisione un campo ```valid``` che è un booleano che verrà settato a ```false``` se il modello viene cancellato.
Esempio di richiesta corretta:
```
{
    "name":"mip",
    "version":2
}
```

##### 8) /getDeletedReview

Di seguito, è stata implementata una rotta per elencare tutte le revisioni/modelli cancellati nel corso della manipolazione del database.
Facciamo notare che qui non c'è alcun body nella richiesta, in quanto le revisioni che vengono mostrate non sono filtrate per modelli, quindi non c'è nulla da specificare.

##### 9) /restoreReview

La penultima rotta ci dà la possibilità di ripristinare una eventuale revisione cancellata, per rimediare ad esempio ad eventuali errori.

Per completezza, qui riportiamo un esempio di richiesta valida:
```
{
    "name":"mip",
    "version":2
}
```
##### 10) /getSimulation

L'ultima rotta della nostra applicazione è quella che realizza le cosiddette "simulazioni" di un modello.
La simulazione permette di variare i seguenti campi:
*	Coefficiente di una o più variabile/i nella funzione obiettivo specificando il valore di inizio, fine ed il passo di incremento;
*	Coefficiente di una o più variabile/i nei vincoli specificando il valore di inizio, fine ed il passo di incremento;

Ovviamente la richiesta di simulazione è soggetta a preventiva disponibilità di credito, calcolata come costo del modello da simulare moltiplicato per il numero totale di iterazioni che verranno realizzate.
Inoltre, come da specifica, si ritorna l'elenco di tutti i risultati, ed in fondo alla lista si ritorna anche il best result, scelto coerentemente con la direzione del problema (a seconda che sia un problema di massimo o di minimo), con la relativa configurazione dei coefficienti associati al modello.

Qui riportiamo dunque un esempio di simulazione, in cui si modifica il coefficiente x1 nella funzione obiettivo, ed il coefficiente della variabile decisionale x2 nel vincolo chiamato "c1":
```
{
    "name": "mip_with_binaries",
    "version": 1,
    "objective": [
        {
            "name": "x1",
            "start": 0.9,
            "end": 1.0,
            "step": 0.1
        }
    ],
    "subjectTo": [
        {
            "name": "c1",
            "vars": [
                {
                    "name": "x2",
                    "start": 2.2,
                    "end": 2.4,
                    "step": 0.1
                }
            ]
        }
    ]
}
```


### Diagrammi UML

Di seguito i diagrammi UML:

* Use Case Diagram
![Alt text](/UML/UseCase.png?raw=true "Use Case Diagram")


* Sequence Diagram

### Descrizione pattern utilizzati

## Avvio di docker

## Test
