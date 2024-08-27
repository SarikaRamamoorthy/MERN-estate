export default function createListing() {
    return(
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className="font-bold text-3xl text-center my-7">Create a Listing</h1>
            <form className="flex flex-col md:flex-row gap-7 text-center">
                <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Name" className="p-3 rounded-lg border" id="name" required maxLength='62' minLength='5'/>
                    <textarea type="text" placeholder="Description" className="p-3 rounded-lg border" id="description" required/>
                    <input type="text" placeholder="Address" className="p-3 rounded-lg border" id="address" required/>
                    <div className="flex flex-row flex-wrap gap-5 justify-between p-3">
                        <div className="flex flex-row gap-2">
                            <input type="checkbox" id="sale" className='w-5'/>
                            <span>Sell</span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <input type="checkbox" id="rent" className='w-5'/>
                            <span>Rent</span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <input type="checkbox" id="parking" className='w-5'/>
                            <span>Parking spot</span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <input type="checkbox" id="furnished" className='w-5'/>
                            <span>furnished</span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <input type="checkbox" id="offer" className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 w-xl">
                        <div className="flex items-center gap-2">
                            <input type="Number" id="bedrooms" className='border rounded-md border-gray-300 p-2 w-15' min='1' max='10' value='1' required/>
                            <span>Bedrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="Number" id="bathrooms" className='border rounded-md border-gray-300 p-2 w-15'min='1' max='10' value='1' required/>
                            <span>Bathrooms</span>
                        </div>
                        </div>
                        <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <input type="Number" id="regularPrice" className='border rounded-md border-gray-300 p-2'/>
                            <div className="flex flex-col items-center">
                                <span>Regular price</span>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="Number" id="discountPrice" className='border rounded-md border-gray-300 p-2'/>
                            <div className="flex flex-col items-center">
                                <span>Discounted price</span>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-5">
                    <div className="flex flex-row gap-2">
                        <p className="font-semibold">Images:</p>
                        <span className="text-gray-700">The first image will be the cover(max 6)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="file" id="images" accept="'image/*" multiple className="border p-2"/>
                        <button className="text-green-700 border rounded border-green-700 p-3 uppercase hover:shadow-lg disabled:opacity-80">upload</button>
                    </div>
                    <button className="bg-slate-500 p-3 text-white rounded-lg uppercase hover:shadow-lg disabled:opacity-80">Create Listing</button> 
                </div>   
            </form>
        </main>
    )
}