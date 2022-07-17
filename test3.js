model = {
    "name": "lp",
    "version": 1,
    "objective": [
        {
            "name": "x1",
            "start": 0.7,
            "end": 0.8,
            "step": 0.1
        }
    ],
    "subjectTo": [
        {
            "name": "cons1",
            "vars": [
                {
                    "name": "x1",
                    "start": 1.4,
                    "end": 1.5,
                    "step": 0.1
                }
            ]
        }
    ]
}

let bestModel = null;

bestModel = Object.create(model);
console.log(bestModel)
console.log(bestModel
    .objective)