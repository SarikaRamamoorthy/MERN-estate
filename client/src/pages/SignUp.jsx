import {Link} from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-5'>
        <input type="text" placeholder='username' className='p-3 border rounded-lg' id = 'username' />
        <input type="email" placeholder='email' className='p-3 border rounded-lg' id = 'email' />
        <input type="password" placeholder='password' className='p-3 border rounded-lg' id = 'password' />
        <button className='bg-slate-700 p-3 my-5 rounded-lg text-white hover:opacity-95 disabled:opacity-80 uppercase'>Sign Up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span  className='text-blue-500'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}
