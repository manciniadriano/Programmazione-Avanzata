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
