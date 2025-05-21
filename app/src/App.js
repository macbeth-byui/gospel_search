import './index.css'
import { useEffect, useState } from 'react';
import init, { Gospel, SearchParams } from 'wasm-gospel-search';
import { SearchTable } from './SearchTable';

export default function App() {
    const [gospel, setGospel] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [searchParams, setSearchParams] = useState(null);

    useEffect(() => {
        (async () => {
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
        const g = new Gospel(bom, dc, nt, ot, pogp);
        setGospel(g);
        const sp = new SearchParams();
        setSearchParams(sp);
          
        })();
     
    }, []);

    const handleCheckbox = (key, value) => {
        let sp = searchParams.copy();
        sp[key] = value;
        setSearchParams(sp);
    }

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

