import './index.css'
import { useEffect, useState } from 'react';
import init, { Gospel, SearchParams } from 'wasm-gospel-search';
import { SearchTable } from './SearchTable';

// Top level component for the Gospel Search app.
export default function App() {
    // This is the Gospel object that contains all of the
    // scriptures and the ability to search.  Initialized to
    // null until the object is ready for use.
    const [gospel, setGospel] = useState(null);

    // This is the user input to search
    const [searchText, setSearchText] = useState("");

    // Contains a collection of search parameters (booleans)
    const [searchParams, setSearchParams] = useState(null);

    // This useEffect will be called only once when this component
    // is created.
    useEffect(() => {
        // Async is needed because of the await on init below
        (async () => {
            // This will initialize the Web Assembly (WASM)
            // for the rust library (Gospel & SearchParams)
            await init();

            // Read all files in parallel
            const future_bom = fetch("/bookofmormon.json");
            const future_dc = fetch("/doctrineandcovenants.json");
            const future_nt = fetch("/newtestament.json");
            const future_ot = fetch("/oldtestament.json");
            const future_pogp = fetch("/pearlofgreatprice.json");
            const [bom, dc, nt, ot, pogp] = await Promise.all([
                future_bom.then(response => response.text()),
                future_dc.then(response => response.text()),
                future_nt.then(response => response.text()),
                future_ot.then(response => response.text()),
                future_pogp.then(response => response.text())
            ])

            // Create Gospel and SearchParams objects and save
            const g = new Gospel(bom, dc, nt, ot, pogp);
            setGospel(g);
            const sp = new SearchParams();
            setSearchParams(sp);
          
        })();
     
    }, []);

    // Create a new SearchParams object with something changed.  
    // This is used by the checkboxes.
    const handleCheckbox = (key, value) => {
        let sp = searchParams.copy();
        // In JS, I can use dictionary indexes to access
        // public attributes in the class.
        sp[key] = value;
        setSearchParams(sp);
    }

    // Display the main user interface for the app
    return (
        <div>
        <h1>Gospel Search</h1>
        Search 
        <input 
            onChange={ (event) => { setSearchText(event.target.value); }}
            value={searchText} 
            disabled={gospel == null}
        />
        <button
            disabled={gospel == null}
            onClick={() => { setSearchText(""); }}
        > 
            {'\u2718'}
        </button>
        <label>
            <input
                type="checkbox"
                checked={!!searchParams?.word}
                disabled={searchParams == null}
                onChange={(e) => { handleCheckbox("word",e.target.checked); }}
            />
            Match Word
        </label>
        <label>
            <input
                type="checkbox"
                checked={!!searchParams?.case}
            disabled={searchParams == null}
            onChange={(e) => { handleCheckbox("case",e.target.checked); }}
            />
            Match Case
        </label>
        <br/>
        <label>
            <input
                type="checkbox"
                checked={!!searchParams?.bom}
                disabled={searchParams == null}
                onChange={(e) => { handleCheckbox("bom",e.target.checked); }}
            />
            Book of Mormon
        </label>
        <label>
            <input
                type="checkbox"
                checked={!!searchParams?.ot}
                disabled={searchParams == null}
                onChange={(e) => { handleCheckbox("ot",e.target.checked); }}
            />
            Old Testament
        </label>
        <label>
            <input
                type="checkbox"
                checked={!!searchParams?.nt}
                disabled={searchParams == null}
                onChange={(e) => { handleCheckbox("nt",e.target.checked); }}
            />
            New Testament
        </label>
        <label>
            <input
                type="checkbox"
                checked={!!searchParams?.dc}
                disabled={searchParams == null}
                onChange={(e) => { handleCheckbox("dc",e.target.checked); }}
            />
            Doctrine & Convenants
        </label>
        <label>
            <input
                type="checkbox"
                checked={!!searchParams?.pogp}
                disabled={searchParams == null}
                onChange={(e) => { handleCheckbox("pogp",e.target.checked); }}
            />
            Pearl of Great Price
        </label>
        <br/><br/>
        <SearchTable gospel={gospel} searchText={searchText} searchParams={searchParams}/>
        </div>
    );

}

