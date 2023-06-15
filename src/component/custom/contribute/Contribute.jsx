import React from 'react';
import { useDispatch } from 'react-redux';
import {
  useAuthSelector,
  useLanguageSelector,
} from '~/component/redux/selector';
import { componentSlice } from '~/component/redux/slices';
import LoadingModal from '../loadingModal/LoadingModal';
import './Contribute.scss';
import { contribute } from '~/services/othersService';
const Contribute = () => {
  const { profile } = useAuthSelector();
  const { currentLanguage } = useLanguageSelector();
  const [data, setData] = React.useState({
    title: '',
    content: '',
    files: [],
  });
  const disappearTimeOutId = React.useRef(null);
  const [notify, setNotify] = React.useState({
    error: '',
    success: '',
  });
  const [loading, setLoading] = React.useState(false);
  const title = React.useRef();
  const content = React.useRef();
  const files = React.useRef();
  const dispatch = useDispatch();

  const checkSizeFile = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5000000) {
        return false;
      }
    }
  };
  React.useEffect(() => {
    const disappearTime = 3000;
    disappearTimeOutId.current = setTimeout(() => {
      setNotify({ error: '', success: '' });
    }, disappearTime);
    return () => {
      clearTimeout(disappearTimeOutId.current);
    };
  }, [loading]);
  const handleCloseContribute = () => {
    dispatch(componentSlice.actions.setPropertie({ contribute: false }));
  };
  const handleFocus = () => {
    setNotify({ error: '', success: '' });
  };
  const handleChange = (e) => {
    let check;
    if (e.target.type === 'file') {
      setData({
        ...data,
        [e.target.name]: e.target.files,
      });
      check = checkSizeFile(e.target.files);
      if (check === false) {
        return setNotify({
          ...notify,
          error: 'File size must be less than or equal to 5MB',
        });
      }
      return setNotify({ error: '', success: '' });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
      return setNotify({ error: '', success: '' });
    }
  };

  const handleSendContribute = async (e) => {
    setLoading(true);
    let formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('profile', profile._id);
    Array.from(data.files).forEach((file) => {
      formData.append('files', file);
    });
    e.preventDefault();
    try {
      const data = await contribute(formData);
      if (data.status === 'success') {
        if (currentLanguage.languageCode === 'vn')
          setNotify({
            ...notify,
            success: data.messagevn,
          });
        else
          setNotify({
            ...notify,
            success: data.message,
          });
        setData({
          title: '',
          content: '',
          files: [],
        });
        files.current.value = '';
        setLoading(false);
      }
    } catch (error) {
      // console.log('error: ', error);
      setLoading(false);
      if (error.response.data.field === 'title') {
        title.current.focus();
      }
      if (error.response.data.field === 'content') {
        content.current.focus();
      }
      if (currentLanguage.languageCode === 'vn')
        return setNotify({
          success: '',
          error: error.response.data.messagevn,
        });

      return setNotify({
        success: '',
        error: error.response.data.message,
      });
    }
  };
  return (
    <div className="contribute-container">
      {loading && <LoadingModal message={currentLanguage.sending} />}
      <div className="contribute-wrapper">
        <header>
          <h1 className="title"> {currentLanguage.contribute}</h1>
        </header>
        <div className="contribute-form">
          <input
            type="text"
            name="title"
            placeholder="title"
            value={data.title}
            onChange={handleChange}
            onFocus={handleFocus}
            ref={title}
            autoFocus={true}
          />
          <textarea
            type="text"
            name="content"
            placeholder="content"
            value={data.content}
            onChange={handleChange}
            spellCheck="false"
            autoComplete="off"
            onFocus={handleFocus}
            ref={content}
          />
          <input
            type="file"
            name="files"
            multiple
            onChange={handleChange}
            onFocus={handleFocus}
            ref={files}
          />
          {notify.error && (
            <LoadingModal display={'error'} message={notify.error} />
          )}
          {notify.success && (
            <LoadingModal display={'success'} message={notify.success} />
          )}

          <button className="contribute__button" onClick={handleSendContribute}>
            {'<'}
            {currentLanguage.send}
            {'>'}
          </button>
        </div>
      </div>
      <div className="contribute-overlay" onClick={handleCloseContribute}></div>
    </div>
  );
};

export default Contribute;
