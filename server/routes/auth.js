import { Router } from "express";

const router = Router();

router.post('/login', (req, res) => {
    console.log(req.body)
    const { password, email } = req.body;

    if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
    });
}

    // User Validate Logic

    console.log(password, email);
    res.send({ email, password });
});

router.post('/signup', (req, res) => {
    console.log(req.body)
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({
      message: 'Email, Password and Confrim password are required'
        });
    
    }
    if(password != confirmPassword) {
        return res.status(400).json({ message: 'Password and Confirm password doesn\'t match.'})
    }
    
    // User Insert Logic


    res.send({ email, password, confirmPassword });
});

export default router;