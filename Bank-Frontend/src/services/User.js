export const getUserHours = async (id) => {  
    try {
        const res = await fetch(`https://localhost:7186/api/home/GetUserHours/${id}`, {
            method: "GET", 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': '*',
            }, 
        }) 
        return res.json()
    } catch (error) {
        console.log('error getting user hours: ', error) 
    }
}

export const createdb = async () => { 
    console.log('createdb') 
    try {
        const res = await fetch(`https://localhost:7186/api/home/DBInit`, {
            method: "GET", 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': '*',
            }, 
        }) 
        return res.json()
    } catch (error) {
        console.log('error getting user hours: ', error) 
    }
}

 