import './index.css'
import { useEffect, useState, useRef } from 'react';
import { List, CellMeasurer, CellMeasurerCache, AutoSizer } from "react-virtualized";
import init, { Gospel } from 'wasm-gospel-search';

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

  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50
    })
  );

  const listRef = useRef()

  const handleResize = () => {
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

      let resizeTimeout;
      window.addEventListener("resize", () => {
        // Wait 200ms after the last resize that is received
        // This provides a debounce especially needed when maximize and windowed buttons are pressed
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 200);
      });
     
    })();
  }, []);

  const handleSearchChanged = (event) => {
    setSearchTerm(event.target.value);
    applySearch(event.target.value, bomChecked, otChecked, ntChecked, dcChecked, pogpChecked, wordChecked, caseChecked);
  }

  function applySearch(text, bom, ot, nt, dc, pogp, wordMatch, caseMatch) {
    if (gospel !== null) {
      setResult(gospel.search(text, bom, ot, nt, dc, pogp, wordMatch, caseMatch));
      handleResize()
    }
  }

  const rowRenderer = ({ index, key, parent, style }) => {
    // const rawHtml = DOMPurify.sanitize(result[index]);
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
                key={index} 
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
      Search <input onChange={handleSearchChanged} disabled={gospel == null} id="search_text"/>
      <button
        onClick={() => { 
          const elem = document.getElementById('search_text')
          elem.value = "";
          setSearchTerm(""); 
          applySearch("", bomChecked, otChecked, ntChecked, dcChecked, pogpChecked, wordChecked, caseChecked);}}
      >
        {'\u2718'}
      </button>
      <label>
        <input
          type="checkbox"
          checked={wordChecked}
          onChange={(e) => { setWordChecked(e.target.checked); applySearch(searchTerm, bomChecked, otChecked, ntChecked, dcChecked, pogpChecked, e.target.checked, caseChecked); }}
        />
        Match Word
      </label>
      <label>
        <input
          type="checkbox"
          checked={caseChecked}
          onChange={(e) => { setCaseChecked(e.target.checked); applySearch(searchTerm, bomChecked, otChecked, ntChecked, dcChecked, pogpChecked, wordChecked, e.target.checked); }}
        />
        Match Case
      </label>
      <br/>
      <label>
        <input
          type="checkbox"
          checked={bomChecked}
          onChange={(e) => { setBomChecked(e.target.checked); applySearch(searchTerm, e.target.checked, otChecked, ntChecked, dcChecked, pogpChecked, wordChecked, caseChecked); }}
        />
        Book of Mormon
      </label>
      <label>
        <input
          type="checkbox"
          checked={otChecked}
          onChange={(e) => { setOtChecked(e.target.checked); applySearch(searchTerm, bomChecked, e.target.checked, ntChecked, dcChecked, pogpChecked, wordChecked, caseChecked); }}
        />
        Old Testament
      </label>
      <label>
        <input
          type="checkbox"
          checked={ntChecked}
          onChange={(e) => { setNtChecked(e.target.checked); applySearch(searchTerm, bomChecked, otChecked, e.target.checked, dcChecked, pogpChecked, wordChecked, caseChecked); }}
        />
        New Testament
      </label>
      <label>
        <input
          type="checkbox"
          checked={dcChecked}
          onChange={(e) => { setDcChecked(e.target.checked); applySearch(searchTerm, bomChecked, otChecked, ntChecked, e.target.checked, pogpChecked, wordChecked, caseChecked); }}
        />
        Doctrince & Convenants
      </label>
      <label>
        <input
          type="checkbox"
          checked={pogpChecked}
          onChange={(e) => { setPogpChecked(e.target.checked); applySearch(searchTerm, bomChecked, otChecked, ntChecked, dcChecked, e.target.checked, wordChecked, caseChecked); }}
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
