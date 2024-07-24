import React from 'react';
import './search.css'

const Search = () => {
    return (

            <div className="container-fluid">
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn custom-btn" type="submit">Search</button>
                </form>
            </div>

    );
};

export default Search;