import React, { useState, useEffect } from 'react'
import { gapi, loadAuth2 } from '@reinaldoacdc/gapi-script'
import { UserCard } from './UserCard'
import './GoogleLogin.css'
import { GoogleDrive } from './GoogleDrive'

export const GoogleLogin = () => {
  const [user, setUser] = useState(null)
  const SCOPES = 'https://www.googleapis.com/auth/drive'

  useEffect(() => {
    const setAuth2 = async () => {
      const auth2 = await loadAuth2(gapi, process.env.REACT_APP_CLIENT_ID, SCOPES)
      if (auth2.isSignedIn.get()) {
        updateUser(auth2.currentUser.get())
      } else {
        attachSignin(document.getElementById('customBtn'), auth2)
      }
    }
    setAuth2()
  }, [])

  useEffect(() => {
    if (!user) {
      const setAuth2 = async () => {
        const auth2 = await loadAuth2(gapi, process.env.REACT_APP_CLIENT_ID, SCOPES)
        attachSignin(document.getElementById('customBtn'), auth2)
      }
      setAuth2()
    }
  }, [user])

  const updateUser = (currentUser) => {
    const name = currentUser.getBasicProfile().getName()
    const email = currentUser.getBasicProfile().getEmail()
    const profileImg = currentUser.getBasicProfile().getImageUrl()
    setUser({
      name: name,
      profileImg: profileImg,
      email
    })
  }

  const attachSignin = (element, auth2) => {
    auth2.attachClickHandler(element, {},
      (googleUser) => {
        updateUser(googleUser)
      }, (error) => {
        console.log(JSON.stringify(error))
      })
  }

  const signOut = () => {
    const auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut().then(() => {
      setUser(null)
    })
  }

  if (user) {
    return (
      <div className="container">
        <UserCard user={user} />
        <GoogleDrive user={user} />
        <div id="" className="btn logout" onClick={signOut}>
          Logout
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div id="customBtn" className="btn login">
        Login
      </div>
    </div>
  )
}
