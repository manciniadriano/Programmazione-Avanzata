

var objective = [
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
                "name": "x2",
                "start": 4.3,
                "end": 4.4,
                "step": 0.1
            }
        ]
    }
]

var array = [];
objective.map((elem) => {
    elem.vars.map((item) => {
        let appoggio = [];
        let i = Math.round((item.end - item.start) / item.step);
        for (var n = 0; n <= i; n++) {
            var object = { name: item.name, value: item.start + item.step * n };
            appoggio.push(object);
        }
        array.push(appoggio);
    })
});
console.log(array);


const cartesian = (...f) =>
    f
        .map((a) =>
            a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))
        )
        .flat();

let output = cartesian(array);
console.log(output);
