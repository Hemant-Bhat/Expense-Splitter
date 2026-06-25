import { Router } from "express";

const router = new Router();

router.post('/create', (req, res) => {
    console.log(req, res);
    try {
        res.status(200).json({ success: true, message: '/group/create' })
    } catch (err) {

    }
})

export { router as groupRouter};