import React from 'react';
import './LockRoom.scss';
import clsx from 'clsx';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import {
  useAuthSelector,
  useComponentSelector,
  useLanguageSelector,
} from '~/component/redux/selector';
import { useDispatch } from 'react-redux';
import { componentSlice } from '~/component/redux/slices';
import socket from '~/tools/socket.io';
import Tooltip from '~/component/custom/tooltip/Tooltip';
import { patchRoom } from '~/services/roomService';
import { withTokenInstance } from '~/tools/instances/withTokenInstance';
const LockRoom = () => {
  const [isLocked, setIsLocked] = React.useState(true);
  const { profile } = useAuthSelector();
  const dispatch = useDispatch();
  const { currentLanguage } = useLanguageSelector();
  const { currentRoom } = useComponentSelector();
  const { _id } = useAuthSelector().profile;
  const handleHoverInLock = (e) => {
    if (currentRoom.blocked._id !== _id) {
      setIsLocked(false);
      e.target.style.cursor = 'pointer';
    }
  };
  const handleHoverOutLock = () => {
    setIsLocked(true);
  };
  const handleUnblockOther = async () => {
    // console.log('unblock other');
    if (_id === currentRoom.blocked._id) {
      return;
    } else {
      try {
        const data = await patchRoom('', currentRoom._id, '$set', 'blocked');
        if (data.status === 'success') {
          socket.emit('update-room', data.room);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  //socket.io
  React.useEffect(() => {
    socket.on('update-room', (room) => {
      if (room._id === currentRoom._id) {
        const newRoom = room;
        if (newRoom.mode === 'private') {
          const otherProfile = newRoom.member.find(
            (mem) => mem._id !== profile._id
          );
          newRoom['roomavatar'] = otherProfile.avatarlink;
          newRoom['name'] = otherProfile.name;
          newRoom['profileid'] = otherProfile._id;
        }
        dispatch(componentSlice.actions.setCurrentRoom({ ...newRoom }));
      }
    });
  }, []);

  return (
    <div
      className={clsx('lockroom-container', {
        [currentRoom.backgroundColor]: true,
      })}
    >
      <div className="body">
        <Tooltip title={currentLanguage.tooltipUnblock} position="top">
          <div
            className="lock"
            onMouseEnter={handleHoverInLock}
            onMouseLeave={handleHoverOutLock}
            onClick={handleUnblockOther}
          >
            {isLocked ? <AiFillLock /> : <AiFillUnlock />}
          </div>
        </Tooltip>
        {currentRoom.blocked && (
          <div className="text">
            {currentRoom.blocked._id === _id
              ? currentLanguage.blockedNotify + ' ' + currentRoom.name
              : currentLanguage.blockerNotify + ' ' + currentRoom.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default LockRoom;
