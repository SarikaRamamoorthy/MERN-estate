import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle'
import ListingItem from '../components/ListingItem';

export default function Home() {

    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    SwiperCore.use(Navigation);

    // console.log(saleListings);
    // console.log(rentListings);
    // console.log(offerListings);
    

    useEffect(() => {

        const fetchOfferListings = async () => {
            try {
                const res = await fetch(`/api/listing/get?offer=true&limit=4`)
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings();
                // calling functions one by one so they will be not be fetched at a same time
            } catch (error) {
                console.log(error);
                // we don't want to show error to user coz they can see top section even this one not appears
            }
        }

        const fetchRentListings = async () => {
            try {
                const res = await fetch(`/api/listing/get?type=rent&limit=4`)
                const data = await res.json();
                setRentListings(data);
                fetchSaleListings();
            } catch (error) {
                console.log(error);
            }
        }
        
        const fetchSaleListings = async () => {
            try {
                const res = await fetch(`/api/listing/get?type=sale&limit=4`)
                const data = await res.json();
                setSaleListings(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchOfferListings();

    }, []);

    return (
        <div className="">
            {/* top */}
            <div className="flex flex-col gap-6 py-28 px-3 mx-auto max-w-6xl">
                <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
                    Find your next <span className='text-slate-500'>perfect</span> <br />place with ease
                </h1>
                <div className="text-gray-500 text-xs sm:text-sm ">
                    Rentify Estate is the best place to find your next perfect place to live. <br />
                    We had a wide range of properties for you to choose from.
                </div>
                <Link to={`/search`} className='text-xs sm:text-sm text-blue-800 hover:underline font-bold'>Let's Start now...</Link>
            </div>


            {/* swiper */}

            <Swiper navigation loop>

            {
                offerListings.length > 0 && offerListings.map((listing) => (
                    
                    <SwiperSlide key={listing._id}>
                        <div className="h-[500px]" style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover"}}></div>

                    </SwiperSlide>
                    
                ))
            }

            </Swiper>


            {/* listing results for offer, sale and rent */}

            <div className="max-w-6xl mx-auto flex flex-col gap-8 my-10 p-3">
                {
                    offerListings && offerListings.length > 0 && (
                        <div className="">
                            <div className="flex flex-col my-4">
                                <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                                <Link to={'/search?offer=true'} className='text-blue-800 hover:underline'>Show more offers</Link>
                            </div>
                            <div className="flex flex-wrap gap-7">
                                {
                                    offerListings.map((listing) => (
                                        <ListingItem listing={listing} key={listing._id}/>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                {
                    rentListings && rentListings.length > 0 && (
                        <div className="">
                            <div className="flex flex-col my-4">
                                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                                <Link to={'/search?type=rent'} className='text-blue-800 hover:underline'>Show more places for rent</Link>
                            </div>
                            <div className="flex flex-wrap gap-7">
                                {
                                    rentListings.map((listing) => (
                                        <ListingItem listing={listing} key={listing._id}/>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                {
                    saleListings && saleListings.length > 0 && (
                        <div className="">
                            <div className="flex flex-col my-4">
                                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                                <Link to={'/search?type=sale'} className='text-blue-800 hover:underline'>Show more places for sale</Link>
                            </div>
                            <div className="flex flex-wrap gap-7">
                                {
                                    saleListings.map((listing) => (
                                        <ListingItem listing={listing} key={listing._id}/>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
    )
}