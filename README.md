# Programmazione-Avanzata

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

- Si chiede di commentare opportunamente il codice.

### Framework/Librerie

- [Node.js](https://nodejs.org/it/)
- [Express](https://expressjs.com/it/)
- [Sequelize](https://sequelize.org/)
- RDBMS ([Postgres](https://www.postgresql.org/))
- [GLPK](https://github.com/jvail/glpk.js)
