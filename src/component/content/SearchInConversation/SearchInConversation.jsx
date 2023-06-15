import React from 'react';
import clsx from 'clsx';
import './SearchInConversation.scss';
import { GiArchiveResearch } from 'react-icons/gi';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { FiDelete } from 'react-icons/fi';
import {
    useLanguageSelector,
    useComponentSelector,
} from '~/component/redux/selector';
import { useDispatch } from 'react-redux';
import { componentSlice } from '~/component/redux/slices';
import debounce from 'lodash/debounce';
import {
    searchMessageByMessageid,
    searchMessagesByWord,
} from '~/services/searchService';
const SearchInConversation = () => {
    const dispatch = useDispatch();
    const inputRef = React.useRef();
    const searchWrapperRef = React.useRef();
    const { currentLanguage } = useLanguageSelector();
    const { selectedRoomid, messagesLastPage } = useComponentSelector();
    const [searchString, setSearchString] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [scrollToViewId, setScrollToViewId] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (inputRef) {
            inputRef.current.focus();
        }
    }, []);
    const inputFocus = () => searchWrapperRef.current.classList.add('focus');
    const inputBlur = () => searchWrapperRef.current.classList.remove('focus');
    const searchMesagesByWord = async (value) => {
        try {
            const data = await searchMessagesByWord(selectedRoomid, value);
            if (value !== '') {
                setSearchResults(data.messages);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    const clearMatchedWord = () => {
        searchResults.forEach((msg) => {
            document
                .getElementById(`${msg._id}`)
                .querySelector('.inside-wrap')
                .children[1]?.classList.remove('matched-word');
        });
        setSearchResults([]);
    };

    const debounceSearch = React.useCallback(
        debounce((value) => searchMesagesByWord(value), 500),
        []
    );
    const handleInputChange = (e) => {
        setIsLoading(true);
        setSearchString(e.target.value);
        debounceSearch(e.target.value);
    };
    const previousSearchResult = () => {
        if (currentIndex === 0) setCurrentIndex(searchResults.length - 1);
        else if (currentIndex > 0)
            setCurrentIndex((prevIndex) => prevIndex - 1);
    };
    const nextSearchResult = () => {
        if (currentIndex === searchResults.length - 1) setCurrentIndex(0);
        else if (currentIndex < searchResults.length - 1)
            setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    const handleClear = () => {
        setSearchString('');
        setScrollToViewId('');
        clearMatchedWord();
    };

    const handleCancel = () => {
        dispatch(componentSlice.actions.setSearchInConversation(false));
        setScrollToViewId('');
        clearMatchedWord();
    };

    React.useEffect(() => {
        if (searchResults.length > 0) {
            const searchMesagesById = async (msgId) => {
                try {
                    const data = await searchMessageByMessageid(
                        selectedRoomid,
                        msgId
                    );
                    dispatch(componentSlice.actions.setMessages(data.messages));
                    setScrollToViewId(msgId);
                } catch (error) {
                    console.log(error);
                }
            };
            searchMesagesById(searchResults[currentIndex]._id);
        } else {
            setScrollToViewId('');
            document.querySelectorAll('.inside-wrap').forEach((item) => {
                item.children[1]?.classList.remove('matched-word');
            });
        }
    }, [searchResults, currentIndex]);

    React.useEffect(() => {
        if (scrollToViewId !== '') {
            document.getElementById(`${scrollToViewId}`).scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
            if (searchString !== '') {
                document
                    .getElementById(`${scrollToViewId}`)
                    .querySelector('.inside-wrap')
                    .children[1]?.classList.add('matched-word');
            } else {
                setScrollToViewId('');
                clearMatchedWord();
            }
        }
    }, [scrollToViewId, searchString]);

    const LoadingEffect = () => {
        return (
            <div className="loading">
                <div className="lds-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    };
    return (
        <div className="search-in-conversation-wrapper">
            <div className="search-input-wrapper" ref={searchWrapperRef}>
                <input
                    type="text"
                    placeholder={currentLanguage.searchPlaceholder}
                    value={searchString}
                    onInput={handleInputChange}
                    ref={inputRef}
                    className="search-in-conversation-input"
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                />
                <div className="after-input">
                    {searchString && (
                        <div className="clear-input" onClick={handleClear}>
                            <FiDelete size={25} />
                        </div>
                    )}
                    {searchString && inputRef.current.value && isLoading && (
                        <LoadingEffect />
                    )}
                    {searchString && inputRef.current.value && !isLoading && (
                        <div className="search-result-count">
                            {searchResults.length === 0
                                ? '0'
                                : currentIndex + 1}
                            /{searchResults.length}
                        </div>
                    )}
                    {!isLoading && (
                        <span className="search-icon">
                            <GiArchiveResearch size={25} />
                        </span>
                    )}
                </div>
            </div>
            <div className="search-navigate">
                <div
                    className={clsx('navigate-item previous', {
                        disabled: searchResults.length === 0,
                    })}
                    onClick={previousSearchResult}
                >
                    <HiOutlineChevronUp />
                </div>
                <div
                    className={clsx('navigate-item before', {
                        disabled: searchResults.length === 0,
                    })}
                    onClick={nextSearchResult}
                >
                    <HiOutlineChevronDown />
                </div>
            </div>
            <div className="close-search" onClick={handleCancel}>
                {currentLanguage.closeSearchText}
            </div>
        </div>
    );
};

export default SearchInConversation;
