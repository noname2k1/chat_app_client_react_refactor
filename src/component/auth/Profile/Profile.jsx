import React from 'react';
import axios from 'axios';
import moment from 'moment';
import './Profile.scss';
import clsx from 'clsx';
import { MdZoomOutMap, MdFemale, MdMale, MdPhoneEnabled } from 'react-icons/md';
import { RiEditBoxFill, RiMapPinLine } from 'react-icons/ri';
import { FaBirthdayCake } from 'react-icons/fa';
import { profileArray } from './profileArray';
import {
  useAuthSelector,
  useLanguageSelector,
} from '~/component/redux/selector';
import { useDispatch } from 'react-redux';
import { authSlice } from '~/component/redux/slices';
import { useParams } from 'react-router-dom';
import { uploadToCloudinary } from '~/tools/callApi';
import Loading from '~/component/custom/loading/Loading';
import { updateProfile } from '~/services/profileService';
import { getProfileByProfileid } from '~/services/profileService';

const Profile = () => {
  const itemsRef = React.useRef([]);
  const { profileid } = useParams();
  const dispatch = useDispatch();
  const currentLanguage = useLanguageSelector().currentLanguage;
  const profile = useAuthSelector().profile;
  const [otherProfile, setOtherProfile] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [preview, setPreview] = React.useState();
  const [selectedFile, setSelectedFile] = React.useState();
  const [imageZoom, setImageZoom] = React.useState({
    avatar: false,
    preview: false,
  });
  const [form, setForm] = React.useState(false);
  const handleSelectedFile = (e) => {
    if (
      !e.target.files ||
      e.target.files.length < 1 ||
      e.target.files[0].type.indexOf('image') === -1
    ) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };
  React.useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const preview = URL.createObjectURL(selectedFile);
    setPreview(preview);

    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [selectedFile]);
  const handleUpdateProfile = async () => {
    setIsLoading(true);
    const uploadForm = {
      name: itemsRef?.current[0]?.value || profile.name,
      dateofbirth: itemsRef?.current[1]?.value || profile.dateofbirth,
      gender: itemsRef?.current[2]?.value || profile.gender,
      address: itemsRef?.current[3]?.value || profile.address,
      phone: itemsRef?.current[4]?.value || profile.phone,
      avatarlink: profile.avatarlink,
    };
    if (selectedFile && preview) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'app_chat');
      const uploadAvatar = await uploadToCloudinary(formData, 'image');
      if (uploadAvatar) {
        uploadForm.avatarlink = uploadAvatar?.secure_url;
      }
    }
    const updatedProfile = await updateProfile(uploadForm);
    if (updatedProfile.status === 'success') {
      dispatch(authSlice.actions.changeProfile(updatedProfile.updatedProfile));
      setForm(false);
      setIsLoading(false);
    } else {
      console.log(updatedProfile.message);
    }
  };
  const handleChooseAvatar = () => {
    if (!otherProfile) {
      document.querySelector('input[type="file"].choose-avatar').click();
    }
  };
  React.useEffect(() => {
    if (!profileid) {
      setIsLoading(false);
      return setOtherProfile(undefined);
    }
    setIsLoading(true);
    const getProfile = async () => {
      try {
        const data = await getProfileByProfileid(profileid);
        if (data.status === 'success') {
          setOtherProfile(data.otherProfile);
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    getProfile();
  }, [profileid]);
  return (
    <div className="profile-container">
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          {/* Profile Header */}
          <div className="profile-header">
            <div
              className={clsx('profile-avatar-wrapper', {
                'zoom-out': imageZoom.avatar,
              })}
            >
              <div
                className="zoom"
                onClick={() =>
                  setImageZoom((prev) => ({
                    ...prev,
                    avatar: !prev.avatar,
                  }))
                }
              >
                <MdZoomOutMap size={imageZoom.avatar ? 50 : 30} />
              </div>
              <img
                className="profile-avatar"
                src={
                  otherProfile ? otherProfile.avatarlink : profile.avatarlink
                }
                alt="avatar"
                width="100%"
                height="100%"
                onClick={handleChooseAvatar}
                onLoad={() => setIsLoading(false)}
                style={{
                  cursor: otherProfile ? 'auto' : 'pointer',
                }}
              />
              {!otherProfile && (
                <input
                  type="file"
                  className="choose-avatar"
                  onChange={handleSelectedFile}
                  accept="image/*"
                />
              )}
              {!otherProfile && (
                <div className="avatar-edit" onClick={handleChooseAvatar}>
                  <RiEditBoxFill size={imageZoom.avatar ? 50 : 25} />
                </div>
              )}
            </div>
            {preview && (
              <>
                <span>Preview:</span>&nbsp;
                <div
                  className={clsx('profile-avatar-preview', {
                    'zoom-out': imageZoom.preview,
                  })}
                >
                  <div
                    className="zoom"
                    onClick={() =>
                      setImageZoom((prev) => ({
                        ...prev,
                        preview: !prev.preview,
                      }))
                    }
                  >
                    <MdZoomOutMap size={imageZoom.preview ? 50 : 30} />
                  </div>
                  <img src={preview} alt="avatar" width="100%" height="100%" />
                </div>
              </>
            )}
          </div>
          {/* Profile Body */}
          <div className={clsx('profile-body', { form })}>
            <div className="profile-body-details">
              <div className="profile-body-item profile-name">
                {otherProfile ? otherProfile.name : profile.name}
              </div>
              <div className="profile-body-item profile-date-of-birth">
                <FaBirthdayCake />
                &nbsp;
                {otherProfile
                  ? moment(otherProfile.dateofbirth).format('DD/MM/yyyy') ||
                    `[
                      ${currentLanguage.empty} ]`
                  : moment(profile.dateofbirth).format('DD/MM/yyyy') ||
                    `[
                        ${currentLanguage.empty} ]`}
              </div>
              <div className="profile-body-item profile-gender">
                {otherProfile ? (
                  otherProfile.gender === 'male' ? (
                    <MdMale color="#3AB0FF" />
                  ) : (
                    <MdFemale color="#FF06B7" />
                  )
                ) : profile.gender === 'male' ? (
                  <MdMale color="#3AB0FF" />
                ) : (
                  <MdFemale color="#FF06B7" />
                )}
                {otherProfile
                  ? otherProfile.gender === 'male'
                    ? currentLanguage.male
                    : currentLanguage.female
                  : profile.gender === 'male'
                  ? currentLanguage.male
                  : currentLanguage.female}
              </div>
              <div className="profile-body-item profile-address">
                <RiMapPinLine />
                &nbsp;
                {otherProfile
                  ? otherProfile.address || `[ ${currentLanguage.empty} ]`
                  : profile.address || `[ ${currentLanguage.empty} ]`}
              </div>
              <div className="profile-body-item profile-phone">
                <MdPhoneEnabled />
                &nbsp;
                {otherProfile
                  ? otherProfile.phone || `[ ${currentLanguage.empty} ]`
                  : profile.phone || `[ ${currentLanguage.empty} ]`}
              </div>
            </div>
            <div className="profile-body-form">
              {profileArray.map((item, index) => {
                if (item.type !== 'select') {
                  return (
                    <div
                      className={'profile-body-item profile-' + item.class}
                      key={item.id}
                    >
                      <label htmlFor={item.id}>
                        {currentLanguage.languageCode === 'en'
                          ? item.label
                          : item.labelvn}
                      </label>
                      <input
                        ref={(el) => (itemsRef.current[index] = el)}
                        id={item.id}
                        type={item.type}
                        name={item.name}
                        placeholder={
                          currentLanguage.languageCode === 'en'
                            ? item.label
                            : item.labelvn
                        }
                      />
                    </div>
                  );
                }

                return (
                  <div
                    className={'profile-body-item profile-' + item.class}
                    key={item.id}
                  >
                    <label htmlFor={item.id}>
                      {currentLanguage.languageCode === 'en'
                        ? item.label
                        : item.labelvn}
                    </label>
                    <select
                      id={item.id}
                      name={item.name}
                      ref={(el) => (itemsRef.current[index] = el)}
                    >
                      {item.options.map((option) => (
                        <option key={option} value={option}>
                          {option === 'male'
                            ? currentLanguage.male
                            : currentLanguage.female}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Profile Footer */}
          {!otherProfile && (
            <div className="profile-footer">
              {!form && !preview && (
                <div
                  className="profile-footer-item"
                  onClick={() => setForm(true)}
                >
                  [ {currentLanguage.update} ]
                </div>
              )}
              {(form || preview) && (
                <>
                  <div
                    className="profile-footer-item"
                    onClick={() => {
                      handleUpdateProfile();
                      setPreview(undefined);
                      setSelectedFile(undefined);
                    }}
                  >
                    [ {currentLanguage.apply} ]
                  </div>
                  <div
                    className="profile-footer-item"
                    onClick={() => {
                      setForm(false);
                      setPreview(undefined);
                      setSelectedFile(undefined);
                    }}
                  >
                    [ {currentLanguage.cancel} ]
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
