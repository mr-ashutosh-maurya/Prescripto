import jwt from 'jsonwebtoken'


const doctorAuth = (req, res, next ) => {

    try {
        
        const token = req.headers.dtoken; // use lowercase
        if (!token) {
        return res.json({ success: false, message: 'Please login first.' });
        }

        const token_decoding = jwt.verify(token, process.env.JWT_SECRET);
        req.docId = token_decoding.id;

        next();

    } catch (error) {
        console.error("Error in user:", error);
        res.json({
        success: false,
        message: error.message,
        });
    }
}


export default doctorAuth
