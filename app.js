const express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/**
 * Supporto al parsing di url e json
 
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
*/

function isJsonString(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

app.use('/newModel', (err, req, res, next) => {
    if(isJsonString(req.body)){
        next();
    } else {
        console.log("Not valid JSON");
        res.sendStatus(403);
    }
})

app.use('/', require("./routes/pages"));
app.listen(3000, () => {
    console.log("Server stared on port 3000");
}
)