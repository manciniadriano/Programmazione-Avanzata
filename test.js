var objective = 
    [
        {
            "name": "x1",
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
                "name": "x2",
                "start": 3.4,
                "end": 3.5,
                "step": 0.1
            }
        ]
    },
    {
        "name": "c2",
        "vars": [
            {
                "name": "x1",
                "start": 4.3,
                "end": 4.4,
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

const cartesian = (...f) =>
    f
        .map((a) =>
            a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))
        );

let output = cartesian(array, array1);
console.log(output);
let final = cartesian(output, array1);
//console.log(final);
//console.log(final[0].length);
//let final = cartesian(output[0], output[1]);
//let final = cartesian(output, array1)
//console.log(final[0])

