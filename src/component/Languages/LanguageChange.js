import { EN, VN } from '~/Languages';
import { languageSlice } from '~/component/redux/slices';
import { useDispatch } from 'react-redux';
import { useLanguageSelector } from '~/component/redux/selector';
const LanguageChange = (e) => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    const dispatch = useDispatch();
    const handleLanguageChange = (e) => {
        if (e.target.value === 'vn') {
            window.localStorage.setItem('language', JSON.stringify(VN));
            dispatch(
                languageSlice.actions.changeLanguage({
                    currentLanguage: VN,
                })
            );
        }
        if (e.target.value === 'en') {
            window.localStorage.setItem('language', JSON.stringify(EN));
            dispatch(
                languageSlice.actions.changeLanguage({
                    currentLanguage: EN,
                })
            );
        }
    };
    return (
        <select
            name=''
            id='language'
            onChange={handleLanguageChange}
            defaultValue={currentLanguage?.languageCode}
        >
            <option value='en'>{currentLanguage.english}</option>
            <option value='vn'>{currentLanguage.vietnamese}</option>
        </select>
    );
};

export default LanguageChange;
