import jwt from 'jsonwebtoken'


const userAuth = (req, res, next ) => {

    try {
        
        const {token} = req.headers;

        if(!token){
            return res.json({success:false, message: 'Please Login first.'})
        }

        const token_decoding = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: token_decoding.id };

        next();

    } catch (error) {
        console.error("Error in user:", error);
        res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}


export default userAuth
