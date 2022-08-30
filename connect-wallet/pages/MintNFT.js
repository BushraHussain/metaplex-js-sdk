import { useMetaplex } from "./useMetaplex";
import { toMetaplexFileFromBrowser, toMetaplexFileFromJson } from "@metaplex-foundation/js";
import { useState } from "react";


export const MintNFT = () => {

    const { metaplex } = useMetaplex();
    const [image, setImage] = useState();

//----------------------- Upload Image------------------------------------------

    async function uploadImage(e){
        const browserFile = e.target.files?.[0] ?? null;
        setImage(browserFile);
    }

//----------------------- upload metadata and create NFT-----------------------
    async function createNFT(e){ 
        if (!image) return;

        // upload metadata
        const { uri } = await metaplex.nfts().uploadMetadata({
            name: "My NFT",
            image: await toMetaplexFileFromBrowser(image),
        }).run();
        console.log("URI::", uri);
      
        // Create NFT
        const { nft } = await metaplex.nfts().create({
            uri: uri,
            name: "My NFT",
            sellerFeeBasisPoints: 500, // 5% royalties.
        }).run();
        console.log(nft.address.toBase58());
    }

//--------------------------- Same ERROR for another function --------------------------------

    async function test(){
        const file = toMetaplexFileFromJson({ foo: 42 });
        console.log("File :: ", file)
    }

// Unhandled Runtime Error
// TypeError: (0 , _metaplex_foundation_js__WEBPACK_IMPORTED_MODULE_5__.toMetaplexFileFromJson) is not a function

//---------------------------------------------------------------

    return(
        <dev>
            <label>Upload Image<br/><br/>
                <input accept="image/*" type="file" onChange={uploadImage}/>
            </label> <br/><br/>
            <button onClick={createNFT}>Upload metadata and Create</button> <br/><br/>
            <button onClick={test}>Test Metaplex File</button>
        </dev>
    )

}