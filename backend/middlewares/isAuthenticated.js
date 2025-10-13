import jwt from 'jsonwebtoken'


const isAuthenticated = (req, res, next ) => {

    try {
        
        const {token} = req.headers;
        console.log(token)

        if(!token){
            return res.json({success:false, message: 'Please Login first.'})
        }

        const token_decoding = jwt.verify(token, process.env.JWT_SECRET);

        if(token_decoding !== process.env.ADMIN_EMIAL+process.env.ADMIN_PASSWORD){
            return res.json({success:false, message: 'Please enter valid.'})
        }

        next();

    } catch (error) {
        console.error("Error in addDoctor:", error);
        res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}


export default isAuthenticated
