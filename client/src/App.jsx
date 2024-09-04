import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import About from './pages/About'
import CreateListing from './pages/CreateListing'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import UpdateListing from './pages/UpdateListing'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element = { <Home />} />
        <Route path='/sign-up' element = { <SignUp />} />
        <Route path='/sign-in' element = { <SignIn />} />
        <Route element={ <PrivateRoute/> }>
          <Route path='/profile' element = { <Profile />} />
          <Route path='/create-listing' element = { <CreateListing />} />
          <Route path='/update-listing/:listingId' element = { <UpdateListing />} />
        </Route>
        <Route path='/about' element = { <About />} />
      </Routes>
    </BrowserRouter>
  )
}
