import React, { useEffect } from 'react'
import { Button } from '../button'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    const {user, isSignedIn} = useUser();

    useEffect(() => {
      console.log(isSignedIn);
      if (isSignedIn) {
          const email = user?.primaryEmailAddress?.emailAddress;
          const fullName = user?.fullName;
          console.log("sending request")
          axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/check-or-create-user`, { email, fullName })
              .then(response => {
                  console.log(response.data);
              })
              .catch(error => {
                  console.error('There was an error!', error);
              });
      }
  }, [isSignedIn, user]);

  return (
    <div className='p-3 px-5 flex justify-between shadow-md'>
      <img src="/logo.svg" alt="" width={50} height={50} />
      {
        isSignedIn ? 
        <div className='flex items-center gap-2'>
            <Link to={'/dashboard'}>
                <Button>Dashboard</Button>
            </Link>
            <UserButton/>
        </div> :
        <div>
            <Link to={'/auth/sign-in'}>
                <Button>Get Started</Button>
            </Link>
        </div>
      }
    </div>
  )
}

export default Header
