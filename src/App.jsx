
import { Route, Routes } from 'react-router-dom'
import Categories from './Components/Categories'
import Header from './Components/Header'
import Home from './Home'
import SellArt from './AdminComponents/SellArt'
import Yourwork from './Components/Shop'
import WorkPage from './Pages/WorkPage'
import Artsdetail from './Pages/Artsdetail'
import { CartProvider } from './CartContext'
import CartPage from './Pages/Checkout'
import StripePay from './Components/ProductDisplay'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './Components/CheckoutFrom'
import Checkout from './Pages/Checkout'
import Thankyou from './Pages/Thankyou'
import { SearchProvider } from './SearchContext'
import { CsrfTokenProvider } from './CsrfTokenContext'
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51KAaveSD0NFwg40BlLVObPJPXdLJzVdrEdi2tuSZDTagj35JSk30LeWESHCRr4BcF0pjtZcqfBeXSpDZeorJdjVm0020txN4QA');


function App() {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: '{{CLIENT_SECRET}}',
  };
  return (
    <>
    <CsrfTokenProvider>
    <CartProvider>
      <SearchProvider>
      <Header/>
      <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path="/sellart" element={<SellArt/>}/>
        <Route path='/shop' element={<Yourwork/>}/>
        <Route path='/art/:artId' element={<WorkPage/>}/>
        <Route path='/artpage/:artId' element={<Artsdetail/>}/>
        <Route path='/edit/:artId' element={<SellArt/>}/>
        <Route path="/checkout" element={<Checkout />} />
        <Route path='/ProductDisplay' element={<CheckoutForm/>} />
        <Route path='/Thankyou' element={<Thankyou/>} />
        </Routes>
        </SearchProvider>
      </CartProvider>
      </CsrfTokenProvider>
    </>
  )
}

export default App
