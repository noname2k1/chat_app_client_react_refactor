import React from 'react';
import './SearchBar.scss';
import { MdOutlineSearch } from 'react-icons/md';
import { RiDeleteBack2Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useAuthSelector } from '../redux/selector';
import useDebouncedValue from '~/hooks/useDebouncedValue';
import { searchOthers } from '~/services/searchService';

const SearchBar = ({ target, placeholder, autoFocus }) => {
    const profile = useAuthSelector().profile;
    const [profiles, setProfiles] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [string, setString] = React.useState('');
    const searchBar = React.useRef();
    const highlightSB = () => {
        searchBar.current.style.border = '1px solid var(--outline-input-color)';
    };
    const unHighLightSB = () => {
        searchBar.current.style.border = '1px solid var(--border-color)';
    };
    const handleSearch = async (value) => {
        setIsLoading(false);
        if (target === 'profile') {
            try {
                const results = await searchOthers(value);
                // console.log(results);
                let resultsLater = results.profiles;
                const myProfile = resultsLater.find((pf) => {
                    return pf._id === profile._id;
                });
                if (myProfile) {
                    resultsLater.splice(resultsLater.indexOf(myProfile), 1);
                }
                setProfiles(resultsLater);
            } catch (error) {
                console.log(error);
            }
        }
    };
    const debounceTime = 500; //mili seconds
    const debounceSearchResult = useDebouncedValue(string, debounceTime);

    const handleSearchInput = (e) => {
        setIsLoading(true);
        setString(e.target.value);
    };
    React.useEffect(() => {
        if (string === '') {
            setProfiles([]);
        }
    }, [string]);
    React.useEffect(() => {
        if (debounceSearchResult) {
            handleSearch(debounceSearchResult);
        }
        //eslint-disable-next-line
    }, [debounceSearchResult]);

    return (
        <div className="search-container" ref={searchBar}>
            <input
                type="text"
                onChange={handleSearchInput}
                className="search__input"
                onFocus={highlightSB}
                onBlur={unHighLightSB}
                placeholder={placeholder}
                value={string}
                autoFocus={autoFocus}
            />
            <div className="after-search-input">
                {!string && <MdOutlineSearch />}
                {string && (
                    <RiDeleteBack2Line
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setString('');
                            searchBar.current.querySelector('input').focus();
                        }}
                    />
                )}
            </div>
            {(profiles.length > 0 || string) && (
                <div className="search-result-wrapper">
                    <ul className="search-result-list">
                        {string && isLoading && profiles.length < 1 && (
                            <div
                                className="search-result-loading"
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                <div className="lds-facebook">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        )}
                        {profiles.length > 0 &&
                            profiles.map((profile) => (
                                <li
                                    className="search-result-item"
                                    key={profile._id}
                                >
                                    <Link
                                        to={`/rooms/profile/${profile._id}`}
                                        onClick={() => {
                                            setString('');
                                            setProfiles([]);
                                        }}
                                    >
                                        <div className="avatar">
                                            <img
                                                src={profile.avatarlink}
                                                alt={`avt-${profile.name}`}
                                                className="avatar__img"
                                                width="100%"
                                                height="100%"
                                            />
                                        </div>
                                        <div className="text">
                                            {profile.name}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
