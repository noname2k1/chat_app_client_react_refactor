import axios from 'axios';
import React from 'react';
import './TypeName.scss';
import { useDispatch } from 'react-redux';
import { authSlice } from '~/component/redux/slices';
import { useLanguageSelector } from '~/component/redux/selector';
import { updateProfile } from '~/services/profileService';
const TypeName = () => {
  const dispatch = useDispatch();
  const [name, setName] = React.useState('');
  const currentLanguage = useLanguageSelector().currentLanguage;
  React.useEffect(() => {
    const buttonNode = document.querySelector('.type-name__button');
    if (!name) {
      buttonNode.classList.add('disabled');
      buttonNode.disabled = true;
    } else {
      buttonNode.classList.remove('disabled');
      buttonNode.disabled = false;
    }
  }, [name]);
  const changeName = async (e) => {
    e.preventDefault();
    const data = await updateProfile({ name });
    // console.log(data);
    if (data.status === 'success') {
      alert(currentLanguage.changenamesuccess);
      dispatch(authSlice.actions.changeProfile(data.profile));
    }
  };
  return (
    <div className="type-name-container">
      <div className="type-name__wrapper">
        <label htmlFor="display-name">{currentLanguage.displayname}</label>
        <form className="type-name__form">
          <input
            type="text"
            name="name"
            id="display-name"
            required
            autoComplete="false"
            placeholder="your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="type-name__button" onClick={changeName}>
            {currentLanguage.ok}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TypeName;
