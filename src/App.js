import React, { useEffect } from 'react'
import { gapi, loadGapiInsideDOM, loadAuth2 } from '@reinaldoacdc/gapi-script'

import { GoogleLogin } from './components/GoogleLogin'
import './App.css'

function App() {
  useEffect(() => {
    const setAuth2 = async () => {
      await loadGapiInsideDOM()
    }
    setAuth2()
  }, [])


  return (
    <div className="App">
      <GoogleLogin />
    </div>
  )
}

export default App
