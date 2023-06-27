import React from 'react';
import './ZoomFile.scss';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import { MdOutlineZoomOutMap } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { FiDownload } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { componentSlice } from '~/component/redux/slices';
import { useComponentSelector } from '~/component/redux/selector';
import clsx from 'clsx';
import { saveAs } from 'file-saver';

const ZoomFile = () => {
    const dispatch = useDispatch();
    const currentItemRef = React.useRef(null);
    const { viewFileModal } = useComponentSelector();
    const previousItem = () => {
        if (viewFileModal.currentIndex > 0) {
            dispatch(
                componentSlice.actions.setViewFileModal({
                    currentIndex: viewFileModal.currentIndex - 1,
                })
            );
        } else {
            dispatch(
                componentSlice.actions.setViewFileModal({
                    currentIndex: viewFileModal.files.length - 1,
                })
            );
        }
    };
    const nextItem = () => {
        if (viewFileModal.currentIndex < viewFileModal.files.length - 1) {
            dispatch(
                componentSlice.actions.setViewFileModal({
                    currentIndex: viewFileModal.currentIndex + 1,
                })
            );
        } else {
            dispatch(
                componentSlice.actions.setViewFileModal({
                    currentIndex: 0,
                })
            );
        }
    };

    const handleSelectItem = (e, index) => {
        dispatch(
            componentSlice.actions.setViewFileModal({
                currentIndex: index,
            })
        );
    };

    const handleDownload = () => {
        saveAs(viewFileModal.files[viewFileModal.currentIndex].link);
    };
    const close = () => {
        dispatch(componentSlice.actions.setViewFileModal({ enable: false }));
    };

    const handleZoomImage = () => {
        dispatch(
            componentSlice.actions.setViewFileModal({
                zoomFile: true,
                enable: false,
            })
        );
    };
    React.useEffect(() => {
        if (currentItemRef) {
            currentItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [viewFileModal.currentIndex]);
    return (
        <>
            <div className="zoom-file-container">
                <div className="zoom-file-wrapper">
                    <header className="header">
                        <ul className="header-list">
                            {viewFileModal.files[viewFileModal.currentIndex]
                                .type === 'image' && (
                                <li
                                    className="header-item"
                                    onClick={handleZoomImage}
                                >
                                    <MdOutlineZoomOutMap size={25} />
                                </li>
                            )}
                            <li
                                className="header-item"
                                onClick={handleDownload}
                            >
                                <FiDownload size={25} />
                            </li>
                            <li className="header-item" onClick={close}>
                                <AiOutlineClose size={25} />
                            </li>
                        </ul>
                    </header>
                    <main className="main">
                        <div
                            className="main-item"
                            style={
                                viewFileModal.files[viewFileModal.currentIndex]
                                    .type === 'image' &&
                                viewFileModal.files[viewFileModal.currentIndex]
                                    .aspectRatio
                                    ? {
                                          aspectRatio: `${
                                              viewFileModal.files[
                                                  viewFileModal.currentIndex
                                              ].aspectRatio
                                          }`,
                                      }
                                    : {}
                            }
                        >
                            {viewFileModal.files[viewFileModal.currentIndex]
                                .type === 'image' && (
                                <img
                                    src={
                                        viewFileModal.files[
                                            viewFileModal.currentIndex
                                        ].link
                                    }
                                    alt="img"
                                />
                            )}
                            {viewFileModal.files[viewFileModal.currentIndex]
                                .type === 'video' && (
                                <video
                                    src={
                                        viewFileModal.files[
                                            viewFileModal.currentIndex
                                        ].link
                                    }
                                    alt="video"
                                    controls
                                    playsInline
                                />
                            )}
                        </div>
                        <div className="previous" onClick={previousItem}>
                            <BsFillCaretLeftFill size={25} />
                        </div>
                        <div className="next" onClick={nextItem}>
                            <BsFillCaretRightFill size={25} />
                        </div>
                    </main>
                    <footer className="footer">
                        <ul className="list">
                            {viewFileModal.files.map((item, index) => (
                                <li
                                    className={clsx('item', {
                                        'current-item':
                                            index ===
                                            viewFileModal.currentIndex,
                                    })}
                                    style={
                                        item.type === 'image' &&
                                        item.aspectRatio
                                            ? {
                                                  aspectRatio: `${item.aspectRatio}`,
                                              }
                                            : {}
                                    }
                                    key={index}
                                    onClick={(e) => handleSelectItem(e, index)}
                                    ref={
                                        index === viewFileModal.currentIndex
                                            ? currentItemRef
                                            : null
                                    }
                                >
                                    {item.type === 'image' && (
                                        <img
                                            src={item.link}
                                            alt="below-item"
                                            width="100%"
                                            height="100%"
                                        />
                                    )}
                                    {item.type === 'video' && (
                                        <video
                                            src={item.link}
                                            alt="below-item"
                                            width="100%"
                                            height="100%"
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default ZoomFile;
