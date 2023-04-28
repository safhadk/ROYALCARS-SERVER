import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) return res.status(404).json({ message: "Authentication failed: no token provided." });
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified.role=="user"){
            req.user = verified;
            next();
        }else{
            return res.status(404).json({ message: "Authentication failed: role not matched." });  
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Authentication failed: invalid token." });
    }
};

export const verifyTokenOwner = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) return res.status(404).json({ message: "Authentication failed: no token provided." });
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified.role=="owner"){
            req.user = verified;
            next();
        }else{
            return res.status(404).json({ message: "Authentication failed: role not matched." });  
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Authentication failed: invalid token." });
    }
};

export const verifyTokenAdmin = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) return res.status(404).json({ message: "Authentication failed: no token provided." });
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified.role=="admin"){
            req.user = verified;
            next();
        }else{
            return res.status(404).json({ message: "Authentication failed: role not matched." });  
        }
        
    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Authentication failed: invalid token." });
    }
};



export const generateAuthToken = (user) => {
    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email, phone: user.phone,role:'user' }, jwtSecretKey);
    return token;
};

export const adminToken = (data) => {
    console.log(data, "token data");
    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ _id: data._id, email: data.email,role:'admin' }, jwtSecretKey);
    return token;
};

export const generateAuthTokenOwner = (owner) => {
    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ _id: owner._id, name: owner.name, email: owner.email, phone: owner.phone,role:'owner' }, jwtSecretKey);
    return token;
};
