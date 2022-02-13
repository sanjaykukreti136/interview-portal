
function createElement(model_name){
    return async function(req , res){
        try{
            let user = await model_name.create(req.body);
            return res.status(200).json({
                element : user
            })
        }
        catch(err){
            return res.status(400).json({message : err.message});
        }
    }
}

function getElements(model_name){
    return async function(req, res){
        try{
            let elementsPromise ;
            // mongodb query
            if(req.query.myQuery){
                elementsPromise = model_name.find(req.query.myQuery);
            }else{
                elementsPromise  =model_name.find();
            }

            //sort products
            if(req.query.sort){
                elementsPromise = elementsPromise.sort(req.query.sort);
            }

            // selects
            if(req.query.select){
                let params = req.query.select.split("%").join(" ");
                elementsPromise  = elementsPromise.select(params);
            }

            // pagination
            let page  = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 4;
            let toSkip = (page - 1)*limit;
            elementsPromise = elementsPromise.skip(toSkip).limit(limit);
            let elements = await elementsPromise;


           return res.status(200).json({element : elements})
        }
        catch(err){
            return res.status(400).json({message : err.message});
        }
    }
}

function getElement(model_name){
    return async function(req , res){
        let id  = req.params;
        try{
            let users = await model_name.findById(id);
            return res.status(200).json({users : users})
         }
         catch(err){
             return res.status(400).json({message : err.message});
         }
    }
}


function updateElement(){
    return async function (req , res){
        let id = req.params;
        try{
            let user = await userModel.findById(id);
            if(user){
    
                if(req.body.password || req.body.confirmPassword){
                    return res.status(400).json({ message : "password can't change" })
                }
    
                for(let key in req.body){
                    user[key] = req.body[key];
                }
                await user.save({ validateBeforeSave : false });
                res.status(200).json({user : user})
            }else{
                return res.status(400).json({message : "wrong id , user not found"});
            }
        }
        catch(err){
            return res.status(400).json({message : err.message});
        }
    }
}

function deleteElement(model_name){
    return async function (req, res){
        let id = req.params;
        try{
            let user = await model_name.findByIdAndDelete(id);
            res.status(200).json({user : user});
        }catch(err){
            return res.status(400).json({message : err.message})
        }
    }
}

module.exports.createElement = createElement;
module.exports.getElement = getElement;
module.exports.getElements = getElements;
module.exports.updateElement = updateElement;
module.exports.deleteElement = deleteElement;