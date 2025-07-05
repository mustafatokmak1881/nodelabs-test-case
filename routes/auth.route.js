const { Router } = require("express");
const router = Router();


router.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    res.send("Registered");
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    res.send("Logged in");
});



module.exports = router;