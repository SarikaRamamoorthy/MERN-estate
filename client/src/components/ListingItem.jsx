import { Link } from "react-router-dom"
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem({listing}) {
    return (
        <div className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg w-full sm:w-[330px]">
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="cover image of the house" className="h-[320px] sm:h-[220px] object-cover w-full hover:scale-105 transition-scale duration-300"/>
                <div className="p-3 flex flex-col gap-2 w-full">
                  <p className="text-lg font-semibold text-slate-700 truncate">{listing.name}</p>
                  <div className="flex text-center gap-1">
                    <MdLocationOn className="w-4 h-4 text-green-700 my-auto"/>
                    <p className="truncate text-sm text-gray-600">{listing.address}</p>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{listing.description}</p>
                  <p className="font-semibold mt-2 text-slate-500"><span>Rs </span>
                      {
                        listing.offer ? listing.discountPrice.toLocaleString('en-In') :  listing.regularPrice.toLocaleString('en-IN')
                      }
                      {
                        listing.type === 'rent' && ' / month'
                      }
                  </p>
                  <div className="flex gap-5 text-slate-700">
                      <p className="font-bold text-xs">{listing.bedrooms > 1 ? listing.bedrooms + ' beds' : listing.bedrooms + ' bath'}</p>
                      <p className="font-bold text-xs">{listing.bathrooms > 1 ? listing.bathrooms + ' baths' : listing.bathrooms + ' bed'}</p>
                  </div>
                </div>
            </Link>
        </div>
    )
}
