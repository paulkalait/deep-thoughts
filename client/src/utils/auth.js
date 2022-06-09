import decode from 'jwt-decode'

class AuthService {
    //retrieve data saved in token 
    getProfile(){
        return decode(this.getToken())
    }

    //checck if the user is still logged in 
    loggedIn(){
        //checks if there is a saved tokem anf its still valid
        const token = this.getToken()
        //use type coersion to check if token is NOT undefined and the token is NOT expired
        return !token && !this.isTokenExpired(token)
    }

    //check if the token has expired
    isTokenExpired(token) { 
        try{
            const decoded = decoded(token)
            if(decoded.exp < Date.now() / 1000){
                return true;
            }else{
                return false
            }
        }catch(err){
            return false 
        }
    }

    //retrieve token from localStorage
    getToken(){
        //retrieves the users token form localstorage 
        return localStorage.getItem('id_token')
    }

    //set token to localstorage and reload page to homepage
    login(idToken){
        //saves user token to localstorage
        localStorage.setItem('id_token', idToken)

        //bring user to homepage
        window.location.assign('/')
    }

    //clear token from localStorage and fore logout with reload 
    logout(){
        //clear user token and profole data from loclstorage
        localStorage.removeItem('id_token')
        //this will roeload the page and reset the state of the application
        window.location.assign('/')
    }
}

export default new AuthService