// low level design model

function createElement(elementModel) {
    return async function (req, res) {
        try {
            let element = await elementModel.create(req.body);

            res.status(200).json({
                element: element
            })

        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                message: "Server Error"
            })
        }
    }
}

function deleteElement(elementModel) {
    return async function (req, res) {
        let {
            id
        } = req.params; //  ye id mongoDb deta hai

        try {

            let element = await elementModel.findByIdAndDelete(id);
            res.status(200).json({
                message: "element successfully deleted",
                element: element
            })

        } catch (error) {
            res.status(500).json({
                message: "Server error "
            })
        }
    }
}


function getElement(elementModel) {


    return async function (req, res) {

        let {
            id
        } = req.params; //  ye id mongoDb deta hai

        try {
            console.log(id);
            let element = await elementModel.findById(id);
            console.log(element);
            res.status(200).json({
                message: "element found",
                element: element
            })

        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                message: "Server error "
            })
        }


    }

}


function getElements(elementModel) {
    return async function (req, res, next) {
        try {
            console.log('Get function');

            let reqPromise;

            if (req.query.myQuery) {
                reqPromise = elementModel.find(reqy.query.myQuery)
            } else {
                reqPromise = elementModel.find();
            }


            // sort
            if (req.query.sort) {
                reqPromise = reqPromise.sort(req.query.sort)
            }

            // select
            if (req.query.select) {
                let params = req.query.split("%").join(" ");
                reqPromise = reqPromise.select(params);
            }

            //pagination
            let page = Number(req.query.page) || 1; // page in query will be shown or by def 1 page
            let limit = Number(req.query.limit) || 4; // limit passed in query or 4 items on page
            let toSkip = (page - 1) * limit; // items to skip when you are on a certain page
            reqPromise = reqPromise
                .skip(toSkip)
                .limit(limit);



            let elements = await reqPromise;

            // let element = await elementModel.find();
            if (elements) {
                return res.json(elements);
            } else {

                return res.json({
                    message: "element not found"
                })
            }
        } catch (error) {
            console.log(error.message);
            return res.json({
                message: error.message
            })
        }



    }
}




function updateElement(elementModel) {
    return async function (req, res) {

        let {
            id
        } = req.params;
        try {

            if (req.body.password || req.body.confirmPassword) {
                return res.json({
                    message: "Cannot update this field"
                })
            }

            let element = await elementModel.findById(id);
            if (element) {

                req.body.id = undefined; // id vali delete kr di

                for (let key in req.body) {
                    element[key] = req.body[key];
                }

                // yaha pe save krte tym validators/hooks mat chalao
                await element.save({
                    validateBeforeSave: false
                })

                res.status(200).json({
                    message: "element profile updated",
                    element: element
                })
            } else {
                res.status(401).json({
                    message: "element not found"
                })
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                message: "Server Error"
            })
        }
    }
}


module.exports.createElement = createElement;
module.exports.deleteElement = deleteElement;
module.exports.getElement = getElement;
module.exports.getElements = getElements;
module.exports.updateElement = updateElement;