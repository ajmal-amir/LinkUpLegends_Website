const event = require('../models/event');

exports.isGuest = (req, res, next) =>{
    if(!req.session.user){
        return next()
    }else {
        req.flash('error', ' You have already logged in!')
        return res.redirect('/user/profile')
    }
};
// Now we call this middelerare fucntion in the user routs. 


exports.isLoggedIn = (req, res, next) =>{
    if(req.session.user){
        return next()
    }else {
        req.flash('error', ' You need to log in Please!')
        return res.redirect('/user/login')
    }
};

// We are going to check if the user is the author of the event
exports.isAuthor = (req, res, next)=>{
    let id = req.params.id;
     //an objectId is a 24-bit Hex string
     if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }
    event.findById(id)
    .then(event =>{
        if(event){
            if(event.host == req.session.user){
                return next();
            }else{
                let err = new Error('Unauthorized to access the resource');
                    err.status = 401; 
                    return  next(err); 
            }
        }else{
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }

    }).catch(err=>next(err)); 
}

