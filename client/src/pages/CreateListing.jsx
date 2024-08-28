import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react"
import { app } from "../firebase";

export default function createListing() {

    const [files, setFiles] = useState([]);
    // console.log(files);

    const [formData, setFormData] = useState({
        imageUrls : [],
    })

    console.log(formData)

    const [imageUploadError, setImageUploadError] = useState("");

    const [uploading, setUploading] = useState(false);

    const handleImageSubmit = (e) => {
        if(files.length > 0 &&  (formData.imageUrls.length + files.length) < 7) {
            setUploading(true);
            setImageUploadError("");
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData,
                    imageUrls : formData.imageUrls.concat(urls)
                })
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                setUploading(false);
                setImageUploadError('Image upload failed(2 mb max per image)');
            })
        } else {
            setUploading(false);
            setImageUploadError(files.length == 0 ? 'Please choose an image to upload' : 'You can only upload 6 images per listing')
        }
    }

    const handleImageRemove = (index) => {
        setFormData({
            ...formData,
            imageUrls : formData.imageUrls.filter((_, i) => i !== index)
        })

    }


    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`upload is ${progress} done`);
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                })
            }
        )})
    }


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
                            <input type="Number" id="bedrooms" className='border rounded-md border-gray-300 p-2 w-15' min='1' max='10' defaultValue='1' required/>
                            <span>Bedrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="Number" id="bathrooms" className='border rounded-md border-gray-300 p-2 w-15'min='1' max='10' defaultValue='1' required/>
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
                    <div className="flex gap-3">
                        <input type="file" id="images" accept="'image/*" multiple className="border p-2" onChange={(e) => setFiles(e.target.files)}/>
                        <button  disabled={uploading} type="button" className="text-green-700 border rounded border-green-700 p-3 uppercase hover:shadow-lg disabled:opacity-80 font-semibold" onClick={handleImageSubmit}>{uploading ? "uploading" : "upload"}</button>
                    </div>
                    <p className="text-left text-red-700 text-sm">{ imageUploadError && imageUploadError }</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            
                            <div key={url} className="flex justify-between items-center border border-gray-200 p-3">
                                <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                                <button type="button" onClick={() => handleImageRemove(index)} className="text-red-700 p-3 rounded-lg font-semibold uppercase hover:opacity-75 ">Delete</button>
                            </div>
                        ))
                    }
                    <button className="bg-slate-500 p-3 text-white rounded-lg uppercase hover:shadow-lg disabled:opacity-80">Create Listing</button> 
                </div>   
            </form>
        </main>
    )
}