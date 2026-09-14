import React from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { Navigate } from 'react-router-dom'
import Loading from "./Loading"
function Protected({children}) {

const {user, loading} = useAuth()


if (loading) {

return  <Loading/>;
}

if(!user){
   return <Navigate to="/login"/>
}


  return children;
}

export default Protected
