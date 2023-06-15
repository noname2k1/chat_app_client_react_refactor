import React from 'react';
import './ViewMediasFilesLinks.scss';
import axios from 'axios';
import clsx from 'clsx';
import { TbChevronsRight } from 'react-icons/tb';
import { BsPlayCircle } from 'react-icons/bs';
import { useComponentSelector } from '~/component/redux/selector';
import { useDispatch } from 'react-redux';
import { componentSlice } from '~/component/redux/slices';
import { getAttachments } from '~/services/messageService';
const ViewMediasFilesLinks = () => {
  // const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const { messageMediaFilesLinksPage, selectedRoomid, viewFileModal } =
    useComponentSelector();
  const tabs = [
    { id: 0, title: 'Media', type: ['image', 'video'] },
    { id: 1, title: 'Files', type: ['file'] },
    { id: 2, title: 'Links', type: ['link'] },
  ];
  const refs = React.useRef([]);
  const lineRef = React.useRef(null);
  refs.current = tabs.map(
    (tab, index) => refs.current[index] ?? React.createRef()
  );
  const [tabIndex, setTabIndex] = React.useState(0);

  React.useEffect(() => {
    if (lineRef) {
      lineRef.current.style.left = `${refs.current[tabIndex].current.offsetLeft}px`;
    }
  }, [tabIndex]);
  const handleSelectTab = (e, tabid) => {
    setTabIndex(tabid);
  };
  const handleClose = () => {
    dispatch(componentSlice.actions.setMessageMediaFilesLinksPage(false));
    setTabIndex(0);
  };
  React.useEffect(() => {
    if (selectedRoomid) {
      getAttachments(selectedRoomid)
        .then((res) => {
          let copyAttachments = [];
          res.messagesHaveAttachment.length > 0 &&
            res.messagesHaveAttachment.forEach((message) => {
              copyAttachments = [
                ...copyAttachments,
                ...message.attachmentsLink,
              ];
            });
          dispatch(
            componentSlice.actions.setViewFileModal({
              files: copyAttachments,
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedRoomid]);

  const handleClickVideo = (e) => {
    if (!e.target.paused && !e.target.ended && e.target.currentTime > 0) {
      e.target.pause();
    } else {
      e.target.play();
    }
  };
  const handleWhenVideoPlay = (e) => {
    e.target.setAttribute('controls', true);
  };
  const handleWhenVideoPause = (e) => {
    e.target.removeAttribute('controls');
  };
  const handleViewFile = (e, index) => {
    dispatch(
      componentSlice.actions.setViewFileModal({
        enable: true,
        currentIndex: index,
      })
    );
  };

  return (
    <div
      className={clsx('view-files-media-links-container', {
        hide: !messageMediaFilesLinksPage,
      })}
    >
      <header className="header">
        <span className="close" onClick={handleClose}>
          <TbChevronsRight />
        </span>{' '}
        <div className="text">Media - Files - Links</div>
      </header>
      <main className="main">
        <div className="tabs">
          {tabs.map((tab, index) => (
            <div
              className={clsx('tab', {
                selected: tab.id === tabIndex,
              })}
              key={tab.id}
              ref={refs.current[index]}
              onClick={(e) => handleSelectTab(e, tab.id)}
            >
              {tab.title}
            </div>
          ))}
          <div className="line" ref={lineRef}></div>
        </div>
        {viewFileModal.files.length > 0 &&
          viewFileModal.files.some(
            (file) => tabs[tabIndex].type.indexOf(file.type) !== -1
          ) && (
            <div className="content">
              {viewFileModal.files.map((attachment, index) => (
                <div
                  className="item"
                  key={index}
                  onClick={(e) => handleViewFile(e, index)}
                >
                  {attachment.type === 'image' && tabIndex === 0 && (
                    <img
                      src={attachment.link}
                      alt="message-img"
                      width="100%"
                      height="100%"
                    />
                  )}
                  {attachment.type === 'video' && tabIndex === 0 && (
                    <video
                      src={attachment.link}
                      alt="message-video"
                      width="100%"
                      height="100%"
                      onClick={handleClickVideo}
                      onPlay={handleWhenVideoPlay}
                      onPause={handleWhenVideoPause}
                    />
                  )}
                  {attachment.type === 'video' && (
                    <div className="play-icon">
                      <BsPlayCircle />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
};

export default ViewMediasFilesLinks;
