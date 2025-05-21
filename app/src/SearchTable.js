import './index.css'
import { useEffect, useState, useRef } from 'react';
import { List, CellMeasurer, CellMeasurerCache, AutoSizer } from "react-virtualized";

// Creates a table that is populated by running a search 
// on the gospel library.  This is intended to be redrawn
// everytime the search text, search parameters, or window
// resize occurs.
export function SearchTable({gospel, searchText, searchParams}) {
    // Populated by useEffect after calling search function,
    const [results, setResults] = useState([])

    // Used by useEffect to debounce fast inputs from either
    // window changes or typing in the searchText.
    const windowDebounce = useRef(null);
    const searchDebounce = useRef(null);

    // Populated by the Table Generator
    const listRef = useRef(null)

    // Cache used by the Table Generator
    const cache = useRef(new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 50
    }));

    // Called anytime gospel, searchText, or searchParams changes
    useEffect(() => {
        // Don't respond to changes until 100ms to avoid
        // duplicate requests to redraw
        clearTimeout(searchDebounce.current);
        searchDebounce.current = setTimeout(async () => {
            if (gospel && searchParams) {
                // Once the gosepl and search params are initialized
                // then a search can be done.
                let r = await gospel.search_async(searchText, searchParams);
                setResults(r);

                // This is not a redraw of the UI using react
                // but rather an indication to the Table Generator
                // that new row heights need to be calculated.
                handleRedrawTable()
            }
        }, 100);

    }, [gospel, searchText, searchParams]);

    // Called once when created to setup window resizing
    useEffect(() => {
        // When the user maximizes or windowizes this will 
        // cause a race condition between the resized windows
        // and the updated data.  Wait 100ms before updating
        // the table heights after getting a request to 
        // resize the window.

        const onResize = () => {
            clearTimeout(windowDebounce.current);
            windowDebounce.current = setTimeout(handleRedrawTable, 100);
        };

        window.addEventListener("resize", onResize);

        // This will be called when this component is destroyed.
        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);

    // Part of Table Generator that measures a row and populates
    // it with the HTML provided by the search result.  Since
    // we are only providing results from the search function
    // which come from the json scripture files, there is not a 
    // concern of bad HTML code being introduced.
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

    // This component will contain the generated table and ensure
    // that it takes up 80% of the screen.  Autosizing allows it
    // to redraw if the window size changes.
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

    // Indicate to the Table Generator that new row heights
    // need to be generated based on the actual data and 
    // window size.
    const handleRedrawTable = () => {
        if (cache.current) {
            cache.current.clearAll(); 
        }
        if (listRef.current) {
            listRef.current.recomputeRowHeights(); 
            listRef.current.forceUpdateGrid();
        }
    };

    // Display the number of matches and table of results
    return (
        <div>
            {results.length} Matches Found
            <SearchResults/>
        </div>
    );

}
