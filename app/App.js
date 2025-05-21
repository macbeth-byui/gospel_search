import './index.css'
import { useEffect, useState, useRef } from 'react';
import { List, CellMeasurer, CellMeasurerCache, AutoSizer } from "react-virtualized";
import init, { Gospel, SearchParams } from 'wasm-gospel-search';

function App() {
  const [gospel, setGospel] = useState(null);
  const [result, setResult] = useState([]);
  const [bomChecked, setBomChecked] = useState(true);
  const [otChecked, setOtChecked] = useState(true);
  const [ntChecked, setNtChecked] = useState(true);
  const [dcChecked, setDcChecked] = useState(true);
  const [pogpChecked, setPogpChecked] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [wordChecked, setWordChecked] = useState(false);
  const [caseChecked, setCaseChecked] = useState(false);
  const searchDebounce = useRef(null);
  const windowDebounce = useRef(null);

  const listRef = useRef()

  const handleRedrawTable = () => {
    if (cache.current) {
      cache.current.clearAll(); 
    }
    if (listRef.current) {
      listRef.current.recomputeRowHeights(); 
      listRef.current.forceUpdateGrid();
    }
  };

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

      // Use Rust to convert to a Gospel object
      let g = new Gospel(bom, dc, nt, ot, pogp)
      setGospel(g)

    })();
     
    window.addEventListener("resize", () => {
      clearTimeout(windowDebounce.current);
      windowDebounce.current = setTimeout(handleRedrawTable, 200);
    });

    return () => {
      window.removeEventListener("resize", handleRedrawTable);
    }
     

  }, []);

  const createSearchParams = () => {
      const params = new SearchParams();
      params.bom = bomChecked;
      params.ot = otChecked;
      params.nt = ntChecked;
      params.dc = dcChecked;
      params.pogp = pogpChecked;
      params.word = wordChecked;
      params.case = caseChecked;
      return params;
  }

  async function applySearch(text, params) {
    if (gospel !== null) {
      setResult(await gospel.search_async(text, params));
      handleRedrawTable();
    }
  }

  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50
    })
  );

  const rowRenderer = ({ index, key, parent, style }) => {
    return (
      <CellMeasurer
        cache={cache.current}
        columnIndex={0}
        rowIndex={index}
        key={key}
        parent={parent}>
          {({ _, registerChild }) => (
            <div ref={registerChild} 
                style={{ ...style, padding: "1rem", boxSizing: "border-box", border: "1px solid #ccc"}} 
                key={key} 
                dangerouslySetInnerHTML={{ __html: result[index]}}>
            </div>
          )}
      </CellMeasurer>
    );
  };

  const SearchResults = () => (
    <div style={{ height: "80vh" }}>
      <AutoSizer>
          {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            rowCount={result.length}
            deferredMeasurementCache={cache.current}
            rowHeight={cache.current.rowHeight}
            rowRenderer={rowRenderer}
            width={width}
          />
        )}
      </AutoSizer>
    </div>
  );


  return (
    <div>
      <h1>Gospel Search</h1>
      Search <input onChange={ (event) => {
            setSearchTerm(event.target.value);
            clearTimeout(searchDebounce.current);
            searchDebounce.current = setTimeout(() => applySearch(event.target.value, createSearchParams()), 100);
          }} value={searchTerm} disabled={gospel == null} id="search_text"/>
      <button
        onClick={() => { 
          setSearchTerm(""); 
          applySearch("", createSearchParams());
        }}
      >
        {'\u2718'}
      </button>
      <label>
        <input
          type="checkbox"
          checked={wordChecked}
          onChange={(e) => { 
            setWordChecked(e.target.checked); 
            let params = createSearchParams();
            params.word = e.target.checked;
            applySearch(searchTerm, params); 
          }}
        />
        Match Word
      </label>
      <label>
        <input
          type="checkbox"
          checked={caseChecked}
          onChange={(e) => { 
            setCaseChecked(e.target.checked); 
            let params = createSearchParams();
            params.case = e.target.checked;
            applySearch(searchTerm, params); 
 
          }}
        />
        Match Case
      </label>
      <br/>
      <label>
        <input
          type="checkbox"
          checked={bomChecked}
          onChange={(e) => { 
            setBomChecked(e.target.checked); 
            let params = createSearchParams();
            params.bom = e.target.checked;
            applySearch(searchTerm, params); 

          }}
        />
        Book of Mormon
      </label>
      <label>
        <input
          type="checkbox"
          checked={otChecked}
          onChange={(e) => { 
            setOtChecked(e.target.checked);
            let params = createSearchParams();
            params.ot = e.target.checked;
            applySearch(searchTerm, params); 
          
          }}
        />
        Old Testament
      </label>
      <label>
        <input
          type="checkbox"
          checked={ntChecked}
          onChange={(e) => { 
            setNtChecked(e.target.checked); 
            let params = createSearchParams();
            params.nt = e.target.checked;
            applySearch(searchTerm, params); 

          }}
        />
        New Testament
      </label>
      <label>
        <input
          type="checkbox"
          checked={dcChecked}
          onChange={(e) => { 
            setDcChecked(e.target.checked); 
            let params = createSearchParams();
            params.dc = e.target.checked;
            applySearch(searchTerm, params); 

          }}
        />
        Doctrine & Convenants
      </label>
      <label>
        <input
          type="checkbox"
          checked={pogpChecked}
          onChange={(e) => { 
            setPogpChecked(e.target.checked); 
            let params = createSearchParams();
            params.pogp = e.target.checked;
            applySearch(searchTerm, params); 

          }}
        />
        Pearl of Great Price
      </label>
      <br/><br/>
      {result.length} Matches Found
      <SearchResults/>

    </div>
  );

}

export default App;
