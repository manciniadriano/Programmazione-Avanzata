

var objective =
    [
        {
            "name": "x1",
            "start": 0.7,
            "end": 0.8,
            "step": 0.1
        },
        {

            "name": "x2",
            "start": 0.7,
            "end": 0.8,
            "step": 0.1

        },
        {

            "name": "x3",
            "start": 0.7,
            "end": 0.8,
            "step": 0.1

        }
    ]

var subject = [
    {
        "name": "c1",
        "vars": [
            {
                "name": "x1",
                "start": 3.4,
                "end": 3.5,
                "step": 0.1
            },
            {

                "name": "x3",
                "start": 0.7,
                "end": 0.8,
                "step": 0.1
    
            }
        ]
    },
    {
        "name": "c2",
        "vars": [
            {
                "name": "x2",
                "start": 4.3,
                "end": 4.4,
                "step": 0.1
            },
            {

                "name": "x4",
                "start": 0.7,
                "end": 0.8,
                "step": 0.1
    
            }
        ]
    }
]

var array = [];
subject.map((elem) => {
    elem.vars.forEach((item) => {
        let appoggio = [];
        let i = Math.round((item.end - item.start) / item.step);
        for (var n = 0; n <= i; n++) {
            var object = { namesubject: elem.name, name: item.name, value: item.start + item.step * n };
            appoggio.push(object);
        }
        array.push(appoggio);
    })
})

var array1 = [];

objective.map((elem) => {
    let appoggio = [];
    let i = Math.round((elem.end - elem.start) / elem.step); // numero di step
    for (var n = 0; n <= i; n++) {
        var object = { name: elem.name, value: elem.start + elem.step * n };
        appoggio.push(object);
    }
    array1.push(appoggio);
});

const cartesian =
    (...a) => a.reduce((a, b) => a.map((f) => f.map(d => b.map((g) => g.map(e => [f, g].flat())))));
/*
      function cartesianProduct(...arrays) {
          return [...arrays].reduce(
            (a, b) =>
              a.map((x) => b.map((y) => x.concat(y))).reduce((a, b) => a.concat(b), []),
            [[]]
          );
        }
*/
//let output = cartesianProduct(array, array1);
console.log(array);
// serve per effettuare il prodotto cartesiano su objective
const cartesianObjective = (a) => a.reduce((a, b) => a.flatMap(d => b.map((e) => [d, e].flat())));
const cartesianSubjectTo = (a) => a.reduce((a, b) => a.flatMap(d => b.map((e) => [d, e].flat())));

let ciao = cartesianSubjectTo(array);
let ciao1 = cartesianObjective(array1);
console.log(JSON.stringify(ciao));
//console.log("subjective:   " + JSON.stringify(ciao));
//console.log("objective:   " + JSON.stringify(ciao1));

const cartesianComb = (array, array2) => array.flatMap((a) => array2.map(b => [a, b].flat()));
//console.log("finale: " + JSON.stringify(cartesianComb(ciao, ciao1).length));
//let elem = cartesian(ciao,ciao1);
//console.log(JSON.stringify(elem))
/*console.log(JSON.stringify(array[0]))
let ciao = cartesian(JSON.stringify([array[0]], [array[1]]))
console.log(ciao);*/
//let final = cartesian(array, array1);
//console.log(JSON.stringify(output));
//console.log(JSON.stringify(final));



