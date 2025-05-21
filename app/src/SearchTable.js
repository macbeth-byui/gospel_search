import './index.css'
import { useEffect, useState, useRef } from 'react';
import { List, CellMeasurer, CellMeasurerCache, AutoSizer } from "react-virtualized";

export function SearchTable({gospel, searchText, searchParams}) {
    const [results, setResults] = useState([])
    const listRef = useRef(null)
    const windowDebounce = useRef(null);
    const searchDebounce = useRef(null);
    const cache = useRef(new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 50
    }));

    useEffect(() => {
        clearTimeout(searchDebounce.current);
        searchDebounce.current = setTimeout(async () => {
            if (gospel && searchParams) {
                let r = await gospel.search_async(searchText, searchParams);
                setResults(r);
                handleRedrawTable()
            }
        }, 100);

    }, [gospel, searchText, searchParams]);

    useEffect(() => {
        const onResize = () => {
            clearTimeout(windowDebounce.current);
            windowDebounce.current = setTimeout(handleRedrawTable, 100);
        };

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);

    const rowRenderer = ({ index, key, parent, style }) => {
        return (
            <CellMeasurer
                cache={cache.current}
                columnIndex={0}
                rowIndex={index}
                key={key}
                parent={parent}>
                {() => (
                    <div  
                        style={{ ...style, padding: "1rem", boxSizing: "border-box", border: "1px solid #ccc"}} 
                        key={key} 
                        dangerouslySetInnerHTML={{ __html: results[index]}}>
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
                        rowCount={results.length}
                        deferredMeasurementCache={cache.current}
                        rowHeight={cache.current.rowHeight}
                        rowRenderer={rowRenderer}
                        width={width}
                    />
                )}
            </AutoSizer>
        </div>
    );

    const handleRedrawTable = () => {
        if (cache.current) {
            cache.current.clearAll(); 
        }
        if (listRef.current) {
            listRef.current.recomputeRowHeights(); 
            listRef.current.forceUpdateGrid();
        }
  };

    return (
        <div>
            {results.length} Matches Found
            <SearchResults/>
        </div>
    );

}
