import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperCore from 'swiper'
// import { Navigation } from 'swiper/modules';
import { EffectCards } from 'swiper/modules';
import 'swiper/css/bundle'

export default function About() {

  // SwiperCore.use(Navigation);
  const [listings, setListings] = useState([]);


  useEffect(() => {

    const fetchListings = async () => {
        try {
            const res = await fetch(`/api/listing/get?limit=10`)
            const data = await res.json();
            setListings(data);
        } catch (error) {
            console.log(error);
        }
    }

    fetchListings();

}, []);



    return (
        <div className='max-w-6xl mx-auto mt-10 px-5'>
            <h1 className='font-bold text-3xl mb-4 text-slate-800'>About Rentify Estate</h1>
            <p className='mb-4 text-slate-700'>Rentify Estate is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.</p>
            <p className='mb-4 text-slate-700'>Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.</p>
            <p className='mb-4 text-slate-700'>Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.</p>

            <div className='max-w-xl mx-auto'>
              <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]} loop className="mySwiper my-7">
              {
                  listings.length > 0 && listings.map((listing) => (
              
                    <SwiperSlide key={listing._id}>
                          <Link to={`/listing/${listing._id}`}>
                            <div className="h-[300px]" style={{background: `url(${listing.imageUrls[0]}) center`, backgroundSize: "cover"}}></div>
                          </Link>
                    </SwiperSlide>
              
                  ))
              }
              </Swiper>
            </div>
        </div>
    )
}
